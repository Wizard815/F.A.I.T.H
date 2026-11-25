import type { Db } from "../db.js";
import { newId } from "../secrets.js";

/** Each person's projects, work log and morning briefs: what Pondering Orb kept in its
 *  own database (pondering-orb/server/src/records.ts). They had no other home, so they
 *  live in FAITH now, one set per person. Nobody else's view reads them: every call
 *  takes the person whose they are, and the household has none. */
export const STATUSES = ["next", "active", "blocked", "paused", "shipped"] as const;
export type Status = typeof STATUSES[number];
export type Project = { id: string; name: string; status: Status; next: string; fav: boolean; archived: boolean; created_at: number; updated_at: number };
export type LogEntry = { id: number; project: string; text: string; by: string; day: string; at: number };
export type Brief = { day: string; text: string; by: string; at: number };

export class BoardError extends Error { constructor(public status: number, message: string) { super(message); } }

const GENERAL = "General";
const cleanName = (v: unknown) => {
  const n = String(v ?? "").trim();
  if (!n) throw new BoardError(400, "A project needs a name.");
  if (n.length > 80 || /[\r\n]/.test(n)) throw new BoardError(400, "A project name is one line, at most 80 characters.");
  return n;
};
const status = (v: unknown, d: Status): Status => {
  if (v == null || v === "") return d;
  const s = String(v).toLowerCase();
  if (!(STATUSES as readonly string[]).includes(s)) throw new BoardError(400, `Status is one of ${STATUSES.join(", ")}.`);
  return s as Status;
};

export class BoardStore {
  constructor(private db: Db, private logMax: () => number) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS board_projects (
        id TEXT PRIMARY KEY, person_id TEXT NOT NULL, name TEXT NOT NULL, status TEXT NOT NULL, next TEXT NOT NULL DEFAULT '',
        fav INTEGER NOT NULL DEFAULT 0, archived INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
      CREATE UNIQUE INDEX IF NOT EXISTS board_projects_name ON board_projects(person_id, name COLLATE NOCASE);
      CREATE TABLE IF NOT EXISTS board_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT, person_id TEXT NOT NULL, project TEXT NOT NULL, text TEXT NOT NULL, by TEXT NOT NULL, day TEXT NOT NULL, at INTEGER NOT NULL);
      CREATE INDEX IF NOT EXISTS board_log_person ON board_log(person_id, day, at);
      CREATE TABLE IF NOT EXISTS board_briefs (
        person_id TEXT NOT NULL, day TEXT NOT NULL, text TEXT NOT NULL, by TEXT NOT NULL, at INTEGER NOT NULL, PRIMARY KEY (person_id, day));
    `);
  }

  private row = (r: any): Project => ({ id: r.id, name: r.name, status: r.status, next: r.next, fav: !!r.fav, archived: !!r.archived, created_at: r.created_at, updated_at: r.updated_at });
  projects(person: string, opts: { archived?: boolean } = {}): Project[] {
    return (this.db.prepare(`SELECT * FROM board_projects WHERE person_id = ? ${opts.archived ? "" : "AND archived = 0"} ORDER BY fav DESC, updated_at DESC`).all(person) as any[]).map(this.row);
  }
  project(person: string, nameOrId: string): Project | undefined {
    const r = this.db.prepare("SELECT * FROM board_projects WHERE person_id = ? AND (id = ? OR name = ? COLLATE NOCASE)").get(person, nameOrId, nameOrId);
    return r ? this.row(r) : undefined;
  }
  addProject(person: string, p: { name: unknown; status?: unknown; next?: unknown; fav?: unknown }, now = Date.now()): Project {
    const name = cleanName(p.name);
    if (this.project(person, name)) throw new BoardError(409, `There's already a project called ${name}.`);
    const id = newId();
    this.db.prepare("INSERT INTO board_projects (id, person_id, name, status, next, fav, archived, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)")
      .run(id, person, name, status(p.status, "next"), String(p.next ?? "").trim().slice(0, 200), p.fav ? 1 : 0, now, now);
    return this.project(person, id)!;
  }
  updateProject(person: string, nameOrId: string, patch: { name?: unknown; status?: unknown; next?: unknown; fav?: unknown; archived?: unknown }, now = Date.now()): Project {
    const p = this.project(person, nameOrId);
    if (!p) throw new BoardError(404, `No project called ${nameOrId}. Your projects: ${this.projects(person).map((x) => x.name).join(", ") || "none yet"}.`);
    const name = patch.name !== undefined ? cleanName(patch.name) : p.name;
    if (name.toLowerCase() !== p.name.toLowerCase() && this.project(person, name)) throw new BoardError(409, `There's already a project called ${name}.`);
    this.db.prepare("UPDATE board_projects SET name = ?, status = ?, next = ?, fav = ?, archived = ?, updated_at = ? WHERE id = ?").run(
      name, status(patch.status, p.status), patch.next !== undefined ? String(patch.next ?? "").trim().slice(0, 200) : p.next,
      patch.fav !== undefined ? (patch.fav ? 1 : 0) : p.fav ? 1 : 0, patch.archived !== undefined ? (patch.archived ? 1 : 0) : p.archived ? 1 : 0, now, p.id);
    // A renamed project keeps its log.
    if (name !== p.name) this.db.prepare("UPDATE board_log SET project = ? WHERE person_id = ? AND project = ?").run(name, person, p.name);
    return this.project(person, p.id)!;
  }

  log(person: string, opts: { project?: string; limit?: number } = {}): LogEntry[] {
    const n = Math.max(1, Math.min(200, opts.limit ?? 20));
    const rows = opts.project
      ? this.db.prepare("SELECT * FROM board_log WHERE person_id = ? AND project = ? COLLATE NOCASE ORDER BY day DESC, at DESC LIMIT ?").all(person, opts.project, n)
      : this.db.prepare("SELECT * FROM board_log WHERE person_id = ? ORDER BY day DESC, at DESC LIMIT ?").all(person, n);
    return (rows as any[]).map((r) => ({ id: r.id, project: r.project, text: r.text, by: r.by, day: r.day, at: r.at }));
  }
  /** A short past-tense note ("Fixed the gate latch"). Too long is refused, not cut (as Orb did). */
  addLog(person: string, e: { text: unknown; project?: unknown; by: string; day: string }, now = Date.now()): LogEntry {
    const text = String(e.text ?? "").trim(), max = this.logMax();
    if (!text) throw new BoardError(400, "A log entry needs text.");
    if (text.length > max) throw new BoardError(400, `A log entry can be at most ${max} characters (this one has ${text.length}). Say it shorter.`);
    const want = String(e.project ?? "").trim();
    const project = want ? this.project(person, want)?.name : GENERAL;
    if (!project) throw new BoardError(404, `No project called ${want}. Use one of: ${[...this.projects(person).map((x) => x.name), GENERAL].join(", ")}.`);
    const r = this.db.prepare("INSERT INTO board_log (person_id, project, text, by, day, at) VALUES (?, ?, ?, ?, ?, ?)").run(person, project, text, e.by, e.day, now);
    if (project !== GENERAL) this.db.prepare("UPDATE board_projects SET updated_at = ? WHERE person_id = ? AND name = ?").run(now, person, project);
    return { id: Number(r.lastInsertRowid), project, text, by: e.by, day: e.day, at: now };
  }

  brief(person: string, day: string): Brief | undefined {
    return this.db.prepare("SELECT day, text, by, at FROM board_briefs WHERE person_id = ? AND day = ?").get(person, day) as Brief | undefined;
  }
  saveBrief(person: string, b: Brief) {
    this.db.prepare("INSERT OR REPLACE INTO board_briefs (person_id, day, text, by, at) VALUES (?, ?, ?, ?, ?)").run(person, b.day, b.text.slice(0, 8000), b.by, b.at);
    this.db.prepare("DELETE FROM board_briefs WHERE person_id = ? AND at < ?").run(person, b.at - 60 * 86400_000);
  }

  /** Pondering Orb's projects and logs (its /api/c/projects and /api/c/logs), into this person's board.
   *  Projects already here (same name) and log entries already here (same day, project and text) are skipped. */
  importOrb(person: string, data: { projects?: unknown; logs?: unknown }, now = Date.now()) {
    const projects = Array.isArray(data.projects) ? data.projects : [], logs = Array.isArray(data.logs) ? data.logs : [];
    let p = 0, l = 0;
    const skipped: string[] = [];
    for (const x of projects as any[]) {
      try {
        if (this.project(person, String(x?.name ?? ""))) continue;
        this.addProject(person, { name: x?.name, status: (STATUSES as readonly string[]).includes(x?.status) ? x.status : "next", next: x?.next, fav: !!x?.fav }, now);
        if (x?.archived) this.updateProject(person, String(x.name), { archived: true }, now);
        p++;
      } catch (e: any) { skipped.push(`${x?.name ?? "a project"}: ${e.message}`); }
    }
    const has = this.db.prepare("SELECT 1 FROM board_log WHERE person_id = ? AND day = ? AND project = ? AND text = ?");
    const add = this.db.prepare("INSERT INTO board_log (person_id, project, text, by, day, at) VALUES (?, ?, ?, ?, ?, ?)");
    for (const x of logs as any[]) {
      const text = String(x?.text ?? "").trim().slice(0, 500), day = /^\d{4}-\d{2}-\d{2}$/.test(String(x?.date)) ? String(x.date) : "";
      if (!text || !day) continue;
      const project = this.project(person, String(x?.project ?? ""))?.name ?? GENERAL;
      if (has.get(person, day, project, text)) continue;
      add.run(person, project, text, `orb:${String(x?.by || "you").slice(0, 30)}`, day, Number(x?.created) || Date.parse(`${day}T12:00:00`) || now);
      l++;
    }
    return { projects: p, logs: l, skipped };
  }
}
