import type { FastifyInstance, FastifyRequest } from "fastify";
import type { Config, Person } from "../config.js";
import type { Db } from "../db.js";
import type { Auth } from "../auth/sessions.js";
import { AuthError } from "../auth/sessions.js";
import type { Presence } from "../auth/presence.js";
import type { Agent, AgentEvent } from "../harness/agent.js";
import type { Approvals } from "../approvals.js";
import type { Registry } from "../connectors/registry.js";
import type { Rewards } from "../rewards.js";
import type { Decision, Voices } from "../voice.js";
import { envValue } from "../config.js";
import { dashboard } from "../dashboard.js";
import { ModelError } from "../harness/llm.js";
import { speakable, synthesize, transcribe } from "../speech.js";
import { MediaError, photo, video } from "../media.js";
import type { Caller } from "../scope.js";

export type HaCtx = {
  cfg: () => Config; db: Db; env: NodeJS.ProcessEnv; auth: Auth; agent: Agent; approvals: Approvals; registry: Registry; rewards: Rewards;
  voices: Voices; presence: Presence; apiCaller: (req: FastifyRequest) => Caller & { apiKind?: string };
};

const SCREEN = /^[a-z0-9][a-z0-9_-]{0,31}$/;

/** The API the Home Assistant integration (and its cards) use. Every call
 *  carries the HA user who is looking (from HA's own login), and optionally a
 *  screen id and that screen's sign-in, for shared wall tablets. FAITH decides
 *  the view: a person signed in on that screen, else a person mapped to the
 *  HA user, else the household. HA never sees a person's private data unless
 *  that person is the one looking. */
export function registerHaRoutes(app: FastifyInstance, x: HaCtx) {
  const { cfg, auth, agent, approvals, rewards, voices, presence } = x;

  type Who = { caller: Caller; user?: string; screen?: string; asked?: string; hub?: { person: Person; remaining: number }; shared: boolean };
  const who = (req: FastifyRequest): Who => {
    const base = x.apiCaller(req);
    if (base.apiKind !== "ha") throw new AuthError(403, "Use a Home Assistant token (`faith token add ha <name>`).");
    const b: any = req.body || {};
    const user = b.user_id ? String(b.user_id) : undefined;
    const asked = b.screen && SCREEN.test(String(b.screen)) ? String(b.screen) : undefined;
    // A screen only counts once this tablet is paired (faith pair <screen>, typed into the card):
    // otherwise any HA account on any device could claim to be the kitchen tablet.
    const screen = asked && auth.device(b.device_token ? String(b.device_token) : undefined)?.id === asked ? asked : undefined;
    const ha = cfg().connectors.find((c) => c.type === "homeassistant") as any;
    const mapped = user && ha?.trust_ha_users !== false ? cfg().people.find((p) => p.ha_user_id === user) : undefined;
    if (screen && !mapped) {
      const h = auth.haHub(b.hub_session ? String(b.hub_session) : undefined, screen);
      if (h) return { caller: { scope: { kind: "person", person: h.person }, channel: "ha", deviceId: `ha:${screen}`, sessionHash: h.hash, label: `${h.person.id} on ${screen}` }, user, screen, asked, hub: { person: h.person, remaining: auth.remaining(h.row) }, shared: true };
    }
    if (mapped) return { caller: { scope: { kind: "person", person: mapped }, channel: "ha", deviceId: "ha", label: `${mapped.id} in HA` }, user, screen, asked, shared: false };
    return { caller: { scope: { kind: "household" }, channel: "ha", deviceId: `ha:${screen || "default"}`, label: `household on ${screen || "HA"}` }, user, screen, asked, shared: true };
  };
  const pub = (p: Person) => ({ id: p.id, name: p.name, role: p.role, color: p.color });

  // Each person's own arrangement of the day card (order and hidden sections), saved in FAITH.
  x.db.exec("CREATE TABLE IF NOT EXISTS person_prefs (person_id TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY (person_id, key))");
  const layoutOf = (id: string): { order: string[]; hidden: string[] } | undefined => {
    const r = x.db.prepare("SELECT value FROM person_prefs WHERE person_id = ? AND key = 'cards'").get(id) as any;
    try { return r ? JSON.parse(r.value) : undefined; } catch { return undefined; }
  };

  // ---- the dashboard cards ----
  app.post("/api/ha/view", async (req) => {
    const w = who(req), c = w.caller, b: any = req.body || {};
    const p = c.scope.kind === "person" ? c.scope.person : undefined;
    let { cards } = await dashboard(cfg(), x.registry, c, { approvals });
    const available = cards.map((k) => ({ id: k.id, title: k.title }));
    // The card's own list (set by whoever made the dashboard) wins; then the person's arrangement; then faith.yaml.
    const fixed = Array.isArray(b.cards) && b.cards.length ? (b.cards.map(String) as string[]) : undefined;
    const mine = !fixed && p ? layoutOf(p.id) : undefined;
    const order = fixed ?? (mine ? [...mine.order, ...cards.map((k) => k.id).filter((id) => !mine.order.includes(id))] : p?.cards);
    if (order) cards = order.map((id) => cards.find((k) => k.id === id)).filter(Boolean) as typeof cards;
    if (mine) cards = cards.filter((k) => !mine.hidden.includes(k.id));
    const role = p?.role ?? "household";
    const apps = cfg().apps.filter((a) => (a.who === "anyone" || p) && (!a.roles || a.roles.includes(role)) && (!a.people || (p && a.people.includes(p.id)))).map(({ id, name, url, icon }) => ({ id, name, url, icon }));
    return {
      name: cfg().name, person: p ? pub(p) : null, household: !p, screen: w.screen ?? null,
      hub: w.hub ? { person: pub(w.hub.person), remaining_seconds: w.hub.remaining } : null,
      can_sign_in: !!w.screen && w.shared && !w.hub && cfg().people.length > 0,
      pair_needed: !!w.asked && !w.screen && w.shared,
      can_approve: approvals.canApprove(c), pending_approvals: approvals.pendingCount(),
      cards, apps, home: presence.whoIsHome().home.map(pub),
      layout: { can_arrange: !!p && !fixed, available, order: cards.map((k) => k.id), hidden: mine?.hidden ?? [], saved: !!mine },
    };
  });
  app.post("/api/ha/prefs/cards", async (req) => {
    const c = who(req).caller, b: any = req.body || {};
    if (c.scope.kind !== "person") throw new AuthError(403, "Sign in to arrange your own cards.");
    const id = c.scope.person.id;
    if (b.reset) { x.db.prepare("DELETE FROM person_prefs WHERE person_id = ? AND key = 'cards'").run(id); return { ok: true }; }
    const known = new Set(cfg().dashboard.cards.map((k) => k.id));
    const clean = (v: unknown) => (Array.isArray(v) ? [...new Set(v.map(String).filter((k) => known.has(k)))] : []);
    const layout = { order: clean(b.order), hidden: clean(b.hidden) };
    x.db.prepare("INSERT OR REPLACE INTO person_prefs (person_id, key, value) VALUES (?, 'cards', ?)").run(id, JSON.stringify(layout));
    return { ok: true, ...layout };
  });

  // ---- chat (text, or a recording the card made) ----
  // A phone video is big: up to about 30 MB once it's base64.
  app.post("/api/ha/chat", { bodyLimit: 40_000_000 }, async (req) => {
    const w = who(req), b: any = req.body || {};
    let caller = w.caller, text = String(b.text || "").trim(), heard: string | undefined, speaker: Person | undefined;
    if (b.audio) {
      const audio = Buffer.from(String(b.audio), "base64"), mime = String(b.mime || "audio/webm");
      heard = await transcribe(x.cfg(), x.env, audio, mime); text = heard;
      // On a shared screen, a known voice says who's talking, checked against the face its camera sees.
      if ((caller.scope.kind === "household" || w.hub) && voices.enabled()) {
        const dev = w.screen ? cfg().hub.devices.find((d) => d.id === w.screen) : undefined;
        const d = await voices.identifyAt(audio, mime, dev?.face_entity ? presence.face(dev.id) : undefined).catch(() => ({}) as Decision);
        const m = d.match;
        if (caller.scope.kind === "household") {
          // Voice and face agree on a screen that allows it: that person's own view, for this question only.
          if (m?.how === "both" && dev?.voice_and_face) {
            speaker = m.person;
            caller = { scope: { kind: "person", person: m.person }, channel: "ha", deviceId: `ha:${w.screen}`, byVoiceAndFace: true, label: `${m.person.id} (voice and face) on ${w.screen}` };
          } else if (m) { speaker = m.person; if (cfg().voice_id?.trust_for_changes !== false) caller = { ...caller, speaker: m.person, audience: "family", label: `${m.person.id} (voice${m.how === "voice" ? "" : " and face"}) on ${w.screen || "HA"}` }; }
        }
        // Signed in as Sam, but that's Robin talking (or the camera and the voice disagree): the family's view, never Sam's things.
        else if (w.hub && (d.conflict || (m && m.person.id !== w.hub.person.id))) {
          speaker = d.conflict ? undefined : m!.person;
          caller = { scope: { kind: "household" }, channel: "ha", deviceId: caller.deviceId, ...(speaker ? { speaker } : {}), audience: "family",
            label: d.conflict ? `someone on ${w.screen} (voice and face disagree) while ${w.hub.person.id} is signed in` : `${speaker!.id} (voice) on ${w.screen} while ${w.hub.person.id} is signed in` };
        }
      }
    }
    // Photos (the card already shrank them) and a video (frames plus what its sound says).
    const images: string[] = [], notes: string[] = [];
    try {
      for (const u of [b.image, ...(Array.isArray(b.images) ? b.images : [])].filter(Boolean).slice(0, 4)) {
        const m = /^data:(image\/[\w.+-]+);base64,(.+)$/s.exec(String(u));
        if (!m) throw new MediaError("That photo didn't come through. Try it again.");
        images.push(await photo(Buffer.from(m[2], "base64"), m[1]));
      }
      if (b.video) { const v = await video(x.cfg(), x.env, Buffer.from(String(b.video), "base64")); images.push(...v.frames); notes.push(v.note); }
    } catch (e) { if (e instanceof MediaError) throw new AuthError(400, e.message); throw e; }
    if (!text && images.length) text = notes.length ? "What's in this video?" : "What's in this photo?";
    if (!text) throw new AuthError(400, b.audio ? "I didn't catch that." : "Say something first.");
    auth.touch(caller.sessionHash);
    const events: AgentEvent[] = [];
    const opts = { caller, text: [text, ...notes].join("\n\n"), images, conversationId: b.conversation_id || undefined,
      ...(caller.byVoiceAndFace ? { extId: `voice-face:${w.screen}`, freshAfterMs: 5 * 60_000 } : {}), onEvent: (e: AgentEvent) => { if (e.type === "tool") events.push(e); } };
    // A bigger job says so; its answer goes to the person's chat and phone (and stays in this conversation).
    const asker = caller.scope.kind === "person" ? caller.scope.person : caller.speaker;
    const r = asker ? await agent.turnOrLater(opts, cfg().model.answer_within_s * 1000, (late) => agent.deliverLate(asker, late)) : await agent.turn(opts);
    return { text: r.text, heard, speaker: speaker ? pub(speaker) : null, own_view: !!caller.byVoiceAndFace, photos: r.photos ?? [], conversation_id: r.conversationId, confirms: r.pending, approvals: r.requests, tools: [...new Set(events.map((e: any) => e.name))] };
  });
  // A photo the answer showed, as a data URL (the card can't send FAITH's token with an <img>).
  app.post("/api/ha/photo", async (req) => {
    const w = who(req), b: any = req.body || {};
    const pic = await agent.photo(w.caller, String(b.source || ""), String(b.id || ""));
    return { data_url: `data:${pic.mime};base64,${pic.bytes.toString("base64")}` };
  });
  app.post("/api/ha/chat/history", async (req) => {
    const c = who(req).caller, id = agent.latest(c);
    return { conversation_id: id ?? null, messages: id ? agent.messages(c, id).slice(-20) : [] };
  });
  app.post("/api/ha/confirm/:id", async (req) => {
    const c = who(req).caller;
    auth.touch(c.sessionHash);
    return agent.confirm(c, (req.params as any).id, !!(req.body as any)?.approve);
  });

  // ---- FAITH's voice for the hub card (Argos text-to-speech), as base64 over HA's websocket ----
  app.post("/api/ha/speak", async (req) => {
    who(req);
    const text = speakable(String((req.body as any)?.text || "")).slice(0, 2000).trim();
    if (!text) throw new AuthError(400, "Nothing to say.");
    const r = await synthesize(x.cfg(), x.env, text, "mp3");
    return { audio: r.audio.toString("base64"), mime: r.mime };
  });

  // ---- approvals (cards, and the Approve / Deny buttons on a phone notification) ----
  app.post("/api/ha/approvals", async (req) => { const c = who(req).caller; return { can_approve: approvals.canApprove(c), requests: approvals.list() }; });
  app.post("/api/ha/approvals/:id", async (req) => {
    const c = who(req).caller;
    if (c.scope.kind !== "person") throw new AuthError(403, "Only a family member can approve: sign in on this screen, or use your own HA account.");
    const id = approvals.resolveId((req.params as any).id) ?? (req.params as any).id;
    return approvals.decide(c, id, !!(req.body as any)?.approve);
  });

  // ---- points and rewards ----
  app.post("/api/ha/rewards", async (req) => {
    const c = who(req).caller, p = c.scope.kind === "person" ? c.scope.person : undefined;
    const kids = cfg().people.filter((k) => k.role === "child");
    const me = p?.role === "child" ? p : undefined;
    // The card balance is money: only for the child themself, or a signed-in grown-up. Never the shared view.
    const parent = !!p && p.role !== "child";
    return {
      me: me ? { ...pub(me), points: rewards.balance(me.id), history: rewards.history(me.id, 8), card: (await rewards.card(me.id)) ?? null } : null,
      kids: me ? [] : await Promise.all(kids.map(async (k) => ({ ...pub(k), points: rewards.balance(k.id), card: parent ? (await rewards.card(k.id)) ?? null : null }))),
      activities: rewards.activities(), rewards: rewards.rewards(), can_give: !!p && p.role !== "child", allowed_points: cfg().rewards.allowed_points,
    };
  });
  const act = (tool: string) => async (req: FastifyRequest) => {
    const c = who(req).caller;
    auth.touch(c.sessionHash);
    const r = await agent.runTool(c, tool, (req.body as any)?.args ?? {});
    const out: any = r.out;
    if (out?.error) throw new ModelError(400, out.error);
    return { ok: true, result: out, approval: out?.status === "sent_for_approval" || r.requests.length > 0 };
  };
  app.post("/api/ha/rewards/claim", act("points_claim"));
  app.post("/api/ha/rewards/redeem", act("reward_redeem"));
  app.post("/api/ha/rewards/award", act("points_award"));
  // Tick an item off the shopping list from the day card (the same rules as asking FAITH to).
  app.post("/api/ha/shopping/done", act("shopping_done"));

  // ---- shared screens: "Who's here?" on a wall tablet signed into HA as the family ----
  const shared = (req: FastifyRequest) => {
    const w = who(req);
    if (!w.asked) throw new AuthError(400, "Give the card a screen id (screen: kitchen).");
    if (!w.screen) throw new AuthError(403, `This tablet isn't paired as ${w.asked} yet. On the server run: faith pair ${w.asked}, then type the code on this screen.`);
    if (!w.shared) throw new AuthError(403, "This HA account already belongs to a person, so there's nothing to sign in to.");
    return w;
  };
  app.post("/api/ha/hub/people", async (req) => {
    const w = shared(req);
    const dev = cfg().hub.devices.find((d) => d.id === w.screen);
    return { people: cfg().people.map((p) => ({ ...pub(p), pin: auth.methods(p.id).pin })), suggested: presence.face(w.screen!) ?? null, face_unlock: !!dev?.face_unlock };
  });
  // Pairing a tablet as a screen: the one-time code from `faith pair <screen>`. The card keeps the device token.
  const pairFails = new Map<string, number[]>();
  app.post("/api/ha/hub/pair", async (req) => {
    const w = who(req), b: any = req.body || {};
    if (!w.asked) throw new AuthError(400, "Give the card a screen id (screen: kitchen).");
    if (!w.shared) throw new AuthError(403, "This HA account already belongs to a person, so there's no shared screen to pair.");
    // Codes are short: a few wrong tries, then wait (per screen, and for everyone together).
    const now = Date.now(), recent = (k: string) => (pairFails.get(k) ?? []).filter((t) => now - t < 10 * 60_000);
    if (recent(w.asked).length >= 5 || recent("*").length >= 20) throw new AuthError(429, "Too many wrong codes. Wait ten minutes, then make a new one with faith pair.");
    let r;
    try { r = auth.pair(String(b.code || "")); }
    catch (e) { for (const k of [w.asked, "*"]) pairFails.set(k, [...recent(k), now]); throw e; }
    if (r.device.id !== w.asked) { auth.unpair(r.device.id); throw new AuthError(400, `That code was for ${r.device.id}, not ${w.asked}. Make one with: faith pair ${w.asked}`); }
    return { device_token: r.token, screen: r.device.id };
  });
  app.post("/api/ha/hub/signin", async (req) => {
    const w = shared(req), b: any = req.body || {};
    const p = cfg().people.find((x) => x.id === String(b.person || ""));
    if (!p) throw new AuthError(404, "No one by that name here.");
    if (b.face) {
      const dev = cfg().hub.devices.find((d) => d.id === w.screen);
      if (!dev?.face_unlock || presence.face(w.screen!) !== p.id) throw new AuthError(401, "The camera doesn't see them right now.");
    } else auth.check(p, "pin", String(b.pin ?? ""));
    const token = auth.startSession(p, `ha:${w.screen}`);
    return { hub_session: token, person: pub(p) };
  });
  app.post("/api/ha/hub/signout", async (req) => { const b: any = req.body || {}; if (b.hub_session) auth.endSession(String(b.hub_session)); return { ok: true }; });
  app.post("/api/ha/hub/activity", async (req) => { const c = who(req).caller; auth.touch(c.sessionHash); return { ok: true }; });

  // Called by a person (a script or button in HA): their own rules, like any message they send.
  // Called by an automation (no HA user): set up by whoever runs HA, so it acts as the parents' view, with no private access.
  const sender = (w: ReturnType<typeof who>): Caller => w.user ? w.caller : { scope: { kind: "household" }, audience: "parents", channel: "ha", label: "home assistant automation" };

  // ---- HA → a camera, then a message (the faith.look action: "someone's at the door") ----
  app.post("/api/ha/look", async (req) => {
    const w = who(req), b: any = req.body || {}, caller = sender(w);
    const cams = x.registry.ha?.cameras(caller) ?? [];
    if (!cams.length) throw new ModelError(403, `No camera is shared with ${w.user ? "this Home Assistant user" : "automations"}. In FAITH's config, add ${w.user ? "their role" : "parents"} to the camera's who list.`);
    const r = await agent.runTool(caller, "camera_look", { camera: b.camera, question: b.question });
    const out: any = r.out;
    if (out?.error) throw new ModelError(400, out.error);
    let sent: unknown;
    if (b.to) {
      const known = out.who && !String(out.sees).includes(out.who) ? `It's ${out.who}. ` : "";
      const m = await agent.runTool(caller, "message_send", { to: b.to, text: `${out.camera}: ${known}${out.sees}` });
      if ((m.out as any)?.error) throw new ModelError(400, (m.out as any).error);
      sent = m.out;
    }
    return { camera: out.camera, ...(out.who ? { who: out.who } : {}), sees: out.sees, at: out.at, ...(sent ? { sent } : {}) };
  });

  // ---- HA → Mattermost / phones (the faith.send_message action) ----
  app.post("/api/ha/send", async (req) => {
    const w = who(req), b: any = req.body || {};
    const caller = sender(w);
    const r = await agent.runTool(caller, "message_send", { to: b.to, text: b.message });
    const out: any = r.out;
    if (out?.error) throw new ModelError(400, out.error);
    return out;
  });
}

