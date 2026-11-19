import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeHa, fakeMcp, fakeModel } from "./fakes.js";

// Watching the integrations: the parents hear once when one goes down, and when it's back.
let ha: Awaited<ReturnType<typeof fakeHa>>, wiki: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, cfg: ReturnType<typeof parseConfig>, haTok = "";
before(async () => {
  ha = await fakeHa({});
  wiki = await fakeMcp([{ name: "notes_search", readOnly: true, run: () => ({ results: [] }) }]);
  model = await fakeModel(() => ({ content: "ok" }));
  cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin", ha_notify: ["mobile_app_wiz"] }, { id: "robin", name: "Robin", role: "child", ha_notify: ["mobile_app_robin"] }],
    connectors: [
      { id: "wiki", type: "mcp", url: wiki.url, person_token_env: "W_{ID}" },   // personal tokens only: checked as a person
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA" },
    ],
    health: { interval_s: 0 },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { W_WIZARD: "w-wiz", HA: "ha" } });
  haTok = A.auth.addToken("ha", "homeassistant");
});
after(async () => { await A.app.close(); for (const s of [ha, wiki, model]) s.close(); });

const pushes = () => ha.services.filter((s) => s.domain === "notify").map((s) => `${s.service}: ${s.data.message}`);

test("a source that stops answering: one notice to the parents after two checks, one when it's back", async () => {
  let states = await A.health.check();
  assert.ok(states.every((s) => s.ok === true), JSON.stringify(states));
  assert.deepEqual(states.map((s) => s.id).sort(), ["homeassistant", "model", "wiki"]);

  const wikiCfg = cfg.connectors[0] as any, url = wikiCfg.url;
  wikiCfg.url = "http://127.0.0.1:9/mcp";
  await A.health.check();
  assert.equal(A.health.list().find((s) => s.id === "wiki")!.ok, true, "one failed check isn't enough");
  assert.equal(pushes().length, 0);
  await A.health.check();
  assert.equal(A.health.list().find((s) => s.id === "wiki")!.ok, false);
  assert.equal(pushes().length, 1);
  assert.match(pushes()[0], /^mobile_app_wiz: ⚠️ Wiki isn't answering/, "to the parents, not Robin");
  await A.health.check();
  assert.equal(pushes().length, 1, "no repeats while it stays down");

  const sum = (await A.app.inject({ url: "/api/ha/summary", headers: { authorization: `Bearer ${haTok}` } })).json();
  assert.deepEqual(sum.integrations.down, ["wiki"]);

  wikiCfg.url = url;
  await A.health.check();
  assert.equal(A.health.list().find((s) => s.id === "wiki")!.ok, true);
  assert.match(pushes().at(-1)!, /✅ Wiki is back/);
  assert.equal(A.health.events().length, 2);
});
