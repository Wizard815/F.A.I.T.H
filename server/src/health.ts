import { envValue, type Config } from "./config.js";
import type { Registry } from "./connectors/registry.js";
import type { Notifier } from "./notifier.js";
import type { Caller } from "./scope.js";

/** Keeping an eye on everything FAITH connects to: each source, the model,
 *  voice ID and Mattermost, every couple of minutes. When one goes down for
 *  two checks in a row, the parents hear about it once (their chat and
 *  phones); when it's back, they hear that too. A source that keeps flapping
 *  says so at most once every half hour. Nothing is restarted or changed:
 *  FAITH only reports. */
export type SourceState = { id: string; label: string; ok: boolean | null; since: number; checked_at: number; error?: string; fails: number };
export type HealthEvent = { at: number; id: string; label: string; ok: boolean; error?: string };

const NOT_FOR_THIS_VIEW = /no token|No Studio account|isn't set up|no profile/i;

export class Health {
  private states = new Map<string, SourceState>();
  private notified = new Map<string, { kind: "down" | "up"; at: number }>();
  private log: HealthEvent[] = [];
  private timer?: NodeJS.Timeout;
  private running = false;
  /** Set by index.ts once the Mattermost bot exists. */
  bot?: { familyId?: string };

  constructor(private cfg: () => Config, private registry: Registry, private notifier: Notifier | undefined, private env: NodeJS.ProcessEnv = process.env,
    private now: () => number = Date.now, private quietMs = 30 * 60_000) {}

  list() { return [...this.states.values()]; }
  events() { return [...this.log].reverse(); }
  down() { return this.list().filter((s) => s.ok === false); }

  /** Callers to try a source as: the shared view first, then each person (some sources only have personal tokens). */
  private callers(): Caller[] {
    return [{ scope: { kind: "household" }, channel: "routine", label: "health check" },
      { scope: { kind: "household" }, channel: "routine", audience: "parents", label: "health check" },
      ...this.cfg().people.map((p) => ({ scope: { kind: "person" as const, person: p }, channel: "routine" as const, label: "health check" }))];
  }

  private async probe(url: string, headers: Record<string, string> = {}) {
    const r = await fetch(url, { headers, signal: AbortSignal.timeout(8000) }).catch((e: any) => { throw new Error(e?.cause?.code || e?.message || "unreachable"); });
    if (r.status >= 500 || r.status === 401 || r.status === 403) throw new Error(`answered ${r.status}`);
  }

  async check() {
    if (this.running) return this.list();
    this.running = true;
    try {
      const c = this.cfg(), jobs: { id: string; label: string; run: () => Promise<boolean | null> }[] = [];
      const key = envValue(c.model.api_key_env, this.env);
      jobs.push({ id: "model", label: "the model (Argos)", run: async () => { await this.probe(`${c.model.base_url}/models`, key ? { Authorization: `Bearer ${key}` } : {}); return true; } });
      if (c.voice_id) jobs.push({ id: "voice_id", label: "voice ID", run: async () => { await this.probe(`${c.voice_id!.url}/health`); return true; } });
      if (c.mattermost) jobs.push({ id: "mattermost", label: "Mattermost", run: async () => { if (!this.bot?.familyId) throw new Error("the bot isn't connected"); return true; } });
      for (const conn of this.registry.connectors) {
        if (conn.id === "faith" || conn.id === "board") continue;   // FAITH itself
        jobs.push({ id: conn.id, label: conn.id, run: async () => {
          for (const caller of this.callers()) {
            if (!this.registry.allowedConnector(caller, conn.id)) continue;
            try { if (conn.ping) await conn.ping(caller); else await conn.tools(caller); return true; }
            catch (e: any) { if (NOT_FOR_THIS_VIEW.test(e.message)) continue; throw e; }
          }
          return null; // no view has it set up: nothing to check
        } });
      }
      await Promise.all(jobs.map(async (j) => {
        let ok: boolean | null, error: string | undefined;
        try { ok = await j.run(); } catch (e: any) { ok = false; error = String(e?.message || e).slice(0, 200); }
        this.record(j.id, j.label, ok, error);
      }));
      await this.announce();
      return this.list();
    } finally { this.running = false; }
  }

  private record(id: string, label: string, ok: boolean | null, error?: string) {
    const t = this.now(), prev = this.states.get(id);
    const s: SourceState = prev ? { ...prev, label, checked_at: t, error } : { id, label, ok, since: t, checked_at: t, error, fails: 0 };
    s.fails = ok === false ? (prev?.fails ?? 0) + 1 : 0;
    if (!prev || prev.ok !== ok) {
      // Down counts from the second failed check, so one slow answer doesn't flip it.
      if (ok === false && s.fails < 2 && prev?.ok !== false) { s.ok = prev?.ok ?? null; this.states.set(id, s); return; }
      s.ok = ok; s.since = t;
      if (prev && ok !== null) this.log.push({ at: t, id, label, ok, error });
      if (this.log.length > 100) this.log.shift();
    }
    this.states.set(id, s);
  }

  private async announce() {
    const t = this.now();
    for (const s of this.list()) {
      if (s.ok === null) continue;
      const last = this.notified.get(s.id);
      if (s.ok === false && last?.kind !== "down") {
        if (last && t - last.at < this.quietMs) continue; // flapping: stay quiet for a while
        this.notified.set(s.id, { kind: "down", at: t });
        await this.say(`⚠️ ${cap(s.label)} isn't answering (${s.error || "no reply"}). FAITH can't use it until it's back.`);
      } else if (s.ok === true && last?.kind === "down") {
        this.notified.set(s.id, { kind: "up", at: t });
        await this.say(`✅ ${cap(s.label)} is back.`);
      }
    }
  }
  private async say(text: string) { await this.notifier?.send("parents", text, { title: "FAITH", from: "faith" }).catch(() => []); }

  start(everyS = this.cfg().health.interval_s) {
    if (everyS <= 0) return;
    setTimeout(() => void this.check().catch(() => {}), 15_000).unref();
    this.timer = setInterval(() => void this.check().catch(() => {}), everyS * 1000);
    this.timer.unref();
  }
  stop() { if (this.timer) clearInterval(this.timer); }
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
