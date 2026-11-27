import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { anyGlob, ConfigError, DEFAULT_ROLES, parseConfig, type Person } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import type { Caller } from "../src/scope.js";
import { fakeHa, fakeMcp, fakeModel } from "./fakes.js";

// The four tiers: admin, parent, kid-pro (a teen) and kid-lite (a young child).
// Sam is written "adult" and Robin "child": the old names still load.
let wiki: Awaited<ReturnType<typeof fakeMcp>>, coin: Awaited<ReturnType<typeof fakeMcp>>, web: Awaited<ReturnType<typeof fakeMcp>>, ha: Awaited<ReturnType<typeof fakeHa>>;
let model: Awaited<ReturnType<typeof fakeModel>>, A: App;
const env = {
  WIKI_HOUSE: "w-house", WIKI_PARENTS: "w-parents", WIKI_WIZARD: "w-wiz", WIKI_SAM: "w-sam", WIKI_TEEN: "w-teen", WIKI_ROBIN: "w-robin",
  COIN_WIZARD: "c-wiz", COIN_SAM: "c-sam", COIN_TEEN: "c-teen", COIN_ROBIN: "c-robin", WEB_TOKEN: "web", HA_TOKEN: "ha-tok",
};

before(async () => {
  wiki = await fakeMcp([
    { name: "notes_search", readOnly: true, run: (_a, t) => ({ results: t === "w-parents" ? ["Parents: birthday surprise"] : ["Shared: trip plan"] }) },
    { name: "memory_log", run: () => ({ ok: true }) },
  ]);
  // A money source with no roles: limit: the kid tiers still never get it.
  coin = await fakeMcp([{ name: "accounts_list", readOnly: true, run: () => ({ accounts: [] }) }, { name: "transfer_create", run: () => ({ ok: true }) }]);
  web = await fakeMcp([{ name: "web_search", readOnly: true, run: () => ({ results: [] }) }]);
  ha = await fakeHa({
    "light.kitchen": { state: "off" }, "scene.movie": { state: "off" }, "lock.front_door": { state: "locked" },
    "cover.garage_door": { state: "closed" }, "switch.garage_door_opener": { state: "off" }, "alarm_control_panel.home": { state: "armed_away" },
  }, { token: "ha-tok", shopping: ["milk"] });
  model = await fakeModel(() => ({ content: "ok" }));
  const cfg = parseConfig({
    model: { base_url: model.url, model: "test" },
    people: [
      { id: "wizard", name: "Wizard", role: "admin", ha_notify: ["mobile_app_wiz"] },
      { id: "sam", name: "Sam", role: "adult", ha_notify: ["mobile_app_sam"] },
      { id: "teen", name: "Teen", role: "kid-pro", ha_notify: ["mobile_app_teen"] },
      { id: "robin", name: "Robin", role: "child", ha_notify: ["mobile_app_robin"] },
    ],
    connectors: [
      { id: "wiki", type: "mcp", url: wiki.url, household_token_env: "WIKI_HOUSE", parents_token_env: "WIKI_PARENTS", person_token_env: "WIKI_{ID}" },
      { id: "coinpile", type: "mcp", url: coin.url, person_token_env: "COIN_{ID}" },
      { id: "web", type: "mcp", url: web.url, household_token_env: "WEB_TOKEN", person_token_env: "WEB_TOKEN" },
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA_TOKEN", shopping_lists: ["todo.mealie_shopping_list"],
        expose: { domains: ["light", "scene", "lock", "cover", "switch", "alarm_control_panel"] } },
    ],
    // Even a config that hands the teen locks and the garage doesn't: those are never a kid's.
    roles: { "kid-pro": { ha_domains: ["light", "scene", "lock", "cover", "switch", "alarm_control_panel"] } },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
});
after(async () => { await A.app.close(); for (const s of [wiki, coin, web, ha, model]) s.close(); });

const person = (id: string) => A.registry["cfg"]().people.find((p: Person) => p.id === id)!;
const as = (id: string): Caller => ({ scope: { kind: "person", person: person(id) }, channel: "personal", label: id });
const tools = async (c: Caller) => (await A.registry.toolsFor(c)).tools;
const names = async (c: Caller) => (await tools(c)).map((t) => t.name);

test("tiers: the old names load as parent and kid-lite", () => {
  assert.equal(person("sam").role, "parent");
  assert.equal(person("robin").role, "kid-lite", "child is the safer kid tier");
  const cfg = parseConfig({
    people: [{ id: "a", role: "adult" }, { id: "c", role: "child" }],
    roles: { child: { allow_writes: ["home_control"] }, adult: { deny_tools: ["hermes_*"] } },
    connectors: [{ id: "x", type: "mcp", url: "http://x", roles: ["admin", "adult", "child"] }],
    approvals: { approvers: ["admin", "adult"] },
  }, {});
  assert.deepEqual(cfg.people.map((p) => p.role), ["parent", "kid-lite"]);
  assert.deepEqual(cfg.roles["kid-lite"].allow_writes, ["home_control"], "roles.child overrides kid-lite");
  assert.deepEqual(cfg.roles["kid-lite"].ha_domains, ["light", "media_player", "fan"], "the rest stays kid-lite's default");
  assert.deepEqual(cfg.roles.parent.deny_tools, ["hermes_*"]);
  assert.deepEqual(cfg.connectors[0].roles, ["admin", "parent", "kid-pro", "kid-lite"], "in a list, child means both kid tiers");
  assert.deepEqual(cfg.approvals.approvers, ["admin", "parent"]);
  assert.deepEqual(parseConfig({}, {}).approvals.approvers, ["admin", "parent"]);
  assert.throws(() => parseConfig({ approvals: { approvers: ["admin", "child"] } }, {}), /can't approve/);
  assert.throws(() => parseConfig({ approvals: { approvers: ["kid-pro"] } }, {}), /can't approve/);
  assert.throws(() => parseConfig({ roles: { child: {}, "kid-lite": {} } }, {}), /same tier/);
  assert.throws(() => parseConfig({ connectors: [{ id: "x", type: "mcp", url: "http://x", roles: ["kid"] }] }, {}), ConfigError);
});

test("tiers: kid-lite gets less than kid-pro", async () => {
  const lite = await tools(as("robin")), pro = await tools(as("teen"));
  const has = (ts: typeof lite, n: string) => ts.some((t) => t.name === n);
  assert.ok(has(pro, "wiki_memory_log") && !has(lite, "wiki_memory_log"), "only the teen writes their own notes");
  assert.ok(has(pro, "web_search") && !has(lite, "web_search"), "no web for the young child");
  assert.ok(has(lite, "wiki_notes_search"), "reading their own notes is fine");
  // Shopping: the teen adds straight away; the young child's add waits for a parent.
  assert.equal(pro.find((t) => t.name === "shopping_add")?.approval, undefined);
  assert.equal(lite.find((t) => t.name === "shopping_add")?.approval, true);
  assert.ok(!has(lite, "shopping_done") && pro.find((t) => t.name === "shopping_done")?.approval, "ticking off waits for a parent for the teen, isn't there for the young child");
  // Photos: no share links for either kid; albums only for the teen.
  for (const k of ["kid-lite", "kid-pro"] as const) assert.ok(anyGlob(DEFAULT_ROLES[k].deny_tools, "photos_share"), k);
  assert.ok(anyGlob(DEFAULT_ROLES["kid-pro"].allow_writes, "photos_album_add") && anyGlob(DEFAULT_ROLES["kid-lite"].deny_tools, "photos_album_add"));
  // A scene: the teen may, the young child may not.
  const h = A.registry.ha!;
  assert.ok(h.controllable(as("teen"), "scene.movie") && !h.controllable(as("robin"), "scene.movie"));
  assert.ok(h.controllable(as("robin"), "light.kitchen"));
  assert.match(A.registry["cfg"]().roles["kid-lite"].prompt!, /about six/);
  assert.match(A.registry["cfg"]().roles["kid-pro"].prompt!, /teenager/);
});

test("tiers: neither kid gets money, locks, the alarm or the garage", async () => {
  const h = A.registry.ha!;
  for (const id of ["teen", "robin"]) {
    const n = await names(as(id));
    assert.ok(!n.some((x) => x.startsWith("coinpile_")), `${id}: no money tools, even with a token and no roles: on the source`);
    for (const e of ["lock.front_door", "cover.garage_door", "switch.garage_door_opener", "alarm_control_panel.home"]) assert.ok(!h.controllable(as(id), e), `${id}: ${e}`);
    const out: any = await (await tools(as(id))).find((t) => t.name === "home_control")!.run({ entity_id: "lock.front_door", service: "unlock" });
    assert.match(out.error, /can't control lock.front_door/);
  }
  assert.ok(!ha.services.some((s) => s.service === "unlock"));
  // Grown-ups still can.
  assert.ok((await names(as("sam"))).includes("coinpile_transfer_create"));
  assert.ok(h.controllable(as("sam"), "lock.front_door"));
});

test("tiers: neither kid reads the parents' things", async () => {
  for (const id of ["teen", "robin"]) {
    const before = wiki.seen.length;
    const out: any = await (await tools(as(id))).find((t) => t.name === "wiki_notes_search")!.run({ q: "birthday" });
    assert.ok(!JSON.stringify(out).includes("Parents:"), id);
    assert.ok(wiki.seen.slice(before).every((s) => s.token === `w-${id}`), `${id} uses only their own token`);
  }
  // The parents' chat and the parents' messages leave both kids out.
  await A.notifier.send("parents", "the router is down");
  const phones = ha.services.filter((s) => s.domain === "notify").map((s) => s.service);
  assert.ok(phones.includes("mobile_app_wiz") && phones.includes("mobile_app_sam"));
  assert.ok(!phones.includes("mobile_app_teen") && !phones.includes("mobile_app_robin"));
});

test("tiers: a young child's shopping add goes to the parents, and only they can approve it", async () => {
  ha.services.length = 0;
  const r = await A.agent.runTool(as("robin"), "shopping_add", { item: "ice cream" });
  assert.equal(r.out.status, "sent_for_approval");
  assert.equal(r.requests.length, 1);
  assert.ok(!ha.services.some((s) => s.service === "add_item"), "nothing happens before a parent approves");
  await new Promise((res) => setTimeout(res, 50));
  const pushed = ha.services.filter((s) => s.domain === "notify").map((s) => s.service).sort();
  assert.deepEqual(pushed, ["mobile_app_sam", "mobile_app_wiz"], "the approval goes to the admin and the parent, not the kids");
  for (const id of ["teen", "robin"]) await assert.rejects(A.approvals.decide(as(id), r.requests[0].id, true), /Only a signed-in family member/);
  const ok = await A.approvals.decide(as("sam"), r.requests[0].id, true);
  assert.equal(ok.status, "approved");
  assert.ok(ha.services.some((s) => s.service === "add_item" && s.data.item === "ice cream"));
  // The teen's add just happens.
  const t = await A.agent.runTool(as("teen"), "shopping_add", { item: "bread" });
  assert.equal(t.out.ok, true);
});
