import { envValue, type Config, type Person } from "./config.js";
import type { Db } from "./db.js";

export type VoiceMatch = { person: Person; score: number; how: "voice" | "both" | "face_helped" };
export type Decision = { match?: VoiceMatch; conflict?: { voice: Person; face?: Person } };

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

  private rank(e: number[]) {
    const unit = (v: number[]) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
    const q = unit(e);
    let best: { person: Person; score: number } | undefined, second = -1;
    for (const r of this.db.prepare("SELECT person_id, sum FROM voiceprints").all() as any[]) {
      const p = this.cfg().people.find((x) => x.id === r.person_id); if (!p) continue;
      const v = unit(JSON.parse(r.sum)), score = v.reduce((s, x, i) => s + x * (q[i] ?? 0), 0);
      if (!best || score > best.score) { second = best?.score ?? -1; best = { person: p, score }; } else if (score > second) second = score;
    }
    return { best, second };
  }

  /** The closest enrolled person above the threshold, or none. */
  match(e: number[]) {
    const { best, second } = this.rank(e), threshold = this.cfg().voice_id?.threshold ?? 0.78;
    // Too close to call between two people is no answer at all.
    if (!best || best.score < threshold || best.score - second < 0.04) return undefined;
    return best;
  }
  async identify(audio: Buffer, mime: string) { return this.match(await this.embed(audio, mime)); }

  /** The voice, checked against the face a camera there saw just now (a family member's id).
   *  - both agree: `how: "both"`;
   *  - they disagree: `conflict`, and nobody is trusted (it could be a recording, or someone else in view);
   *  - a voice a little under the threshold, or too close to call, counts when the face is that same person: `how: "face_helped"`;
   *  - no face: the voice alone, as before. */
  decide(e: number[], face?: string): Decision {
    const strict = this.match(e);
    if (!face) return strict ? { match: { ...strict, how: "voice" } } : {};
    const facePerson = this.cfg().people.find((p) => p.id === face);
    if (strict) return strict.person.id === face ? { match: { ...strict, how: "both" } } : { conflict: { voice: strict.person, face: facePerson } };
    const { best } = this.rank(e), threshold = this.cfg().voice_id?.threshold ?? 0.78, helps = this.cfg().voice_id?.face_helps ?? 0.08;
    if (best && best.person.id === face && best.score >= threshold - helps) return { match: { ...best, how: "face_helped" } };
    return {};
  }
  async identifyAt(audio: Buffer, mime: string, face?: string) { return this.decide(await this.embed(audio, mime), face); }

  // ---- voice satellites: HA sends FAITH only the words, so remember who said them ----
  private heard: { key: string; print: number[]; at: number }[] = [];
  private static key = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  /** Speech-to-text (the Wyoming server) heard this said, in this voice (its voiceprint, not the audio). */
  remember(text: string, print: number[]) {
    const now = Date.now();
    this.heard = this.heard.filter((h) => now - h.at < 60_000).slice(-20);
    this.heard.push({ key: Voices.key(text), print, at: now });
  }
  /** Who said exactly this in the last minute, checked against the face there now (once: the record is used up). */
  recall(text: string, face?: string): Decision {
    const k = Voices.key(text), now = Date.now();
    for (let i = this.heard.length - 1; i >= 0; i--) {
      const h = this.heard[i];
      if (now - h.at < 60_000 && h.key === k && k) { this.heard.splice(i, 1); return this.decide(h.print, face); }
    }
    return {};
  }
}
