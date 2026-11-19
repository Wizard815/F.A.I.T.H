import { envValue, type Config, type Person } from "./config.js";
import type { Db } from "./db.js";
import { newId } from "./secrets.js";

export class RewardsError extends Error { constructor(public status: number, message: string) { super(message); } }

export type Activity = { id: string; name: string; points: number; kids_can_claim: boolean; active: boolean };
export type Reward = { id: string; name: string; cost: number; kind: "points" | "money"; amount: number | null; active: boolean };
export type Payout = { id: string; person_id: string; amount: number; reason: string; status: "owed" | "paid" | "failed"; provider: string; note: string | null; at: number; ref: string | null; by: string | null };

/** Paying a money reward. "manual" records what's owed, and a parent marks it
 *  paid. "firefly" records a transfer in Firefly III from the parents' account
 *  to the child's card account (people[].firefly_account). */
export type PayResult = { status: "owed" | "paid" | "failed"; note: string; ref?: string };
export interface PayoutProvider {
  name: string;
  pay(person: Person, amount: number, reason: string, payoutId: string, by: string): Promise<PayResult>;
  /** The child's card balance, where the provider knows it. */
  balance?(person: Person): Promise<{ amount: number; currency: string } | undefined>;
}

export class ManualPayout implements PayoutProvider {
  name = "manual";
  async pay() { return { status: "owed" as const, note: "Recorded. Pay it yourself, then mark it paid in FAITH's admin page." }; }
}

type FfAccount = { id: string; name: string; balance: number; currency: string };

/** The kid's card, kept in Firefly III: each approved money reward becomes a
 *  transfer from the parents' account (rewards.firefly.from_account) to the
 *  child's (people[].firefly_account), tagged "faith". An id or an exact
 *  account name works for both. A retry first looks for the transfer by its
 *  external id, so a reward is never recorded twice. */
export class FireflyPayout implements PayoutProvider {
  name = "firefly";
  private cache?: { at: number; accounts: FfAccount[] };
  constructor(private cfg: () => Config, private env: NodeJS.ProcessEnv = process.env) {}
  private get ff() { return this.cfg().rewards.firefly; }

  private async api(method: string, path: string, body?: unknown): Promise<any> {
    const ff = this.ff!, token = envValue(ff.token_env, this.env);
    if (!token) throw new RewardsError(503, `Firefly needs a personal access token in ${ff.token_env}.`);
    let r: Response;
    try {
      r = await fetch(`${ff.url.replace(/\/+$/, "")}/api/v1${path}`, { method, signal: AbortSignal.timeout(20_000),
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.api+json", "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch (e: any) { throw new RewardsError(502, `Couldn't reach Firefly (${e?.cause?.code || e?.message}).`); }
    const text = await r.text(); let data: any = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!r.ok) throw new RewardsError(502, `Firefly answered ${r.status}: ${data?.message || String(text).slice(0, 160)}`);
    return data;
  }
  private async accounts(fresh = false): Promise<FfAccount[]> {
    if (!fresh && this.cache && Date.now() - this.cache.at < 60_000) return this.cache.accounts;
    const out: FfAccount[] = [];
    for (let page = 1; page <= 10; page++) {
      const d = await this.api("GET", `/accounts?type=asset&limit=100&page=${page}`);
      for (const a of d?.data ?? []) out.push({ id: String(a.id), name: String(a.attributes?.name ?? ""), balance: Number(a.attributes?.current_balance ?? 0), currency: String(a.attributes?.currency_code ?? "") });
      if (page >= Number(d?.meta?.pagination?.total_pages ?? 1)) break;
    }
    this.cache = { at: Date.now(), accounts: out };
    return out;
  }
  private async account(key: string, fresh = false) {
    const k = key.trim(), list = await this.accounts(fresh);
    return list.find((a) => a.id === k) ?? list.find((a) => a.name.toLowerCase() === k.toLowerCase());
  }

  async pay(person: Person, amount: number, reason: string, payoutId: string, by: string): Promise<PayResult> {
    const ff = this.ff;
    if (!ff) return { status: "owed", note: "rewards.firefly isn't set up in faith.yaml; recorded as owed." };
    if (!person.firefly_account) return { status: "owed", note: `${person.name} has no firefly_account in faith.yaml; recorded as owed.` };
    try {
      const external = `faith-payout-${payoutId}`;
      const found = await this.api("GET", `/search/transactions?query=${encodeURIComponent(`external_id_is:"${external}"`)}&limit=1`);
      if (found?.data?.length) return { status: "paid", ref: String(found.data[0].id), note: `Already in Firefly (transaction ${found.data[0].id}).` };
      const from = await this.account(ff.from_account), to = await this.account(person.firefly_account);
      if (!from) return { status: "failed", note: `Firefly has no asset account "${ff.from_account}" (rewards.firefly.from_account).` };
      if (!to) return { status: "failed", note: `Firefly has no asset account "${person.firefly_account}" (${person.id}'s firefly_account).` };
      const d = await this.api("POST", "/transactions", {
        error_if_duplicate_hash: false, apply_rules: true, fire_webhooks: true,
        transactions: [{ type: "transfer", date: new Date().toISOString(), amount: amount.toFixed(2), description: reason,
          source_id: from.id, destination_id: to.id, tags: ["faith", "kid-reward"], external_id: external, notes: `Approved in FAITH by ${by}.` }],
      });
      this.cache = undefined; // balances changed
      return { status: "paid", ref: String(d?.data?.id ?? ""), note: `Recorded in Firefly: ${amount.toFixed(2)} from ${from.name} to ${to.name}${d?.data?.id ? ` (transaction ${d.data.id})` : ""}.` };
    } catch (e: any) {
      return { status: "failed", note: `${e.message} Nothing was recorded; retry from the admin page.` };
    }
  }

  async balance(person: Person) {
    if (!this.ff || !person.firefly_account) return undefined;
    const a = await this.account(person.firefly_account).catch(() => undefined);
    return a ? { amount: a.balance, currency: a.currency } : undefined;
  }
}

/** Points for jobs done, and rewards to spend them on. Points come in steps
 *  (0.5, 1, 2 by default). Children claim; a parent approves (through the
 *  approvals queue). Parents can also give points directly. */
export class Rewards {
  payout: PayoutProvider;
  constructor(private db: Db, private cfg: () => Config, now: () => number = Date.now, env: NodeJS.ProcessEnv = process.env) {
    this.now = now;
    db.exec(`
      CREATE TABLE IF NOT EXISTS reward_activities (id TEXT PRIMARY KEY, name TEXT NOT NULL, points REAL NOT NULL, kids_can_claim INTEGER NOT NULL DEFAULT 1, active INTEGER NOT NULL DEFAULT 1);
      CREATE TABLE IF NOT EXISTS reward_catalog (id TEXT PRIMARY KEY, name TEXT NOT NULL, cost REAL NOT NULL, kind TEXT NOT NULL DEFAULT 'points', amount REAL, active INTEGER NOT NULL DEFAULT 1);
      CREATE TABLE IF NOT EXISTS points_ledger (id INTEGER PRIMARY KEY AUTOINCREMENT, person_id TEXT NOT NULL, delta REAL NOT NULL, reason TEXT NOT NULL, by TEXT NOT NULL, at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS payouts (id TEXT PRIMARY KEY, person_id TEXT NOT NULL, amount REAL NOT NULL, reason TEXT NOT NULL, status TEXT NOT NULL, provider TEXT NOT NULL, note TEXT, at INTEGER NOT NULL);`);
    for (const col of ["ref TEXT", "by TEXT"]) { try { db.exec(`ALTER TABLE payouts ADD COLUMN ${col}`); } catch { /* already there */ } }
    this.payout = cfg().rewards.payout === "firefly" ? new FireflyPayout(cfg, env) : new ManualPayout();
  }
  private now: () => number;

  private validPoints(n: number) {
    const allowed = this.cfg().rewards.allowed_points;
    if (!allowed.includes(n)) throw new RewardsError(400, `Points come in ${allowed.join(", ")}.`);
  }
  private person(id: string) {
    const p = this.cfg().people.find((x) => x.id === id);
    if (!p) throw new RewardsError(404, `No one called ${id}.`);
    return p;
  }
  /** Match a name loosely ("dishes" finds "Do the dishes"). */
  private find<T extends { id: string; name: string }>(list: T[], key: string, what: string) {
    const k = key.trim().toLowerCase();
    const hit = list.find((x) => x.id === key) ?? list.find((x) => x.name.toLowerCase() === k) ?? (list.filter((x) => x.name.toLowerCase().includes(k)).length === 1 ? list.find((x) => x.name.toLowerCase().includes(k)) : undefined);
    if (!hit) throw new RewardsError(404, `No ${what} called "${key}". There are: ${list.map((x) => x.name).join(", ") || "none yet"}.`);
    return hit;
  }

  // ---- the catalogue (admin) ----
  activities(all = false): Activity[] {
    return (this.db.prepare(`SELECT * FROM reward_activities ${all ? "" : "WHERE active = 1"} ORDER BY points, name`).all() as any[]).map((r) => ({ ...r, kids_can_claim: !!r.kids_can_claim, active: !!r.active }));
  }
  rewards(all = false): Reward[] {
    return (this.db.prepare(`SELECT * FROM reward_catalog ${all ? "" : "WHERE active = 1"} ORDER BY cost, name`).all() as any[]).map((r) => ({ ...r, active: !!r.active }));
  }
  saveActivity(a: { id?: string; name: string; points: number; kids_can_claim?: boolean; active?: boolean }) {
    if (!a.name?.trim()) throw new RewardsError(400, "An activity needs a name.");
    this.validPoints(Number(a.points));
    const id = a.id || newId();
    this.db.prepare("INSERT OR REPLACE INTO reward_activities (id, name, points, kids_can_claim, active) VALUES (?, ?, ?, ?, ?)").run(id, a.name.trim(), Number(a.points), a.kids_can_claim === false ? 0 : 1, a.active === false ? 0 : 1);
    return this.activities(true).find((x) => x.id === id)!;
  }
  saveReward(r: { id?: string; name: string; cost: number; kind?: "points" | "money"; amount?: number | null; active?: boolean }) {
    if (!r.name?.trim()) throw new RewardsError(400, "A reward needs a name.");
    if (!(Number(r.cost) > 0)) throw new RewardsError(400, "A reward costs more than 0 points.");
    const kind = r.kind === "money" ? "money" : "points";
    if (kind === "money" && !(Number(r.amount) > 0)) throw new RewardsError(400, "A money reward needs an amount.");
    const id = r.id || newId();
    this.db.prepare("INSERT OR REPLACE INTO reward_catalog (id, name, cost, kind, amount, active) VALUES (?, ?, ?, ?, ?, ?)").run(id, r.name.trim(), Number(r.cost), kind, kind === "money" ? Number(r.amount) : null, r.active === false ? 0 : 1);
    return this.rewards(true).find((x) => x.id === id)!;
  }

  // ---- points ----
  balance(personId: string) { return Number((this.db.prepare("SELECT COALESCE(SUM(delta), 0) AS n FROM points_ledger WHERE person_id = ?").get(personId) as any).n); }
  balances() { return this.cfg().people.map((p) => ({ person: p.id, name: p.name, role: p.role, points: this.balance(p.id) })); }
  history(personId?: string, limit = 30) {
    return (personId ? this.db.prepare("SELECT * FROM points_ledger WHERE person_id = ? ORDER BY id DESC LIMIT ?").all(personId, limit) : this.db.prepare("SELECT * FROM points_ledger ORDER BY id DESC LIMIT ?").all(limit)) as any[];
  }
  /** Give points (a parent, or an approved claim). */
  award(personId: string, opts: { activity?: string; points?: number; reason?: string }, by: string) {
    const p = this.person(personId);
    let points = Number(opts.points), reason = String(opts.reason || "").trim();
    if (opts.activity) { const a = this.find(this.activities(), opts.activity, "activity"); points = a.points; reason ||= a.name; }
    this.validPoints(points);
    if (!reason) throw new RewardsError(400, "Say what the points are for.");
    this.db.prepare("INSERT INTO points_ledger (person_id, delta, reason, by, at) VALUES (?, ?, ?, ?, ?)").run(p.id, points, reason, by, this.now());
    return { person: p.id, name: p.name, points, reason, balance: this.balance(p.id) };
  }
  /** Spend points on a reward. Money rewards go to the payout provider. */
  async grant(personId: string, rewardKey: string, by: string) {
    const p = this.person(personId), r = this.find(this.rewards(), rewardKey, "reward");
    const have = this.balance(p.id);
    if (have < r.cost) throw new RewardsError(409, `${p.name} has ${have} points; ${r.name} needs ${r.cost}.`);
    this.db.prepare("INSERT INTO points_ledger (person_id, delta, reason, by, at) VALUES (?, ?, ?, ?, ?)").run(p.id, -r.cost, `Reward: ${r.name}`, by, this.now());
    let payout: Payout | undefined;
    if (r.kind === "money" && r.amount) {
      // Write it down first, so a crash mid-payment still leaves it on the books as owed.
      const id = newId();
      this.db.prepare("INSERT INTO payouts (id, person_id, amount, reason, status, provider, note, at, by) VALUES (?, ?, ?, ?, 'owed', ?, ?, ?, ?)").run(id, p.id, r.amount, r.name, this.payout.name, "Paying…", this.now(), by);
      payout = await this.pay(id);
    }
    return { person: p.id, name: p.name, reward: r.name, cost: r.cost, balance: this.balance(p.id), payout };
  }
  payouts(status?: string): Payout[] { return (status ? this.db.prepare("SELECT * FROM payouts WHERE status = ? ORDER BY at DESC").all(status) : this.db.prepare("SELECT * FROM payouts ORDER BY at DESC LIMIT 100").all()) as any[]; }
  markPaid(id: string) { if (!Number(this.db.prepare("UPDATE payouts SET status = 'paid', note = 'Marked paid by hand.' WHERE id = ? AND status IN ('owed', 'failed')").run(id).changes)) throw new RewardsError(404, "No payout owed with that id."); }
  /** Send a payout to the provider (again, after a failure or once Firefly is set up). */
  async pay(id: string) {
    const row = this.payouts().find((x) => x.id === id);
    if (!row) throw new RewardsError(404, "No payout with that id.");
    if (row.status === "paid") throw new RewardsError(409, "That one is already paid.");
    const res = await this.payout.pay(this.person(row.person_id), row.amount, `FAITH reward: ${row.reason}`, id, row.by || "a parent");
    this.db.prepare("UPDATE payouts SET status = ?, note = ?, ref = ?, provider = ? WHERE id = ?").run(res.status, res.note, res.ref ?? null, this.payout.name, id);
    return this.payouts().find((x) => x.id === id)!;
  }
  /** The kid's card balance (Firefly), if there is one. */
  async card(personId: string) { const p = this.cfg().people.find((x) => x.id === personId); return p && this.payout.balance ? this.payout.balance(p).catch(() => undefined) : undefined; }

  /** Seed a starter catalogue the first time (the admin page edits it after). */
  seed() {
    if (this.activities(true).length || this.rewards(true).length) return;
    for (const [name, points] of [["Make your bed", 0.5], ["Put toys away", 0.5], ["Do the dishes", 1], ["Feed the pet", 1], ["Help with dinner", 1], ["Clean your room", 2], ["Help in the yard", 2]] as const) this.saveActivity({ name, points });
    for (const [name, cost] of [["Pick the movie", 3], ["30 minutes extra screen time", 5], ["Choose dinner", 8], ["Trip for ice cream", 12]] as const) this.saveReward({ name, cost });
  }
}
