import { readFileSync, existsSync } from "node:fs";
import { parse } from "yaml";

/** Roles a family member can have. "household" is not a role a person has: it is
 *  the policy used when nobody is signed in (the shared hub view). */
export type Role = "admin" | "adult" | "child";
export type PolicyName = Role | "household";
export const ROLES: Role[] = ["admin", "adult", "child"];

export type Person = {
  id: string;                 // same id as the wiki's schema/family.md member
  name: string;
  role: Role;
  color?: string;
  allglance_owner_id?: string; // ALLGlance roster id (allglance_list_users), if it differs from id
  ha_user_id?: string;         // Home Assistant user id: Assist requests from this HA user act as this person
  face_names?: string[];       // names a camera face-recognition sensor reports for this person
  hermes_profile?: string;     // Hermes profile to use for this person (defaults to id)
};

export type McpConnector = {
  id: string; type: "mcp"; url: string;
  household_token_env?: string;  // the blanket family token: shared things only
  person_token_env?: string;     // per-person token, e.g. WIKI_TOKEN_{ID}: that person's private things too
  tools?: string[];              // globs of the server's tool names to offer the model (default: all)
  roles?: PolicyName[];          // who gets this connector at all (default: everyone)
  prefix?: string;               // tool name prefix (default "<id>_", skipped when the name already has it)
  description?: string;          // one line for the model: what this source is
};
export type HomeAssistantConnector = {
  id: string; type: "homeassistant"; url: string;
  token_env: string;               // long-lived token of a non-admin HA user for FAITH (household)
  person_token_env?: string;       // optional per-person HA tokens so HA's logbook shows who did it
  expose: { domains: string[]; entities: string[]; exclude: string[] };
  confirm_domains: string[];       // actions on these always wait for an on-screen Yes
  shopping_lists: string[];        // todo.* entities (Mealie's shopping lists appear as these)
  meal_calendars: string[];        // calendar.* entities (Mealie's meal plan appears as these)
  mealie_config_entry_id?: string; // enables meal_plan / recipes_search through HA's Mealie actions
  trust_ha_users: boolean;         // Assist from a mapped HA user acts as that person (else household)
  roles?: PolicyName[];
};
export type HermesConnector = {
  id: string; type: "hermes"; url: string; key_env?: string; model: string;
  household_profile?: string;      // profile for the household view; unset = no Hermes when nobody is signed in
  roles?: PolicyName[];
};
export type StudioConnector = {
  id: string; type: "studio"; url: string;
  user_env: string;              // per-person Studio account, e.g. STUDIO_USER_{ID}
  password_env: string;          // e.g. STUDIO_PASSWORD_{ID}
  roles?: PolicyName[];
};
export type Connector = McpConnector | HomeAssistantConnector | HermesConnector | StudioConnector;

/** An app on the family homepage (the launcher). */
export type AppLink = { id: string; name: string; url: string; icon?: string; who: "anyone" | "person"; roles?: PolicyName[]; people?: string[] };

export type RolePolicy = {
  connectors?: string[];     // only these connectors (default: all that allow the role)
  deny_tools?: string[];     // globs of FAITH tool names
  /** allow: changes happen; allowlist: only allow_writes; deny: none;
   *  approve: changes wait until a family member approves them (the household view's default). */
  writes: "allow" | "allowlist" | "deny" | "approve";
  allow_writes: string[];    // globs, used when writes = allowlist
  approve_skip: string[];    // globs that skip approval when writes = approve (e.g. shopping_add)
  ha_domains?: string[];     // Home Assistant domains this role may control (default: all exposed)
  ha_entities?: string[];    // or exact entities / globs
  prompt?: string;           // extra system prompt lines for this role
};

export type HubDevice = {
  id: string; name: string;
  presence_entity?: string;  // e.g. binary_sensor.kitchen_person_occupancy (camera or mmWave)
  face_entity?: string;      // e.g. sensor.kitchen_last_face (Frigate face recognition / Double Take)
  face_unlock: boolean;      // a recognized face signs in without PIN (off: it only suggests the tile)
};

export type Card = { id: string; title: string; tool?: string; args?: Record<string, unknown>; who: "anyone" | "person" | "household"; people?: string[]; roles?: PolicyName[]; builtin?: "today" | "chores" | "meals" | "shopping" | "home" | "approvals" };

export type Config = {
  name: string;              // what the assistant calls itself
  family_name: string;
  port: number;
  public_url: string;        // https://faith.example.lan, needed for passkeys (Face ID)
  model: { base_url: string; model: string; vision_model?: string; api_key_env?: string; max_rounds: number; temperature?: number; history_messages: number; context_chars: number; timeout_s: number };
  people: Person[];
  roles: Record<PolicyName, RolePolicy>;
  connectors: Connector[];
  hub: { idle_seconds: number; away_seconds: number; max_idle_seconds: number; max_hours: number; show_people_to_unpaired: boolean; pin_on_personal_devices: boolean; devices: HubDevice[] };
  personal: { idle_days: number; max_days: number };
  voice: { confirm_on_voice: boolean; stt_model: string; tts_model: string; tts_voice: string; speak_replies: boolean };
  dashboard: { entities: string[]; cards: Card[] };
  apps: AppLink[];
  approvals: { approvers: Role[]; ttl_hours: number };
  embed: { allow_from: string[]; cookie_samesite: "strict" | "lax" | "none" };
};

export class ConfigError extends Error {}

const DEFAULT_ROLES: Record<PolicyName, RolePolicy> = {
  admin: { writes: "allow", allow_writes: [], approve_skip: [] },
  adult: { writes: "allow", allow_writes: [], approve_skip: [] },
  child: {
    writes: "allowlist",
    allow_writes: ["shopping_add", "home_control", "wiki_memory_capture", "wiki_memory_log"],
    approve_skip: [],
    ha_domains: ["light", "media_player", "fan"],
    prompt: "You are talking with a child. Use short, kind, simple sentences. Don't discuss money, locks, alarms or other people's private things. If they ask for something you can't do, suggest they ask a parent.",
  },
  // Nobody signed in: changes are asked for, and a family member approves them.
  household: { writes: "approve", allow_writes: [], approve_skip: [] },
};

const DEFAULT_CARDS: Card[] = [
  { id: "today", title: "Today", builtin: "today", who: "anyone" },
  { id: "meals", title: "Meals", builtin: "meals", who: "anyone" },
  { id: "shopping", title: "Shopping", builtin: "shopping", who: "anyone" },
  { id: "chores", title: "Chores", builtin: "chores", who: "anyone" },
  { id: "home", title: "Home", builtin: "home", who: "anyone" },
  { id: "approvals", title: "Waiting for approval", builtin: "approvals", who: "anyone" },
];

const str = (v: unknown, d = "") => (typeof v === "string" ? v : v == null ? d : String(v));
const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() && Number.isFinite(Number(v)) ? Number(v) : d);
const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : v === "true" ? true : v === "false" ? false : d);
const list = (v: unknown): string[] => (Array.isArray(v) ? v.map((x) => String(x)) : typeof v === "string" && v ? [v] : []);
const ID = /^[a-z0-9][a-z0-9_-]{0,31}$/;

/** Env var name for a per-person template: WIKI_TOKEN_{ID} -> WIKI_TOKEN_WIZARD. */
export function personEnv(template: string | undefined, personId: string) {
  if (!template) return undefined;
  return template.replace(/\{ID\}/g, personId.toUpperCase().replace(/[^A-Z0-9]/g, "_")).replace(/\{id\}/g, personId);
}
export const envValue = (name: string | undefined, env: NodeJS.ProcessEnv = process.env) => (name ? (env[name] || "").trim() || undefined : undefined);

export function parseConfig(raw: any, env: NodeJS.ProcessEnv = process.env): Config {
  if (!raw || typeof raw !== "object") throw new ConfigError("The config file is empty.");
  const m = raw.model || {};
  const people: Person[] = (raw.people || []).map((p: any, i: number) => {
    const id = str(p?.id).trim();
    if (!ID.test(id)) throw new ConfigError(`people[${i}].id "${id}" must be lowercase letters, digits, - or _ (the wiki's member id).`);
    const role = str(p.role, "adult") as Role;
    if (!ROLES.includes(role)) throw new ConfigError(`people[${i}] (${id}): role must be admin, adult or child.`);
    return { id, name: str(p.name, id), role, color: p.color ? str(p.color) : undefined, allglance_owner_id: p.allglance_owner_id ? str(p.allglance_owner_id) : undefined,
      ha_user_id: p.ha_user_id ? str(p.ha_user_id) : undefined, face_names: list(p.face_names), hermes_profile: p.hermes_profile ? str(p.hermes_profile) : undefined };
  });
  const dup = people.map((p) => p.id).find((id, i, a) => a.indexOf(id) !== i);
  if (dup) throw new ConfigError(`Two people have the id "${dup}".`);

  const roles = { ...DEFAULT_ROLES } as Record<PolicyName, RolePolicy>;
  for (const [k, v] of Object.entries(raw.roles || {})) {
    if (!(k in DEFAULT_ROLES)) throw new ConfigError(`roles.${k}: use admin, adult, child or household.`);
    const r: any = v || {}; const base = DEFAULT_ROLES[k as PolicyName];
    const writes = str(r.writes, base.writes) as RolePolicy["writes"];
    if (!["allow", "allowlist", "deny", "approve"].includes(writes)) throw new ConfigError(`roles.${k}.writes must be allow, allowlist, deny or approve.`);
    roles[k as PolicyName] = {
      connectors: r.connectors ? list(r.connectors) : base.connectors, deny_tools: r.deny_tools ? list(r.deny_tools) : base.deny_tools, writes,
      allow_writes: r.allow_writes ? list(r.allow_writes) : base.allow_writes, approve_skip: r.approve_skip ? list(r.approve_skip) : base.approve_skip, ha_domains: r.ha_domains ? list(r.ha_domains) : base.ha_domains,
      ha_entities: r.ha_entities ? list(r.ha_entities) : base.ha_entities, prompt: r.prompt != null ? str(r.prompt) : base.prompt,
    };
  }

  const connectors: Connector[] = (raw.connectors || []).map((c: any, i: number) => {
    const id = str(c?.id).trim(), type = str(c?.type, "mcp");
    if (!ID.test(id)) throw new ConfigError(`connectors[${i}].id "${id}" must be lowercase letters, digits, - or _.`);
    const url = str(c.url).replace(/\/+$/, "");
    if (!/^https?:\/\//.test(url)) throw new ConfigError(`connectors.${id}.url must start with http:// or https://.`);
    const roles = c.roles ? (list(c.roles) as PolicyName[]) : undefined;
    if (type === "mcp") return { id, type, url, household_token_env: c.household_token_env, person_token_env: c.person_token_env, tools: c.tools ? list(c.tools) : undefined, roles, prefix: c.prefix != null ? str(c.prefix) : undefined, description: c.description } as McpConnector;
    if (type === "homeassistant") {
      const ex = c.expose || {};
      return { id, type, url, token_env: str(c.token_env, "HA_TOKEN"), person_token_env: c.person_token_env, roles,
        expose: { domains: ex.domains ? list(ex.domains) : ["light", "switch", "fan", "climate", "cover", "lock", "media_player", "scene", "script", "vacuum", "sensor", "binary_sensor", "weather", "person"], entities: list(ex.entities), exclude: list(ex.exclude) },
        confirm_domains: c.confirm_domains ? list(c.confirm_domains) : ["lock", "alarm_control_panel", "cover", "garage_door"],
        shopping_lists: list(c.shopping_lists), meal_calendars: list(c.meal_calendars), mealie_config_entry_id: c.mealie_config_entry_id ? str(c.mealie_config_entry_id) : undefined,
        trust_ha_users: bool(c.trust_ha_users, true) } as HomeAssistantConnector;
    }
    if (type === "studio") return { id, type, url, user_env: str(c.user_env, "STUDIO_USER_{ID}"), password_env: str(c.password_env, "STUDIO_PASSWORD_{ID}"), roles: roles ?? ["admin", "adult"] } as StudioConnector;
    if (type === "hermes") return { id, type, url, key_env: c.key_env, model: str(c.model, "hermes-agent"), household_profile: c.household_profile ? str(c.household_profile) : undefined, roles: roles ?? ["admin", "adult"] } as HermesConnector;
    throw new ConfigError(`connectors.${id}.type must be mcp, homeassistant, hermes or studio.`);
  });
  const dupC = connectors.map((c) => c.id).find((id, i, a) => a.indexOf(id) !== i);
  if (dupC) throw new ConfigError(`Two connectors have the id "${dupC}".`);
  if (connectors.filter((c) => c.type === "homeassistant").length > 1) throw new ConfigError("Only one homeassistant connector is supported.");

  const h = raw.hub || {};
  const devices: HubDevice[] = (h.devices || []).map((d: any, i: number) => {
    const id = str(d?.id).trim();
    if (!ID.test(id)) throw new ConfigError(`hub.devices[${i}].id "${id}" must be lowercase letters, digits, - or _.`);
    return { id, name: str(d.name, id), presence_entity: d.presence_entity ? str(d.presence_entity) : undefined, face_entity: d.face_entity ? str(d.face_entity) : undefined, face_unlock: bool(d.face_unlock, false) };
  });

  const d = raw.dashboard || {};
  const cards: Card[] = d.cards ? (d.cards as any[]).map((c, i) => {
    const id = str(c?.id, `card${i}`);
    const builtin = c.builtin ? str(c.builtin) : undefined;
    if (builtin && !["today", "chores", "meals", "shopping", "home", "approvals"].includes(builtin)) throw new ConfigError(`dashboard.cards.${id}.builtin must be today, chores, meals, shopping, home or approvals.`);
    if (!builtin && !c.tool) throw new ConfigError(`dashboard.cards.${id} needs a tool (a FAITH tool name) or a builtin.`);
    const who = str(c.who, "anyone");
    if (!["anyone", "person", "household"].includes(who)) throw new ConfigError(`dashboard.cards.${id}.who must be anyone, person or household.`);
    return { id, title: str(c.title, id), tool: c.tool ? str(c.tool) : undefined, args: c.args || undefined, who, builtin, people: c.people ? list(c.people) : undefined, roles: c.roles ? (list(c.roles) as PolicyName[]) : undefined } as Card;
  }) : DEFAULT_CARDS;

  const apps: AppLink[] = (raw.apps || []).map((a: any, i: number) => {
    const id = str(a?.id, `app${i}`), url = str(a?.url);
    if (!/^https?:\/\//.test(url)) throw new ConfigError(`apps.${id}.url must start with http:// or https://.`);
    const who = str(a.who, "anyone");
    if (!["anyone", "person"].includes(who)) throw new ConfigError(`apps.${id}.who must be anyone or person.`);
    return { id, name: str(a.name, id), url, icon: a.icon ? str(a.icon) : undefined, who, roles: a.roles ? (list(a.roles) as PolicyName[]) : undefined, people: a.people ? list(a.people) : undefined } as AppLink;
  });
  const ap = raw.approvals || {};
  const approvers = (ap.approvers ? list(ap.approvers) : ["admin", "adult"]) as Role[];
  if (approvers.some((r) => !ROLES.includes(r))) throw new ConfigError("approvals.approvers lists roles: admin, adult, child.");
  const samesite = str(raw.embed?.cookie_samesite, "strict");
  if (!["strict", "lax", "none"].includes(samesite)) throw new ConfigError("embed.cookie_samesite is strict, lax or none.");
  const publicUrl = str(env.FAITH_PUBLIC_URL || raw.public_url).replace(/\/+$/, "");
  return {
    name: str(raw.name, "Faith"), family_name: str(raw.family_name, "the family"),
    port: num(env.PORT || raw.port, 8097), public_url: publicUrl,
    model: {
      base_url: str(env.FAITH_MODEL_URL || m.base_url, "http://argos:8080/v1").replace(/\/+$/, ""), model: str(env.FAITH_MODEL || m.model, ""), vision_model: m.vision_model ? str(m.vision_model) : undefined,
      api_key_env: m.api_key_env ? str(m.api_key_env) : "ARGOS_API_KEY", max_rounds: num(m.max_rounds, 6), temperature: m.temperature != null ? num(m.temperature, 0.4) : undefined,
      history_messages: num(m.history_messages, 16), context_chars: num(m.context_chars, 4000), timeout_s: num(m.timeout_s, 180),
    },
    people, roles, connectors,
    hub: { idle_seconds: num(h.idle_seconds, 120), away_seconds: num(h.away_seconds, 45), max_idle_seconds: num(h.max_idle_seconds, 900), max_hours: num(h.max_hours, 8),
      show_people_to_unpaired: bool(h.show_people_to_unpaired, false), pin_on_personal_devices: bool(h.pin_on_personal_devices, false), devices },
    personal: { idle_days: num(raw.personal?.idle_days, 14), max_days: num(raw.personal?.max_days, 30) },
    voice: { confirm_on_voice: bool(raw.voice?.confirm_on_voice, false), stt_model: str(raw.voice?.stt_model, "whisper"), tts_model: str(raw.voice?.tts_model, "tts"), tts_voice: str(raw.voice?.tts_voice, ""), speak_replies: bool(raw.voice?.speak_replies, false) },
    dashboard: { entities: list(d.entities), cards },
    apps, approvals: { approvers, ttl_hours: num(ap.ttl_hours, 24) },
    embed: { allow_from: list(raw.embed?.allow_from), cookie_samesite: samesite as Config["embed"]["cookie_samesite"] },
  };
}

export function loadConfig(path: string, env: NodeJS.ProcessEnv = process.env): Config {
  if (!existsSync(path)) throw new ConfigError(`No config at ${path}. Copy config/faith.example.yaml there and fill in your family.`);
  let raw: unknown;
  try { raw = parse(readFileSync(path, "utf8")); } catch (e: any) { throw new ConfigError(`${path} isn't valid YAML: ${e.message}`); }
  return parseConfig(raw, env);
}

/** Glob match with * only (tool and entity names). */
export function glob(pattern: string, value: string) {
  const re = new RegExp("^" + pattern.split("*").map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*") + "$");
  return re.test(value);
}
export const anyGlob = (patterns: string[] | undefined, value: string) => !!patterns?.some((p) => glob(p, value));
