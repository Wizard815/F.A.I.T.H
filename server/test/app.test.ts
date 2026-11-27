import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeHa, fakeMcp, fakeModel } from "./fakes.js";

// A family of three, a wiki and ALLGlance that answer differently per token, a
// Home Assistant with a light, a lock and Mealie's lists, and a scripted model.
let wiki: Awaited<ReturnType<typeof fakeMcp>>, allg: Awaited<ReturnType<typeof fakeMcp>>, ha: Awaited<ReturnType<typeof fakeHa>>;
let model: Awaited<ReturnType<typeof fakeModel>>, A: App;
let script: (req: any, n: number) => any = () => ({ content: "hi" });
const env = { WIKI_TOKEN_HOUSEHOLD: "w-house", WIKI_TOKEN_WIZARD: "w-wiz", WIKI_TOKEN_KID: "w-kid", ALLG_HOUSEHOLD: "a-house", ALLG_WIZARD: "a-wiz", HA_TOKEN: "ha-tok" };

before(async () => {
  wiki = await fakeMcp([
    { name: "whoami", readOnly: true, run: (_a, t) => ({ token: t }) },
    { name: "notes_search", readOnly: true, run: (_a, t) => ({ results: t === "w-house" ? ["Shared: trip plan"] : ["Shared: trip plan", "Private: ring shopping"] }) },
    { name: "context_for", readOnly: true, run: (a) => ({ profile: `profile of ${a.person}` }) },
    { name: "memory_log", run: () => ({ ok: true }) },
  ]);
  allg = await fakeMcp([
    { name: "allglance_get_day", readOnly: true, run: (a, t) => ({ blocks: [{ title: t === "a-house" ? "Family dinner" : "Dentist (private)", start: "2026-11-17T18:00" }], owner: a.owner_id ?? null }) },
    { name: "allglance_list_chores", readOnly: true, run: () => ({ chores: [{ title: "Bins out" }] }) },
    { name: "allglance_create_task", run: () => ({ ok: true }) },
  ]);
  ha = await fakeHa({ "light.kitchen": { state: "off", attributes: { friendly_name: "Kitchen light" } }, "lock.front_door": { state: "unlocked", attributes: { friendly_name: "Front door" } }, "binary_sensor.kitchen_person": { state: "on" } },
    { token: "ha-tok", shopping: ["milk"], meals: [{ cal: "calendar.mealie_dinner", date: "2026-11-17", summary: "Tacos" }] });
  model = await fakeModel((req, n) => script(req, n));
  const cfg = parseConfig({
    name: "Faith", model: { base_url: model.url, model: "test" },
    people: [{ id: "wizard", name: "Wizard", role: "admin", ha_user_id: "ha-wiz" }, { id: "partner", name: "Partner", role: "adult" }, { id: "kid", name: "Kid", role: "child" }],
    connectors: [
      { id: "wiki", type: "mcp", url: wiki.url, household_token_env: "WIKI_TOKEN_HOUSEHOLD", person_token_env: "WIKI_TOKEN_{ID}" },
      { id: "allglance", type: "mcp", url: allg.url, household_token_env: "ALLG_HOUSEHOLD", person_token_env: "ALLG_{ID}" },
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA_TOKEN", shopping_lists: ["todo.mealie_shopping_list"], meal_calendars: ["calendar.mealie_dinner"] },
    ],
    hub: { devices: [{ id: "kitchen", name: "Kitchen" }] },
    dashboard: { entities: ["light.kitchen", "lock.front_door"] },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
  A.auth.setPin("wizard", "2468"); A.auth.setPin("kid", "1111"); A.auth.setPassword("partner", "correct horse");
});
after(async () => { await A.app.close(); for (const s of [wiki, allg, ha, model]) s.close(); });

const cookies = (res: any) => Object.fromEntries((res.cookies as any[]).map((c) => [c.name, c.value]));
async function pairedHub() {
  const code = A.auth.pairCode("kitchen");
  const res = await A.app.inject({ method: "POST", url: "/api/pair", payload: { code } });
  assert.equal(res.statusCode, 200, res.body);
  return cookies(res).faith_device as string;
}
const sse = (body: string) => body.split("\n\n").filter((l) => l.startsWith("data:")).map((l) => JSON.parse(l.slice(5)));

test("an unpaired browser sees nothing until it signs in", async () => {
  assert.equal((await A.app.inject({ url: "/api/dashboard" })).statusCode, 401);
  assert.equal((await A.app.inject({ url: "/api/people" })).statusCode, 401);
  const s = await A.app.inject({ url: "/api/session" });
  assert.equal(s.json().device, null);
});

test("the household view uses the blanket tokens; signing in switches to the person's", async () => {
  const dev = await pairedHub();
  const house = await A.app.inject({ url: "/api/dashboard", cookies: { faith_device: dev } });
  const cards = Object.fromEntries(house.json().cards.map((c: any) => [c.id, c]));
  assert.equal(cards.today.items[0].title, "Family dinner");
  assert.equal(cards.today.items[0].time, "18:00");
  assert.deepEqual(cards.shopping.items, [{ title: "milk" }]);
  assert.deepEqual(cards.meals.items[0], { title: "Tacos", label: "dinner", time: "2026-11-17" });
  assert.equal(cards.home.entities.length, 2);
  assert.ok(allg.seen.filter((s) => s.method === "tools/call").every((s) => s.token === "a-house"));

  const people = (await A.app.inject({ url: "/api/people", cookies: { faith_device: dev } })).json();
  assert.equal(people.find((p: any) => p.id === "wizard").methods.pin, true);

  const bad = await A.app.inject({ method: "POST", url: "/api/auth/pin", cookies: { faith_device: dev }, payload: { person: "wizard", pin: "0000" } });
  assert.equal(bad.statusCode, 401);
  const ok = await A.app.inject({ method: "POST", url: "/api/auth/pin", cookies: { faith_device: dev }, payload: { person: "wizard", pin: "2468" } });
  assert.equal(ok.statusCode, 200);
  const ses = cookies(ok).faith_session;
  const mine = await A.app.inject({ url: "/api/dashboard", cookies: { faith_device: dev, faith_session: ses } });
  const today = mine.json().cards.find((c: any) => c.id === "today");
  assert.equal(today.items[0].title, "Dentist (private)");
  const call = allg.seen.filter((s) => s.tool === "allglance_get_day").at(-1)!;
  assert.equal(call.token, "a-wiz");
  assert.equal(call.args.owner_id, "wizard");

  const state = (await A.app.inject({ url: "/api/session", cookies: { faith_device: dev, faith_session: ses } })).json();
  assert.equal(state.person.id, "wizard");
  assert.ok(state.remaining_seconds > 0);

  await A.app.inject({ method: "POST", url: "/api/auth/logout", cookies: { faith_device: dev, faith_session: ses } });
  const back = (await A.app.inject({ url: "/api/session", cookies: { faith_device: dev, faith_session: ses } })).json();
  assert.equal(back.person, null);
  assert.equal(back.household, true);
});

test("PINs don't work off the paired screens; passwords do", async () => {
  const r = await A.app.inject({ method: "POST", url: "/api/auth/pin", payload: { person: "wizard", pin: "2468" } });
  assert.equal(r.statusCode, 403);
  const p = await A.app.inject({ method: "POST", url: "/api/auth/password", payload: { person: "partner", password: "correct horse" } });
  assert.equal(p.statusCode, 200);
  const s = (await A.app.inject({ url: "/api/session", cookies: { faith_session: cookies(p).faith_session } })).json();
  assert.equal(s.person.id, "partner");
  assert.equal(s.device, null);
});

test("chat: the model gets the right tools and tokens for whoever is asking", async () => {
  const dev = await pairedHub();
  script = (req, n) => {
    if (n === 0 || !req.messages.some((m: any) => m.role === "tool")) return { tool_calls: [{ name: "wiki_notes_search", args: { query: "ring" } }] };
    return { content: `Found: ${req.messages.filter((m: any) => m.role === "tool").at(-1).content}` };
  };
  const house = sse((await A.app.inject({ method: "POST", url: "/api/chat", cookies: { faith_device: dev }, payload: { text: "find ring" } })).body);
  const done = house.find((e) => e.type === "done");
  assert.ok(done.text.includes("trip plan") && !done.text.includes("ring shopping"), done.text);
  const sys = model.calls.at(-1).messages[0].content as string;
  assert.match(sys, /Nobody is signed in/);

  const ses = cookies(await A.app.inject({ method: "POST", url: "/api/auth/pin", cookies: { faith_device: dev }, payload: { person: "wizard", pin: "2468" } })).faith_session;
  const mine = sse((await A.app.inject({ method: "POST", url: "/api/chat", cookies: { faith_device: dev, faith_session: ses }, payload: { text: "find ring" } })).body);
  assert.match(mine.find((e) => e.type === "done").text, /ring shopping/);
  const first = model.calls.at(-2);
  assert.match(first.messages[0].content, /You are talking with Wizard/);
  assert.match(first.messages[0].content, /profile of wizard/); // the wiki's context_for, loaded once
  assert.ok(first.tools.some((t: any) => t.function.name === "home_control"));
});

test("a child's view has no write tools beyond the allowlist and only some house controls", async () => {
  const dev = await pairedHub();
  const ses = cookies(await A.app.inject({ method: "POST", url: "/api/auth/pin", cookies: { faith_device: dev }, payload: { person: "kid", pin: "1111" } })).faith_session;
  script = () => ({ tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "unlock" } }] });
  let n = 0; const orig = script;
  script = (req, i) => (n++ === 0 ? orig(req, i) : { content: `result: ${req.messages.at(-1).content}` });
  const ev = sse((await A.app.inject({ method: "POST", url: "/api/chat", cookies: { faith_device: dev, faith_session: ses }, payload: { text: "open the door" } })).body);
  const req = model.calls.at(-2);
  const names = req.tools.map((t: any) => t.function.name);
  assert.ok(!names.includes("allglance_create_task"), "no task writes for kids");
  assert.ok(names.includes("home_control"), "lights are allowed for kids");
  assert.ok(names.includes("shopping_add"));
  assert.match(req.messages[0].content, /talking with a young child/);
  // home_control is offered (lights are allowed) but the lock is refused, and nothing reached HA.
  assert.match(ev.find((e) => e.type === "done").text, /can't control lock.front_door/);
  assert.ok(!ha.services.some((s) => s.service === "unlock"));
});

test("locks wait for an on-screen Yes, and only the same person on the same screen can give it", async () => {
  const dev = await pairedHub();
  const ses = cookies(await A.app.inject({ method: "POST", url: "/api/auth/pin", cookies: { faith_device: dev }, payload: { person: "wizard", pin: "2468" } })).faith_session;
  let n = 0;
  script = (req) => (n++ === 0 ? { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "lock" } }] } : { content: "I'll lock the front door once you tap Yes." });
  const ev = sse((await A.app.inject({ method: "POST", url: "/api/chat", cookies: { faith_device: dev, faith_session: ses }, payload: { text: "lock up" } })).body);
  const confirm = ev.find((e) => e.type === "confirm");
  assert.ok(confirm, JSON.stringify(ev));
  assert.ok(!ha.services.some((s) => s.service === "lock"), "nothing happens before Yes");
  const other = await A.app.inject({ method: "POST", url: `/api/chat/confirm/${confirm.id}`, cookies: { faith_device: dev }, payload: { approve: true } });
  assert.equal(other.statusCode, 404, "the household view can't approve Wizard's action");
  const yes = await A.app.inject({ method: "POST", url: `/api/chat/confirm/${confirm.id}`, cookies: { faith_device: dev, faith_session: ses }, payload: { approve: true } });
  assert.equal(yes.json().ok, true);
  assert.equal(ha.states["lock.front_door"].state, "locked");
  const again = await A.app.inject({ method: "POST", url: `/api/chat/confirm/${confirm.id}`, cookies: { faith_device: dev, faith_session: ses }, payload: { approve: true } });
  assert.equal(again.statusCode, 404);
});

test("the OpenAI-compatible endpoint answers as the token's scope", async () => {
  const tok = A.auth.addToken("household", "test-api");
  script = () => ({ content: "Hello from Faith" });
  const r = await A.app.inject({ method: "POST", url: "/v1/chat/completions", headers: { authorization: `Bearer ${tok}` }, payload: { model: "faith", messages: [{ role: "system", content: "Be brief." }, { role: "user", content: "hi" }] } });
  assert.equal(r.statusCode, 200);
  assert.equal(r.json().choices[0].message.content, "Hello from Faith");
  assert.match(model.calls.at(-1).messages[0].content, /Be brief\./);
  const s = await A.app.inject({ method: "POST", url: "/v1/chat/completions", headers: { authorization: `Bearer ${tok}` }, payload: { stream: true, messages: [{ role: "user", content: "hi" }] } });
  assert.match(s.body, /"content":"Hello from Faith"/);
  assert.match(s.body, /\[DONE\]/);
  assert.equal((await A.app.inject({ method: "POST", url: "/v1/chat/completions", payload: { messages: [] } })).statusCode, 401);
});

test("Home Assistant: Assist from a mapped HA user acts as that person; others get the household view; a lock by voice is refused", async () => {
  const tok = A.auth.addToken("ha", "ha-test");
  script = () => ({ content: "ok" });
  const r = await A.app.inject({ method: "POST", url: "/api/ha/conversation", headers: { authorization: `Bearer ${tok}` }, payload: { text: "what's on today", user_id: "ha-wiz", conversation_id: "01HX" } });
  assert.equal(r.json().person, "wizard");
  const h = await A.app.inject({ method: "POST", url: "/api/ha/conversation", headers: { authorization: `Bearer ${tok}` }, payload: { text: "what's on today", user_id: "someone-else" } });
  assert.equal(h.json().person, null);
  assert.match(model.calls.at(-1).messages[0].content, /spoken aloud/);

  // Wizard by voice: a lock needs a screen.
  let n = 0;
  script = (req) => (n++ === 0 ? { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "unlock" } }] } : { content: req.messages.at(-1).content });
  const v = await A.app.inject({ method: "POST", url: "/api/ha/conversation", headers: { authorization: `Bearer ${tok}` }, payload: { text: "unlock the door", user_id: "ha-wiz" } });
  assert.match(v.json().speech, /tap Yes on a FAITH screen/);
  // An unknown voice (household): unlocking can't even be asked for; locking goes to a family member.
  n = 0;
  const hv = await A.app.inject({ method: "POST", url: "/api/ha/conversation", headers: { authorization: `Bearer ${tok}` }, payload: { text: "unlock the door" } });
  assert.match(hv.json().speech, /can't be asked for from here/);
  assert.ok(!ha.services.some((x) => x.service === "unlock"));
  n = 0;
  script = (req) => (n++ === 0 ? { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "lock" } }] } : { content: req.messages.at(-1).content });
  const lk = await A.app.inject({ method: "POST", url: "/api/ha/conversation", headers: { authorization: `Bearer ${tok}` }, payload: { text: "lock the door" } });
  assert.match(lk.json().speech, /sent_for_approval/, "making the house safer can wait for a parent's approval");

  const household = A.auth.addToken("household", "not-ha");
  assert.equal((await A.app.inject({ method: "POST", url: "/api/ha/conversation", headers: { authorization: `Bearer ${household}` }, payload: { text: "x" } })).statusCode, 403);
  const sum = await A.app.inject({ url: "/api/ha/summary", headers: { authorization: `Bearer ${tok}` } });
  assert.equal(sum.json().shopping_count >= 1, true);
  assert.equal(sum.json().hubs[0].device, "kitchen");
});

test("household changes wait for approval; any adult approves; it runs with the household's token", async () => {
  const dev = await pairedHub();
  let n = 0;
  script = (req) => (n++ === 0 ? { tool_calls: [{ name: "shopping_add", args: { item: "eggs" } }] } : { content: "I've asked a family member to approve adding eggs." });
  const ev = sse((await A.app.inject({ method: "POST", url: "/api/chat", cookies: { faith_device: dev }, payload: { text: "we need eggs" } })).body);
  const req = ev.find((e) => e.type === "approval");
  assert.equal(req.summary, "add eggs to the shopping list");
  assert.ok(!ha.shopping.includes("eggs"), "nothing happens before approval");

  const dash = (await A.app.inject({ url: "/api/dashboard", cookies: { faith_device: dev } })).json();
  assert.equal(dash.cards.find((c: any) => c.id === "approvals").approvals[0].id, req.id);
  assert.equal((await A.app.inject({ method: "POST", url: `/api/approvals/${req.id}`, cookies: { faith_device: dev }, payload: { approve: true } })).statusCode, 403, "the household can't approve itself");
  const kid = cookies(await A.app.inject({ method: "POST", url: "/api/auth/pin", cookies: { faith_device: dev }, payload: { person: "kid", pin: "1111" } })).faith_session;
  assert.equal((await A.app.inject({ method: "POST", url: `/api/approvals/${req.id}`, cookies: { faith_device: dev, faith_session: kid }, payload: { approve: true } })).statusCode, 403, "children don't approve");

  const partner = cookies(await A.app.inject({ method: "POST", url: "/api/auth/password", payload: { person: "partner", password: "correct horse" } })).faith_session;
  const ok = await A.app.inject({ method: "POST", url: `/api/approvals/${req.id}`, cookies: { faith_session: partner }, payload: { approve: true } });
  assert.equal(ok.json().status, "approved", ok.body);
  assert.ok(ha.shopping.includes("eggs"));
  const add = ha.services.find((s) => s.service === "add_item")!;
  assert.equal(add.data.entity_id, "todo.mealie_shopping_list");
  assert.equal(add.token, "ha-tok");
});

test("the admin can overrule a denial; nobody else can change a decision", async () => {
  const dev = await pairedHub();
  let n = 0;
  script = () => (n++ === 0 ? { tool_calls: [{ name: "home_control", args: { entity_id: "light.kitchen", service: "turn_on" } }] } : { content: "Asked." });
  const req = sse((await A.app.inject({ method: "POST", url: "/api/chat", cookies: { faith_device: dev }, payload: { text: "lights on" } })).body).find((e) => e.type === "approval");
  const partner = cookies(await A.app.inject({ method: "POST", url: "/api/auth/password", payload: { person: "partner", password: "correct horse" } })).faith_session;
  const no = await A.app.inject({ method: "POST", url: `/api/approvals/${req.id}`, cookies: { faith_session: partner }, payload: { approve: false } });
  assert.equal(no.json().status, "denied");
  assert.equal((await A.app.inject({ method: "POST", url: `/api/approvals/${req.id}`, cookies: { faith_session: partner }, payload: { approve: true } })).statusCode, 409);
  assert.equal(ha.states["light.kitchen"].state, "off");
  const wiz = cookies(await A.app.inject({ method: "POST", url: "/api/auth/pin", cookies: { faith_device: dev }, payload: { person: "wizard", pin: "2468" } })).faith_session;
  const over = await A.app.inject({ method: "POST", url: `/api/approvals/${req.id}`, cookies: { faith_device: dev, faith_session: wiz }, payload: { approve: true } });
  assert.equal(over.json().status, "approved", over.body);
  assert.equal(ha.states["light.kitchen"].state, "on");
  const list = (await A.app.inject({ url: "/api/approvals", cookies: { faith_device: dev, faith_session: wiz } })).json();
  const row = list.requests.find((r: any) => r.id === req.id);
  assert.equal(row.overruled, true);
  assert.equal(row.decided_by, "wizard");
});

test("the app launcher shows each viewer only their apps", async () => {
  const dev = await pairedHub();
  const cfgApps = [{ id: "ha", name: "Home Assistant", url: "http://ha", who: "anyone" }, { id: "money", name: "Coinpile", url: "http://coin", who: "person", roles: ["admin", "parent"] }, { id: "orb", name: "Orb", url: "http://orb", who: "person", people: ["wizard"] }];
  (A.registry as any).cfg().apps.push(...cfgApps);
  const house = (await A.app.inject({ url: "/api/apps", cookies: { faith_device: dev } })).json().map((a: any) => a.id);
  assert.deepEqual(house, ["ha"]);
  const partner = cookies(await A.app.inject({ method: "POST", url: "/api/auth/password", payload: { person: "partner", password: "correct horse" } })).faith_session;
  assert.deepEqual((await A.app.inject({ url: "/api/apps", cookies: { faith_session: partner } })).json().map((a: any) => a.id), ["ha", "money"]);
  const wiz = cookies(await A.app.inject({ method: "POST", url: "/api/auth/pin", cookies: { faith_device: dev }, payload: { person: "wizard", pin: "2468" } })).faith_session;
  assert.deepEqual((await A.app.inject({ url: "/api/apps", cookies: { faith_device: dev, faith_session: wiz } })).json().map((a: any) => a.id), ["ha", "money", "orb"]);
});

test("voice goes through Argos's speech endpoints", async () => {
  const dev = await pairedHub();
  const { createServer } = await import("node:http");
  const got: any[] = [];
  const argos = createServer((req, res) => {
    let b: Buffer[] = []; req.on("data", (c) => b.push(c)); req.on("end", () => {
      got.push({ url: req.url, type: req.headers["content-type"], body: Buffer.concat(b).toString("latin1") });
      if (req.url === "/v1/audio/transcriptions") { res.setHeader("content-type", "application/json"); res.end(JSON.stringify({ text: " what's for dinner " })); }
      else { res.setHeader("content-type", "audio/mpeg"); res.end(Buffer.from("ID3fake")); }
    });
  });
  await new Promise<void>((r) => argos.listen(0, "127.0.0.1", r));
  const cfg = (A.registry as any).cfg();
  const old = cfg.model.base_url; cfg.model.base_url = `http://127.0.0.1:${(argos.address() as any).port}/v1`;
  try {
    const t = await A.app.inject({ method: "POST", url: "/api/voice/transcribe", cookies: { faith_device: dev }, headers: { "content-type": "audio/webm" }, payload: Buffer.from("fake-opus") });
    assert.equal(t.json().text, "what's for dinner");
    assert.match(got[0].type, /multipart\/form-data/);
    assert.match(got[0].body, /name="model"\r\n\r\nwhisper/);
    const sp = await A.app.inject({ method: "POST", url: "/api/voice/speak", cookies: { faith_device: dev }, payload: { text: "Tacos." } });
    assert.equal(sp.headers["content-type"], "audio/mpeg");
    assert.equal(JSON.parse(got[1].body).input, "Tacos.");
    assert.equal((await A.app.inject({ method: "POST", url: "/api/voice/speak", payload: { text: "x" } })).statusCode, 401);
  } finally { cfg.model.base_url = old; argos.close(); }
});

test("a photo goes to the vision model as an image part", async () => {
  const p = cookies(await A.app.inject({ method: "POST", url: "/api/auth/password", payload: { person: "partner", password: "correct horse" } })).faith_session;
  const cfg = (A.registry as any).cfg(); cfg.model.vision_model = "qwen-vl";
  script = () => ({ content: "A receipt." });
  await A.app.inject({ method: "POST", url: "/api/chat", cookies: { faith_session: p }, payload: { text: "what is this", images: ["data:image/png;base64,iVBORw0KGgo="] } });
  const last = model.calls.at(-1);
  assert.equal(last.model, "qwen-vl");
  assert.equal(last.messages.at(-1).content[1].type, "image_url");
  cfg.model.vision_model = undefined;
});
