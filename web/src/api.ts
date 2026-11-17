export type Person = { id: string; name: string; role: "admin" | "adult" | "child"; color?: string; methods?: { pin: boolean; password: boolean; passkey: boolean } };
export type Session = {
  name: string; device: { id: string; name: string } | null; person: Person | null; household: boolean;
  remaining_seconds: number | null; suggested: string | null; face_unlock: boolean; presence: boolean | null; passkeys_possible: boolean;
  can_approve: boolean; pending_approvals: number; voice: { speak_replies: boolean };
};
export type AppLink = { id: string; name: string; url: string; icon?: string };
export type Item = { title: string; time?: string; meta?: string; label?: string; done?: boolean };
export type Card = {
  id: string; title: string; kind: "schedule" | "list" | "checklist" | "meals" | "entities" | "approvals" | "text";
  items?: Item[]; approvals?: { id: string; summary: string; requested_by: string }[];
  entities?: { entity_id: string; name: string; state: string }[]; text?: string; error?: string; empty?: string;
};
export type ChatEvent =
  | { type: "conversation"; id: string } | { type: "text"; delta: string } | { type: "tool"; name: string } | { type: "tool_result"; name: string; ok: boolean }
  | { type: "confirm"; id: string; summary: string } | { type: "approval"; id: string; summary: string } | { type: "done"; text: string } | { type: "error"; message: string };

export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }

export async function api<T = any>(path: string, opts: { method?: string; body?: unknown } = {}): Promise<T> {
  const r = await fetch(path, { method: opts.method || (opts.body ? "POST" : "GET"), credentials: "same-origin",
    headers: opts.body ? { "Content-Type": "application/json" } : undefined, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(r.status, data?.error || `Error ${r.status}`);
  return data as T;
}

/** POST /api/chat and read its server-sent events. */
export async function chat(text: string, conversationId: string | null, onEvent: (e: ChatEvent) => void, signal?: AbortSignal, images?: string[]) {
  const r = await fetch("/api/chat", { method: "POST", credentials: "same-origin", signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, conversation_id: conversationId, images }) });
  if (!r.ok || !r.body) { const d = await r.json().catch(() => ({})); throw new ApiError(r.status, d?.error || `Error ${r.status}`); }
  const reader = r.body.getReader(), dec = new TextDecoder(); let buf = "";
  for (;;) {
    const { done, value } = await reader.read(); if (done) break;
    buf += dec.decode(value, { stream: true });
    let i; while ((i = buf.indexOf("\n\n")) >= 0) {
      const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
      const line = chunk.split("\n").find((l) => l.startsWith("data:"));
      if (line) { try { onEvent(JSON.parse(line.slice(5))); } catch { /* skip */ } }
    }
  }
}

/** Record from the microphone until stop() and return Argos's transcript. */
export async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream), parts: Blob[] = [];
  rec.ondataavailable = (e) => { if (e.data.size) parts.push(e.data); };
  rec.start();
  return {
    stop: () => new Promise<string>((resolve, reject) => {
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(parts, { type: rec.mimeType || "audio/webm" });
        try {
          const r = await fetch("/api/voice/transcribe", { method: "POST", credentials: "same-origin", headers: { "Content-Type": blob.type.split(";")[0] }, body: blob });
          const d = await r.json().catch(() => ({}));
          if (!r.ok) throw new ApiError(r.status, d?.error || "Couldn't hear that.");
          resolve(d.text || "");
        } catch (e) { reject(e); }
      };
      rec.stop();
    }),
  };
}

let speaking: HTMLAudioElement | null = null;
/** Say a reply aloud with Argos's text-to-speech. */
export async function speak(text: string) {
  speaking?.pause();
  const r = await fetch("/api/voice/speak", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: text.replace(/[*_#`>]/g, "") }) });
  if (!r.ok) return;
  speaking = new Audio(URL.createObjectURL(await r.blob()));
  await speaking.play().catch(() => {});
}
