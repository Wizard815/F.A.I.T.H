import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { parseFeed, clearNewsCache } from "../src/board/news.js";
import { localNow } from "../src/routines.js";
import { fakeHa, fakeModel } from "./fakes.js";

// The info board (docs/dashboard.md): Pondering Orb's Main and Daily pages, per person,
// through FAITH. Its Golem is FAITH's own agent and tools.
let ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App;
let script: (req: any) => any = () => ({ content: "ok" });
const servers: Server[] = [];
const serve = async (h: (url: string, auth: string) => { status?: number; type?: string; body: string }) => {
  const s = createServer((req, res) => { const r = h(req.url || "/", String(req.headers.authorization || "")); res.statusCode = r.status ?? 200; res.setHeader("content-type", r.type ?? "application/json"); res.end(r.body); });
  await new Promise<void>((r) => s.listen(0, "127.0.0.1", r)); servers.push(s);
  return `http://127.0.0.1:${(s.address() as AddressInfo).port}`;
};
const RSS = `<?xml version="1.0"?><rss><channel><title>Town News</title><link>http://news.example/</link>
  <item><title>Library opens late on Fridays</title><link>http://news.example/1</link><pubDate>Mon, 23 Nov 2026 08:00:00 GMT</pubDate><description>&lt;p&gt;From December.&lt;/p&gt;</description></item>
  <item><title>Road works on Main Street</title><link>http://news.example/2</link><pubDate>Tue, 24 Nov 2026 08:00:00 GMT</pubDate></item>
  <item><title>No link here</title><link>javascript:alert(1)</link></item>
</channel></rss>`;
let feedUrl = "", orbUrl = "", kumaUrl = "";

before(async () => {
  ha = await fakeHa({ "weather.home": { state: "partlycloudy", attributes: { friendly_name: "Home", temperature: 41.6, temperature_unit: "°F", humidity: 70, wind_speed: 8, wind_speed_unit: "mph" } } },
    { forecast: [{ datetime: "2026-11-25T12:00:00Z", condition: "rainy", temperature: 45, templow: 33, precipitation_probability: 80 }] });
  model = await fakeModel((req) => script(req));
  feedUrl = `${await serve(() => ({ type: "application/rss+xml", body: RSS }))}/rss`;
  orbUrl = await serve((url, auth) => {
    if (auth !== "Bearer orb-sam") return { status: 401, body: JSON.stringify({ error: "Sign in." }) };
    if (url === "/api/c/projects") return { body: JSON.stringify([{ id: "p1", name: "Treehouse", status: "active", next: "Buy screws", fav: true }, { id: "p2", name: "Old idea", status: "paused", archived: true }]) };
    if (url === "/api/c/logs") return { body: JSON.stringify([{ id: "l1", project: "Treehouse", text: "Cut the floor boards", date: "2026-11-20", by: "you" }, { id: "l2", project: "Gone", text: "Tidied", date: "2026-11-21" }]) };
    return { status: 404, body: "{}" };
  });
  kumaUrl = await serve((url) => url.includes("heartbeat")
    ? { body: JSON.stringify({ heartbeatList: { 1: [{ status: 1, ping: 12 }], 2: [{ status: 0, ping: null }] }, uptimeList: { "1_24": 0.999, "2_24": 0.5 } }) }
    : url.endsWith("/home") ? { body: JSON.stringify({ publicGroupList: [{ name: "Home", monitorList: [{ id: 1, name: "FAITH" }, { id: 2, name: "Printer" }] }] }) } : { status: 404, body: "{}" });
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }, { id: "robin", name: "Robin", role: "child" }],
    connectors: [
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", expose: { domains: ["light"] } },
      { id: "orb", type: "mcp", url: `${orbUrl}/mcp`, person_token_env: "ORB_TOKEN_{ID}", roles: ["admin", "adult"] },
    ],
    dashboard: { cards: [{ id: "approvals", title: "Waiting", builtin: "approvals" }] },
    board: { weather_entity: "weather.home", news: { feeds: [feedUrl] }, uptime: { url: kumaUrl, slug: "home" }, brief: { people: ["sam"] } },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha", ORB_TOKEN_SAM: "orb-sam" } });
});
after(async () => { await A.app.close(); ha.close(); model.close(); for (const s of servers) s.close(); });
const as = (token: string) => ({ authorization: `Bearer ${token}` });
let sam = "", robin = "", wizard = "";
const sse = (body: string) => body.split("\n\n").filter((l) => l.startsWith("data:")).map((l) => JSON.parse(l.slice(5)));
const toolNames = (req: any) => (req.tools || []).map((t: any) => t.function.name) as string[];

test("board: settings are checked", () => {
  const base = { people: [{ id: "sam", name: "Sam", role: "adult" }] };
  assert.throws(() => parseConfig({ ...base, board: { weather_entity: "sensor.temp" } }, {}), /weather\.\* entity/);
  assert.throws(() => parseConfig({ ...base, board: { news: { feeds: ["ftp://x"] } } }, {}), /http/);
  assert.throws(() => parseConfig({ ...base, board: { brief: { people: ["nobody"] } } }, {}), /nobody/);
  assert.throws(() => parseConfig({ ...base, board: { uptime: { url: "http://kuma:3001" } } }, {}), /slug/);
  const d = parseConfig(base, {}).board;
  assert.deepEqual([d.weather_entity, d.news.feeds, d.uptime, d.brief.people, d.system.roles], ["", [], undefined, [], ["admin"]], "nothing that reaches out is on by default");
});

test("board: news feeds are read like Orb read them, and only http links survive", () => {
  const items = parseFeed(RSS);
  assert.deepEqual(items.map((i) => i.title), ["Road works on Main Street", "Library opens late on Fridays"]);
  assert.equal(items[1].summary, "From December.");
  assert.equal(items[0].source, "Town News");
});

test("board: a person sees their own projects, log and brief; the household sees only shared parts", async () => {
  sam = A.auth.addToken("client", "sam-laptop", "sam");
  robin = A.auth.addToken("client", "robin-tablet", "robin");
  wizard = A.auth.addToken("client", "wizard-desk", "wizard");
  const add = await A.app.inject({ method: "POST", url: "/api/board/projects", headers: as(sam), payload: { name: "Garden shed", status: "active", next: "Order the timber" } });
  assert.equal(add.statusCode, 200, add.body);
  const log = await A.app.inject({ method: "POST", url: "/api/board/log", headers: as(sam), payload: { text: "Cleared the old shed", project: "garden shed" } });
  assert.equal(log.statusCode, 200, log.body);
  assert.equal(log.json().entry.project, "Garden shed");
  assert.equal((await A.app.inject({ method: "POST", url: "/api/board/log", headers: as(sam), payload: { text: "x".repeat(500) } })).statusCode, 400, "too long is refused, not cut");
  const audit = A.db.prepare("SELECT who, tool, ok FROM audit WHERE tool LIKE 'board_%'").all() as any[];
  assert.deepEqual(audit.map((a) => `${a.who.split("@")[0]} ${a.tool} ${a.ok}`), ["sam board_project_add 1", "sam board_log_add 1", "sam board_log_add 0"], "changes from the app go through the action log, refused ones too");

  clearNewsCache();
  const v = (await A.app.inject({ url: "/api/board", headers: as(sam) })).json();
  assert.equal(v.person.id, "sam");
  assert.deepEqual(v.projects.map((p: any) => [p.name, p.status, p.last]), [["Garden shed", "active", "Cleared the old shed"]]);
  assert.deepEqual(v.log.map((l: any) => l.text), ["Cleared the old shed"]);
  assert.equal(v.weather.temperature, 42);
  assert.equal(v.weather.condition, "partlycloudy");
  assert.deepEqual(v.weather.days[0], { date: "2026-11-25", condition: "rainy", high: 45, low: 33, rain: 80 });
  assert.equal(v.news.items.length, 2);
  assert.equal(v.uptime, null, "uptime is for admins (board.uptime.roles)");
  assert.equal(v.system, null);

  const w = (await A.app.inject({ url: "/api/board", headers: as(wizard) })).json();
  assert.deepEqual(w.projects, [], "Wizard doesn't see Sam's projects");
  assert.deepEqual(w.log, []);
  assert.deepEqual([w.uptime.up, w.uptime.down, w.uptime.monitors[1].uptime24], [1, 1, 50]);
  assert.ok(w.system.cores >= 1);

  const ha = A.auth.addToken("ha", "ha-board");
  const h = (await A.app.inject({ url: "/api/board", headers: as(ha) })).json();
  assert.deepEqual([h.person, h.projects, h.log, h.brief], [null, null, null, null], "the household view has no one's projects, log or brief");
  assert.equal(h.weather.temperature, 42, "but it has the weather");
  assert.equal((await A.app.inject({ method: "POST", url: "/api/board/log", headers: as(ha), payload: { text: "x" } })).statusCode, 401);
});

test("board: a child's changes follow the child rules; group chats get no board tools", async () => {
  const r = await A.app.inject({ method: "POST", url: "/api/board/log", headers: as(robin), payload: { text: "Built a fort" } });
  assert.equal(r.statusCode, 403, "board_log_add isn't on the children's allowlist");
  const names = async (c: any) => (await A.registry.toolsFor(c)).tools.map((t) => t.name).filter((n) => n.startsWith("board_"));
  const samP = A.registry["cfg"]().people.find((p: any) => p.id === "sam")!;
  assert.deepEqual(await names({ scope: { kind: "household" }, channel: "mattermost", audience: "family", speaker: samP, label: "family chat" }), ["board_weather", "board_news"]);
  assert.ok((await names({ scope: { kind: "person", person: samP }, channel: "personal", label: "sam" })).includes("board_log_add"));
});

test("board: FAITH (the Golem's job now) logs work from a chat, through its tools", async () => {
  let k = 0;
  script = (req) => {
    if (k++ === 0) { assert.ok(toolNames(req).includes("board_log_add")); return { tool_calls: [{ name: "board_log_add", args: { text: "Painted the shed door", project: "Garden shed" } }] }; }
    return { content: "Logged it on Garden shed." };
  };
  const ev = sse((await A.app.inject({ method: "POST", url: "/api/chat", headers: as(sam), payload: { text: "log that I painted the shed door" } })).body);
  assert.equal(ev.at(-1).text, "Logged it on Garden shed.");
  const v = (await A.app.inject({ url: "/api/board", headers: as(sam) })).json();
  assert.equal(v.log[0].text, "Painted the shed door");
  assert.equal(v.log[0].by, "faith");
  // A change from the board keeps the chat: the app's Ask still opens on it.
  assert.equal((await A.app.inject({ method: "POST", url: "/api/board/log", headers: as(sam), payload: { text: "Swept up" } })).statusCode, 200);
  const latest = (await A.app.inject({ url: "/api/chat/latest", headers: as(sam) })).json();
  assert.equal(latest.messages.at(-1).content, "Logged it on Garden shed.");
});

test("board: the morning brief is written by FAITH from the board, reading only, and kept for the day", async () => {
  let seen: any;
  script = (req) => { seen = req; return { content: "Good morning, Sam. 42°F and partly cloudy.\n\n**Projects**\n- Garden shed: order the timber" }; };
  const r = await A.app.inject({ method: "POST", url: "/api/board/brief", headers: as(sam) });
  assert.equal(r.statusCode, 200, r.body);
  assert.match(r.json().text, /Good morning, Sam/);
  assert.ok(!toolNames(seen).some((n) => /_add|_update|message_send|points_award/.test(n)), `no tool that changes anything: ${toolNames(seen).join(", ")}`);
  assert.ok(toolNames(seen).includes("board_projects"), "but it can look things up");
  const system = String(seen.messages[0].content);
  assert.match(system, /Garden shed/); assert.match(system, /Road works on Main Street/);
  const v = (await A.app.inject({ url: "/api/board", headers: as(sam) })).json();
  assert.equal(v.brief.day, v.day);
  assert.match(v.brief.text, /order the timber/);
  // Only board.brief.people get one on the schedule, once a day.
  const now = localNow(new Date()), hhmm = `${String(Math.floor(now.minutes / 60)).padStart(2, "0")}:${String(now.minutes % 60).padStart(2, "0")}`;
  A.registry["cfg"]().board.brief.time = hhmm;
  assert.deepEqual(A.board.due().map((p) => p.id), [], "Sam's is written today; Wizard and Robin aren't on the list");
});

test("board: moving over from Pondering Orb, with the person's own Orb token", async () => {
  const r = await A.app.inject({ method: "POST", url: "/api/board/import", headers: as(sam), payload: { from: "orb" } });
  assert.equal(r.statusCode, 200, r.body);
  assert.deepEqual([r.json().projects, r.json().logs], [2, 2]);
  const again = (await A.app.inject({ method: "POST", url: "/api/board/import", headers: as(sam), payload: { from: "orb" } })).json();
  assert.deepEqual([again.projects, again.logs], [0, 0], "nothing twice");
  const s = A.board.store;
  assert.deepEqual(s.projects("sam").map((p) => p.name).sort(), ["Garden shed", "Treehouse"], "the archived one is kept, out of sight");
  assert.equal(s.log("sam", { project: "Treehouse" })[0].text, "Cut the floor boards");
  assert.ok(s.log("sam", { project: "General" }).some((l) => l.text === "Tidied"), "a log for a project Orb no longer has goes to General");
  // PATCH, or POST for apps that can't send PATCH.
  assert.equal((await A.app.inject({ method: "POST", url: "/api/board/projects/treehouse", headers: as(sam), payload: { status: "shipped", starred: false } })).statusCode, 200);
  assert.deepEqual([s.project("sam", "Treehouse")!.status, s.project("sam", "Treehouse")!.fav], ["shipped", false]);
  assert.equal((await A.app.inject({ method: "PATCH", url: "/api/board/projects/Treehouse", headers: as(sam), payload: { status: "done" } })).statusCode, 400, "statuses are Orb's five");
  const w = await A.app.inject({ method: "POST", url: "/api/board/import", headers: as(wizard), payload: { from: "orb" } });
  assert.equal(w.statusCode, 400, "Wizard has no Orb token here, and never borrows Sam's");
  assert.match(w.json().error, /ORB_TOKEN_WIZARD/);
});
