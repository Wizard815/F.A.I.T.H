import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { localNow, onDay } from "../src/routines.js";
import { fakeHa, fakeMcp, fakeModel, fakeVoiceId } from "./fakes.js";

// Skills, routines, notifications, the HA cards' API, points and rewards, voice ID, the admin API.
let ha: Awaited<ReturnType<typeof fakeHa>>, allg: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>, vid: Awaited<ReturnType<typeof fakeVoiceId>>;
let A: App, haTok = "", skillsDir = "";
let script: (req: any) => any = () => ({ content: "ok" });
const env = { HA: "ha", AG_H: "a-house", AG_WIZARD: "a-wiz" };

before(async () => {
  skillsDir = mkdtempSync(join(tmpdir(), "faith-skills-"));
  ha = await fakeHa({ "light.kitchen": { state: "off", attributes: { friendly_name: "Kitchen light" } } }, { shopping: [] });
  allg = await fakeMcp([{ name: "allglance_get_day", readOnly: true, run: (_a, t) => ({ blocks: [{ title: t === "a-house" ? "Family dinner" : "Dentist (private)", start: "18:00" }] }) }]);
  model = await fakeModel((req) => script(req));
  vid = await fakeVoiceId();
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [
      { id: "wizard", name: "Wizard", role: "admin", ha_user_id: "ha-wiz", ha_notify: ["mobile_app_wiz"], cards: ["today", "approvals"] },
      { id: "sam", name: "Sam", role: "adult", ha_user_id: "ha-sam", ha_notify: ["notify.mobile_app_sam"] },
      { id: "robin", name: "Robin", role: "child", ha_user_id: "ha-robin" },
    ],
    connectors: [
      { id: "allglance", type: "mcp", url: allg.url, household_token_env: "AG_H", person_token_env: "AG_{ID}" },
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", shopping_lists: ["todo.shopping"] },
    ],
    skills: { dir: skillsDir },
    voice_id: { url: vid.url, threshold: 0.9 },
    hub: { devices: [{ id: "kitchen", name: "Kitchen" }] },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
  A.rewards.seed();
  A.auth.setPin("wizard", "2468"); A.auth.setPin("robin", "1111"); A.auth.setPassword("wizard", "wizard-password");
  haTok = A.auth.addToken("ha", "homeassistant");
});
after(async () => { await A.app.close(); for (const s of [ha, allg, model, vid]) s.close(); });

const H = (url: string, payload: any = {}) => A.app.inject({ method: "POST", url, headers: { authorization: `Bearer ${haTok}` }, payload });
const tick = () => new Promise((r) => setTimeout(r, 50));

// ---------------- skills ----------------
test("skills: built-in ones load, a family's own wins on a name clash, and who may use them is respected", async () => {
  const all = A.skills.all();
  assert.deepEqual(all.problems, []);
  assert.ok(all.list.some((s) => s.name === "morning-brief" && s.builtin));
  writeFileSync(join(skillsDir, "morning-brief.md"), "---\nname: morning-brief\ndescription: Our own morning brief.\n---\nSay good morning like a pirate.");
  writeFileSync(join(skillsDir, "broken.md"), "no header here");
  const b = A.skills.get("morning-brief")!;
  assert.equal(b.builtin, false); assert.match(b.body, /pirate/);
  assert.equal(A.skills.all().problems.length, 1);
  assert.ok(!A.skills.forPolicy("child").some((s) => s.name === "plan-week-dinners"), "parents' skills aren't offered to children");
  assert.ok(A.skills.forPolicy("adult").some((s) => s.name === "plan-week-dinners"));

  script = (req) => {
    const tool = req.messages.findLast((m: any) => m.role === "tool");
    if (tool) return { content: `Following: ${JSON.parse(tool.content).instructions}` };
    return { tool_calls: [{ name: "skill_load", args: { name: "morning-brief" } }] };
  };
  const r = await H("/api/ha/chat", { user_id: "ha-wiz", text: "morning brief please" });
  assert.match(r.json().text, /pirate/);
  const offered = model.calls.at(-1).tools.find((t: any) => t.function.name === "skill_load");
  assert.ok(offered.function.parameters.properties.name.enum.includes("plan-week-dinners"));
});

// ---------------- the HA cards' view ----------------
test("cards: the HA user decides the view; a person's own card list and order are used", async () => {
  const house = (await H("/api/ha/view", { user_id: "ha-unknown", screen: "kitchen" })).json();
  assert.equal(house.household, true);
  assert.equal(house.cards.find((c: any) => c.id === "today").items[0].title, "Family dinner");
  assert.equal(house.can_sign_in, true);
  const wiz = (await H("/api/ha/view", { user_id: "ha-wiz" })).json();
  assert.equal(wiz.person.id, "wizard");
  assert.deepEqual(wiz.cards.map((c: any) => c.id), ["today"], "Wizard's cards: today (approvals only shows when something waits)");
  assert.equal(wiz.cards[0].items[0].title, "Dentist (private)");
  assert.equal(wiz.can_sign_in, false);
  assert.equal((await A.app.inject({ method: "POST", url: "/api/ha/view", payload: {} })).statusCode, 401);
});

test("cards: a shared tablet signs a person in with their PIN; a personal HA account can't", async () => {
  const people = (await H("/api/ha/hub/people", { user_id: "ha-family", screen: "kitchen" })).json();
  assert.ok(people.people.find((p: any) => p.id === "wizard").pin);
  assert.equal((await H("/api/ha/hub/signin", { user_id: "ha-family", screen: "kitchen", person: "wizard", pin: "0000" })).statusCode, 401);
  const s = (await H("/api/ha/hub/signin", { user_id: "ha-family", screen: "kitchen", person: "wizard", pin: "2468" })).json();
  const v = (await H("/api/ha/view", { user_id: "ha-family", screen: "kitchen", hub_session: s.hub_session })).json();
  assert.equal(v.person.id, "wizard"); assert.ok(v.hub.remaining_seconds > 0);
  // The session only works on its own screen.
  assert.equal((await H("/api/ha/view", { user_id: "ha-family", screen: "hall", hub_session: s.hub_session })).json().household, true);
  await H("/api/ha/hub/signout", { hub_session: s.hub_session });
  assert.equal((await H("/api/ha/view", { user_id: "ha-family", screen: "kitchen", hub_session: s.hub_session })).json().household, true);
  assert.equal((await H("/api/ha/hub/signin", { user_id: "ha-sam", screen: "kitchen", person: "wizard", pin: "2468" })).statusCode, 403);
});

// ---------------- points, rewards, approvals, pushes ----------------
test("points: a child's claim waits for a parent; the parents' phones get Approve / Deny buttons; approving adds the points", async () => {
  const before = ha.services.length;
  const claim = (await H("/api/ha/rewards/claim", { user_id: "ha-robin", args: { activity: "dishes" } })).json();
  assert.equal(claim.approval, true, JSON.stringify(claim));
  assert.equal(A.rewards.balance("robin"), 0);
  await tick();
  const pushes = ha.services.slice(before).filter((s) => s.domain === "notify");
  assert.deepEqual(pushes.map((p) => p.service).sort(), ["mobile_app_sam", "mobile_app_wiz"]);
  const action = pushes[0].data.data.actions[0].action as string;
  assert.match(action, /^FAITH_APPROVE_/);
  const id = action.replace("FAITH_APPROVE_", "");
  // Robin can't approve his own claim; Sam's tap on the notification does.
  assert.equal((await H(`/api/ha/approvals/${id}`, { user_id: "ha-robin", approve: true })).statusCode, 403);
  const ok = (await H(`/api/ha/approvals/${id}`, { user_id: "ha-sam", approve: true })).json();
  assert.equal(ok.status, "approved", JSON.stringify(ok));
  assert.equal(A.rewards.balance("robin"), 1);
});

test("rewards: a parent gives points; a child redeems with enough points; money rewards are recorded as owed", async () => {
  const give = (await H("/api/ha/rewards/award", { user_id: "ha-wiz", args: { person: "robin", points: 2, reason: "Mowed the lawn" } })).json();
  assert.equal(give.result.balance, 3);
  assert.equal((await H("/api/ha/rewards/award", { user_id: "ha-wiz", args: { person: "robin", points: 3, reason: "x" } })).statusCode, 400, "points come in 0.5, 1, 2");
  assert.equal((await H("/api/ha/rewards/award", { user_id: "ha-robin", args: { person: "robin", points: 2, reason: "me" } })).statusCode, 403, "children can't give themselves points");
  const big = (await H("/api/ha/rewards/redeem", { user_id: "ha-robin", args: { reward: "ice cream" } })).json();
  assert.match(big.error, /Not enough points/);
  const movie = (await H("/api/ha/rewards/redeem", { user_id: "ha-robin", args: { reward: "movie" } })).json();
  assert.equal(movie.approval, true);
  const req = A.approvals.list().find((r) => r.status === "pending" && /movie/.test(r.summary))!;
  await H(`/api/ha/approvals/${req.id}`, { user_id: "ha-wiz", approve: true });
  assert.equal(A.rewards.balance("robin"), 0);
  // A money reward: the card isn't wired yet, so it's owed and the admin marks it paid.
  A.rewards.saveReward({ name: "Five dollars", cost: 1, kind: "money", amount: 5 });
  A.rewards.award("robin", { points: 1, reason: "test" }, "wizard");
  const g = await A.rewards.grant("robin", "Five dollars", "wizard");
  assert.equal(g.payout?.status, "owed");
  assert.equal(A.rewards.payouts("owed").length, 1);
  const view = (await H("/api/ha/rewards", { user_id: "ha-robin" })).json();
  assert.equal(view.me.id, "robin"); assert.equal(view.kids.length, 0);
  assert.equal((await H("/api/ha/rewards", { user_id: "ha-sam" })).json().kids[0].id, "robin");
});

// ---------------- routines ----------------
test("routines: days and times, catch-up after downtime, and delivery to a person's phone", async () => {
  assert.ok(onDay("weekdays", "mon") && !onDay("weekdays", "sat") && onDay("mon,wed", "wed") && onDay("daily", "sun"));
  assert.throws(() => A.routines.save({ name: "x", days: "someday", time: "07:00", prompt: "hi" }), /days is/);
  assert.throws(() => A.routines.save({ name: "x", days: "daily", time: "7am", prompt: "hi" }), /HH:MM/);
  assert.throws(() => A.routines.save({ name: "x", days: "daily", time: "07:00", run_as: "person", person_id: "wizard", deliver: ["family"], prompt: "hi" }), /only goes to them/);
  const now = localNow();
  const hh = String(Math.floor(now.minutes / 60)).padStart(2, "0"), mm = String(now.minutes % 60).padStart(2, "0");
  const r = A.routines.save({ name: "Wizard's brief", skill: "morning-brief", days: "daily", time: `${hh}:${mm}`, run_as: "person", person_id: "wizard", deliver: ["wizard"] });
  assert.equal(A.routines.due().map((x) => x.id).includes(r.id), true);
  script = () => ({ content: "Good morning Wizard: dentist at 9:30." });
  const before = ha.services.length;
  const out = await A.routines.run(r.id);
  assert.equal(out.ok, true, out.status);
  assert.match(out.status, /push:wizard/);
  const push = ha.services.slice(before).find((s) => s.service === "mobile_app_wiz")!;
  assert.match(push.data.message, /dentist/);
  assert.match(model.calls.at(-1).messages.at(-1).content, /morning-brief/);
  assert.equal(A.routines.due().some((x) => x.id === r.id), false, "once a day");
});

// ---------------- voice ID ----------------
test("voice ID: enrolled voices are recognised on a shared screen; a parent's change then goes through, an unknown voice's waits", async () => {
  for (let i = 0; i < 3; i++) await A.voices.enroll(A.registry["cfg"]().people[0], Buffer.from("voice:wizard"), "audio/webm");
  await A.voices.enroll(A.registry["cfg"]().people[2], Buffer.from("voice:robin"), "audio/webm");
  assert.equal(A.voices.match((await A.voices.embed(Buffer.from("voice:wizard"), "audio/webm")))!.person.id, "wizard");
  assert.equal(A.voices.match((await A.voices.embed(Buffer.from("voice:stranger"), "audio/webm"))), undefined);

  model.stt.text = "turn on the kitchen light";
  let k = 0;
  script = () => (k++ % 2 === 0 ? { tool_calls: [{ name: "home_control", args: { entity_id: "light.kitchen", service: "turn_on" } }] } : { content: "Done." });
  const r = (await H("/api/ha/chat", { user_id: "ha-family", screen: "kitchen", audio: Buffer.from("voice:wizard").toString("base64") })).json();
  assert.equal(r.speaker.id, "wizard"); assert.equal(r.heard, "turn on the kitchen light");
  assert.equal(ha.states["light.kitchen"].state, "on");
  assert.equal(r.approvals.length, 0);
  ha.states["light.kitchen"].state = "off";
  const u = (await H("/api/ha/chat", { user_id: "ha-family", screen: "kitchen", audio: Buffer.from("voice:stranger").toString("base64") })).json();
  assert.equal(u.speaker, null);
  assert.equal(u.approvals.length, 1, "an unknown voice's change waits for approval");
  assert.equal(ha.states["light.kitchen"].state, "off");
});

// ---------------- HA → Mattermost / phones ----------------
test("faith.send_message from HA reaches a person's phone", async () => {
  const before = ha.services.length;
  const r = (await H("/api/ha/send", { to: "sam", message: "The washing is done." })).json();
  assert.deepEqual(r.sent_to, ["push:sam"]);
  assert.ok(ha.services.slice(before).some((s) => s.service === "mobile_app_sam" && s.data.message === "The washing is done."));
});

// ---------------- the admin page ----------------
test("admin API: only an admin, and it manages skills, routines and rewards", async () => {
  assert.equal((await A.app.inject({ url: "/api/admin/overview" })).statusCode, 401);
  const robin = await A.app.inject({ method: "POST", url: "/api/auth/password", payload: { person: "wizard", password: "wizard-password" } });
  const cookie = { faith_session: robin.cookies.find((c: any) => c.name === "faith_session")!.value };
  const ov = (await A.app.inject({ url: "/api/admin/overview", cookies: cookie })).json();
  assert.equal(ov.people, 3);
  assert.ok(ov.sources.find((s: any) => s.view === "wizard").sources.includes("faith"));
  const sk = await A.app.inject({ method: "PUT", url: "/api/admin/skills/bedtime", cookies: cookie, payload: { title: "Bedtime", description: "Wind down the house.", body: "Dim the lights." } });
  assert.equal(sk.json().name, "bedtime");
  assert.equal((await A.app.inject({ method: "PUT", url: "/api/admin/skills/Bad Name", cookies: cookie, payload: { description: "x", body: "y" } })).statusCode, 400);
  const rt = await A.app.inject({ method: "POST", url: "/api/admin/routines", cookies: cookie, payload: { name: "Bedtime", skill: "bedtime", days: "daily", time: "20:30", deliver: ["parents"] } });
  assert.equal(rt.statusCode, 200, rt.body);
  const rw = (await A.app.inject({ url: "/api/admin/rewards", cookies: cookie })).json();
  assert.ok(rw.activities.length >= 5 && rw.payout_provider === "manual");
  const owed = rw.payouts.find((p: any) => p.status === "owed");
  assert.equal((await A.app.inject({ method: "POST", url: `/api/admin/rewards/payouts/${owed.id}/paid`, cookies: cookie })).statusCode, 200);
  const sam = await A.app.inject({ method: "POST", url: "/api/auth/pin", payload: {} });
  assert.notEqual(sam.statusCode, 200);
});
