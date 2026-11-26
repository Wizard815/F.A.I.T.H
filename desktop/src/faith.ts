/** FAITH's apps contract (docs/clients.md), for the desktop app's main process.
 *  Plain Node: no Electron here, so it's tested against a real FAITH with fakes. */

export class FaithError extends Error {
  constructor(message: string, public status = 0) { super(message); }
}
/** The key was removed (Tokens & screens, or `faith token revoke`): sign in again. */
export class SignedOut extends FaithError {}

export const NOT_ANSWERING = "FAITH isn't answering. Check that its container is running (or that you're on the home Wi-Fi).";

export type Person = { id: string; name: string; role: string; color?: string };
export type ChatEvent =
  | { type: "conversation"; id: string }
  | { type: "text"; delta: string }
  | { type: "tool"; name: string }
  | { type: "confirm"; id: string; summary: string }
  | { type: "approval"; id: string; summary: string }
  | { type: "photos"; items: PhotoRef[] }
  | { type: "done"; text: string }
  | { type: "error"; message: string };
/** A photo FAITH showed (from Immich); its picture is at /api/photos/<source>/<id>. */
export type PhotoRef = { source: string; id: string; kind: "photo" | "video"; taken: string; place?: string; people?: string[]; caption?: string; link?: string };
/** A part of the board that's set up but couldn't load carries an error, in words for people. */
export type Board = {
  person: { id: string; name: string } | null; day: string;
  brief: { day: string; text: string; by: string; at: number } | null;
  weather: { place: string; condition: string; unit: string; temperature: number | null; feels_like: number | null; humidity: number | null; wind: number | null; wind_unit: string;
    days: { date: string; condition: string; high: number | null; low: number | null; rain: number | null }[] } | { error: string } | null;
  news: { items: { title: string; link: string; source: string; published: number; summary: string }[]; errors: string[] } | { error: string } | null;
  projects: { id: string; name: string; status: string; next: string; fav: boolean; archived: boolean; last?: string; last_day?: string }[] | null;
  log: { id: number; project: string; text: string; by: string; day: string; at: number }[] | null;
  uptime: { up: number; down: number; monitors: { name: string; group: string; status: string; uptime24: number | null; ignored: boolean }[] } | { error: string } | null;
  system: { name: string; cores: number; load: number; memory: number; memory_gib: number; disks: { mount: string; pct: number }[]; uptime_days: number; sources: { label: string; ok: boolean | null; error?: string }[] } | { error: string } | null;
  cards: any[];
};
/** Family projects (docs/projects.md): yours, Family, and Parents for grown-ups. */
export type ThreadStatus = "working" | "done" | "waiting" | "failed";
export type ProjectThread = { id: string; project_id: string; title: string; brief: string; status: ThreadStatus; resolved: boolean; depth: number; started_by: string; last_text: string; created_at: number; updated_at: number };
export type FamilyProject = { id: string; owner: string; name: string; instructions: string; created_at: number; updated_at: number; threads: ProjectThread[] };
export type ThreadView = { thread: { id: string; title: string; status: ThreadStatus; resolved: boolean; project: string }; messages: { role: string; text: string; at: number }[] };
/** A change to a project: done, or held for this person's Yes (pending), or for a grown-up's approval (requests). */
export type ProjectChange = { ok?: boolean; thread?: string; pending: { id: string; summary: string }[]; requests: { id: string; summary: string }[] };
export type InboxItem = { id: number; at: number; kind: "message" | "approval"; title: string; text: string; ref: string | null };

/** "http://faith:8097/" or "faith:8097" -> "http://faith:8097". */
export function cleanUrl(u: string): string {
  let s = u.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(s)) s = `http://${s}`;
  const url = new URL(s);
  if (url.pathname !== "/" && url.pathname !== "") throw new FaithError("Use FAITH's address only, like http://faith:8097.");
  return `${url.protocol}//${url.host}`;
}

/** One `data: {...}` line of FAITH's chat stream, or null for anything else. */
export function parseSse(line: string): ChatEvent | null {
  const m = /^data:\s?(.*)$/.exec(line);
  if (!m) return null;
  try { const e = JSON.parse(m[1]); return e && typeof e.type === "string" ? e : null; } catch { return null; }
}

/** What a tool name means, in plain words (as the Android app says it). */
export function friendlyTool(name: string): string {
  if (name.includes("day") || name.includes("calendar")) return "checking the calendar";
  if (name.includes("shopping")) return "checking the shopping list";
  if (name.includes("meal") || name.includes("recipe")) return "checking meals";
  if (name.startsWith("Hass") || name.startsWith("home_") || name.includes("camera")) return "checking the house";
  if (/notes|wiki|memory|context/.test(name)) return "checking your notes";
  if (name.startsWith("coinpile")) return "checking money";
  if (name.startsWith("photos_")) return "looking through photos";
  return "checking";
}

export class Faith {
  constructor(public url: string, public token?: string, private fetcher: typeof fetch = fetch) {}

  private async req(method: string, path: string, opts: { json?: unknown; body?: BodyInit; type?: string; timeoutMs?: number; signal?: AbortSignal } = {}) {
    const headers: Record<string, string> = {};
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    if (opts.json !== undefined) headers["Content-Type"] = "application/json";
    if (opts.type) headers["Content-Type"] = opts.type;
    const signals = [AbortSignal.timeout(opts.timeoutMs ?? 30_000), ...(opts.signal ? [opts.signal] : [])];
    let r: Response;
    try {
      r = await this.fetcher(`${this.url}${path}`, { method, headers, body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body, signal: AbortSignal.any(signals) });
    } catch (e: any) {
      if (opts.signal?.aborted) throw new FaithError("Stopped.");
      throw new FaithError(NOT_ANSWERING);
    }
    if (r.status === 401 && this.token) throw new SignedOut("This computer isn't signed in to FAITH any more. Sign in again.", 401);
    if (!r.ok) {
      const d: any = await r.json().catch(() => ({}));
      throw new FaithError(d?.error || d?.message || `FAITH answered ${r.status}.`, r.status);
    }
    return r;
  }
  private async json<T = any>(method: string, path: string, json?: unknown, timeoutMs?: number): Promise<T> {
    return (await this.req(method, path, { json, timeoutMs })).json() as Promise<T>;
  }

  /** Once, with the person's password: FAITH gives this computer its own key. */
  async signIn(person: string, password: string, computer: string): Promise<{ token: string; name: string; person: Person }> {
    const d = await this.json("POST", "/api/auth/client", { person: person.trim().toLowerCase(), password, name: computer });
    this.token = d.token;
    return d;
  }
  /** Removes this computer's key on FAITH too. */
  async signOut(name: string) {
    try { await this.json("DELETE", `/api/me/clients/${encodeURIComponent(name)}`); } catch (e) { if (!(e instanceof SignedOut)) throw e; }
    this.token = undefined;
  }
  me() { return this.json<Person>("GET", "/api/me"); }
  latest() { return this.json<{ conversation_id: string | null; messages: { role: string; content: string }[] }>("GET", "/api/chat/latest"); }
  dashboard() { return this.json<{ cards: any[] }>("GET", "/api/dashboard"); }
  /** The info board (docs/clients.md, section 6): brief, weather, projects, log, news, the day cards. */
  board() { return this.json<Board>("GET", "/api/board"); }
  /** The morning brief, written now. The model takes its time. */
  writeBrief() { return this.json<{ day: string; text: string; by: string; at: number }>("POST", "/api/board/brief", {}, 5 * 60_000); }
  addLog(text: string, project?: string) { return this.json("POST", "/api/board/log", { text, ...(project ? { project } : {}) }); }
  addProject(name: string, status?: string, next?: string) { return this.json("POST", "/api/board/projects", { name, ...(status ? { status } : {}), ...(next ? { next } : {}) }); }
  updateProject(name: string, patch: { status?: string; next?: string; name?: string; starred?: boolean; archived?: boolean }) { return this.json("PATCH", `/api/board/projects/${encodeURIComponent(name)}`, patch); }
  /** Bring projects and the log over from this person's Pondering Orb (FAITH uses their own Orb token). */
  projects(resolved = false) { return this.json<{ projects: FamilyProject[] }>("GET", `/api/projects${resolved ? "?resolved=1" : ""}`); }
  projectThread(project: string, thread: string) { return this.json<ThreadView>("GET", `/api/projects/${encodeURIComponent(project)}/threads/${encodeURIComponent(thread)}`); }
  startThread(project: string, brief: string, title?: string) { return this.json<ProjectChange>("POST", `/api/projects/${encodeURIComponent(project)}/threads`, { brief, ...(title ? { title } : {}) }); }
  messageThread(project: string, thread: string, text: string) { return this.json<ProjectChange>("POST", `/api/projects/${encodeURIComponent(project)}/threads/${encodeURIComponent(thread)}/message`, { text }); }
  resolveThread(project: string, thread: string, resolved: boolean) { return this.json<ProjectChange>("PUT", `/api/projects/${encodeURIComponent(project)}/threads/${encodeURIComponent(thread)}/resolved`, { resolved }); }
  importOrb() { return this.json<{ projects: number; logs: number; skipped: string[] }>("POST", "/api/board/import", { from: "orb" }, 60_000); }
  approvals() { return this.json<{ can_approve: boolean; requests: any[] }>("GET", "/api/approvals"); }
  decide(id: string, approve: boolean) { return this.json("POST", `/api/approvals/${encodeURIComponent(id)}`, { approve }); }
  confirm(id: string, approve: boolean) { return this.json<{ ok: boolean; text: string }>("POST", `/api/chat/confirm/${encodeURIComponent(id)}`, { approve }); }

  async transcribe(audio: Uint8Array, mime: string): Promise<string> {
    const r = await this.req("POST", "/api/voice/transcribe", { body: new Blob([new Uint8Array(audio)]), type: mime.split(";")[0] || "audio/webm", timeoutMs: 120_000 });
    return String(((await r.json()) as any).text || "").trim();
  }
  /** A photo's small picture, as a data URL the page can draw. */
  async photo(source: string, id: string): Promise<string> {
    const r = await this.req("GET", `/api/photos/${encodeURIComponent(source)}/${encodeURIComponent(id)}`, { timeoutMs: 60_000 });
    const type = r.headers.get("content-type") || "image/jpeg";
    return `data:${type};base64,${Buffer.from(await r.arrayBuffer()).toString("base64")}`;
  }
  async speak(text: string): Promise<Uint8Array> {
    const r = await this.req("POST", "/api/voice/speak", { json: { text }, timeoutMs: 120_000 });
    return new Uint8Array(await r.arrayBuffer());
  }

  /** Ask, with the answer as it's written. Resolves with the whole answer. */
  async chat(q: { text: string; conversation_id?: string; images?: string[]; spoken?: boolean }, on: (e: ChatEvent) => void, signal?: AbortSignal): Promise<string> {
    const r = await this.req("POST", "/api/chat", { json: q, timeoutMs: 15 * 60_000, signal });
    const reader = r.body!.getReader(), dec = new TextDecoder();
    let buf = "", answer = "";
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const e = parseSse(buf.slice(0, nl).replace(/\r$/, ""));
          buf = buf.slice(nl + 1);
          if (!e) continue;
          if (e.type === "text") answer += e.delta;
          if (e.type === "done") answer = e.text || answer;
          on(e);
          if (e.type === "error") throw new FaithError(e.message);
        }
      }
    } catch (e: any) {
      if (e instanceof FaithError) throw e;
      throw new FaithError(signal?.aborted ? "Stopped." : NOT_ANSWERING);
    }
    return answer;
  }

  /** The inbox: what's new after `after`, waiting up to `wait` seconds for something. */
  async inbox(after: number, wait = 30, signal?: AbortSignal): Promise<{ items: InboxItem[]; last: number }> {
    const r = await this.req("GET", `/api/inbox?after=${after}&wait=${wait}`, { timeoutMs: (wait + 15) * 1000, signal });
    const d: any = await r.json();
    return { items: Array.isArray(d.items) ? d.items : [], last: Number(d.last) || after };
  }
}
