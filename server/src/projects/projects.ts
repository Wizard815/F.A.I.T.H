import type { Config, Person } from "../config.js";
import type { Db } from "../db.js";
import type { Agent, TurnResult } from "../harness/agent.js";
import type { Notifier } from "../notifier.js";
import { newId } from "../secrets.js";
import type { Caller } from "../scope.js";

/** Family projects (docs/projects.md), shaped like Hermes Studio's Projects: a
 *  project has threads, each a background FAITH conversation started from a
 *  brief; when one finishes, the project's coordinator gets a turn to report
 *  back or start the next step.
 *
 *  Who owns a project decides whose tokens its threads run with, the same split
 *  as the wiki's folders:
 *    person:<id>  that person's own tokens (their view, their role's rules)
 *    household    the household's tokens; changes wait for approval, as on the shared screen
 *    parents      the household's tokens with the parents' policy (grown-ups only)
 *  A project never reads another project's threads, and a caller only sees the
 *  projects their own view may see (`visibleOwners`). */
export type Owner = `person:${string}` | "household" | "parents";
export type Project = { id: string; owner: Owner; name: string; instructions: string; created_at: number; updated_at: number };
export type ThreadStatus = "working" | "done" | "waiting" | "failed";
/** Where a thread is in its life, for lists (the same names as Hermes Studio's projects):
 *  working; needs_you (waiting for a Yes or an approval, or it failed); review (finished,
 *  nobody has read it yet); done (finished and read); resolved (put away: hidden, can come back). */
export type ThreadStage = "working" | "needs_you" | "review" | "done" | "resolved";
export function stageOf(t: { status: ThreadStatus; resolved: boolean; seen_at: number | null }): ThreadStage {
  if (t.resolved) return "resolved";
  if (t.status === "working") return "working";
  if (t.status === "waiting" || t.status === "failed") return "needs_you";
  return t.seen_at ? "done" : "review";
}
export type Thread = {
  id: string; project_id: string; title: string; brief: string; status: ThreadStatus; resolved: boolean; depth: number;
  started_by: string; last_text: string; created_at: number; updated_at: number;
  /** Keeps nothing: read-only tools, no coordinator, no title in the log, deleted when put away or after `throwaway_hours`. */
  throwaway: boolean;
  /** When someone last read it since it finished (null: not yet, so it's ready for review). */
  seen_at: number | null;
  stage: ThreadStage;
};

export class ProjectError extends Error { constructor(public status: number, message: string) { super(message); } }

export const projectIdOf = (o: Owner) => (o === "household" ? "family" : o === "parents" ? "parents" : `person-${o.slice(7)}`);

/** Which projects this view may see. A signed-in person: their own, Family, and
 *  Parents for grown-ups. The parents' chat: Parents and Family. Anything shared
 *  (the household screen, the family chat, an unknown voice): Family only. */
export function visibleOwners(c: Caller): Owner[] {
  if (c.scope.kind === "person" && !c.audience) return [`person:${c.scope.person.id}`, "household", ...(c.scope.person.role !== "child" ? (["parents"] as const) : [])];
  if (c.audience === "parents") return ["parents", "household"];
  return ["household"];
}
/** The view a caller works in: their own project's owner. */
export const ownOwner = (c: Caller): Owner => (c.scope.kind === "person" && !c.audience ? `person:${c.scope.person.id}` : c.audience === "parents" ? "parents" : "household");

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export class Projects {
  /** Background runs, so tests (and shutdown) can wait for them. */
  private runs = new Set<Promise<void>>();
  constructor(private db: Db, readonly cfg: () => Config, private agent: Agent, private notifier: Notifier | undefined,
    private log: { info: Function; warn: Function } = console) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY, owner TEXT NOT NULL UNIQUE, name TEXT NOT NULL, instructions TEXT NOT NULL DEFAULT '',
        created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS project_threads (
        id TEXT PRIMARY KEY, project_id TEXT NOT NULL, title TEXT NOT NULL, brief TEXT NOT NULL, status TEXT NOT NULL,
        resolved INTEGER NOT NULL DEFAULT 0, depth INTEGER NOT NULL DEFAULT 0, started_by TEXT NOT NULL,
        conversation_id TEXT, last_text TEXT NOT NULL DEFAULT '', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS project_threads_project ON project_threads(project_id, updated_at);
    `);
    try { db.exec("ALTER TABLE project_threads ADD COLUMN throwaway INTEGER NOT NULL DEFAULT 0"); } catch { /* already there */ }
    try { db.exec("ALTER TABLE project_threads ADD COLUMN seen_at INTEGER"); } catch { /* already there */ }
    // A thread can't be working after a restart: its turn died with the old process.
    db.prepare("UPDATE project_threads SET status = 'failed', last_text = ? WHERE status = 'working'")
      .run("FAITH restarted while this was running. Send it a message to carry on.");
    this.sweep();
  }

  /** Deletes a throwaway thread and everything it said: its conversation, messages and held Yeses. */
  private forget(id: string) {
    const conv = (this.db.prepare("SELECT conversation_id FROM project_threads WHERE id = ?").get(id) as any)?.conversation_id;
    if (conv) {
      this.db.prepare("DELETE FROM messages WHERE conversation_id = ?").run(conv);
      this.db.prepare("DELETE FROM pending WHERE conversation_id = ?").run(conv);
      this.db.prepare("DELETE FROM conversations WHERE id = ?").run(conv);
    }
    this.db.prepare("DELETE FROM project_threads WHERE id = ?").run(id);
  }
  /** Throwaway threads past their time go, unless one is still working. Done threads that
   *  someone read `auto_resolve_days` ago are put away (never ones that need you or wait for review). */
  sweep(now = Date.now()) {
    const cfg = this.cfg().projects;
    const cutoff = now - cfg.throwaway_hours * 3600_000;
    for (const r of this.db.prepare("SELECT id FROM project_threads WHERE throwaway = 1 AND status != 'working' AND updated_at < ?").all(cutoff) as any[]) this.forget(r.id);
    if (cfg.auto_resolve_days > 0)
      this.db.prepare("UPDATE project_threads SET resolved = 1 WHERE resolved = 0 AND throwaway = 0 AND status = 'done' AND seen_at IS NOT NULL AND seen_at < ? AND updated_at < ?")
        .run(now - cfg.auto_resolve_days * 86400_000, now - cfg.auto_resolve_days * 86400_000);
  }

  /** Every owner the family has: one per person, Family and Parents. */
  owners(): Owner[] { return [...this.cfg().people.map((p) => `person:${p.id}` as Owner), "household", "parents"]; }
  person(o: Owner): Person | undefined { return o.startsWith("person:") ? this.cfg().people.find((p) => p.id === o.slice(7)) : undefined; }
  private defaultName(o: Owner) { return o === "household" ? "Family" : o === "parents" ? "Parents" : this.person(o)?.name ?? o.slice(7); }

  /** The project for an owner, made the first time it's needed. */
  ensure(o: Owner): Project {
    if (!this.owners().includes(o)) throw new ProjectError(404, "There's no such project.");
    const now = Date.now();
    this.db.prepare("INSERT OR IGNORE INTO projects (id, owner, name, instructions, created_at, updated_at) VALUES (?, ?, ?, '', ?, ?)")
      .run(projectIdOf(o), o, this.defaultName(o), now, now);
    return this.db.prepare("SELECT * FROM projects WHERE owner = ?").get(o) as Project;
  }

  /** The projects this caller may see, each with its threads (newest first). */
  list(c: Caller, opts: { resolved?: boolean } = {}) {
    this.sweep();
    return visibleOwners(c).filter((o) => this.owners().includes(o)).map((o) => {
      const p = this.ensure(o);
      return { ...p, threads: this.threads(p.id, opts) };
    });
  }
  /** One project, if this caller may see it (else a 404 that doesn't say whether it exists). */
  get(c: Caller, idOrName: string): Project {
    const key = String(idOrName || "").trim().toLowerCase();
    const want: Owner | undefined = key === "mine" || key === "me" || key === "my" ? ownOwner(c) : key === "family" || key === "household" ? "household" : key === "parents" ? "parents" : undefined;
    for (const o of visibleOwners(c)) {
      if (!this.owners().includes(o)) continue;
      const p = this.ensure(o);
      if (o === want || p.id === key || p.name.toLowerCase() === key) return p;
    }
    throw new ProjectError(404, "You don't have a project by that name. Try mine, family or parents.");
  }
  setInstructions(c: Caller, id: string, text: unknown) {
    const p = this.get(c, id);
    if (p.owner !== ownOwner(c) && c.scope.kind === "person" && c.scope.person.role === "child") throw new ProjectError(403, "Ask a grown-up to change the family's project.");
    const t = String(text ?? "").trim();
    if (t.length > 2000) throw new ProjectError(400, "A project's instructions are at most 2000 characters.");
    this.db.prepare("UPDATE projects SET instructions = ?, updated_at = ? WHERE id = ?").run(t, Date.now(), p.id);
    return this.get(c, p.id);
  }

  private row = (r: any): Thread => ({ id: r.id, project_id: r.project_id, title: r.title, brief: r.brief, status: r.status, resolved: !!r.resolved, depth: r.depth,
    started_by: r.started_by, last_text: r.last_text, created_at: r.created_at, updated_at: r.updated_at, throwaway: !!r.throwaway,
    seen_at: r.seen_at ?? null, stage: stageOf({ status: r.status, resolved: !!r.resolved, seen_at: r.seen_at ?? null }) });
  threads(projectId: string, opts: { resolved?: boolean } = {}): Thread[] {
    return (this.db.prepare(`SELECT * FROM project_threads WHERE project_id = ? ${opts.resolved ? "" : "AND resolved = 0"} ORDER BY updated_at DESC LIMIT 50`).all(projectId) as any[]).map(this.row);
  }
  /** One thread, if this caller may see its project. */
  thread(c: Caller, id: string): Thread & { project: Project } {
    const r = this.db.prepare("SELECT * FROM project_threads WHERE id = ?").get(String(id || "")) as any;
    const owners = visibleOwners(c);
    const p = r ? (this.db.prepare("SELECT * FROM projects WHERE id = ?").get(r.project_id) as Project | undefined) : undefined;
    if (!r || !p || !owners.includes(p.owner) || !this.owners().includes(p.owner)) throw new ProjectError(404, "There's no such thread in your projects.");
    return { ...this.row(r), project: p };
  }
  /** A thread's latest messages (its background conversation). */
  messages(c: Caller, id: string, limit = 15) {
    let t = this.thread(c, id);
    // A person (or the family screen) reading a finished thread has reviewed it. Background work reading doesn't count.
    if (!c.work && t.status !== "working" && !t.seen_at) {
      this.db.prepare("UPDATE project_threads SET seen_at = ? WHERE id = ?").run(Date.now(), t.id);
      t = this.thread(c, id);
    }
    const conv = (this.db.prepare("SELECT conversation_id FROM project_threads WHERE id = ?").get(t.id) as any)?.conversation_id;
    const rows = conv ? (this.db.prepare("SELECT role, content, created_at FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT ?").all(conv, limit) as any[]).reverse() : [];
    return { thread: { id: t.id, title: t.title, status: t.status, stage: t.stage, resolved: t.resolved, project: t.project.name, throwaway: t.throwaway }, messages: rows.map((m) => ({ role: m.role, text: String(m.content), at: m.created_at })) };
  }

  /** The view a project's background work runs in: its owner's, never the person who asked. */
  runAs(p: Project, work: Caller["work"]): Caller {
    const label = `project: ${p.name}${work?.thread ? " (thread)" : ""}`;
    if (p.owner === "household") return { scope: { kind: "household" }, channel: "routine", label, work };
    if (p.owner === "parents") return { scope: { kind: "household" }, channel: "routine", audience: "parents", label, work };
    const person = this.person(p.owner);
    if (!person) throw new ProjectError(404, "That person isn't in the family any more.");
    return { scope: { kind: "person", person }, channel: "routine", label, work };
  }
  /** Where a project's news goes: the person's own chat and phone, or the family or parents chat. */
  private deliverTo(p: Project) { return p.owner === "household" ? "family" : p.owner === "parents" ? "parents" : p.owner.slice(7); }

  private whoLabel(c: Caller) { return c.work ? `the ${c.work.project} coordinator` : c.scope.kind === "person" ? c.scope.person.id : c.speaker?.id ?? "household"; }

  /** Start a thread: it runs in the background with the project owner's tools. */
  start(c: Caller, projectId: string, input: { title?: unknown; brief: unknown; throwaway?: unknown }): Thread {
    const cfg = this.cfg().projects;
    if (!cfg.enabled) throw new ProjectError(400, "Projects are turned off (projects.enabled).");
    if (c.work?.thread) throw new ProjectError(400, "A thread can't start other threads. Say what's needed in your summary.");
    const p = this.get(c, projectId);
    this.ownProjectOnly(c, p);
    const throwaway = input.throwaway === true;
    // Only a person, for themselves: a shared project's threads belong to everyone in it, and a
    // coordinator's follow-up is part of the project's record.
    if (throwaway && (c.work || p.owner !== ownOwner(c) || c.scope.kind !== "person" || c.audience))
      throw new ProjectError(400, "Throwaway threads are only for your own project, started by you.");
    const brief = String(input.brief ?? "").trim();
    if (!brief) throw new ProjectError(400, "A thread needs a brief: what to do.");
    if (brief.length > 4000) throw new ProjectError(400, "A brief is at most 4000 characters.");
    const title = clip(String(input.title ?? "").trim().replace(/[\r\n]+/g, " ") || brief.replace(/\s+/g, " "), 80);
    const working = Number((this.db.prepare("SELECT COUNT(*) AS n FROM project_threads WHERE project_id = ? AND status = 'working'").get(p.id) as any).n);
    if (working >= cfg.max_working) throw new ProjectError(409, `${p.name} already has ${working} threads working. Wait for one to finish.`);
    const depth = c.work ? c.work.depth + 1 : 0;
    const id = newId(), now = Date.now();
    this.db.prepare("INSERT INTO project_threads (id, project_id, title, brief, status, resolved, depth, started_by, created_at, updated_at, throwaway) VALUES (?, ?, ?, ?, 'working', 0, ?, ?, ?, ?, ?)")
      .run(id, p.id, title, brief, depth, this.whoLabel(c), now, now, throwaway ? 1 : 0);
    const t = this.thread(this.runAs(p, undefined), id);
    this.track(this.runThread(p, t, this.firstPrompt(p, t)));
    return t;
  }

  /** Send a thread more to do. It picks up its own conversation where it left off. */
  message(c: Caller, threadId: string, text: unknown): Thread {
    const t = this.thread(c, threadId);
    this.ownProjectOnly(c, t.project);
    const say = String(text ?? "").trim();
    if (!say) throw new ProjectError(400, "Say what the thread should do next.");
    if (t.status === "working") throw new ProjectError(409, `"${t.title}" is still working. Wait for it to finish.`);
    this.db.prepare("UPDATE project_threads SET status = 'working', resolved = 0, seen_at = NULL, updated_at = ? WHERE id = ?").run(Date.now(), t.id);
    const from = ownOwner(c) === t.project.owner && !c.work ? "" : `(From ${this.whoLabel(c)}.) `;
    this.track(this.runThread(t.project, { ...t, status: "working" }, from + say));
    return this.thread(c, t.id);
  }

  /** A coordinator turn runs with its owner's tokens and nobody watching, so it may only
   *  send work into its own project: Sam's coordinator can't put Sam's things into Family. */
  private ownProjectOnly(c: Caller, p: Project) {
    if (c.work && c.work.project !== p.id) throw new ProjectError(403, "A project's coordinator works only in its own project.");
  }

  resolve(c: Caller, threadId: string, resolved = true): Thread & { project: Project; deleted?: boolean } {
    const t = this.thread(c, threadId);
    this.ownProjectOnly(c, t.project);
    if (t.throwaway && resolved) {
      if (t.status === "working") throw new ProjectError(409, `"${t.title}" is still working. Put it away when it's done.`);
      this.forget(t.id);
      return { ...t, resolved: true, deleted: true };
    }
    this.db.prepare("UPDATE project_threads SET resolved = ?, updated_at = ? WHERE id = ?").run(resolved ? 1 : 0, Date.now(), t.id);
    return this.thread(c, t.id);
  }

  private firstPrompt(p: Project, t: Thread) {
    if (t.throwaway) return [
      `A throwaway thread for ${this.person(p.owner)?.name ?? "them"}: answer from what you know and what your tools can look up. You can't change anything here and nothing is kept, so don't offer to save, remember or do things; say they can ask in a normal chat for that.`,
      `The question (${t.title}):\n${t.brief}`,
    ].join("\n\n");
    const who = p.owner === "household" ? "the whole family" : p.owner === "parents" ? "the parents" : this.person(p.owner)?.name ?? "them";
    return [
      `You're working in the background on a thread of the project "${p.name}", for ${who}. Nobody is reading along: do the job with your tools, then end with a short summary of what you did and anything still needed.`,
      "If something needs a person's Yes or an approval, ask for it once and say in your summary that it's waiting.",
      p.instructions && `The project's instructions:\n${p.instructions}`,
      `The job (${t.title}):\n${t.brief}`,
    ].filter(Boolean).join("\n\n");
  }

  private track(p: Promise<void>) { this.runs.add(p); p.finally(() => this.runs.delete(p)); }
  /** Wait for every background run (tests). */
  async idle() { while (this.runs.size) await Promise.allSettled([...this.runs]); }

  private async runThread(p: Project, t: Thread, text: string) {
    const caller = this.runAs(p, { project: p.id, thread: t.id, depth: t.depth, ...(t.throwaway ? { throwaway: true } : {}) });
    let result: TurnResult | undefined, status: ThreadStatus, last: string;
    try {
      result = await this.agent.turn({ caller, text, extId: `project:${p.id}:thread:${t.id}`, job: { background: true } });
      status = result.pending.length || result.requests.length ? "waiting" : "done";
      last = result.text;
      this.db.prepare("UPDATE project_threads SET conversation_id = ? WHERE id = ?").run(result.conversationId, t.id);
    } catch (e: any) {
      status = "failed"; last = `That didn't work: ${e?.message || e}`;
      this.log.warn({ project: p.id, thread: t.id, err: e?.message }, "project thread failed");
    }
    // A new result hasn't been read yet: it's ready for review.
    this.db.prepare("UPDATE project_threads SET status = ?, last_text = ?, seen_at = NULL, updated_at = ? WHERE id = ?").run(status, last.slice(0, 4000), Date.now(), t.id);
    // How it went goes in the action log (which Overseer reads): the title and status, not what it said.
    // A throwaway thread's title stays out of it too: it says only that one ran.
    this.agent.audit(caller, "project_thread_end", t.throwaway ? `${p.name}: a throwaway thread (${status})` : `${p.name}: ${t.title} (${status})`, status !== "failed");
    if (t.throwaway) {
      // No coordinator (its conversation is kept) and nothing of what it said in the chat or on the phone.
      await this.notifier?.send(this.deliverTo(p), status === "failed" ? "Your throwaway thread didn't work. Open Projects to see why." : "Your throwaway thread has an answer. Open Projects to read it.", { title: p.name, from: "faith" })
        .catch((e) => this.log.warn({ project: p.id, err: e?.message }, "project notice failed"));
      return;
    }
    await this.wake(p, { ...t, status, last_text: last }).catch((e) => this.log.warn({ project: p.id, err: e?.message }, "project wake-up failed"));
  }

  /** A thread finished: the coordinator reports it (and may start the next step),
   *  or, with wake-ups off or the chain too long, the thread's own summary goes out. */
  private async wake(p: Project, t: Thread) {
    const cfg = this.cfg().projects, to = this.deliverTo(p);
    const state = t.status === "done" ? "is done" : t.status === "waiting" ? "is waiting for a Yes or an approval" : "failed";
    let text = `${t.title} ${state}.\n\n${t.last_text}`;
    if (cfg.wake_coordinator && t.depth < cfg.max_depth) {
      const caller = this.runAs(p, { project: p.id, depth: t.depth });
      // If the coordinator's turn fails (the model went down), the thread's own summary still goes out.
      const r = await this.agent.turn({ caller, extId: `project:${p.id}:coordinator`, job: { background: true },
        text: `<project_event>\nThread "${t.title}" (${t.id}) ${state}. Its last message:\n${t.last_text}\n</project_event>\n` +
          `Tell ${p.owner === "household" ? "the family" : p.owner === "parents" ? "the parents" : "them"} the result in a few lines. If the project clearly needs a next step, start one thread for it with project_thread_start; otherwise don't.` })
        .catch((e) => { this.log.warn({ project: p.id, err: e?.message }, "project coordinator turn failed"); return undefined; });
      if (r?.text) text = r.text;
    }
    await this.notifier?.send(to, text, { title: p.name, from: "faith" });
  }

  /** A small summary for little screens (D.A.S.H): at most 8 projects and 5 threads each. */
  glance(c: Caller) {
    return {
      projects: this.list(c).slice(0, 8).map((p) => ({
        id: p.id, name: clip(p.name, 32),
        needs_you: p.threads.filter((t) => t.stage === "needs_you").length,
        working: p.threads.filter((t) => t.stage === "working").length,
        review: p.threads.filter((t) => t.stage === "review").length,
        // A little screen sits where others can see it (a dashboard, a desk), so a throwaway
        // thread shows only that it exists: no title, no words.
        threads: p.threads.slice(0, 5).map((t) => t.throwaway
          ? { id: t.id, title: "Throwaway thread", status: t.status, stage: t.stage, last: "", throwaway: true }
          : { id: t.id, title: clip(t.title, 32), status: t.status, stage: t.stage, last: clip(t.last_text.replace(/\s+/g, " "), 60) }),
      })),
    };
  }
}
