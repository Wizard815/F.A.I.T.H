import type { Config } from "./config.js";
import type { Db } from "./db.js";
import type { Registry } from "./connectors/registry.js";
import type { Tool } from "./connectors/types.js";
import { newId } from "./secrets.js";
import { speakerLabel, type Caller, type Channel } from "./scope.js";

export class ApprovalError extends Error { constructor(public status: number, message: string) { super(message); } }

export type Request = {
  id: string; summary: string; tool: string; requested_by: string; requested_at: number;
  status: "pending" | "approved" | "denied" | "failed" | "expired"; decided_by: string | null; decided_at: number | null; result: string | null; overruled: boolean;
};

/** Changes asked for from the shared household view (nobody signed in) wait
 *  here. Any family member with an approver role (adults by default) can
 *  approve or deny; the admin can overrule a denial, or deny anything still
 *  waiting. Approved changes run with the household's own tokens, so an
 *  approval never lends the approver's private access to the request. */
export type ApprovalEvent = { kind: "created" | "decided"; request: Request; channel: string; device_id: string | null; text?: string };

export class Approvals {
  private listeners: ((e: ApprovalEvent) => void)[] = [];
  /** Tell other surfaces (the Mattermost parents chat) when a request is made or decided. */
  on(fn: (e: ApprovalEvent) => void) { this.listeners.push(fn); }
  private emit(e: ApprovalEvent) { for (const f of this.listeners) { try { f(e); } catch { /* a listener's problem isn't ours */ } } }
  private row(id: string): Request | undefined { return this.list().find((r) => r.id === id); }

  constructor(private db: Db, private cfg: () => Config, private registry: Registry, private now: () => number = Date.now) {
    db.exec(`CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY, tool TEXT NOT NULL, args TEXT NOT NULL, summary TEXT NOT NULL,
      requested_by TEXT NOT NULL, channel TEXT NOT NULL, device_id TEXT, conversation_id TEXT,
      status TEXT NOT NULL, created_at INTEGER NOT NULL, decided_by TEXT, decided_at INTEGER, result TEXT, overruled INTEGER NOT NULL DEFAULT 0)`);
  }

  explain(t: Tool, args: any) {
    if (t.explain) { try { return t.explain(args); } catch { /* fall through */ } }
    const a = Object.entries(args || {}).filter(([, v]) => v != null && v !== "").map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`).join(", ");
    return `${t.name.replace(/_/g, " ")}${a ? ` (${a.slice(0, 200)})` : ""}`;
  }

  create(c: Caller, t: Tool, args: any, conversationId?: string) {
    const id = newId(), summary = this.explain(t, args);
    this.db.prepare("INSERT INTO requests (id, tool, args, summary, requested_by, channel, device_id, conversation_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)")
      .run(id, t.name, JSON.stringify(args ?? {}), summary, speakerLabel(c) ?? c.label, c.channel, c.deviceId ?? null, conversationId ?? null, this.now());
    const r = this.row(id);
    if (r) this.emit({ kind: "created", request: r, channel: c.channel, device_id: c.deviceId ?? null });
    return { id, summary };
  }

  private expire() {
    this.db.prepare("UPDATE requests SET status = 'expired' WHERE status = 'pending' AND created_at < ?").run(this.now() - this.cfg().approvals.ttl_hours * 3600_000);
  }
  canApprove(c: Caller) {
    return c.scope.kind === "person" && (c.channel === "hub" || c.channel === "personal" || c.channel === "mattermost" || c.channel === "ha") && this.cfg().approvals.approvers.includes(c.scope.person.role);
  }
  pendingCount() { this.expire(); return Number((this.db.prepare("SELECT COUNT(*) AS n FROM requests WHERE status = 'pending'").get() as any).n); }

  /** Waiting requests and the last day's decisions. Anyone can see their summaries
   *  (they come from the shared view, so nothing private is in them). */
  list(): Request[] {
    this.expire();
    return (this.db.prepare("SELECT * FROM requests WHERE status = 'pending' OR created_at > ? ORDER BY created_at DESC LIMIT 50").all(this.now() - 86400_000) as any[])
      .map((r) => ({ id: r.id, summary: r.summary, tool: r.tool, requested_by: r.requested_by, requested_at: r.created_at, status: r.status, decided_by: r.decided_by, decided_at: r.decided_at, result: r.result, overruled: !!r.overruled }));
  }

  /** A request by its full id or the short code shown in chats (the first 5 characters). */
  resolveId(idOrCode: string) {
    const all = this.list();
    const exact = all.find((r) => r.id === idOrCode);
    if (exact) return exact.id;
    const hits = all.filter((r) => r.id.toLowerCase().startsWith(idOrCode.toLowerCase()));
    return hits.length === 1 ? hits[0].id : undefined;
  }
  static code(id: string) { return id.slice(0, 5); }

  async decide(c: Caller, id: string, approve: boolean) {
    if (!this.canApprove(c) || c.scope.kind !== "person") throw new ApprovalError(403, "Only a signed-in family member can approve changes.");
    this.expire();
    const row = this.db.prepare("SELECT * FROM requests WHERE id = ?").get(id) as any;
    if (!row) throw new ApprovalError(404, "No such request.");
    const me = c.scope.person, admin = me.role === "admin";
    let overrule = false;
    if (row.status !== "pending") {
      if (row.status === "expired") throw new ApprovalError(409, "That request expired. Ask again.");
      if (!admin) throw new ApprovalError(409, `Already ${row.status} by ${row.decided_by}. Only the admin can overrule.`);
      if (row.status === "approved" || row.status === "failed") {
        if (!approve) throw new ApprovalError(409, row.status === "approved" ? "That change already happened; undo it by hand if needed." : "That change already failed.");
        if (row.status === "approved") throw new ApprovalError(409, "That change already happened.");
      }
      if (row.status === "denied" && !approve) throw new ApprovalError(409, "It's already denied.");
      overrule = true;
    }
    // Claim it first: two parents tapping Approve at once must not run it twice.
    const claimed = Number(this.db.prepare("UPDATE requests SET status = ? WHERE id = ? AND status = ?").run(approve ? "running" : "denied", id, row.status).changes) === 1;
    if (!claimed) throw new ApprovalError(409, "Someone else has just decided this one.");
    if (!approve) {
      this.db.prepare("UPDATE requests SET status = 'denied', decided_by = ?, decided_at = ?, overruled = ? WHERE id = ?").run(me.id, this.now(), overrule ? 1 : 0, id);
      const text = `Denied by ${me.name}: ${row.summary}.`;
      const r = this.row(id); if (r) this.emit({ kind: "decided", request: r, channel: row.channel, device_id: row.device_id, text });
      return { ok: true, status: "denied" as const, text: `Denied: ${row.summary}.` };
    }
    // Run it as the household asked for it: the household's tools and tokens.
    const asker: Caller = { scope: { kind: "household" }, channel: row.channel as Channel, deviceId: row.device_id ?? undefined, label: row.requested_by };
    const set = await this.registry.toolsFor(asker);
    const t = set.tools.find((x) => x.name === row.tool);
    let ok = false, result: string;
    if (!t) result = "That action isn't available to the household view any more.";
    else {
      try { const out: any = await t.run(JSON.parse(row.args)); ok = !(out && typeof out === "object" && "error" in out); result = ok ? "done" : String(out.error); }
      catch (e: any) { result = e.message; }
    }
    this.db.prepare("UPDATE requests SET status = ?, decided_by = ?, decided_at = ?, result = ?, overruled = ? WHERE id = ?").run(ok ? "approved" : "failed", me.id, this.now(), result, overrule ? 1 : 0, id);
    // The action log, like every other change: who asked, who approved.
    this.db.prepare("INSERT INTO audit (at, who, channel, tool, summary, ok) VALUES (?, ?, ?, ?, ?, ?)").run(this.now(), `${row.requested_by} (approved by ${me.id})`, row.channel, row.tool, `${row.args}`.slice(0, 500), ok ? 1 : 0);
    const r = this.row(id);
    if (r) this.emit({ kind: "decided", request: r, channel: row.channel, device_id: row.device_id, text: ok ? `Approved by ${me.name}: ${row.summary}.` : `${me.name} approved "${row.summary}", but it didn't work: ${result}` });
    return { ok, status: ok ? ("approved" as const) : ("failed" as const), text: ok ? `Approved and done: ${row.summary}.` : `Approved, but it didn't work: ${result}` };
  }
}
