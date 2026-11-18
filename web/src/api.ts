export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }

export async function api<T = any>(path: string, opts: { method?: string; body?: unknown; raw?: Blob } = {}): Promise<T> {
  const r = await fetch(path, {
    method: opts.method || (opts.body || opts.raw ? "POST" : "GET"), credentials: "same-origin",
    headers: opts.raw ? { "Content-Type": opts.raw.type.split(";")[0] || "audio/webm" } : opts.body ? { "Content-Type": "application/json" } : undefined,
    body: opts.raw ? opts.raw : opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new ApiError(r.status, data?.error || `Error ${r.status}`);
  return data as T;
}

/** Record from the microphone until stop() is called. */
export async function record() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream), parts: Blob[] = [];
  rec.ondataavailable = (e) => { if (e.data.size) parts.push(e.data); };
  rec.start();
  return { stop: () => new Promise<Blob>((resolve) => { rec.onstop = () => { stream.getTracks().forEach((t) => t.stop()); resolve(new Blob(parts, { type: rec.mimeType || "audio/webm" })); }; rec.stop(); }) };
}

export type Session = { name: string; person: { id: string; name: string; role: string; color?: string } | null; passkeys_possible: boolean };
