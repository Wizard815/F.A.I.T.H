import { generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse } from "@simplewebauthn/server";
import type { Config, Person } from "../config.js";
import type { Db } from "../db.js";
import { newId } from "../secrets.js";
import { AuthError } from "./sessions.js";

/** Passkeys: Face ID / Touch ID on iPhone and iPad, Windows Hello, Android
 *  fingerprint. Browsers only allow them on https (or localhost), so set
 *  public_url to the https address the family uses (see docs/hub.md). */
export class Passkeys {
  constructor(private db: Db, private cfg: () => Config) {}

  rp(originHeader?: string) {
    const url = this.cfg().public_url || originHeader;
    if (!url) throw new AuthError(400, "Face ID needs FAITH's https address: set public_url in faith.yaml.");
    const u = new URL(url);
    if (u.protocol !== "https:" && u.hostname !== "localhost") throw new AuthError(400, "Face ID only works over https. Put FAITH behind your reverse proxy and set public_url.");
    return { rpID: u.hostname, origin: u.origin };
  }
  private creds(personId: string) {
    return (this.db.prepare("SELECT id, public_key, counter, transports FROM passkeys WHERE person_id = ?").all(personId) as any[])
      .map((r) => ({ id: r.id as string, publicKey: new Uint8Array(r.public_key), counter: Number(r.counter), transports: r.transports ? JSON.parse(r.transports) : undefined }));
  }
  private challenge(personId: string, kind: "reg" | "auth", challenge: string) {
    this.db.prepare("DELETE FROM challenges WHERE expires_at < ? OR (person_id = ? AND kind = ?)").run(Date.now(), personId, kind);
    this.db.prepare("INSERT INTO challenges (id, person_id, challenge, kind, expires_at) VALUES (?, ?, ?, ?, ?)").run(newId(), personId, challenge, kind, Date.now() + 5 * 60_000);
  }
  private takeChallenge(personId: string, kind: "reg" | "auth") {
    const row = this.db.prepare("SELECT id, challenge FROM challenges WHERE person_id = ? AND kind = ? AND expires_at >= ?").get(personId, kind, Date.now()) as any;
    if (!row) throw new AuthError(400, "That took too long. Try again.");
    this.db.prepare("DELETE FROM challenges WHERE id = ?").run(row.id);
    return row.challenge as string;
  }

  async registerStart(person: Person, origin?: string) {
    const { rpID } = this.rp(origin);
    const opts = await generateRegistrationOptions({ rpName: "FAITH", rpID, userName: person.id, userDisplayName: person.name, attestationType: "none",
      excludeCredentials: this.creds(person.id).map((c) => ({ id: c.id, transports: c.transports })),
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" } });
    this.challenge(person.id, "reg", opts.challenge);
    return opts;
  }
  async registerFinish(person: Person, response: any, label: string, origin?: string) {
    const rp = this.rp(origin);
    let v;
    try { v = await verifyRegistrationResponse({ response, expectedChallenge: this.takeChallenge(person.id, "reg"), expectedOrigin: rp.origin, expectedRPID: rp.rpID, requireUserVerification: true }); }
    catch (e: any) { throw new AuthError(400, `That passkey didn't check out: ${e.message}`); }
    if (!v.verified) throw new AuthError(400, "That passkey didn't check out.");
    const c = v.registrationInfo.credential;
    this.db.prepare("INSERT OR REPLACE INTO passkeys (id, person_id, public_key, counter, transports, label, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(c.id, person.id, Buffer.from(c.publicKey), c.counter, c.transports ? JSON.stringify(c.transports) : null, String(label || "Passkey").slice(0, 60), Date.now());
    return { ok: true };
  }

  async authStart(person: Person, origin?: string) {
    const { rpID } = this.rp(origin);
    const creds = this.creds(person.id);
    if (!creds.length) throw new AuthError(400, `${person.name} hasn't set up Face ID here yet. Sign in another way, then add it in Settings.`);
    const opts = await generateAuthenticationOptions({ rpID, userVerification: "required", allowCredentials: creds.map((c) => ({ id: c.id, transports: c.transports })) });
    this.challenge(person.id, "auth", opts.challenge);
    return opts;
  }
  async authFinish(person: Person, response: any, origin?: string) {
    const rp = this.rp(origin);
    const cred = this.creds(person.id).find((c) => c.id === response?.id);
    if (!cred) throw new AuthError(401, "That passkey isn't one of theirs.");
    let v;
    try { v = await verifyAuthenticationResponse({ response, expectedChallenge: this.takeChallenge(person.id, "auth"), expectedOrigin: rp.origin, expectedRPID: rp.rpID, credential: cred, requireUserVerification: true }); }
    catch (e: any) { throw new AuthError(401, `Face ID didn't check out: ${e.message}`); }
    if (!v.verified) throw new AuthError(401, "Face ID didn't check out.");
    this.db.prepare("UPDATE passkeys SET counter = ? WHERE id = ?").run(v.authenticationInfo.newCounter, cred.id);
  }

  list(personId: string) { return this.db.prepare("SELECT id, label, created_at FROM passkeys WHERE person_id = ? ORDER BY created_at").all(personId) as any[]; }
  remove(personId: string, id: string) { return Number(this.db.prepare("DELETE FROM passkeys WHERE person_id = ? AND id = ?").run(personId, id).changes) > 0; }
}
