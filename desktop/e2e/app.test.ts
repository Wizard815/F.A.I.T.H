import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { parseConfig } from "../../server/src/config.js";
import { buildApp, type App } from "../../server/src/app.js";
import { fakeHa, fakeImmich, fakeModel } from "../../server/test/fakes.js";

// The real app (Electron) against a real FAITH with fakes. Needs a display: on Linux run it
// under xvfb-run (Playwright drives Electron itself: no browsers to download).
const require = createRequire(import.meta.url);
const { _electron } = require("playwright");
const SHOTS = process.env.FAITH_DESKTOP_SHOTS;

let immich: Awaited<ReturnType<typeof fakeImmich>>;
let ha: Awaited<ReturnType<typeof fakeHa>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, url = "";
let app: any, page: any;
before(async () => {
  ha = await fakeHa({ "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } },
    "weather.home": { state: "rainy", attributes: { friendly_name: "Home", temperature: 44, temperature_unit: "°F", humidity: 80 } } },
    { forecast: [{ datetime: "2026-11-26T12:00:00Z", condition: "cloudy", temperature: 47, templow: 35, precipitation_probability: 20 }] });
  model = await fakeModel((req) => {
    const last = req.messages?.at(-1);
    if (last?.role === "tool") return { content: String(last.content).includes("waiting_for_confirmation") ? "I'll unlock it as soon as you say **yes**." : String(last.content).includes("photos") ? "Two from the beach." : "Done." };
    const q = String(typeof last?.content === "string" ? last.content : last?.content?.[0]?.text || "");
    if (/photos/.test(q)) return { tool_calls: [{ name: "photos_search", args: { query: "beach" } }] };
    if (/unlock/.test(q)) return { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "unlock" } }] };
    return { content: "Tonight is **fish tacos**.\n- tortillas\n- limes" };
  });
  const P = (n: number) => `00000000-0000-4000-8000-00000000000${n}`;
  immich = await fakeImmich({ "k-sam": { email: "sam@example.org", name: "Sam", photos: [{ id: P(1), what: "beach sunset", city: "Holland", date: "2026-07-04" }, { id: P(2), what: "beach towels", date: "2026-07-05" }] } });
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "sam", name: "Sam", role: "adult", color: "#A0522D" }],
    connectors: [{ id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA", expose: { domains: ["lock"] } }, { id: "photos", type: "immich", url: immich.url }],
    dashboard: { entities: ["lock.front_door"] },
    board: { weather_entity: "weather.home" },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { HA: "ha", IMMICH_KEY_SAM: "k-sam" } });
  A.auth.setPassword("sam", "correct horse battery");
  url = await A.app.listen({ port: 0, host: "127.0.0.1" });
  app = await _electron.launch({
    executablePath: require("electron") as unknown as string,
    // A pretend microphone (a beep) and no permission prompt, for talking in the voice layouts.
    args: [resolve(import.meta.dirname, ".."), "--no-sandbox", "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
    env: { ...process.env, FAITH_DESKTOP_DATA: mkdtempSync(join(tmpdir(), "faith-desktop-e2e-")), FAITH_DESKTOP_TEST: "1", FAITH_DESKTOP_SHOW: "1" },
  });
  page = await app.firstWindow();
  await page.setViewportSize({ width: 480, height: 760 }).catch(() => {});
});
after(async () => { await app?.close(); await A?.app.close(); ha?.close(); model?.close(); immich?.close(); });
const shot = async (name: string) => { if (SHOTS) await page.screenshot({ path: join(SHOTS, `${name}.png`) }); };

test("sign in: a wrong password says so; the right one opens FAITH", async () => {
  await page.getByLabel("FAITH's address").fill(url);
  await page.getByLabel("Your FAITH id").fill("sam");
  await page.getByLabel("Password").fill("wrong");
  await shot("1-sign-in");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("alert").waitFor();
  assert.match(await page.getByRole("alert").innerText(), /password|PIN|wrong|isn't right/i);
  await page.getByLabel("Password").fill("correct horse battery");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByLabel("Your question").waitFor();
  assert.ok(A.auth.tokens().some((t) => t.kind === "client" && t.person_id === "sam"), "FAITH made a key for this computer");
});

test("ask: the answer is written out, with its bold and list", async () => {
  await page.getByLabel("Your question").fill("what's for dinner?");
  await page.keyboard.press("Enter");
  await page.getByText("fish tacos").waitFor();
  assert.equal(await page.locator("strong", { hasText: "fish tacos" }).count(), 1);
  assert.equal(await page.locator("li li", { hasText: "limes" }).count(), 1);
  await shot("2-answer");
  await page.emulateMedia({ colorScheme: "dark" });   // follows the computer's dark mode
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await shot("2-answer-dark");
  await page.emulateMedia({ colorScheme: "light" });
});

test("photos: an answer shows the photos FAITH found", async () => {
  await page.getByLabel("Your question").fill("beach photos");
  await page.keyboard.press("Enter");
  await page.getByText("Two from the beach.").waitFor();
  const pics = page.getByRole("button", { name: /^Photo from 2026-07-0/ });
  await pics.first().waitFor();
  assert.equal(await pics.count(), 2);
  assert.match(await pics.first().getAttribute("aria-label"), /in Holland, USA/);
  await page.locator("img[src^='data:image/jpeg']").nth(1).waitFor({ state: "attached" });
  await shot("2b-photos");
});

test("a held lock: Yes on this computer unlocks it", async () => {
  await page.getByLabel("Your question").fill("unlock the front door");
  await page.getByRole("button", { name: "Send" }).click();
  await page.getByText("unlock Front door").waitFor();
  assert.equal(ha.states["lock.front_door"].state, "locked");
  await shot("3-yes-no");
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await page.getByText(/Done|unlock/).last().waitFor();
  for (let i = 0; i < 50 && ha.services.at(-1)?.service !== "unlock"; i++) await page.waitForTimeout(100);
  assert.equal(ha.services.at(-1)?.service, "unlock");
});

test("the inbox: a new item shows, and the tab says how many are new", async () => {
  await A.notifier.send("sam", "Front door: It's Robin, holding a parcel.");
  await page.getByRole("button", { name: /Inbox \(1 new\)/ }).waitFor({ timeout: 40_000 });
  await page.getByRole("button", { name: /Inbox/ }).click();
  await page.getByText("holding a parcel").waitFor();
  await shot("4-inbox");
  assert.equal(await page.getByRole("button", { name: /new\)/ }).count(), 0, "read once opened");
});

test("the board: the day cards, the weather, a project and a log entry", async () => {
  await page.getByRole("button", { name: "Board" }).click();
  await page.getByRole("heading", { name: "Weather" }).waitFor();
  await page.getByText("Front door").waitFor();
  assert.match(await page.getByRole("region", { name: "Board" }).innerText(), /44°F/);
  await shot("5-board-top");
  await page.getByLabel("New project's name").fill("Garden shed");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await page.getByLabel("Status of Garden shed").waitFor();
  await page.getByLabel("Status of Garden shed").selectOption("active");
  await page.getByText("Garden shed is now Active.").waitFor();
  await page.getByLabel("What did you get done?").fill("Cleared the old shed");
  await page.getByLabel("Which project").selectOption("Garden shed");
  await page.getByRole("button", { name: "Log it" }).click();
  await page.getByText("Last: Cleared the old shed", { exact: false }).waitFor();
  const s = A.board.store;
  assert.deepEqual(s.projects("sam").map((p) => [p.name, p.status]), [["Garden shed", "active"]]);
  assert.equal(s.log("sam")[0].text, "Cleared the old shed");
  await shot("5-board");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await shot("5-board-dark");
  await page.emulateMedia({ colorScheme: "light" });
});

test("the page has no way to Node or the key", async () => {
  const r: any = await page.evaluate(() => ({ require: typeof (window as any).require, process: typeof (window as any).process, bridge: Object.keys((window as any).faith).sort() }));
  assert.equal(r.require, "undefined");
  assert.equal(r.process, "undefined");
  assert.ok(!r.bridge.some((k: string) => /token|key/i.test(k)));
});

const layout = async (name: RegExp) => {
  await page.getByRole("button", { name: "Settings" }).click();
  await page.getByRole("radio", { name }).check();
  await page.getByRole("button", { name: "Close" }).click();
};
const lastSystem = () => String(model.calls.at(-1)?.messages?.[0]?.content || "");

test("voice focus: talk to FAITH's emblem; the answer is a caption, short and read aloud", async () => {
  await layout(/Voice focus/);
  const talk = page.getByRole("button", { name: "Talk to FAITH" });
  await talk.waitFor();
  assert.equal(await page.getByRole("button", { name: "Board" }).count(), 0, "no tabs: just FAITH");
  model.stt.text = "what's for dinner?";
  await talk.click();
  await page.getByRole("button", { name: "Stop and send what you said" }).waitFor();
  await page.waitForTimeout(1200);
  await shot("7-focus-listening");
  await page.getByRole("button", { name: "Stop and send what you said" }).click();
  await page.getByText("“what's for dinner?”").waitFor();
  await page.getByText("fish tacos").waitFor();
  assert.match(lastSystem(), /read aloud to them/, "asked for a spoken answer");
  await shot("7-focus-answer");
  // Typing still works, and a held change still waits for a Yes on the screen.
  await page.getByRole("button", { name: "Type instead" }).click();
  await page.getByLabel("Type to FAITH").fill("unlock the front door");
  await page.keyboard.press("Enter");
  await page.getByText("unlock Front door").waitFor();
  const before = ha.services.length;
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  for (let i = 0; i < 50 && ha.services.length === before; i++) await page.waitForTimeout(100);
  assert.equal(ha.services.at(-1)?.service, "unlock");
  await page.getByText("Answered").waitFor();   // the card stays, with what happened
  ha.states["lock.front_door"].state = "locked";
});

test("voice panel: a clock, the weather and a few panels; a tap asks FAITH", async () => {
  await layout(/Voice panel/);
  await page.getByRole("region", { name: "Today at a glance" }).waitFor();
  assert.match(await page.getByRole("button", { name: /^Weather: 44°F, rainy/ }).getAttribute("aria-label"), /Ask FAITH about the weather/);
  await page.getByRole("button", { name: /The house/ }).waitFor();
  assert.match(await page.getByRole("button", { name: /The house/ }).innerText(), /Front door: locked/);
  await shot("8-panel");
  await page.getByRole("button", { name: /The house/ }).click();
  await page.getByText("“How's the house?”").waitFor();
  await page.getByText("fish tacos").waitFor();
  assert.match(lastSystem(), /read aloud to them/);
  await shot("8-panel-answer");
  await page.getByRole("button", { name: "Back to the panels" }).click();
  await page.getByRole("region", { name: "Today at a glance" }).waitFor();
  assert.ok(await page.getByRole("button", { name: "Talk to FAITH" }).isVisible(), "talking is the main way in");
});

test("voice dashboard: everything again, and the layout is kept", async () => {
  await layout(/Voice dashboard/);
  await page.getByRole("button", { name: "Board" }).waitFor();
  await page.getByRole("button", { name: "Ask" }).click();
  await page.getByLabel("Your question").waitFor();
  const st = await page.evaluate(() => (window as any).faith.state());
  assert.equal(st.settings.layout, "voice-dashboard");
  await assert.rejects(page.evaluate(() => (window as any).faith.setSettings({ layout: "sideways" })), /isn't a layout/);
});

test("sign out: the key is removed on FAITH too", async () => {
  await page.getByRole("button", { name: "Settings" }).click();
  await shot("6-settings");
  await page.getByRole("button", { name: "Sign out of this computer" }).click();
  await page.getByRole("button", { name: "Sign in" }).waitFor();
  assert.ok(!A.auth.tokens().some((t) => t.kind === "client" && t.person_id === "sam"));
});
