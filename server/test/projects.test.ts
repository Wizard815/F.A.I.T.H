import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeMcp, fakeModel } from "./fakes.js";

// Family projects (docs/projects.md): a background project per person, plus Family and
// Parents. Threads run with the project owner's tokens, never the asker's.
let model: Awaited<ReturnType<typeof fakeModel>>, wiki: Awaited<ReturnType<typeof fakeMcp>>, A: App;
const lastUser = (req: any) => String([...req.messages].reverse().find((m: any) => m.role === "user")?.content ?? "");
const toolNames = (req: any) => (req.tools || []).map((t: any) => t.function.name) as string[];
const seenTools: { kind: string; tools: string[] }[] = [];
let threadSays = "Found three dinners.";

before(async () => {
  wiki = await fakeMcp([{ name: "wiki_search", readOnly: true, run: (_a, token) => ({ hits: [token === "wiki-house" ? "household recipes" : `notes for ${token}`] }) }]);
  model = await fakeModel((req) => {
    const u = lastUser(req), toolDone = req.messages.at(-1)?.role === "tool";
    if (u.includes("<project_event>")) { seenTools.push({ kind: "coordinator", tools: toolNames(req) }); return { content: `Coordinator: ${u.match(/Thread "([^"]+)"/)?.[1]} is done.` }; }
    if (u.includes("working in the background")) {
      if (!toolDone) { seenTools.push({ kind: "thread", tools: toolNames(req) }); return { tool_calls: [{ name: "wiki_search", args: {} }] }; }
      return { content: threadSays };
    }
    return { content: "ok" };
  });
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }, { id: "robin", name: "Robin", role: "child" }],
    connectors: [{ id: "wiki", type: "mcp", url: wiki.url, household_token_env: "WIKI_HOUSE", person_token_env: "WIKI_{ID}" }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { WIKI_HOUSE: "wiki-house", WIKI_SAM: "wiki-sam", WIKI_WIZARD: "wiki-wizard", WIKI_ROBIN: "wiki-robin" } });
});
after(async () => { await A.projects.idle(); await A.app.close(); model.close(); wiki.close(); });
const as = (token: string) => ({ authorization: `Bearer ${token}` });
let sam = "", robin = "", wizard = "", ha = "";
const inbox = async (t: string) => ((await A.app.inject({ url: "/api/inbox", headers: as(t) })).json().items as any[]).map((i) => i.text);

test("projects: each view sees only its own projects", async () => {
  sam = A.auth.addToken("client", "sam-laptop", "sam");
  robin = A.auth.addToken("client", "robin-tablet", "robin");
  wizard = A.auth.addToken("client", "wizard-desk", "wizard");
  ha = A.auth.addToken("ha", "ha-wall");
  const names = async (t: string) => ((await A.app.inject({ url: "/api/projects", headers: as(t) })).json().projects as any[]).map((p) => p.name);
  assert.deepEqual(await names(sam), ["Sam", "Family", "Parents"]);
  assert.deepEqual(await names(robin), ["Robin", "Family"], "children don't see the parents' project");
  assert.deepEqual(await names(ha), ["Family"], "the shared view sees only Family");
  assert.equal((await A.app.inject({ url: "/api/projects", headers: {} })).statusCode, 401);
});

test("projects: a person's thread runs with their own tokens, and only they hear back", async () => {
  const r = await A.app.inject({ method: "POST", url: "/api/projects/person-sam/threads", headers: as(sam), payload: { title: "Dinners", brief: "Find three dinners Robin will eat." } });
  assert.equal(r.statusCode, 200, r.body);
  const id = r.json().thread as string;
  await A.projects.idle();
  assert.deepEqual(wiki.seen.filter((s) => s.tool === "wiki_search").map((s) => s.token), ["wiki-sam"], "the thread used Sam's wiki token");
  const thread = seenTools.find((s) => s.kind === "thread")!, coord = seenTools.find((s) => s.kind === "coordinator")!;
  assert.ok(!thread.tools.some((n) => n.startsWith("project")), "a thread can't start other threads");
  assert.ok(coord.tools.includes("project_thread_start"), "the coordinator can start the next step");
  const t = (await A.app.inject({ url: `/api/projects/person-sam/threads/${id}`, headers: as(sam) })).json();
  assert.equal(t.thread.status, "done");
  assert.equal(t.messages.at(-1).text, "Found three dinners.");
  assert.deepEqual(await inbox(sam), ["Coordinator: Dinners is done."]);
  assert.deepEqual(await inbox(wizard), [], "nobody else hears about Sam's project");
  // Nobody else can open it, not even the admin, and the shared view can't either.
  for (const who of [wizard, robin, ha]) assert.equal((await A.app.inject({ url: `/api/projects/person-sam/threads/${id}`, headers: as(who) })).statusCode, 404);
  assert.equal((await A.app.inject({ method: "POST", url: `/api/projects/x/threads/${id}/message`, headers: as(wizard), payload: { text: "show me" } })).statusCode, 404);
  const audit = A.db.prepare("SELECT who, tool FROM audit WHERE tool = 'project_thread_start'").all() as any[];
  assert.equal(audit[0].who.split("@")[0], "sam", "starting a thread is in the action log");
});

test("projects: sending words to Family waits for the person's own Yes, then runs as the household", async () => {
  wiki.seen.length = 0;
  const r = await A.app.inject({ method: "POST", url: "/api/projects/family/threads", headers: as(sam), payload: { title: "Saturday", brief: "Plan Saturday afternoon for everyone." } });
  assert.equal(r.statusCode, 200, r.body);
  const held = r.json().pending as { id: string; summary: string }[];
  assert.equal(held.length, 1, "nothing goes to the shared project without a Yes");
  assert.match(held[0].summary, /Plan Saturday afternoon for everyone/, "the Yes card shows the exact words");
  assert.deepEqual(A.projects.threads("family"), []);
  const yes = await A.app.inject({ method: "POST", url: `/api/chat/confirm/${held[0].id}`, headers: as(sam), payload: { approve: true } });
  assert.equal(yes.statusCode, 200, yes.body);
  await A.projects.idle();
  assert.deepEqual(wiki.seen.filter((s) => s.tool === "wiki_search").map((s) => s.token), ["wiki-house"], "Family's thread used the household token, not Sam's");
  assert.equal(A.projects.threads("family")[0].status, "done");
  assert.ok((await inbox(robin)).includes("Coordinator: Saturday is done."), "Family's news goes to the family");
  const fam = (await A.app.inject({ url: "/api/projects", headers: as(ha) })).json().projects[0];
  assert.equal(fam.threads[0].title, "Saturday", "the shared screen sees Family's threads");
});

test("projects: the shared view's threads wait for approval; a child can't start one", async () => {
  const r = await A.app.inject({ method: "POST", url: "/api/projects/family/threads", headers: as(ha), payload: { brief: "Order pizza for tonight." } });
  assert.equal(r.statusCode, 200, r.body);
  assert.equal(r.json().requests.length, 1, "a household change waits for a grown-up's approval");
  assert.equal(A.projects.threads("family").length, 1, "and nothing started yet");
  const c = await A.app.inject({ method: "POST", url: "/api/projects/person-robin/threads", headers: as(robin), payload: { brief: "Build me a game." } });
  assert.equal(c.statusCode, 403, "project_thread_start isn't on the children's allowlist");
  assert.equal((await A.app.inject({ method: "POST", url: "/api/projects/parents/threads", headers: as(robin), payload: { brief: "x" } })).statusCode, 404);
});

test("projects: little screens get a short summary", async () => {
  const g = (await A.app.inject({ url: "/api/projects/glance", headers: as(sam) })).json();
  assert.deepEqual(g.projects.map((p: any) => [p.id, p.threads.length]), [["person-sam", 1], ["family", 1], ["parents", 0]]);
  assert.ok(g.projects[0].threads[0].last.length <= 60);
});

test("projects: settings are checked", () => {
  const base = { people: [{ id: "sam", name: "Sam", role: "adult" }] };
  assert.throws(() => parseConfig({ ...base, projects: { max_working: 0 } }, {}), /max_working/);
  assert.throws(() => parseConfig({ ...base, projects: { max_depth: 9 } }, {}), /max_depth/);
  assert.deepEqual(parseConfig(base, {}).projects, { enabled: true, max_working: 3, wake_coordinator: true, max_depth: 2, throwaway_hours: 24, auto_resolve_days: 3 });
});
