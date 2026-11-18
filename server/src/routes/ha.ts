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
import type { Voices } from "../voice.js";
import { envValue } from "../config.js";
import { dashboard } from "../dashboard.js";
import { ModelError } from "../harness/llm.js";
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

  type Who = { caller: Caller; user?: string; screen?: string; hub?: { person: Person; remaining: number }; shared: boolean };
  const who = (req: FastifyRequest): Who => {
    const base = x.apiCaller(req);
    if (base.apiKind !== "ha") throw new AuthError(403, "Use a Home Assistant token (`faith token add ha <name>`).");
    const b: any = req.body || {};
    const user = b.user_id ? String(b.user_id) : undefined;
    const screen = b.screen && SCREEN.test(String(b.screen)) ? String(b.screen) : undefined;
    const ha = cfg().connectors.find((c) => c.type === "homeassistant") as any;
    const mapped = user && ha?.trust_ha_users !== false ? cfg().people.find((p) => p.ha_user_id === user) : undefined;
    if (screen && !mapped) {
      const h = auth.haHub(b.hub_session ? String(b.hub_session) : undefined, screen);
      if (h) return { caller: { scope: { kind: "person", person: h.person }, channel: "ha", deviceId: `ha:${screen}`, sessionHash: h.hash, label: `${h.person.id} on ${screen}` }, user, screen, hub: { person: h.person, remaining: auth.remaining(h.row) }, shared: true };
    }
    if (mapped) return { caller: { scope: { kind: "person", person: mapped }, channel: "ha", deviceId: "ha", label: `${mapped.id} in HA` }, user, screen, shared: false };
    return { caller: { scope: { kind: "household" }, channel: "ha", deviceId: `ha:${screen || "default"}`, label: `household on ${screen || "HA"}` }, user, screen, shared: true };
  };
  const pub = (p: Person) => ({ id: p.id, name: p.name, role: p.role, color: p.color });

  // ---- the dashboard cards ----
  app.post("/api/ha/view", async (req) => {
    const w = who(req), c = w.caller, b: any = req.body || {};
    const p = c.scope.kind === "person" ? c.scope.person : undefined;
    let { cards } = await dashboard(cfg(), x.registry, c, { approvals });
    const order = (Array.isArray(b.cards) && b.cards.length ? b.cards.map(String) : p?.cards) as string[] | undefined;
    if (order) cards = order.map((id) => cards.find((k) => k.id === id)).filter(Boolean) as typeof cards;
    const role = p?.role ?? "household";
    const apps = cfg().apps.filter((a) => (a.who === "anyone" || p) && (!a.roles || a.roles.includes(role)) && (!a.people || (p && a.people.includes(p.id)))).map(({ id, name, url, icon }) => ({ id, name, url, icon }));
    return {
      name: cfg().name, person: p ? pub(p) : null, household: !p, screen: w.screen ?? null,
      hub: w.hub ? { person: pub(w.hub.person), remaining_seconds: w.hub.remaining } : null,
      can_sign_in: w.shared && !w.hub && cfg().people.length > 0,
      can_approve: approvals.canApprove(c), pending_approvals: approvals.pendingCount(),
      cards, apps,
    };
  });

  // ---- chat (text, or a recording the card made) ----
  app.post("/api/ha/chat", async (req) => {
    const w = who(req), b: any = req.body || {};
    let caller = w.caller, text = String(b.text || "").trim(), heard: string | undefined, speaker: Person | undefined;
    if (b.audio) {
      const audio = Buffer.from(String(b.audio), "base64"), mime = String(b.mime || "audio/webm");
      heard = await transcribe(x, audio, mime); text = heard;
      // On a shared screen with nobody signed in, a known voice says who's talking.
      if (caller.scope.kind === "household" && voices.enabled()) {
        const m = await voices.identify(audio, mime).catch(() => undefined);
        if (m) { speaker = m.person; if (cfg().voice_id?.trust_for_changes !== false) caller = { ...caller, speaker: m.person, audience: "family", label: `${m.person.id} (voice) on ${w.screen || "HA"}` }; }
      }
    }
    if (!text) throw new AuthError(400, b.audio ? "I didn't catch that." : "Say something first.");
    auth.touch(caller.sessionHash);
    const events: AgentEvent[] = [];
    const images = b.image ? [String(b.image)] : undefined;
    const r = await agent.turn({ caller, text, images, conversationId: b.conversation_id || undefined, onEvent: (e) => { if (e.type === "tool") events.push(e); } });
    return { text: r.text, heard, speaker: speaker ? pub(speaker) : null, conversation_id: r.conversationId, confirms: r.pending, approvals: r.requests, tools: [...new Set(events.map((e: any) => e.name))] };
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
    return {
      me: me ? { ...pub(me), points: rewards.balance(me.id), history: rewards.history(me.id, 8) } : null,
      kids: me ? [] : kids.map((k) => ({ ...pub(k), points: rewards.balance(k.id) })),
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

  // ---- shared screens: "Who's here?" on a wall tablet signed into HA as the family ----
  const shared = (req: FastifyRequest) => {
    const w = who(req);
    if (!w.screen) throw new AuthError(400, "Give the card a screen id (screen: kitchen).");
    if (!w.shared) throw new AuthError(403, "This HA account already belongs to a person, so there's nothing to sign in to.");
    return w;
  };
  app.post("/api/ha/hub/people", async (req) => {
    const w = shared(req);
    const dev = cfg().hub.devices.find((d) => d.id === w.screen);
    return { people: cfg().people.map((p) => ({ ...pub(p), pin: auth.methods(p.id).pin })), suggested: presence.face(w.screen!) ?? null, face_unlock: !!dev?.face_unlock };
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

  // ---- HA → Mattermost / phones (the faith.send_message action) ----
  app.post("/api/ha/send", async (req) => {
    const w = who(req), b: any = req.body || {};
    // An automation is set up by whoever runs HA, so it sends straight away (no approval), with no private access.
    const r = await agent.runTool({ scope: { kind: "household" }, audience: "parents", channel: "ha", label: "home assistant automation" }, "message_send", { to: b.to, text: b.message });
    const out: any = r.out;
    if (out?.error) throw new ModelError(400, out.error);
    return out;
  });
}

async function transcribe(x: HaCtx, audio: Buffer, mime: string) {
  const m = x.cfg().model, key = envValue(m.api_key_env, x.env);
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(audio)], { type: mime }), `speech.${mime.split("/")[1]?.split(";")[0] || "webm"}`);
  form.append("model", x.cfg().voice.stt_model);
  let r: Response;
  try { r = await fetch(`${m.base_url}/audio/transcriptions`, { method: "POST", body: form, headers: key ? { Authorization: `Bearer ${key}` } : {}, signal: AbortSignal.timeout(120_000) }); }
  catch (e: any) { throw new ModelError(502, `Couldn't reach speech-to-text (${e?.cause?.code || e?.message}).`); }
  const d: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new ModelError(502, `Speech-to-text answered ${r.status}.`);
  return String(d.text || "").trim();
}
