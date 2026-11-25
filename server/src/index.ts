import { resolve, dirname } from "node:path";
import { accessSync, constants, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { buildApp } from "./app.js";
import { ConfigError, loadConfig, envValue, personEnv } from "./config.js";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.FAITH_DATA || "/data";
const configPath = process.env.FAITH_CONFIG || "/config/faith.yaml";

try { mkdirSync(dataDir, { recursive: true }); accessSync(dataDir, constants.W_OK); }
catch {
  const uid = typeof process.getuid === "function" ? process.getuid() : "?";
  console.error(`FAITH can't write to its data folder ${dataDir} (running as uid ${uid}). On the host: sudo chown ${uid}:${uid} <that folder>.`);
  process.exit(1);
}

let config;
try { config = loadConfig(configPath); }
catch (e) { if (e instanceof ConfigError) { console.error(e.message); process.exit(1); } throw e; }
const cfg = () => config!;

const { app, presence, agent, approvals, db, routines, rewards, notifier, voices, health, board } = await buildApp({ config: cfg, dataFile: resolve(dataDir, "faith.db"), webDir: process.env.FAITH_WEB || resolve(here, "../../web/dist"), logger: true });

// Say what's missing instead of failing quietly later.
for (const c of cfg().connectors) {
  if (c.type === "mcp") {
    if (c.household_token_env && !envValue(c.household_token_env)) app.log.warn(`${c.id}: ${c.household_token_env} is empty, so the household view won't have ${c.id}.`);
    for (const p of cfg().people) { const n = personEnv(c.person_token_env, p.id); if (n && !envValue(n)) app.log.warn(`${c.id}: ${n} is empty, so ${p.name} won't have ${c.id}.`); }
  }
  if (c.type === "homeassistant" && !envValue(c.token_env)) app.log.warn(`homeassistant: ${c.token_env} is empty, so FAITH can't reach Home Assistant.`);
}
if (!cfg().public_url.startsWith("https://")) app.log.warn("public_url isn't https, so Face ID (passkeys) is off. PINs and passwords still work.");
if (!cfg().people.length) app.log.warn("No people in the config yet. Add your family under people: in faith.yaml.");

presence.start();
rewards.seed();     // a starter list of jobs and rewards the first time; edit them in the admin page
routines.start();   // scheduled skills (checked every 30 seconds)
board.start();      // the morning brief, for the people in board.brief.people
health.start();     // every source checked every couple of minutes; the parents hear when one goes down
if (cfg().mattermost) {
  const { MattermostBot } = await import("./mattermost.js");
  const bot = new MattermostBot(cfg, db, agent, approvals, app.log);
  notifier.bot = bot;
  health.bot = bot;
  bot.start();
  app.addHook("onClose", async () => bot.stop());
}
if (cfg().wyoming) {
  const { WyomingStt } = await import("./wyoming.js");
  const stt = new WyomingStt({ cfg, env: process.env, voices, log: app.log });
  const port = await stt.listen();
  app.log.info(`Speech-to-text for Home Assistant (Wyoming) on port ${port}${voices.enabled() ? ", with voice ID" : ""}.`);
  app.addHook("onClose", async () => stt.close());
}
await app.listen({ port: cfg().port, host: process.env.HOST || "0.0.0.0" });
app.log.info(`${cfg().name} is up. Model: ${cfg().model.base_url} (${cfg().model.model || "server default"}).`);
for (const sig of ["SIGINT", "SIGTERM"] as const) process.on(sig, async () => { await app.close(); process.exit(0); });
