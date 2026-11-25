import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig, ConfigError } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeHa, fakeModel } from "./fakes.js";

// Voice and face together. The camera at a screen (or next to a satellite) checks the voice:
// 1. they disagree: nobody is trusted;
// 2. a voice just under the threshold counts when the face is that same person;
// 3. (voice_and_face, off by default) both agree: that person's own view, for that question,
//    but nothing that waits for a Yes.
let ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, haTok = "";
let seen: any, script: (req: any) => any = (req) => { seen = req; return { content: "ok" }; };
// Voiceprints: Sam and Robin point different ways; "sam-ish" is 0.74 like Sam (under the 0.78 threshold) and 0.67 like Robin.
const PRINTS: Record<string, number[]> = { sam: [1, 0, 0], robin: [0, 1, 0], wizard: [0, 0, 1], "sam-ish": [0.74, 0.6727, 0] };
const audio = (who: string) => Buffer.from(who).toString("base64");
const cfgRaw = (extra: any = {}) => ({
  model: { base_url: "http://127.0.0.1:9/v1" },
  people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }, { id: "robin", name: "Robin", role: "child" }],
  voice_id: { url: "http://127.0.0.1:9" },
  hub: { devices: [
    { id: "kitchen", name: "Kitchen", face_entity: "sensor.kitchen_face", face_unlock: true, voice_and_face: true, satellites: ["kitchen_sat"] },
    { id: "hall", name: "Hall", face_entity: "sensor.hall_face", satellites: ["hall_sat"] },
  ] },
  ...extra,
});

before(async () => {
  ha = await fakeHa({ "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } } });
  model = await fakeModel((req) => script(req));
  const raw = cfgRaw({ connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", expose: { domains: ["lock"] }, confirm_domains: ["lock"], fast_path: false }] });
  raw.model.base_url = model.url;
  const cfg = parseConfig(raw, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha" } });
  (A.voices as any).embed = async (b: Buffer) => PRINTS[b.toString()] ?? [0.5, 0.5, 0.5];
  for (const p of A.registry["cfg"]().people) await A.voices.enroll(p, Buffer.from(p.id), "audio/webm");
  haTok = A.auth.addToken("ha", "homeassistant");
});
after(async () => { await A.app.close(); ha.close(); model.close(); });

const H = (url: string, payload: any) => A.app.inject({ method: "POST", url, headers: { authorization: `Bearer ${haTok}` }, payload });
const screen = (id: string) => ({ user_id: "ha-family", screen: id, device_token: A.auth.pair(A.auth.pairCode(id)).token });
const face = (dev: string, who: string) => A.presence.set(dev, true, who);
const talk = async (K: any, who: string, extra: any = {}) => (await H("/api/ha/chat", { ...K, audio: audio(who), mime: "audio/webm", ...extra })).json();
const samsView = () => /You are talking with Sam/.test(seen.messages[0].content);

test("the decision: agree, disagree, and a close call the face settles", () => {
  const d = (who: string, f?: string) => A.voices.decide(PRINTS[who], f);
  assert.equal(d("sam").match?.how, "voice");
  assert.equal(d("sam", "sam").match?.how, "both");
  assert.equal(d("sam", "robin").match, undefined, "they disagree: nobody");
  assert.equal(d("sam", "robin").conflict?.voice.id, "sam");
  assert.equal(d("sam-ish").match, undefined, "under the threshold alone");
  assert.equal(d("sam-ish", "sam").match?.how, "face_helped");
  assert.equal(d("sam-ish", "sam").match?.person.id, "sam");
  assert.equal(d("sam-ish", "robin").match, undefined, "the face can't pick someone the voice doesn't point to");
});

test("1. a screen where the voice and the face disagree: nobody's voice counts", async () => {
  model.stt.text = "close the front door";
  const K = screen("hall");
  face("hall", "robin");
  const r = await talk(K, "sam");
  assert.equal(r.speaker, null);
  assert.ok(!samsView());
  face("hall", "sam");
  assert.equal((await talk(K, "sam")).speaker?.id, "sam", "when they agree, Sam is the speaker");
});

test("2. a voice just under the threshold counts when the camera sees that person", async () => {
  model.stt.text = "what's on the list?";
  const K = screen("hall");
  face("hall", "sam");
  const r = await talk(K, "sam-ish");
  assert.equal(r.speaker?.id, "sam");
  assert.equal(r.own_view, false);
  assert.ok(!samsView(), "only a speaker in the family's view, never Sam's things");
  face("hall", "wizard");
  assert.equal((await talk(K, "sam-ish")).speaker, null);
});

test("3. voice_and_face on: both agree, Sam's own view for that question; off: the family's view", async () => {
  model.stt.text = "what's on my list?";
  face("kitchen", "sam");
  const r = await talk(screen("kitchen"), "sam");
  assert.equal(r.own_view, true);
  assert.ok(samsView(), "Sam's own view");
  face("hall", "sam");
  const h = await talk(screen("hall"), "sam");
  assert.equal(h.own_view, false, "the hall screen doesn't allow it");
  assert.ok(!samsView());
  face("kitchen", "sam");
  const close = await talk(screen("kitchen"), "sam-ish");
  assert.equal(close.own_view, false, "a close call the face settled isn't enough for someone's own view");
});

test("3. known by voice and face: changes that need a Yes need a real sign-in", async () => {
  model.stt.text = "unlock the front door";
  let said = "";
  script = (req) => {
    seen = req;
    const last = req.messages.at(-1);
    if (last.role === "tool") { said = String(last.content); return { content: "Sign in first." }; }
    return { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "unlock" } }] };
  };
  face("kitchen", "sam");
  const n = ha.services.length;
  const r = await talk(screen("kitchen"), "sam");
  script = (req) => { seen = req; return { content: "ok" }; };
  assert.equal(r.own_view, true);
  assert.deepEqual(r.confirms, [], "no Yes button");
  assert.match(said, /needs a Yes from someone signed in.*PIN/);
  assert.equal(ha.services.length, n, "nothing unlocked");
});

test("signed in as Sam, Sam's voice, but the camera sees Robin: the family's view", async () => {
  A.auth.setPin("sam", "5678");
  const K = screen("kitchen");
  face("kitchen", "sam");
  const s = (await H("/api/ha/hub/signin", { ...K, person: "sam", pin: "5678" })).json();
  model.stt.text = "what's on my list?";
  face("kitchen", "robin");
  const r = await talk(K, "sam", { hub_session: s.hub_session });
  assert.equal(r.speaker, null);
  assert.ok(!samsView());
  face("kitchen", "sam");
  await talk(K, "sam", { hub_session: s.hub_session });
  assert.ok(samsView(), "face and voice agree again: Sam's view");
});

test("satellites next to a screen: its camera checks the voice too", async () => {
  const ask = (text: string, device_id: string) => H("/api/ha/conversation", { text, conversation_id: `c${Math.random()}`, device_id });
  A.voices.remember("what's on my list", PRINTS.sam);
  face("kitchen", "sam");
  let r = (await ask("what's on my list", "kitchen_sat")).json();
  assert.equal(r.person, "sam", "voice and face agree, and the kitchen allows it");
  assert.ok(samsView());
  A.voices.remember("what's on my list", PRINTS.sam);
  face("kitchen", "robin");
  r = (await ask("what's on my list", "kitchen_sat")).json();
  assert.equal(r.person, null);
  assert.equal(r.speaker, null, "they disagree");
  A.voices.remember("what's on my list", PRINTS["sam-ish"]);
  face("hall", "sam");
  r = (await ask("what's on my list", "hall_sat")).json();
  assert.equal(r.speaker, "sam", "a close call the hall camera settles");
  assert.equal(r.person, null);
});

test("voice_and_face needs face_unlock on that screen", () => {
  const bad = cfgRaw(); bad.hub.devices[0].face_unlock = false;
  assert.throws(() => parseConfig(bad, {}), (e: any) => e instanceof ConfigError && /voice_and_face needs face_entity and face_unlock/.test(e.message));
  assert.equal(parseConfig(cfgRaw(), {}).voice_id?.face_helps, 0.08);
});
