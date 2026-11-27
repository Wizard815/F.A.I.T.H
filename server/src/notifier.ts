import { isKid, type Config } from "./config.js";
import type { HomeAssistant } from "./connectors/homeassistant.js";
import type { MattermostBot } from "./mattermost.js";
import type { ApprovalEvent } from "./approvals.js";

type Log = { info: (o: any, m?: string) => void; warn: (o: any, m?: string) => void };

/** Getting a message to people: Mattermost (the family / parents chats, or a
 *  person's DM) and their phones through Home Assistant's mobile app.
 *  Approval requests reach the approvers' phones with Approve / Deny buttons;
 *  the HA integration turns a tap back into a decision by that HA user. */
export class Notifier {
  bot?: MattermostBot;
  constructor(private cfg: () => Config, private ha: HomeAssistant | undefined, private log: Log) {}

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
      return sent;
    }
    const dm = this.bot?.dmOf(to);
    if (dm) { await this.bot!.post(dm, say); sent.push(`mattermost:${to}`); }
    if (await this.push(to, title, text)) sent.push(`push:${to}`);
    return sent;
  }

  /** New approval requests: a push with buttons to every grown-up with a phone set up. */
  async onApproval(e: ApprovalEvent) {
    if (e.kind !== "created") return;
    const approvers = this.cfg().people.filter((p) => this.cfg().approvals.approvers.includes(p.role));
    for (const p of approvers) this.inbox?.(p.id, { title: "Waiting for approval", text: `${e.request.summary}\nAsked by ${e.request.requested_by.replace(/^household on /, "the ")}.`, kind: "approval", ref: e.request.id });
    for (const p of approvers) {
      await this.push(p.id, "Waiting for approval", `${e.request.summary}\nAsked by ${e.request.requested_by.replace(/^household on /, "the ")}.`, {
        tag: `faith-${e.request.id}`, // a later push replaces this one on the phone
        actions: [{ action: `FAITH_APPROVE_${e.request.id}`, title: "Approve" }, { action: `FAITH_DENY_${e.request.id}`, title: "Deny" }],
      });
    }
  }
}
