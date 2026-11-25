import { envValue, type Config, type Person } from "./config.js";
import type { Db } from "./db.js";
import type { Agent, TurnResult } from "./harness/agent.js";
import { Approvals, type ApprovalEvent } from "./approvals.js";
import type { Caller } from "./scope.js";
import { transcribe } from "./speech.js";
import { MediaError, photo, video } from "./media.js";

const MAX_FILE = 15_000_000, MAX_VIDEO = 50_000_000;

/** Where a Mattermost message was written, and so who reads the answer. */
export type Room = { kind: "personal"; person: Person } | { kind: "family" } | { kind: "parents" };
type Post = { id: string; user_id: string; channel_id: string; message: string; root_id?: string; type?: string; file_ids?: string[] };
type Log = { info: (o: any, m?: string) => void; warn: (o: any, m?: string) => void };

export class MattermostError extends Error {}

const NEW_TOPIC = /^(new topic|new chat|new conversation|start over|start again|fresh start|\/new)[.!]*$/i;
/** Held changes are kept per chat and per person. */
const held = (channelId: string, personId: string) => `${channelId}|${personId}`;
const YES = /^(yes|y|yep|yeah|ok|okay|sure|do it|go ahead|confirm)\b/i, NO = /^(no|n|nope|cancel|stop|don'?t)\b/i;
const DECIDE = /^(approve|deny)\s+([A-Za-z0-9_-]{3,})\b/i;

/** FAITH as a Mattermost bot. It makes and looks after three kinds of chat:
 *  - a personal DM with each family member: their own view, private things included;
 *  - a family channel everyone is in: shared things only, whoever asks;
 *  - a parents channel only grown-ups are in: approvals land there.
 *  Who someone is comes from their Mattermost account (people[].mattermost_username). */
export class MattermostBot {
  me?: { id: string; username: string };
  team?: { id: string; name: string };
  rooms = new Map<string, Room>();
  users = new Map<string, Person>();          // Mattermost user id -> person
  ids = new Map<string, string>();            // person id -> Mattermost user id
  familyId?: string; parentsId?: string;
  private pending = new Map<string, { id: string; by: string }>();
  private ws?: WebSocket; private seq = 1; private stopped = false; private retry = 1000; private resync?: NodeJS.Timeout;

  constructor(private cfg: () => Config, private db: Db, private agent: Agent, private approvals: Approvals, private log: Log, private env: NodeJS.ProcessEnv = process.env) {
    db.exec("CREATE TABLE IF NOT EXISTS mm_state (key TEXT PRIMARY KEY, value TEXT NOT NULL)");
    approvals.on((e) => { this.onApproval(e).catch((err) => this.log.warn({ err: err.message }, "mattermost: couldn't post an approval")); });
  }

  private get mm() { const m = this.cfg().mattermost; if (!m) throw new MattermostError("Mattermost isn't configured."); return m; }
  private token() { const t = envValue(this.mm.token_env, this.env); if (!t) throw new MattermostError(`Mattermost needs the bot's token in ${this.mm.token_env}.`); return t; }

  async api(method: string, path: string, body?: unknown): Promise<any> {
    let r: Response;
    try {
      r = await fetch(`${this.mm.url}/api/v4${path}`, { method, signal: AbortSignal.timeout(20000),
        headers: { Authorization: `Bearer ${this.token()}`, "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" }, body: body === undefined ? undefined : JSON.stringify(body) });
    } catch (e: any) { throw new MattermostError(`Couldn't reach Mattermost (${e?.cause?.code || e?.message}).`); }
    const text = await r.text(); let data: any = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!r.ok) { const err = new MattermostError(`Mattermost ${method} ${path} answered ${r.status}: ${data?.message || text.slice(0, 160)}`); (err as any).status = r.status; throw err; }
    return data;
  }
  /** A file someone attached (a photo, a voice message), as bytes. */
  async file(id: string): Promise<{ mime: string; name: string; bytes: Buffer } | undefined> {
    const info = await this.api("GET", `/files/${encodeURIComponent(id)}/info`);
    const max = String(info?.mime_type || "").startsWith("video/") ? MAX_VIDEO : MAX_FILE;
    if (!info || Number(info.size) > max) return undefined;
    let r: Response;
    try { r = await fetch(`${this.mm.url}/api/v4/files/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${this.token()}`, "X-Requested-With": "XMLHttpRequest" }, signal: AbortSignal.timeout(30000) }); }
    catch (e: any) { throw new MattermostError(`Couldn't fetch a file from Mattermost (${e?.cause?.code || e?.message}).`); }
    if (!r.ok) throw new MattermostError(`Mattermost answered ${r.status} for a file.`);
    const bytes = Buffer.from(await r.arrayBuffer());
    if (bytes.length > max) return undefined;
    return { mime: String(info.mime_type || "application/octet-stream").toLowerCase(), name: String(info.name || "file"), bytes };
  }

  /** Photos go to the vision model, videos as frames plus what their sound says;
   *  voice messages are turned into words (Argos). */
  private async attachments(post: Post, photos: boolean) {
    const images: string[] = [], heard: string[] = [], skipped: string[] = [], notes: string[] = [], problems: string[] = [];
    for (const id of (post.file_ids || []).slice(0, 4)) {
      try {
        if (!photos) { const info = await this.api("GET", `/files/${encodeURIComponent(id)}/info`); if (/^(image|video)\//.test(String(info?.mime_type || ""))) continue; }
        const f = await this.file(id);
        if (!f) { skipped.push("a file that's too big"); continue; }
        if (f.mime.startsWith("image/")) images.push(await photo(f.bytes, f.mime));
        else if (f.mime.startsWith("audio/") || (f.mime === "video/mp4" && /\.m4a$/i.test(f.name))) {
          const t = await transcribe(this.cfg(), this.env, f.bytes, f.mime.startsWith("audio/") ? f.mime : "audio/mp4");
          if (t) heard.push(t);
        } else if (f.mime.startsWith("video/")) {
          const v = await video(this.cfg(), this.env, f.bytes);
          images.push(...v.frames); notes.push(v.note);
        } else skipped.push(f.name);
      } catch (e: any) {
        this.log.warn({ err: e.message }, "mattermost: couldn't read an attachment");
        if (e instanceof MediaError) problems.push(e.message); else skipped.push("an attachment I couldn't open");
      }
    }
    return { images, heard, skipped, notes, problems };
  }

  private kv(key: string) { return (this.db.prepare("SELECT value FROM mm_state WHERE key = ?").get(key) as any)?.value as string | undefined; }
  private setKv(key: string, value: string) { this.db.prepare("INSERT OR REPLACE INTO mm_state (key, value) VALUES (?, ?)").run(key, value); }

  // ---------------- setting up the chats ----------------

  /** Find the family's accounts, make the two channels, open a DM with each
   *  person, and put the right people (and only them) in each channel. */
  async setup() {
    const mm = this.mm, people = this.cfg().people;
    this.me = await this.api("GET", "/users/me");
    try { this.team = await this.api("GET", `/teams/name/${encodeURIComponent(mm.team)}`); }
    catch (e: any) { throw new MattermostError(`FAITH's bot can't see the team "${mm.team}". Add the bot to that team in Mattermost (System Console → Bot Accounts, or the team's Add Members). ${e.message}`); }

    const names = people.map((p) => p.mattermost_username).filter(Boolean) as string[];
    const found: any[] = names.length ? await this.api("POST", "/users/usernames", names) : [];
    this.users.clear(); this.ids.clear();
    for (const p of people) {
      const u = found.find((x) => x.username?.toLowerCase() === p.mattermost_username);
      if (p.mattermost_username && !u) this.log.warn({ person: p.id }, `mattermost: no account called @${p.mattermost_username}`);
      if (u) { this.users.set(u.id, p); this.ids.set(p.id, u.id); }
    }
    this.rooms.clear();
    const family = people.filter((p) => this.ids.has(p.id)), parents = family.filter((p) => p.role !== "child");
    this.familyId = await this.channel(mm.family_channel, "The whole family, with FAITH. Everyone reads this: shared things only.", family);
    this.parentsId = await this.channel(mm.parents_channel, "Grown-ups only, with FAITH. Approvals for the family's requests land here.", parents);
    this.rooms.set(this.familyId, { kind: "family" });
    this.rooms.set(this.parentsId, { kind: "parents" });
    for (const p of family) {
      const dm = await this.api("POST", "/channels/direct", [this.me!.id, this.ids.get(p.id)]);
      this.rooms.set(dm.id, { kind: "personal", person: p });
      if (!this.kv(`welcomed:${p.id}`)) {
        await this.post(dm.id, `Hi ${p.name}, I'm ${this.cfg().name}. This is our private chat: only you see it, so I can help with your own things here too, like your notes, tasks and money. The whole family can also find me in ~${mm.family_channel.name}${p.role !== "child" ? `, and the grown-ups in ~${mm.parents_channel.name}` : ""}.`);
        this.setKv(`welcomed:${p.id}`, String(Date.now()));
      }
    }
    this.log.info({ people: family.map((p) => p.id), family: this.familyId, parents: this.parentsId }, "mattermost: chats ready");
    return { family: this.familyId, parents: this.parentsId, people: family.map((p) => p.id) };
  }

  /** A private channel with exactly these people (and the bot). */
  private async channel(spec: { name: string; display_name: string }, purpose: string, members: Person[]) {
    const team = this.team!.id, want = new Set(members.map((p) => this.ids.get(p.id)!));
    let ch: any;
    try { ch = await this.api("GET", `/teams/${team}/channels/name/${spec.name}?include_deleted=true`); }
    catch (e: any) { if ((e as any).status !== 404 && (e as any).status !== 403) throw e; }
    if (ch?.delete_at) { await this.api("POST", `/channels/${ch.id}/restore`); }
    if (!ch) {
      ch = await this.api("POST", "/channels", { team_id: team, name: spec.name, display_name: spec.display_name, type: "P", purpose });
      this.log.info({ channel: spec.name }, "mattermost: made a channel");
    }
    if (!this.cfg().mattermost!.manage_members) return ch.id as string;
    const current: any[] = await this.api("GET", `/channels/${ch.id}/members?per_page=200`);
    const have = new Set(current.map((m) => m.user_id));
    for (const id of want) if (!have.has(id)) await this.api("POST", `/channels/${ch.id}/members`, { user_id: id });
    for (const m of current) {
      if (m.user_id === this.me!.id || want.has(m.user_id)) continue;
      // Someone who doesn't belong (a child in the parents' chat, a guest): take them out.
      await this.api("DELETE", `/channels/${ch.id}/members/${m.user_id}`);
      this.log.warn({ channel: spec.name, user: m.user_id }, "mattermost: removed someone who doesn't belong in this chat");
    }
    return ch.id as string;
  }

  /** A person's DM channel with FAITH, if they're on Mattermost. */
  dmOf(personId: string) { for (const [id, r] of this.rooms) if (r.kind === "personal" && r.person.id === personId) return id; return undefined; }

  async post(channelId: string, message: string, rootId?: string) {
    return this.api("POST", "/posts", { channel_id: channelId, message, ...(rootId ? { root_id: rootId } : {}) });
  }

  // ---------------- messages ----------------

  /** The caller FAITH answers as, for a room and the person writing. */
  callerFor(room: Room, speaker: Person, channelId: string): Caller {
    if (room.kind === "personal") return { scope: { kind: "person", person: room.person }, channel: "mattermost", deviceId: channelId, label: `${room.person.id} on mattermost` };
    return { scope: { kind: "household" }, channel: "mattermost", deviceId: channelId, speaker, audience: room.kind, label: `${speaker.id} in the ${room.kind} chat` };
  }
  private approver(p: Person) { return this.cfg().approvals.approvers.includes(p.role); }

  /** One message, from the websocket (or a test). Messages in the same chat are handled in the order
   *  they came: a quick second message can't overtake the first. Returns what FAITH posted, if anything. */
  handle(post: Post, channelType?: string): Promise<string | undefined> {
    const before = this.inOrder.get(post.channel_id) ?? Promise.resolve();
    const mine = before.then(() => this.handleNow(post, channelType), () => this.handleNow(post, channelType));
    const tail = mine.catch(() => undefined);
    this.inOrder.set(post.channel_id, tail);
    void tail.then(() => { if (this.inOrder.get(post.channel_id) === tail) this.inOrder.delete(post.channel_id); });
    return mine;
  }
  private inOrder = new Map<string, Promise<unknown>>();

  private async handleNow(post: Post, channelType?: string): Promise<string | undefined> {
    if (!this.me || post.user_id === this.me.id || (post.type && post.type !== "")) return;
    const room = this.rooms.get(post.channel_id), person = this.users.get(post.user_id);
    if (!room) {
      if (channelType === "D") return this.say(post, `Sorry, I only talk with the family I know. Ask whoever runs FAITH to add your Mattermost name (mattermost_username) to faith.yaml.`);
      return;
    }
    if (!person) return; // someone FAITH doesn't know, in a family chat (manage_members takes them out)
    if (room.kind === "personal" && room.person.id !== person.id) return;
    if (room.kind === "parents" && person.role === "child") return;
    let text = String(post.message || "").trim();
    // A voice message counts as what was said; photos go along with the question.
    // In a group chat where FAITH answers only when named, don't fetch every photo people share.
    const named = (t: string) => new RegExp(`@${this.me!.username}\\b`, "i").test(t) || new RegExp(`^(hey\\s+)?${this.cfg().name}\\b`, "i").test(t);
    const photos = room.kind === "personal" || this.mm.answer_in_groups !== "mention" || named(text);
    const att = post.file_ids?.length ? await this.attachments(post, photos) : { images: [] as string[], heard: [] as string[], skipped: [] as string[], notes: [] as string[], problems: [] as string[] };
    if (att.heard.length) text = [text, ...att.heard].filter(Boolean).join("\n");
    const heardNote = (att.heard.length ? `_Heard: “${att.heard.join(" ")}”_\n\n` : "") + (att.problems.length ? `_${att.problems.join(" ")}_\n\n` : "");
    if (!text && att.images.length) text = att.notes.length ? "What's in this video?" : "What's in this photo?";
    if (!text && att.problems.length) return this.say(post, att.problems.join(" "));
    if (!text) return att.skipped.length ? this.say(post, `I can read photos, videos and voice messages, not ${att.skipped.join(", ")}.`) : undefined;

    // "yes" / "no" to something waiting for a confirmation: their own first. Each person in a chat has
    // their own, so Sam's held lock and Wizard's held garage don't replace each other.
    let waitKey = held(post.channel_id, person.id), wait = this.pending.get(waitKey);
    if (!wait && (YES.test(text) || NO.test(text))) {
      // Someone else's in this chat: a grown-up may answer it in a group chat (as before); anyone else's yes counts for nothing.
      const other = [...this.pending.entries()].reverse().find(([k]) => k.startsWith(`${post.channel_id}|`));
      if (other) { if (!(room.kind !== "personal" && this.approver(person))) return; [waitKey, wait] = other; }
    }
    if (wait && (YES.test(text) || NO.test(text))) {
      this.pending.delete(waitKey);
      const by = this.cfg().people.find((p) => p.id === wait.by) ?? person;
      try { const r = await this.agent.confirm(this.callerFor(room, by, post.channel_id), wait.id, YES.test(text)); return this.say(post, r.text); }
      catch (e: any) { return this.say(post, e.message); }
    }
    // They moved on: a later "yes" must not land on this older change.
    if (wait && wait.by === person.id) this.pending.delete(waitKey);

    // "approve abc12" / "deny abc12" from a grown-up (parents' chat or their own DM).
    const d = text.match(DECIDE);
    if (d && room.kind !== "family" && this.approver(person)) {
      const id = this.approvals.resolveId(d[2]);
      if (!id) return this.say(post, `I can't find a request "${d[2]}". The code is in the message that asked for approval.`);
      try {
        const r = await this.approvals.decide({ scope: { kind: "person", person }, channel: "mattermost", deviceId: post.channel_id, label: `${person.id} on mattermost` }, id, d[1].toLowerCase() === "approve");
        return room.kind === "parents" ? undefined /* the decision is announced to the parents' chat */ : this.say(post, r.text);
      } catch (e: any) { return this.say(post, e.message); }
    }

    if (room.kind !== "personal") {
      const mention = new RegExp(`@${this.me.username}\\b`, "i"), byName = new RegExp(`^(hey\\s+)?${this.cfg().name}\\b[,:!]?`, "i");
      if (this.mm.answer_in_groups === "mention" && !mention.test(text) && !byName.test(text)) return;
      text = text.replace(mention, "").replace(byName, "").trim();
      if (!text) return this.say(post, `Yes, ${person.name}?`);
    }

    if (NEW_TOPIC.test(text) && !att.images.length) {
      this.pending.delete(held(post.channel_id, person.id));
      this.agent.newTopic(this.callerFor(room, person, post.channel_id), `mm:${post.channel_id}`);
      return this.say(post, "Okay, a fresh start. I've put our earlier chat away.");
    }

    const typing = setInterval(() => this.typing(post.channel_id, post.root_id), 4000); this.typing(post.channel_id, post.root_id);
    try {
      const finish = (r: TurnResult, note = "") => {
        let reply = note + (r.text || "Done.");
        if (r.pending.length) {
          this.pending.set(held(post.channel_id, person.id), { id: r.pending.at(-1)!.id, by: person.id });
          if (!/reply\W+yes\b/i.test(reply)) reply += `\n\nReply **yes** to go ahead, or **no**.`;
        }
        if (r.requests.length && room.kind === "family") reply += `\n\n_Sent to the parents to approve._`;
        return this.say(post, reply);
      };
      // A bigger job says so now and posts its answer here when it's done; quick questions meanwhile go first.
      const r = await this.agent.turnOrLater({ caller: this.callerFor(room, person, post.channel_id), text: [text, ...att.notes].join("\n\n"), images: att.images, extId: `mm:${post.channel_id}`, freshAfterMs: this.mm.new_topic_after_minutes * 60_000 },
        this.cfg().model.answer_within_s * 1000, (late) => { void (late instanceof Error ? this.say(post, `Sorry, that didn't work: ${late.message}`) : finish(late)); });
      return r.later ? this.say(post, heardNote + r.text) : finish(r, heardNote);
    } catch (e: any) {
      return this.say(post, `Sorry, that didn't work: ${e.message}`);
    } finally { clearInterval(typing); }
  }

  /** FAITH starts a message in a person's own chat (an Omi recording's suggestions). The text is
   *  context FAITH was handed, not something they said: every change waits for their yes here.
   *  Returns what was posted, or undefined when there was nothing worth saying. */
  async proactive(person: Person, text: string, extraSystem: string) {
    const channel = this.dmOf(person.id), room = channel ? this.rooms.get(channel) : undefined;
    if (!channel || !room) throw new Error(`${person.name} has no chat with FAITH in Mattermost yet.`);
    const r = await this.agent.turn({ caller: this.callerFor(room, person, channel), text, extraSystem, heard: true, extId: `mm:${channel}`, freshAfterMs: this.mm.new_topic_after_minutes * 60_000 });
    if (!r.pending.length && /^\W*nothing\W*$/i.test(r.text.trim())) return undefined;
    let reply = r.text || "Done.";
    if (r.pending.length) {
      this.pending.set(held(channel, person.id), { id: r.pending.at(-1)!.id, by: person.id });
      if (!/reply\W+yes\b/i.test(reply)) reply += `\n\nReply **yes** to go ahead, or **no**.`;
    }
    await this.post(channel, reply);
    return reply;
  }

  private async say(post: Post, message: string) { await this.post(post.channel_id, message, post.root_id || undefined); return message; }

  private typing(channelId: string, parentId?: string) {
    if (this.ws?.readyState === 1) this.ws.send(JSON.stringify({ action: "user_typing", seq: this.seq++, data: { channel_id: channelId, parent_id: parentId || "" } }));
  }

  /** Requests from the shared screen (or a child in the family chat) go to the parents' chat. */
  async onApproval(e: ApprovalEvent) {
    if (!this.parentsId) return;
    const r = e.request;
    if (e.kind === "created") {
      await this.post(this.parentsId, `**Waiting for approval:** ${r.summary}\nAsked by ${r.requested_by.replace(/^household on /, "the ")}. Reply \`approve ${Approvals.code(r.id)}\` or \`deny ${Approvals.code(r.id)}\`.`);
      return;
    }
    await this.post(this.parentsId, e.text || `${r.status}: ${r.summary}`);
    // Tell the chat it was asked from, if that was a Mattermost chat other than the parents'.
    if (e.channel === "mattermost" && e.device_id && e.device_id !== this.parentsId && this.rooms.has(e.device_id)) await this.post(e.device_id, e.text || `${r.status}: ${r.summary}`);
  }

  // ---------------- the websocket ----------------

  /** One websocket frame from Mattermost. */
  async onEvent(raw: string) {
    let ev: any; try { ev = JSON.parse(raw); } catch { return; }
    if (ev.event === "hello") { this.retry = 1000; this.log.info({}, "mattermost: connected"); return; }
    if (ev.event === "posted") {
      let post: Post; try { post = JSON.parse(ev.data.post); } catch { return; }
      await this.handle(post, ev.data.channel_type);
      return;
    }
    // Channels changing under us (someone added to or taken out of a chat): set up again.
    if (["user_added", "user_removed", "channel_converted", "channel_deleted"].includes(ev.event) && this.rooms.has(ev.broadcast?.channel_id || ev.data?.channel_id)) {
      clearTimeout(this.resync); this.resync = setTimeout(() => this.setup().catch((e) => this.log.warn({ err: e.message }, "mattermost: setup failed")), 2000);
    }
  }

  async start() {
    this.stopped = false;
    try { await this.setup(); }
    catch (e: any) { this.log.warn({ err: e.message }, "mattermost: setup failed; trying again in a minute"); setTimeout(() => this.start(), 60_000).unref(); return; }
    this.connect();
    setInterval(() => this.setup().catch((e) => this.log.warn({ err: e.message }, "mattermost: periodic setup failed")), 15 * 60_000).unref();
  }

  private connect() {
    if (this.stopped) return;
    const url = this.mm.url.replace(/^http/, "ws") + "/api/v4/websocket";
    const ws = new WebSocket(url); this.ws = ws;
    ws.onopen = () => ws.send(JSON.stringify({ seq: this.seq++, action: "authentication_challenge", data: { token: this.token() } }));
    ws.onmessage = (m) => { this.onEvent(String(m.data)).catch((e) => this.log.warn({ err: e.message }, "mattermost: a message failed")); };
    ws.onclose = () => {
      if (this.stopped) return;
      this.log.warn({ retryInMs: this.retry }, "mattermost: disconnected");
      setTimeout(() => this.connect(), this.retry).unref(); this.retry = Math.min(this.retry * 2, 60_000);
    };
    ws.onerror = () => { /* onclose follows */ };
  }
  stop() { this.stopped = true; this.ws?.close(); }
}
