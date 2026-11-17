import { anyGlob, type Config } from "../config.js";
import { policyName, type Caller } from "../scope.js";
import { Hermes } from "./hermes.js";
import { HomeAssistant } from "./homeassistant.js";
import { McpConnector } from "./mcp.js";
import { Studio } from "./studio.js";
import type { Connector, Tool } from "./types.js";

export type ToolSet = { tools: Tool[]; sources: string[]; problems: string[] };

/** All configured sources, and the policy that decides which tools a caller gets:
 *   1. the connector must allow the caller's role (or "household"),
 *   2. the source must have a token for the caller's scope (no token, no tool),
 *   3. the role's deny list and write rules filter what's left.
 *  What a token can *see* is enforced by the backend, not here. */
export class Registry {
  connectors: Connector[] = [];
  ha?: HomeAssistant;
  constructor(private cfg: () => Config, env: NodeJS.ProcessEnv = process.env) {
    for (const c of cfg().connectors) {
      if (c.type === "mcp") this.connectors.push(new McpConnector(c, env));
      else if (c.type === "homeassistant") { this.ha = new HomeAssistant(c, cfg, env); this.connectors.push(this.ha); }
      else if (c.type === "hermes") this.connectors.push(new Hermes(c, env));
      else if (c.type === "studio") this.connectors.push(new Studio(c, env));
    }
  }

  allowedConnector(caller: Caller, id: string) {
    const cfg = this.cfg(), role = policyName(caller.scope);
    const c = cfg.connectors.find((x) => x.id === id);
    if (!c) return false;
    if (c.roles && !c.roles.includes(role)) return false;
    const pol = cfg.roles[role];
    return !pol.connectors || pol.connectors.includes(id);
  }

  /** Is this write allowed outright for the caller's role? */
  writeAllowed(caller: Caller, name: string) {
    const pol = this.cfg().roles[policyName(caller.scope)];
    return pol.writes === "allow" || pol.writes === "approve" || (pol.writes === "allowlist" && anyGlob(pol.allow_writes, name));
  }

  async toolsFor(caller: Caller): Promise<ToolSet> {
    const pol = this.cfg().roles[policyName(caller.scope)];
    const out: Tool[] = [], sources: string[] = [], problems: string[] = [];
    await Promise.all(this.connectors.map(async (c) => {
      if (!this.allowedConnector(caller, c.id)) return;
      try {
        const ts = await c.tools(caller);
        if (ts.length) sources.push(c.id);
        for (const t of ts) {
          if (anyGlob(pol.deny_tools, t.name)) continue;
          if (t.write && !this.writeAllowed(caller, t.name)) continue;
          out.push(t.write && pol.writes === "approve" && !anyGlob(pol.approve_skip, t.name) ? { ...t, approval: true } : t);
        }
      } catch (e: any) { problems.push(`${c.id}: ${e.message}`); }
    }));
    // Stable order (connector order from the config, then the server's order) keeps prompts cacheable.
    const order = new Map(this.connectors.map((c, i) => [c.id, i]));
    out.sort((a, b) => (order.get(a.connector)! - order.get(b.connector)!));
    const seen = new Set<string>();
    return { tools: out.filter((t) => (seen.has(t.name) ? false : (seen.add(t.name), true))), sources: sources.sort((a, b) => order.get(a)! - order.get(b)!), problems };
  }

  describe(ids: string[]) { return this.connectors.filter((c) => ids.includes(c.id)).map((c) => `- ${c.describe()}`).join("\n"); }
}
