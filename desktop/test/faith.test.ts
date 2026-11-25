import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parseConfig } from "../../server/src/config.js";
import { buildApp, type App } from "../../server/src/app.js";
import { fakeHa, fakeImmich, fakeModel } from "../../server/test/fakes.js";
import { cleanUrl, Faith, FaithError, friendlyTool, NOT_ANSWERING, parseSse, SignedOut, type ChatEvent } from "../src/faith.js";
import { Store } from "../src/store.js";
import { InboxWatch } from "../src/watch.js";

// The desktop app's side of docs/clients.md, against a real FAITH (fake model and HA).
const PHOTO = "00000000-0000-4000-8000-000000000001";
let immich: Awaited<ReturnType<typeof fakeImmich>>;
let ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, url = "";
let script: (req: any) => any = () => ({ content: "ok" });
before(async () => {
  ha = await fakeHa({ "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } } });
  model = await fakeModel((req) => script(req));
  immich = await fakeImmich({ "k-sam": { email: "sam@example.org", name: "Sam", photos: [{ id: PHOTO, what: "beach sunset", date: "2026-07-04" }] } });
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "adult", color: "#A0522D" }],
    connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", expose: { domains: ["lock"] } }, { id: "photos", type: "immich", url: immich.url }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha", IMMICH_KEY_SAM: "k-sam" } });
  A.auth.setPassword("sam", "correct horse battery");
  url = await A.app.listen({ port: 0, host: "127.0.0.1" });
});
after(async () => { await A.app.close(); ha.close(); model.close(); immich.close(); });

test("addresses, stream lines and tool names", () => {
  assert.equal(cleanUrl(" faith:8097/ "), "http://faith:8097");
  assert.equal(cleanUrl("https://faith.example.org"), "https://faith.example.org");
  assert.throws(() => cleanUrl("http://faith:8097/api/chat"), /address only/);
  assert.deepEqual(parseSse('data: {"type":"text","delta":"Hi"}'), { type: "text", delta: "Hi" });
  assert.equal(parseSse(": keep-alive"), null);
  assert.equal(parseSse("data: not json"), null);
  assert.equal(friendlyTool("allglance_get_day"), "checking the calendar");
  assert.equal(friendlyTool("HassTurnOff"), "checking the house");
});

test("sign in once with the password; the computer keeps a key, not the password", async () => {
  const f = new Faith(url);
  await assert.rejects(f.signIn("sam", "wrong", "laptop"), (e: any) => e instanceof FaithError && e.status === 401);
  const d = await f.signIn("Sam ", "correct horse battery", "Sam's laptop desktop");
  assert.match(d.token, /^fapp_/);
  assert.match(d.name, /^sam-sam-s-laptop-desktop-/);
  assert.deepEqual(d.person, { id: "sam", name: "Sam", role: "adult", color: "#A0522D" });
  assert.equal((await f.me()).id, "sam");
});

test("asking: the answer as it's written, what FAITH checks, and a Yes for a lock", async () => {
  const f = new Faith(url);
  await f.signIn("sam", "correct horse battery", "laptop");
  let k = 0;
  script = () => (k++ % 2 === 0 ? { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "unlock" } }] } : { content: "Tap **Yes** to unlock." });
  const events: ChatEvent[] = [];
  const answer = await f.chat({ text: "unlock the front door" }, (e) => events.push(e));
  assert.equal(answer, "Tap **Yes** to unlock.");
  const types = events.map((e) => e.type);
  assert.deepEqual([types[0], types.at(-1)], ["conversation", "done"]);
  assert.ok(types.includes("tool"));
  const c = events.find((e) => e.type === "confirm") as Extract<ChatEvent, { type: "confirm" }>;
  assert.equal(c.summary, "unlock Front door");
  assert.equal(ha.states["lock.front_door"].state, "locked", "nothing before the Yes");
  const r = await f.confirm(c.id, true);
  assert.equal(r.ok, true);
  assert.equal(ha.services.at(-1)!.service, "unlock", "this computer counts as Sam's own screen");
  ha.states["lock.front_door"].state = "locked";
});

test("a follow-up continues the conversation; latest brings it back", async () => {
  const f = new Faith(url);
  await f.signIn("sam", "correct horse battery", "laptop");
  let conv = "";
  script = () => ({ content: "Tacos." });
  await f.chat({ text: "what's for dinner?" }, (e) => { if (e.type === "conversation") conv = e.id; });
  let seen: any;
  script = (req) => { seen = req; return { content: "With salsa." }; };
  await f.chat({ text: "and with it?", conversation_id: conv }, () => {});
  assert.ok(seen.messages.some((m: any) => m.role === "assistant" && m.content === "Tacos."));
  const l = await f.latest();
  assert.equal(l.conversation_id, conv);
  assert.deepEqual(l.messages.slice(-2).map((m) => m.content), ["and with it?", "With salsa."]);
});

test("a photo goes with the question", async () => {
  const f = new Faith(url);
  await f.signIn("sam", "correct horse battery", "laptop");
  let seen: any;
  script = (req) => { seen = req; return { content: "A cat." }; };
  const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  assert.equal(await f.chat({ text: "what's this?", images: [png] }, () => {}), "A cat.");
  assert.ok(seen.messages.at(-1).content.some((p: any) => p.type === "image_url"));
});

test("photos: the answer shows them, and their pictures come through FAITH", async () => {
  const f = new Faith(url);
  await f.signIn("sam", "correct horse battery", "laptop");
  let k = 0;
  script = () => (k++ === 0 ? { tool_calls: [{ name: "photos_search", args: { query: "beach" } }] } : { content: "Here's the beach." });
  const events: ChatEvent[] = [];
  await f.chat({ text: "beach photos" }, (e) => events.push(e));
  const shown = events.find((e) => e.type === "photos") as Extract<ChatEvent, { type: "photos" }>;
  assert.deepEqual(shown.items.map((p) => p.id), [PHOTO]);
  assert.equal(await f.photo("photos", PHOTO), `data:image/jpeg;base64,${Buffer.from(`jpeg:${PHOTO}`).toString("base64")}`);
});

test("voice: speech to text, and the answer read aloud", async () => {
  const f = new Faith(url);
  await f.signIn("sam", "correct horse battery", "laptop");
  model.stt.text = "what's on today?";
  assert.equal(await f.transcribe(new Uint8Array(4000).fill(1), "audio/webm;codecs=opus"), "what's on today?");
  assert.equal(Buffer.from(await f.speak("Tacos tonight.")).toString(), "mp3:Tacos tonight.");
});

test("the board: projects, the log and the brief, Sam's own", async () => {
  const f = new Faith(url);
  await f.signIn("sam", "correct horse battery", "laptop");
  await f.addProject("Garden shed", "active", "Order the timber");
  await f.addLog("Cleared the old shed", "Garden shed");
  await assert.rejects(f.addLog("Fixed", "No such project"), (e: any) => e instanceof FaithError && e.status === 400 && /No project called/.test(e.message));
  await f.updateProject("Garden shed", { status: "blocked" });
  script = () => ({ content: "Good morning, Sam. **Garden shed** is blocked." });
  assert.match((await f.writeBrief()).text, /Good morning/);
  const b = await f.board();
  assert.equal(b.person?.id, "sam");
  assert.deepEqual(b.projects?.map((p) => [p.name, p.status, p.last]), [["Garden shed", "blocked", "Cleared the old shed"]]);
  assert.match(b.brief!.text, /blocked/);
  assert.equal(b.weather, null, "no weather entity set up: no weather part");
  assert.ok(Array.isArray(b.cards));
});

test("the tray's inbox: what's there at first isn't news; new items are, and a removed key signs out", async () => {
  const f = new Faith(url);
  const d = await f.signIn("sam", "correct horse battery", "laptop");
  await A.notifier.send("sam", "Old news.");
  let seen: number | undefined;
  const got: { texts: string[]; fresh: boolean }[] = [], problems: (string | null)[] = [];
  let out = "";
  const w = new InboxWatch(() => f, { get: () => seen, set: (id) => { seen = id; } },
    { items: (items, fresh) => got.push({ texts: items.map((i) => i.text), fresh }), status: (p) => problems.push(p), signedOut: (m) => { out = m; } },
    () => new Promise((r) => setTimeout(r, 10)), 2);
  w.start();
  for (let i = 0; i < 50 && !got.length; i++) await new Promise((r) => setTimeout(r, 20));
  assert.equal(got[0].fresh, false, "first time on this computer: shown, not popped up");
  assert.ok(got[0].texts.includes("Old news."));
  await A.notifier.send("sam", "Front door: It's Robin.");
  for (let i = 0; i < 100 && got.length < 2; i++) await new Promise((r) => setTimeout(r, 20));
  assert.deepEqual(got[1], { texts: ["Front door: It's Robin."], fresh: true });
  A.auth.revokeToken(d.name);
  for (let i = 0; i < 150 && !out; i++) await new Promise((r) => setTimeout(r, 20));
  assert.match(out, /isn't signed in to FAITH any more/);
  assert.equal(w.running, false);
});

test("sign out removes the key on FAITH too", async () => {
  const f = new Faith(url);
  const d = await f.signIn("sam", "correct horse battery", "laptop");
  const again = new Faith(url, d.token);
  await f.signOut(d.name);
  await assert.rejects(again.me(), SignedOut);
});

test("FAITH down: plain words, and the watch keeps trying", async () => {
  const f = new Faith("http://127.0.0.1:9", "fapp_x");
  await assert.rejects(f.me(), (e: any) => e.message === NOT_ANSWERING);
  const problems: (string | null)[] = [];
  let pauses = 0;
  const w = new InboxWatch(() => f, { get: () => 0, set: () => {} }, { items: () => {}, status: (p) => problems.push(p), signedOut: () => {} },
    async () => { if (++pauses >= 3) w.stop(); }, 1);
  w.start();
  for (let i = 0; i < 100 && w.running; i++) await new Promise((r) => setTimeout(r, 20));
  assert.equal(problems[0], NOT_ANSWERING);
  assert.ok(pauses >= 3, "tried again");
});

test("the key is kept encrypted, readable by this account only, and forgotten on sign out", () => {
  const dir = mkdtempSync(join(tmpdir(), "faith-desktop-"));
  const vault = { available: () => true, encrypt: (s: string) => Buffer.from([...s].reverse().join("")), decrypt: (b: Buffer) => [...b.toString()].reverse().join("") };
  const s = new Store(dir, vault);
  s.saveToken("fapp_secret");
  s.set({ url: "http://faith:8097", clientName: "sam-laptop-x" });
  assert.equal(new Store(dir, vault).token, "fapp_secret");
  assert.equal(statSync(join(dir, "faith.key")).mode & 0o777, 0o600);
  assert.ok(!statSync(join(dir, "faith.key")).size || !readFileSync(join(dir, "faith.key"), "utf8").includes("fapp_secret"));
  assert.ok(!readFileSync(join(dir, "settings.json"), "utf8").includes("fapp_"), "never in the settings file");
  s.forget();
  assert.equal(s.token, undefined);
  assert.equal(s.settings.clientName, undefined);
  assert.equal(s.settings.url, "http://faith:8097", "the address stays, for signing in again");
  assert.throws(() => new Store(dir, { ...vault, available: () => false }).saveToken("x"), /no keychain/);
  // Linux without a keyring: a file only this account can read.
  const plain = new Store(dir, { ...vault, available: () => false, plainOk: true });
  assert.equal(plain.keeping, "file");
  plain.saveToken("fapp_plain");
  assert.equal(statSync(join(dir, "faith.key.txt")).mode & 0o777, 0o600);
  assert.equal(new Store(dir, { ...vault, available: () => false, plainOk: true }).token, "fapp_plain");
  plain.forget();
  assert.equal(plain.token, undefined);
});
