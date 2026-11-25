import type { Card, Config } from "./config.js";
import type { Registry } from "./connectors/registry.js";
import type { Tool } from "./connectors/types.js";
import { policyOf, type Caller } from "./scope.js";
import type { Approvals } from "./approvals.js";

export type Item = { title: string; time?: string; meta?: string; label?: string; done?: boolean };
export type CardOut = {
  id: string; title: string; kind: "schedule" | "list" | "checklist" | "meals" | "entities" | "approvals" | "text";
  items?: Item[]; approvals?: { id: string; summary: string; requested_by: string }[];
  entities?: { entity_id: string; name: string; state: string }[]; text?: string; error?: string; empty?: string;
};

const LIST_KEYS = ["items", "tasks", "blocks", "events", "chores", "milestones", "meals", "entries", "results", "notes", "entities"];
const TITLE_KEYS = ["title", "name", "summary", "item", "what", "text", "label", "content"];
const WHO_KEYS = ["owner", "owner_name", "assignee", "assignees", "assigned_to", "who", "people", "person"];

const timeOf = (x: any) => {
  const when = x.start || x.time || x.due || x.due_date || x.date || x.when || x.last_done;
  if (typeof when !== "string") return undefined;
  return when.match(/(\d{2}:\d{2})/)?.[1] ?? when.slice(0, 10);
};
const whoOf = (x: any) => {
  for (const k of WHO_KEYS) { const v = x[k]; if (typeof v === "string" && v) return v; if (Array.isArray(v) && v.length) return v.map((p: any) => (typeof p === "string" ? p : p?.name || p?.username || "")).filter(Boolean).join(", "); }
  return undefined;
};

/** Turn whatever a tool returned into card items. */
export function toItems(v: unknown, max = 8): Item[] | string {
  if (typeof v === "string") { const raw = v; try { v = JSON.parse(raw); } catch { return raw.trim().slice(0, 600); } }
  const item = (x: any): Item | null => {
    if (x == null) return null;
    if (typeof x !== "object") return { title: String(x) };
    const title = TITLE_KEYS.map((k) => x[k]).find((s) => typeof s === "string" && s.trim());
    if (!title) return { title: JSON.stringify(x).slice(0, 80) };
    return { title, time: timeOf(x), meta: whoOf(x), ...(typeof x.meal === "string" ? { label: x.meal } : {}), ...(x.done === true || x.status === "done" || x.status === "completed" ? { done: true } : {}) };
  };
  if (Array.isArray(v)) return v.slice(0, max).map(item).filter(Boolean) as Item[];
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.error === "string") return `Couldn't load: ${o.error}`;
    const lists = LIST_KEYS.map((k) => o[k]).filter(Array.isArray) as unknown[][];
    if (lists.length) return lists.flat().slice(0, max).map(item).filter(Boolean) as Item[];
    return Object.entries(o).filter(([, x]) => x == null || typeof x !== "object").slice(0, max).map(([k, x]) => ({ label: k.replace(/_/g, " "), title: String(x) }));
  }
  return String(v ?? "");
}
/** For the HA summary sensors: an item as one line. */
export const line = (i: Item) => `${i.time ? i.time + " · " : ""}${i.label ? i.label + ": " : ""}${i.title}`;

const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: process.env.TZ || undefined, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const fill = (args: Record<string, unknown> | undefined, c: Caller) => {
  const owner = c.scope.kind === "person" ? c.scope.person.allglance_owner_id || c.scope.person.id : "";
  const s = JSON.stringify(args || {}).replace(/\{today\}/g, today()).replace(/\{person\}/g, c.scope.kind === "person" ? c.scope.person.id : "household").replace(/\{owner_id\}/g, owner);
  const out = JSON.parse(s);
  for (const k of Object.keys(out)) if (out[k] === "") delete out[k];
  return out;
};

/** The home screen: today's plan, meals, shopping, chores, the house, plus any
 *  configured cards. Every card is fetched with the viewer's own tools, so the
 *  household view never shows private things and a signed-in person sees theirs. */
export async function dashboard(cfg: Config, registry: Registry, caller: Caller, extra: { approvals?: Approvals } = {}): Promise<{ cards: CardOut[] }> {
  const set = await registry.toolsFor(caller);
  const tool = (name: string) => set.tools.find((t) => t.name === name && !t.write);
  const runTool = async (t: Tool | undefined, args: Record<string, unknown>) => (t ? toItems(await t.run(args)) : undefined);
  const ha = registry.ha;
  const haOk = !!ha && registry.allowedConnector(caller, ha.id) && !!ha.token(caller);
  const owner = caller.scope.kind === "person" ? caller.scope.person.allglance_owner_id || caller.scope.person.id : undefined;

  const one = async (card: Card): Promise<CardOut | null> => {
    if (card.who === "person" && caller.scope.kind !== "person") return null;
    if (card.who === "household" && caller.scope.kind !== "household") return null;
    if (card.people && !(caller.scope.kind === "person" && card.people.includes(caller.scope.person.id))) return null;
    if (card.roles && !card.roles.includes(policyOf(caller))) return null;
    const kind: CardOut["kind"] = card.builtin === "today" ? "schedule" : card.builtin === "meals" ? "meals" : card.builtin === "shopping" ? "checklist" : "list";   // chores are logged in lastGLANCE, not ticked here
    const base = { id: card.id, title: card.title, kind };
    try {
      let out: Item[] | string | undefined;
      switch (card.builtin) {
        case "today": out = await runTool(tool("allglance_get_day"), { date: today(), ...(owner ? { owner_id: owner } : {}) }); break;
        case "chores": out = await runTool(tool("allglance_list_chores"), owner ? { owner_id: owner } : {}); break;
        case "meals": if (haOk && cfg.connectors.some((c) => c.type === "homeassistant" && c.meal_calendars.length)) out = (await ha!.mealsFor("", 2, caller)).map((m) => ({ title: m.what, label: m.meal, time: m.date })); break;
        case "shopping": if (haOk && cfg.connectors.some((c) => c.type === "homeassistant" && c.shopping_lists.length)) out = (await ha!.shoppingItems(caller)).map((title: string) => ({ title })); break;
        case "approvals": {
          const waiting = extra.approvals?.list().filter((r) => r.status === "pending") ?? [];
          if (!waiting.length) return null; // the card only shows when something's waiting
          return { ...base, kind: "approvals", approvals: waiting.map((r) => ({ id: r.id, summary: r.summary, requested_by: r.requested_by })) };
        }
        case "home": if (haOk && cfg.dashboard.entities.length) {
          const ents = (await ha!.states(cfg.dashboard.entities.filter((e) => ha!.exposed(e)), caller)) as any[];
          return { ...base, kind: "entities", entities: ents.map((e) => ({ entity_id: e.entity_id, name: e.name, state: `${e.state}${e.unit_of_measurement ? " " + e.unit_of_measurement : ""}` })) };
        } break;
        default: out = await runTool(tool(card.tool!), fill(card.args, caller));
      }
      if (out === undefined) return null; // the source isn't connected for this view
      if (typeof out === "string") return out ? { ...base, kind: "text", text: out } : { ...base, empty: "Nothing here." };
      return out.length ? { ...base, items: out } : { ...base, empty: "Nothing here." };
    } catch (e: any) { return { ...base, error: e.message }; }
  };
  const cards = (await Promise.all(cfg.dashboard.cards.map(one))).filter(Boolean) as CardOut[];
  return { cards };
}

/** By this hour a meal of that kind is over, so "next meal" moves on. */
const MEAL_ENDS: Record<string, number> = { breakfast: 10, brunch: 12, lunch: 14, snack: 17, dinner: 20, supper: 20 };
/** The first meal that hasn't happened yet (meal-plan items carry a date and a label like "dinner"). */
export function nextMeal<T extends { time?: string; label?: string }>(items: T[], now = new Date()): T | undefined {
  const today = new Intl.DateTimeFormat("en-CA").format(now);
  return items.find((i) => {
    if (!i.time || !/^\d{4}-\d{2}-\d{2}$/.test(i.time) || i.time > today) return true;
    if (i.time < today) return false;
    const end = MEAL_ENDS[String(i.label || "").toLowerCase()];
    return end === undefined || now.getHours() < end;
  });
}

/** A small summary for Home Assistant sensors (household view only). */
export async function haSummary(cfg: Config, registry: Registry, caller: Caller) {
  const d = await dashboard({ ...cfg, dashboard: { ...cfg.dashboard, cards: cfg.dashboard.cards.filter((c) => c.builtin) } }, registry, caller);
  const get = (id: string) => d.cards.find((c) => c.id === id);
  const next = nextMeal(get("meals")?.items || []);
  return {
    today_count: get("today")?.items?.length ?? 0,
    today: (get("today")?.items || []).slice(0, 5).map(line),
    shopping_count: get("shopping")?.items?.length ?? 0,
    shopping: (get("shopping")?.items || []).slice(0, 10).map((i) => i.title),
    next_meal: next ? line(next) : null,
    chores_count: get("chores")?.items?.length ?? 0,
  };
}
