import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { MattermostBot } from "../src/mattermost.js";
import { fakeMattermost, fakeMcp, fakeModel } from "./fakes.js";

// The wiki as the family's memory: a note goes in the teller's own notes,
// whoever FAITH talks to gets their context (only what they share, in a group
// chat), recall tools are always offered, and a finished chat is filed.
let mm: Awaited<ReturnType<typeof fakeMattermost>>, wiki: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>;
let A: App, bot: MattermostBot;
let script: (req: any) => any = () => ({ content: "ok" });
const logged: { tool: string; args: any; token: string }[] = [];
before(async () => {
  mm = await fakeMattermost(["wizard", "sam", "robin"]);
  wiki = await fakeMcp([
    { name: "context_for", readOnly: true, run: (a, t) => `context of ${a.person} (token ${t})` },
    { name: "notes_search", readOnly: true, run: () => ({ results: [] }) },
    { name: "memory_log", run: (a, t) => { logged.push({ tool: "memory_log", args: a, token: t }); return { ok: true }; } },
    { name: "conversation_log", run: (a, t) => { logged.push({ tool: "conversation_log", args: a, token: t }); return { filed: true }; } },
    ...Array.from({ length: 12 }, (_, i) => ({ name: `thing_${i}`, readOnly: true, description: `Unrelated garden tool number ${i}`, run: () => null })),
  ]);
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    tools: { max: 4 },
    people: [{ id: "wizard", name: "Wizard", role: "admin", mattermost_username: "wizard" }, { id: "sam", name: "Sam", role: "adult", mattermost_username: "sam" }, { id: "robin", name: "Robin", role: "child", mattermost_username: "robin" }],
    connectors: [{ id: "wiki", type: "mcp", url: wiki.url, household_token_env: "W_H", person_token_env: "W_{ID}",
      always: ["memory_log", "notes_search"], teller_tools: ["memory_log", "memory_capture"] }],
    mattermost: { url: mm.url, team: "family" },
    roles: { household: { writes: "allow" } },
  }, {});
  const env = { W_H: "w-house", W_WIZARD: "w-wiz", W_SAM: "w-sam", W_ROBIN: "w-robin", MATTERMOST_BOT_TOKEN: "mm-token" };
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
  bot = new MattermostBot(() => cfg, A.db, A.agent, A.approvals, { info() {}, warn() {} }, env);
  await bot.setup();
});
after(async () => { await A.app.close(); for (const s of [mm, wiki, model]) s.close(); });
const send = (user: string, channel_id: string, message: string) => bot.handle({ id: `x${Math.random()}`, user_id: mm.id(user), channel_id, message });
const dm = (u: string) => `dm_${mm.id(u)}`, family = () => bot.familyId!;
const logOnce = (args: any) => { let k = 0; script = () => (k++ === 0 ? { tool_calls: [{ name: "wiki_memory_log", args }] } : { content: "Noted." }); };

test("a note goes in the teller's notes, whatever person the model picks", async () => {
  logOnce({ person: "wizard", text: "Wizard's gift is a ring", section: "decisions" });
  await send("sam", dm("sam"), "remember that Wizard's gift is a ring");
  assert.deepEqual([logged.at(-1)!.args.person, logged.at(-1)!.token], ["sam", "w-sam"], "Sam's own notes, with Sam's token");
  logOnce({ person: "wizard", text: "Wizard's gift is a ring" });
  await send("sam", family(), "@faith remember that Wizard's gift is a ring");
  assert.deepEqual([logged.at(-1)!.args.person, logged.at(-1)!.token], ["sam", "w-house"], "in the family chat: the speaker's, never Wizard's");
  logOnce({ person: "household", text: "The boiler service is in March" });
  await send("sam", family(), "@faith remember the boiler service is in March");
  assert.equal(logged.at(-1)!.args.person, "household", "a household fact stays the household's");
});

test("whoever is talking gets their wiki context; in a group chat only through the shared token", async () => {
  let system = "";
  script = (req) => { system = req.messages[0].content; return { content: "Hi." }; };
  await send("sam", family(), "@faith hello");
  assert.match(system, /What you know about Sam right now \(from the wiki, only what they share with the family\):\n"?context of sam \(token w-house\)/);
  await send("wizard", family(), "@faith hello");
  assert.match(system, /context of wizard \(token w-house\)/, "the next speaker gets theirs, not Sam's");
  assert.doesNotMatch(system, /context of sam/);
  await send("wizard", dm("wizard"), "hello");
  assert.match(system, /What you know about Wizard right now \(from the wiki\):\n"?context of wizard \(token w-wiz\)/);
});

test("context is fetched again after 15 minutes, not on every message", async () => {
  script = () => ({ content: "Hi." });
  const calls = () => wiki.seen.filter((x) => x.tool === "context_for" && x.token === "w-robin").length;
  await send("robin", dm("robin"), "hi");
  const n = calls();
  await send("robin", dm("robin"), "hi again");
  assert.equal(calls(), n, "the same conversation, a minute later: no new fetch");
  for (const v of (A.agent as any).lastContext.values()) v.at -= 16 * 60_000;
  await send("robin", dm("robin"), "and again");
  assert.equal(calls(), n + 1);
});

test("remembering and recalling are always offered, even when the router keeps only a few tools", async () => {
  let names: string[] = [];
  script = (req) => { names = (req.tools ?? []).map((t: any) => t.function.name); return { content: "ok" }; };
  await send("wizard", dm("wizard"), "what's the weather like for the barbecue?");
  assert.ok(names.includes("wiki_memory_log") && names.includes("wiki_notes_search"), names.join(", "));
  assert.ok(names.length < 16, "the router still trims the rest");
});

test("a person's chat, put away with \"new topic\", is filed in their own wiki folder", async () => {
  script = () => ({ content: "Sure." });
  await send("wizard", dm("wizard"), "new topic");
  await send("wizard", dm("wizard"), "we're going to Mackinac on the 12th");
  await send("wizard", dm("wizard"), "and the ferry is at 9");
  const n = logged.filter((x) => x.tool === "conversation_log").length;
  await send("wizard", dm("wizard"), "new topic");
  await A.agent.filing;
  const filed = logged.filter((x) => x.tool === "conversation_log");
  assert.equal(filed.length, n + 1);
  const f = filed.at(-1)!;
  assert.equal(f.token, "w-wiz", "with Wizard's own token");
  assert.match(f.args.id, /^faith-/);
  assert.deepEqual(f.args.segments.filter((s: any) => s.person).map((s: any) => [s.person, s.text]), [["wizard", "we're going to Mackinac on the 12th"], ["wizard", "and the ferry is at 9"]]);
  assert.ok(f.args.segments.some((s: any) => s.speaker === "Faith" && s.text === "Sure."));
  await send("sam", family(), "@faith new topic");
  await A.agent.filing;
  assert.equal(logged.filter((x) => x.tool === "conversation_log").length, n + 1, "a group chat is never filed");
});
