import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig, type Config } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { Projects } from "../src/projects/projects.js";
import type { Caller } from "../src/scope.js";
import { fakeModel } from "./fakes.js";

// Family projects at the edges (docs/projects.md, "What goes wrong"): limits, a model
// that's down or slow, a restart, people leaving, settings turned off, bad input.
let model: Awaited<ReturnType<typeof fakeModel>>, A: App, cfg: Config;
const lastUser = (req: any) => String([...req.messages].reverse().find((m: any) => m.role === "user")?.content ?? "");
let hold: Promise<void> | undefined;           // while set, threads wait (a slow model)
const coordinatorSaw: string[] = [];
let coordinatorStarts = true;

before(async () => {
  model = await fakeModel(async (req) => {
    const u = lastUser(req), done = req.messages.at(-1)?.role === "tool";
    if (u.includes("<project_event>")) {
      if (!done) coordinatorSaw.push(u);   // one per coordinator turn
      if (!done && coordinatorStarts && u.includes("CHAIN")) return { tool_calls: [{ name: "project_thread_start", args: { title: "Next CHAIN", brief: "CHAIN again" } }] };
      return { content: `Report: ${u.match(/Thread "([^"]+)"/)?.[1]}` };
    }
    if (hold) await hold;
    // A follow-up message sees the earlier turn: the conversation is kept.
    const earlier = req.messages.filter((m: any) => m.role === "assistant").length;
    return { content: `Thread answer ${earlier + 1}` };
  });
  cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }, { id: "robin", name: "Robin", role: "child" }, { id: "kit", name: "Kit", role: "adult" }],
    projects: { max_working: 2 },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: {} });
});
after(async () => { hold = undefined; await A.projects.idle(); await A.app.close(); model.close(); });

const P = (id: string) => cfg.people.find((p) => p.id === id)!;
const me = (id: string): Caller => ({ scope: { kind: "person", person: P(id) }, channel: "personal", label: id });
const inbox = (id: string) => (A.db.prepare("SELECT text FROM inbox WHERE person_id = ? ORDER BY id").all(id) as any[]).map((r) => r.text);
const err = (f: () => unknown) => { try { f(); return ""; } catch (e: any) { return `${e.status} ${e.message}`; } };

test("edges: bad input is refused in plain words", () => {
  assert.match(err(() => A.projects.start(me("sam"), "mine", { brief: "  " })), /^400 A thread needs a brief/);
  assert.match(err(() => A.projects.start(me("sam"), "mine", { brief: "x".repeat(4001) })), /^400 A brief is at most 4000/);
  assert.match(err(() => A.projects.start(me("sam"), "nowhere", { brief: "x" })), /^404 You don't have a project by that name/);
  assert.match(err(() => A.projects.setInstructions(me("sam"), "mine", "x".repeat(2001))), /^400 .*2000/);
  assert.match(err(() => A.projects.setInstructions(me("robin"), "family", "No homework")), /^403 Ask a grown-up/);
  assert.equal(A.projects.setInstructions(me("robin"), "mine", "I like dinosaurs").instructions, "I like dinosaurs", "a child can set their own");
  assert.match(err(() => A.projects.message(me("sam"), "nope", "x")), /^404/);
});

test("edges: too many threads at once waits; a working thread can't be messaged", async () => {
  let open!: () => void; hold = new Promise<void>((r) => (open = r));
  const a = A.projects.start(me("sam"), "mine", { title: "One", brief: "first" });
  A.projects.start(me("sam"), "mine", { title: "Two", brief: "second" });
  assert.match(err(() => A.projects.start(me("sam"), "mine", { brief: "third" })), /^409 Sam already has 2 threads working/);
  assert.equal(A.projects.start(me("wizard"), "mine", { title: "Elsewhere", brief: "x" }).status, "working", "the limit is per project");
  assert.match(err(() => A.projects.message(me("sam"), a.id, "more")), /^409 "One" is still working/);
  hold = undefined; open();
  await A.projects.idle();
  assert.deepEqual(A.projects.threads("person-sam").map((t) => t.status), ["done", "done"]);
});

test("edges: a finished thread carries on in its own conversation, and a resolved one reopens", async () => {
  const t = A.projects.threads("person-sam").find((x) => x.title === "One")!;
  A.projects.resolve(me("sam"), t.id, true);
  assert.equal(A.projects.threads("person-sam").some((x) => x.id === t.id), false, "resolved threads are put away");
  A.projects.message(me("sam"), t.id, "and one more thing");
  await A.projects.idle();
  const after = A.projects.thread(me("sam"), t.id);
  assert.equal(after.resolved, false, "a message reopens it");
  assert.equal(after.last_text, "Thread answer 2", "it saw its own earlier answer");
  const msgs = A.projects.messages(me("sam"), t.id).messages.map((m) => m.text);
  assert.equal(msgs.filter((m) => m.startsWith("Thread answer")).length, 2);
});

test("edges: the model is down: the thread fails and the owner still hears", async () => {
  const url = cfg.model.base_url; cfg.model.base_url = "http://127.0.0.1:9/v1";
  try {
    const before = inbox("kit").length;
    const t = A.projects.start(me("kit"), "mine", { title: "Offline", brief: "x" });
    await A.projects.idle();
    const r = A.projects.thread(me("kit"), t.id);
    assert.equal(r.status, "failed");
    assert.match(r.last_text, /^That didn't work/);
    const got = inbox("kit").slice(before);
    assert.equal(got.length, 1, "the coordinator couldn't answer either, so the thread's own words went out");
    assert.match(got[0], /Offline failed/);
  } finally { cfg.model.base_url = url; }
});

test("edges: a chain of coordinator turns stops at max_depth", async () => {
  coordinatorSaw.length = 0;
  A.projects.start(me("wizard"), "mine", { title: "CHAIN start", brief: "CHAIN" });
  await A.projects.idle();
  const chain = A.projects.threads("person-wizard").filter((t) => t.title.includes("CHAIN")).map((t) => t.depth).sort();
  assert.deepEqual(chain, [0, 1, 2], "depth 0 started 1, 1 started 2, and 2 got no coordinator turn");
  assert.equal(coordinatorSaw.length, 2);
  cfg.projects.wake_coordinator = false;
  try {
    const before = inbox("wizard").length;
    A.projects.start(me("wizard"), "mine", { title: "Quiet", brief: "x" });
    await A.projects.idle();
    assert.equal(coordinatorSaw.length, 2, "wake-ups off: no coordinator turn");
    assert.match(inbox("wizard").slice(before)[0], /^Quiet is done\.\n\nThread answer 1/, "the thread's own summary goes out");
  } finally { cfg.projects.wake_coordinator = true; }
});

test("edges: a restart marks running threads failed, with what to do", async () => {
  let open!: () => void; hold = new Promise<void>((r) => (open = r));
  const t = A.projects.start(me("sam"), "family", { title: "Interrupted", brief: "x" });
  // A second Projects on the same database is what FAITH starting again looks like.
  new Projects(A.db, () => cfg, A.agent, undefined, { info() {}, warn() {} });
  const r = A.projects.thread(me("sam"), t.id);
  assert.equal(r.status, "failed");
  assert.match(r.last_text, /FAITH restarted.*Send it a message/);
  hold = undefined; open();
  await A.projects.idle();
});

test("edges: someone who leaves the family takes their project with them", async () => {
  const t = A.projects.threads("person-kit")[0];
  const kit = P("kit");
  cfg.people = cfg.people.filter((p) => p.id !== "kit");
  try {
    assert.match(err(() => A.projects.thread({ scope: { kind: "person", person: kit }, channel: "personal", label: "kit" }, t.id)), /^404/, "a stale sign-in can't reach it");
    assert.deepEqual(A.projects.list(me("wizard")).map((p) => p.name), ["Wizard", "Family", "Parents"]);
  } finally { cfg.people.push(kit); }
});

test("edges: projects turned off: no tools and no new threads, but the lists still read", async () => {
  cfg.projects.enabled = false;
  try {
    const names = (await A.registry.toolsFor(me("sam"))).tools.map((t) => t.name);
    assert.ok(!names.some((n) => n.startsWith("project")));
    assert.match(err(() => A.projects.start(me("sam"), "mine", { brief: "x" })), /^400 Projects are turned off/);
    assert.ok(A.projects.list(me("sam"))[0].threads.length > 0);
  } finally { cfg.projects.enabled = true; }
});

test("edges: a finished thread is in the action log, so Overseer sees how it went", () => {
  const rows = A.db.prepare("SELECT who, channel, tool, summary, ok FROM audit WHERE tool = 'project_thread_end' ORDER BY id").all() as any[];
  const offline = rows.find((r) => r.summary.includes("Offline"));
  assert.ok(offline, "the failed one is logged");
  assert.equal(offline.ok, 0);
  assert.equal(offline.channel, "routine");
  assert.ok(rows.some((r) => r.ok === 1 && r.who === "sam"));
  assert.ok(rows.every((r) => !/Thread answer/.test(r.summary)), "the log has the title and status, not what the thread said");
});
