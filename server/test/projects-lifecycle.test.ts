import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig, type Config } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { Projects } from "../src/projects/projects.js";
import type { Caller } from "../src/scope.js";
import { fakeModel } from "./fakes.js";

// A thread's life (docs/projects.md, "Stages"), with the same names as Hermes Studio's projects:
// working -> review (finished, unread) -> done (read) -> resolved (put away, by hand or after
// auto_resolve_days); waiting and failed are needs_you and are never put away by themselves.
let model: Awaited<ReturnType<typeof fakeModel>>, A: App, cfg: Config;
let hold: Promise<void> | undefined;
before(async () => {
  model = await fakeModel(async (req) => {
    const u = String([...req.messages].reverse().find((m: any) => m.role === "user")?.content ?? "");
    if (u.includes("<project_event>")) return { content: "Report" };
    if (hold) await hold;
    return { content: "Thread answer" };
  });
  cfg = parseConfig({ model: { base_url: model.url }, people: [{ id: "sam", name: "Sam", role: "adult" }, { id: "kit", name: "Kit", role: "adult" }], projects: { max_working: 10 } }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: {} });
});
after(async () => { hold = undefined; await A.projects.idle(); await A.app.close(); model.close(); });

const P = (id: string) => cfg.people.find((p) => p.id === id)!;
const me = (id: string): Caller => ({ scope: { kind: "person", person: P(id) }, channel: "personal", label: id });
const wall: Caller = { scope: { kind: "household" }, channel: "hub", label: "wall" };
const stage = (c: Caller, id: string) => A.projects.thread(c, id).stage;
const DAY = 86400_000;
const age = (id: string, ms: number) => A.db.prepare("UPDATE project_threads SET updated_at = updated_at - ?, seen_at = CASE WHEN seen_at IS NULL THEN NULL ELSE seen_at - ? END WHERE id = ?").run(ms, ms, id);

test("lifecycle: working, then ready for review, then done once read", async () => {
  let open!: () => void; hold = new Promise<void>((r) => (open = r));
  const t = A.projects.start(me("sam"), "mine", { title: "Dinners", brief: "x" });
  assert.equal(stage(me("sam"), t.id), "working");
  A.projects.messages(me("sam"), t.id);
  assert.equal(A.projects.thread(me("sam"), t.id).seen_at, null, "reading a working thread doesn't count as review");
  hold = undefined; open(); await A.projects.idle();
  assert.equal(stage(me("sam"), t.id), "review", "finished and unread");
  // Background work reading it (a coordinator) is not a person reviewing it.
  A.projects.messages({ ...me("sam"), channel: "routine", work: { project: "person-sam", depth: 0 } }, t.id);
  assert.equal(stage(me("sam"), t.id), "review");
  // Someone who can't see it can't mark it either.
  assert.throws(() => A.projects.messages(me("kit"), t.id), /no such thread/);
  assert.equal(stage(me("sam"), t.id), "review");
  A.projects.messages(me("sam"), t.id);
  assert.equal(stage(me("sam"), t.id), "done");
  const g = A.projects.glance(me("sam")).projects[0];
  assert.equal(g.threads[0].stage, "done");
});

test("lifecycle: more to do starts it over; the new answer is ready for review again", async () => {
  const t = A.projects.threads("person-sam")[0];
  A.projects.message(me("sam"), t.id, "and desserts");
  assert.equal(stage(me("sam"), t.id), "working");
  assert.equal(A.projects.thread(me("sam"), t.id).seen_at, null);
  await A.projects.idle();
  assert.equal(stage(me("sam"), t.id), "review", "an old read doesn't cover a new answer");
  assert.equal(A.projects.glance(me("sam")).projects[0].review, 1);
});

test("lifecycle: auto put-away takes only done threads, after auto_resolve_days", async () => {
  const mk = async (title: string) => { const t = A.projects.start(me("kit"), "mine", { title, brief: "x" }); await A.projects.idle(); return t.id; };
  const done = await mk("Read long ago"), review = await mk("Never read"), recent = await mk("Read today");
  A.projects.messages(me("kit"), done); A.projects.messages(me("kit"), recent);
  const url = cfg.model.base_url; cfg.model.base_url = "http://127.0.0.1:9/v1";   // the model is down
  const failed = await mk("Broke"); cfg.model.base_url = url;
  assert.equal(stage(me("kit"), failed), "needs_you", "a failed thread needs you");
  let open!: () => void; hold = new Promise<void>((r) => (open = r));
  const working = A.projects.start(me("kit"), "mine", { title: "Still going", brief: "x" }).id;
  for (const id of [done, review, failed, working]) age(id, 5 * DAY);
  A.projects.sweep();
  assert.equal(stage(me("kit"), done), "resolved", "read and old: put away");
  assert.equal(stage(me("kit"), recent), "done", "read today: stays");
  assert.equal(stage(me("kit"), review), "review", "never read: never put away, however old");
  assert.equal(stage(me("kit"), failed), "needs_you", "needs you: never put away");
  assert.equal(stage(me("kit"), working), "working");
  hold = undefined; open(); await A.projects.idle();
  // Put away is hidden from the list but comes back, and isn't swept straight away again.
  assert.ok(!A.projects.threads("person-kit").some((t) => t.id === done));
  assert.ok(A.projects.threads("person-kit", { resolved: true }).some((t) => t.id === done));
  A.projects.resolve(me("kit"), done, false);
  A.projects.sweep();
  assert.equal(stage(me("kit"), done), "done", "brought back: stays out until it's old again");
  A.projects.sweep(Date.now() + 4 * DAY);
  assert.equal(stage(me("kit"), done), "resolved");
});

test("lifecycle: auto_resolve_days 0 turns it off; bad values are refused", async () => {
  const t = A.projects.start(me("sam"), "mine", { title: "Keep", brief: "x" }); await A.projects.idle();
  A.projects.messages(me("sam"), t.id);
  cfg.projects.auto_resolve_days = 0;
  A.projects.sweep(Date.now() + 365 * DAY);
  assert.equal(stage(me("sam"), t.id), "done");
  cfg.projects.auto_resolve_days = 3;
  for (const v of [-1, 61]) assert.throws(() => parseConfig({ people: [], projects: { auto_resolve_days: v } }, {}), /auto_resolve_days/);
});

test("lifecycle: a restart turns a working thread into needs you, and a throwaway is deleted, not put away", async () => {
  let open!: () => void; hold = new Promise<void>((r) => (open = r));
  const t = A.projects.start(me("sam"), "mine", { title: "Cut off", brief: "x" });
  const away = A.projects.start(me("sam"), "mine", { title: "Secret", brief: "x", throwaway: true });
  // A second Projects on the same database is what a restart sees.
  const again = new Projects(A.db, () => cfg, A.agent, undefined, { info() {}, warn() {} });
  assert.equal(again.thread(me("sam"), t.id).stage, "needs_you");
  hold = undefined; open(); await A.projects.idle();
  A.projects.messages(me("sam"), away.id);
  age(away.id, 5 * DAY);
  A.projects.sweep();
  assert.throws(() => A.projects.thread(me("sam"), away.id), /no such thread/, "throwaway: gone, not resolved");
});

test("lifecycle: in Family, the shared screen reading a thread reviews it for everyone", async () => {
  const t = A.projects.start(wall, "family", { title: "Saturday", brief: "x" });
  await A.projects.idle();
  const id = t.id;
  assert.equal(stage(me("sam"), id), "review");
  A.projects.messages(wall, id);
  assert.equal(stage(me("kit"), id), "done");
});
