import { readFileSync, existsSync } from "node:fs";
import { parse } from "yaml";

/** Tiers a family member can have (docs/setup.md, "Who can do what"):
 *   admin     runs FAITH; everything a parent can do, plus the admin page
 *   parent    a grown-up: their own things, approves the kids' and the shared screen's changes
 *   kid-pro   a teenager: their own notes and photos, shopping adds, a few more devices
 *   kid-lite  a young child (about six): lights, media and fans; most changes wait for a parent
 *  Old names still load: "adult" is parent, "child" is kid-lite (the safer kid tier).
 *  "household" is not a role a person has: it is the policy used when nobody is
 *  signed in (the shared hub view). */
export type Role = "admin" | "parent" | "kid-pro" | "kid-lite";
/** "parents" is the policy of the parents-only group chat (only admins and parents read it). */
export type PolicyName = Role | "household" | "parents";
export const ROLES: Role[] = ["admin", "parent", "kid-pro", "kid-lite"];
export const POLICIES: PolicyName[] = [...ROLES, "household", "parents"];
export const KID_ROLES: Role[] = ["kid-pro", "kid-lite"];
/** Both kid tiers. Every children-only rule checks this, never one tier's name. */
export const isKid = (r: string | undefined | null): boolean => r === "kid-pro" || r === "kid-lite";
/** Old and loose spellings of a person's role. "child" is the safer kid tier. */
const ROLE_ALIASES: Record<string, Role> = { adult: "parent", grownup: "parent", child: "kid-lite", kid_lite: "kid-lite", kidlite: "kid-lite", kid_pro: "kid-pro", kidpro: "kid-pro", teen: "kid-pro" };
export function roleOf(v: unknown): Role | undefined {
  const r = String(v ?? "").trim().toLowerCase();
  return (ROLES as string[]).includes(r) ? (r as Role) : ROLE_ALIASES[r];
}
/** A list of who may use something (connector roles, camera who, cards, apps, skills).
 *  There "child" and "kids" mean both kid tiers: what a child could use, a teen can too. */
export function policyList(v: unknown, where: string): PolicyName[] {
  const out: PolicyName[] = [];
  for (const x of list(v)) {
    const k = x.trim().toLowerCase();
    const add = k === "child" || k === "kids" ? KID_ROLES : (POLICIES as string[]).includes(k) ? [k as PolicyName] : roleOf(k) ? [roleOf(k)!] : null;
    if (!add) throw new ConfigError(`${where}: "${x}" isn't a role. Use ${POLICIES.join(", ")} (or kids for both kid tiers).`);
    for (const a of add) if (!out.includes(a)) out.push(a);
  }
  return out;
}
/** Never for either kid tier, whatever roles: says: locks, the alarm, covers and the garage. */
export const KID_NEVER_DOMAINS = ["lock", "alarm_control_panel", "cover", "garage_door"];
/** Never for either kid tier, whatever roles: says: money. */
export const KID_NEVER_TOOLS = ["coinpile_*", "firefly_*"];

export type Person = {
  id: string;                 // same id as the wiki's schema/family.md member
  name: string;
  role: Role;
  color?: string;
  allglance_owner_id?: string; // ALLGlance roster id (allglance_list_users), if it differs from id
  ha_user_id?: string;         // Home Assistant user id: Assist requests from this HA user act as this person
  face_names?: string[];       // names a camera face-recognition sensor reports for this person
  omi_uid?: string;            // their Omi account's uid: only their own Omi's webhook is accepted for them
  immich_user?: string;        // their Immich account's email: FAITH checks IMMICH_KEY_<ID> is that account
  hermes_profile?: string;     // Hermes profile to use for this person (defaults to id)
  firefly_account?: string;    // the kid's card: their Firefly III asset account (id or exact name)
  ha_person?: string;          // their HA person entity, for who's home (default person.<id>; "" turns it off)
  mattermost_username?: string; // their Mattermost account: their DMs with FAITH act as them
  ha_notify?: string[];         // HA notify services for their phone, e.g. notify.mobile_app_wizard_phone
  cards?: string[];             // their dashboard cards, in order (ids from dashboard.cards); default: all
};

export type McpConnector = {
  id: string; type: "mcp"; url: string;
  url_env?: string;              // the address from an env var instead (servers whose URL is the secret, like ha-mcp's)
  auth?: "token" | "none";       // "none": the server needs no token (then limit it with roles:)
  household_token_env?: string;  // the blanket family token: shared things only
  person_token_env?: string;     // per-person token, e.g. WIKI_TOKEN_{ID}: that person's private things too
  parents_token_env?: string;    // optional: what the parents-only chat may see (defaults to the household token)
  tools?: string[];              // globs of the server's tool names to offer the model (default: all)
  roles?: PolicyName[];          // who gets this connector at all (default: everyone)
  prefix?: string;               // tool name prefix (default "<id>_", skipped when the name already has it)
  description?: string;          // one line for the model: what this source is
  /** Tools whose `person` argument FAITH sets to whoever is telling it (the signed-in person, or the
   *  speaker in a group chat or by voice), e.g. the wiki's memory_log: a note goes in the teller's own
   *  notes, never someone else's. "household" is kept. */
  teller_tools?: string[];
  /** Globs of tools always offered, whatever the question (the router doesn't drop them). */
  always?: string[];
  /** Check each token with the server's whoami before using it (the wiki: a person's view gets only
   *  their own token, a shared view a shared agent's, never the master key). Default: whenever the
   *  server has a whoami that says whose token it is. false turns it off; true insists on it. */
  check_identity?: boolean;
  /** What this source returns was heard, not said to FAITH (Omi's recordings: other people, the TV).
   *  Like a video's sound, it's context: any change later in that turn waits for the person's own Yes. */
  heard?: boolean;
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
  /** Use HA's own Assist API through the FAITH integration (0.4+): its house overview, areas,
   *  aliases and intents, limited by HA's "Expose to Assist" list. Replaces home_find/state/control. */
  assist_api: boolean;
  /** Simple commands ("turn off the kitchen light") go to HA's own sentence matcher
   *  first, with FAITH's rules checked on what it would touch: no model, so it's instant.
   *  Needs assist_api. Default on with it. */
  fast_path: boolean;
  /** Cameras FAITH may look through (camera_look), and who may ask. A camera isn't
   *  reachable unless it's listed here. */
  cameras: { entity: string; name: string; who: PolicyName[];
    /** HA's face recognition for this camera (Frigate, Double Take): a sensor whose state is the name it saw. */
    face_entity?: string }[];
  roles?: PolicyName[];
};
export type HermesConnector = {
  id: string; type: "hermes"; url: string; model: string;
  key_env?: string;                // HERMES_API_KEY_{PROFILE}: each profile's own API_SERVER_KEY (Hermes refuses a shared one)
  household_profile?: string;      // profile for the household view; unset = no Hermes when nobody is signed in
  roles?: PolicyName[];
};
export type StudioConnector = {
  id: string; type: "studio"; url: string;
  user_env: string;              // per-person Studio account, e.g. STUDIO_USER_{ID}
  password_env: string;          // e.g. STUDIO_PASSWORD_{ID}
  roles?: PolicyName[];
};
export type MealieConnector = {
  id: string; type: "mealie"; url: string;
  token_env: string;             // a Mealie API token (profile > API Tokens), e.g. MEALIE_TOKEN
  roles?: PolicyName[];
};
export type ImmichConnector = {
  id: string; type: "immich"; url: string;
  public_url?: string;           // Immich's address for people (links), e.g. https://photos.example.org
  person_key_env: string;        // each person's own Immich API key, e.g. IMMICH_KEY_{ID}
  household_key_env?: string;    // a family account's key for the shared screens (none: no photos there)
  parents_key_env?: string;      // the parents chat's (default: household_key_env)
  share_days: number;            // how long a share link works by default
  roles?: PolicyName[];
};
export type Connector = McpConnector | HomeAssistantConnector | HermesConnector | StudioConnector | MealieConnector | ImmichConnector;

/** An app on the family homepage (the launcher). */
export type AppLink = { id: string; name: string; url: string; icon?: string; who: "anyone" | "person"; roles?: PolicyName[]; people?: string[] };

export type RolePolicy = {
  connectors?: string[];     // only these connectors (default: all that allow the role)
  deny_tools?: string[];     // globs of FAITH tool names
  /** allow: changes happen; allowlist: only allow_writes; deny: none;
   *  approve: changes wait until a family member approves them (the household view's default). */
  writes: "allow" | "allowlist" | "deny" | "approve";
  allow_writes: string[];    // globs, used when writes = allowlist
  /** globs, used when writes = allowlist: these aren't refused, they wait for a parent's
   *  approval and then run with the household's tokens (shared things only, like the shopping list). */
  approve_writes: string[];
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
  /** Voice satellites next to this screen (HA device ids or assist_satellite.* entities): its camera's face checks their voices too. */
  satellites: string[];
  /** When the voice and the face agree, answer that one question as that person, without signing in.
   *  Off by default; needs face_unlock. Changes that need a Yes still need a sign-in. */
  voice_and_face: boolean;
};

export type Card = { id: string; title: string; tool?: string; args?: Record<string, unknown>; who: "anyone" | "person" | "household"; people?: string[]; roles?: PolicyName[]; builtin?: "today" | "chores" | "meals" | "shopping" | "home" | "approvals" };

export type Config = {
  name: string;              // what the assistant calls itself
  family_name: string;
  port: number;
  public_url: string;        // https://faith.example.lan, needed for passkeys (Face ID)
  /** More tools than max: offer only the most relevant per question (harness/router.ts). */
  tools: { max: number; always: string[] };
  model: { base_url: string; model: string; vision_model?: string; embed_model?: string; api_key_env?: string; max_rounds: number; temperature?: number; history_messages: number; context_chars: number; timeout_s: number;
    /** A chat answer that takes longer is a bigger job: "I'll send it when it's done", and it carries on (0 = always wait). */
    answer_within_s: number;
    /** Model calls at once. A local GPU usually serves one; quick questions go ahead of big jobs in the queue. */
    parallel: number };
  people: Person[];
  roles: Record<PolicyName, RolePolicy>;
  connectors: Connector[];
  hub: { idle_seconds: number; away_seconds: number; max_idle_seconds: number; max_hours: number; show_people_to_unpaired: boolean; pin_on_personal_devices: boolean; devices: HubDevice[] };
  personal: { idle_days: number; max_days: number };
  voice: { confirm_on_voice: boolean; stt_model: string; tts_model: string; tts_voice: string; speak_replies: boolean;
    /** Spoken requests (HA Assist) wait less: a bigger job says so and goes to the person's chat and phone. */
    answer_within_s: number };
  dashboard: { entities: string[]; cards: Card[] };
  apps: AppLink[];
  approvals: { approvers: Role[]; ttl_hours: number };
  embed: { allow_from: string[]; cookie_samesite: "strict" | "lax" | "none" };
  mattermost?: MattermostConfig;
  skills: { dir: string; packs: { dir: string; who?: PolicyName[] }[] }; // your own skills (Markdown); packs: SKILL.md folders (e.g. homeassistant-ai/skills)
  voice_id?: { url: string; token_env?: string; threshold: number; trust_for_changes: boolean;
    /** How far under the threshold a voice may be when the camera there sees that same person's face. */
    face_helps: number };
  /** FAITH as a Wyoming speech-to-text service for HA's voice pipeline (and voice ID on satellites). */
  wyoming?: { port: number; host: string; languages: string[]; allow_from: string[] };
  /** A person's chat, once put away ("new topic" or quiet), is filed in their own wiki folder for Ingest (the wiki's conversation_log). */
  memory: { file_conversations: boolean };
  rewards: { allowed_points: number[]; currency: string; payout: "manual" | "firefly"; firefly?: { url: string; token_env: string; from_account: string } };
  notifications: { approvals_push: boolean };
  /** Checking every source on a schedule and telling the parents when one goes down (health.ts). 0 = off. */
  health: { interval_s: number };
  /** The info board for FAITH's apps (board/), brought over from Pondering Orb. */
  board: BoardConfig;
};

/** The info board (docs/dashboard.md). Everything here is optional; a part that isn't set up doesn't show. */
export type BoardConfig = {
  /** An HA weather entity (weather.home). Home Assistant fetches the forecast; FAITH only reads HA. */
  weather_entity: string;
  /** RSS or Atom feeds. Off until you add one. These are fetched from wherever they point (the internet,
   *  unless you use a local reader such as FreshRSS or Miniflux). */
  news: { feeds: string[]; items: number };
  /** Uptime Kuma's published status page: its address and slug, and who sees it. */
  uptime?: { url: string; slug: string; roles: PolicyName[]; ignore: string[] };
  /** FAITH's own machine (load, memory, disks) and FAITH's sources: who sees it. */
  system: { roles: PolicyName[]; disks: string[] };
  /** The morning brief: written each morning for these people (ids), at this time (HH:MM, TZ). Empty: on request only. */
  brief: { time: string; days: string; people: string[]; send: boolean };
  /** The longest log entry, in characters (Orb's logMax). */
  log_max: number;
};

/** FAITH as a Mattermost bot: a DM with each person, a family channel, a parents channel. */
export type MattermostConfig = {
  url: string; token_env: string; team: string;
  family_channel: { name: string; display_name: string };
  parents_channel: { name: string; display_name: string };
  answer_in_groups: "mention" | "always";   // in the two group channels: only when @mentioned (default) or every message
  manage_members: boolean;                   // add the right people and remove anyone else from the two channels
  new_topic_after_minutes: number;           // a chat quiet this long starts fresh next time (0 = never); "new topic" does it any time
};

export class ConfigError extends Error {}

const KID_RULES = "Never talk about money, locks, the alarm or the garage, or anyone else's private things, and never the parents' notes. If they ask for something you can't do, suggest they ask a parent.";
const KID_DENY = ["hermes_*", "studio_*", ...KID_NEVER_TOOLS, "photos_share"];
const HA_BASICS = ["home_control", "HassTurnOn", "HassTurnOff", "HassLightSet", "HassMedia*", "HassSetVolume*"];

/** The role policy defaults: the one place each tier's rules are set. roles: in
 *  faith.yaml overrides them per field. KID_NEVER_* above apply to both kid tiers
 *  whatever this says. */
export const DEFAULT_ROLES: Record<PolicyName, RolePolicy> = {
  admin: { writes: "allow", allow_writes: [], approve_writes: [], approve_skip: [] },
  parent: { writes: "allow", allow_writes: [], approve_writes: [], approve_skip: [] },
  // A teenager: their own notes and photo albums, shopping adds and a few more devices.
  "kid-pro": {
    writes: "allowlist",
    allow_writes: ["shopping_add", ...HA_BASICS, "HassFanSetSpeed", "HassVacuum*", "wiki_memory_capture", "wiki_memory_log", "wiki_memory_add_source", "photos_album_add", "points_claim", "reward_redeem", "message_send"],
    approve_writes: ["shopping_done", "meal_plan", "recipe_add", "recipe_import"],
    approve_skip: [],
    deny_tools: KID_DENY,
    ha_domains: ["light", "media_player", "fan", "scene", "vacuum"],
    prompt: `You are talking with a teenager. Be friendly, clear and straight with them. ${KID_RULES}`,
  },
  // A young child (about six): lights, media and fans; no notes, no web; the shopping list waits for a parent.
  "kid-lite": {
    writes: "allowlist",
    allow_writes: [...HA_BASICS, "points_claim", "reward_redeem", "message_send"],
    approve_writes: ["shopping_add", "meal_plan"],
    approve_skip: [],
    deny_tools: [...KID_DENY, "photos_album_add", "web_*", "*_web_*", "*websearch*", "*web_search*", "*web_fetch*"],
    ha_domains: ["light", "media_player", "fan"],
    prompt: `You are talking with a young child, about six years old. Answer in one or two short, kind sentences with easy words. ${KID_RULES}`,
  },
  // Nobody signed in: changes are asked for, and a family member approves them.
  household: { writes: "approve", allow_writes: [], approve_writes: [], approve_skip: [] },
  // The parents-only chat: only grown-ups read it, so changes go straight through.
  parents: { writes: "allow", allow_writes: [], approve_writes: [], approve_skip: [] },
};
/** Old names under roles: in faith.yaml. */
const POLICY_ALIASES: Record<string, PolicyName> = { adult: "parent", child: "kid-lite" };

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
    const role = roleOf(str(p.role, "parent"));
    if (!role) throw new ConfigError(`people[${i}] (${id}): role must be admin, parent, kid-pro or kid-lite (adult and child still work: child means kid-lite).`);
    return { id, name: str(p.name, id), role, color: p.color ? str(p.color) : undefined, allglance_owner_id: p.allglance_owner_id ? str(p.allglance_owner_id) : undefined,
      ha_user_id: p.ha_user_id ? str(p.ha_user_id) : undefined, face_names: list(p.face_names), omi_uid: p.omi_uid ? str(p.omi_uid) : undefined, immich_user: p.immich_user ? str(p.immich_user).trim() : undefined, hermes_profile: p.hermes_profile ? str(p.hermes_profile) : undefined, firefly_account: p.firefly_account != null ? str(p.firefly_account) : undefined, ha_person: p.ha_person != null ? str(p.ha_person) : undefined,
      mattermost_username: p.mattermost_username ? str(p.mattermost_username).replace(/^@/, "").toLowerCase() : undefined,
      ha_notify: list(p.ha_notify).map((n) => (n.includes(".") ? n : `notify.${n}`)), cards: p.cards ? list(p.cards) : undefined };
  });
  const dup = people.map((p) => p.id).find((id, i, a) => a.indexOf(id) !== i);
  if (dup) throw new ConfigError(`Two people have the id "${dup}".`);

  const roles = { ...DEFAULT_ROLES } as Record<PolicyName, RolePolicy>;
  const seenRoles = new Map<PolicyName, string>();
  for (const [key, v] of Object.entries(raw.roles || {})) {
    const k = (POLICY_ALIASES[key] ?? key) as PolicyName;
    if (!(k in DEFAULT_ROLES)) throw new ConfigError(`roles.${key}: use ${POLICIES.join(", ")} (adult and child still work: child means kid-lite).`);
    if (seenRoles.has(k)) throw new ConfigError(`roles.${key} and roles.${seenRoles.get(k)} are the same tier (${k}). Keep one.`);
    seenRoles.set(k, key);
    const r: any = v || {}; const base = DEFAULT_ROLES[k];
    const writes = str(r.writes, base.writes) as RolePolicy["writes"];
    if (!["allow", "allowlist", "deny", "approve"].includes(writes)) throw new ConfigError(`roles.${k}.writes must be allow, allowlist, deny or approve.`);
    roles[k as PolicyName] = {
      connectors: r.connectors ? list(r.connectors) : base.connectors, deny_tools: r.deny_tools ? list(r.deny_tools) : base.deny_tools, writes,
      allow_writes: r.allow_writes ? list(r.allow_writes) : base.allow_writes, approve_writes: r.approve_writes ? list(r.approve_writes) : base.approve_writes, approve_skip: r.approve_skip ? list(r.approve_skip) : base.approve_skip, ha_domains: r.ha_domains ? list(r.ha_domains) : base.ha_domains,
      ha_entities: r.ha_entities ? list(r.ha_entities) : base.ha_entities, prompt: r.prompt != null ? str(r.prompt) : base.prompt,
    };
  }

  const connectors: Connector[] = (raw.connectors || []).map((c: any, i: number) => {
    const id = str(c?.id).trim(), type = str(c?.type, "mcp");
    if (!ID.test(id)) throw new ConfigError(`connectors[${i}].id "${id}" must be lowercase letters, digits, - or _.`);
    const url = str(c.url ?? (c.url_env ? "http://from-env.invalid" : "")).replace(/\/+$/, "");
    if (!/^https?:\/\//.test(url)) throw new ConfigError(`connectors.${id}.url must start with http:// or https://.`);
    const roles = c.roles ? policyList(c.roles, `connectors.${id}.roles`) : undefined;
    if (type === "mcp" && c.auth === "none" && !c.roles) throw new ConfigError(`connectors.${id}: with auth: none, say who may use it (roles: [admin] or [admin, parents]); a token-less source would otherwise reach the shared view too.`);
    if (type === "mcp") return { id, type, url, url_env: c.url_env ? str(c.url_env) : undefined, auth: c.auth === "none" ? "none" : "token", household_token_env: c.household_token_env, person_token_env: c.person_token_env, parents_token_env: c.parents_token_env, tools: c.tools ? list(c.tools) : undefined, roles, prefix: c.prefix != null ? str(c.prefix) : undefined, description: c.description,
      teller_tools: c.teller_tools ? list(c.teller_tools) : undefined, always: c.always ? list(c.always) : undefined, heard: bool(c.heard, false), check_identity: c.check_identity === undefined ? undefined : bool(c.check_identity, true) } as McpConnector;
    if (type === "homeassistant") {
      const ex = c.expose || {};
      return { id, type, url, token_env: str(c.token_env, "HA_TOKEN"), person_token_env: c.person_token_env, roles,
        expose: { domains: ex.domains ? list(ex.domains) : ["light", "switch", "fan", "climate", "cover", "lock", "media_player", "scene", "script", "vacuum", "sensor", "binary_sensor", "weather", "person"], entities: list(ex.entities), exclude: list(ex.exclude) },
        confirm_domains: c.confirm_domains ? list(c.confirm_domains) : ["lock", "alarm_control_panel", "cover", "garage_door"],
        shopping_lists: list(c.shopping_lists), meal_calendars: list(c.meal_calendars), mealie_config_entry_id: c.mealie_config_entry_id ? str(c.mealie_config_entry_id) : undefined,
        trust_ha_users: bool(c.trust_ha_users, true), assist_api: bool(c.assist_api, false), fast_path: bool(c.fast_path, bool(c.assist_api, false)),
        cameras: (Array.isArray(c.cameras) ? c.cameras : []).map((k: any) => {
          const entity = str(typeof k === "string" ? k : k?.entity);
          if (!/^camera\.[a-z0-9_]+$/.test(entity)) throw new ConfigError(`connectors.${id}.cameras: "${entity}" isn't a camera entity (camera.front_door).`);
          const who: PolicyName[] = k?.who ? policyList(k.who, `connectors.${id}.cameras ${entity}: who`) : ["admin", "parent"];
          const face = k?.face_entity ? str(k.face_entity) : undefined;
          if (face && !/^[a-z_]+\.[a-z0-9_]+$/.test(face)) throw new ConfigError(`connectors.${id}.cameras ${entity}: face_entity "${face}" isn't an entity id (sensor.front_door_last_face).`);
          return { entity, name: str(k?.name, entity.slice(7).replace(/_/g, " ")), who, ...(face ? { face_entity: face } : {}) };
        }) } as HomeAssistantConnector;
    }
    if (type === "studio") return { id, type, url, user_env: str(c.user_env, "STUDIO_USER_{ID}"), password_env: str(c.password_env, "STUDIO_PASSWORD_{ID}"), roles: roles ?? ["admin", "parent"] } as StudioConnector;
    if (type === "mealie") return { id, type, url, token_env: str(c.token_env, "MEALIE_TOKEN"), roles: roles ?? ["admin", "parent", "parents", "household"] } as MealieConnector;
    if (type === "immich") return { id, type, url: url.replace(/\/api$/, ""), public_url: c.public_url ? str(c.public_url).replace(/\/+$/, "") : undefined, person_key_env: str(c.person_key_env, "IMMICH_KEY_{ID}"),
      household_key_env: c.household_key_env ? str(c.household_key_env) : undefined, parents_key_env: c.parents_key_env ? str(c.parents_key_env) : undefined,
      share_days: Math.min(30, Math.max(1, num(c.share_days, 7))), roles } as ImmichConnector;
    if (type === "hermes") return { id, type, url, key_env: c.key_env, model: str(c.model, "hermes-agent"), household_profile: c.household_profile ? str(c.household_profile) : undefined, roles: roles ?? ["admin", "parent"] } as HermesConnector;
    throw new ConfigError(`connectors.${id}.type must be mcp, homeassistant, hermes, studio, mealie or immich.`);
  });
  const dupC = connectors.map((c) => c.id).find((id, i, a) => a.indexOf(id) !== i);
  if (dupC) throw new ConfigError(`Two connectors have the id "${dupC}".`);
  if (connectors.filter((c) => c.type === "homeassistant").length > 1) throw new ConfigError("Only one homeassistant connector is supported.");

  const h = raw.hub || {};
  const devices: HubDevice[] = (h.devices || []).map((d: any, i: number) => {
    const id = str(d?.id).trim();
    if (!ID.test(id)) throw new ConfigError(`hub.devices[${i}].id "${id}" must be lowercase letters, digits, - or _.`);
    const dev: HubDevice = { id, name: str(d.name, id), presence_entity: d.presence_entity ? str(d.presence_entity) : undefined, face_entity: d.face_entity ? str(d.face_entity) : undefined, face_unlock: bool(d.face_unlock, false),
      satellites: list(d.satellites), voice_and_face: bool(d.voice_and_face, false) };
    if (dev.voice_and_face && !(dev.face_entity && dev.face_unlock)) throw new ConfigError(`hub.devices.${id}: voice_and_face needs face_entity and face_unlock: true on that screen. If a face alone shouldn't sign in there, voice and face shouldn't either.`);
    return dev;
  });

  const d = raw.dashboard || {};
  const cards: Card[] = d.cards ? (d.cards as any[]).map((c, i) => {
    const id = str(c?.id, `card${i}`);
    const builtin = c.builtin ? str(c.builtin) : undefined;
    if (builtin && !["today", "chores", "meals", "shopping", "home", "approvals"].includes(builtin)) throw new ConfigError(`dashboard.cards.${id}.builtin must be today, chores, meals, shopping, home or approvals.`);
    if (!builtin && !c.tool) throw new ConfigError(`dashboard.cards.${id} needs a tool (a FAITH tool name) or a builtin.`);
    const who = str(c.who, "anyone");
    if (!["anyone", "person", "household"].includes(who)) throw new ConfigError(`dashboard.cards.${id}.who must be anyone, person or household.`);
    return { id, title: str(c.title, id), tool: c.tool ? str(c.tool) : undefined, args: c.args || undefined, who, builtin, people: c.people ? list(c.people) : undefined, roles: c.roles ? policyList(c.roles, `dashboard.cards.${id}.roles`) : undefined } as Card;
  }) : DEFAULT_CARDS;

  const apps: AppLink[] = (raw.apps || []).map((a: any, i: number) => {
    const id = str(a?.id, `app${i}`), url = str(a?.url);
    if (!/^https?:\/\//.test(url)) throw new ConfigError(`apps.${id}.url must start with http:// or https://.`);
    const who = str(a.who, "anyone");
    if (!["anyone", "person"].includes(who)) throw new ConfigError(`apps.${id}.who must be anyone or person.`);
    return { id, name: str(a.name, id), url, icon: a.icon ? str(a.icon) : undefined, who, roles: a.roles ? policyList(a.roles, `apps.${id}.roles`) : undefined, people: a.people ? list(a.people) : undefined } as AppLink;
  });
  const ap = raw.approvals || {};
  const approvers: Role[] = [];
  for (const a of ap.approvers ? list(ap.approvers) : ["admin", "parent"]) {
    const r = roleOf(a);
    if (!r) throw new ConfigError(`approvals.approvers: "${a}" isn't a role. Use admin and parent.`);
    if (isKid(r)) throw new ConfigError(`approvals.approvers: ${a} can't approve. Only admin and parent can approve changes.`);
    if (!approvers.includes(r)) approvers.push(r);
  }
  const samesite = str(raw.embed?.cookie_samesite, "strict");
  if (!["strict", "lax", "none"].includes(samesite)) throw new ConfigError("embed.cookie_samesite is strict, lax or none.");
  let mattermost: MattermostConfig | undefined;
  if (raw.mattermost?.url) {
    const mm = raw.mattermost, url = str(mm.url).replace(/\/+$/, "");
    if (!/^https?:\/\//.test(url)) throw new ConfigError("mattermost.url must start with http:// or https://.");
    if (!mm.team) throw new ConfigError("mattermost.team is the team (its URL name) FAITH's channels go in.");
    const chan = (v: any, name: string, display: string) => {
      const n = str(v?.name, name).toLowerCase();
      if (!/^[a-z0-9][a-z0-9_-]{1,63}$/.test(n)) throw new ConfigError(`mattermost channel name "${n}": lowercase letters, digits, - or _.`);
      return { name: n, display_name: str(v?.display_name, display) };
    };
    const ans = str(mm.answer_in_groups, "mention");
    if (!["mention", "always"].includes(ans)) throw new ConfigError("mattermost.answer_in_groups is mention or always.");
    mattermost = { url, token_env: str(mm.token_env, "MATTERMOST_BOT_TOKEN"), team: str(mm.team).toLowerCase(),
      family_channel: chan(mm.family_channel, "faith-family", "Family"), parents_channel: chan(mm.parents_channel, "faith-parents", "Parents"),
      answer_in_groups: ans as MattermostConfig["answer_in_groups"], manage_members: bool(mm.manage_members, true),
      new_topic_after_minutes: Math.max(0, num(mm.new_topic_after_minutes, 240)) };
  }
  const publicUrl = str(env.FAITH_PUBLIC_URL || raw.public_url).replace(/\/+$/, "");
  return {
    name: str(raw.name, "Faith"), family_name: str(raw.family_name, "the family"),
    port: num(env.PORT || raw.port, 8097), public_url: publicUrl,
    tools: { max: num(raw.tools?.max, 32), always: list(raw.tools?.always) },
    model: {
      base_url: str(env.FAITH_MODEL_URL || m.base_url, "http://argos:8080/v1").replace(/\/+$/, ""), model: str(env.FAITH_MODEL || m.model, ""), vision_model: m.vision_model ? str(m.vision_model) : undefined, embed_model: m.embed_model ? str(m.embed_model) : undefined,
      api_key_env: m.api_key_env ? str(m.api_key_env) : "ARGOS_API_KEY", max_rounds: num(m.max_rounds, 6), temperature: m.temperature != null ? num(m.temperature, 0.4) : undefined,
      history_messages: num(m.history_messages, 16), context_chars: num(m.context_chars, 4000), timeout_s: num(m.timeout_s, 180),
      answer_within_s: Math.max(0, num(m.answer_within_s, 30)), parallel: Math.max(1, Math.floor(num(m.parallel, 1))),
    },
    people, roles, connectors,
    hub: { idle_seconds: num(h.idle_seconds, 120), away_seconds: num(h.away_seconds, 45), max_idle_seconds: num(h.max_idle_seconds, 900), max_hours: num(h.max_hours, 8),
      show_people_to_unpaired: bool(h.show_people_to_unpaired, false), pin_on_personal_devices: bool(h.pin_on_personal_devices, false), devices },
    personal: { idle_days: num(raw.personal?.idle_days, 14), max_days: num(raw.personal?.max_days, 30) },
    memory: { file_conversations: bool(raw.memory?.file_conversations, true) },
    voice: { confirm_on_voice: bool(raw.voice?.confirm_on_voice, false), stt_model: str(raw.voice?.stt_model, "whisper"), tts_model: str(raw.voice?.tts_model, "tts"), tts_voice: str(raw.voice?.tts_voice, ""), speak_replies: bool(raw.voice?.speak_replies, false), answer_within_s: Math.max(0, num(raw.voice?.answer_within_s, 10)) },
    dashboard: { entities: list(d.entities), cards },
    apps, approvals: { approvers, ttl_hours: num(ap.ttl_hours, 24) },
    embed: { allow_from: list(raw.embed?.allow_from), cookie_samesite: samesite as Config["embed"]["cookie_samesite"] },
    mattermost,
    skills: { dir: str(env.FAITH_SKILLS || raw.skills?.dir, "/config/skills"),
      packs: (raw.skills?.packs || []).map((p: any) => (typeof p === "string" ? { dir: p } : { dir: str(p.dir), who: p.who ? policyList(p.who, `skills.packs ${p.dir}: who`) : undefined })) },
    voice_id: raw.voice_id?.url ? { url: str(raw.voice_id.url).replace(/\/+$/, ""), token_env: raw.voice_id.token_env ? str(raw.voice_id.token_env) : undefined,
      threshold: num(raw.voice_id.threshold, 0.78), trust_for_changes: bool(raw.voice_id.trust_for_changes, true), face_helps: Math.min(0.2, Math.max(0, num(raw.voice_id.face_helps, 0.08))) } : undefined,
    wyoming: raw.wyoming ? { port: num(raw.wyoming.port, 10300), host: str(raw.wyoming.host, "0.0.0.0"), languages: list(raw.wyoming.languages).length ? list(raw.wyoming.languages) : ["en"], allow_from: list(raw.wyoming.allow_from) } : undefined,
    rewards: (() => {
      const r = raw.rewards || {}, payout = str(r.payout, "manual");
      if (!["manual", "firefly"].includes(payout)) throw new ConfigError("rewards.payout is manual or firefly.");
      if (payout === "firefly" && (!r.firefly?.url || !r.firefly?.from_account)) throw new ConfigError("rewards.payout: firefly needs rewards.firefly.url and rewards.firefly.from_account (the parents' account in Firefly).");
      const allowed = r.allowed_points ? (r.allowed_points as any[]).map(Number).filter((n) => n > 0) : [0.5, 1, 2];
      return { allowed_points: allowed, currency: str(r.currency, "$"), payout: payout as "manual" | "firefly",
        firefly: r.firefly?.url ? { url: str(r.firefly.url), token_env: str(r.firefly.token_env, "FIREFLY_TOKEN"), from_account: String(r.firefly.from_account) } : undefined };
    })(),
    notifications: { approvals_push: bool(raw.notifications?.approvals_push, true) },
    health: { interval_s: num(raw.health?.interval_s, 120) },
    board: parseBoard(raw.board || {}, people),
  };
}

function parseBoard(b: any, people: Person[]): BoardConfig {
  const roles = (v: unknown, d: PolicyName[], where: string) => (v == null ? d : policyList(v, where));
  const weather = str(b.weather_entity, "");
  if (weather && !/^weather\.[a-z0-9_]+$/.test(weather)) throw new ConfigError(`board.weather_entity must be a weather.* entity, like weather.home (got "${weather}").`);
  const feeds = list(b.news?.feeds);
  for (const f of feeds) if (!/^https?:\/\//.test(f)) throw new ConfigError(`board.news.feeds: "${f}" must start with http:// or https://.`);
  let uptime: BoardConfig["uptime"];
  if (b.uptime?.url) {
    const url = str(b.uptime.url).replace(/\/+$/, "");
    if (!/^https?:\/\//.test(url)) throw new ConfigError("board.uptime.url must start with http:// or https://.");
    if (!b.uptime.slug) throw new ConfigError("board.uptime.slug is the status page's slug in Uptime Kuma (its address ends in /status/<slug>).");
    uptime = { url, slug: str(b.uptime.slug), roles: roles(b.uptime.roles, ["admin"], "board.uptime.roles"), ignore: list(b.uptime.ignore) };
  }
  const time = str(b.brief?.time, "07:00");
  if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new ConfigError("board.brief.time is HH:MM (24-hour), e.g. 07:00, or empty for on request only.");
  const briefPeople = list(b.brief?.people);
  for (const id of briefPeople) if (!people.some((p) => p.id === id)) throw new ConfigError(`board.brief.people: no one with the id "${id}".`);
  return {
    weather_entity: weather,
    news: { feeds, items: Math.max(1, Math.min(30, num(b.news?.items, 8))) },
    uptime,
    system: { roles: roles(b.system?.roles, ["admin"], "board.system.roles"), disks: b.system?.disks ? list(b.system.disks) : ["/data"] },
    brief: { time, days: str(b.brief?.days, "daily"), people: briefPeople, send: bool(b.brief?.send, false) },
    log_max: Math.max(20, Math.min(500, num(b.log_max, 120))),
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
