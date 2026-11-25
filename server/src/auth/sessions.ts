import type { Config, Person } from "../config.js";
import type { Db } from "../db.js";
import { hashSecret, newPairCode, newToken, sha256, validPassword, validPin, verifySecret } from "../secrets.js";
import { personById, type Caller } from "../scope.js";
import type { Presence } from "./presence.js";

export class AuthError extends Error { constructor(public status: number, message: string) { super(message); } }

const MAX_FAILURES = 5, LOCK_MS = 5 * 60_000;

/** The "home hub" model: a paired screen shows the household view to anyone;
 *  a person signs in on it (PIN, password, Face ID passkey, or a recognized
 *  face) and gets their own view until they walk away or tap Sign out.
 *  On their own phone a person signs in with a password or passkey. */
export class Auth {
  constructor(private db: Db, private cfg: () => Config, private presence?: Presence, private now: () => number = Date.now) {}

  // ---------- secrets ----------
  methods(personId: string) {
    const row = this.db.prepare("SELECT pin_hash, password_hash FROM person_auth WHERE person_id = ?").get(personId) as any;
    const passkeys = (this.db.prepare("SELECT COUNT(*) AS n FROM passkeys WHERE person_id = ?").get(personId) as any).n as number;
    return { pin: !!row?.pin_hash, password: !!row?.password_hash, passkey: passkeys > 0 };
  }
  setPin(personId: string, pin: string) {
    if (!validPin(pin)) throw new AuthError(400, "A PIN is 4 to 8 digits.");
    this.upsert(personId, "pin_hash", hashSecret(pin));
  }
  setPassword(personId: string, pw: string) {
    if (!validPassword(pw)) throw new AuthError(400, "A password is at least 8 characters.");
    this.upsert(personId, "password_hash", hashSecret(pw));
  }
  private upsert(personId: string, col: "pin_hash" | "password_hash", value: string) {
    this.db.prepare(`INSERT INTO person_auth (person_id, ${col}) VALUES (?, ?) ON CONFLICT(person_id) DO UPDATE SET ${col} = excluded.${col}, failures = 0, locked_until = 0`).run(personId, value);
  }

  /** Check a PIN or password, with a lockout after repeated misses. */
  check(person: Person, kind: "pin" | "password", secret: string) {
    const row = this.db.prepare("SELECT pin_hash, password_hash, failures, locked_until FROM person_auth WHERE person_id = ?").get(person.id) as any;
    const stored = kind === "pin" ? row?.pin_hash : row?.password_hash;
    if (!stored) throw new AuthError(400, kind === "pin" ? `${person.name} has no PIN yet.` : `${person.name} has no password yet.`);
    if (row.locked_until > this.now()) throw new AuthError(429, `Too many wrong tries. Try again in ${Math.ceil((row.locked_until - this.now()) / 60000)} min.`);
    if (verifySecret(String(secret ?? ""), stored)) { this.clearFailures(person.id); return; }
    const failures = row.failures + 1, lock = failures >= MAX_FAILURES ? this.now() + LOCK_MS : 0;
    this.db.prepare("UPDATE person_auth SET failures = ?, locked_until = ? WHERE person_id = ?").run(lock ? 0 : failures, lock, person.id);
    throw new AuthError(401, lock ? "Too many wrong tries. Locked for 5 minutes." : kind === "pin" ? "Wrong PIN." : "Wrong password.");
  }
  clearFailures(personId: string) { this.db.prepare("UPDATE person_auth SET failures = 0, locked_until = 0 WHERE person_id = ?").run(personId); }

  // ---------- paired screens (hubs) ----------
  /** A one-time code that pairs a screen as the given hub device (10 minutes). */
  pairCode(deviceId: string) {
    const dev = this.cfg().hub.devices.find((d) => d.id === deviceId);
    if (!dev && !/^[a-z0-9][a-z0-9_-]{0,31}$/.test(deviceId)) throw new AuthError(400, "Device ids are lowercase letters, digits, - or _.");
    this.db.prepare("DELETE FROM pair_codes WHERE expires_at < ?").run(this.now());
    const code = newPairCode();
    this.db.prepare("INSERT OR REPLACE INTO pair_codes (code_hash, device_id, expires_at) VALUES (?, ?, ?)").run(sha256(code), deviceId, this.now() + 10 * 60_000);
    return code;
  }
  pair(code: string) {
    const row = this.db.prepare("SELECT device_id, expires_at FROM pair_codes WHERE code_hash = ?").get(sha256(String(code || "").trim())) as any;
    if (!row || row.expires_at < this.now()) throw new AuthError(401, "That pairing code is wrong or expired. Make a new one with `faith pair <device>`.");
    this.db.prepare("DELETE FROM pair_codes WHERE code_hash = ?").run(sha256(String(code).trim()));
    const token = newToken("fdev_");
    const name = this.cfg().hub.devices.find((d) => d.id === row.device_id)?.name || row.device_id;
    this.db.prepare("DELETE FROM devices WHERE id = ?").run(row.device_id); // re-pairing replaces the old screen
    this.db.prepare("DELETE FROM sessions WHERE device_id = ?").run(row.device_id);
    this.db.prepare("INSERT INTO devices (id, name, token_hash, created_at, last_seen) VALUES (?, ?, ?, ?, ?)").run(row.device_id, name, sha256(token), this.now(), this.now());
    return { token, device: { id: row.device_id as string, name } };
  }
  device(token: string | undefined) {
    if (!token) return undefined;
    const row = this.db.prepare("SELECT id, name FROM devices WHERE token_hash = ?").get(sha256(token)) as any;
    if (!row) return undefined;
    this.db.prepare("UPDATE devices SET last_seen = ? WHERE id = ?").run(this.now(), row.id);
    return { id: row.id as string, name: row.name as string };
  }
  unpair(deviceId: string) {
    this.db.prepare("DELETE FROM sessions WHERE device_id = ?").run(deviceId);
    this.db.prepare("DELETE FROM devices WHERE id = ?").run(deviceId);
  }
  devices() { return this.db.prepare("SELECT id, name, created_at, last_seen FROM devices ORDER BY id").all() as any[]; }

  // ---------- sessions ----------
  /** Sign a person in. On a hub this replaces whoever was signed in there. */
  startSession(person: Person, deviceId?: string) {
    const c = this.cfg(), now = this.now();
    if (deviceId) this.db.prepare("DELETE FROM sessions WHERE device_id = ?").run(deviceId);
    const token = newToken("fses_");
    const expires = deviceId ? now + c.hub.max_hours * 3600_000 : now + c.personal.max_days * 86400_000;
    this.db.prepare("INSERT INTO sessions (token_hash, person_id, device_id, kind, created_at, last_activity, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(sha256(token), person.id, deviceId ?? null, deviceId ? "hub" : "personal", now, now, expires);
    this.clearFailures(person.id);
    return token;
  }
  endSession(token: string | undefined) { if (token) this.db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(sha256(token)); }
  endPerson(personId: string) { this.db.prepare("DELETE FROM sessions WHERE person_id = ?").run(personId); }

  /** Count a tap, keypress or message as activity (keeps a hub session alive). */
  touch(sessionHash: string | undefined) { if (sessionHash) this.db.prepare("UPDATE sessions SET last_activity = ? WHERE token_hash = ?").run(this.now(), sessionHash); }

  /** Why a hub session would end now, or null if it's still good. */
  hubExpiry(row: { device_id: string; last_activity: number; expires_at: number }): string | null {
    const c = this.cfg().hub, now = this.now(), idle = (now - row.last_activity) / 1000;
    if (now >= row.expires_at) return "time limit";
    const devId = row.device_id.replace(/^ha:/, ""); // a Home Assistant screen uses its hub device's sensors
    const dev = c.devices.find((d) => d.id === devId);
    const p = dev?.presence_entity ? this.presence?.state(devId) : undefined;
    if (p && p.present !== null) {
      // With a camera or presence sensor: sign out once nobody has been there,
      // and nobody has touched the screen, for away_seconds (or after a hard cap).
      if (idle >= c.max_idle_seconds) return "idle";
      if (!p.present && (now - p.since) / 1000 >= c.away_seconds && idle >= c.away_seconds) return "nobody there";
      return null;
    }
    return idle >= c.idle_seconds ? "idle" : null;
  }

  /** Remaining seconds before a hub session ends by idling (for the screen's countdown). */
  remaining(row: { device_id: string | null; kind: string; last_activity: number; expires_at: number }) {
    const now = this.now();
    if (row.kind !== "hub") return Math.round((Math.min(row.expires_at, row.last_activity + this.cfg().personal.idle_days * 86400_000) - now) / 1000);
    const devId = String(row.device_id).replace(/^ha:/, "");
    const c = this.cfg().hub, dev = c.devices.find((d) => d.id === devId);
    const limit = dev?.presence_entity && this.presence?.state(devId)?.present ? c.max_idle_seconds : dev?.presence_entity ? Math.max(c.away_seconds, 0) : c.idle_seconds;
    return Math.max(0, Math.round(limit - (now - row.last_activity) / 1000));
  }

  /** Resolve cookies / bearer into a caller. Expired sessions are removed here. */
  resolve(opts: { sessionToken?: string; deviceToken?: string; bearer?: string }): (Caller & { session?: any; device?: { id: string; name: string }; apiKind?: string }) | null {
    const cfg = this.cfg();
    if (opts.bearer) {
      const row = this.db.prepare("SELECT name, kind, person_id FROM api_tokens WHERE token_hash = ?").get(sha256(opts.bearer)) as any;
      if (!row) return null;
      this.db.prepare("UPDATE api_tokens SET last_used = ? WHERE name = ?").run(this.now(), row.name);
      const person = personById(cfg, row.person_id);
      if (row.kind === "person" && !person) return null; // the person was removed from the config
      if (row.kind === "omi") return null; // an Omi webhook token opens only its webhook (Omi keeps it in plain text)
      return { scope: person ? { kind: "person", person } : { kind: "household" }, channel: row.kind === "ha" ? "voice" : "api", label: `token:${row.name}`, apiKind: row.kind };
    }
    const device = this.device(opts.deviceToken);
    if (opts.sessionToken) {
      const hash = sha256(opts.sessionToken);
      const row = this.db.prepare("SELECT * FROM sessions WHERE token_hash = ?").get(hash) as any;
      if (row) {
        const person = personById(cfg, row.person_id);
        let gone: string | null = person ? null : "removed";
        if (!gone && row.kind === "hub") gone = row.device_id !== device?.id ? "other screen" : this.hubExpiry(row);
        if (!gone && row.kind === "personal" && (this.now() >= row.expires_at || this.now() - row.last_activity >= cfg.personal.idle_days * 86400_000)) gone = "expired";
        if (gone) this.db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hash);
        else {
          if (row.kind === "personal") this.touch(hash); // a phone or laptop: any use keeps it
          return { scope: { kind: "person", person: person! }, channel: row.kind === "hub" ? "hub" : "personal", deviceId: device?.id, sessionHash: hash, session: row, device,
            label: `${person!.id}${device ? " on " + device.id : ""}` };
        }
      }
    }
    if (device) return { scope: { kind: "household" }, channel: "hub", deviceId: device.id, device, label: `household on ${device.id}` };
    return null;
  }

  /** A person signed in on a Home Assistant screen (the FAITH card's PIN pad).
   *  The card keeps the session token; it only works for that screen. */
  haHub(token: string | undefined, screen: string) {
    if (!token) return undefined;
    const hash = sha256(token);
    const row = this.db.prepare("SELECT * FROM sessions WHERE token_hash = ? AND kind = 'hub'").get(hash) as any;
    if (!row || row.device_id !== `ha:${screen}`) return undefined;
    const person = personById(this.cfg(), row.person_id);
    if (!person || this.hubExpiry(row)) { this.db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hash); return undefined; }
    return { person, hash, row };
  }

  /** End hub sessions that have expired (run every few seconds so a screen locks
   *  even when nobody is polling it). Returns the device ids that were signed out. */
  sweep() {
    const rows = this.db.prepare("SELECT * FROM sessions WHERE kind = 'hub'").all() as any[];
    const out: string[] = [];
    for (const r of rows) if (this.hubExpiry(r)) { this.db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(r.token_hash); out.push(r.device_id); }
    return out;
  }

  // ---------- API tokens (Home Assistant, Omi, scripts) ----------
  addToken(kind: "household" | "person" | "ha" | "omi", name: string, personId?: string) {
    if (!/^[a-z0-9][a-z0-9_.-]{0,40}$/.test(name)) throw new AuthError(400, "Token names are lowercase letters, digits, ., - or _.");
    if ((kind === "person" || kind === "omi") && !personById(this.cfg(), personId)) throw new AuthError(400, `No person "${personId}" in the config.`);
    if (kind === "omi" && personById(this.cfg(), personId)!.role === "child") throw new AuthError(400, "Omi suggestions are for grown-ups: a child's recordings don't go to FAITH.");
    if (this.db.prepare("SELECT 1 FROM api_tokens WHERE name = ?").get(name)) throw new AuthError(409, `A token named ${name} exists. Revoke it first.`);
    const token = newToken(kind === "ha" ? "fha_" : kind === "omi" ? "fomi_" : "faith_");
    this.db.prepare("INSERT INTO api_tokens (name, token_hash, kind, person_id, created_at) VALUES (?, ?, ?, ?, ?)").run(name, sha256(token), kind, kind === "person" || kind === "omi" ? personId! : null, this.now());
    return token;
  }
  /** The person behind an Omi webhook token (only that kind), or null. */
  omiPerson(token: string) {
    const row = this.db.prepare("SELECT name, person_id FROM api_tokens WHERE token_hash = ? AND kind = 'omi'").get(sha256(String(token || ""))) as any;
    if (!row) return null;
    this.db.prepare("UPDATE api_tokens SET last_used = ? WHERE name = ?").run(this.now(), row.name);
    return personById(this.cfg(), row.person_id) ?? null;
  }
  tokens() { return this.db.prepare("SELECT name, kind, person_id, created_at, last_used FROM api_tokens ORDER BY name").all() as any[]; }
  revokeToken(name: string) { return Number(this.db.prepare("DELETE FROM api_tokens WHERE name = ?").run(name).changes) > 0; }
}
