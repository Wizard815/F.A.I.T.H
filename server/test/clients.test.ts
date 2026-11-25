import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeHa, fakeModel } from "./fakes.js";

// FAITH's apps (docs/clients.md): Android, desktop and D.A.S.H sign in once as
// one person, count as that person's own screen (so they can say Yes), and
// fetch what FAITH sent them from the inbox.
let ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App;
let script: (req: any) => any = () => ({ content: "ok" });
before(async () => {
  ha = await fakeHa({ "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } } });
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }, { id: "robin", name: "Robin", role: "child" }],
    connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", expose: { domains: ["lock"] } }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha" } });
  A.auth.setPassword("sam", "correct horse battery");
});
after(async () => { await A.app.close(); ha.close(); model.close(); });
const sse = (body: string) => body.split("\n\n").filter((l) => l.startsWith("data:")).map((l) => JSON.parse(l.slice(5)));
const as = (token: string) => ({ authorization: `Bearer ${token}` });
let app = "";

test("an app signs in once with a password and gets a client token for that person", async () => {
  assert.equal((await A.app.inject({ method: "POST", url: "/api/auth/client", payload: { person: "sam", password: "wrong", name: "Pixel 8" } })).statusCode, 401);
  const r = (await A.app.inject({ method: "POST", url: "/api/auth/client", payload: { person: "sam", password: "correct horse battery", name: "Pixel 8" } })).json();
  assert.match(r.token, /^fapp_/); assert.match(r.name, /^sam-pixel-8-/);
  app = r.token;
  const me = (await A.app.inject({ url: "/api/me", headers: as(app) })).json();
  assert.equal(me.id, "sam");
  const list = (await A.app.inject({ url: "/api/me/clients", headers: as(app) })).json();
  assert.deepEqual(list.map((c: any) => [c.name, c.this_one]), [[r.name, true]]);
});

test("an app can say Yes to a lock; a plain API token can't", async () => {
  let k = 0;
  script = () => (k++ % 2 === 0 ? { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "unlock" } }] } : { content: "Tap Yes to unlock." });
  const ev = sse((await A.app.inject({ method: "POST", url: "/api/chat", headers: as(app), payload: { text: "unlock the front door" } })).body);
  const confirm = ev.find((e: any) => e.type === "confirm");
  assert.ok(confirm, "held for a Yes on the app");
  assert.equal(ha.states["lock.front_door"].state, "locked");
  const yes = await A.app.inject({ method: "POST", url: `/api/chat/confirm/${confirm.id}`, headers: as(app), payload: { approve: true } });
  assert.equal(yes.statusCode, 200, yes.body);
  assert.deepEqual([ha.services.at(-1)!.domain, ha.services.at(-1)!.service, ha.services.at(-1)!.data.entity_id], ["lock", "unlock", "lock.front_door"], "unlocked after the Yes on the app");
  ha.states["lock.front_door"].state = "locked";
  const n = ha.services.length;
  const api = A.auth.addToken("person", "sam-script", "sam");
  const ev2 = sse((await A.app.inject({ method: "POST", url: "/api/chat", headers: as(api), payload: { text: "unlock the front door" } })).body);
  assert.ok(!ev2.some((e: any) => e.type === "confirm"), "a script's token isn't anyone's screen");
  assert.equal(ha.services.length, n, "and nothing was unlocked");
});

test("the inbox: what FAITH sends a person waits for their apps, and a long poll wakes for new ones", async () => {
  await A.notifier.send("sam", "Your week is planned: tacos on Monday.");
  await A.notifier.send("parents", "The washing is done.");
  await A.notifier.send("robin", "Robin's own note.");
  const first = (await A.app.inject({ url: "/api/inbox", headers: as(app) })).json();
  assert.deepEqual(first.items.map((i: any) => i.text), ["Your week is planned: tacos on Monday.", "The washing is done."], "Sam's and the parents', not Robin's");
  const t0 = Date.now();
  const waiting = A.app.inject({ url: `/api/inbox?after=${first.last}&wait=5`, headers: as(app) });
  setTimeout(() => { void A.notifier.send("sam", "Front door: It's Robin."); }, 600);
  const next = (await waiting).json();
  assert.deepEqual(next.items.map((i: any) => i.text), ["Front door: It's Robin."]);
  assert.ok(Date.now() - t0 < 4000, "woke up when it arrived");
  assert.equal((await A.app.inject({ url: "/api/inbox" })).statusCode, 401);
});

test("removing an app ends its token", async () => {
  const name = (await A.app.inject({ url: "/api/me/clients", headers: as(app) })).json()[0].name;
  assert.equal((await A.app.inject({ method: "DELETE", url: `/api/me/clients/${name}`, headers: as(app) })).json().ok, true);
  assert.equal((await A.app.inject({ url: "/api/me", headers: as(app) })).statusCode, 401);
  const dash = A.auth.addToken("client", "wizard-dash", "wizard");
  assert.equal((await A.app.inject({ url: "/api/me", headers: as(dash) })).json().id, "wizard", "D.A.S.H: a client token made with the CLI");
});
