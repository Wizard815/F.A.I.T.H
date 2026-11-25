import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeHa, fakeModel } from "./fakes.js";

// The fast path: HA's own sentence matcher does simple commands with no model.
// FAITH checks what it would touch first, with the same rules as its model's
// tools; anything that needs a Yes, an approval or isn't this person's to
// control goes to the model as before.
let ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App;
before(async () => {
  ha = await fakeHa({
    "light.kitchen": { state: "on", attributes: { friendly_name: "Kitchen light" } },
    "switch.tv": { state: "off", attributes: { friendly_name: "TV" } },
    "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } },
    "person.sam": { state: "Work", attributes: { friendly_name: "Sam" } },
  });
  model = await fakeModel(() => ({ content: "The model answered." }));
  const cfg = () => parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "robin", name: "Robin", role: "child" }],
    connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", assist_api: true, expose: { domains: ["light", "switch", "lock", "person"] } }],
  }, {});
  A = await buildApp({ config: cfg, dataFile: ":memory:", env: { HA: "ha" } });
});
after(async () => { await A.app.close(); ha.close(); model.close(); });
const people = () => A.registry["cfg"]().people;
const as = (i: number) => ({ scope: { kind: "person" as const, person: people()[i] }, channel: "personal" as const, label: people()[i].id });
const house = { scope: { kind: "household" as const }, channel: "hub" as const, label: "kitchen" };
const ask = async (c: any, text: string) => {
  const n = model.calls.length, s = ha.services.length;
  const r = await A.agent.turn({ caller: c, text });
  return { r, model: model.calls.length > n, did: ha.services.slice(s) };
};

test("a plain command: HA does it, no model, and it's in the action log", async () => {
  const { r, model: used, did } = await ask(as(0), "Turn off the kitchen light");
  assert.equal(used, false, "no model call");
  assert.equal(r.quick, true);
  assert.equal(r.text, "Turned off the light");
  assert.deepEqual(did.map((x) => [x.service, x.data.entity_id, x.data.via]), [["turn_off", "light.kitchen", "sentence"]]);
  const log = A.db.prepare("SELECT who, tool, ok FROM audit ORDER BY id DESC LIMIT 1").get() as any;
  assert.equal(log.tool, "HassTurnOff"); assert.equal(log.ok, 1);
  const msgs = A.agent.messages(as(0), r.conversationId).map((m: any) => m.content);
  assert.deepEqual(msgs.slice(-2), ["Turn off the kitchen light", "Turned off the light"], "the chat remembers it");
});

test("questions: the time for anyone, a lock's state, but never where someone is", async () => {
  assert.equal((await ask(house, "What time is it?")).r.text, "It's 7:15 PM");
  const lock = await ask(as(1), "is the front door locked");
  assert.equal(lock.model, false); assert.equal(lock.r.text, "Front door is locked");
  const where = await ask(as(0), "is the sam on");
  assert.equal(where.model, true, "a person's state goes the model's way (it only says home or away)");
});

test("what needs a Yes, an approval or isn't theirs goes to the model, untouched", async () => {
  const unlock = await ask(as(0), "unlock the front door");
  assert.equal(unlock.model, true, "a lock needs a Yes");
  assert.equal(unlock.did.length, 0);
  assert.equal((await ask(as(1), "turn on the tv")).model, true, "Robin (child) can't control switches");
  assert.equal((await ask(as(0), "turn on the tv")).did[0]?.data.entity_id, "switch.tv", "Wizard can");
  const kitchen = await ask(house, "turn on the kitchen light");
  assert.equal(kitchen.model, true, "the household view's changes need approval");
  assert.equal(kitchen.did.length, 0);
  assert.equal((await ask(as(0), "turn the lights a nice warm colour and dim the hall")).model, true, "HA doesn't understand it: the model does");
});

test("fast_path: false sends everything to the model", async () => {
  const cfg = (A.registry.ha as any).cfg;
  cfg.fast_path = false;
  try {
    const n = ha.recognized.length;
    assert.equal((await ask(as(0), "Turn on the kitchen light")).model, true);
    assert.equal(ha.recognized.length, n, "HA isn't even asked");
  } finally { cfg.fast_path = true; }
});

test("a lock call whose targets HA can't work out still waits for a Yes (name: all)", async () => {
  const s = ha.services.length;
  const r = await A.agent.runTool(as(0), "HassTurnOff", { domain: ["lock"], area: "Kitchen", name: "all" });
  assert.equal((r.out as any).status, "waiting_for_confirmation");
  assert.equal(ha.services.length, s, "nothing unlocked");
});
