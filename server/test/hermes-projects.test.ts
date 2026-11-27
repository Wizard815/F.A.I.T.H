import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { parseConfig, type Config } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import type { Caller } from "../src/scope.js";

// FAITH's own Hermes, for project work only, a profile per person; and the admin's own Hermes
// cluster (owner:), which only they get (docs/projects.md, "FAITH's own Hermes").
let hermes: Server, url = "", A: App, cfg: Config;
const calls: { path: string; key: string }[] = [];
before(async () => {
  hermes = createServer((req, res) => {
    req.resume(); req.on("end", () => {
      calls.push({ path: req.url || "", key: String(req.headers.authorization || "") });
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify({ choices: [{ message: { content: `done by ${req.url}` } }] }));
    });
  });
  await new Promise<void>((r) => hermes.listen(0, "127.0.0.1", r));
  url = `http://127.0.0.1:${(hermes.address() as any).port}`;
  cfg = parseConfig({ model: { base_url: "http://127.0.0.1:9" },
    people: [{ id: "wiz", name: "Wiz", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }],
    connectors: [
      { id: "faith-hermes", type: "hermes", url, key_env: "FH_KEY_{PROFILE}", projects_only: true, household_profile: "family", parents_profile: "parents", roles: ["admin", "adult", "household", "parents"] },
      { id: "cluster", type: "hermes", url: `${url}/cluster`, key_env: "CL_KEY_{PROFILE}", owner: "wiz" },
    ] }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { FH_KEY_WIZ: "k-wiz", FH_KEY_SAM: "k-sam", FH_KEY_FAMILY: "k-fam", FH_KEY_PARENTS: "k-par", CL_KEY_WIZ: "c-wiz", CL_KEY_SAM: "c-sam" } });
});
after(async () => { await A.app.close(); hermes.close(); });

const P = (id: string) => cfg.people.find((p) => p.id === id)!;
const names = async (c: Caller) => (await A.registry.toolsFor(c)).tools.filter((t) => t.connector !== "faith").map((t) => t.name).filter((n) => n.startsWith("hermes"));
const chat = (id: string): Caller => ({ scope: { kind: "person", person: P(id) }, channel: "personal", label: id });
const thread = (id: string, throwaway = false): Caller => ({ ...chat(id), channel: "routine", work: { project: `person-${id}`, thread: "t", depth: 0, throwaway } });

test("FAITH's own Hermes: only project work gets it, each person in their own profile", async () => {
  assert.deepEqual(await names(chat("sam")), [], "a chat doesn't get FAITH's Hermes");
  assert.deepEqual(await names(thread("sam")), ["hermes_project_job"]);
  assert.deepEqual(await names(thread("sam", true)), [], "a throwaway thread only looks things up");
  const job = (await A.registry.toolsFor(thread("sam"))).tools.find((t) => t.name === "hermes_project_job")!;
  await job.run({ task: "Plan the garden" });
  assert.deepEqual(calls.at(-1), { path: "/p/sam/v1/chat/completions", key: "Bearer k-sam" });
});

test("FAITH's own Hermes: Family and Parents projects have their own profiles", async () => {
  const fam: Caller = { scope: { kind: "household" }, channel: "routine", label: "Family", work: { project: "family", depth: 0 } };
  const par: Caller = { ...fam, audience: "parents", label: "Parents", work: { project: "parents", depth: 0 } };
  for (const [c, path, key] of [[fam, "/p/family/v1/chat/completions", "Bearer k-fam"], [par, "/p/parents/v1/chat/completions", "Bearer k-par"]] as const) {
    await (await A.registry.toolsFor(c)).tools.find((t) => t.name === "hermes_project_job")!.run({ task: "x" });
    assert.deepEqual(calls.at(-1), { path, key }, "Parents work never lands in the Family profile");
  }
});

test("the admin's Hermes cluster: only its owner, in chats and in their threads", async () => {
  assert.deepEqual(await names(chat("wiz")), ["hermes_ask"]);
  assert.deepEqual((await names(thread("wiz"))).sort(), ["hermes_ask", "hermes_project_job"]);
  assert.deepEqual(await names(chat("sam")), [], "Sam has a cluster key set, but isn't the owner");
  assert.ok(!(await names(thread("sam"))).includes("hermes_ask"));
  await (await A.registry.toolsFor(thread("wiz"))).tools.find((t) => t.name === "hermes_ask")!.run({ task: "x" });
  assert.deepEqual(calls.at(-1), { path: "/cluster/p/wiz/v1/chat/completions", key: "Bearer c-wiz" });
  assert.throws(() => parseConfig({ people: [], connectors: [{ id: "h", type: "hermes", url, owner: "nobody" }] }, {}), /owner: no one/);
});
