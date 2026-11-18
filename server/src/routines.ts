import type { Config } from "./config.js";
import type { Db } from "./db.js";
import type { Agent } from "./harness/agent.js";
import type { Notifier } from "./notifier.js";
import { newId } from "./secrets.js";
import type { Caller } from "./scope.js";
import type { Skills } from "./skills.js";

export class RoutineError extends Error { constructor(public status: number, message: string) { super(message); } }

/** A routine is a skill (or plain instructions) on a schedule, with somewhere
 *  to send the result: "every school morning at 7, the morning brief in the
 *  family chat". It runs as the household, the parents, or one person, with
 *  exactly that view's tools and rules (household changes still need approval). */
export type Routine = {
  id: string; name: string; skill: string | null; prompt: string;
  days: string;            // daily | weekdays | weekends | mon,tue,...
  time: string;            // HH:MM, local time (TZ)
  run_as: "household" | "parents" | "person"; person_id: string | null;
  deliver: string[];       // family | parents | a person id
  enabled: boolean; last_day: string | null; last_status: string | null; last_text: string | null; last_at: number | null;
};

const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const CATCH_UP_MINUTES = 60; // FAITH was down at 7:00 and is back by 8:00: still run it, once

export function localNow(d = new Date(), tz = process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" })
    .formatToParts(d).map((p) => [p.type, p.value]));
  return { day: `${parts.year}-${parts.month}-${parts.day}`, weekday: String(parts.weekday).slice(0, 3).toLowerCase(), minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}
export function onDay(days: string, weekday: string) {
  const d = days.trim().toLowerCase();
  if (d === "daily" || d === "every day") return true;
  if (d === "weekdays") return !["sat", "sun"].includes(weekday);
  if (d === "weekends") return ["sat", "sun"].includes(weekday);
  return d.split(/[\s,]+/).map((x) => x.slice(0, 3)).includes(weekday);
}

export class Routines {
  private timer?: NodeJS.Timeout; private running = new Set<string>();
  constructor(private db: Db, private cfg: () => Config, private agent: Agent, private skills: Skills, private notifier: Notifier, private log: { info: Function; warn: Function }, private now: () => Date = () => new Date()) {
    db.exec(`CREATE TABLE IF NOT EXISTS routines (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, skill TEXT, prompt TEXT NOT NULL DEFAULT '', days TEXT NOT NULL, time TEXT NOT NULL,
      run_as TEXT NOT NULL, person_id TEXT, deliver TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1,
      last_day TEXT, last_status TEXT, last_text TEXT, last_at INTEGER)`);
  }

  list(): Routine[] { return (this.db.prepare("SELECT * FROM routines ORDER BY time, name").all() as any[]).map((r) => ({ ...r, deliver: JSON.parse(r.deliver), enabled: !!r.enabled })); }
  get(id: string) { const r = this.list().find((x) => x.id === id); if (!r) throw new RoutineError(404, "No such routine."); return r; }

  save(input: Partial<Routine> & { name: string; days: string; time: string }) {
    const cfg = this.cfg();
    if (!input.name?.trim()) throw new RoutineError(400, "A routine needs a name.");
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time)) throw new RoutineError(400, "time is HH:MM (24-hour), e.g. 07:00.");
    if (!["daily", "every day", "weekdays", "weekends"].includes(input.days.trim().toLowerCase()) && !input.days.toLowerCase().split(/[\s,]+/).every((d) => DAYS.includes(d.slice(0, 3)))) throw new RoutineError(400, "days is daily, weekdays, weekends or a list like mon,wed,fri.");
    if (input.skill && !this.skills.get(input.skill)) throw new RoutineError(400, `No skill called ${input.skill}.`);
    if (!input.skill && !input.prompt?.trim()) throw new RoutineError(400, "Pick a skill or write what to do.");
    const run_as = input.run_as || "household";
    if (!["household", "parents", "person"].includes(run_as)) throw new RoutineError(400, "run_as is household, parents or person.");
    if (run_as === "person" && !cfg.people.some((p) => p.id === input.person_id)) throw new RoutineError(400, "Pick whose routine it is (person_id).");
    const deliver = (input.deliver?.length ? input.deliver : ["family"]).map(String);
    for (const t of deliver) if (!["family", "parents"].includes(t) && !cfg.people.some((p) => p.id === t)) throw new RoutineError(400, `Can't deliver to "${t}": use family, parents or a person's id.`);
    if (run_as === "person" && deliver.some((t) => t === "family" || t === "parents" || t !== input.person_id)) throw new RoutineError(400, "A person's routine can see their private things, so it only goes to them.");
    const id = input.id || newId();
    const old = input.id ? this.list().find((x) => x.id === input.id) : undefined;
    this.db.prepare(`INSERT OR REPLACE INTO routines (id, name, skill, prompt, days, time, run_as, person_id, deliver, enabled, last_day, last_status, last_text, last_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(id, input.name.trim(), input.skill || null, input.prompt?.trim() || "", input.days.trim().toLowerCase(), input.time,
      run_as, run_as === "person" ? input.person_id! : null, JSON.stringify(deliver), input.enabled === false ? 0 : 1, old?.last_day ?? null, old?.last_status ?? null, old?.last_text ?? null, old?.last_at ?? null);
    return this.get(id);
  }
  remove(id: string) { if (!Number(this.db.prepare("DELETE FROM routines WHERE id = ?").run(id).changes)) throw new RoutineError(404, "No such routine."); }

  private caller(r: Routine): Caller {
    const label = `routine: ${r.name}`;
    if (r.run_as === "person") { const p = this.cfg().people.find((x) => x.id === r.person_id); if (!p) throw new RoutineError(400, `${r.person_id} isn't in the family any more.`); return { scope: { kind: "person", person: p }, channel: "routine", label }; }
    return { scope: { kind: "household" }, channel: "routine", label, ...(r.run_as === "parents" ? { audience: "parents" as const } : {}) };
  }

  /** Run one now (the schedule, or "Run now" on the admin page). */
  async run(id: string) {
    const r = this.get(id);
    if (this.running.has(id)) throw new RoutineError(409, "It's already running.");
    this.running.add(id);
    const day = localNow(this.now()).day;
    try {
      const ask = [r.skill ? `Do the "${r.skill}" skill now: load it with skill_load and follow it.` : "", r.prompt].filter(Boolean).join("\n");
      const out = await this.agent.turn({ caller: this.caller(r), text: ask, extId: `routine:${r.id}:${day}` });
      const sent: string[] = [];
      for (const to of r.deliver) sent.push(...(await this.notifier.send(to, out.text, { title: r.name, from: "routine" })));
      const status = sent.length ? `sent to ${sent.join(", ")}` : "ran, but there was nowhere to send it (no Mattermost or phone set up)";
      this.db.prepare("UPDATE routines SET last_day = ?, last_status = ?, last_text = ?, last_at = ? WHERE id = ?").run(day, status, out.text.slice(0, 4000), Date.now(), id);
      this.log.info({ routine: r.name, status }, "routine ran");
      return { ok: true, text: out.text, status };
    } catch (e: any) {
      this.db.prepare("UPDATE routines SET last_day = ?, last_status = ?, last_at = ? WHERE id = ?").run(day, `failed: ${e.message}`, Date.now(), id);
      this.log.warn({ routine: r.name, err: e.message }, "routine failed");
      return { ok: false, text: "", status: `failed: ${e.message}` };
    } finally { this.running.delete(id); }
  }

  /** Which routines are due now (not yet run today, inside the catch-up window). */
  due(at = this.now()) {
    const n = localNow(at);
    return this.list().filter((r) => {
      if (!r.enabled || r.last_day === n.day || !onDay(r.days, n.weekday)) return false;
      const [h, m] = r.time.split(":").map(Number), t = h * 60 + m;
      return n.minutes >= t && n.minutes - t <= CATCH_UP_MINUTES;
    });
  }
  async tick() { for (const r of this.due()) await this.run(r.id); }
  start(everyMs = 30_000) { this.timer = setInterval(() => { this.tick().catch((e) => this.log.warn({ err: e.message }, "routines tick failed")); }, everyMs); this.timer.unref(); }
  stop() { if (this.timer) clearInterval(this.timer); }
}
