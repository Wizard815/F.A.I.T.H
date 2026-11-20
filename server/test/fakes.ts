import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";

const body = (req: IncomingMessage) => new Promise<any>((res) => { let s = ""; req.on("data", (c) => (s += c)); req.on("end", () => { try { res(s ? JSON.parse(s) : null); } catch { res(s); } }); });
async function listen(s: Server) { await new Promise<void>((r) => s.listen(0, "127.0.0.1", r)); return `http://127.0.0.1:${(s.address() as AddressInfo).port}`; }

/** An OpenAI-compatible model that follows a script: each call gets the request and returns a message. */
export async function fakeModel(script: (req: any, n: number) => { content?: string; tool_calls?: { name: string; args: any }[] }) {
  const calls: any[] = [], embeds: string[] = [];
  const stt = { text: "hello" };
  const s = createServer(async (req, res) => {
    if (req.url?.endsWith("/embeddings")) {
      // Bag-of-words vectors: texts sharing words point the same way.
      const stop = new Set(["the", "and", "for", "with", "show", "over", "that", "this", "from", "your", "item", "number"]);
      const b = await body(req), vec = (t: string) => { const v = new Array(512).fill(0); for (const w of String(t).toLowerCase().split(/[^a-z]+/).filter((x) => x.length > 2 && !stop.has(x))) { let h = 7; for (const ch of w) h = (h * 131 + ch.charCodeAt(0)) % 512; v[h] += 1; } return v; };
      embeds.push(...b.input); res.setHeader("content-type", "application/json");
      return res.end(JSON.stringify({ data: b.input.map((t: string, index: number) => ({ index, embedding: vec(t) })) }));
    }
    if (req.url?.endsWith("/audio/speech")) {
      const b = await body(req);
      if (b?.response_format === "wav") { // a real little WAV: 16 kHz mono 16-bit, the text's bytes as samples
        const pcm = Buffer.from(String(b.input).padEnd(5000, ".")), h = Buffer.alloc(44);
        h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8); h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
        h.writeUInt32LE(16000, 24); h.writeUInt32LE(32000, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
        res.setHeader("content-type", "audio/wav"); return res.end(Buffer.concat([h, pcm]));
      }
      res.setHeader("content-type", "audio/mpeg"); return res.end(Buffer.from(`mp3:${b?.input}`));
    }
    if (req.url?.endsWith("/audio/transcriptions")) { req.resume(); res.setHeader("content-type", "application/json"); return res.end(JSON.stringify({ text: stt.text })); }
    const b = await body(req); calls.push(b);
    const m = script(b, calls.length - 1);
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ choices: [{ message: { role: "assistant", content: m.content ?? null, tool_calls: m.tool_calls?.map((t, i) => ({ id: `c${calls.length}_${i}`, type: "function", function: { name: t.name, arguments: JSON.stringify(t.args) } })) } }] }));
  });
  const url = await listen(s);
  return { url: `${url}/v1`, calls, stt, embeds, close: () => s.close() };
}

export type FakeTool = { name: string; readOnly?: boolean; destructive?: boolean; description?: string; run: (args: any, token: string) => unknown };
/** A stateless MCP server; records which bearer token each call used. */
export async function fakeMcp(tools: FakeTool[]) {
  const seen: { path?: string; method: string; token: string; tool?: string; args?: any }[] = [];
  const s = createServer(async (req, res) => {
    const msg = await body(req), token = String(req.headers.authorization || "").replace(/^Bearer /, "");
    seen.push({ path: req.url, method: msg?.method, token, tool: msg?.params?.name, args: msg?.params?.arguments });
    if (msg?.id === undefined) { res.statusCode = 202; return res.end(); }
    let result: any;
    if (msg.method === "initialize") result = { protocolVersion: "2025-06-18", capabilities: { tools: {} }, serverInfo: { name: "fake", version: "1" } };
    else if (msg.method === "tools/list") result = { tools: tools.map((t) => ({ name: t.name, description: t.description ?? `${t.name} tool`, inputSchema: { type: "object", properties: {} }, annotations: { readOnlyHint: !!t.readOnly, ...(t.destructive ? { destructiveHint: true } : {}) } })) };
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
export async function fakeHa(states: Record<string, { state: string; attributes?: any }>, opts: { token?: string; shopping?: string[]; meals?: { cal: string; date: string; summary: string }[]; areas?: Record<string, string> } = {}) {
  const services: { domain: string; service: string; data: any; token: string }[] = [];
  const shopping = [...(opts.shopping || [])];
  const s = createServer(async (req, res) => {
    const token = String(req.headers.authorization || "").replace(/^Bearer /, "");
    const json = (v: unknown, code = 200) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(v)); };
    if (opts.token && token !== opts.token) return json({ message: "401: Unauthorized" }, 401);
    const u = new URL(req.url!, "http://x"), b = await body(req);
    const all = () => Object.entries(states).map(([entity_id, v]) => ({ entity_id, state: v.state, attributes: v.attributes || {} }));
    if (req.method === "GET" && u.pathname === "/api/") return json({ message: "API running." });
    if (req.method === "GET" && u.pathname === "/api/states") return json(all());
    let m = u.pathname.match(/^\/api\/states\/(.+)$/);
    if (m) { const id = decodeURIComponent(m[1]); return states[id] ? json({ entity_id: id, ...states[id], attributes: states[id].attributes || {} }) : json({ message: "Entity not found." }, 404); }
    if (u.pathname === "/api/template") {
      const one = String(b?.template || "").match(/area_name\('([^']+)'\)/);
      if (one) { res.statusCode = 200; res.setHeader("content-type", "text/plain"); return res.end((opts.areas || {})[one[1]] ?? ""); }
      return json(all().map((x) => ({ e: x.entity_id, a: x.entity_id.includes("kitchen") ? "Kitchen" : "" })));
    }
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
  const files = new Map<string, { mime: string; name: string; bytes: Buffer }>(), downloads: string[] = [];
  const s = createServer(async (req, res) => {
    const u = new URL(req.url!, "http://x"), p = u.pathname.replace(/^\/api\/v4/, "");
    let m0;
    if (req.headers.authorization === "Bearer mm-token" && (m0 = p.match(/^\/files\/([^/]+)(\/info)?$/))) {
      const f = files.get(decodeURIComponent(m0[1]));
      res.setHeader("content-type", m0[2] || !f ? "application/json" : f.mime);
      if (!f) { res.statusCode = 404; return res.end(JSON.stringify({ message: "no file" })); }
      if (m0[2]) return res.end(JSON.stringify({ id: m0[1], name: f.name, mime_type: f.mime, size: f.bytes.length }));
      downloads.push(m0[1]); return res.end(f.bytes);
    }
    const b = await body(req);
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
  return { url, bot, users, team, channels, posts, files, downloads, id: (name: string) => `u_${name}`, close: () => s.close() };
}

/** A stand-in for the voiceid service: the "audio" is text like "voice:wizard",
 *  and each name always gives the same voiceprint. */
export async function fakeVoiceId() {
  const vec = (name: string) => Array.from({ length: 16 }, (_, i) => Math.sin((name.charCodeAt(i % name.length) + 1) * (i + 1)));
  const s = createServer((req, res) => {
    const parts: Buffer[] = []; req.on("data", (c) => parts.push(c)); req.on("end", () => {
      const text = Buffer.concat(parts).toString(), m = text.match(/voice:(\w+)/);
      res.setHeader("content-type", "application/json");
      if (!m) { res.statusCode = 400; return res.end(JSON.stringify({ error: "no speech" })); }
      res.end(JSON.stringify({ embedding: vec(m[1]), seconds: 3, speech_seconds: 2.5 }));
    });
  });
  const url = await listen(s);
  return { url, close: () => s.close() };
}

/** Enough of Firefly III's API for the kid's card: asset accounts, searching
 *  transactions by external id, and recording a transfer (which moves balances). */
export async function fakeFirefly(accounts: { id: string; name: string; balance: number }[], token = "ff-token") {
  const txs: any[] = [], mode = { fail: "" as "" | "down" | "after-record" };
  const s = createServer(async (req, res) => {
    const json = (v: unknown, code = 200) => { res.statusCode = code; res.setHeader("content-type", "application/vnd.api+json"); res.end(JSON.stringify(v)); };
    if (req.headers.authorization !== `Bearer ${token}`) return json({ message: "Unauthenticated." }, 401);
    if (mode.fail === "down") return json({ message: "Server Error" }, 500);
    const u = new URL(req.url!, "http://x"), b = await body(req);
    if (req.method === "GET" && u.pathname === "/api/v1/accounts")
      return json({ data: accounts.map((a) => ({ type: "accounts", id: a.id, attributes: { name: a.name, type: "asset", current_balance: a.balance.toFixed(2), currency_code: "USD" } })), meta: { pagination: { total_pages: 1 } } });
    if (req.method === "GET" && u.pathname === "/api/v1/search/transactions") {
      const ext = (u.searchParams.get("query") || "").match(/external_id_is:"([^"]+)"/)?.[1];
      return json({ data: txs.filter((t) => t.external_id === ext).map((t) => ({ type: "transactions", id: t.id })) });
    }
    if (req.method === "POST" && u.pathname === "/api/v1/transactions") {
      const t = { id: String(txs.length + 100), ...b.transactions[0] };
      txs.push(t);
      const from = accounts.find((a) => a.id === t.source_id), to = accounts.find((a) => a.id === t.destination_id);
      if (from && to) { from.balance -= Number(t.amount); to.balance += Number(t.amount); }
      if (mode.fail === "after-record") return json({ message: "Gateway timeout" }, 504);
      return json({ data: { type: "transactions", id: t.id } });
    }
    json({ message: "not found" }, 404);
  });
  const url = await listen(s);
  return { url, txs, accounts, mode, close: () => s.close() };
}
