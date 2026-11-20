import test from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { build, probe, render, type Service } from "../src/init.js";
import { fakeHa, fakeMcp } from "./fakes.js";

// faith init: find services, write a config that loads, and list the tokens to make.
test("probes tell a live service from an empty port or the wrong app", async () => {
  const mcp = await fakeMcp([]), ha = await fakeHa({}, { token: "secret" });
  try {
    const at = (u: string) => { const x = new URL(u); return { host: x.hostname, port: Number(x.port) }; };
    const m = at(mcp.url), h = at(ha.url);
    assert.equal(await probe({ id: "wiki", port: m.port, path: "/family-mcp", kind: "mcp", what: "wiki" }, m.host), true);
    assert.equal(await probe({ id: "homeassistant", port: h.port, path: "/api/", kind: "ha", what: "HA" }, h.host), true, "HA answers 401 without a token");
    assert.equal(await probe({ id: "voiceid", port: h.port, path: "/health", kind: "http", what: "voice" } as Service, h.host), false, "HA's 404 for /health: not voice ID");
    assert.equal(await probe({ id: "x", port: 9, path: "/", kind: "http", what: "x" }, "127.0.0.1"), false, "nothing listening");
  } finally { mcp.close(); ha.close(); }
});

test("the config it writes loads, and the token list fits the family", () => {
  const found = { argos: "http://argos:8080", wiki: "http://192.168.1.5:27123", allglance: "http://192.168.1.5:8090", homeassistant: "http://192.168.1.10:8123", coinpile: "http://192.168.1.5:8190", hamcp: "http://192.168.1.10:9584", mattermost: "http://192.168.1.5:8065", voiceid: "http://voiceid:8099" };
  const people = [{ id: "wizard", name: "Wizard", role: "admin" as const }, { id: "robin", name: "Robin", role: "child" as const }];
  const { cfg, env } = build(found, people);
  const keys = env.map((e) => e.key);
  assert.ok(keys.includes("WIKI_TOKEN_HOUSEHOLD") && keys.includes("WIKI_TOKEN_ROBIN") && keys.includes("HA_TOKEN") && keys.includes("HA_MCP_URL"));
  assert.ok(keys.includes("COINPILE_TOKEN_WIZARD") && !keys.includes("COINPILE_TOKEN_ROBIN"), "no money tokens for children");
  assert.deepEqual(cfg.connectors.map((c: any) => c.id), ["wiki", "allglance", "homeassistant", "coinpile", "hamcp"]);
  assert.deepEqual(cfg.connectors.find((c: any) => c.id === "hamcp").roles, ["admin"]);
  assert.equal(cfg.model.base_url, "http://argos:8080/v1");
  assert.equal(cfg.wyoming.port, 10300);
  const { yaml, dotenv } = render(found, people);
  assert.match(yaml, /^# Written by `faith init`/);
  assert.match(dotenv, /# in the wiki: node scripts\/family-setup\.mjs token robin\nWIKI_TOKEN_ROBIN=/);
  assert.doesNotThrow(() => parseConfig(cfg, {}));
});
