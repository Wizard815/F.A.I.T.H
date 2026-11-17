import { envValue, personEnv, type StudioConnector as StudioCfg } from "../config.js";
import type { Caller } from "../scope.js";
import { call, ToolError, type Connector, type Tool } from "./types.js";

/** Hermes Studio through its own REST API, signed in as the person's own
 *  Studio account (Studio is multi-user). Its MCP bridge is stdio-only, so
 *  this follows Pondering Orb's Studio integration instead
 *  (pondering-orb/server/src/integrations/hermes.ts). */
export class Studio implements Connector {
  id: string;
  private jwt = new Map<string, { token: string; at: number }>();
  constructor(private cfg: StudioCfg, private env: NodeJS.ProcessEnv = process.env) { this.id = cfg.id; }
  describe() { return "Hermes Studio: this person's AI workspace: past chats, and starting a job for Hermes or Ekko there"; }

  private creds(caller: Caller) {
    if (caller.scope.kind !== "person") return undefined;
    const user = envValue(personEnv(this.cfg.user_env, caller.scope.person.id), this.env), pass = envValue(personEnv(this.cfg.password_env, caller.scope.person.id), this.env);
    return user && pass ? { user, pass } : undefined;
  }
  private async login(user: string, pass: string) {
    const r = await call(`${this.cfg.url}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user, password: pass }) });
    if (!r.ok || !r.body?.token) throw new ToolError(`Hermes Studio sign-in failed (${r.status}).`);
    this.jwt.set(user, { token: r.body.token, at: Date.now() });
    return r.body.token as string;
  }
  private async req(caller: Caller, method: "GET" | "POST", path: string, body?: unknown) {
    const c = this.creds(caller);
    if (!c) throw new ToolError("No Studio account for this person.");
    let tok = this.jwt.get(c.user);
    const token = tok && Date.now() - tok.at < 6 * 3600_000 ? tok.token : await this.login(c.user, c.pass);
    const go = (t: string) => call(`${this.cfg.url}${path}`, { method, headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), timeoutMs: 60_000 });
    let r = await go(token);
    if (r.status === 401) r = await go(await this.login(c.user, c.pass));
    if (!r.ok) throw new ToolError(r.body?.error || `Hermes Studio answered ${r.status}.`);
    return r.body;
  }

  async tools(caller: Caller): Promise<Tool[]> {
    if (!this.creds(caller)) return [];
    const text = (c: any): string => (typeof c === "string" ? c : Array.isArray(c) ? c.map((p) => (typeof p === "string" ? p : p?.text || "")).join(" ") : c?.text || "");
    return [
      { name: "studio_chats", connector: this.id, write: false, description: "This person's recent Hermes Studio chats, or ones matching words.",
        parameters: { type: "object", properties: { query: { type: "string" } }, additionalProperties: false },
        run: async (a) => {
          const r = await this.req(caller, "GET", a?.query ? `/api/studio/search/sessions?q=${encodeURIComponent(a.query)}` : "/api/studio/sessions?limit=20");
          return { chats: (r?.sessions || r?.results || []).slice(0, 20).map((s: any) => ({ id: String(s.id), title: s.title || "", agent: s.agent || "", last_active: s.lastActive ?? s.updatedAt ?? null })) };
        } },
      { name: "studio_chat_read", connector: this.id, write: false, description: "The latest messages of one Studio chat (by id from studio_chats).",
        parameters: { type: "object", properties: { id: { type: "string" } }, required: ["id"], additionalProperties: false },
        run: async (a) => {
          const r = await this.req(caller, "GET", `/api/studio/sessions/${encodeURIComponent(String(a?.id || ""))}`);
          const s = r?.session || r || {};
          return { title: s.title || "", messages: (s.messages || s.history || []).slice(-15).map((m: any) => ({ role: m.role || m.type || "", text: text(m.content ?? m.text).slice(0, 1200) })) };
        } },
      { name: "studio_start", connector: this.id, write: true, explain: (a) => `start a ${a?.agent || "hermes"} job in Studio: ${a?.title}`,
        description: "Start a new chat in Hermes Studio with a job for Hermes or Ekko (they keep working there; the person follows it in Studio). Write the whole job: they don't see this conversation.",
        parameters: { type: "object", properties: { title: { type: "string" }, prompt: { type: "string" }, agent: { type: "string", enum: ["hermes", "ekko-agent"] } }, required: ["title", "prompt"], additionalProperties: false },
        run: async (a) => {
          const r = await this.req(caller, "POST", "/api/studio/orb/work", { agentId: a?.agent || "hermes", title: String(a?.title || "").slice(0, 80), prompt: String(a?.prompt || "") });
          return { ok: true, chat_id: String(r?.work?.sessionId || ""), note: "Running in Hermes Studio." };
        } },
    ];
  }
}
