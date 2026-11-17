import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";

const body = (req: IncomingMessage) => new Promise<any>((res) => { let s = ""; req.on("data", (c) => (s += c)); req.on("end", () => { try { res(s ? JSON.parse(s) : null); } catch { res(s); } }); });
async function listen(s: Server) { await new Promise<void>((r) => s.listen(0, "127.0.0.1", r)); return `http://127.0.0.1:${(s.address() as AddressInfo).port}`; }

/** An OpenAI-compatible model that follows a script: each call gets the request and returns a message. */
export async function fakeModel(script: (req: any, n: number) => { content?: string; tool_calls?: { name: string; args: any }[] }) {
  const calls: any[] = [];
  const s = createServer(async (req, res) => {
    const b = await body(req); calls.push(b);
    const m = script(b, calls.length - 1);
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ choices: [{ message: { role: "assistant", content: m.content ?? null, tool_calls: m.tool_calls?.map((t, i) => ({ id: `c${calls.length}_${i}`, type: "function", function: { name: t.name, arguments: JSON.stringify(t.args) } })) } }] }));
  });
  const url = await listen(s);
  return { url: `${url}/v1`, calls, close: () => s.close() };
}

export type FakeTool = { name: string; readOnly?: boolean; run: (args: any, token: string) => unknown };
/** A stateless MCP server; records which bearer token each call used. */
export async function fakeMcp(tools: FakeTool[]) {
  const seen: { method: string; token: string; tool?: string; args?: any }[] = [];
  const s = createServer(async (req, res) => {
    const msg = await body(req), token = String(req.headers.authorization || "").replace(/^Bearer /, "");
    seen.push({ method: msg?.method, token, tool: msg?.params?.name, args: msg?.params?.arguments });
    if (msg?.id === undefined) { res.statusCode = 202; return res.end(); }
    let result: any;
    if (msg.method === "initialize") result = { protocolVersion: "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "fake", version: "1" } };
    else if (msg.method === "tools/list") result = { tools: tools.map((t) => ({ name: t.name, description: `${t.name} tool`, inputSchema: { type: "object", properties: {} }, annotations: { readOnlyHint: !!t.readOnly } })) };
    else if (msg.method === "tools/call") {
      const t = tools.find((x) => x.name === msg.params.name);
      result = t ? { content: [{ type: "text", text: JSON.stringify(await t.run(msg.params.arguments, token)) }] } : { isError: true, content: [{ type: "text", text: "no such tool" }] };
    }
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ jsonrpc: "2.0", id: msg.id, result }));
  });
  const url = await listen(s);
  return { url, seen, close: () => s.close() };
}

/** Enough of Home Assistant's REST API for FAITH. */
export async function fakeHa(states: Record<string, { state: string; attributes?: any }>, opts: { token?: string; shopping?: string[]; meals?: { cal: string; date: string; summary: string }[] } = {}) {
  const services: { domain: string; service: string; data: any; token: string }[] = [];
  const shopping = [...(opts.shopping || [])];
  const s = createServer(async (req, res) => {
    const token = String(req.headers.authorization || "").replace(/^Bearer /, "");
    const json = (v: unknown, code = 200) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(v)); };
    if (opts.token && token !== opts.token) return json({ message: "401: Unauthorized" }, 401);
    const u = new URL(req.url!, "http://x"), b = await body(req);
    const all = () => Object.entries(states).map(([entity_id, v]) => ({ entity_id, state: v.state, attributes: v.attributes || {} }));
    if (req.method === "GET" && u.pathname === "/api/states") return json(all());
    let m = u.pathname.match(/^\/api\/states\/(.+)$/);
    if (m) { const id = decodeURIComponent(m[1]); return states[id] ? json({ entity_id: id, ...states[id], attributes: states[id].attributes || {} }) : json({ message: "Entity not found." }, 404); }
    if (u.pathname === "/api/template") return json(all().map((x) => ({ e: x.entity_id, a: x.entity_id.includes("kitchen") ? "Kitchen" : "" })));
    m = u.pathname.match(/^\/api\/calendars\/(.+)$/);
    if (m) return json((opts.meals || []).filter((x) => x.cal === decodeURIComponent(m![1])).map((x) => ({ summary: x.summary, start: { date: x.date }, end: { date: x.date } })));
    m = u.pathname.match(/^\/api\/services\/([a-z_]+)\/([a-z_]+)$/);
    if (m) {
      services.push({ domain: m[1], service: m[2], data: b, token });
      if (m[1] === "todo" && m[2] === "get_items") return json({ changed_states: [], service_response: { [b.entity_id]: { items: shopping.map((x) => ({ summary: x, status: "needs_action" })) } } });
      if (m[1] === "todo" && m[2] === "add_item") { shopping.push(b.item); return json([]); }
      if (states[b?.entity_id] && /turn_on|unlock|open/.test(m[2])) states[b.entity_id].state = m[2] === "unlock" ? "unlocked" : "on";
      if (states[b?.entity_id] && /turn_off|lock$/.test(m[2])) states[b.entity_id].state = m[2] === "lock" ? "locked" : "off";
      return json([]);
    }
    json({ message: "not found" }, 404);
  });
  const url = await listen(s);
  return { url, services, shopping, states, close: () => s.close() };
}

/** Enough of Mattermost's REST API for the bot: users, a team, channels, members, posts. */
export async function fakeMattermost(usernames: string[]) {
  const bot = { id: "bot1", username: "faith" };
  const users = usernames.map((u) => ({ id: `u_${u}`, username: u }));
  const team = { id: "team1", name: "family" };
  const channels = new Map<string, { id: string; name: string; type: string; members: Set<string>; delete_at: number }>();
  const posts: { channel_id: string; message: string; root_id?: string }[] = [];
  const s = createServer(async (req, res) => {
    const u = new URL(req.url!, "http://x"), p = u.pathname.replace(/^\/api\/v4/, ""), b = await body(req);
    const json = (v: unknown, code = 200) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(v)); };
    if (req.headers.authorization !== "Bearer mm-token") return json({ message: "Invalid token" }, 401);
    let m;
    if (p === "/users/me") return json(bot);
    if ((m = p.match(/^\/teams\/name\/(.+)$/))) return m[1] === team.name ? json(team) : json({ message: "not found" }, 404);
    if (p === "/users/usernames") return json(users.filter((x) => b.includes(x.username)));
    if ((m = p.match(/^\/teams\/team1\/channels\/name\/([^/?]+)$/))) { const c = [...channels.values()].find((x) => x.name === m![1]); return c ? json({ id: c.id, name: c.name, type: c.type, delete_at: c.delete_at }) : json({ message: "not found" }, 404); }
    if (p === "/channels" && req.method === "POST") { const id = `ch_${b.name}`; channels.set(id, { id, name: b.name, type: b.type, members: new Set([bot.id]), delete_at: 0 }); return json({ id, name: b.name, type: b.type }, 201); }
    if (p === "/channels/direct") { const id = `dm_${b[1]}`; if (!channels.has(id)) channels.set(id, { id, name: id, type: "D", members: new Set(b), delete_at: 0 }); return json({ id }, 201); }
    if ((m = p.match(/^\/channels\/([^/]+)\/members$/))) {
      const c = channels.get(m[1])!;
      if (req.method === "GET") return json([...c.members].map((user_id) => ({ user_id })));
      c.members.add(b.user_id); return json({ user_id: b.user_id }, 201);
    }
    if ((m = p.match(/^\/channels\/([^/]+)\/members\/([^/]+)$/)) && req.method === "DELETE") { channels.get(m[1])!.members.delete(m[2]); return json({ status: "OK" }); }
    if (p === "/posts") { posts.push(b); return json({ id: `p${posts.length}`, ...b }, 201); }
    json({ message: `fake mattermost has no ${req.method} ${p}` }, 404);
  });
  const url = await listen(s);
  return { url, bot, users, team, channels, posts, id: (name: string) => `u_${name}`, close: () => s.close() };
}
