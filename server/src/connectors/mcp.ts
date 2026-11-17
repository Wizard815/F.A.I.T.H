import { envValue, glob, personEnv, type McpConnector as McpCfg } from "../config.js";
import { sha256 } from "../secrets.js";
import type { Caller } from "../scope.js";
import { ToolError, type Connector, type Tool } from "./types.js";

export type McpTool = { name: string; description?: string; inputSchema?: any; annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean } };

/** JSON-RPC over MCP Streamable HTTP with a bearer token. Answers may be JSON
 *  or an SSE stream. Stateless servers (the wiki bridge, ALLGlance, Orb,
 *  Coinpile, Argos) ignore the session id; stateful ones get it back. */
export class McpClient {
  private session = ""; private nextId = 1; private ready = false;
  constructor(private url: string, private token: string | undefined, private timeoutMs = 60000) {}

  private async post(msg: any, retry = true): Promise<any> {
    let r: Response;
    try {
      r = await fetch(this.url, { method: "POST", signal: AbortSignal.timeout(this.timeoutMs), headers: {
        "Content-Type": "application/json", Accept: "application/json, text/event-stream", "MCP-Protocol-Version": "2025-06-18",
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}), ...(this.session ? { "Mcp-Session-Id": this.session } : {}) }, body: JSON.stringify(msg) });
    } catch (e: any) { throw new ToolError(`Couldn't reach ${new URL(this.url).host} (${e?.name === "TimeoutError" ? "timed out" : e?.cause?.code || e?.message}).`); }
    if (r.status === 404 && this.session && retry) { this.session = ""; this.ready = false; await this.init(); return this.post(msg, false); }
    if (r.status === 401 || r.status === 403) throw new ToolError(`${new URL(this.url).host} refused FAITH's token (${r.status}). Check the token in FAITH's .env.`);
    if (!r.ok && r.status !== 202) throw new ToolError(`${new URL(this.url).host} answered ${r.status}: ${(await r.text()).slice(0, 160)}`);
    const sid = r.headers.get("mcp-session-id"); if (sid) this.session = sid;
    if (msg.id === undefined || r.status === 202) return null;
    const type = r.headers.get("content-type") || "", text = await r.text();
    const msgs = type.includes("text/event-stream")
      ? text.split(/\r?\n/).filter((l) => l.startsWith("data:")).map((l) => { try { return JSON.parse(l.slice(5).trim()); } catch { return null; } })
      : [(() => { try { return JSON.parse(text || "null"); } catch { return null; } })()];
    const res = msgs.find((m) => m && m.id === msg.id);
    if (!res) throw new ToolError(`${new URL(this.url).host} sent no answer.`);
    if (res.error) throw new ToolError(`${new URL(this.url).host} refused: ${res.error.message || JSON.stringify(res.error)}`);
    return res.result;
  }
  private async init() {
    if (this.ready) return;
    await this.post({ jsonrpc: "2.0", id: this.nextId++, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "faith", version: "0.1.0" } } });
    await this.post({ jsonrpc: "2.0", method: "notifications/initialized" });
    this.ready = true;
  }
  async tools(): Promise<McpTool[]> { await this.init(); return (await this.post({ jsonrpc: "2.0", id: this.nextId++, method: "tools/list", params: {} }))?.tools || []; }
  async call(name: string, args: Record<string, unknown>) {
    await this.init();
    const r = await this.post({ jsonrpc: "2.0", id: this.nextId++, method: "tools/call", params: { name, arguments: args } });
    const text = (r?.content || []).map((c: any) => (c.type === "text" ? c.text : JSON.stringify(c))).join("\n");
    return { isError: !!r?.isError, text, structured: r?.structuredContent };
  }
}

const READ_NAME = /(^|_)(get|list|search|read|query|find|who|whoami|who_is|context|context_for|notes|lookup|status|summary|health|ping|day|filter_syntax)(_|$)/;

/** Is a tool read-only? The server's annotation wins; otherwise guess from the name. */
export function isReadOnly(t: McpTool) {
  if (t.annotations?.readOnlyHint === true) return true;
  if (t.annotations?.readOnlyHint === false || t.annotations?.destructiveHint) return false;
  return READ_NAME.test(t.name) && !/(create|update|add|set|delete|remove|log|capture|write|do_action|complete|move|schedule)/.test(t.name);
}

/** Any MCP server, reached with the caller's token: the household (blanket)
 *  token when nobody is signed in, the person's own token when they are. No
 *  token for that scope means the source simply isn't offered. */
export class McpConnector implements Connector {
  id: string;
  private clients = new Map<string, McpClient>();
  private cache = new Map<string, { at: number; tools: McpTool[] }>();
  constructor(private cfg: McpCfg, private env: NodeJS.ProcessEnv = process.env, private ttlMs = 5 * 60_000) { this.id = cfg.id; }

  describe() { return this.cfg.description || `${this.id} (MCP)`; }

  tokenFor(caller: Caller) {
    return caller.scope.kind === "person" ? envValue(personEnv(this.cfg.person_token_env, caller.scope.person.id), this.env) : envValue(this.cfg.household_token_env, this.env);
  }
  private client(token: string) {
    const k = sha256(token);
    let c = this.clients.get(k);
    if (!c) { c = new McpClient(this.cfg.url, token); this.clients.set(k, c); }
    return { c, k };
  }
  publicName(name: string) {
    const prefix = this.cfg.prefix ?? `${this.id}_`;
    const n = !prefix || name.startsWith(prefix) ? name : `${prefix}${name}`;
    return n.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  }

  async tools(caller: Caller): Promise<Tool[]> {
    const token = this.tokenFor(caller);
    if (!token) return [];
    const { c, k } = this.client(token);
    let hit = this.cache.get(k);
    if (!hit || Date.now() - hit.at > this.ttlMs) { hit = { at: Date.now(), tools: await c.tools() }; this.cache.set(k, hit); }
    return hit.tools
      .filter((t) => !this.cfg.tools || this.cfg.tools.some((p) => glob(p, t.name)))
      .map((t) => ({
        name: this.publicName(t.name), connector: this.id,
        description: (t.description || t.name).slice(0, 1024),
        parameters: t.inputSchema && typeof t.inputSchema === "object" ? t.inputSchema : { type: "object", properties: {} },
        write: !isReadOnly(t),
        run: async (args: any) => {
          const r = await c.call(t.name, args && typeof args === "object" ? args : {});
          if (r.isError) return { error: r.text || "the tool failed" };
          return r.structured ?? r.text;
        },
      }));
  }
}
