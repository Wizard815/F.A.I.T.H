import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import cookie from "@fastify/cookie";
import fstatic from "@fastify/static";
import { existsSync } from "node:fs";
import type { Config } from "./config.js";
import { openDb, type Db } from "./db.js";
import { Auth, AuthError } from "./auth/sessions.js";
import { Passkeys } from "./auth/passkeys.js";
import { Presence } from "./auth/presence.js";
import { Registry } from "./connectors/registry.js";
import { ToolError } from "./connectors/types.js";
import { Agent, type AgentEvent } from "./harness/agent.js";
import { ModelError, type Msg } from "./harness/llm.js";
import { dashboard, haSummary } from "./dashboard.js";
import { Approvals, ApprovalError } from "./approvals.js";
import { envValue } from "./config.js";
import { personById, type Caller } from "./scope.js";
import { Skills, SkillError } from "./skills.js";
import { Rewards, RewardsError } from "./rewards.js";
import { FaithTools } from "./connectors/faith.js";
import { Notifier } from "./notifier.js";
import { Routines, RoutineError } from "./routines.js";
import { Voices, VoiceError } from "./voice.js";
import { registerHaRoutes } from "./routes/ha.js";
import { registerAdminRoutes } from "./routes/admin.js";
import { Health } from "./health.js";
import { registerMcpRoutes } from "./routes/mcp.js";
import { registerOmiRoutes } from "./routes/omi.js";
import { registerBoardRoutes } from "./routes/board.js";
import { Board } from "./board/board.js";
import { BoardTools } from "./board/tools.js";
import { BoardError } from "./board/store.js";

const SESSION = "faith_session", DEVICE = "faith_device";

export type App = Awaited<ReturnType<typeof buildApp>>;

export async function buildApp(opts: { config: () => Config; dataFile: string; webDir?: string; env?: NodeJS.ProcessEnv; logger?: boolean; db?: Db }) {
  const cfg = opts.config, env = opts.env ?? process.env;
  const db = opts.db ?? openDb(opts.dataFile);
  const registry = new Registry(cfg, env);
  const presence = new Presence(cfg, registry.ha ? (id) => registry.ha!.state(id) : undefined);
  const auth = new Auth(db, cfg, presence);
  const passkeys = new Passkeys(db, cfg);
  const approvals = new Approvals(db, cfg, registry);
  const agent = new Agent(db, cfg, registry, env, approvals);
  const skills = new Skills(() => cfg().skills.dir, undefined, () => cfg().skills.packs);
  const rewards = new Rewards(db, cfg, Date.now, env);
  const faithTools = new FaithTools(cfg, skills, rewards);
  registry.add(faithTools);
  const voices = new Voices(db, cfg, env);
  const app = Fastify({ logger: opts.logger ?? false, trustProxy: true, bodyLimit: 12_000_000 }); // photos for the vision model
  await app.register(cookie);
  const notifier = new Notifier(cfg, registry.ha, app.log);
  // The inbox: what FAITH sends a person, kept for their FAITH apps to fetch (docs/clients.md).
  db.exec("CREATE TABLE IF NOT EXISTS inbox (id INTEGER PRIMARY KEY AUTOINCREMENT, person_id TEXT NOT NULL, at INTEGER NOT NULL, kind TEXT NOT NULL, title TEXT NOT NULL, text TEXT NOT NULL, ref TEXT)");
  notifier.inbox = (personId, i) => {
    db.prepare("INSERT INTO inbox (person_id, at, kind, title, text, ref) VALUES (?, ?, ?, ?, ?, ?)").run(personId, Date.now(), i.kind, i.title.slice(0, 200), i.text.slice(0, 4000), i.ref ?? null);
    db.prepare("DELETE FROM inbox WHERE person_id = ? AND at < ?").run(personId, Date.now() - 30 * 86400_000);
  };
  const health = new Health(cfg, registry, notifier, env);
  notifier.presence = presence;
  agent.homeLine = () => presence.homeLine();
  faithTools.approvals = approvals; faithTools.notifier = notifier;
  approvals.on((e) => { notifier.onApproval(e).catch((err) => app.log.warn({ err: err.message }, "approval push failed")); });
  const routines = new Routines(db, cfg, agent, skills, notifier, app.log);
  // The info board (Pondering Orb's Main and Daily pages), with its tools for FAITH's agent.
  const board = new Board(db, cfg, registry, agent, { approvals, notifier, health, log: app.log });
  registry.add(new BoardTools(board));
  // Audio for speech-to-text arrives as raw bytes.
  app.addContentTypeParser(/^audio\/|^application\/octet-stream/, { parseAs: "buffer", bodyLimit: 15_000_000 }, (_req, body, done) => done(null, body));

  const secure = () => cfg().public_url.startsWith("https://");
  // Inside Home Assistant's sidebar FAITH is a frame; on another site that needs SameSite=None (https only).
  const sameSite = () => (cfg().embed.cookie_samesite === "none" && secure() ? "none" : cfg().embed.cookie_samesite === "lax" ? "lax" : "strict");
  const setCookie = (reply: FastifyReply, name: string, value: string, days: number) =>
    reply.setCookie(name, value, { path: "/", httpOnly: true, sameSite: sameSite(), secure: secure(), maxAge: days * 86400 });
  app.addHook("onSend", async (_req, reply) => {
    const from = cfg().embed.allow_from;
    reply.header("Content-Security-Policy", `frame-ancestors 'self'${from.length ? " " + from.join(" ") : ""}`);
    reply.header("X-Content-Type-Options", "nosniff");
  });

  app.setErrorHandler((err: any, _req, reply) => {
    const status = err instanceof AuthError || err instanceof ModelError || err instanceof ApprovalError || err instanceof RewardsError || err instanceof RoutineError || err instanceof VoiceError || err instanceof BoardError ? err.status : err instanceof SkillError ? 400 : err instanceof ToolError ? 502 : err.statusCode && err.statusCode < 500 ? err.statusCode : 500;
    if (status >= 500) app.log.error(err);
    reply.status(status).send({ error: status === 500 ? "Something went wrong on FAITH's side." : err.message });
  });

  // ---------- who is asking ----------
  const bearer = (req: FastifyRequest) => { const h = String(req.headers.authorization || ""); return /^Bearer\s+/i.test(h) ? h.replace(/^Bearer\s+/i, "").trim() : undefined; };
  const caller = (req: FastifyRequest) => auth.resolve({ sessionToken: req.cookies[SESSION], deviceToken: req.cookies[DEVICE], bearer: bearer(req) });
  const need = (req: FastifyRequest) => {
    const c = caller(req);
    if (!c) throw new AuthError(401, "Sign in first, or pair this screen.");
    return c;
  };
  const needPerson = (req: FastifyRequest) => {
    const c = need(req);
    if (c.scope.kind !== "person" || (c.channel !== "hub" && c.channel !== "personal")) throw new AuthError(401, "Sign in first.");
    return c as Caller & { scope: { kind: "person"; person: Config["people"][number] } };
  };
  const needAdmin = (req: FastifyRequest) => {
    const c = needPerson(req);
    if (c.scope.person.role !== "admin") throw new AuthError(403, "Only an admin can do that.");
    return c;
  };
  const person = (id: unknown) => {
    const p = personById(cfg(), String(id || ""));
    if (!p) throw new AuthError(404, "No one by that name here.");
    return p;
  };
  const origin = (req: FastifyRequest) => (req.headers.origin as string | undefined) || `${req.protocol}://${req.headers.host}`;

  // ---------- state for the screen ----------
  app.get("/api/health", async () => ({ ok: true, name: cfg().name }));

  app.get("/api/session", async (req) => {
    const c = caller(req);
    const device = c?.deviceId ? { id: c.deviceId, name: cfg().hub.devices.find((d) => d.id === c.deviceId)?.name || c.deviceId } : null;
    const p = c?.scope.kind === "person" && (c.channel === "hub" || c.channel === "personal") ? c.scope.person : null;
    const dev = cfg().hub.devices.find((d) => d.id === device?.id);
    return {
      name: cfg().name, device,
      person: p ? { id: p.id, name: p.name, role: p.role, color: p.color } : null,
      household: !!device && !p,
      remaining_seconds: p && c?.session ? auth.remaining(c.session) : null,
      suggested: device ? presence.face(device.id) ?? null : null,
      face_unlock: !!dev?.face_unlock,
      presence: device && dev?.presence_entity ? presence.state(device.id)?.present ?? null : null,
      passkeys_possible: (() => { try { passkeys.rp(origin(req)); return true; } catch { return false; } })(),
      can_approve: !!c && approvals.canApprove(c),
      pending_approvals: c ? approvals.pendingCount() : 0,
      voice: { speak_replies: cfg().voice.speak_replies },
    };
  });

  app.get("/api/people", async (req) => {
    const c = caller(req);
    if (!c && !cfg().hub.show_people_to_unpaired) throw new AuthError(401, "Pair this screen to see the family.");
    const onHub = !!c?.deviceId;
    return cfg().people.map((p) => {
      const m = auth.methods(p.id);
      return { id: p.id, name: p.name, role: p.role, color: p.color, methods: { pin: m.pin && (onHub || cfg().hub.pin_on_personal_devices), password: m.password, passkey: m.passkey } };
    });
  });

  // ---------- pairing a screen ----------
  let pairFails: number[] = [];
  app.post("/api/pair", async (req, reply) => {
    pairFails = pairFails.filter((t) => Date.now() - t < 10 * 60_000);
    if (pairFails.length >= 10) throw new AuthError(429, "Too many wrong pairing codes. Wait ten minutes.");
    try {
      const { token, device } = auth.pair(String((req.body as any)?.code || ""));
      setCookie(reply, DEVICE, token, 400);
      reply.clearCookie(SESSION, { path: "/" });
      return { ok: true, device };
    } catch (e) { pairFails.push(Date.now()); throw e; }
  });
  app.post("/api/admin/pair-code", async (req) => {
    needAdmin(req);
    const device = String((req.body as any)?.device || "").trim();
    if (!device) throw new AuthError(400, "Which screen? Give a device id from hub.devices.");
    return { code: auth.pairCode(device), expires_in: 600 };
  });
  app.get("/api/admin/devices", async (req) => { needAdmin(req); return auth.devices(); });
  app.delete("/api/admin/devices/:id", async (req) => { needAdmin(req); auth.unpair((req.params as any).id); return { ok: true }; });

  // ---------- signing in and out ----------
  const signIn = (req: FastifyRequest, reply: FastifyReply, p: Config["people"][number]) => {
    const c = caller(req);
    const deviceId = c?.deviceId;
    const token = auth.startSession(p, deviceId);
    setCookie(reply, SESSION, token, deviceId ? 1 : cfg().personal.max_days);
    app.log.info({ person: p.id, device: deviceId ?? "personal" }, "signed in");
    return { ok: true, person: { id: p.id, name: p.name, role: p.role, color: p.color } };
  };
  app.post("/api/auth/pin", async (req, reply) => {
    const b = req.body as any, p = person(b?.person), c = caller(req);
    if (!c?.deviceId && !cfg().hub.pin_on_personal_devices) throw new AuthError(403, "PINs only work on the family's paired screens. Use your password or Face ID.");
    auth.check(p, "pin", String(b?.pin ?? ""));
    return signIn(req, reply, p);
  });
  app.post("/api/auth/password", async (req, reply) => {
    const b = req.body as any, p = person(b?.person);
    auth.check(p, "password", String(b?.password ?? ""));
    return signIn(req, reply, p);
  });
  app.post("/api/auth/face", async (req, reply) => {
    const b = req.body as any, p = person(b?.person), c = caller(req);
    const dev = cfg().hub.devices.find((d) => d.id === c?.deviceId);
    if (!dev?.face_unlock) throw new AuthError(403, "Face sign-in isn't turned on for this screen.");
    if (presence.face(dev.id) !== p.id) throw new AuthError(401, "The camera doesn't see them right now.");
    return signIn(req, reply, p);
  });
  app.post("/api/auth/passkey/start", async (req) => passkeys.authStart(person((req.body as any)?.person), origin(req)));
  app.post("/api/auth/passkey/finish", async (req, reply) => {
    const b = req.body as any, p = person(b?.person);
    await passkeys.authFinish(p, b?.response, origin(req));
    return signIn(req, reply, p);
  });
  // A FAITH app (Android, desktop) signs in once with a password and keeps a client token:
  // that person's own screen, until they remove it (Settings, or faith token revoke).
  app.post("/api/auth/client", async (req) => {
    const b = req.body as any, p = person(b?.person);
    auth.check(p, "password", String(b?.password ?? ""));
    const label = String(b?.name || "app").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24) || "app";
    const name = `${p.id}-${label}-${Math.random().toString(36).slice(2, 6)}`;
    const token = auth.addToken("client", name, p.id);
    app.log.info({ person: p.id, client: name }, "app signed in");
    return { token, name, person: { id: p.id, name: p.name, role: p.role, color: p.color } };
  });
  app.get("/api/me/clients", async (req) => {
    const c = needPerson(req);
    return auth.tokens().filter((t) => t.kind === "client" && t.person_id === c.scope.person.id).map((t) => ({ name: t.name, created_at: t.created_at, last_used: t.last_used, this_one: c.deviceId === `client:${t.name}` }));
  });
  app.delete("/api/me/clients/:name", async (req) => {
    const c = needPerson(req), name = String((req.params as any).name);
    if (!auth.tokens().some((t) => t.kind === "client" && t.person_id === c.scope.person.id && t.name === name)) throw new AuthError(404, "No such app of yours.");
    return { ok: auth.revokeToken(name) };
  });

  // What FAITH sent this person (late answers, doorbell, approvals to decide), for their apps.
  // ?after=<last id seen>&wait=<seconds, up to 30>: waits for something new (long poll).
  app.get("/api/inbox", async (req) => {
    const c = needPerson(req), q = req.query as any;
    const after = Number(q?.after) || 0, wait = Math.min(30, Math.max(0, Number(q?.wait) || 0)) * 1000, until = Date.now() + wait;
    const read = () => db.prepare("SELECT id, at, kind, title, text, ref FROM inbox WHERE person_id = ? AND id > ? ORDER BY id LIMIT 50").all(c.scope.person.id, after) as any[];
    let items = read();
    while (!items.length && Date.now() < until && !req.raw.destroyed) { await new Promise((r) => setTimeout(r, 1000)); items = read(); }
    return { items, last: items.length ? items.at(-1).id : after };
  });

  app.post("/api/auth/logout", async (req, reply) => {
    auth.endSession(req.cookies[SESSION]);
    reply.clearCookie(SESSION, { path: "/" });
    return { ok: true };
  });
  app.post("/api/activity", async (req) => { const c = caller(req); auth.touch(c?.sessionHash); return { ok: true }; });

  // ---------- a person's own settings ----------
  app.get("/api/me", async (req) => { const c = needPerson(req); return { ...c.scope.person, methods: auth.methods(c.scope.person.id), passkeys: passkeys.list(c.scope.person.id) }; });
  app.put("/api/me/pin", async (req) => {
    const c = needPerson(req), b = req.body as any;
    if (auth.methods(c.scope.person.id).pin) auth.check(c.scope.person, "pin", String(b?.current ?? ""));
    auth.setPin(c.scope.person.id, String(b?.pin ?? "")); return { ok: true };
  });
  app.put("/api/me/password", async (req) => {
    const c = needPerson(req), b = req.body as any;
    if (auth.methods(c.scope.person.id).password) auth.check(c.scope.person, "password", String(b?.current ?? ""));
    auth.setPassword(c.scope.person.id, String(b?.password ?? "")); return { ok: true };
  });
  app.post("/api/me/passkeys/start", async (req) => passkeys.registerStart(needPerson(req).scope.person, origin(req)));
  app.post("/api/me/passkeys/finish", async (req) => { const c = needPerson(req), b = req.body as any; return passkeys.registerFinish(c.scope.person, b?.response, String(b?.label || ""), origin(req)); });
  app.delete("/api/me/passkeys/:id", async (req) => ({ ok: passkeys.remove(needPerson(req).scope.person.id, (req.params as any).id) }));

  // ---------- the home screen ----------
  app.get("/api/dashboard", async (req) => dashboard(cfg(), registry, need(req), { approvals }));

  // The family homepage: the apps this viewer may open.
  app.get("/api/apps", async (req) => {
    const c = need(req), role = c.scope.kind === "person" ? c.scope.person.role : "household";
    return cfg().apps.filter((a) => (a.who === "anyone" || c.scope.kind === "person")
      && (!a.roles || a.roles.includes(role))
      && (!a.people || (c.scope.kind === "person" && a.people.includes(c.scope.person.id))))
      .map(({ id, name, url, icon }) => ({ id, name, url, icon }));
  });

  // ---------- approvals: changes asked for from the shared view ----------
  app.get("/api/approvals", async (req) => { const c = need(req); return { can_approve: approvals.canApprove(c), requests: approvals.list() }; });
  app.post("/api/approvals/:id", async (req) => {
    const c = need(req);
    auth.touch(c.sessionHash);
    const r = await approvals.decide(c, (req.params as any).id, !!(req.body as any)?.approve);
    app.log.info({ by: c.label, id: (req.params as any).id, status: r.status }, "approval");
    return r;
  });

  // ---------- voice: speech in and out through Argos ----------
  const modelKey = () => envValue(cfg().model.api_key_env, env);
  app.post("/api/voice/transcribe", async (req) => {
    need(req);
    const buf = req.body as Buffer;
    if (!Buffer.isBuffer(buf) || !buf.length) throw new AuthError(400, "Send the recording as audio/* bytes.");
    const type = String(req.headers["content-type"] || "audio/webm").split(";")[0];
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buf)], { type }), `speech.${type.split("/")[1] || "webm"}`);
    form.append("model", cfg().voice.stt_model);
    let r: Response;
    try { r = await fetch(`${cfg().model.base_url}/audio/transcriptions`, { method: "POST", body: form, headers: modelKey() ? { Authorization: `Bearer ${modelKey()}` } : {}, signal: AbortSignal.timeout(120_000) }); }
    catch (e: any) { throw new ModelError(502, `Couldn't reach speech-to-text (${e?.cause?.code || e?.message}).`); }
    const d: any = await r.json().catch(() => ({}));
    if (!r.ok) throw new ModelError(502, `Speech-to-text answered ${r.status}: ${d?.error?.message || d?.error || ""}`);
    return { text: String(d.text || "").trim() };
  });
  app.post("/api/voice/speak", async (req, reply) => {
    need(req);
    const text = String((req.body as any)?.text || "").slice(0, 4000);
    if (!text.trim()) throw new AuthError(400, "Nothing to say.");
    let r: Response;
    try {
      r = await fetch(`${cfg().model.base_url}/audio/speech`, { method: "POST", signal: AbortSignal.timeout(120_000),
        headers: { "Content-Type": "application/json", ...(modelKey() ? { Authorization: `Bearer ${modelKey()}` } : {}) },
        body: JSON.stringify({ model: cfg().voice.tts_model, input: text, ...(cfg().voice.tts_voice ? { voice: cfg().voice.tts_voice } : {}), response_format: "mp3" }) });
    } catch (e: any) { throw new ModelError(502, `Couldn't reach text-to-speech (${e?.cause?.code || e?.message}).`); }
    if (!r.ok) throw new ModelError(502, `Text-to-speech answered ${r.status}: ${(await r.text()).slice(0, 200)}`);
    reply.header("Content-Type", r.headers.get("content-type") || "audio/mpeg");
    return reply.send(Buffer.from(await r.arrayBuffer()));
  });

  // ---------- chat on the screen (server-sent events) ----------
  // A photo a tool showed (Immich), with the asker's own key: the apps draw these.
  app.get("/api/photos/:source/:id", async (req, reply) => {
    const c = need(req), p = req.params as any;
    const pic = await agent.photo(c, String(p.source), String(p.id));
    reply.header("Content-Type", pic.mime).header("Cache-Control", "private, max-age=3600");
    return reply.send(pic.bytes);
  });
  app.get("/api/chat/latest", async (req) => {
    const c = need(req), id = agent.latest(c);
    return { conversation_id: id ?? null, messages: id ? agent.messages(c, id).slice(-30) : [] };
  });
  app.post("/api/chat", async (req, reply) => {
    const c = need(req), b = req.body as any;
    auth.touch(c.sessionHash);
    const ctl = new AbortController();
    reply.hijack();
    reply.raw.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive", "X-Accel-Buffering": "no" });
    const send = (e: AgentEvent | { type: "done"; text: string } | { type: "error"; message: string }) => { if (!reply.raw.writableEnded) reply.raw.write(`data: ${JSON.stringify(e)}\n\n`); };
    reply.raw.on("close", () => ctl.abort());
    try {
      const images = Array.isArray(b?.images) ? b.images.map(String) : undefined;
      const r = await agent.turn({ caller: c, text: String(b?.text || ""), images, conversationId: b?.conversation_id || undefined, onEvent: send, signal: ctl.signal });
      send({ type: "done", text: r.text });
    } catch (e: any) {
      if (!(e instanceof ModelError || e instanceof ToolError)) app.log.error(e);
      send({ type: "error", message: e instanceof ModelError || e instanceof ToolError ? e.message : "Something went wrong on FAITH's side." });
    }
    reply.raw.end();
  });
  app.post("/api/chat/confirm/:id", async (req) => {
    const c = need(req);
    if (c.channel !== "hub" && c.channel !== "personal") throw new AuthError(403, "Confirm on a FAITH screen.");
    auth.touch(c.sessionHash);
    return agent.confirm(c, (req.params as any).id, !!(req.body as any)?.approve);
  });

  // ---------- OpenAI-compatible: other apps use FAITH like a model ----------
  const apiCaller = (req: FastifyRequest) => {
    const c = bearer(req) ? caller(req) : null;
    if (!c) throw new AuthError(401, "Send Authorization: Bearer <a FAITH token> (make one with `faith token add`).");
    return c;
  };
  const textOf = (content: unknown) => (typeof content === "string" ? content : Array.isArray(content) ? content.map((p: any) => (p?.type === "text" ? p.text : "")).join("") : "");
  app.get("/v1/models", async (req) => { apiCaller(req); return { object: "list", data: [{ id: "faith", object: "model", created: 0, owned_by: "faith" }] }; });
  app.post("/v1/chat/completions", async (req, reply) => {
    const c = apiCaller(req), b = req.body as any;
    const msgs: any[] = Array.isArray(b?.messages) ? b.messages : [];
    const lastUser = [...msgs].reverse().findIndex((m) => m?.role === "user");
    if (lastUser < 0) throw new AuthError(400, "messages needs a user message.");
    const idx = msgs.length - 1 - lastUser;
    const extra = msgs.filter((m) => m?.role === "system").map((m) => textOf(m.content)).join("\n").slice(0, 4000) || undefined;
    const history: Msg[] = msgs.slice(0, idx).filter((m) => m?.role === "user" || m?.role === "assistant").map((m) => ({ role: m.role, content: textOf(m.content) })).slice(-cfg().model.history_messages);
    const id = `chatcmpl-${Date.now().toString(36)}`, created = Math.floor(Date.now() / 1000);
    const chunk = (delta: Record<string, unknown>, finish: string | null) => `data: ${JSON.stringify({ id, object: "chat.completion.chunk", created, model: "faith", choices: [{ index: 0, delta, finish_reason: finish }] })}\n\n`;
    if (b?.stream) {
      const ctl = new AbortController();
      reply.hijack();
      reply.raw.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" });
      reply.raw.on("close", () => ctl.abort());
      reply.raw.write(chunk({ role: "assistant" }, null));
      try {
        await agent.turn({ caller: c, text: textOf(msgs[idx].content), history, extraSystem: extra, signal: ctl.signal,
          onEvent: (e) => { if (e.type === "text") reply.raw.write(chunk({ content: e.delta }, null)); } });
        reply.raw.write(chunk({}, "stop"));
      } catch (e: any) { reply.raw.write(`data: ${JSON.stringify({ error: { message: e.message } })}\n\n`); }
      reply.raw.write("data: [DONE]\n\n"); reply.raw.end();
      return;
    }
    const r = await agent.turn({ caller: c, text: textOf(msgs[idx].content), history, extraSystem: extra });
    return { id, object: "chat.completion", created, model: "faith", choices: [{ index: 0, message: { role: "assistant", content: r.text }, finish_reason: "stop" }], usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 } };
  });

  // ---------- Home Assistant (the custom integration in ha/custom_components/faith) ----------
  /** HA's caller: household, or the mapped person when the request comes from a known HA user. */
  const haCaller = (req: FastifyRequest, haUser?: string): Caller => {
    const c = apiCaller(req) as Caller & { apiKind?: string };
    if ((c as any).apiKind !== "ha") throw new AuthError(403, "Use a Home Assistant token (`faith token add ha <name>`).");
    const ha = cfg().connectors.find((x) => x.type === "homeassistant");
    const p = haUser && (ha as any)?.trust_ha_users !== false ? cfg().people.find((x) => x.ha_user_id === haUser) : undefined;
    return p ? { ...c, scope: { kind: "person", person: p }, label: `${p.id} via HA` } : { ...c, label: "someone talking to Home Assistant" };
  };
  app.post("/api/ha/conversation", async (req) => {
    const b = req.body as any;
    let c = haCaller(req, b?.user_id ? String(b.user_id) : undefined);
    // HA's device id of the satellite or phone: Assist then knows its room, and timers work.
    if (b?.device_id && /^[A-Za-z0-9_]{1,64}$/.test(String(b.device_id))) c = { ...c, haDevice: String(b.device_id) };
    // Said to a voice satellite: FAITH's own speech-to-text (wyoming.ts) may have heard who it was.
    // Only for a voice pipeline (a satellite or device, no HA user): typed Assist never borrows a voice.
    const fromVoice = !b?.user_id && !!(b?.satellite_id || b?.device_id);
    // A screen's camera next to the satellite (hub.devices[].satellites) checks the voice against the face it sees.
    const near = fromVoice ? cfg().hub.devices.find((d) => d.satellites.some((x) => x === b?.device_id || x === b?.satellite_id)) : undefined;
    const heard = c.scope.kind === "household" && fromVoice ? voices.recall(String(b?.text || ""), near?.face_entity ? presence.face(near.id) : undefined) : {};
    const m = heard.match;
    const speaker = m?.person;
    if (m?.how === "both" && near?.voice_and_face) c = { ...c, scope: { kind: "person", person: m.person }, byVoiceAndFace: true, label: `${m.person.id} (voice and face) via HA` };
    else if (speaker && cfg().voice_id?.trust_for_changes !== false) c = { ...c, speaker, audience: "family", label: `${speaker.id} (voice${m!.how === "voice" ? "" : " and face"}) via HA` };
    // Which room the satellite (or device) is in: "the lights" means that room.
    const room = await registry.ha?.roomOf(b?.satellite_id, b?.device_id);
    const extra = [
      room ? `They're talking to a voice satellite in the ${room}. "The lights", "it's cold in here" and other requests without a room mean the ${room}.` : "",
      b?.language && !String(b.language).startsWith("en") ? `Answer in the language with code ${b.language}.` : "",
    ].filter(Boolean).join("\n") || undefined;
    // A bigger job ("plan the week's dinners") says so, and its answer goes to the person's chat and phone.
    const asker = c.scope.kind === "person" ? c.scope.person : c.speaker;
    // Each voice on a satellite has its own conversation: Robin's question doesn't land in the middle of Sam's.
    const opts = { caller: c, text: String(b?.text || ""), extId: b?.conversation_id ? `ha:${b.conversation_id}${speaker ? `:${speaker.id}` : ""}` : undefined, extraSystem: extra };
    const r = asker ? await agent.turnOrLater(opts, cfg().voice.answer_within_s * 1000, (late) => agent.deliverLate(asker, late)) : await agent.turn(opts);
    return { speech: r.text, conversation_id: r.conversationId, person: c.scope.kind === "person" ? c.scope.person.id : null, speaker: speaker?.id ?? null, room: room ?? null };
  });
  app.get("/api/ha/summary", async (req) => {
    const c = haCaller(req);
    const s = await haSummary(cfg(), registry, c);
    const hubs = cfg().hub.devices.map((d) => {
      const row = db.prepare("SELECT person_id FROM sessions WHERE device_id = ? AND kind = 'hub'").get(d.id) as any;
      return { device: d.id, signed_in: row ? personById(cfg(), row.person_id)?.name ?? null : null };
    });
    // Which integrations are down (names only: nothing private).
    const checked = health.list().filter((x) => x.ok !== null);
    return { ...s, hubs, pending_approvals: approvals.pendingCount(), integrations: { checked: checked.length, down: health.down().map((x) => x.label) } };
  });

  const ctx = { cfg, db, env, auth, agent, approvals, registry, rewards, voices, presence, notifier, routines, skills, passkeys, apiCaller, needAdmin, person, health };
  registerHaRoutes(app, ctx);
  registerAdminRoutes(app, ctx);
  registerMcpRoutes(app, { agent, registry, apiCaller, name: () => cfg().name });
  const omi = registerOmiRoutes(app, { cfg, db, auth, notifier });
  registerBoardRoutes(app, { cfg, env, board, agent, registry, need, needPerson });

  // ---------- the web app ----------
  if (opts.webDir && existsSync(opts.webDir)) {
    await app.register(fstatic, { root: opts.webDir, prefix: "/" });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith("/api/") || req.url.startsWith("/v1/")) return reply.status(404).send({ error: "Not found." });
      return reply.sendFile("index.html");
    });
  }

  // Lock screens on time even when nobody polls.
  const sweeper = setInterval(() => { for (const d of auth.sweep()) app.log.info({ device: d }, "signed out (idle or nobody there)"); }, 5000);
  sweeper.unref();
  app.addHook("onClose", async () => { clearInterval(sweeper); presence.stop(); routines.stop(); board.stop(); });

  return { app, auth, passkeys, presence, registry, agent, approvals, db, rewards, routines, skills, voices, notifier, faithTools, health, omi, board };
}
