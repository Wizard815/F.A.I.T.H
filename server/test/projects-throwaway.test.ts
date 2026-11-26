import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig, type Config } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeMcp, fakeModel } from "./fakes.js";

// Throwaway threads (docs/projects.md): a person's own private thread that keeps nothing.
// It only looks things up, nobody else is told what it said, the action log doesn't get its
// words, and it's deleted when put away or after projects.throwaway_hours.
let model: Awaited<ReturnType<typeof fakeModel>>, wiki: Awaited<ReturnType<typeof fakeMcp>>, A: App, cfg: Config;
const lastUser = (req: any) => String([...req.messages].reverse().find((m: any) => m.role === "user")?.content ?? "");
const offered: string[][] = [];
let coordinatorTurns = 0;

before(async () => {
  wiki = await fakeMcp([
    { name: "wiki_search", readOnly: true, run: () => ({ hits: ["a note"] }) },
    { name: "wiki_note", run: () => ({ ok: true }) },
  ]);
  model = await fakeModel((req) => {
    const u = lastUser(req), toolDone = req.messages.at(-1)?.role === "tool";
    if (u.includes("<project_event>")) { coordinatorTurns++; return { content: "Coordinator report" }; }
    if (u.includes("throwaway thread")) {
      if (!toolDone) { offered.push((req.tools || []).map((t: any) => t.function.name)); return { tool_calls: [{ name: "wiki_search", args: {} }] }; }
      return { content: "SECRET ANSWER about the surprise" };
    }
    if (u.includes("working in the background")) return { content: "Normal answer" };
    return { content: "ok" };
  });
  cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "sam", name: "Sam", role: "adult" }, { id: "kit", name: "Kit", role: "adult" }],
    connectors: [{ id: "wiki", type: "mcp", url: wiki.url, household_token_env: "WIKI_HOUSE", person_token_env: "WIKI_{ID}" }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { WIKI_HOUSE: "wiki-house", WIKI_SAM: "wiki-sam", WIKI_KIT: "wiki-kit" } });
});
after(async () => { await A.projects.idle(); await A.app.close(); model.close(); wiki.close(); });

const as = (t: string) => ({ authorization: `Bearer ${t}` });
const everything = () => JSON.stringify({
  audit: A.db.prepare("SELECT * FROM audit").all(), inbox: A.db.prepare("SELECT * FROM inbox").all(),
  messages: A.db.prepare("SELECT * FROM messages").all(), threads: A.db.prepare("SELECT * FROM project_threads").all(),
});

test("throwaway: reads only, tells nobody what it said, and is gone when put away", async () => {
  const sam = A.auth.addToken("client", "sam-phone", "sam"), kit = A.auth.addToken("client", "kit-phone", "kit");
  const r = await A.app.inject({ method: "POST", url: "/api/projects/person-sam/threads", headers: as(sam), payload: { title: "Gift idea", brief: "Ideas for Kit's SURPRISE party", throwaway: true } });
  assert.equal(r.statusCode, 200, r.body);
  const id = r.json().thread;
  await A.projects.idle();

  const writes = (await A.registry.toolsFor({ scope: { kind: "person", person: cfg.people[0] }, channel: "routine", label: "x" })).tools.filter((t) => t.write).map((t) => t.name);
  assert.ok(writes.includes("wiki_note"), "Sam has write tools normally");
  assert.ok(offered[0].includes("wiki_search"), "it can look things up");
  assert.deepEqual(offered[0].filter((n) => writes.includes(n)), [], "no write tools: no wiki notes, no Hermes, no changes, no project tools");
  assert.equal(coordinatorTurns, 0, "no coordinator turn: its conversation is kept");
  const t = (await A.app.inject({ url: `/api/projects/person-sam/threads/${id}`, headers: as(sam) })).json();
  assert.equal(t.thread.throwaway, true);
  assert.ok(t.messages.some((m: any) => m.text.includes("SECRET ANSWER")), "Sam reads the answer in Projects");
  assert.equal((await A.app.inject({ url: `/api/projects/person-sam/threads/${id}`, headers: as(kit) })).statusCode, 404, "nobody else");

  // What's kept outside the thread: no brief, no title, no answer.
  const audit = JSON.stringify(A.db.prepare("SELECT * FROM audit").all()), inbox = JSON.stringify(A.db.prepare("SELECT * FROM inbox").all());
  for (const word of ["SURPRISE", "SECRET", "Gift idea"]) {
    assert.ok(!audit.includes(word), `the action log doesn't keep "${word}"`);
    assert.ok(!inbox.includes(word), `the inbox doesn't keep "${word}"`);
  }
  assert.match(audit, /a throwaway thread \(done\)/);
  assert.match(inbox, /throwaway thread has an answer/);

  const put = await A.app.inject({ method: "PUT", url: `/api/projects/person-sam/threads/${id}/resolved`, headers: as(sam), payload: { resolved: true } });
  assert.equal(put.statusCode, 200, put.body);
  assert.equal(put.json().deleted, true);
  assert.equal((await A.app.inject({ url: `/api/projects/person-sam/threads/${id}`, headers: as(sam) })).statusCode, 404, "it's gone, and can't be reopened");
  const all = everything();
  for (const word of ["SURPRISE", "SECRET", "Gift idea"]) assert.ok(!all.includes(word), `nothing anywhere keeps "${word}"`);
});

test("throwaway: only in your own project, started by you", async () => {
  const sam = A.auth.addToken("client", "sam-laptop", "sam"), wall = A.auth.addToken("ha", "wall");
  const fam = await A.app.inject({ method: "POST", url: "/api/projects/family/threads", headers: as(sam), payload: { brief: "x", throwaway: true } });
  assert.match(fam.json().error ?? fam.body, /Throwaway threads are only for your own project/);
  const shared = await A.app.inject({ method: "POST", url: "/api/projects/family/threads", headers: as(wall), payload: { brief: "x", throwaway: true } });
  assert.notEqual(shared.statusCode, 200, "the shared screen can't either");
  // A coordinator (background work) can't make one.
  const coord = { scope: { kind: "person" as const, person: cfg.people[0] }, channel: "routine" as const, label: "c", work: { project: "person-sam", depth: 0 } };
  assert.throws(() => A.projects.start(coord, "mine", { brief: "x", throwaway: true }), /only for your own project/);
});

test("throwaway: deleted after projects.throwaway_hours, normal threads stay", async () => {
  const me = { scope: { kind: "person" as const, person: cfg.people[0] }, channel: "personal" as const, label: "sam" };
  const a = A.projects.start(me, "mine", { title: "Old", brief: "x", throwaway: true });
  const b = A.projects.start(me, "mine", { title: "Kept", brief: "x" });
  await A.projects.idle();
  A.projects.sweep(Date.now() + 23 * 3600_000);
  assert.ok(A.projects.thread(me, a.id), "still there before a day");
  A.projects.sweep(Date.now() + 25 * 3600_000);
  assert.throws(() => A.projects.thread(me, a.id), /no such thread/);
  assert.equal(A.projects.thread(me, b.id).title, "Kept");
  assert.throws(() => parseConfig({ people: [], projects: { throwaway_hours: 0 } }, {}), /throwaway_hours is 1 to 168/);
});
