import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeHa, fakeModel } from "./fakes.js";

// assist_api: HA's own intents and house overview, with FAITH's rules on top.
let ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App;
let script: (req: any) => any = () => ({ content: "ok" });
before(async () => {
  ha = await fakeHa({ "light.kitchen": { state: "off", attributes: { friendly_name: "Kitchen light" } }, "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } } }, { shopping: [] });
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin", ha_notify: ["mobile_app_wiz"] }, { id: "robin", name: "Robin", role: "child" }],
    connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", assist_api: true, shopping_lists: ["todo.shopping"] }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha" } });
});
after(async () => { await A.app.close(); ha.close(); model.close(); });
const P = (i: number) => A.registry["cfg"]().people[i];
const wizC = () => ({ scope: { kind: "person" as const, person: P(0) }, channel: "personal" as const, label: "wizard", haDevice: "sat123" });
const robinC = () => ({ scope: { kind: "person" as const, person: P(1) }, channel: "personal" as const, label: "robin" });
const house = { scope: { kind: "household" as const }, channel: "voice" as const, label: "porch" };

test("HA's intents replace FAITH's generic device tools, and HA's overview goes into the instructions", async () => {
  const names = (await A.registry.toolsFor(wizC())).tools.map((t) => t.name);
  assert.ok(names.includes("HassTurnOn") && names.includes("GetLiveContext"));
  assert.ok(!names.includes("home_control") && names.includes("shopping_add"), "Mealie's list stays FAITH's own");
  script = () => ({ content: "ok" });
  await A.agent.turn({ caller: wizC(), text: "hi" });
  assert.match(model.calls.at(-1).messages[0].content, /How the house is set up \(from Home Assistant\):[\s\S]*Kitchen light/);
});

test("a light just happens; the device's id goes along (its room, its timers)", async () => {
  const r = await A.agent.runTool(wizC(), "HassTurnOn", { name: "Kitchen light" });
  assert.equal(ha.states["light.kitchen"].state, "on");
  assert.equal(ha.services.at(-1)!.data.device_id, "sat123");
  assert.equal(r.pending.length, 0);
});

test("locks: locking waits for a Yes; unlocking from the shared view isn't even asked for", async () => {
  const lock = await A.agent.runTool(wizC(), "HassTurnOff", { name: "Front door" });
  assert.equal(lock.pending.length, 1, "unlocking: Wizard's own Yes");
  assert.equal(lock.pending[0].summary, "unlock Front door");
  assert.equal(ha.states["lock.front_door"].state, "locked");
  const porch = await A.agent.runTool(house, "HassTurnOff", { name: "Front door" });
  assert.match((porch.out as any).error, /can't be asked for from here/);
  assert.equal(porch.requests.length, 0);
  const safer = await A.agent.runTool(house, "HassTurnOn", { name: "Front door" });
  assert.equal((safer.out as any).status, "sent_for_approval", "locking can wait for a parent");
});

test("a child stays within their kinds of device, whatever HA would match", async () => {
  const r = await A.agent.runTool(robinC(), "HassTurnOn", { name: "Kitchen light" });
  assert.ok(!(r.out as any)?.error);
  const lock = await A.agent.runTool(robinC(), "HassTurnOff", { name: "Front door" });
  assert.match((lock.out as any).error, /can't control Front door/);
  assert.equal(lock.pending.length, 0, "no Yes card for something they can't do at all");
  assert.equal(ha.states["lock.front_door"].state, "locked");
});
