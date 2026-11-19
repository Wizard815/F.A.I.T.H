import { envValue, type HermesConnector as HermesCfg } from "../config.js";
import type { Caller } from "../scope.js";
import { call, ToolError, type Connector, type Tool } from "./types.js";

/** Hermes (hermes-agent's API server) as a helper for bigger jobs: research,
 *  long multi-step work, things that need Hermes's own skills and tools. Each
 *  person reaches their own Hermes profile (/p/<profile>/v1), so Hermes's
 *  memory stays per person. Not offered to children by default. */
export class Hermes implements Connector {
  id: string;
  constructor(private cfg: HermesCfg, private env: NodeJS.ProcessEnv = process.env) { this.id = cfg.id; }
  describe() { return "Hermes: a slower, more capable agent for research and long multi-step jobs"; }

  profileFor(caller: Caller) {
    return caller.scope.kind === "person" ? caller.scope.person.hermes_profile || caller.scope.person.id : this.cfg.household_profile;
  }

  async ping(caller: Caller) {
    const profile = this.profileFor(caller) || "default", key = envValue(this.cfg.key_env, this.env);
    const r = await call(`${this.cfg.url}/p/${encodeURIComponent(profile)}/v1/models`, { headers: key ? { Authorization: `Bearer ${key}` } : {}, timeoutMs: 10_000 });
    if (r.status >= 500 || r.status === 0) throw new ToolError(`Hermes answered ${r.status}.`);
  }

  async tools(caller: Caller): Promise<Tool[]> {
    const profile = this.profileFor(caller);
    if (!profile) return [];
    const key = envValue(this.cfg.key_env, this.env);
    return [{
      name: "hermes_ask", connector: this.id, write: true,
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
