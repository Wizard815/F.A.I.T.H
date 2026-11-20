import { envValue, type Config } from "./config.js";
import { ModelError } from "./harness/llm.js";

/** Speech to text through the model server (Argos's OpenAI-compatible /audio/transcriptions). */
export async function transcribe(cfg: Config, env: NodeJS.ProcessEnv, audio: Buffer, mime: string) {
  const m = cfg.model, key = envValue(m.api_key_env, env);
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(audio)], { type: mime }), `speech.${mime.split("/")[1]?.split(";")[0] || "webm"}`);
  form.append("model", cfg.voice.stt_model);
  let r: Response;
  try { r = await fetch(`${m.base_url}/audio/transcriptions`, { method: "POST", body: form, headers: key ? { Authorization: `Bearer ${key}` } : {}, signal: AbortSignal.timeout(120_000) }); }
  catch (e: any) { throw new ModelError(502, `Couldn't reach speech-to-text (${e?.cause?.code || e?.message}).`); }
  const d: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new ModelError(502, `Speech-to-text answered ${r.status}.`);
  return String(d.text || "").trim();
}

/** Raw PCM (what voice satellites send) wrapped as a WAV file. */
export function wav(pcm: Buffer, rate: number, width: number, channels: number) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVE", 8);
  h.write("fmt ", 12); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(channels, 22);
  h.writeUInt32LE(rate, 24); h.writeUInt32LE(rate * width * channels, 28); h.writeUInt16LE(width * channels, 32); h.writeUInt16LE(width * 8, 34);
  h.write("data", 36); h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

/** What a voice should read: the words, without Markdown's marks. */
export function speakable(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s*(?:[-*•]|\d+[.)])\s+/gm, "")
    .replace(/(\*\*|__|\*|_|`|~~)/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

/** Text to speech through the model server (Argos's OpenAI-compatible /audio/speech). */
export async function synthesize(cfg: Config, env: NodeJS.ProcessEnv, text: string, format: "mp3" | "wav" = "mp3", voice?: string) {
  const m = cfg.model, v = cfg.voice, key = envValue(m.api_key_env, env);
  let r: Response;
  try {
    r = await fetch(`${m.base_url}/audio/speech`, { method: "POST", signal: AbortSignal.timeout(120_000),
      headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
      body: JSON.stringify({ model: v.tts_model, input: speakable(text).slice(0, 4000), ...((voice || v.tts_voice) ? { voice: voice || v.tts_voice } : {}), response_format: format }) });
  } catch (e: any) { throw new ModelError(502, `Couldn't reach text-to-speech (${e?.cause?.code || e?.message}).`); }
  if (!r.ok) throw new ModelError(502, `Text-to-speech answered ${r.status}.`);
  return { audio: Buffer.from(await r.arrayBuffer()), mime: r.headers.get("content-type") || (format === "wav" ? "audio/wav" : "audio/mpeg") };
}

/** The PCM inside a WAV file, and its format. */
export function parseWav(buf: Buffer) {
  if (buf.length < 12 || buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") throw new Error("not a WAV file (set Argos's text-to-speech to return wav)");
  let off = 12, fmt: { channels: number; rate: number; width: number } | undefined;
  while (off + 8 <= buf.length) {
    const id = buf.toString("ascii", off, off + 4), size = buf.readUInt32LE(off + 4), body = off + 8;
    if (id === "fmt ") fmt = { channels: buf.readUInt16LE(body + 2), rate: buf.readUInt32LE(body + 4), width: buf.readUInt16LE(body + 14) / 8 };
    if (id === "data") {
      if (!fmt) throw new Error("WAV has no format chunk");
      const end = size === 0xffffffff || body + size > buf.length ? buf.length : body + size; // streamed WAVs leave the size open
      return { ...fmt, pcm: buf.subarray(body, end) };
    }
    off = body + size + (size % 2);
  }
  throw new Error("WAV has no audio");
}
