import { envValue, type Config, type Person } from "../config.js";
import type { Db } from "../db.js";
import type { Registry } from "../connectors/registry.js";
import type { Approvals } from "../approvals.js";
import type { Tool } from "../connectors/types.js";
import { quickRead } from "../connectors/homeassistant.js";
import { newId } from "../secrets.js";
import { scopeKey, speakerLabel, who, type Caller } from "../scope.js";
import { ModelError, runLoop, type LoopEvent, type Msg } from "./llm.js";
import { systemPrompt } from "./prompt.js";
import { ToolRouter } from "./router.js";
import { ModelGate } from "./gate.js";

export type AgentEvent = LoopEvent | { type: "confirm"; id: string; summary: string } | { type: "approval"; id: string; summary: string } | { type: "conversation"; id: string };
export type TurnOpts = { caller: Caller; text: string; images?: string[]; conversationId?: string; extId?: string; freshAfterMs?: number; history?: Msg[]; extraSystem?: string; onEvent?: (e: AgentEvent) => void; signal?: AbortSignal;
  /** Set by turnOrLater: once true, this turn's model calls wait behind quick questions. */
  job?: { background: boolean } };
export const LATER = "This one's a bigger job. I'll send you the answer when it's done.";
export type TurnResult = { conversationId: string; text: string; toolsUsed: string[]; pending: { id: string; summary: string }[]; requests: { id: string; summary: string }[];
  /** Done by HA's own sentence matcher, without the model. */
  quick?: boolean };

const PENDING_TTL = 10 * 60_000;

/** One family turn: pick the caller's tools, build the prompt, run the loop,
 *  keep the conversation, and hold risky actions for an on-screen Yes. */
export class Agent {
  router: ToolRouter;
  /** Who's home, from HA (set by app.ts). */
  homeLine?: () => string | undefined;
  constructor(private db: Db, private cfg: () => Config, private registry: Registry, private env: NodeJS.ProcessEnv = process.env, private approvals?: Approvals) {
    this.router = new ToolRouter(cfg, env, (m) => console.warn(m));
  }

  ownerKey(c: Caller) { return `${scopeKey(c.scope)}${c.audience ? ":" + c.audience : ""}|${c.channel}|${c.deviceId || ""}`; }

  /** Put a chat's conversation away, so the next message starts fresh ("new topic"). */
  newTopic(c: Caller, extId: string) {
    return Number(this.db.prepare("UPDATE conversations SET ext_id = ext_id || ':done:' || ? WHERE ext_id = ? AND owner_key = ?").run(String(Date.now()), extId, this.ownerKey(c)).changes) > 0;
  }

  private conversation(c: Caller, id?: string, extId?: string, freshAfterMs = 0) {
    const key = this.ownerKey(c), now = Date.now();
    let row: any = id ? this.db.prepare("SELECT id FROM conversations WHERE id = ? AND owner_key = ?").get(id, key) : undefined;
    if (!row && extId) {
      row = this.db.prepare("SELECT id, updated_at FROM conversations WHERE ext_id = ? AND owner_key = ?").get(extId, key);
      // A chat that went quiet starts a new conversation: old receipts and plans don't confuse new questions.
      if (row && freshAfterMs > 0 && now - Number(row.updated_at) > freshAfterMs) { this.newTopic(c, extId); row = undefined; }
    }
    if (row) { this.db.prepare("UPDATE conversations SET updated_at = ? WHERE id = ?").run(now, row.id); return { id: row.id as string, fresh: false }; }
    const nid = newId();
    this.db.prepare("INSERT INTO conversations (id, owner_key, person_id, channel, ext_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(nid, key, c.scope.kind === "person" ? c.scope.person.id : null, c.channel, extId ?? null, now, now);
    return { id: nid, fresh: true };
  }
  history(conversationId: string): Msg[] {
    const n = this.cfg().model.history_messages;
    const rows = this.db.prepare("SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT ?").all(conversationId, n) as any[];
    return rows.reverse().map((r) => ({ role: r.role, content: r.content }));
  }
  private save(conversationId: string, role: "user" | "assistant", content: string) {
    this.db.prepare("INSERT INTO messages (conversation_id, role, content, created_at) VALUES (?, ?, ?, ?)").run(conversationId, role, content, Date.now());
  }
  audit(c: Caller, tool: string, summary: string, ok: boolean) {
    const by = c.speaker ? speakerLabel(c, "id")! : who(c.scope) + (c.deviceId ? `@${c.deviceId}` : "");
    this.db.prepare("INSERT INTO audit (at, who, channel, tool, summary, ok) VALUES (?, ?, ?, ?, ?, ?)").run(Date.now(), by, c.channel, tool, summary.slice(0, 500), ok ? 1 : 0);
  }

  /** The person's context from the wiki (profile, today's note, inbox), once per conversation. */
  private async context(c: Caller, tools: Tool[]) {
    if (c.scope.kind !== "person") return undefined;
    const t = tools.find((x) => /(^|_)context_for$/.test(x.name));
    if (!t) return undefined;
    try {
      const out = await t.run({ person: c.scope.person.id });
      const text = typeof out === "string" ? out : JSON.stringify(out);
      const max = this.cfg().model.context_chars;
      return text.length > max ? text.slice(0, max) + " …" : text;
    } catch { return undefined; }
  }

  private canConfirm(c: Caller) { return c.channel === "hub" || c.channel === "personal" || c.channel === "mattermost" || c.channel === "ha"; }

  /** Tools wrapped with confirmation and the action log.
   *  `media`: the turn carries a photo or video. What's in it (a note, a sign,
   *  a video's sound) can read like a request, so every change waits for the
   *  person's own Yes. That's enforced here, not left to the prompt. */
  private wrap(c: Caller, tools: Tool[], conversationId: string, pending: TurnResult["pending"], requests: TurnResult["requests"], emit: (e: AgentEvent) => void, seen: { media: boolean } = { media: false }) {
    return tools.map((t) => ({
      name: t.name, description: t.description + (t.approval ? " (Needs a family member's approval: it's sent to them, not done straight away.)" : ""), parameters: t.parameters,
      run: async (args: any) => {
        // Unlocking, disarming, opening and destructive tools can't be approved from afar:
        // they need a signed-in grown-up's own Yes on a screen.
        if (t.approval && (await t.strict?.(args))) {
          const what = (await t.confirm?.(args)) || t.explain?.(args) || t.name;
          return { error: `"${what}" can't be asked for from here. A grown-up has to sign in and do it themselves, then tap Yes.` };
        }
        if (t.approval) {
          if (!this.approvals) return { error: "Changes from the shared view need approval, and approvals aren't set up." };
          const r = this.approvals.create(c, t, args, conversationId);
          requests.push(r); emit({ type: "approval", ...r });
          return { status: "sent_for_approval", action: r.summary, note: "Nothing has happened yet. A family member has to approve it (they'll see it on their FAITH screen or phone). Tell the person that, in one sentence. Or they can sign in and do it themselves." };
        }
        const media = seen.media;
        const summary = (await t.confirm?.(args)) || (media && t.write ? t.explain?.(args) || described(t.name, args) : null);
        if (summary && !(c.channel === "voice" && this.cfg().voice.confirm_on_voice && !media)) {
          if (!this.canConfirm(c)) return { error: `"${summary}" needs someone to tap Yes on a FAITH screen. It can't be done from here.` };
          if (c.speaker && c.speaker.role === "child") return { error: `"${summary}" is for grown-ups. Ask a parent.` };
          const id = newId();
          this.db.prepare("INSERT INTO pending (id, conversation_id, owner_key, tool, args, summary, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
            .run(id, conversationId, this.ownerKey(c), t.name, JSON.stringify(args ?? {}), summary, Date.now());
          pending.push({ id, summary }); emit({ type: "confirm", id, summary });
          return { status: "waiting_for_confirmation", action: summary, note: c.channel === "mattermost" ? "Nothing has happened yet. Tell the person what you'll do and that they need to reply yes." : "Nothing has happened yet. Tell the person what you'll do and that they need to tap Yes." };
        }
        try {
          const out = await t.run(args);
          if (t.media) seen.media = true;
          if (t.write) this.audit(c, t.name, JSON.stringify(args ?? {}), !(out && typeof out === "object" && "error" in (out as any)));
          return out;
        } catch (e: any) { if (t.write) this.audit(c, t.name, `${JSON.stringify(args ?? {})} -> ${e.message}`, false); throw e; }
      },
    }));
  }

  /** HA's own sentence matcher first: "turn off the kitchen light" needs no model.
   *  FAITH's rules are checked on what HA would touch, and it runs through wrap
   *  (the action log) like any tool. Anything else, or any doubt: null, and the model answers. */
  private async quick(c: Caller, text: string, conv: { id: string }, emit: (e: AgentEvent) => void): Promise<TurnResult | null> {
    const ha = this.registry.ha;
    if (!ha || text.length > 200 || !ha.fastOn(c) || !this.registry.allowedConnector(c, ha.id)) return null;
    try {
      const m = await ha.quick(c, text);
      if (!m || !ha.quickAllowed(c, m)) return null;
      const write = !quickRead(m.intent);
      if (write) {
        // The same rules as the model's own HA tools: this person has the tool, it needs no approval and no Yes.
        const t = (await this.registry.toolsFor(c)).tools.find((x) => x.name === m.intent);
        if (!t || t.approval || (await t.confirm?.(m.args)) || (await t.strict?.(m.args))) return null;
      }
      const pending: TurnResult["pending"] = [], requests: TurnResult["requests"] = [];
      const tool: Tool = { name: m.intent, connector: ha.id, write, description: "HA's built-in agent", parameters: {}, run: () => ha.quickRun(c, text, m) };
      const [w] = this.wrap(c, [tool], conv.id, pending, requests, emit);
      const out: any = await w.run(m.args);
      if (!out?.handled || pending.length) return null;
      emit({ type: "tool", name: m.intent });
      const reply = out.speech || "Done.";
      this.save(conv.id, "user", text);
      this.save(conv.id, "assistant", reply);
      emit({ type: "text", delta: reply });
      return { conversationId: conv.id, text: reply, toolsUsed: [m.intent], pending, requests, quick: true };
    } catch (e: any) {
      if (!this.quickWarned) { this.quickWarned = true; console.warn(`HA fast path: ${e?.message || e}. Answering with the model instead (update the FAITH integration to 0.5+).`); }
      return null;
    }
  }
  private quickWarned = false;
  /** The model's queue: quick questions go ahead of big jobs. */
  readonly gate = new ModelGate(() => this.cfg().model.parallel);

  /** A turn that answers within `withinMs`, or says it's a bigger job. Then it
   *  carries on behind quick questions (the model's queue) and `deliver` gets
   *  the answer, or the error, when it's done. */
  async turnOrLater(o: TurnOpts, withinMs: number, deliver: (r: TurnResult | Error) => void | Promise<void>): Promise<TurnResult & { later?: boolean }> {
    if (!(withinMs > 0)) return this.turn(o);
    const job = { background: false }; let conversationId = o.conversationId ?? "";
    const p = this.turn({ ...o, job, onEvent: (e) => { if (e.type === "conversation") conversationId = e.id; o.onEvent?.(e); } });
    let timer: ReturnType<typeof setTimeout> | undefined;
    const late = new Promise<"late">((r) => { timer = setTimeout(() => r("late"), withinMs); });
    const first = await Promise.race([p, late]).finally(() => clearTimeout(timer));
    if (first !== "late") return first;
    job.background = true;
    p.then((r) => deliver(r), (e) => deliver(e instanceof Error ? e : new Error(String(e)))).catch((e) => console.warn(`delivering a late answer failed: ${e?.message || e}`));
    return { conversationId, text: LATER, toolsUsed: [], pending: [], requests: [], later: true };
  }

  /** Send a big job's answer to the person who asked, in their own chat and on their phone. */
  async deliverLate(p: Person, r: TurnResult | Error) {
    const text = r instanceof Error ? `Sorry, that didn't work: ${r.message}` : r.text + (r.pending.length ? "\n\nIt's waiting for your Yes in FAITH." : "");
    await this.runTool({ scope: { kind: "person", person: p }, channel: "ha", label: `${p.id} (a bigger job)` }, "message_send", { to: p.id, text });
  }

  async turn(o: TurnOpts): Promise<TurnResult> {
    const cfg = this.cfg(), c = o.caller, emit = o.onEvent ?? (() => {});
    const text = String(o.text || "").trim();
    if (!text) throw new ModelError(400, "Say something first.");
    const conv = this.conversation(c, o.conversationId, o.extId, o.freshAfterMs);
    emit({ type: "conversation", id: conv.id });
    if (!o.images?.length && !o.history) { const q = await this.quick(c, text, conv, emit); if (q) return q; }
    const set = await this.registry.toolsFor(c);
    const context = conv.fresh || o.history ? await this.context(c, set.tools) : this.lastContext.get(conv.id);
    if (context) {
      this.lastContext.set(conv.id, context);
      if (this.lastContext.size > 200) this.lastContext.delete(this.lastContext.keys().next().value!);
    }
    const sources = this.registry.describe(set.sources) + (set.problems.length ? `\n(Not reachable right now: ${set.problems.map((p) => p.split(":")[0]).join(", ")}.)` : "");
    // HA's own overview of the house (areas, devices, aliases), when the Assist API is on.
    const house = this.registry.ha && this.registry.allowedConnector(c, this.registry.ha.id) ? await this.registry.ha.houseContext(c) : undefined;
    const extra = [o.extraSystem, house && `How the house is set up (from Home Assistant):\n${house}`].filter(Boolean).join("\n\n") || undefined;
    const system = systemPrompt(cfg, c, sources, { context, extra, home: this.homeLine?.() });
    const past = o.history ?? this.history(conv.id);
    const pending: TurnResult["pending"] = [], requests: TurnResult["requests"] = [];
    // Many tools (ha-mcp alone has 86): offer the ones this question needs. The previous question counts too.
    const before = [...past].reverse().find((m) => m.role === "user");
    const offered = await this.router.pick(set.tools, `${typeof before?.content === "string" ? before.content : ""}\n${text}`);
    // A photo goes to the vision model (Argos serves it) as an image part.
    // Up to 8: a video sends 6 frames.
    const images = (o.images || []).filter((u) => /^data:image\/(png|jpe?g|webp|gif);base64,/.test(u)).slice(0, 8);
    const seen = { media: images.length > 0 };   // a photo now, or a camera later in this turn
    const userMsg: Msg = images.length ? { role: "user", content: [{ type: "text", text }, ...images.map((url) => ({ type: "image_url", image_url: { url } }))] } : { role: "user", content: text };
    const result = await runLoop({
      baseUrl: cfg.model.base_url, model: images.length && cfg.model.vision_model ? cfg.model.vision_model : cfg.model.model, key: envValue(cfg.model.api_key_env, this.env), temperature: cfg.model.temperature, timeoutMs: cfg.model.timeout_s * 1000,
      messages: [{ role: "system", content: system }, ...past, userMsg],
      tools: this.wrap(c, offered, conv.id, pending, requests, emit, seen),
      callable: offered.length < set.tools.length ? this.wrap(c, set.tools.filter((t) => !offered.includes(t)), conv.id, pending, requests, emit, seen) : undefined, maxRounds: cfg.model.max_rounds, onEvent: emit, signal: o.signal,
      gate: this.gate, background: () => !!o.job?.background,
    });
    this.save(conv.id, "user", images.length ? `${text} [photo]` : text);
    this.save(conv.id, "assistant", result.text);
    return { conversationId: conv.id, text: result.text, toolsUsed: result.toolsUsed, pending, requests };
  }
  private lastContext = new Map<string, string>();

  /** Run one tool directly (a card's button), through the same approval,
   *  confirmation and logging as a chat turn. */
  async runTool(c: Caller, name: string, args: any) {
    const set = await this.registry.toolsFor(c);
    const t = set.tools.find((x) => x.name === name);
    if (!t) throw new ModelError(403, "You can't do that from here.");
    const conv = this.conversation(c);
    const pending: TurnResult["pending"] = [], requests: TurnResult["requests"] = [];
    const [w] = this.wrap(c, [t], conv.id, pending, requests, () => {});
    const out: any = await w.run(args ?? {});
    return { out, pending, requests };
  }

  /** Yes or No on a held action. Only the same person on the same kind of screen can answer. */
  async confirm(c: Caller, id: string, approve: boolean) {
    const row = this.db.prepare("SELECT * FROM pending WHERE id = ? AND owner_key = ? AND status = 'waiting'").get(id, this.ownerKey(c)) as any;
    if (!row || Date.now() - row.created_at > PENDING_TTL) throw new ModelError(404, "That request has expired or was already answered. Ask again.");
    // Claim it: a double tap on Yes must not run it twice.
    if (Number(this.db.prepare("UPDATE pending SET status = 'claimed' WHERE id = ? AND status = 'waiting'").run(id).changes) !== 1) throw new ModelError(409, "That was already answered.");
    if (!approve) {
      this.db.prepare("UPDATE pending SET status = 'declined' WHERE id = ?").run(id);
      this.save(row.conversation_id, "assistant", `(Cancelled: ${row.summary}.)`);
      return { ok: true, text: `Okay, I won't ${row.summary}.` };
    }
    const set = await this.registry.toolsFor(c);
    const t = set.tools.find((x) => x.name === row.tool);
    if (!t) { this.db.prepare("UPDATE pending SET status = 'failed' WHERE id = ?").run(id); throw new ModelError(403, "You can't do that from here any more."); }
    this.db.prepare("UPDATE pending SET status = 'running' WHERE id = ?").run(id);
    let out: any, ok = true;
    try { out = await t.run(JSON.parse(row.args)); ok = !(out && typeof out === "object" && "error" in out); }
    catch (e: any) { out = { error: e.message }; ok = false; }
    this.db.prepare("UPDATE pending SET status = ? WHERE id = ?").run(ok ? "done" : "failed", id);
    this.audit(c, row.tool, `${row.args} (confirmed)`, ok);
    const text = ok ? `Done: ${row.summary}.` : `That didn't work: ${out?.error || "unknown error"}.`;
    this.save(row.conversation_id, "assistant", text);
    return { ok, text };
  }

  messages(c: Caller, conversationId: string) {
    const conv = this.db.prepare("SELECT id FROM conversations WHERE id = ? AND owner_key = ?").get(conversationId, this.ownerKey(c));
    if (!conv) return [];
    return this.db.prepare("SELECT role, content, created_at FROM messages WHERE conversation_id = ? ORDER BY id").all(conversationId) as any[];
  }
  latest(c: Caller) {
    return (this.db.prepare("SELECT id FROM conversations WHERE owner_key = ? ORDER BY updated_at DESC LIMIT 1").get(this.ownerKey(c)) as any)?.id as string | undefined;
  }
}

/** A held change in words, for tools without their own: "allglance create task: Call the plumber, 2026-11-27". */
function described(name: string, args: any) {
  const vals = Object.values(args ?? {}).filter((v) => typeof v === "string" || typeof v === "number").map(String);
  return `${name.replace(/_/g, " ")}${vals.length ? `: ${vals.join(", ")}` : ""}`.slice(0, 160);
}
