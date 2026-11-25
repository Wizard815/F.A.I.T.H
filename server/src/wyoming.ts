import { createServer, type Server, type Socket } from "node:net";
import type { Config } from "./config.js";
import type { Voices } from "./voice.js";
import { parseWav, synthesize, transcribe, wav } from "./speech.js";

/** FAITH as a speech-to-text service for Home Assistant's voice pipeline,
 *  over the Wyoming protocol (what HA's voice satellites already use).
 *
 *  HA hands its conversation agent only the words, never the voice. So when
 *  FAITH does the speech-to-text step itself, it can also tell who is talking:
 *  the audio goes to Argos for the words and to voice ID for the speaker, and
 *  FAITH remembers "this person just said this". A moment later HA sends FAITH
 *  the same words as a conversation, and FAITH knows the speaker. */

type Ev = { type: string; data: Record<string, any>; payload?: Buffer };
const VERSION = "1.5.4";

export function encode(type: string, data: Record<string, unknown> = {}, payload?: Buffer) {
  const body = Buffer.from(JSON.stringify(data));
  const head: Record<string, unknown> = { type, version: VERSION, data_length: body.length };
  if (payload?.length) head.payload_length = payload.length;
  return Buffer.concat([Buffer.from(JSON.stringify(head) + "\n"), body, payload ?? Buffer.alloc(0)]);
}

/** Reads Wyoming events from a stream: a JSON header line, then optional data JSON and payload bytes. */
export class Decoder {
  private buf = Buffer.alloc(0);
  push(chunk: Buffer): Ev[] {
    this.buf = Buffer.concat([this.buf, chunk]);
    const out: Ev[] = [];
    for (;;) {
      const nl = this.buf.indexOf(10);
      if (nl < 0) { if (this.buf.length > 1_000_000) throw new Error("Wyoming header too long"); break; }
      const head = JSON.parse(this.buf.subarray(0, nl).toString("utf8"));
      const dl = Number(head.data_length || 0), pl = Number(head.payload_length || 0);
      if (this.buf.length < nl + 1 + dl + pl) break;
      let data = { ...(head.data || {}) };
      if (dl) data = { ...data, ...JSON.parse(this.buf.subarray(nl + 1, nl + 1 + dl).toString("utf8")) };
      const payload = pl ? Buffer.from(this.buf.subarray(nl + 1 + dl, nl + 1 + dl + pl)) : undefined;
      this.buf = this.buf.subarray(nl + 1 + dl + pl);
      out.push({ type: String(head.type), data, payload });
    }
    return out;
  }
}

export type WyomingDeps = { cfg: () => Config; env: NodeJS.ProcessEnv; voices: Voices; log: { info: (o: object, m: string) => void; warn: (o: object, m: string) => void } };
const MAX_AUDIO = 16_000 * 2 * 60; // a minute of 16 kHz 16-bit mono

export class WyomingStt {
  private server?: Server;
  constructor(private d: WyomingDeps) {}

  info() {
    const w = this.d.cfg().wyoming!, attribution = { name: "FAITH", url: "https://github.com/Wizard815/F.A.I.T.H" };
    return {
      asr: [{
        name: "faith", description: "FAITH: Argos speech-to-text that also knows which family member is talking", attribution, installed: true, version: "0.3.0",
        models: [{ name: this.d.cfg().voice.stt_model, description: "Argos speech-to-text", attribution, installed: true, languages: w.languages, version: "1" }],
      }],
      // FAITH's voice: Argos's text-to-speech, so satellites sound like FAITH everywhere.
      tts: [{
        name: "faith", description: "FAITH's voice (Argos text-to-speech)", attribution, installed: true, version: "0.3.0",
        voices: [{ name: this.d.cfg().voice.tts_voice || "faith", description: "FAITH", attribution, installed: true, languages: w.languages, version: "1" }],
      }],
      handle: [], intent: [], wake: [],
    };
  }

  /** One connection from HA: describe, then any number of transcribe rounds. */
  handle(sock: Socket) {
    // The protocol has no password: only the addresses in wyoming.allow_from (your HA) may talk to it.
    const allow = this.d.cfg().wyoming?.allow_from ?? [], from = String(sock.remoteAddress || "").replace(/^::ffff:/, "");
    if (allow.length && !allow.includes(from)) { this.d.log.warn({ from }, "wyoming: refused (not in wyoming.allow_from)"); sock.destroy(); return; }
    const dec = new Decoder();
    let fmt = { rate: 16000, width: 2, channels: 1 }, chunks: Buffer[] = [], size = 0, busy: Promise<void> = Promise.resolve();
    const send = (type: string, data: Record<string, unknown> = {}) => { if (!sock.destroyed) sock.write(encode(type, data)); };
    sock.on("data", (c) => {
      let events: Ev[];
      try { events = dec.push(c); } catch (e: any) { this.d.log.warn({ err: e.message }, "wyoming: bad data, closing"); sock.destroy(); return; }
      for (const ev of events) {
        if (ev.type === "describe") send("info", this.info());
        else if (ev.type === "transcribe") { chunks = []; size = 0; }
        else if (ev.type === "audio-start") { fmt = { rate: Number(ev.data.rate) || 16000, width: Number(ev.data.width) || 2, channels: Number(ev.data.channels) || 1 }; chunks = []; size = 0; }
        else if (ev.type === "audio-chunk" && ev.payload) { if (size + ev.payload.length <= MAX_AUDIO) { chunks.push(ev.payload); size += ev.payload.length; } }
        else if (ev.type === "synthesize") {
          const text = String(ev.data.text || ""), voice = ev.data.voice?.name && ev.data.voice.name !== "faith" ? String(ev.data.voice.name) : undefined;
          busy = busy.then(() => this.speak(sock, text, voice));
        }
        else if (ev.type === "audio-stop") {
          const audio = wav(Buffer.concat(chunks), fmt.rate, fmt.width, fmt.channels);
          chunks = []; size = 0;
          busy = busy.then(async () => send("transcript", { text: await this.hear(audio, sock.remoteAddress) }));
        }
      }
    });
    sock.on("error", () => sock.destroy());
  }

  /** Say something: Argos's speech as WAV, sent back as PCM chunks. */
  async speak(sock: Socket, text: string, voice?: string) {
    const send = (type: string, data: Record<string, unknown> = {}, payload?: Buffer) => { if (!sock.destroyed) sock.write(encode(type, data, payload)); };
    try {
      const { audio } = await synthesize(this.d.cfg(), this.d.env, text, "wav", voice);
      const w = parseWav(audio), fmt = { rate: w.rate, width: w.width, channels: w.channels }, step = 2048 * w.width * w.channels;
      send("audio-start", fmt);
      for (let i = 0; i < w.pcm.length; i += step) send("audio-chunk", fmt, Buffer.from(w.pcm.subarray(i, i + step)));
      send("audio-stop");
    } catch (e: any) {
      this.d.log.warn({ err: e.message }, "wyoming: text-to-speech failed");
      send("error", { text: `FAITH couldn't speak: ${e.message}`, code: "tts-failed" });
    }
  }

  /** The words, and (when voice ID is on) who said them. */
  async hear(audio: Buffer, from?: string) {
    const [text, print] = await Promise.all([
      transcribe(this.d.cfg(), this.d.env, audio, "audio/wav").catch((e) => { this.d.log.warn({ err: e.message }, "wyoming: speech-to-text failed"); return ""; }),
      this.d.voices.enabled() ? this.d.voices.embed(audio, "audio/wav").catch(() => undefined) : Promise.resolve(undefined),
    ]);
    // Keep the voiceprint, not a name: the camera next to the satellite may still have a say (voice.ts decide).
    if (text && print) this.d.voices.remember(text, print);
    const who = print ? this.d.voices.match(print) : undefined;
    this.d.log.info({ from, speaker: who?.person.id ?? null, score: who ? Math.round(who.score * 100) / 100 : null }, "wyoming: heard");
    return text;
  }

  listen() {
    const w = this.d.cfg().wyoming;
    if (!w) return Promise.resolve(undefined);
    this.server = createServer((s) => this.handle(s));
    return new Promise<number>((res, rej) => {
      this.server!.once("error", rej);
      this.server!.listen(w.port, w.host, () => res((this.server!.address() as any).port));
    });
  }
  close() { return new Promise<void>((r) => (this.server ? this.server.close(() => r()) : r())); }
}
