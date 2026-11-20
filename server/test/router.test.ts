import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig, ConfigError } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { ToolRouter, words } from "../src/harness/router.js";
import type { Tool } from "../src/connectors/types.js";
import { fakeMcp, fakeModel } from "./fakes.js";

// Many tools (ha-mcp brings 86), a local model, and only the relevant ones offered.
const tool = (name: string, description: string, connector = "x"): Tool => ({ name, description, connector, parameters: {}, write: false, run: async () => null });
const many = [
  ...Array.from({ length: 60 }, (_, i) => tool(`ha_config_thing_${i}`, `Manage configuration item number ${i} of the dashboard registry`)),
  tool("ha_set_automation", "Create or update an automation: triggers, conditions and actions"),
  tool("ha_get_history", "History of an entity's states over time"),
  tool("ha_restart", "Restart Home Assistant"),
  tool("skill_load", "Load a skill", "faith"),
];

test("the router keeps FAITH's tools and finds the right ones by shared words", async () => {
  const cfg = parseConfig({ model: { base_url: "http://127.0.0.1:9/v1" }, tools: { max: 6, always: ["ha_restart"] } }, {});
  const r = new ToolRouter(() => cfg);
  const picked = (await r.pick(many, "make an automation that turns off the porch light at 11")).map((t) => t.name);
  assert.equal(picked.length, 6);
  assert.ok(picked.includes("skill_load"), "FAITH's own tools are always there");
  assert.ok(picked.includes("ha_restart"), "tools.always is always there");
  assert.equal(picked[2], "ha_set_automation", "the best match comes first after the kept ones");
  assert.ok(words("turn the lights off", tool("light_off", "Turn off lights")) > words("turn the lights off", tool("ha_get_history", "History")));
  assert.equal((await r.pick(many.slice(0, 4), "anything")).length, 4, "few tools: all of them");
  const ha = [...many, tool("HassClimateSetTemperature", "Sets the target of a climate device"), { ...tool("GetLiveContext", "Live state"), always: true }];
  const p2 = (await r.pick(ha, "what temperature is the climate set to")).map((t) => t.name);
  assert.ok(p2.includes("GetLiveContext"), "always-offered tools are kept");
  assert.ok(p2.includes("HassClimateSetTemperature"), "joined-up names are read as words");
});

test("with an embedding model the router ranks by meaning (Argos /embeddings), and survives it failing", async () => {
  const model = await fakeModel(() => ({ content: "ok" }));
  try {
    const cfg = parseConfig({ model: { base_url: model.url, embed_model: "nomic" }, tools: { max: 3 } }, {});
    const r = new ToolRouter(() => cfg);
    const picked = (await r.pick(many, "show the history of the porch light states")).map((t) => t.name);
    assert.ok(picked.includes("ha_get_history"));
    assert.ok(model.embeds.length > 60, "tool descriptions embedded once");
    const n = model.embeds.length;
    await r.pick(many, "history again");
    assert.equal(model.embeds.length, n + 1, "only the question is embedded the second time");
    const down = parseConfig({ model: { base_url: "http://127.0.0.1:9/v1", embed_model: "nomic" }, tools: { max: 3 } }, {});
    assert.equal((await new ToolRouter(() => down).pick(many, "make an automation")).length, 3, "falls back to shared words");
  } finally { model.close(); }
});

// ---- ha-mcp style servers: the URL is the secret, there's no token, and some tools are destructive ----
let srv: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App;
let script: (req: any) => any = () => ({ content: "ok" });
before(async () => {
  srv = await fakeMcp([
    { name: "ha_get_overview", readOnly: true, run: () => ({ areas: 3 }) },
    { name: "ha_restart", destructive: true, description: "Restart Home Assistant. Everything reloads.", run: () => ({ restarting: true }) },
  ]);
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }],
    connectors: [{ id: "hamcp", type: "mcp", url_env: "HA_MCP_URL", auth: "none", roles: ["admin"], prefix: "" }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA_MCP_URL: `${srv.url}/private_s3cret` } });
});
after(async () => { await A.app.close(); srv.close(); model.close(); });

test("auth: none needs roles, so a token-less server can't reach the shared view by accident", () => {
  assert.throws(() => parseConfig({ model: { base_url: "http://x" }, connectors: [{ id: "m", type: "mcp", url: "http://h", auth: "none" }] }, {}), ConfigError);
});

test("a token-less server at a secret URL: only the roles allowed get it, and destructive tools wait for a Yes", async () => {
  const wiz = { scope: { kind: "person" as const, person: A.registry["cfg"]().people[0] }, channel: "personal" as const, label: "wizard" };
  const sam = { ...wiz, scope: { kind: "person" as const, person: A.registry["cfg"]().people[1] }, label: "sam" };
  const names = async (c: any) => (await A.registry.toolsFor(c)).tools.map((t) => t.name);
  assert.ok((await names(wiz)).includes("ha_restart"));
  assert.ok(!(await names(sam)).includes("ha_restart"), "roles: [admin] — Sam doesn't get it");
  assert.ok(!(await names({ scope: { kind: "household" }, channel: "hub", label: "kitchen" })).some((n) => n.startsWith("ha_")));
  assert.ok(srv.seen.every((x) => x.path === "/private_s3cret" && x.token === ""), "the secret URL from the env, and no token");

  let k = 0;
  script = () => (k++ === 0 ? { tool_calls: [{ name: "ha_restart", args: {} }] } : { content: "Tap Yes to restart." });
  const r = await A.agent.turn({ caller: wiz, text: "restart home assistant" });
  assert.equal(r.pending.length, 1, "destructive: waits for a Yes");
  assert.match(r.pending[0].summary, /Restart Home Assistant/);
  assert.ok(!srv.seen.some((x) => x.tool === "ha_restart"), "nothing happened yet");
  await A.agent.confirm(wiz, r.pending[0].id, true);
  assert.ok(srv.seen.some((x) => x.tool === "ha_restart"), "after Yes it runs");
});

// ---- skill packs in the SKILL.md layout (homeassistant-ai/skills) ----
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Skills } from "../src/skills.js";

test("a SKILL.md pack loads, only for the roles given, and its reference files can be read (only those)", () => {
  const root = mkdtempSync(join(tmpdir(), "faith-pack-")), dir = join(root, "skills", "home-assistant-best-practices");
  mkdirSync(join(dir, "references"), { recursive: true });
  writeFileSync(join(dir, "SKILL.md"), "---\nname: home-assistant-best-practices\ndescription: >\n  Home Assistant best practices.\n  Load first on any HA request.\nmetadata:\n  version: \"56\"\n---\n# Best practices\nUse entity_id, not device_id.\n");
  writeFileSync(join(dir, "references", "triggers.md"), "Prefer state triggers.");
  writeFileSync(join(root, "secret.md"), "not part of the skill");
  const skills = new Skills(() => join(root, "mine"), join(root, "none"), () => [{ dir: root, who: ["admin"] }]);
  const s = skills.get("home-assistant-best-practices")!;
  assert.equal(s.description, "Home Assistant best practices. Load first on any HA request.");
  assert.deepEqual(s.references, ["references/triggers.md"]);
  assert.deepEqual(s.who, ["admin"]);
  assert.equal(skills.forPolicy("child").length, 0);
  assert.equal(skills.reference(s.name, "references/triggers.md"), "Prefer state triggers.");
  assert.throws(() => skills.reference(s.name, "../../secret.md"), /has no file/);
  assert.throws(() => skills.remove(s.name), /skill pack/);
});
