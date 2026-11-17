import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { glob, loadConfig, parseConfig, personEnv } from "../src/config.js";

test("the example config loads", () => {
  const cfg = loadConfig(resolve(import.meta.dirname, "../../config/faith.example.yaml"), {});
  assert.equal(cfg.people.length, 2);
  assert.deepEqual(cfg.connectors.map((c) => c.id), ["wiki", "allglance", "homeassistant", "coinpile", "orb", "hermes"]);
  assert.equal(cfg.roles.child.writes, "allowlist");
  assert.equal(cfg.hub.devices[0].id, "kitchen");
  assert.equal(cfg.dashboard.cards.find((c) => c.id === "mine")?.who, "person");
});

test("per-person token names come from the template", () => {
  assert.equal(personEnv("WIKI_TOKEN_{ID}", "wizard"), "WIKI_TOKEN_WIZARD");
  assert.equal(personEnv("TOK_{ID}", "kid-1"), "TOK_KID_1");
  assert.equal(personEnv(undefined, "x"), undefined);
});

test("bad configs say what's wrong", () => {
  assert.throws(() => parseConfig({ people: [{ id: "Bob", name: "Bob" }] }, {}), /lowercase/);
  assert.throws(() => parseConfig({ people: [{ id: "bob", role: "king" }] }, {}), /admin, adult or child/);
  assert.throws(() => parseConfig({ people: [{ id: "a" }, { id: "a" }] }, {}), /Two people/);
  assert.throws(() => parseConfig({ connectors: [{ id: "x", type: "mcp", url: "ftp://x" }] }, {}), /http/);
  assert.throws(() => parseConfig({ roles: { boss: {} } }, {}), /roles.boss/);
});

test("env overrides the model endpoint and public url", () => {
  const cfg = parseConfig({ model: { base_url: "http://a/v1" } }, { FAITH_MODEL_URL: "http://argos:8080/v1/", FAITH_PUBLIC_URL: "https://f.lan/" });
  assert.equal(cfg.model.base_url, "http://argos:8080/v1");
  assert.equal(cfg.public_url, "https://f.lan");
});

test("globs", () => {
  assert.ok(glob("allglance_*", "allglance_get_day"));
  assert.ok(!glob("allglance_*", "wiki_whoami"));
  assert.ok(glob("*_debug*", "sensor.cpu_debug_temp"));
});
