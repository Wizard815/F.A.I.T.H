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
  describe() { return "Hermes Studio: this person's AI workspace: past chats, starting a job for Hermes or Ekko there, and its Projects (coding work run by agents)"; }

  private creds(caller: Caller) {
    if (caller.scope.kind !== "person") return undefined;
    // One owner (the person who runs the homelab): only they reach Studio, with its one account.
    if (this.cfg.owner && caller.scope.person.id !== this.cfg.owner) return undefined;
    const user = envValue(personEnv(this.cfg.user_env, caller.scope.person.id), this.env), pass = envValue(personEnv(this.cfg.password_env, caller.scope.person.id), this.env);
    return user && pass ? { user, pass } : undefined;
  }
  private async login(user: string, pass: string) {
    const r = await call(`${this.cfg.url}/api/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: user, password: pass }) });
    if (!r.ok || !r.body?.token) throw new ToolError(`Hermes Studio sign-in failed (${r.status}).`);
    this.jwt.set(user, { token: r.body.token, at: Date.now() });
    return r.body.token as string;
  }
  private async req(caller: Caller, method: "GET" | "POST" | "PUT", path: string, body?: unknown) {
    const c = this.creds(caller);
    if (!c) throw new ToolError("No Studio account for this person.");
    let tok = this.jwt.get(c.user);
    const token = tok && Date.now() - tok.at < 6 * 3600_000 ? tok.token : await this.login(c.user, c.pass);
    const go = (t: string) => call(`${this.cfg.url}${path}`, { method, headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), timeoutMs: 60_000 });
    let r = await go(token);
    if (r.status === 401) r = await go(await this.login(c.user, c.pass));
    if (r.status === 403 && path.startsWith("/api/studio/projects")) throw new ToolError("Studio Projects are only for Studio's super admins. Ask the person who runs Studio.");
    if (!r.ok) throw new ToolError(r.body?.error || `Hermes Studio answered ${r.status}.`);
    return r.body;
  }

  async ping() {
    const r = await call(`${this.cfg.url}/`, { timeoutMs: 10_000 });
    if (r.status >= 500) throw new ToolError(`Hermes Studio answered ${r.status}.`);
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
      // Studio Projects (hermes-studio docs/projects.md): see them, and hand one a job through its
      // coordinator or its board. FAITH never starts a Studio thread itself: Studio's coordinator
      // decides, the same as for a paired Studio, and can pass it on to the other Studios in its group.
      { name: "studio_projects", connector: this.id, write: false,
        description: "This person's Hermes Studio projects (coding work run by agents), each with its open threads and their stage (working, needs_you, review, done).",
        parameters: { type: "object", properties: {}, additionalProperties: false },
        run: async () => {
          const r = await this.req(caller, "GET", "/api/studio/projects");
          return { projects: (r?.projects || []).slice(0, 20).map((p: any) => ({ id: String(p.id), name: String(p.name || ""), counts: p.counts ?? null,
            threads: (p.threads || []).filter((t: any) => t.stage !== "resolved").slice(0, 10).map((t: any) => ({ id: String(t.id), title: String(t.title || ""), stage: t.stage || t.liveStatus || "" })) })) };
        } },
      { name: "studio_project_message", connector: this.id, write: true, explain: (a) => `message Studio project ${a?.project}'s coordinator: ${String(a?.text || "").slice(0, 60)}`,
        description: "Send a Studio project's coordinator a job or a question. It decides what to start, and can pass it to another Studio in its group. Write the whole job: it doesn't see this conversation.",
        parameters: { type: "object", properties: { project: { type: "string", description: "Project id from studio_projects." }, text: { type: "string" } }, required: ["project", "text"], additionalProperties: false },
        run: async (a) => {
          await this.req(caller, "POST", `/api/studio/projects/${encodeURIComponent(String(a?.project || ""))}/message`, { text: String(a?.text || "").slice(0, 4000), app: "FAITH" });
          return { ok: true, note: "Sent to the project's coordinator in Studio. It answers there." };
        } },
      { name: "studio_project_task", connector: this.id, write: true, explain: (a) => `add a task to Studio project ${a?.project}: ${a?.title}`,
        description: "Add a task to a Studio project's board, for its coordinator or the person to start later. Put the whole job in notes: Studio doesn't see this conversation.",
        parameters: { type: "object", properties: { project: { type: "string", description: "Project id from studio_projects." }, title: { type: "string" }, notes: { type: "string" } }, required: ["project", "title"], additionalProperties: false },
        run: async (a) => {
          const r = await this.req(caller, "POST", `/api/studio/projects/${encodeURIComponent(String(a?.project || ""))}/tasks`, { title: String(a?.title || "").slice(0, 120), notes: String(a?.notes || "").slice(0, 4000) });
          return { ok: true, task: String(r?.task?.id || ""), note: "On the project's board in Studio." };
        } },
    ];
  }
}
