import { envValue, glob, isKid, personEnv, type McpConnector as McpCfg } from "../config.js";
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

const NO_TOKEN = "\u0000no-token";

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

  /** The server's address (from url_env when the address itself is the secret). */
  url() { return (this.cfg.url_env && envValue(this.cfg.url_env, this.env)) || this.cfg.url; }

  tokenFor(caller: Caller) {
    if (this.cfg.auth === "none") return NO_TOKEN;
    if (caller.scope.kind === "person") return envValue(personEnv(this.cfg.person_token_env, caller.scope.person.id), this.env);
    if (caller.audience === "parents") return envValue(this.cfg.parents_token_env, this.env) ?? envValue(this.cfg.household_token_env, this.env);
    return envValue(this.cfg.household_token_env, this.env);
  }
  private client(token: string) {
    const url = this.url(), k = sha256(`${url}\n${token}`);
    if (/from-env\.invalid/.test(url)) throw new ToolError(`${this.id}: ${this.cfg.url_env} is empty.`);
    let c = this.clients.get(k);
    if (!c) { c = new McpClient(url, token === NO_TOKEN ? undefined : token); this.clients.set(k, c); }
    return { c, k };
  }
  publicName(name: string) {
    const prefix = this.cfg.prefix ?? `${this.id}_`;
    const n = !prefix || name.startsWith(prefix) ? name : `${prefix}${name}`;
    return n.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64);
  }

  async ping(caller: Caller) {
    const token = this.tokenFor(caller);
    if (!token) throw new ToolError("no token for this view");
    const { c, k } = this.client(token);
    const tools = await c.tools();
    this.cache.set(k, { at: Date.now(), tools });
    const wrong = await this.wrongToken(caller, c, k, tools);
    if (wrong) throw new ToolError(wrong);
  }

  // ---- Is this the right token for this view? (the wiki's whoami says whose it is)
  private identities = new Map<string, { at: number; who: { kind: string; id: string } | null }>();
  private warned = new Set<string>();
  /** Who the server says a token is, from whoami's first line: "You are acting for: Sam (member, id sam)."
   *  null when the server has no whoami, or answers in another shape (then nothing is checked). */
  private async identity(c: McpClient, k: string, tools: McpTool[]) {
    if (this.cfg.check_identity === false || !tools.some((t) => t.name === "whoami")) return null;
    const hit = this.identities.get(k);
    if (hit && Date.now() - hit.at < 10 * 60_000) return hit.who;
    const r = await c.call("whoami", {});
    const m = /acting for: .*?\(([\w-]+), id ([\w-]+)\)/.exec(r.text || "");
    const who = m ? { kind: m[1], id: m[2] } : null;
    if (!who && this.cfg.check_identity) throw new ToolError(`${this.id} didn't say whose token this is (whoami), so FAITH won't use it.`);
    this.identities.set(k, { at: Date.now(), who });
    return who;
  }
  /** Why this token mustn't be used for this caller's view, or null. Privacy comes from tokens:
   *  a person's view gets that person's own token, a shared view a shared agent's, and never the master key. */
  private async wrongToken(caller: Caller, c: McpClient, k: string, tools: McpTool[]): Promise<string | null> {
    if (this.cfg.auth === "none") return null;
    const who = await this.identity(c, k, tools);
    if (!who) return null;
    const env = caller.scope.kind === "person" ? personEnv(this.cfg.person_token_env, caller.scope.person.id) : caller.audience === "parents" && this.cfg.parents_token_env ? this.cfg.parents_token_env : this.cfg.household_token_env;
    if (who.kind === "master") return `${env} is ${this.id}'s master key, which reads everyone's notes. FAITH never uses it: give this view its own token.`;
    if (caller.scope.kind === "person") {
      const p = caller.scope.person;
      if (who.kind === "admin") return `${env} is an admin token: it reads every person's notes, so ${p.name}'s chats could show someone else's. Issue it as a member (family-setup.mjs token ${p.id} --label faith --as member).`;
      if (who.kind !== "member" && who.kind !== "child") return `${env} is a ${who.kind} token, not ${p.name}'s own. Give ${p.name} their own (family-setup.mjs token ${p.id}).`;
      if (who.id !== p.id) return `${env} belongs to ${who.id}, not ${p.name}: ${p.name} would see ${who.id}'s notes. Give ${p.name} their own token.`;
      if (isKid(p.role) && who.kind !== "child") return `${p.name} is a kid in FAITH (${p.role}) but not a child in ${this.id}, so they could read the grown-ups' notes. Make them a child there (role: child).`;
      return null;
    }
    if (who.kind !== "shared" && who.kind !== "shared-parents") return `${env} is ${who.kind === "member" || who.kind === "child" ? `${who.id}'s own` : `a ${who.kind}`} token, so the shared view would see private notes. Use a shared agent's token (family-setup.mjs add-shared).`;
    if (who.kind === "shared-parents" && caller.audience !== "parents") return `${env} is the grown-ups' token, so the whole family (children too) would see the parents' notes. Use the family's shared agent here.`;
    return null;
  }

  async tools(caller: Caller): Promise<Tool[]> {
    const token = this.tokenFor(caller);
    if (!token) return [];
    const { c, k } = this.client(token);
    let hit = this.cache.get(k);
    if (!hit || Date.now() - hit.at > this.ttlMs) { hit = { at: Date.now(), tools: await c.tools() }; this.cache.set(k, hit); }
    // A token that's wrong for this view offers nothing, and says why once (the integrations watch shows it too).
    const wrong = await this.wrongToken(caller, c, k, hit.tools);
    if (wrong) {
      if (!this.warned.has(k + wrong)) { this.warned.add(k + wrong); console.warn(`${this.id}: ${wrong}`); }
      return [];
    }
    // A server may say, in its own words, what a change would do: a read-only
    // preview_change {tool, arguments} -> {what} or {error} (Coinpile's "act" tokens).
    const previews = hit.tools.some((x) => x.name === "preview_change" && isReadOnly(x));
    const preview = async (name: string, args: any) => {
      let r; try { r = await c.call("preview_change", { tool: name, arguments: args && typeof args === "object" ? args : {} }); } catch { return null; }
      let v: any = r.structured; if (v === undefined) try { v = JSON.parse(r.text || ""); } catch { v = undefined; }
      if (v?.error) throw new ToolError(`${this.id} won't do that: ${String(v.error).slice(0, 300)}`);   // refused before anyone is asked
      return !r.isError && typeof v?.what === "string" ? v.what.slice(0, 300) : null;
    };
    return hit.tools
      .filter((t) => !this.cfg.tools || this.cfg.tools.some((p) => glob(p, t.name)))
      .map((t) => ({
        name: this.publicName(t.name), connector: this.id,
        description: (t.description || t.name).slice(0, 1024),
        parameters: t.inputSchema && typeof t.inputSchema === "object" ? t.inputSchema : { type: "object", properties: {} },
        write: !isReadOnly(t),
        // Destructive tools (delete, restart, remove...) always wait for a Yes from the person asking.
        strict: t.annotations?.destructiveHint ? () => true : undefined,
        confirm: t.annotations?.destructiveHint ? async (args: any) => (previews && (await preview(t.name, args))) ||
          `${(t.description || t.name).split(/[.\n]/)[0].slice(0, 120)} (${t.name}${args && Object.keys(args).length ? ` ${JSON.stringify(args).slice(0, 160)}` : ""})` : undefined,
        always: this.cfg.always?.some((p) => glob(p, t.name)) || undefined,
        media: this.cfg.heard || undefined,   // heard (Omi): what comes back is context, never a request
        run: async (args: any) => {
          args = args && typeof args === "object" ? { ...args } : {};
          // A note goes in the notes of whoever is telling FAITH, whatever the model chose.
          const teller = caller.speaker?.id ?? (caller.scope.kind === "person" ? caller.scope.person.id : undefined);
          if (teller && this.cfg.teller_tools?.some((p) => glob(p, t.name)) && String(args.person ?? "").toLowerCase() !== "household") args.person = teller;
          const r = await c.call(t.name, args);
          if (r.isError) return { error: r.text || "the tool failed" };
          return r.structured ?? r.text;
        },
      }));
  }
}
