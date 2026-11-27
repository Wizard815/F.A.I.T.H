import { envValue, type HermesConnector as HermesCfg } from "../config.js";
import type { Caller } from "../scope.js";
import { call, ToolError, type Connector, type Tool } from "./types.js";

/** Hermes (hermes-agent's API server) as a helper for bigger jobs: research,
 *  long multi-step work, things that need Hermes's own skills and tools. Each
 *  person reaches their own Hermes profile (/p/<profile>/v1), so Hermes's
 *  memory stays per person. Not offered to children by default.
 *
 *  Hermes takes only a profile's own API_SERVER_KEY on /p/<profile>/, so
 *  key_env can name one variable per profile: HERMES_API_KEY_{PROFILE}.
 *  A profile without its key gets no Hermes tools. */
export class Hermes implements Connector {
  id: string;
  constructor(private cfg: HermesCfg, private env: NodeJS.ProcessEnv = process.env) { this.id = cfg.id; }
  describe() { return "Hermes: a slower, more capable agent for research and long multi-step jobs"; }

  profileFor(caller: Caller) {
    if (caller.scope.kind === "person") return caller.scope.person.hermes_profile || caller.scope.person.id;
    // FAITH's own Hermes keeps the Parents project's memory apart from the Family one.
    if (this.cfg.projects_only && caller.audience === "parents") return this.cfg.parents_profile;
    return this.cfg.household_profile;
  }

  /** The key for one profile: HERMES_API_KEY_{PROFILE} -> HERMES_API_KEY_WIZARD. */
  keyFor(profile: string) {
    return envValue(this.cfg.key_env?.replace(/\{PROFILE\}/g, profile.toUpperCase().replace(/[^A-Z0-9]/g, "_")), this.env);
  }
  /** Each profile has its own key, so a missing one means no Hermes for that profile. */
  private perProfile() { return !!this.cfg.key_env?.includes("{PROFILE}"); }

  async ping(caller: Caller) {
    const profile = this.profileFor(caller) || "default", key = this.keyFor(profile);
    const r = await call(`${this.cfg.url}/p/${encodeURIComponent(profile)}/v1/models`, { headers: key ? { Authorization: `Bearer ${key}` } : {}, timeoutMs: 10_000 });
    if (r.status >= 500 || r.status === 0) throw new ToolError(`Hermes answered ${r.status}.`);
  }

  async tools(caller: Caller): Promise<Tool[]> {
    // FAITH's own Hermes is for project work only: chats ask FAITH, threads hand Hermes the long jobs.
    if (this.cfg.projects_only && !caller.work) return [];
    if (this.cfg.owner && (caller.scope.kind !== "person" || caller.scope.person.id !== this.cfg.owner)) return [];
    const profile = this.profileFor(caller);
    if (!profile) return [];
    const key = this.keyFor(profile);
    if (!key && this.perProfile()) return [];
    return [{
      name: this.cfg.projects_only ? "hermes_project_job" : "hermes_ask", connector: this.id, write: true,
      description: "Hand a bigger job to Hermes (research, planning, long multi-step work, anything needing tools FAITH doesn't have). Write the task in full: Hermes doesn't see this conversation. Slow: only use it when the person wants that.",
      parameters: { type: "object", properties: { task: { type: "string" } }, required: ["task"], additionalProperties: false },
      run: async (a) => {
        const task = String(a?.task || "").trim(); if (!task) return { error: "task is empty" };
        const base = `${this.cfg.url}/p/${encodeURIComponent(profile)}/v1`;
        const r = await call(`${base}/chat/completions`, { method: "POST", timeoutMs: 600_000,
          headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
          body: JSON.stringify({ model: this.cfg.model, messages: [{ role: "user", content: task }] }) });
        if (!r.ok) throw new ToolError(`Hermes answered ${r.status}: ${JSON.stringify(r.body).slice(0, 200)}`);
        return { answer: String(r.body?.choices?.[0]?.message?.content || "").slice(0, 8000) };
      },
    }];
  }
}
