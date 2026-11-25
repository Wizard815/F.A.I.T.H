import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { LATER } from "../src/harness/agent.js";
import { ModelGate } from "../src/harness/gate.js";
import { MattermostBot } from "../src/mattermost.js";
import { fakeHa, fakeMattermost, fakeModel } from "./fakes.js";

// Small and big jobs. A quick question gets its answer; one that takes longer
// than answer_within_s says so straight away and posts its answer when it's
// done. Meanwhile quick questions go ahead of it at the model.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("the model's queue: a quick question goes ahead of a big job waiting there", async () => {
  const gate = new ModelGate(() => 1), order: string[] = [];
  const first = await gate.acquire();
  const big = gate.acquire(() => true).then((done) => { order.push("big"); done(); });
  const quick = gate.acquire(() => false).then((done) => { order.push("quick"); done(); });
  assert.equal(gate.waiting, 2);
  first();
  await Promise.all([big, quick]);
  assert.deepEqual(order, ["quick", "big"]);
  assert.equal(gate.waiting, 0);
  const again = await gate.acquire(); again(); again();   // releasing twice frees one place, not two
  const a = await gate.acquire(), b = gate.acquire(); let got = false; void b.then(() => { got = true; });
  await sleep(10); assert.equal(got, false, "still one at a time"); a(); await b;
});

let mm: Awaited<ReturnType<typeof fakeMattermost>>, ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, bot: MattermostBot;
let script: (req: any) => any = () => ({ content: "hi" });
before(async () => {
  mm = await fakeMattermost(["wizard", "sam"]);
  ha = await fakeHa({}, { shopping: [] });
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url, answer_within_s: 0.4, max_rounds: 10 },
    voice: { answer_within_s: 0.3 },
    people: [{ id: "wizard", name: "Wizard", role: "admin", mattermost_username: "wizard", ha_user_id: "ha-wiz", ha_notify: ["mobile_app_wiz"] }, { id: "sam", name: "Sam", role: "adult", mattermost_username: "sam" }],
    connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA" }],
    mattermost: { url: mm.url, team: "family" },
  }, {});
  const env = { HA: "ha", MATTERMOST_BOT_TOKEN: "mm-token" };
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
  bot = new MattermostBot(() => cfg, A.db, A.agent, A.approvals, { info() {}, warn() {} }, env);
  await bot.setup();
});
after(async () => { await A.app.close(); for (const s of [mm, ha, model]) s.close(); });
const send = (user: string, message: string) => bot.handle({ id: `x${Math.random()}`, user_id: mm.id(user), channel_id: `dm_${mm.id(user)}`, message });
const said = (user: string) => mm.posts.filter((p) => p.channel_id === `dm_${mm.id(user)}`).map((p) => p.message);

test("a big job says so at once, carries on, and posts its answer when it's done", async () => {
  // A big job is many model rounds (look things up, then plan); the model answers one call at a time.
  script = async (req) => {
    const msgs = req.messages as any[];
    if (!msgs.some((m) => m.role === "user" && /dinners/.test(String(m.content)))) { await sleep(20); return { content: "It's 7pm." }; }
    await sleep(150);
    return msgs.filter((m) => m.role === "tool").length < 6 ? { tool_calls: [{ name: "home_find", args: { query: "kitchen" } }] } : { content: "Monday: tacos. Tuesday: soup." };
  };
  const t0 = Date.now();
  await send("wizard", "plan the week's dinners");
  assert.ok(Date.now() - t0 < 700, "answered before the job finished");
  assert.equal(said("wizard").at(-1), LATER);
  const t1 = Date.now();
  await send("sam", "what time is it?");
  assert.equal(said("sam").at(-1), "It's 7pm.", "Sam's quick question isn't stuck behind Wizard's job");
  assert.ok(Date.now() - t1 < 400, "it waited for one round of the job at most");
  for (let i = 0; i < 40 && said("wizard").at(-1) === LATER; i++) await sleep(50);
  assert.equal(said("wizard").at(-1), "Monday: tacos. Tuesday: soup.");
  const conv = A.db.prepare("SELECT id FROM conversations WHERE ext_id = ?").get(`mm:dm_${mm.id("wizard")}`) as any;
  assert.ok((A.db.prepare("SELECT content FROM messages WHERE conversation_id = ?").all(conv.id) as any[]).some((m) => /tacos/.test(m.content)), "the answer is in the chat's memory");
});

test("asked by voice in HA: a big job's answer goes to the person's phone", async () => {
  script = async () => { await sleep(900); return { content: "Your week is planned." }; };
  const tok = A.auth.addToken("ha", "homeassistant");
  const before = ha.services.length;
  const r = await A.app.inject({ method: "POST", url: "/api/ha/conversation", headers: { authorization: `Bearer ${tok}` }, payload: { text: "plan my week", user_id: "ha-wiz" } });
  assert.equal(r.json().speech, LATER);
  for (let i = 0; i < 40 && !ha.services.slice(before).some((s) => s.service === "mobile_app_wiz"); i++) await sleep(50);
  assert.ok(ha.services.slice(before).some((s) => s.service === "mobile_app_wiz" && s.data.message === "Your week is planned."), "pushed to Wizard's phone");
});
