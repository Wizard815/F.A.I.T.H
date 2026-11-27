import { envValue, isKid, ntfyTopic, type Config } from "./config.js";
import type { HomeAssistant } from "./connectors/homeassistant.js";
import type { MattermostBot } from "./mattermost.js";
import type { ApprovalEvent } from "./approvals.js";

type Log = { info: (o: any, m?: string) => void; warn: (o: any, m?: string) => void };

/** What an ntfy body may carry. ntfy is a phone notification, often on a lock
 *  screen: no links (a photo share link is a key to the photos), no places,
 *  nothing that looks like a token. The full text waits in FAITH. */
export function ntfySafe(text: string) {
  return String(text || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "(a picture)")                       // Markdown images
    .replace(/\[([^\]]*)\]\((?:https?:)?\/\/[^)]*\)/g, "$1")                   // [words](link): keep the words
    .replace(/\b(?:https?|ftp):\/\/\S+/gi, "(link in FAITH)")
    .replace(/-?\d{1,3}\.\d{3,}\s*,\s*-?\d{1,3}\.\d{3,}/g, "(a place)")          // 51.5072, -0.1276
    .replace(/\b(?:tk_|sk-|ghp_|xox[a-z]-)?[A-Za-z0-9_-]{32,}\b/g, "(hidden)")      // token-looking strings
    .slice(0, 1000);
}

/** Getting a message to people: Mattermost (the family / parents chats, or a
 *  person's DM), their phones through Home Assistant's mobile app, and ntfy
 *  (each person's own topic) when notifications.ntfy is set.
 *  Approval requests reach the approvers' phones with Approve / Deny buttons;
 *  the HA integration turns a tap back into a decision by that HA user. */
export class Notifier {
  bot?: MattermostBot;
  constructor(private cfg: () => Config, private ha: HomeAssistant | undefined, private log: Log, private env: NodeJS.ProcessEnv = process.env) {}

  /** One ntfy message to one topic. Never throws: a down ntfy mustn't stop the other ways. */
  private async ntfy(topic: string, title: string, message: string, opts: { priority?: number; tags?: string[] } = {}) {
    const n = this.cfg().notifications.ntfy;
    if (!n) return false;
    const token = envValue(n.token_env, this.env);
    const click = this.cfg().public_url;
    try {
      const r = await fetch(`${n.url}/`, {
        method: "POST", signal: AbortSignal.timeout(8000),
        headers: { "content-type": "application/json", ...(token ? { authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ topic, title: ntfySafe(title).slice(0, 120), message: ntfySafe(message) || title, ...(opts.priority ? { priority: opts.priority } : {}), ...(opts.tags ? { tags: opts.tags } : {}), ...(click ? { click } : {}) }),
      });
      if (!r.ok) {
        const why = r.status === 401 || r.status === 403 ? `ntfy refused the token (${r.status}): give ${n.token_env || "token_env"} write access to ${topic}` : `ntfy answered ${r.status}`;
        this.log.warn({ topic }, why);
        return false;
      }
      return true;
    } catch (e: any) { this.log.warn({ topic, err: e.message }, `ntfy at ${n.url} isn't answering`); return false; }
  }
  /** A person's own ntfy topic: nobody else's notification ever goes there. */
  private async ntfyPerson(personId: string, title: string, message: string, opts?: { priority?: number; tags?: string[] }) {
    const n = this.cfg().notifications.ntfy;
    if (!n || !this.cfg().people.some((p) => p.id === personId)) return false;
    return this.ntfy(ntfyTopic(n, personId), title, message, opts);
  }

  /** A push to one person's phones. */
  async push(personId: string, title: string, message: string, data?: Record<string, unknown>) {
    const p = this.cfg().people.find((x) => x.id === personId);
    if (!p?.ha_notify?.length || !this.ha) return 0;
    let n = 0;
    for (const svc of p.ha_notify) {
      const [domain, service] = svc.split(".");
      try { await this.ha.callService(domain, service, { title, message, ...(data ? { data } : {}) }); n++; }
      catch (e: any) { this.log.warn({ person: p.id, service: svc, err: e.message }, "push failed"); }
    }
    return n;
  }

  /** Keeps a copy for the person's FAITH apps (set by app.ts: the inbox). */
  inbox?: (personId: string, item: { title: string; text: string; kind: string; ref?: string }) => void;

  /** Who's home (set by app.ts), for to: "home". */
  presence?: { whoIsHome(): { home: { id: string }[] } };

  /** to: "family" | "parents" | "home" (whoever is home) | a person id. Returns where it went. */
  async send(to: string, text: string, opts: { title?: string; from?: string } = {}): Promise<string[]> {
    const sent: string[] = [], title = opts.title || this.cfg().name;
    if (to === "home") {
      for (const p of this.presence?.whoIsHome().home ?? []) sent.push(...(await this.send(p.id, text, opts)));
      return sent;
    }
    const people = this.cfg().people;
    // The same message waits in each recipient's inbox, for their FAITH apps.
    for (const p of to === "family" ? people : to === "parents" ? people.filter((x) => !isKid(x.role)) : people.filter((x) => x.id === to)) {
      this.inbox?.(p.id, { title, text, kind: "message" });   // not counted as "reached": they may have no app
    }
    const say = opts.from && !["routine", "faith"].includes(opts.from) ? `${text}\n\n_from ${people.find((p) => p.id === opts.from)?.name ?? opts.from}_` : text;
    if (to === "family" || to === "parents") {
      const ch = to === "family" ? this.bot?.familyId : this.bot?.parentsId;
      if (ch) { await this.bot!.post(ch, say); sent.push(`mattermost:${to}`); }
      else for (const p of people.filter((x) => to === "family" || !isKid(x.role))) if (await this.push(p.id, title, text)) sent.push(`push:${p.id}`);
      // ntfy: the family's messages to the household topic; the parents' to each grown-up's own topic, never a kid's.
      const n = this.cfg().notifications.ntfy;
      if (n && to === "family" && n.household_topic && (await this.ntfy(n.household_topic, title, text))) sent.push("ntfy:household");
      if (n && to === "parents") for (const p of people.filter((x) => !isKid(x.role))) if (await this.ntfyPerson(p.id, title, text)) sent.push(`ntfy:${p.id}`);
      return sent;
    }
    const dm = this.bot?.dmOf(to);
    if (dm) { await this.bot!.post(dm, say); sent.push(`mattermost:${to}`); }
    if (await this.push(to, title, text)) sent.push(`push:${to}`);
    if (await this.ntfyPerson(to, title, opts.from && !["routine", "faith", "board"].includes(opts.from) ? `${text}\n\nfrom ${people.find((p) => p.id === opts.from)?.name ?? opts.from}` : text)) sent.push(`ntfy:${to}`);
    return sent;
  }

  /** New approval requests: a push with buttons to every grown-up with a phone set up,
   *  and a note on each approver's own ntfy topic (deciding happens in FAITH). */
  async onApproval(e: ApprovalEvent) {
    if (e.kind !== "created") return;
    const approvers = this.cfg().people.filter((p) => this.cfg().approvals.approvers.includes(p.role) && !isKid(p.role));
    const asked = `${e.request.summary}\nAsked by ${e.request.requested_by.replace(/^household on /, "the ")}.`;
    for (const p of approvers) await this.ntfyPerson(p.id, "Waiting for approval", `${asked}\nApprove or deny it in FAITH.`, { priority: 4, tags: ["question"] });
    for (const p of approvers) this.inbox?.(p.id, { title: "Waiting for approval", text: `${e.request.summary}\nAsked by ${e.request.requested_by.replace(/^household on /, "the ")}.`, kind: "approval", ref: e.request.id });
    for (const p of approvers) {
      await this.push(p.id, "Waiting for approval", `${e.request.summary}\nAsked by ${e.request.requested_by.replace(/^household on /, "the ")}.`, {
        tag: `faith-${e.request.id}`, // a later push replaces this one on the phone
        actions: [{ action: `FAITH_APPROVE_${e.request.id}`, title: "Approve" }, { action: `FAITH_DENY_${e.request.id}`, title: "Deny" }],
      });
    }
  }
}
