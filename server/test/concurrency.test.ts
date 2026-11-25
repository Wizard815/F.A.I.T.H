import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { MattermostBot } from "../src/mattermost.js";
import { fakeHa, fakeMattermost, fakeModel } from "./fakes.js";

// Several requests at once: one person sending two quickly, several people in one
// chat, several voices at one satellite, and someone else talking at a signed-in tablet.
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let mm: Awaited<ReturnType<typeof fakeMattermost>>, ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, bot: MattermostBot, haTok = "";
let script: (req: any) => any = () => ({ content: "ok" });
const userText = (req: any) => (req.messages as any[]).filter((m) => m.role === "user").map((m) => (typeof m.content === "string" ? m.content : m.content.find((x: any) => x.type === "text")?.text));
before(async () => {
  mm = await fakeMattermost(["wizard", "sam", "robin"]);
  ha = await fakeHa({ "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } }, "cover.garage": { state: "closed", attributes: { friendly_name: "Garage" } } });
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url, answer_within_s: 0.4, max_rounds: 10 },
    people: [
      { id: "wizard", name: "Wizard", role: "admin", mattermost_username: "wizard" },
      { id: "sam", name: "Sam", role: "adult", mattermost_username: "sam" },
      { id: "robin", name: "Robin", role: "child", mattermost_username: "robin" },
    ],
    hub: { devices: [{ id: "kitchen", name: "Kitchen" }] },
    voice_id: { url: "http://127.0.0.1:9" },
    connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", expose: { domains: ["lock", "cover"] } }],
    mattermost: { url: mm.url, team: "family", answer_in_groups: "always" },
  }, {});
  const env = { HA: "ha", MATTERMOST_BOT_TOKEN: "mm-token" };
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
  bot = new MattermostBot(() => cfg, A.db, A.agent, A.approvals, { info() {}, warn() {} }, env);
  await bot.setup();
  haTok = A.auth.addToken("ha", "homeassistant");
});
after(async () => { await A.app.close(); for (const s of [mm, ha, model]) s.close(); });
const send = (user: string, channel_id: string, message: string) => bot.handle({ id: `x${Math.random()}`, user_id: mm.id(user), channel_id, message });
const dm = (u: string) => `dm_${mm.id(u)}`, said = (ch: string) => mm.posts.filter((p) => p.channel_id === ch).map((p) => p.message);
const H = (url: string, payload: any) => A.app.inject({ method: "POST", url, headers: { authorization: `Bearer ${haTok}` }, payload });

test("one person, two messages at once: the second waits for the first's answer, and sees it", async () => {
  let second: any;
  script = async (req) => {
    const q = userText(req).at(-1);
    if (q === "what's for dinner?") { await sleep(250); return { content: "Tacos." }; }
    second = req; return { content: "With salsa." };
  };
  await Promise.all([send("sam", dm("sam"), "what's for dinner?"), sleep(20).then(() => send("sam", dm("sam"), "and with what?"))]);
  assert.deepEqual(said(dm("sam")).slice(-2), ["Tacos.", "With salsa."], "answers in the order asked");
  assert.ok((second.messages as any[]).some((m) => m.role === "assistant" && m.content === "Tacos."), "the second turn saw the first answer");
});

test("a big job in the same chat lets go when it goes to the background", async () => {
  script = async (req) => {
    const msgs = req.messages as any[];
    if (userText(req).at(-1) === "plan the week") {
      await sleep(150);
      return msgs.filter((m) => m.role === "tool").length < 5 ? { tool_calls: [{ name: "home_find", args: { query: "x" } }] } : { content: "The week is planned." };
    }
    return { content: "It's 7pm." };
  };
  const t0 = Date.now();
  const job = send("wizard", dm("wizard"), "plan the week");
  await sleep(500);
  await send("wizard", dm("wizard"), "what time is it?");
  assert.ok(said(dm("wizard")).includes("It's 7pm."), "the quick question was answered");
  assert.ok(Date.now() - t0 < 1500, "without waiting for the whole job");
  await job;
  for (let i = 0; i < 40 && !said(dm("wizard")).includes("The week is planned."); i++) await sleep(50);
  assert.ok(said(dm("wizard")).includes("The week is planned."));
});

test("several people in one chat: each one's held change waits for their own yes", async () => {
  const fam = bot.familyId!;
  script = (req) => {
    const msgs = req.messages as any[], q = String(userText(req).at(-1));
    if (msgs.at(-1).role === "tool") return { content: "Reply yes to confirm." };
    if (/door/.test(q)) return { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "lock" } }] };
    if (/garage/.test(q)) return { tool_calls: [{ name: "home_control", args: { entity_id: "cover.garage", service: "close_cover" } }] };
    return { content: "ok" };
  };
  await send("sam", fam, "lock the front door");
  await send("wizard", fam, "close the garage");
  const before = ha.services.length;
  await send("robin", fam, "yes");
  assert.equal(ha.services.length, before, "a child's yes counts for nothing");
  await send("sam", fam, "yes");
  assert.deepEqual(ha.services.slice(before).map((s) => s.data.entity_id), ["lock.front_door"], "Sam's yes is Sam's lock, not Wizard's garage");
  await send("wizard", fam, "yes");
  assert.deepEqual(ha.services.slice(before).map((s) => s.data.entity_id), ["lock.front_door", "cover.garage"], "Wizard's garage was still waiting");
});

test("several voices at one satellite: each has their own conversation", async () => {
  const people = A.registry["cfg"]().people;
  (A.voices as any).recall = (t: string) => (t.startsWith("Sam here") ? people[1] : t.startsWith("Robin here") ? people[2] : undefined);
  let seen: any;
  script = (req) => { seen = req; return { content: "ok" }; };
  const ask = (text: string) => H("/api/ha/conversation", { text, conversation_id: "sat-1", device_id: "kitchen_satellite" });
  await ask("Sam here, my secret plan is a surprise party");
  await ask("Robin here, what's the plan?");
  assert.ok(!userText(seen).some((t: string) => /surprise party/.test(t)), "Robin's turn doesn't carry Sam's words");
  await ask("Sam here, and the cake?");
  assert.ok(userText(seen).some((t: string) => /surprise party/.test(t)), "Sam's next turn continues Sam's conversation");
});

test("signed in as Sam on the tablet, but that's Robin talking: Robin gets the family's view", async () => {
  const people = A.registry["cfg"]().people;
  const kitchen = A.auth.pair(A.auth.pairCode("kitchen")).token;
  A.auth.setPin("sam", "5678");
  const K = { user_id: "ha-family", screen: "kitchen", device_token: kitchen };
  const s = (await H("/api/ha/hub/signin", { ...K, person: "sam", pin: "5678" })).json();
  (A.voices as any).identify = async () => ({ person: people[2], score: 0.93 });
  model.stt.text = "what's on my list?";
  let seen: any;
  script = (req) => { seen = req; return { content: "ok" }; };
  const r = (await H("/api/ha/chat", { ...K, hub_session: s.hub_session, audio: Buffer.from("fake audio").toString("base64"), mime: "audio/webm" })).json();
  assert.equal(r.speaker?.id, "robin");
  assert.match(seen.messages[0].content, /whole family's|household|shared/i, "answered in the family's view");
  assert.doesNotMatch(seen.messages[0].content, /You are talking with Sam/);
  (A.voices as any).identify = async () => ({ person: people[1], score: 0.95 });
  await H("/api/ha/chat", { ...K, hub_session: s.hub_session, audio: Buffer.from("fake audio").toString("base64"), mime: "audio/webm" });
  assert.match(seen.messages[0].content, /You are talking with Sam/, "Sam's own voice: Sam's view");
});
