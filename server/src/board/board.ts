import type { Config, Person } from "../config.js";
import type { Db } from "../db.js";
import type { Registry } from "../connectors/registry.js";
import type { Agent } from "../harness/agent.js";
import type { Approvals } from "../approvals.js";
import type { Notifier } from "../notifier.js";
import type { Health } from "../health.js";
import { dashboard, type CardOut } from "../dashboard.js";
import { localNow, onDay } from "../routines.js";
import { policyOf, type Caller } from "../scope.js";
import { BoardError, BoardStore, type Brief, type LogEntry, type Project } from "./store.js";
import { news, type NewsItem } from "./news.js";
import { hostStats, uptime, type Monitor } from "./system.js";

/** A part of the board that couldn't load says why, in words for people. */
type Part<T> = T | { error: string } | null;
export type BoardView = {
  person: { id: string; name: string } | null;
  day: string;
  brief: Brief | null;
  weather: Part<Awaited<ReturnType<NonNullable<Registry["ha"]>["weather"]>>>;
  news: Part<{ items: NewsItem[]; errors: string[] }>;
  projects: (Project & { last?: string; last_day?: string })[] | null;
  log: LogEntry[] | null;
  uptime: Part<{ up: number; down: number; monitors: Monitor[] }>;
  system: Part<Awaited<ReturnType<typeof hostStats>> & { sources: { label: string; ok: boolean | null; error?: string }[] }>;
  cards: CardOut[];
};

/** Whose board this is: a signed-in person in their own view. Group chats, the
 *  household screen and HA's shared token have no projects, log or brief. */
export const boardOwner = (c: Caller): Person | undefined => (c.scope.kind === "person" && !c.audience ? c.scope.person : undefined);

const BRIEF = (name: string) => [
  `Write ${name}'s morning brief: plain, warm and short, in Markdown. Sections in this order, leaving out any with nothing in it:`,
  "- one line of greeting with the weather (from the board's weather);",
  "- **Today**: events with their times, tasks due or overdue, chores due (from the day cards; use your tools for anything missing);",
  "- **Projects**: active and blocked projects with their next step, and what was logged yesterday;",
  "- **News**: up to 5 headlines, one line each, most important first.",
  "Use only the board below and what your tools return. Never make up events, tasks or headlines. If a part failed, say so in one short line.",
].join("\n");

/** The info board: Pondering Orb's Main and Daily pages, for each person, through FAITH.
 *  Day cards come from dashboard.ts (each viewer's own tools); projects, the log and the
 *  brief from this person's own store; weather from Home Assistant; news, uptime and the
 *  machine only where board: sets them up. The morning brief is written by FAITH's agent
 *  (what Orb's Golem did), with this person's tools and nothing that changes anything. */
export class Board {
  store: BoardStore;
  private writing = new Set<string>();
  /** A brief that failed waits 15 minutes before the schedule tries again (the model may be down). */
  private failed = new Map<string, number>();
  private timer?: NodeJS.Timeout;
  constructor(db: Db, readonly cfg: () => Config, private registry: Registry, private agent: Agent,
    private extra: { approvals?: Approvals; notifier?: Notifier; health?: Health; log?: { info: Function; warn: Function } } = {}, private now: () => Date = () => new Date()) {
    this.store = new BoardStore(db, () => cfg().board.log_max);
  }
  today() { return localNow(this.now()).day; }

  weatherOn(c: Caller) {
    const ha = this.registry.ha, e = this.cfg().board.weather_entity;
    return !!e && !!ha && this.registry.allowedConnector(c, ha.id) && !!ha.token(c);
  }
  async weather(c: Caller) { return this.registry.ha!.weather(this.cfg().board.weather_entity, c); }
  async news() { const n = this.cfg().board.news; return news(n.feeds, n.items); }
  uptimeOn(c: Caller) { const u = this.cfg().board.uptime; return !!u && u.roles.includes(policyOf(c)); }
  async uptime() {
    const u = this.cfg().board.uptime!, r = await uptime(u.url, u.slug, u.ignore), counted = r.monitors.filter((m) => !m.ignored);
    return { up: counted.filter((m) => m.status === "up").length, down: counted.filter((m) => m.status === "down").length, monitors: r.monitors };
  }
  systemOn(c: Caller) { return this.cfg().board.system.roles.includes(policyOf(c)); }

  /** Everything this viewer may see on the board. */
  async view(c: Caller): Promise<BoardView> {
    const cfg = this.cfg(), me = boardOwner(c), day = this.today();
    const part = async <T>(on: boolean, f: () => Promise<T>): Promise<Part<T>> => { if (!on) return null; try { return await f(); } catch (e: any) { return { error: e?.message || String(e) }; } };
    const [weather, headlines, up, system, cards] = await Promise.all([
      part(this.weatherOn(c), () => this.weather(c)),
      part(cfg.board.news.feeds.length > 0, () => this.news()),
      part(this.uptimeOn(c), () => this.uptime()),
      part(this.systemOn(c), async () => ({ ...(await hostStats(cfg.board.system.disks)), sources: (this.extra.health?.list() ?? []).map((s) => ({ label: s.label, ok: s.ok, ...(s.error ? { error: s.error } : {}) })) })),
      dashboard(cfg, this.registry, c, { approvals: this.extra.approvals }).then((d) => d.cards).catch(() => [] as CardOut[]),
    ]);
    let projects: BoardView["projects"] = null, log: LogEntry[] | null = null, brief: Brief | null = null;
    if (me) {
      log = this.store.log(me.id, { limit: 12 });
      projects = this.store.projects(me.id).map((p) => { const l = this.store.log(me.id, { project: p.name, limit: 1 })[0]; return l ? { ...p, last: l.text, last_day: l.day } : p; });
      brief = this.store.brief(me.id, day) ?? null;
    }
    return { person: me ? { id: me.id, name: me.name } : null, day, brief, weather, news: headlines, projects, log, uptime: up, system, cards };
  }

  /** The morning brief, written now by FAITH for this person, from their board and their own tools.
   *  Read-only: the turn gets no tool that changes anything. */
  async writeBrief(p: Person, by = "faith"): Promise<Brief> {
    if (this.writing.has(p.id)) throw new BoardError(409, "Your brief is already being written. It'll be on the board in a moment.");
    this.writing.add(p.id);
    try {
      const caller: Caller = { scope: { kind: "person", person: p }, channel: "routine", label: `morning brief (${p.id})` };
      const v = await this.view(caller), day = v.day;
      const data = {
        weather: v.weather, cards: v.cards.map((c) => ({ title: c.title, items: c.items?.map((i) => [i.time, i.label, i.title, i.meta].filter(Boolean).join(" · ")), text: c.text, error: c.error })),
        projects: v.projects?.filter((x) => x.status === "active" || x.status === "blocked").map((x) => ({ name: x.name, status: x.status, next: x.next })),
        logged_lately: v.log?.slice(0, 8).map((l) => ({ day: l.day, project: l.project, text: l.text })),
        news: v.news && "items" in v.news ? v.news.items.slice(0, 10).map((n) => ({ title: n.title, source: n.source })) : v.news,
      };
      const out = await this.agent.turn({ caller, text: "Write my morning brief for today.", readOnly: true, extId: `brief:${p.id}:${day}`, freshAfterMs: 1,
        extraSystem: `${BRIEF(p.name)}\n\nThe board right now (JSON):\n${JSON.stringify(data).slice(0, 16_000)}` });
      const b: Brief = { day, text: out.text.trim(), by, at: Date.now() };
      this.store.saveBrief(p.id, b);
      if (this.cfg().board.brief.send && this.extra.notifier) await this.extra.notifier.send(p.id, b.text, { title: "Morning brief", from: "board" }).catch(() => []);
      return b;
    } finally { this.writing.delete(p.id); }
  }

  /** Who is due a brief now: board.brief.people, at board.brief.time, once a day (caught up within the hour). */
  due(at = this.now()) {
    const b = this.cfg().board.brief, n = localNow(at);
    if (!b.time || !onDay(b.days, n.weekday)) return [];
    const [h, m] = b.time.split(":").map(Number), t = h * 60 + m;
    if (n.minutes < t || n.minutes - t > 60) return [];
    return this.cfg().people.filter((p) => b.people.includes(p.id) && !this.store.brief(p.id, n.day) && !this.writing.has(p.id)
      && at.getTime() - (this.failed.get(p.id) ?? 0) > 15 * 60_000);
  }
  async tick() {
    for (const p of this.due()) {
      try { await this.writeBrief(p, "morning"); this.extra.log?.info({ person: p.id }, "morning brief written"); }
      catch (e: any) { this.failed.set(p.id, this.now().getTime()); this.extra.log?.warn({ person: p.id, err: e.message }, "morning brief failed"); }
    }
  }
  start(everyMs = 60_000) { this.timer = setInterval(() => { void this.tick(); }, everyMs); this.timer.unref(); }
  stop() { if (this.timer) clearInterval(this.timer); }
}
