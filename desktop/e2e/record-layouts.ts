/** Records a short video of each layout (Voice focus, Voice panel, Voice dashboard) against a
 *  FAITH with a pretend household. Not a test: run it to see the layouts move.
 *
 *    npm run build && xvfb-run -a node --import tsx e2e/record-layouts.ts <out folder>
 *
 *  Needs espeak-ng (FAITH's spoken answers) and ffmpeg (the spoken answers, and recording the screen). */
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import type { AddressInfo } from "node:net";
import { parseConfig } from "../../server/src/config.js";
import { buildApp } from "../../server/src/app.js";
import { BoardStore } from "../../server/src/board/store.js";
import { fakeHa, fakeMcp } from "../../server/test/fakes.js";

const require = createRequire(import.meta.url);
const { _electron } = require("playwright");
const OUT = resolve(process.argv[2] || "layout-videos");
mkdirSync(OUT, { recursive: true });
const today = new Intl.DateTimeFormat("en-CA").format(new Date());

// ---- a pretend household ----
const allg = await fakeMcp([
  { name: "allglance_get_day", readOnly: true, run: () => ({ blocks: [
    { title: "School pickup", start: "15:15", owner: "Sam" }, { title: "Robin's swim lesson", start: "18:30", owner: "Robin, Sam" }, { title: "Book club call", start: "20:00", owner: "Sam" }] }) },
]);
const ha = await fakeHa({
  "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } },
  "light.kitchen": { state: "on", attributes: { friendly_name: "Kitchen lights" } },
  "climate.house": { state: "heat", attributes: { friendly_name: "Thermostat", current_temperature: 69 } },
  "weather.home": { state: "rainy", attributes: { friendly_name: "Home", temperature: 44, temperature_unit: "°F", humidity: 80 } },
}, {
  shopping: ["Tortillas", "Limes", "Coriander"],
  meals: [{ cal: "calendar.mealie_dinner", date: today, summary: "Fish tacos" }],
  forecast: [{ datetime: new Date(Date.now() + 86_400_000).toISOString(), condition: "cloudy", temperature: 47, templow: 35, precipitation_probability: 20 }],
});

// ---- a scripted model with a real voice (espeak-ng), so the emblem speaks ----
let heard = "what's for dinner?";
const ANSWERS: [RegExp, string | { tool: string; args: any; then: string }][] = [
  [/dinner/i, { tool: "meals", args: {}, then: "Tonight is fish tacos. The tortillas, limes and coriander are already on the list." }],
  [/on today|today\?|what's next|next up/i, { tool: "allglance_get_day", args: {}, then: "School pickup at quarter past three, Robin's swim lesson at half past six, and your book club call at eight." }],
  [/add milk/i, { tool: "shopping_add", args: { item: "Milk" }, then: "Done. Milk is on the shopping list." }],
  [/shopping list/i, { tool: "shopping_list", args: {}, then: "Tortillas, limes, coriander and milk." }],
  [/house/i, "The front door is locked, the kitchen lights are on, and it's 69 degrees inside."],
  [/weather/i, "Rainy and 44 degrees right now. Tomorrow is cloudy with a high of 47."],
  [/brief/i, "Good evening, Sam. Rain until late tonight. Robin's swim lesson is at half past six, and dinner is fish tacos."],
  [/lock the front door/i, { tool: "home_control", args: { entity_id: "lock.front_door", service: "lock" }, then: "Tap Yes and I'll lock it." }],
];
const say = (text: string) => {
  const wav = execFileSync("espeak-ng", ["-v", "en-us+f3", "-s", "165", "--stdout", text]);
  return execFileSync("ffmpeg", ["-nostdin", "-loglevel", "error", "-i", "-", "-f", "mp3", "-b:a", "64k", "-"], { input: wav });
};
const model = createServer(async (req, res) => {
  let raw = ""; for await (const c of req) raw += c;
  const json = (v: unknown) => { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(v)); };
  if (req.url?.endsWith("/audio/transcriptions")) return json({ text: heard });
  if (req.url?.endsWith("/audio/speech")) { res.setHeader("content-type", "audio/mpeg"); return res.end(say(JSON.parse(raw).input)); }
  if (req.url?.endsWith("/models")) return json({ data: [{ id: "demo" }] });
  const b = raw ? JSON.parse(raw) : {}, msgs = b.messages || [], last = msgs.at(-1);
  const user = [...msgs].reverse().find((m: any) => m.role === "user");
  const q = String(typeof user?.content === "string" ? user.content : user?.content?.[0]?.text || "");
  const hit = ANSWERS.find(([r]) => r.test(q))?.[1] ?? "I can help with the day, dinner, the shopping list and the house.";
  await new Promise((r) => setTimeout(r, 700));   // a moment to think
  const message = typeof hit === "string" ? { content: hit }
    : last?.role === "tool" ? { content: String(last.content).includes("waiting_for_confirmation") ? hit.then : hit.then }
    : { content: null, tool_calls: [{ id: `c${Date.now()}`, type: "function", function: { name: hit.tool, arguments: JSON.stringify(hit.args) } }] };
  json({ choices: [{ message: { role: "assistant", ...message } }] });
});
await new Promise<void>((r) => model.listen(0, "127.0.0.1", r));
const modelUrl = `http://127.0.0.1:${(model.address() as AddressInfo).port}/v1`;

const cfg = parseConfig({
  name: "Faith", model: { base_url: modelUrl, model: "demo" },
  people: [{ id: "sam", name: "Sam", role: "adult", color: "#A0522D" }],
  connectors: [
    { id: "allglance", type: "mcp", url: allg.url, person_token_env: "ALLG_{ID}", household_token_env: "ALLG_HOUSE" },
    { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", shopping_lists: ["todo.mealie_shopping_list"], meal_calendars: ["calendar.mealie_dinner"], fast_path: false },
  ],
  dashboard: { entities: ["lock.front_door", "light.kitchen", "climate.house"] },
  board: { weather_entity: "weather.home" },
}, {});
const A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha", ALLG_SAM: "a-sam", ALLG_HOUSE: "a-house" } });
A.auth.setPassword("sam", "demo-password");
const store = new BoardStore(A.db, () => 200);
store.saveBrief("sam", { day: today, text: "Good evening, Sam. Rain until late tonight. Robin's swim lesson is at half past six, and dinner is fish tacos.", by: "faith", at: Date.now() });
store.addProject("sam", { name: "Garden shed", status: "active", next: "Order the timber" });
store.addProject("sam", { name: "Photo albums", status: "next", next: "Pick the summer photos" });
store.addLog("sam", { text: "Cleared the old shed's footing", project: "Garden shed", by: "you", day: today });
const url = await A.app.listen({ port: 0, host: "127.0.0.1" });

// ---- the app ----
const data = mkdtempSync(join(tmpdir(), "faith-record-"));
const launch = (size?: { width: number; height: number }) => _electron.launch({
  executablePath: require("electron") as unknown as string,
  args: [resolve(import.meta.dirname, ".."), "--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream", "--autoplay-policy=no-user-gesture-required"],
  env: { ...process.env, FAITH_DESKTOP_DATA: data, FAITH_DESKTOP_TEST: "1", FAITH_DESKTOP_SHOW: "1", ...(size ? { FAITH_DESKTOP_SIZE: `${size.width}x${size.height}` } : {}) },
});
const T0 = Date.now();
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const step = (m: string) => { if (process.env.DBG) console.error(`${((Date.now() - T0) / 1000).toFixed(1)} ${m}`); };

console.error("FAITH up at", url);
// Sign in once (not recorded).
{
  const app = await launch(), page = await app.firstWindow();
  await page.getByLabel("FAITH's address").fill(url);
  await page.getByLabel("Your FAITH id").fill("sam");
  await page.getByLabel("Password").fill("demo-password");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByLabel("Your question").waitFor();
  await app.close();
  console.error("signed in");
}

/** One layout's video: the virtual screen's corner where the window sits, recorded with ffmpeg. */
async function record(name: string, layout: string, size: { width: number; height: number }, run: (page: any) => Promise<void>) {
  if (process.env.ONLY && !name.includes(process.env.ONLY)) return;
  const settings = join(data, "settings.json");
  // No global shortcut: two copies of the app in a row would both grab it.
  writeFileSync(settings, JSON.stringify({ ...JSON.parse(readFileSync(settings, "utf8")), layout, conversationId: undefined, shortcut: "" }));
  const app = await launch(size), page = await app.firstWindow();
  await page.locator("main, section").first().waitFor({ timeout: 20_000 });
  await wait(1200);
  const mp4 = join(OUT, `${name}.mp4`);
  const ff = spawn("ffmpeg", ["-nostdin", "-loglevel", "error", "-y", "-f", "x11grab", "-framerate", "25", "-video_size", `${size.width}x${size.height}`, "-i", `${process.env.DISPLAY}+0,0`,
    "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-crf", "24", "-movflags", "+faststart", mp4], { stdio: ["ignore", "inherit", "inherit"] });
  await wait(800);
  try { await run(page); } finally {
    ff.kill("SIGINT"); await new Promise((r) => ff.on("exit", r));   // ffmpeg finishes the file on Ctrl-C
    // FAITH stays in the tray; if it doesn't close in a few seconds, end it.
    await Promise.race([app.close(), wait(5000)]);
    try { app.process().kill("SIGKILL"); } catch { /* already gone */ }
  }
  console.log(`${name}.mp4`);
}

const talk = async (page: any, words: string, holdMs = 1600) => {
  heard = words;
  await page.getByRole("button", { name: "Talk to FAITH" }).first().click();
  await wait(holdMs);
  await page.getByRole("button", { name: "Stop and send what you said" }).first().click();
};
const untilQuiet = async (page: any) => {   // FAITH has answered and finished speaking
  await page.getByText(/Speaking…|Thinking…/).first().waitFor({ timeout: 15_000 }).catch(() => {});
  await page.waitForFunction(() => !/Speaking…|Thinking…|Listening…/.test(document.body.innerText), null, { timeout: 30_000 });
};

await record("1-voice-focus", "voice-focus", { width: 560, height: 800 }, async (page) => {
  await wait(1500);
  await talk(page, "What's for dinner?");
  await untilQuiet(page); await wait(1500);
  await talk(page, "What's on today?");
  await untilQuiet(page); await wait(1500);
  await talk(page, "Lock the front door");
  await page.getByRole("button", { name: "Yes", exact: true }).waitFor(); await wait(1500);
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await untilQuiet(page); await wait(2000);
});

await record("2-voice-panel", "voice-panel", { width: 1024, height: 600 }, async (page) => {
  await page.getByRole("region", { name: "Today at a glance" }).waitFor(); await wait(2500);
  await page.getByRole("button", { name: /Dinner/ }).click();
  await untilQuiet(page); await wait(1500);
  await page.getByRole("button", { name: "Back to the panels" }).click(); await wait(1500);
  await talk(page, "Add milk to the shopping list");
  await untilQuiet(page); await wait(1200);
  await page.getByRole("button", { name: "Back to the panels" }).click(); await wait(2000);
  await page.getByRole("button", { name: /Next up/ }).click();
  await untilQuiet(page); await wait(1500);
  await page.getByRole("button", { name: "Back to the panels" }).click(); await wait(2000);
});

await record("3-voice-dashboard", "voice-dashboard", { width: 1100, height: 760 }, async (page) => {
  step("dashboard"); await page.getByLabel("Your question").waitFor(); await wait(1000); step("typing");
  await page.getByLabel("Your question").pressSequentially("What's on today?", { delay: 45 });
  await page.keyboard.press("Enter");
  step("sent"); await page.getByText(/swim lesson/).first().waitFor({ timeout: 30_000 }); await wait(2500); step("answered");
  await page.getByRole("button", { name: "Board" }).click(); await wait(3500); step("board");
  await page.getByRole("region", { name: "Board" }).evaluate((el: HTMLElement) => el.scrollBy({ top: 500, behavior: "smooth" })); await wait(2500);
  await page.getByRole("region", { name: "Board" }).evaluate((el: HTMLElement) => el.scrollBy({ top: -500, behavior: "smooth" })); await wait(800); step("scrolled");
  void A.notifier.send("sam", "Front door: It's Robin, home from swimming.");
  await page.getByRole("button", { name: /Inbox \(1 new\)/ }).waitFor({ timeout: 40_000 }); await wait(1200); step("inbox");
  await page.getByRole("button", { name: /Inbox/ }).click(); await wait(3000);
});

await A.app.close(); model.close(); allg.close(); ha.close();
rmSync(data, { recursive: true, force: true });
console.log(`Videos in ${OUT}`);
