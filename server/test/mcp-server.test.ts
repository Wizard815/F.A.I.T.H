import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { McpClient } from "../src/connectors/mcp.js";
import { fakeHa, fakeMcp, fakeModel } from "./fakes.js";

// FAITH as an MCP server: other agents (Hermes, Open WebUI) use FAITH's tools with FAITH tokens.
let ha: Awaited<ReturnType<typeof fakeHa>>, wiki: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, url = "";
let house = "", wiz = "", haTok = "";
before(async () => {
  ha = await fakeHa({ "light.kitchen": { state: "off", attributes: { friendly_name: "Kitchen light" } }, "lock.front_door": { state: "unlocked" } }, { shopping: [] });
  wiki = await fakeMcp([{ name: "notes_search", readOnly: true, run: (_a, t) => ({ results: t === "w-house" ? ["Shared: trip"] : ["Shared: trip", "Private: gift ideas"] }) }]);
  model = await fakeModel(() => ({ content: "Dinner is tacos." }));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }],
    connectors: [
      { id: "wiki", type: "mcp", url: wiki.url, household_token_env: "W_H", person_token_env: "W_{ID}" },
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", shopping_lists: ["todo.shopping"] },
    ],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { W_H: "w-house", W_WIZARD: "w-wiz", HA: "ha" } });
  await A.app.listen({ port: 0, host: "127.0.0.1" });
  url = `http://127.0.0.1:${(A.app.server.address() as AddressInfo).port}/mcp`;
  house = A.auth.addToken("household", "open-webui"); wiz = A.auth.addToken("person", "wizard-hermes", "wizard"); haTok = A.auth.addToken("ha", "ha");
});
after(async () => { await A.app.close(); for (const s of [ha, wiki, model]) s.close(); });

test("an MCP client sees FAITH's tools in its token's view", async () => {
  const h = new McpClient(url, house), w = new McpClient(url, wiz);
  const names = (await h.tools()).map((t) => t.name);
  assert.ok(names.includes("faith_ask") && names.includes("wiki_notes_search") && names.includes("home_control"), names.join(","));
  assert.deepEqual(JSON.parse((await h.call("wiki_notes_search", { q: "gift" })).text).results, ["Shared: trip"], "household token: shared things only");
  assert.ok(JSON.parse((await w.call("wiki_notes_search", { q: "gift" })).text).results.includes("Private: gift ideas"), "a person's token: theirs too");
});

test("through MCP, household changes wait for approval and Yes-actions are refused", async () => {
  const h = new McpClient(url, house), w = new McpClient(url, wiz);
  const r = await h.call("home_control", { entity_id: "light.kitchen", service: "turn_on" });
  assert.match(r.text, /sent_for_approval/);
  assert.equal(ha.states["light.kitchen"].state, "off");
  const lock = await w.call("home_control", { entity_id: "lock.front_door", service: "lock" });
  assert.equal(lock.isError, true);
  assert.match(lock.text, /tap Yes on a FAITH screen/);
  assert.equal(ha.states["lock.front_door"].state, "unlocked");
  const ok = await w.call("home_control", { entity_id: "light.kitchen", service: "turn_on" });
  assert.equal(ok.isError, false);
  assert.equal(ha.states["light.kitchen"].state, "on", "an admin's own token: done");
  const asked = await h.call("faith_ask", { question: "what's for dinner?" });
  assert.equal(asked.text, "Dinner is tacos.");
});

test("no token, or a Home Assistant token, gets nothing", async () => {
  await assert.rejects(new McpClient(url, undefined).tools(), /401|refused/);
  await assert.rejects(new McpClient(url, haTok).tools(), /403|refused/);
});
