import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { MattermostBot } from "../src/mattermost.js";
import { fakeHa, fakeMattermost, fakeMcp, fakeModel } from "./fakes.js";

// The same three chats as a real family: a DM each, the family channel, the parents channel.
let mm: Awaited<ReturnType<typeof fakeMattermost>>, ha: Awaited<ReturnType<typeof fakeHa>>, wiki: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>;
let A: App, bot: MattermostBot;
let script: (req: any) => any = () => ({ content: "hi" });
const quiet = { info() {}, warn() {} };

before(async () => {
  mm = await fakeMattermost(["wizard", "sam", "robin", "stranger"]);
  ha = await fakeHa({ "lock.front_door": { state: "unlocked", attributes: { friendly_name: "Front door" } }, "light.kitchen": { state: "off", attributes: { friendly_name: "Kitchen light" } } }, { shopping: [] });
  wiki = await fakeMcp([{ name: "notes_search", readOnly: true, run: (_a, t) => ({ results: t === "w-house" ? ["Shared: trip"] : t === "w-parents" ? ["Shared: trip", "Parents: gift ideas"] : ["Shared: trip", `Private (${t})`] }) }]);
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin", mattermost_username: "wizard" }, { id: "sam", name: "Sam", role: "adult", mattermost_username: "@Sam" }, { id: "robin", name: "Robin", role: "child", mattermost_username: "robin" }],
    connectors: [
      { id: "wiki", type: "mcp", url: wiki.url, household_token_env: "W_H", person_token_env: "W_{ID}", parents_token_env: "W_P" },
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", shopping_lists: ["todo.shopping"] },
    ],
    mattermost: { url: mm.url, team: "family" },
  }, {});
  const env = { W_H: "w-house", W_WIZARD: "w-wiz", W_SAM: "w-sam", W_P: "w-parents", HA: "ha", MATTERMOST_BOT_TOKEN: "mm-token" };
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
  bot = new MattermostBot(() => cfg, A.db, A.agent, A.approvals, quiet, env);
  await bot.setup();
});
after(async () => { await A.app.close(); for (const s of [mm, ha, wiki, model]) s.close(); });

const posted = () => mm.posts.at(-1)!;
const send = (user: string, channel_id: string, message: string) => bot.handle({ id: `x${Math.random()}`, user_id: mm.id(user), channel_id, message });
const family = () => bot.familyId!, parents = () => bot.parentsId!, dmOf = (u: string) => `dm_${mm.id(u)}`;

test("setup makes the family and parents channels with the right people, and a DM for each person", () => {
  const fam = mm.channels.get(family())!, par = mm.channels.get(parents())!;
  assert.equal(fam.type, "P"); assert.equal(par.type, "P");
  assert.deepEqual([...fam.members].sort(), ["bot1", "u_robin", "u_sam", "u_wizard"]);
  assert.deepEqual([...par.members].sort(), ["bot1", "u_sam", "u_wizard"]);
  assert.equal(bot.rooms.get(dmOf("robin"))?.kind, "personal");
  assert.ok(mm.posts.some((p) => p.channel_id === dmOf("wizard") && /private chat/.test(p.message)));
});

test("a child added to the parents channel is taken out at the next setup", async () => {
  mm.channels.get(parents())!.members.add("u_robin");
  await bot.setup();
  assert.ok(!mm.channels.get(parents())!.members.has("u_robin"));
  const welcomes = mm.posts.filter((p) => p.channel_id === dmOf("wizard") && /private chat/.test(p.message));
  assert.equal(welcomes.length, 1, "the welcome is sent once");
});

test("each chat answers with the right token: personal, family (household), parents", async () => {
  script = (req) => (req.messages.at(-1).role === "tool" ? { content: req.messages.at(-1).content } : { tool_calls: [{ name: "wiki_notes_search", args: { query: "x" } }] });
  await send("wizard", dmOf("wizard"), "search my notes");
  assert.match(posted().message, /Private \(w-wiz\)/);
  await send("wizard", family(), "@faith search notes");
  assert.match(posted().message, /Shared: trip/); assert.doesNotMatch(posted().message, /Private|Parents/);
  assert.match(model.calls.at(-1).messages[0].content, /whole family's group chat/);
  await send("sam", parents(), "@faith search notes");
  assert.match(posted().message, /Parents: gift ideas/);
  assert.match(model.calls.at(-1).messages[0].content, /parents' private group chat/);
});

test("in group chats FAITH answers only when called, by mention or by name", async () => {
  const n = mm.posts.length;
  script = () => ({ content: "Hello!" });
  assert.equal(await send("sam", family(), "dinner is at six"), undefined);
  assert.equal(mm.posts.length, n);
  await send("sam", family(), "Faith, hello");
  assert.equal(posted().message, "Hello!");
});

test("a child's change in the family chat goes to the parents; a parent approves it there", async () => {
  let k = 0;
  script = (req) => (k++ === 0 ? { tool_calls: [{ name: "shopping_add", args: { item: "candy" } }] } : { content: "Asked a parent." });
  await send("robin", family(), "@faith we need candy");
  assert.match(posted().message, /Sent to the parents/);
  const ask = mm.posts.find((p) => p.channel_id === parents() && /candy/.test(p.message))!;
  const code = ask.message.match(/approve (\S+)`/)![1];
  assert.ok(!ha.shopping.includes("candy"));
  assert.equal(await send("robin", dmOf("robin"), `approve ${code}`).then(() => ha.shopping.includes("candy")), false, "a child can't approve");
  await send("sam", parents(), `approve ${code}`);
  await new Promise((r) => setTimeout(r, 150)); // the announcement is posted after the decision
  assert.ok(ha.shopping.includes("candy"));
  assert.ok(mm.posts.some((p) => p.channel_id === family() && /Approved by Sam/.test(p.message)), "the family chat hears the outcome");
  assert.equal(ha.services.find((x) => x.data.item === "candy")!.token, "ha", "it ran with the household's token");
});

test("a grown-up's change in the family chat happens straight away", async () => {
  let k = 0;
  script = () => (k++ === 0 ? { tool_calls: [{ name: "shopping_add", args: { item: "milk" } }] } : { content: "Added milk." });
  await send("wizard", family(), "@faith we need milk");
  assert.ok(ha.shopping.includes("milk"));
  assert.equal(posted().message, "Added milk.");
});

test("a lock waits for yes from the same person; a child's lock request goes to the parents", async () => {
  let k = 0;
  script = () => (k++ % 2 === 0 ? { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "lock" } }] } : { content: "Say yes and I'll lock it." });
  await send("wizard", dmOf("wizard"), "lock the door");
  assert.equal(ha.states["lock.front_door"].state, "unlocked");
  await send("wizard", dmOf("wizard"), "yes");
  assert.equal(ha.states["lock.front_door"].state, "locked");
  assert.equal(posted().message, "Done: lock Front door.");

  ha.states["lock.front_door"].state = "unlocked";
  script = (req) => (req.messages.at(-1).role === "tool" ? { content: req.messages.at(-1).content } : { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "lock" } }] });
  await send("robin", family(), "@faith lock the door");
  assert.match(posted().message, /Sent to the parents/);
  assert.ok(mm.posts.some((p) => p.channel_id === parents() && /lock Front door/.test(p.message)));
  assert.equal(ha.states["lock.front_door"].state, "unlocked");
  // A "yes" from Robin in the family chat doesn't count for anything.
  await send("robin", family(), "yes");
  assert.equal(ha.states["lock.front_door"].state, "unlocked");
});

test("strangers are turned away; other people's DMs are ignored", async () => {
  assert.match((await bot.handle({ id: "s1", user_id: mm.id("stranger"), channel_id: "dm_somewhere", message: "hi" }, "D"))!, /only talk with the family/);
  assert.equal(await send("sam", dmOf("wizard"), "hi"), undefined);
});
