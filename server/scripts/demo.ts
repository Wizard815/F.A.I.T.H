/** Try FAITH with no homelab: a made-up family, a fake wiki, ALLGlance, Home
 *  Assistant (with Mealie's lists) and a scripted model. Run from the repo root:
 *    npm run build && node --import tsx server/scripts/demo.ts
 *  then open the printed address. */
import { parseConfig } from "../src/config.js";
import { buildApp } from "../src/app.js";
import { fakeHa, fakeMcp, fakeModel } from "../test/fakes.js";
import { resolve } from "node:path";

const wiki = await fakeMcp([
  { name: "context_for", readOnly: true, run: (a) => ({ profile: `${a.person} likes hiking and tacos.` }) },
  // Each token sees the shared plan plus only its own person's private notes, as the real wiki does.
  { name: "notes_search", readOnly: true, run: (_a, t) => ({ results: [{ title: "Mackinac trip plan" }, ...(t === "w-wiz" ? [{ title: "Anniversary gift ideas (Wizard's, private)" }] : t === "w-par" ? [{ title: "Quilt pattern (private)" }] : [])] }) },
  { name: "memory_log", run: () => ({ ok: true }) },
]);
const allg = await fakeMcp([
  { name: "allglance_get_day", readOnly: true, run: (_a, t) => {
    const shared = [{ title: "School pickup", start: "15:15", owner: "Sam" }, { title: "Robin's swim lesson", start: "16:30", owner: "Robin, Sam" }, { title: "Family dinner", start: "18:00", owner: "Everyone" }];
    // The household sees the shared plan; each person also sees only their own private items.
    const own: Record<string, { title: string; start: string; owner: string }[]> = {
      "a-wiz": [{ title: "Dentist", start: "09:30", owner: "Wizard" }, { title: "Call about the ring", start: "20:00", owner: "Wizard" }],
      "a-par": [{ title: "Yoga", start: "07:00", owner: "Partner" }],
    };
    return { blocks: [...(own[t] ?? []), ...shared].sort((x, y) => x.start.localeCompare(y.start)) };
  } },
  { name: "allglance_list_chores", readOnly: true, run: () => ({ chores: [{ title: "Bins out", owner: "Robin" }, { title: "Water the plants", owner: "Sam" }, { title: "Empty the dishwasher", owner: "Robin" }] }) },
  { name: "allglance_create_task", run: (a) => ({ ok: true, title: a.title }) },
]);
const today = new Intl.DateTimeFormat("en-CA").format(new Date());
const ha = await fakeHa({
  "light.kitchen": { state: "on", attributes: { friendly_name: "Kitchen lights" } }, "lock.front_door": { state: "locked", attributes: { friendly_name: "Front door" } },
  "climate.house": { state: "heat", attributes: { friendly_name: "Thermostat", current_temperature: 20.5 } }, "sensor.outside": { state: "4", attributes: { friendly_name: "Outside", unit_of_measurement: "°C" } },
}, { shopping: ["Milk", "Eggs", "Tortillas", "Limes", "Coriander"], meals: [
  { cal: "calendar.mealie_breakfast", date: today, summary: "Pancakes & berries" }, { cal: "calendar.mealie_lunch", date: today, summary: "Tomato soup" },
  { cal: "calendar.mealie_dinner", date: today, summary: "Fish tacos" }] });
const model = await fakeModel((req) => {
  if (!req?.messages) return { content: "ok" }; // health checks (GET /models) have no body
  const last = req.messages.at(-1);
  if (last.role === "tool") {
    const out = (() => { try { return JSON.parse(last.content); } catch { return {}; } })();
    if (out.status === "sent_for_approval") return { content: `I've asked a grown-up to approve that: **${out.action}**. It'll happen as soon as someone says yes.` };
    if (out.status === "waiting_for_confirmation") return { content: "I'll lock the front door as soon as you say **yes**." };
    if (out.meals) return { content: `Tonight's dinner is **${out.meals.find((m: any) => m.meal === "dinner")?.what ?? "not planned yet"}**. Want me to add anything for it to the shopping list?` };
    if (out.ok && out.added) return { content: `Added **${out.added}** to the shopping list.` };
    if (out.blocks) return { content: `Here's today:\n${out.blocks.map((b: any) => `- **${b.start}** ${b.title}`).join("\n")}` };
    return { content: "Done." };
  }
  const q = String(typeof last.content === "string" ? last.content : last.content?.[0]?.text || "").toLowerCase();
  if (q.includes("dinner")) return { tool_calls: [{ name: "meals", args: {} }] };
  if (q.includes("today")) return { tool_calls: [{ name: "allglance_get_day", args: {} }] };
  if (q.includes("list") || q.includes("need")) return { tool_calls: [{ name: "shopping_add", args: { item: q.replace(/.*need\s+/, "").replace(/add\s+(.*?)\s+to.*/, "$1").trim() || "bread" } }] };
  if (q.includes("lock")) return { tool_calls: [{ name: "home_control", args: { entity_id: "lock.front_door", service: "lock" } }] };
  return { content: "I'm the demo model. Try: what's on today, what's for dinner, we need bread, lock the front door." };
});

model.stt.text = process.env.DEMO_STT_TEXT || "What's for dinner?";
const env = { ...process.env, WIKI_TOKEN_HOUSEHOLD: "w-house", WIKI_TOKEN_WIZARD: "w-wiz", WIKI_TOKEN_PARTNER: "w-par", ALLG_HOUSEHOLD: "a-house", ALLG_WIZARD: "a-wiz", ALLG_PARTNER: "a-par", HA_TOKEN: "ha" };
const cfg = parseConfig({
  name: "Faith", family_name: "the demo family", model: { base_url: model.url, model: "demo" },
  // DEMO_HA_USER_WIZARD=<HA user id> (etc.) maps a test Home Assistant's users to the demo family.
  people: [{ id: "wizard", name: "Wizard", role: "admin", color: "#7A4E2D", mattermost_username: "wizard" }, { id: "partner", name: "Sam", role: "adult", color: "#A0522D", mattermost_username: "sam" }, { id: "kid", name: "Robin", role: "child", color: "#C08A2E", mattermost_username: "robin" }]
    .map((p) => ({ ...p, ...(process.env[`DEMO_HA_USER_${p.id.toUpperCase()}`] ? { ha_user_id: process.env[`DEMO_HA_USER_${p.id.toUpperCase()}`] } : {}) })),
  // With MATTERMOST_URL (and MATTERMOST_BOT_TOKEN) set, FAITH also runs as a Mattermost bot.
  ...(process.env.MATTERMOST_URL ? { mattermost: { url: process.env.MATTERMOST_URL, team: process.env.MATTERMOST_TEAM || "family" } } : {}),
  connectors: [
    { id: "wiki", type: "mcp", url: wiki.url, household_token_env: "WIKI_TOKEN_HOUSEHOLD", person_token_env: "WIKI_TOKEN_{ID}" },
    { id: "allglance", type: "mcp", url: allg.url, household_token_env: "ALLG_HOUSEHOLD", person_token_env: "ALLG_{ID}" },
    { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA_TOKEN", shopping_lists: ["todo.mealie_shopping_list"], meal_calendars: ["calendar.mealie_breakfast", "calendar.mealie_lunch", "calendar.mealie_dinner"] },
  ],
  hub: { devices: [{ id: "kitchen", name: "Kitchen" }], idle_seconds: 300 },
  // DEMO_EMBED_FROM=http://<your test HA> lets HA's "FAITH Admin" sidebar page show FAITH.
  embed: { allow_from: (process.env.DEMO_EMBED_FROM || "").split(",").filter(Boolean) },
  // DEMO_WYOMING_PORT=10300 runs FAITH's speech-to-text for HA's voice pipeline; DEMO_VOICEID_URL adds voice ID.
  ...(process.env.DEMO_WYOMING_PORT ? { wyoming: { port: Number(process.env.DEMO_WYOMING_PORT), host: "127.0.0.1" } } : {}),
  ...(process.env.DEMO_VOICEID_URL ? { voice_id: { url: process.env.DEMO_VOICEID_URL } } : {}),
  dashboard: { entities: ["climate.house", "lock.front_door", "light.kitchen", "sensor.outside"] },
  apps: [
    { id: "ha", name: "Home Assistant", url: "http://homeassistant.local:8123", icon: "🏠" }, { id: "mealie", name: "Mealie", url: "http://mealie.local", icon: "🍲" },
    { id: "mattermost", name: "Mattermost", url: "http://chat.local", icon: "💬" }, { id: "allglance", name: "Calendar", url: "http://allglance.local:3457", icon: "📅" },
    { id: "coinpile", name: "Coinpile", url: "http://coinpile.local", icon: "🪙", who: "person", roles: ["admin", "adult"] },
    { id: "studio", name: "Hermes Studio", url: "http://studio.local", icon: "🤖", who: "person", roles: ["admin", "adult"] },
    { id: "orb", name: "Pondering Orb", url: "http://orb.local", icon: "🔮", who: "person", people: ["wizard"] },
  ],
}, {});
const port = Number(process.env.PORT || 8097);
const { app, auth, agent, approvals, db, voices } = await buildApp({ config: () => ({ ...cfg, port }), dataFile: ":memory:", env, webDir: resolve(import.meta.dirname, "../../web/dist") });
auth.setPin("wizard", "1234"); auth.setPin("partner", "5678"); auth.setPin("kid", "0000"); auth.setPassword("wizard", "demo-password");
await app.listen({ port, host: "127.0.0.1" });
if (cfg.wyoming) {
  const { WyomingStt } = await import("../src/wyoming.js");
  const stt = new WyomingStt({ cfg: () => cfg, env, voices, log: { info: (o, m) => console.log(m, JSON.stringify(o)), warn: (o, m) => console.warn(m, JSON.stringify(o)) } });
  console.log(`Speech-to-text for HA (Wyoming) on port ${await stt.listen()}`);
}
if (cfg.mattermost) {
  const { MattermostBot } = await import("../src/mattermost.js");
  const bot = new MattermostBot(() => cfg, db, agent, approvals, { info: (o, m) => console.log("[mattermost]", m, JSON.stringify(o)), warn: (o, m) => console.warn("[mattermost]", m, JSON.stringify(o)) }, env);
  await bot.start();
}
console.log(`FAITH demo on http://localhost:${port}
  Pair this browser as the kitchen screen with code: ${auth.pairCode("kitchen")}
  PINs: Wizard 1234 · Sam 5678 · Robin 0000. Wizard's password: demo-password
  Token for a test Home Assistant (the FAITH integration): ${auth.addToken("ha", "demo-home-assistant")}`);
