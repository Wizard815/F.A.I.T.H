import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { stringify } from "yaml";
import { parseConfig } from "./config.js";

/** `faith init`: find the family's services on the network and write a first
 *  faith.yaml, plus the list of tokens to make (homelab-ai's init wizard,
 *  for FAITH's stack). It only reads: nothing is changed on the services. */

export type Service = { id: string; port: number; path: string; kind: "mcp" | "http" | "ha" | "model"; what: string; names?: string[];
  /** A 401/403 there still means it's this service (it wants a key). */ keyed?: boolean };
export const SERVICES: Service[] = [
  { id: "argos", port: 8080, path: "/v1/models", kind: "model", what: "Argos (the local models)", names: ["argos"], keyed: true },
  { id: "wiki", port: 27123, path: "/family-mcp", kind: "mcp", what: "the family wiki (LLM-will-remember-this)" },
  { id: "allglance", port: 8090, path: "/mcp", kind: "mcp", what: "ALLGlance (calendar, tasks, chores)" },
  { id: "homeassistant", port: 8123, path: "/api/", kind: "ha", what: "Home Assistant", names: ["homeassistant"] },
  { id: "coinpile", port: 8190, path: "/api/v1/mcp", kind: "mcp", what: "Coinpile (money)" },
  { id: "orb", port: 8095, path: "/mcp", kind: "mcp", what: "Pondering Orb" },
  { id: "hermes", port: 8642, path: "/v1/models", kind: "http", what: "Hermes", keyed: true },
  { id: "studio", port: 6060, path: "/", kind: "http", what: "Hermes Studio" },
  { id: "mattermost", port: 8065, path: "/api/v4/system/ping", kind: "http", what: "Mattermost", names: ["mattermost"] },
  { id: "voiceid", port: 8099, path: "/health", kind: "http", what: "voice ID (FAITH's voiceid service)", names: ["voiceid"] },
  { id: "hamcp", port: 9584, path: "/", kind: "http", what: "ha-mcp (Home Assistant for agents)" },
];

/** Is something of this kind answering at this address? Any answer counts except "nothing there". */
export async function probe(s: Service, host: string, timeoutMs = 2500): Promise<boolean> {
  const url = `http://${host}:${s.port}${s.path}`;
  try {
    const r = s.kind === "mcp"
      ? await fetch(url, { method: "POST", signal: AbortSignal.timeout(timeoutMs), headers: { "Content-Type": "application/json", Accept: "application/json, text/event-stream" },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "faith-init", version: "1" } } }) })
      : await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
    if (s.kind === "ha") return r.status === 401 || r.status === 200; // HA's API without a token: 401
    if (s.kind === "mcp") return r.ok || r.status === 401 || r.status === 403; // an MCP server, with or without our token
    if (s.path === "/") return r.status < 500;                          // only that something answers on the port
    return r.ok || (!!s.keyed && (r.status === 401 || r.status === 403)); // the service's own health/model path
  } catch { return false; }
}

export type Found = Record<string, string>; // service id -> base URL
export async function discover(hosts: string[], log: (m: string) => void = () => {}): Promise<Found> {
  const found: Found = {};
  await Promise.all(SERVICES.map(async (s) => {
    for (const h of [...(s.names ?? []), ...hosts]) {
      if (await probe(s, h)) { found[s.id] = `http://${h}:${s.port}`; log(`  ✓ ${s.what} at ${found[s.id]}`); return; }
    }
    log(`  · ${s.what}: not found`);
  }));
  return found;
}

export type InitPerson = { id: string; name: string; role: "admin" | "adult" | "child" };

/** The config and the .env checklist for what was found. */
export function build(found: Found, people: InitPerson[], name = "Faith") {
  const has = (id: string) => !!found[id];
  const env: { key: string; how: string }[] = [];
  const need = (key: string, how: string) => env.push({ key, how });
  const ids = people.map((p) => p.id.toUpperCase());
  const adults = people.filter((p) => p.role !== "child");

  const connectors: any[] = [];
  if (has("wiki")) {
    connectors.push({ id: "wiki", type: "mcp", url: `${found.wiki}/family-mcp`, description: "The family wiki: long-term memory, notes, profiles, today's notes",
      household_token_env: "WIKI_TOKEN_HOUSEHOLD", person_token_env: "WIKI_TOKEN_{ID}",
      tools: ["whoami", "who_is", "family_members", "context_for", "memory_log", "memory_capture", "notes_search", "note_read", "query_wiki", "conversation_log"] });
    need("WIKI_TOKEN_HOUSEHOLD", "in the wiki: node scripts/family-setup.mjs add-shared faith FAITH");
    for (const p of people) need(`WIKI_TOKEN_${p.id.toUpperCase()}`, `in the wiki: node scripts/family-setup.mjs token ${p.id}`);
  }
  if (has("allglance")) {
    connectors.push({ id: "allglance", type: "mcp", url: `${found.allglance}/mcp`, description: "ALLGlance: the family calendar, tasks, chores and life events",
      household_token_env: "ALLGLANCE_TOKEN_HOUSEHOLD", person_token_env: "ALLGLANCE_TOKEN_{ID}", tools: ["allglance_*"] });
    need("ALLGLANCE_TOKEN_HOUSEHOLD", "in ALLGlance: node scripts/tokens.mjs add-household faith");
    for (const p of people) need(`ALLGLANCE_TOKEN_${p.id.toUpperCase()}`, `in ALLGlance: node scripts/tokens.mjs add-person ${p.id}`);
  }
  if (has("homeassistant")) {
    connectors.push({ id: "homeassistant", type: "homeassistant", url: found.homeassistant, token_env: "HA_TOKEN",
      shopping_lists: ["todo.mealie_shopping_list"], meal_calendars: ["calendar.mealie_breakfast", "calendar.mealie_lunch", "calendar.mealie_dinner"] });
    need("HA_TOKEN", "in HA: add a non-admin user called FAITH, sign in as it, Profile → Security → Long-lived access tokens");
  }
  if (has("coinpile")) {
    connectors.push({ id: "coinpile", type: "mcp", url: `${found.coinpile}/api/v1/mcp`, description: "Coinpile: this person's money", person_token_env: "COINPILE_TOKEN_{ID}", roles: ["admin", "adult"] });
    for (const p of adults) need(`COINPILE_TOKEN_${p.id.toUpperCase()}`, `in ${p.name}'s Coinpile: Settings → Home Assistant & API → a token with the mcp scope`);
  }
  if (has("orb")) {
    connectors.push({ id: "orb", type: "mcp", url: `${found.orb}/mcp`, description: "Pondering Orb: this person's dashboard, projects and journal", person_token_env: "ORB_TOKEN_{ID}", roles: ["admin", "adult"] });
    for (const p of adults) need(`ORB_TOKEN_${p.id.toUpperCase()}`, `in that person's Orb: add faith:<a long random token> to ORB_API_TOKENS, and put the token here`);
  }
  if (has("hermes")) {
    connectors.push({ id: "hermes", type: "hermes", url: found.hermes, key_env: "HERMES_API_KEY_{PROFILE}", model: "hermes-agent", roles: ["admin", "adult"] });
    for (const p of adults) need(`HERMES_API_KEY_${p.id.toUpperCase()}`, `API_SERVER_KEY from ~/.hermes/profiles/${p.id}/.env (make the profile with: hermes profile create ${p.id})`);
  }
  if (has("studio")) {
    connectors.push({ id: "studio", type: "studio", url: found.studio, user_env: "STUDIO_USER_{ID}", password_env: "STUDIO_PASSWORD_{ID}", roles: ["admin", "adult"] });
    for (const p of adults) { need(`STUDIO_USER_${p.id.toUpperCase()}`, `${p.name}'s Hermes Studio user name`); need(`STUDIO_PASSWORD_${p.id.toUpperCase()}`, `${p.name}'s Hermes Studio password`); }
  }
  if (has("hamcp")) {
    connectors.push({ id: "hamcp", type: "mcp", url_env: "HA_MCP_URL", auth: "none", roles: ["admin"], prefix: "", description: "ha-mcp: Home Assistant's configuration (automations, scripts, dashboards, history)" });
    need("HA_MCP_URL", "ha-mcp's local connect URL (HA → Settings → Devices & services → HA-MCP → Configure), e.g. http://<ha-ip>:9584/private_…");
  }

  const cfg: any = {
    name, family_name: "our family", public_url: "https://faith.home.lan",
    model: { base_url: `${found.argos ?? "http://argos:8080"}/v1`, model: "faith", api_key_env: "ARGOS_API_KEY" },
    people: people.map((p) => ({ id: p.id, name: p.name, role: p.role, ...(has("mattermost") ? { mattermost_username: p.id } : {}) })),
    connectors,
    hub: { devices: [{ id: "kitchen", name: "Kitchen" }] },
  };
  need("ARGOS_API_KEY", "Argos's API key (leave empty if Argos has no keys)");
  if (has("mattermost")) { cfg.mattermost = { url: found.mattermost, team: "family", token_env: "MATTERMOST_BOT_TOKEN" }; need("MATTERMOST_BOT_TOKEN", "in Mattermost: System Console → Bot accounts → add bot \"faith\" → its token (docs/mattermost.md)"); }
  // Wyoming has no password: only Home Assistant may use it.
  if (has("voiceid")) { cfg.voice_id = { url: found.voiceid }; cfg.wyoming = { port: 10300, ...(has("homeassistant") ? { allow_from: [new URL(found.homeassistant).hostname] } : {}) }; }
  parseConfig(cfg, Object.fromEntries(env.map((e) => [e.key, "x"]))); // what we write must load
  void ids;
  return { cfg, env };
}

export function render(found: Found, people: InitPerson[], name?: string) {
  const { cfg, env } = build(found, people, name);
  const yaml = `# Written by \`faith init\` on ${new Date().toISOString().slice(0, 10)}. Every setting: config/faith.example.yaml.\n${stringify(cfg)}`;
  const dotenv = `# Tokens FAITH needs. Fill each in, then run: docker exec faith faith doctor\n${env.map((e) => `# ${e.how}\n${e.key}=`).join("\n")}\n`;
  return { yaml, dotenv, env };
}

export function writeOnce(path: string, text: string, force = false) {
  if (existsSync(path) && !force) throw new Error(`${path} already exists. Pass --force to replace it.`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}
