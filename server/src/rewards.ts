import type { Config, Person } from "./config.js";
import type { Db } from "./db.js";
import { newId } from "./secrets.js";

export class RewardsError extends Error { constructor(public status: number, message: string) { super(message); } }

export type Activity = { id: string; name: string; points: number; kids_can_claim: boolean; active: boolean };
export type Reward = { id: string; name: string; cost: number; kind: "points" | "money"; amount: number | null; active: boolean };
export type Payout = { id: string; person_id: string; amount: number; reason: string; status: "owed" | "paid" | "failed"; provider: string; note: string | null; at: number };

/** Paying a money reward. Today: "manual" records what's owed, and a parent
 *  marks it paid. Later: "firefly" moves the money into the child's account
 *  (their debit card) through Firefly III / the Plaid-Firefly connector. */
export interface PayoutProvider { name: string; pay(person: Person, amount: number, reason: string): Promise<{ status: "owed" | "paid" | "failed"; note: string }> }

export class ManualPayout implements PayoutProvider {
  name = "manual";
  async pay() { return { status: "owed" as const, note: "Recorded. Pay it yourself, then mark it paid in FAITH's admin page." }; }
}

/** Placeholder for the kid's card: a transfer in Firefly III from the parents'
 *  account to the child's (people[].firefly_account). Not wired up yet: it
 *  records the payout as owed and says so, so nothing is lost meanwhile. */
export class FireflyPayout implements PayoutProvider {
  name = "firefly";
  constructor(private cfg: NonNullable<Config["rewards"]["firefly"]> | undefined) {}
  async pay(person: Person, amount: number, reason: string) {
    // TODO(kid card): POST {url}/api/v1/transactions { type: "transfer", source_id: from_account,
    //   destination_id: <the child's account>, amount, description: reason } with the token in token_env,
    //   then return { status: "paid" }. Until then nothing moves.
    void person; void amount; void reason;
    return { status: "owed" as const, note: this.cfg ? "Paying into the card isn't switched on yet; recorded as owed." : "rewards.firefly isn't set up; recorded as owed." };
  }
}

/** Points for jobs done, and rewards to spend them on. Points come in steps
 *  (0.5, 1, 2 by default). Children claim; a parent approves (through the
 *  approvals queue). Parents can also give points directly. */
export class Rewards {
  payout: PayoutProvider;
  constructor(private db: Db, private cfg: () => Config, now: () => number = Date.now) {
    this.now = now;
    db.exec(`
      CREATE TABLE IF NOT EXISTS reward_activities (id TEXT PRIMARY KEY, name TEXT NOT NULL, points REAL NOT NULL, kids_can_claim INTEGER NOT NULL DEFAULT 1, active INTEGER NOT NULL DEFAULT 1);
      CREATE TABLE IF NOT EXISTS reward_catalog (id TEXT PRIMARY KEY, name TEXT NOT NULL, cost REAL NOT NULL, kind TEXT NOT NULL DEFAULT 'points', amount REAL, active INTEGER NOT NULL DEFAULT 1);
      CREATE TABLE IF NOT EXISTS points_ledger (id INTEGER PRIMARY KEY AUTOINCREMENT, person_id TEXT NOT NULL, delta REAL NOT NULL, reason TEXT NOT NULL, by TEXT NOT NULL, at INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS payouts (id TEXT PRIMARY KEY, person_id TEXT NOT NULL, amount REAL NOT NULL, reason TEXT NOT NULL, status TEXT NOT NULL, provider TEXT NOT NULL, note TEXT, at INTEGER NOT NULL);`);
    this.payout = cfg().rewards.payout === "firefly" ? new FireflyPayout(cfg().rewards.firefly) : new ManualPayout();
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
      const res = await this.payout.pay(p, r.amount, `FAITH reward: ${r.name}`);
      const id = newId();
      this.db.prepare("INSERT INTO payouts (id, person_id, amount, reason, status, provider, note, at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(id, p.id, r.amount, r.name, res.status, this.payout.name, res.note, this.now());
      payout = this.payouts().find((x) => x.id === id);
    }
    return { person: p.id, name: p.name, reward: r.name, cost: r.cost, balance: this.balance(p.id), payout };
  }
  payouts(status?: string): Payout[] { return (status ? this.db.prepare("SELECT * FROM payouts WHERE status = ? ORDER BY at DESC").all(status) : this.db.prepare("SELECT * FROM payouts ORDER BY at DESC LIMIT 100").all()) as any[]; }
  markPaid(id: string) { if (!Number(this.db.prepare("UPDATE payouts SET status = 'paid' WHERE id = ? AND status = 'owed'").run(id).changes)) throw new RewardsError(404, "No payout owed with that id."); }

  /** Seed a starter catalogue the first time (the admin page edits it after). */
  seed() {
    if (this.activities(true).length || this.rewards(true).length) return;
    for (const [name, points] of [["Make your bed", 0.5], ["Put toys away", 0.5], ["Do the dishes", 1], ["Feed the pet", 1], ["Help with dinner", 1], ["Clean your room", 2], ["Help in the yard", 2]] as const) this.saveActivity({ name, points });
    for (const [name, cost] of [["Pick the movie", 3], ["30 minutes extra screen time", 5], ["Choose dinner", 8], ["Trip for ice cream", 12]] as const) this.saveReward({ name, cost });
  }
}
