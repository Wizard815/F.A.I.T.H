import { anyGlob, envValue, personEnv, type Config, type HomeAssistantConnector as HaCfg } from "../config.js";
import { policyOf, type Caller } from "../scope.js";
import { call, ToolError, type Connector, type Tool } from "./types.js";

type State = { entity_id: string; state: string; attributes: Record<string, any>; last_changed?: string };
const ENTRY_TYPES = ["breakfast", "lunch", "dinner", "side", "dessert", "snack", "drink"];

/** Home Assistant over its REST API. HA is the hands of the house: lights,
 *  climate, locks, presence, and (through HA's Mealie integration) the
 *  shopping lists and meal plan. FAITH only sees entities in `expose`, a
 *  role can be narrowed to some domains, and `confirm_domains` (locks,
 *  alarm, garage) always wait for an on-screen Yes. */
/** Sensors that say where someone is: never shown to anyone through FAITH. */
const WHERE = ["sensor.*geocoded_location*", "sensor.*_location", "sensor.*_address", "sensor.*_latitude", "sensor.*_longitude", "sensor.*_gps*", "sensor.*_zone"];

export class HomeAssistant implements Connector {
  id: string;
  private areas?: { at: number; map: Map<string, string> };
  /** Friendly names seen so far, so a Yes card says "lock Front door", not "lock lock.front_door". */
  private names = new Map<string, string>(); private namesAt = 0;
  private say(entityId: string, service: string) { return `${service.replace(/_/g, " ")} ${this.names.get(entityId) || entityId}`; }
  constructor(private cfg: HaCfg, private config: () => Config, private env: NodeJS.ProcessEnv = process.env) { this.id = cfg.id; }

  describe() {
    const extra = [this.cfg.shopping_lists.length ? "shopping lists" : "", this.cfg.meal_calendars.length ? "the meal plan (Mealie)" : ""].filter(Boolean).join(" and ");
    return `Home Assistant: the house's devices and sensors${extra ? `, plus ${extra}` : ""}`;
  }

  token(caller?: Caller) {
    const own = caller?.scope.kind === "person" ? envValue(personEnv(this.cfg.person_token_env, caller.scope.person.id), this.env) : undefined;
    return own || envValue(this.cfg.token_env, this.env);
  }
  configured() { return !!envValue(this.cfg.token_env, this.env); }

  private async api(method: string, path: string, body?: unknown, caller?: Caller) {
    const token = this.token(caller);
    if (!token) throw new ToolError(`Home Assistant has no token (set ${this.cfg.token_env}).`);
    const r = await call(`${this.cfg.url}${path}`, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), timeoutMs: 20000 });
    if (r.status === 401) throw new ToolError("Home Assistant refused FAITH's token.");
    if (!r.ok) throw new ToolError(`Home Assistant answered ${r.status}: ${typeof r.body === "string" ? r.body.slice(0, 200) : JSON.stringify(r.body).slice(0, 200)}`);
    return r.body;
  }
  async ping() { await this.api("GET", "/api/"); }
  /** Call an HA action as FAITH (pushes to phones, routines). */
  async callService(domain: string, service: string, data: Record<string, unknown>) {
    if (!/^[a-z_]+$/.test(domain) || !/^[a-z0-9_]+$/.test(service)) throw new ToolError(`Not an HA action: ${domain}.${service}`);
    return this.api("POST", `/api/services/${domain}/${service}`, data);
  }
  /** Read one entity (also used for hub presence and face sensors; not limited by `expose`). */
  async state(entityId: string, caller?: Caller): Promise<State | null> {
    try { return await this.api("GET", `/api/states/${encodeURIComponent(entityId)}`, undefined, caller); }
    catch (e: any) { if (/answered 404/.test(e.message)) return null; throw e; }
  }

  exposed(entityId: string) {
    const e = this.cfg.expose, domain = entityId.split(".")[0];
    if (anyGlob(e.exclude, entityId)) return false;
    // Where someone is (addresses, coordinates) is never FAITH's to pass on, whatever the config says.
    if (WHERE.some((p) => anyGlob([p], entityId))) return false;
    return e.domains.includes(domain) || anyGlob(e.entities, entityId);
  }
  /** May this caller change this entity? */
  controllable(caller: Caller, entityId: string) {
    const pol = this.config().roles[policyOf(caller)], domain = entityId.split(".")[0];
    if (!this.exposed(entityId)) return false;
    if (!pol.ha_domains && !pol.ha_entities) return true;
    return !!pol.ha_domains?.includes(domain) || anyGlob(pol.ha_entities, entityId);
  }

  private rooms = new Map<string, { at: number; room: string | null }>();
  /** The area a device or satellite is in ("Kitchen"), so "the lights" means that room. */
  async roomOf(...ids: (string | undefined | null)[]) {
    for (const id of ids) {
      if (!id || !/^[A-Za-z0-9_.]{1,80}$/.test(id)) continue;
      const hit = this.rooms.get(id);
      if (hit && Date.now() - hit.at < 10 * 60_000) { if (hit.room) return hit.room; continue; }
      let room: string | null = null;
      try { const out = await this.api("POST", "/api/template", { template: `{{ area_name('${id}') or '' }}` }); room = String(out ?? "").trim() || null; } catch { /* rooms are a nicety */ }
      this.rooms.set(id, { at: Date.now(), room });
      if (room) return room;
    }
    return undefined;
  }

  private async areaMap(caller: Caller) {
    if (this.areas && Date.now() - this.areas.at < 5 * 60_000) return this.areas.map;
    const map = new Map<string, string>();
    try {
      const tpl = "[{% for s in states %}{{ {'e': s.entity_id, 'a': area_name(s.entity_id) or ''} | tojson }}{% if not loop.last %},{% endif %}{% endfor %}]";
      const out = await this.api("POST", "/api/template", { template: tpl }, caller);
      for (const x of typeof out === "string" ? JSON.parse(out) : out) if (x.a) map.set(x.e, x.a);
    } catch { /* areas are a nicety */ }
    this.areas = { at: Date.now(), map };
    return map;
  }

  private brief(s: State, area?: string) {
    if (s.attributes?.friendly_name) this.names.set(s.entity_id, s.attributes.friendly_name);
    const a = s.attributes || {}, domain = s.entity_id.split(".")[0];
    // People and trackers: home or away only, never the zone ("Work", "School") or coordinates.
    const state = domain === "person" || domain === "device_tracker" ? (s.state === "home" ? "home" : ["unknown", "unavailable"].includes(s.state) ? s.state : "away") : s.state;
    const out: Record<string, unknown> = { entity_id: s.entity_id, name: a.friendly_name || s.entity_id, state };
    if (area) out.area = area;
    for (const k of ["unit_of_measurement", "current_temperature", "temperature", "hvac_action", "brightness", "media_title", "battery_level"]) if (a[k] != null) out[k] = a[k];
    return out;
  }

  private async todo(list: string | undefined, caller: Caller) {
    const lists = this.cfg.shopping_lists;
    if (!list) return lists[0];
    const want = list.toLowerCase();
    const hit = lists.find((l) => l === list || l.toLowerCase().includes(want.replace(/\s+/g, "_")));
    if (hit) return hit;
    for (const l of lists) { const s = await this.state(l, caller).catch(() => null); if (String(s?.attributes?.friendly_name || "").toLowerCase().includes(want)) return l; }
    throw new ToolError(`No shopping list called "${list}". Lists: ${lists.join(", ")}.`);
  }

  async tools(caller: Caller): Promise<Tool[]> {
    if (!this.token(caller)) return [];
    // Learn device names (every 5 minutes at most) so a Yes card or a log line says "Front door".
    if (Date.now() - this.namesAt > 5 * 60_000) {
      this.namesAt = Date.now();
      try { for (const x of (await this.api("GET", "/api/states", undefined, caller)) as State[]) if (x.attributes?.friendly_name) this.names.set(x.entity_id, x.attributes.friendly_name); } catch { /* names are a nicety */ }
    }
    const T: Tool[] = [];
    const add = (t: Omit<Tool, "connector">) => T.push({ ...t, connector: this.id });

    add({ name: "home_find", write: false,
      description: "Find devices and sensors in the house by name, room or kind (light, climate, lock, sensor...). Returns entity ids and current states. Use before home_control when you don't know the entity id.",
      parameters: { type: "object", properties: { query: { type: "string", description: "words from the name or room, e.g. 'kitchen light'" }, domain: { type: "string" }, area: { type: "string" } }, additionalProperties: false },
      run: async (a) => {
        const all = (await this.api("GET", "/api/states", undefined, caller)) as State[];
        for (const x of all) if (x.attributes?.friendly_name) this.names.set(x.entity_id, x.attributes.friendly_name);
        const areas = await this.areaMap(caller);
        const words = String(a?.query || "").toLowerCase().split(/\s+/).filter(Boolean);
        const hay = (s: State) => `${s.entity_id} ${s.attributes?.friendly_name || ""} ${areas.get(s.entity_id) || ""}`.toLowerCase();
        const pool = all.filter((s) => this.exposed(s.entity_id)).filter((s) => !a?.domain || s.entity_id.startsWith(`${a.domain}.`));
        const inArea = (s: State) => !a?.area || (areas.get(s.entity_id) || "").toLowerCase().includes(String(a.area).toLowerCase());
        const out = (hits: State[], note?: string) => ({ count: hits.length, ...(note ? { note } : {}), entities: hits.slice(0, 40).map((s) => this.brief(s, areas.get(s.entity_id))) });
        let hits = pool.filter(inArea).filter((s) => words.every((w) => hay(s).includes(w)));
        if (hits.length) return out(hits);
        // Nothing exact: widen step by step and say so, instead of leaving the model to guess again.
        if (a?.area) {
          hits = pool.filter((s) => words.every((w) => hay(s).includes(w)) || !words.length);
          if (hits.length) return out(hits, `Nothing in HA's ${a.area} area matched; these are elsewhere in the house (one may serve that room, like a whole-house thermostat).`);
        }
        hits = pool.filter((s) => words.some((w) => w.length > 2 && hay(s).includes(w)));
        if (hits.length) return out(hits, "No exact match; these share some of the words.");
        const domains = [...new Set(all.filter((s) => this.exposed(s.entity_id)).map((s) => s.entity_id.split(".")[0]))].sort();
        return { count: 0, note: `Nothing matched. Search by kind instead (domain: one of ${domains.join(", ")}), e.g. domain climate for heating.` };
      } });

    add({ name: "home_state", write: false, description: "Current state of one device or sensor by entity id.",
      parameters: { type: "object", properties: { entity_id: { type: "string" } }, required: ["entity_id"], additionalProperties: false },
      run: async (a) => {
        const id = String(a?.entity_id || "");
        if (!this.exposed(id)) return { error: `${id} isn't shared with FAITH.` };
        const s = await this.state(id, caller);
        return s ? this.brief(s, (await this.areaMap(caller)).get(id)) : { error: `No entity ${id}.` };
      } });

    const confirmDomains = this.cfg.confirm_domains;
    add({ name: "home_control", write: true,
      description: "Control a device: call a Home Assistant action on one entity, e.g. service 'turn_on' / 'turn_off' / 'toggle' for lights and switches, 'set_temperature' with data {temperature} for climate, 'lock' / 'unlock', 'open_cover' / 'close_cover', 'media_pause'. Scenes and scripts use 'turn_on'.",
      parameters: { type: "object", properties: { entity_id: { type: "string" }, service: { type: "string" }, data: { type: "object", description: "extra fields, e.g. {brightness_pct: 40}" } }, required: ["entity_id", "service"], additionalProperties: false },
      explain: (a) => this.say(String(a?.entity_id || ""), String(a?.service || "")),
      confirm: (a) => {
        const id = String(a?.entity_id || ""), domain = id.split(".")[0];
        // Not allowed at all: no Yes card; run() refuses straight away.
        if (!this.controllable(caller, id)) return null;
        return confirmDomains.includes(domain) ? this.say(id, String(a?.service || "")) : null;
      },
      // Making the house less secure (unlock, disarm, open, toggle) is never done on someone else's approval.
      strict: (a) => confirmDomains.includes(String(a?.entity_id || "").split(".")[0]) && /unlock|disarm|open|raise|toggle|stop/.test(String(a?.service || "")),
      run: async (a) => {
        const id = String(a?.entity_id || ""), service = String(a?.service || ""), domain = id.split(".")[0];
        if (!/^[a-z_]+\.[a-z0-9_]+$/.test(id)) return { error: "entity_id looks like light.kitchen." };
        if (!/^[a-z_]+$/.test(service)) return { error: "service is an action name like turn_on." };
        if (!this.controllable(caller, id)) return { error: `You can't control ${id} from here.` };
        // Only this one entity: targets hidden in data (area, device, label, floor) would reach past what this person may control.
        const { entity_id: _e, area_id: _a, device_id: _d, label_id: _l, floor_id: _f, ...data } = a?.data && typeof a.data === "object" ? a.data : ({} as any);
        await this.api("POST", `/api/services/${domain}/${service}`, { ...data, entity_id: id }, caller);
        const s = await this.state(id, caller).catch(() => null);
        return { ok: true, entity_id: id, state: s?.state };
      } });

    if (this.cfg.shopping_lists.length) {
      add({ name: "shopping_list", write: false, description: `Items on a shopping list (Mealie, through Home Assistant). Lists: ${this.cfg.shopping_lists.join(", ")}; the first is the default.`,
        parameters: { type: "object", properties: { list: { type: "string" }, include_done: { type: "boolean" } }, additionalProperties: false },
        run: async (a) => {
          const entity = await this.todo(a?.list, caller);
          const r = await this.api("POST", "/api/services/todo/get_items?return_response", { entity_id: entity, status: a?.include_done ? ["needs_action", "completed"] : ["needs_action"] }, caller);
          const items = r?.service_response?.[entity]?.items || [];
          return { list: entity, items: items.map((i: any) => ({ item: i.summary, done: i.status === "completed", ...(i.description ? { note: i.description } : {}) })) };
        } });
      add({ name: "shopping_add", write: true, explain: (a) => `add ${a?.item} to the shopping list`, description: "Add an item to a shopping list (lands in Mealie). One item per call.",
        parameters: { type: "object", properties: { item: { type: "string" }, list: { type: "string" } }, required: ["item"], additionalProperties: false },
        run: async (a) => {
          const item = String(a?.item || "").trim(); if (!item) return { error: "item is empty" };
          const entity = await this.todo(a?.list, caller);
          await this.api("POST", "/api/services/todo/add_item", { entity_id: entity, item }, caller);
          return { ok: true, list: entity, added: item };
        } });
      add({ name: "shopping_done", write: true, explain: (a) => `tick ${a?.item} off the shopping list`, description: "Tick an item off a shopping list.",
        parameters: { type: "object", properties: { item: { type: "string" }, list: { type: "string" } }, required: ["item"], additionalProperties: false },
        run: async (a) => {
          const entity = await this.todo(a?.list, caller);
          await this.api("POST", "/api/services/todo/update_item", { entity_id: entity, item: String(a?.item || ""), status: "completed" }, caller);
          return { ok: true, list: entity, done: a?.item };
        } });
    }

    if (this.cfg.meal_calendars.length) {
      add({ name: "meals", write: false, description: "What's planned to eat (Mealie's meal plan through Home Assistant), from a date for some days.",
        parameters: { type: "object", properties: { start: { type: "string", description: "YYYY-MM-DD, default today" }, days: { type: "integer", minimum: 1, maximum: 14 } }, additionalProperties: false },
        run: async (a) => ({ meals: await this.mealsFor(String(a?.start || ""), Math.min(14, Math.max(1, Number(a?.days) || 1)), caller) }) });
    }

    if (this.cfg.mealie_config_entry_id) {
      const entry = this.cfg.mealie_config_entry_id;
      add({ name: "recipes_search", write: false, description: "Search Mealie's recipes by words. Returns recipe ids for meal_plan.",
        parameters: { type: "object", properties: { query: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 20 } }, required: ["query"], additionalProperties: false },
        run: async (a) => {
          const r = await this.api("POST", "/api/services/mealie/get_recipes?return_response", { config_entry_id: entry, search_terms: String(a?.query || ""), result_limit: Number(a?.limit) || 8 }, caller);
          const recipes = r?.service_response?.recipes?.items || r?.service_response?.recipes || [];
          return { recipes: (Array.isArray(recipes) ? recipes : []).map((x: any) => ({ recipe_id: x.recipe_id || x.id, name: x.name, ...(x.total_time ? { time: x.total_time } : {}) })) };
        } });
      add({ name: "recipe_get", write: false, description: "One Mealie recipe's ingredients and steps (recipe_id from recipes_search, or the recipe's slug).",
        parameters: { type: "object", properties: { recipe_id: { type: "string" } }, required: ["recipe_id"], additionalProperties: false },
        run: async (a) => {
          const r = await this.api("POST", "/api/services/mealie/get_recipe?return_response", { config_entry_id: entry, recipe_id: String(a?.recipe_id || "") }, caller);
          const x = r?.service_response?.recipe || {};
          const ing = (x.ingredients || x.recipe_ingredient || []).map((i: any) => (typeof i === "string" ? i : i.display || i.original_text || i.note || [i.quantity, i.unit?.name || i.unit, i.food?.name || i.food].filter(Boolean).join(" "))).filter(Boolean);
          const steps = (x.instructions || x.recipe_instructions || []).map((i: any) => (typeof i === "string" ? i : i.text)).filter(Boolean);
          return { name: x.name, servings: x.recipe_yield || x.servings, ingredients: ing, steps: steps.slice(0, 20) };
        } });
      add({ name: "meal_plan", write: true, explain: (a) => `put ${a?.note_title || "a recipe"} on the meal plan for ${a?.entry_type} on ${a?.date}`, description: "Put a meal on Mealie's plan for a date: a recipe (recipe_id from recipes_search) or a plain note (note_title).",
        parameters: { type: "object", properties: { date: { type: "string", description: "YYYY-MM-DD" }, entry_type: { type: "string", enum: ENTRY_TYPES }, recipe_id: { type: "string" }, note_title: { type: "string" }, note_text: { type: "string" } }, required: ["date", "entry_type"], additionalProperties: false },
        run: async (a) => {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(String(a?.date || ""))) return { error: "date is YYYY-MM-DD" };
          if (!ENTRY_TYPES.includes(a?.entry_type)) return { error: `entry_type is one of ${ENTRY_TYPES.join(", ")}` };
          if (!a?.recipe_id && !a?.note_title) return { error: "give a recipe_id or a note_title" };
          const body: Record<string, unknown> = { config_entry_id: entry, date: a.date, entry_type: a.entry_type };
          for (const k of ["recipe_id", "note_title", "note_text"]) if (a[k]) body[k] = String(a[k]);
          await this.api("POST", "/api/services/mealie/set_mealplan?return_response", body, caller);
          return { ok: true, date: a.date, entry_type: a.entry_type, what: a.note_title || a.recipe_id };
        } });
    }
    return T;
  }

  /** Meal plan entries from the meal calendars (used by the tool and the dashboard). */
  async mealsFor(start: string, days: number, caller?: Caller) {
    const from = /^\d{4}-\d{2}-\d{2}$/.test(start) ? new Date(`${start}T00:00:00`) : new Date(new Date().toDateString());
    const to = new Date(from.getTime() + days * 86400_000);
    const out: { date: string; meal: string; what: string }[] = [];
    for (const cal of this.cfg.meal_calendars) {
      const ev = (await this.api("GET", `/api/calendars/${encodeURIComponent(cal)}?start=${encodeURIComponent(from.toISOString())}&end=${encodeURIComponent(to.toISOString())}`, undefined, caller)) as any[];
      const meal = cal.replace(/^calendar\./, "").replace(/^mealie_/, "").replace(/_/g, " ");
      for (const e of ev || []) out.push({ date: String(e.start?.date || e.start?.dateTime || "").slice(0, 10), meal, what: e.summary });
    }
    return out.sort((a, b) => a.date.localeCompare(b.date) || ENTRY_TYPES.indexOf(a.meal) - ENTRY_TYPES.indexOf(b.meal));
  }

  async shoppingItems(caller?: Caller) {
    const entity = this.cfg.shopping_lists[0];
    if (!entity) return [];
    const r = await this.api("POST", "/api/services/todo/get_items?return_response", { entity_id: entity, status: ["needs_action"] }, caller);
    return (r?.service_response?.[entity]?.items || []).map((i: any) => String(i.summary));
  }

  async states(ids: string[], caller?: Caller) {
    const out = [];
    for (const id of ids) { const s = await this.state(id, caller).catch(() => null); if (s) out.push(this.brief(s)); }
    return out;
  }
}
