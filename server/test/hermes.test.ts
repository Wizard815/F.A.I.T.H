import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { Hermes } from "../src/connectors/hermes.js";
import type { Person } from "../src/config.js";
import type { Caller } from "../src/scope.js";

// A Hermes API server that, like the real one, takes only each profile's own key on /p/<profile>/.
const KEYS: Record<string, string> = { default: "k-default", wizard: "k-wizard", sam: "k-sam" };
const seen: string[] = [];
const server = createServer((req, res) => {
  const profile = /^\/p\/([^/]+)\//.exec(req.url || "")?.[1] ?? "default";
  if (req.headers.authorization !== `Bearer ${KEYS[profile]}`) { res.writeHead(401).end('{"error":"wrong key"}'); return; }
  seen.push(profile);
  let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(req.method === "GET" ? { data: [] } : { choices: [{ message: { content: `done for ${profile}: ${JSON.parse(body).messages[0].content}` } }] }));
  });
});
await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
test.after(() => server.close());

const person = (id: string, role: Person["role"] = "adult"): Caller => ({ scope: { kind: "person", person: { id, name: id, role } as Person }, channel: "personal" });
const household: Caller = { scope: { kind: "household" }, channel: "hub" };

test("hermes: each person's job runs in their own profile with that profile's own key", async () => {
  const h = new Hermes({ id: "hermes", type: "hermes", url, model: "hermes-agent", key_env: "HERMES_API_KEY_{PROFILE}" }, { HERMES_API_KEY_WIZARD: "k-wizard", HERMES_API_KEY_SAM: "k-sam" });
  for (const id of ["wizard", "sam"]) {
    const [ask] = await h.tools(person(id));
    assert.match(String((await ask.run({ task: "plan the trip" }, {} as any) as any).answer), new RegExp(`done for ${id}`));
    await h.ping(person(id));
  }
  assert.deepEqual(seen.slice(-4), ["wizard", "wizard", "sam", "sam"]);
});

test("hermes: no key for a profile means no Hermes for that person", async () => {
  const h = new Hermes({ id: "hermes", type: "hermes", url, model: "hermes-agent", key_env: "HERMES_API_KEY_{PROFILE}", household_profile: "default" }, { HERMES_API_KEY_WIZARD: "k-wizard" });
  assert.equal((await h.tools(person("sam"))).length, 0);
  assert.equal((await h.tools(household)).length, 0);
  assert.equal((await h.tools(person("wizard"))).length, 1);
});

test("hermes: one shared key still works for the default profile, and Hermes refuses it on a person's profile", async () => {
  const h = new Hermes({ id: "hermes", type: "hermes", url, model: "hermes-agent", key_env: "HERMES_API_KEY", household_profile: "default" }, { HERMES_API_KEY: "k-default" });
  const [house] = await h.tools(household);
  assert.match(String((await house.run({ task: "x" }, {} as any) as any).answer), /done for default/);
  const [wiz] = await h.tools(person("wizard"));
  await assert.rejects(() => wiz.run({ task: "x" }, {} as any) as Promise<unknown>, /401/);
});
