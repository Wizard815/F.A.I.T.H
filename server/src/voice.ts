import { envValue, type Config, type Person } from "./config.js";
import type { Db } from "./db.js";

export class VoiceError extends Error { constructor(public status: number, message: string) { super(message); } }

/** Telling family voices apart. The voiceid service (voiceid/) turns a
 *  recording into a voiceprint (a list of numbers); FAITH keeps one averaged
 *  voiceprint per person, never the audio. A match only says who is
 *  *probably* speaking: FAITH then treats them like a speaker in a group chat
 *  (shared things only, their changes go through or to approval by role),
 *  never as signed in. */
export class Voices {
  constructor(private db: Db, private cfg: () => Config, private env: NodeJS.ProcessEnv = process.env) {
    db.exec("CREATE TABLE IF NOT EXISTS voiceprints (person_id TEXT PRIMARY KEY, sum TEXT NOT NULL, samples INTEGER NOT NULL, updated_at INTEGER NOT NULL)");
  }
  enabled() { return !!this.cfg().voice_id; }

  async embed(audio: Buffer, mime: string): Promise<number[]> {
    const v = this.cfg().voice_id;
    if (!v) throw new VoiceError(503, "Voice ID isn't set up (voice_id.url in faith.yaml).");
    const token = envValue(v.token_env, this.env);
    let r: Response;
    try { r = await fetch(`${v.url}/embed`, { method: "POST", body: new Uint8Array(audio), headers: { "Content-Type": mime || "audio/webm", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, signal: AbortSignal.timeout(30_000) }); }
    catch (e: any) { throw new VoiceError(502, `Couldn't reach the voice ID service (${e?.cause?.code || e?.message}).`); }
    const d: any = await r.json().catch(() => ({}));
    if (!r.ok) throw new VoiceError(r.status === 400 ? 400 : 502, d?.error || `The voice ID service answered ${r.status}.`);
    if (!Array.isArray(d.embedding) || !d.embedding.length) throw new VoiceError(502, "The voice ID service sent no voiceprint.");
    return d.embedding.map(Number);
  }

  /** Add a recording to someone's voiceprint (three or more clips of a few seconds work well). */
  async enroll(person: Person, audio: Buffer, mime: string) {
    const e = await this.embed(audio, mime);
    const row = this.db.prepare("SELECT sum, samples FROM voiceprints WHERE person_id = ?").get(person.id) as any;
    const sum = row ? (JSON.parse(row.sum) as number[]).map((x, i) => x + (e[i] ?? 0)) : e;
    const samples = (row?.samples ?? 0) + 1;
    this.db.prepare("INSERT OR REPLACE INTO voiceprints (person_id, sum, samples, updated_at) VALUES (?, ?, ?, ?)").run(person.id, JSON.stringify(sum), samples, Date.now());
    return { person: person.id, samples };
  }
  forget(personId: string) { this.db.prepare("DELETE FROM voiceprints WHERE person_id = ?").run(personId); }
  status() {
    const rows = this.db.prepare("SELECT person_id, samples, updated_at FROM voiceprints").all() as any[];
    return this.cfg().people.map((p) => { const r = rows.find((x) => x.person_id === p.id); return { person: p.id, name: p.name, samples: r?.samples ?? 0, updated_at: r?.updated_at ?? null }; });
  }

  /** The closest enrolled person above the threshold, or none. */
  match(e: number[]) {
    const unit = (v: number[]) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
    const q = unit(e), threshold = this.cfg().voice_id?.threshold ?? 0.78;
    let best: { person: Person; score: number } | undefined, second = -1;
    for (const r of this.db.prepare("SELECT person_id, sum FROM voiceprints").all() as any[]) {
      const p = this.cfg().people.find((x) => x.id === r.person_id); if (!p) continue;
      const v = unit(JSON.parse(r.sum)), score = v.reduce((s, x, i) => s + x * (q[i] ?? 0), 0);
      if (!best || score > best.score) { second = best?.score ?? -1; best = { person: p, score }; } else if (score > second) second = score;
    }
    // Too close to call between two people is no answer at all.
    if (!best || best.score < threshold || best.score - second < 0.04) return undefined;
    return best;
  }
  async identify(audio: Buffer, mime: string) { return this.match(await this.embed(audio, mime)); }
}
