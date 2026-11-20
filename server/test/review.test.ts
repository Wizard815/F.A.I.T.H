import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { connect } from "node:net";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { WyomingStt } from "../src/wyoming.js";
import { fakeHa, fakeMcp, fakeModel } from "./fakes.js";

// Regressions for the privacy review: each test is one finding, fixed.
let ha: Awaited<ReturnType<typeof fakeHa>>, allg: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, haTok = "", houseTok = "";
let script: (req: any) => any = () => ({ content: "ok" });
before(async () => {
  ha = await fakeHa({
    "light.kitchen": { state: "off" }, "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } },
    "person.sam": { state: "Work" }, "device_tracker.sam_phone": { state: "School" }, "sensor.sam_phone_geocoded_location": { state: "12 Office Park Rd" },
  }, { shopping: [] });
  allg = await fakeMcp([{ name: "allglance_get_day", readOnly: true, run: () => ({ blocks: [] }) }]);
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [
      { id: "wizard", name: "Wizard", role: "admin", ha_user_id: "ha-wiz", ha_notify: ["mobile_app_wiz"] },
      { id: "sam", name: "Sam", role: "adult", ha_user_id: "ha-sam", ha_notify: ["mobile_app_sam"] },
      { id: "robin", name: "Robin", role: "child", ha_user_id: "ha-robin", ha_notify: ["mobile_app_robin"] },
    ],
    connectors: [
      { id: "allglance", type: "mcp", url: allg.url, household_token_env: "AG_H" },
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA" },
    ],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha", AG_H: "a-house" } });
  A.rewards.seed();
  haTok = A.auth.addToken("ha", "homeassistant");
  houseTok = A.auth.addToken("household", "house");
});
after(async () => { await A.app.close(); for (const s of [ha, allg, model]) s.close(); });
const H = (url: string, payload: any = {}) => A.app.inject({ method: "POST", url, headers: { authorization: `Bearer ${haTok}` }, payload });
const people = () => A.registry["cfg"]().people;
const as = (i: number) => ({ scope: { kind: "person" as const, person: people()[i] }, channel: "personal" as const, label: people()[i].id });
const house = { scope: { kind: "household" as const }, channel: "hub" as const, label: "kitchen" };

test("pairing an HA screen: only the code for that screen, and only a few tries", async () => {
  const code = A.auth.pairCode("hall");
  assert.equal((await H("/api/ha/hub/pair", { user_id: "ha-family", screen: "kitchen", code })).statusCode, 400, "a code for another screen");
  const good = A.auth.pairCode("kitchen");
  const r = (await H("/api/ha/hub/pair", { user_id: "ha-family", screen: "kitchen", code: good })).json();
  assert.match(r.device_token, /^fdev_/);
  assert.equal((await H("/api/ha/hub/people", { user_id: "ha-family", screen: "kitchen", device_token: r.device_token })).statusCode, 200);
  assert.equal((await H("/api/ha/hub/pair", { user_id: "ha-wiz", screen: "kitchen", code: A.auth.pairCode("kitchen") })).statusCode, 403, "a person's own HA account doesn't pair screens");
  for (let i = 0; i < 5; i++) await H("/api/ha/hub/pair", { user_id: "ha-family", screen: "porch", code: "000000" });
  assert.equal((await H("/api/ha/hub/pair", { user_id: "ha-family", screen: "porch", code: A.auth.pairCode("porch") })).statusCode, 429, "then it waits");
});

test("an approved request: run once, logged, and never an unlock", async () => {
  const before = Number((A.db.prepare("SELECT COUNT(*) AS n FROM audit").get() as any).n);
  const r = await A.agent.runTool(house, "home_control", { entity_id: "light.kitchen", service: "turn_on" });
  assert.equal((r.out as any).status, "sent_for_approval");
  const id = r.requests[0].id;
  const [a, b] = await Promise.allSettled([A.approvals.decide(as(0), id, true), A.approvals.decide(as(1), id, true)]);
  assert.equal([a, b].filter((x) => x.status === "fulfilled").length, 1, "two parents tapping Approve: it runs once");
  assert.equal(ha.services.filter((s) => s.service === "turn_on").length, 1);
  const rows = A.db.prepare("SELECT * FROM audit ORDER BY id DESC").all() as any[];
  assert.equal(rows.length, before + 1);
  assert.match(rows[0].who, /approved by (wizard|sam)/);
  const unlock = await A.agent.runTool(house, "home_control", { entity_id: "lock.front_door", service: "unlock" });
  assert.match((unlock.out as any).error, /can't be asked for from here/);
  assert.equal(unlock.requests.length, 0, "no approval request to tap by mistake");
});

test("where people are never leaves Home Assistant: home or away only, no addresses", async () => {
  const call = async (name: string, args: any) => (await A.app.inject({ method: "POST", url: "/mcp", headers: { authorization: `Bearer ${houseTok}` }, payload: { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } } })).json().result;
  assert.equal((await call("home_state", { entity_id: "person.sam" })).structuredContent.state, "away");
  assert.equal((await call("home_state", { entity_id: "device_tracker.sam_phone" })).structuredContent?.state ?? "away", "away");
  assert.match((await call("home_state", { entity_id: "sensor.sam_phone_geocoded_location" })).content[0].text, /isn't shared/);
  const found = JSON.parse((await call("home_find", { query: "sam" })).content[0].text);
  assert.ok(!JSON.stringify(found).includes("Office Park") && !JSON.stringify(found).includes("Work"));
});

test("faith.send_message follows who called it: a child can't message the parents' chat; an automation can", async () => {
  const before = ha.services.length;
  const kid = await H("/api/ha/send", { user_id: "ha-robin", to: "parents", message: "Approve it, it's fine" });
  assert.equal(kid.statusCode, 400);
  assert.equal(ha.services.length, before);
  const auto = (await H("/api/ha/send", { user_id: null, to: "sam", message: "The washing is done." })).json();
  assert.deepEqual(auto.sent_to, ["push:sam"]);
});

test("home_control only reaches the one entity: targets hidden in data are dropped", async () => {
  await A.agent.runTool(as(0), "home_control", { entity_id: "light.kitchen", service: "turn_off", data: { area_id: "parents_bedroom", device_id: "abc", brightness_pct: 10 } });
  const last = ha.services.at(-1)!;
  assert.deepEqual(last.data, { brightness_pct: 10, entity_id: "light.kitchen" });
});

test("the Wyoming port answers only the addresses in wyoming.allow_from", async () => {
  const mk = (allow: string[]) => new WyomingStt({ cfg: () => ({ ...A.registry["cfg"](), wyoming: { port: 0, host: "127.0.0.1", languages: ["en"], allow_from: allow } }), env: {}, voices: A.voices, log: { info: () => {}, warn: () => {} } });
  const talk = async (stt: WyomingStt) => {
    const port = (await stt.listen())!, sock = connect(port, "127.0.0.1");
    const got = await new Promise<string>((res) => { sock.on("connect", () => sock.write('{"type":"describe"}\n')); sock.on("data", (d) => res(d.toString())); sock.on("close", () => res("closed")); });
    sock.destroy(); await stt.close(); return got;
  };
  assert.equal(await talk(mk(["192.168.1.10"])), "closed", "not Home Assistant: hung up");
  assert.match(await talk(mk(["127.0.0.1"])), /"type":"info"/);
});
