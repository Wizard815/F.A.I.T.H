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
