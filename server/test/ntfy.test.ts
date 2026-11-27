import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { ConfigError, parseConfig } from "../src/config.js";
import { Notifier, ntfySafe } from "../src/notifier.js";
import { buildApp } from "../src/app.js";
import { fakeHa, fakeModel, fakeNtfy } from "./fakes.js";

// ntfy as one more way to reach phones: each person's own topic, a household
// topic for the family, and never a link, a place or a token in the body.
let ntfy: Awaited<ReturnType<typeof fakeNtfy>>;
const quiet = { info() {}, warn() {} };
const family = [
  { id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "parent" },
  { id: "teen", name: "Teen", role: "kid-pro" }, { id: "robin", name: "Robin", role: "child" },
];
const make = (ntfyCfg: any = {}) => parseConfig({ public_url: "https://faith.lan", people: family, notifications: { ntfy: { url: ntfy.url, token_env: "NTFY_TOKEN", household_topic: "faith-household", ...ntfyCfg } } }, {});
const notifier = (cfg = make()) => new Notifier(() => cfg, undefined, quiet, { NTFY_TOKEN: "tk_test" });
const topics = () => ntfy.got.map((m) => m.topic);

before(async () => { ntfy = await fakeNtfy(); });
after(() => ntfy.close());

test("ntfy: a person's message goes only to their own topic, with the token", async () => {
  ntfy.got.length = 0;
  const sent = await notifier().send("robin", "Dinner's ready", { from: "sam" });
  assert.deepEqual(sent, ["ntfy:robin"]);
  assert.deepEqual(topics(), ["faith-robin"]);
  assert.equal(ntfy.got[0].token, "tk_test");
  assert.match(ntfy.got[0].message, /Dinner's ready\n\nfrom Sam/);
  assert.equal(ntfy.got[0].click, "https://faith.lan");
  // {ID} is the id in capitals.
  ntfy.got.length = 0;
  await notifier(make({ topic: "faith-{ID}" })).send("wizard", "hi");
  assert.deepEqual(topics(), ["faith-WIZARD"]);
});

test("ntfy: the family's messages go to the household topic; the parents' only to grown-ups' topics", async () => {
  ntfy.got.length = 0;
  assert.deepEqual(await notifier().send("family", "Pizza night"), ["ntfy:household"]);
  assert.deepEqual(topics(), ["faith-household"]);
  ntfy.got.length = 0;
  // The integrations watch (health.ts) says this to the parents.
  assert.deepEqual(await notifier().send("parents", "The wiki is down.", { from: "faith" }), ["ntfy:wizard", "ntfy:sam"]);
  assert.deepEqual(topics(), ["faith-wizard", "faith-sam"], "neither kid tier hears the parents' alerts");
  ntfy.got.length = 0;
  assert.deepEqual(await notifier(make({ household_topic: undefined })).send("family", "x"), [], "no household topic: the family's messages don't go to ntfy");
  assert.equal(ntfy.got.length, 0);
});

test("ntfy: approval requests reach only the approvers, without links, places or secrets", async () => {
  ntfy.got.length = 0;
  const request = { id: "r1", summary: "share http://photos.lan/share/abc123 at 51.50722, -0.12750 with key tk_0123456789abcdefghijklmnopqrstuvwxyz", tool: "x", requested_by: "household on kitchen", requested_at: 0, status: "pending" as const, decided_by: null, decided_at: null, result: null, overruled: false };
  await notifier().onApproval({ kind: "created", request, channel: "hub", device_id: "kitchen" });
  assert.deepEqual(topics(), ["faith-wizard", "faith-sam"]);
  for (const m of ntfy.got) {
    assert.equal(m.title, "Waiting for approval");
    assert.equal(m.priority, 4);
    assert.doesNotMatch(m.message, /http|photos\.lan|51\.50722|tk_0123/);
    assert.match(m.message, /Asked by the kitchen/);
  }
  await notifier().onApproval({ kind: "decided", request, channel: "hub", device_id: "kitchen" });
  assert.equal(ntfy.got.length, 2, "a decision isn't sent again");
  assert.equal(ntfySafe("see [the album](https://photos.lan/a/1) ![x](http://p/1.jpg)"), "see the album (a picture)");
});

test("ntfy: a broken or refusing ntfy doesn't stop the message, and says why in the log", async () => {
  const warned: string[] = [];
  const n = new Notifier(() => make(), undefined, { info() {}, warn: (_o: any, m?: string) => warned.push(String(m)) }, { NTFY_TOKEN: "wrong" });
  assert.deepEqual(await n.send("wizard", "hi"), []);
  assert.match(warned[0], /refused the token \(403\).*NTFY_TOKEN/);
  ntfy.state.fail = true;
  try { assert.deepEqual(await notifier().send("wizard", "hi"), []); } finally { ntfy.state.fail = false; }
  const down = new Notifier(() => parseConfig({ people: family, notifications: { ntfy: { url: "http://127.0.0.1:9" } } }, {}), undefined, { info() {}, warn: (_o: any, m?: string) => warned.push(String(m)) });
  assert.deepEqual(await down.send("wizard", "hi"), []);
  assert.match(warned.at(-1)!, /isn't answering/);
});

test("ntfy: config refuses one shared topic, a clash with the household topic and ntfy.sh", () => {
  assert.throws(() => make({ topic: "faith" }), /needs \{id\}/);
  assert.throws(() => make({ household_topic: "faith-sam" }), /also someone's own topic/);
  assert.throws(() => make({ url: "https://ntfy.sh" }), /cloud service/);
  assert.throws(() => make({ topic: "faith {id}" }), ConfigError);
  assert.equal(parseConfig({ people: family }, {}).notifications.ntfy, undefined, "off unless set");
  assert.equal(make({ topic: undefined }).notifications.ntfy!.topic, "faith-{id}");
});

test("ntfy: a shared screen's request reaches the parents' topics through the app", async () => {
  const ha = await fakeHa({ "light.kitchen": { state: "off" } }, { token: "ha", shopping: [] }), model = await fakeModel(() => ({ content: "ok" }));
  const cfg = parseConfig({ model: { base_url: model.url }, people: family,
    connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", shopping_lists: ["todo.list"] }],
    notifications: { ntfy: { url: ntfy.url, token_env: "NTFY_TOKEN" } } }, {});
  const A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha", NTFY_TOKEN: "tk_test" } });
  try {
    ntfy.got.length = 0;
    const r = await A.agent.runTool({ scope: { kind: "household" }, channel: "hub", deviceId: "kitchen", label: "household on kitchen" }, "shopping_add", { item: "milk" });
    assert.equal(r.out.status, "sent_for_approval");
    await new Promise((res) => setTimeout(res, 100));
    assert.deepEqual(topics().sort(), ["faith-sam", "faith-wizard"]);
  } finally { await A.app.close(); ha.close(); model.close(); }
});
