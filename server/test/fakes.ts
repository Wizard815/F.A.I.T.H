import { createServer, type IncomingMessage, type Server } from "node:http";
import type { AddressInfo } from "node:net";

const body = (req: IncomingMessage) => new Promise<any>((res) => { let s = ""; req.on("data", (c) => (s += c)); req.on("end", () => { try { res(s ? JSON.parse(s) : null); } catch { res(s); } }); });
async function listen(s: Server) { await new Promise<void>((r) => s.listen(0, "127.0.0.1", r)); return `http://127.0.0.1:${(s.address() as AddressInfo).port}`; }

/** An OpenAI-compatible model that follows a script: each call gets the request and returns a message. */
type Said = { content?: string; tool_calls?: { name: string; args: any }[] };
export async function fakeModel(script: (req: any, n: number) => Said | Promise<Said>) {
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
    const m = await script(b, calls.length - 1);   // a script may take its time (a slow model)
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
export async function fakeHa(states: Record<string, { state: string; attributes?: any }>, opts: { token?: string; shopping?: string[]; meals?: { cal: string; date: string; summary: string }[]; areas?: Record<string, string>; cameras?: Record<string, Buffer>; forecast?: any[] } = {}) {
  const services: { domain: string; service: string; data: any; token: string }[] = [];
  const recognized: string[] = [];
  const shopping = [...(opts.shopping || [])];
  const s = createServer(async (req, res) => {
    const token = String(req.headers.authorization || "").replace(/^Bearer /, "");
    const json = (v: unknown, code = 200) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(v)); };
    if (opts.token && token !== opts.token) return json({ message: "401: Unauthorized" }, 401);
    const u = new URL(req.url!, "http://x"), b = await body(req);
    const all = () => Object.entries(states).map(([entity_id, v]) => ({ entity_id, state: v.state, attributes: v.attributes || {} }));
    if (req.method === "GET" && u.pathname === "/api/") return json({ message: "API running." });
    const cam = u.pathname.match(/^\/api\/camera_proxy\/(.+)$/);
    if (cam) { const pic = opts.cameras?.[decodeURIComponent(cam[1])]; if (!pic) return json({ message: "not found" }, 404); res.setHeader("content-type", "image/png"); return res.end(pic); }
    // The FAITH integration's door to HA's Assist API (assist.py): describe, targets, call.
    if (u.pathname === "/api/faith/assist") {
      const name = (e: string) => states[e]?.attributes?.friendly_name || e;
      const match = (a: any) => Object.keys(states).filter((e) => (a?.name && name(e).toLowerCase() === String(a.name).toLowerCase()) || (a?.domain && [].concat(a.domain).includes(e.split(".")[0] as never) && !a?.name));
      if (b?.action === "describe") return json({ prompt: `Static Context: An overview of the areas and the devices in this smart home:\n${Object.keys(states).map((e) => `- names: ${name(e)}\n  domain: ${e.split(".")[0]}`).join("\n")}`,
        tools: ["HassTurnOn", "HassTurnOff", "GetLiveContext"].map((t) => ({ name: t, description: `${t} tool`, parameters: { type: "object", properties: { name: { type: "string" }, domain: { type: "array", items: { type: "string" } } } } })) });
      // HA's own sentence matcher (the fast path): a few English sentences, like HA's built-in agent.
      const understand = (text: string) => {
        const t = String(text || "").toLowerCase().replace(/[.!?]/g, "").trim();
        if (t === "what time is it") return { intent: "HassGetCurrentTime", args: {}, targets: [] as string[] };
        const sw = t.match(/^turn (on|off) the (.+)$/), un = t.match(/^(unlock|lock) the (.+)$/), st = t.match(/^is the (.+) (on|off|locked|unlocked)$/);
        const [intent, n] = sw ? [sw[1] === "on" ? "HassTurnOn" : "HassTurnOff", sw[2]] : un ? [un[1] === "lock" ? "HassTurnOn" : "HassTurnOff", un[2]] : st ? ["HassGetState", st[1]] : [];
        if (!intent) return null;
        const targets = match({ name: n }).sort();
        return targets.length ? { intent, args: { name: n }, targets } : null;
      };
      if (b?.action === "recognize") { recognized.push(String(b.text)); return json({ match: understand(b.text) }); }
      if (b?.action === "handle") {
        const m = understand(b.text);
        if (!m || m.intent !== b.expect?.intent || JSON.stringify(m.targets) !== JSON.stringify([...(b.expect?.targets ?? [])].sort())) return json({ handled: false });
        if (m.intent === "HassGetCurrentTime") return json({ handled: true, speech: "It's 7:15 PM" });
        if (m.intent === "HassGetState") return json({ handled: true, speech: `${name(m.targets[0])} is ${states[m.targets[0]].state}` });
        for (const e of m.targets) {
          const d = e.split(".")[0], svc = d === "lock" ? (m.intent === "HassTurnOn" ? "lock" : "unlock") : m.intent === "HassTurnOn" ? "turn_on" : "turn_off";
          services.push({ domain: d, service: svc, data: { entity_id: e, via: "sentence" }, token });
          states[e].state = svc === "lock" ? "locked" : svc === "unlock" ? "unlocked" : svc === "turn_on" ? "on" : "off";
        }
        return json({ handled: true, speech: m.intent === "HassTurnOn" ? "Turned on the light" : "Turned off the light" });
      }
      if (b?.action === "targets") return json({ targets: b.tool === "GetLiveContext" ? [] : match(b.args) });
      if (b?.action === "call") {
        if (b.tool === "GetLiveContext") return json({ result: { success: true, result: Object.entries(states).map(([e, v]) => `${name(e)}: ${v.state}`).join("\n") } });
        for (const e of match(b.args)) {
          const d = e.split(".")[0], svc = d === "lock" ? (b.tool === "HassTurnOn" ? "lock" : "unlock") : b.tool === "HassTurnOn" ? "turn_on" : "turn_off";
          services.push({ domain: d, service: svc, data: { entity_id: e, via: "assist", device_id: b.device_id }, token });
          states[e].state = svc === "lock" ? "locked" : svc === "unlock" ? "unlocked" : svc === "turn_on" ? "on" : "off";
        }
        return json({ result: { response_type: "action_done", data: { success: match(b.args).map((e) => ({ id: e, name: name(e) })) } } });
      }
    }
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
      if (m[1] === "weather" && m[2] === "get_forecasts") return json({ changed_states: [], service_response: { [b.entity_id]: { forecast: opts.forecast || [] } } });
      if (m[1] === "todo" && m[2] === "get_items") return json({ changed_states: [], service_response: { [b.entity_id]: { items: shopping.map((x) => ({ summary: x, status: "needs_action" })) } } });
      if (m[1] === "todo" && m[2] === "add_item") { shopping.push(b.item); return json([]); }
      if (m[1] === "todo" && m[2] === "update_item" && b.status === "completed") { const i = shopping.indexOf(b.item); if (i >= 0) shopping.splice(i, 1); return json([]); }
      if (states[b?.entity_id] && /turn_on|unlock|open/.test(m[2])) states[b.entity_id].state = m[2] === "unlock" ? "unlocked" : "on";
      if (states[b?.entity_id] && /turn_off|lock$/.test(m[2])) states[b.entity_id].state = m[2] === "lock" ? "locked" : "off";
      return json([]);
    }
    json({ message: "not found" }, 404);
  });
  const url = await listen(s);
  return { url, services, shopping, states, recognized, close: () => s.close() };
}

/** Enough of Mattermost's REST API for the bot: users, a team, channels, members, posts. */
export async function fakeMattermost(usernames: string[]) {
  const bot = { id: "bot1", username: "faith" };
  const users = usernames.map((u) => ({ id: `u_${u}`, username: u }));
  const team = { id: "team1", name: "family" };
  const channels = new Map<string, { id: string; name: string; type: string; members: Set<string>; delete_at: number }>();
  const posts: { channel_id: string; message: string; root_id?: string; file_ids?: string[] }[] = [];
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
    if (p === "/files" && req.method === "POST" && req.headers.authorization === "Bearer mm-token") {
      // A multipart upload: keep each file's bytes under a new id.
      const chunks: Buffer[] = []; for await (const c of req) chunks.push(c as Buffer);
      const raw = Buffer.concat(chunks), boundary = String(req.headers["content-type"]).split("boundary=")[1];
      const infos: { id: string; name: string }[] = [];
      for (const part of raw.toString("latin1").split(`--${boundary}`)) {
        const name = /filename="([^"]+)"/.exec(part)?.[1]; if (!name) continue;
        const start = part.indexOf("\r\n\r\n") + 4, mime = /Content-Type: ([^\r]+)/.exec(part)?.[1] || "application/octet-stream";
        const id = `up${files.size + 1}`; files.set(id, { mime, name, bytes: Buffer.from(part.slice(start, part.length - 2), "latin1") }); infos.push({ id, name });
      }
      res.statusCode = 201; res.setHeader("content-type", "application/json"); return res.end(JSON.stringify({ file_infos: infos }));
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

/** Enough of Immich's API: accounts by API key, faces, smart and metadata search, thumbnails,
 *  albums and share links. Each account sees only its own photos, as Immich does. */
export async function fakeImmich(accounts: Record<string, { email: string; name: string; photos: { id: string; what: string; people?: string[]; city?: string; date: string; video?: boolean }[] }>) {
  const seen: { key: string; path: string; body: any }[] = [];
  const albums: { id: string; albumName: string; key: string; assets: string[] }[] = [], links: { key: string; assetIds: string[]; expiresAt: string; by: string }[] = [];
  let smartOn = true;
  const asset = (p: any) => ({ id: p.id, type: p.video ? "VIDEO" : "IMAGE", localDateTime: `${p.date}T10:00:00.000Z`, fileCreatedAt: `${p.date}T10:00:00.000Z`,
    exifInfo: { city: p.city ?? null, country: p.city ? "USA" : null, dateTimeOriginal: `${p.date}T10:00:00.000Z`, description: null }, people: (p.people || []).map((name: string) => ({ name })) });
  const s = createServer(async (req, res) => {
    const u = new URL(req.url!, "http://x"), p = u.pathname.replace(/^\/api/, ""), key = String(req.headers["x-api-key"] || "");
    const b = req.method === "GET" ? null : await body(req);
    seen.push({ key, path: `${req.method} ${p}${u.search}`, body: b });
    const json = (v: unknown, code = 200) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(v)); };
    const acct = accounts[key];
    if (!acct) return json({ message: "Invalid API key" }, 401);
    const mine = acct.photos;
    let m;
    if (p === "/users/me") return json({ id: `user-${acct.name.toLowerCase()}`, email: acct.email, name: acct.name });
    if (p === "/search/person") { const n = String(u.searchParams.get("name") || "").toLowerCase(); const names = [...new Set(mine.flatMap((x) => x.people || []))]; return json(names.filter((x) => x.toLowerCase().startsWith(n)).map((name) => ({ id: `person-${name.toLowerCase()}`, name }))); }
    if (p === "/people") return json({ people: [...new Set(mine.flatMap((x) => x.people || []))].map((name) => ({ id: `person-${name.toLowerCase()}`, name })) });
    if (p === "/search/smart" || p === "/search/metadata") {
      if (p === "/search/smart" && !smartOn) return json({ message: "Smart search is not enabled" }, 400);
      const words = String(b.query || "").toLowerCase().split(/\W+/).filter((w) => w.length > 2 && w !== "in");
      const hits = mine.filter((x) => (!words.length || words.some((w) => x.what.includes(w) || (x.city || "").toLowerCase().includes(w)))
        && (!b.personIds?.length || b.personIds.every((id: string) => (x.people || []).some((n) => `person-${n.toLowerCase()}` === id)))
        && (!b.takenAfter || `${x.date}T10:00:00.000Z` >= b.takenAfter) && (!b.takenBefore || `${x.date}T10:00:00.000Z` <= b.takenBefore)
        && (!b.type || (b.type === "VIDEO") === !!x.video));
      return json({ albums: { items: [] }, assets: { items: hits.slice(0, b.size || 100).map(asset), count: hits.length, nextPage: null } });
    }
    if ((m = p.match(/^\/assets\/([0-9a-f-]{36})\/thumbnail$/))) {
      if (!mine.some((x) => x.id === m![1])) return json({ message: "Not found or no asset.view access" }, 400);
      res.setHeader("content-type", "image/jpeg"); return res.end(Buffer.from(`jpeg:${m[1]}`));
    }
    if ((m = p.match(/^\/assets\/([0-9a-f-]{36})$/))) { const x = mine.find((y) => y.id === m![1]); return x ? json(asset(x)) : json({ message: "Not found or no asset.read access" }, 400); }
    if (p === "/albums" && req.method === "GET") return json(albums.filter((a) => a.key === key).map(({ id, albumName }) => ({ id, albumName })));
    if (p === "/albums" && req.method === "POST") { const a = { id: `album-${albums.length + 1}`, albumName: b.albumName, key, assets: b.assetIds || [] }; albums.push(a); return json({ id: a.id, albumName: a.albumName }, 201); }
    if ((m = p.match(/^\/albums\/([^/]+)\/assets$/))) { const a = albums.find((x) => x.id === m![1] && x.key === key); if (!a) return json({ message: "no album" }, 400); a.assets.push(...b.ids); return json(b.ids.map((id: string) => ({ id, success: true }))); }
    if (p === "/shared-links" && req.method === "POST") { const l = { key: `share${links.length + 1}`, assetIds: b.assetIds, expiresAt: b.expiresAt, by: key }; links.push(l); return json({ id: l.key, key: l.key }, 201); }
    json({ message: `fake immich has no ${req.method} ${p}` }, 404);
  });
  const url = await listen(s);
  return { url, seen, albums, links, smart: (on: boolean) => { smartOn = on; }, close: () => s.close() };
}

/** Enough of ntfy for FAITH: JSON publishing to the root, with an access token.
 *  `fail` makes it answer 500 (a broken ntfy). Only `token` may write. */
export async function fakeNtfy(token = "tk_test") {
  const got: { topic: string; title?: string; message: string; priority?: number; tags?: string[]; click?: string; token: string }[] = [];
  const state = { fail: false };
  const s = createServer(async (req, res) => {
    const auth = String(req.headers.authorization || "").replace(/^Bearer /, ""), b = await body(req);
    const json = (v: unknown, code = 200) => { res.statusCode = code; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(v)); };
    if (state.fail) return json({ error: "boom" }, 500);
    if (auth !== token) return json({ code: 40301, error: "forbidden" }, 403);
    if (req.method !== "POST" || req.url !== "/" || !b?.topic) return json({ error: "bad request" }, 400);
    got.push({ ...b, token: auth });
    json({ id: String(got.length), topic: b.topic, event: "message" });
  });
  const url = await listen(s);
  return { url, got, state, close: () => s.close() };
}
