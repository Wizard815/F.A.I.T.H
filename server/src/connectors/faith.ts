import type { Config } from "../config.js";
import type { Approvals } from "../approvals.js";
import type { Notifier } from "../notifier.js";
import { RewardsError, type Rewards } from "../rewards.js";
import { policyOf, type Caller } from "../scope.js";
import type { Skills } from "../skills.js";
import type { Connector, Tool } from "./types.js";

/** FAITH's own tools: skills, points and rewards, and sending someone a
 *  message. They go through the same policy and approval checks as every
 *  other source's tools. */
export class FaithTools implements Connector {
  id = "faith";
  approvals?: Approvals; notifier?: Notifier;
  constructor(private cfg: () => Config, private skills: Skills, private rewards: Rewards) {}
  describe() { return "FAITH itself: skills (recipes for bigger jobs), the children's points and rewards, and messages to the family"; }

  /** Who a points or reward call is about: a child always means themselves. */
  private subject(caller: Caller, asked?: string) {
    const me = caller.scope.kind === "person" ? caller.scope.person : caller.speaker;
    if (me?.role === "child") return me.id;
    if (asked) {
      const k = asked.toLowerCase();
      const p = this.cfg().people.find((x) => x.id === k || x.name.toLowerCase() === k);
      if (!p) throw new RewardsError(404, `No one called ${asked}.`);
      return p.id;
    }
    if (me) return me.id;
    throw new RewardsError(400, "Who is it for? Pass person.");
  }
  private by(caller: Caller) { return caller.speaker ? caller.speaker.id : caller.scope.kind === "person" ? caller.scope.person.id : caller.label; }
  private isChild(caller: Caller) { return (caller.scope.kind === "person" ? caller.scope.person.role : caller.speaker?.role) === "child"; }
  /** A grown-up is asking (signed in, or speaking in a chat); anyone else needs a parent's OK. */
  private needsOk(caller: Caller) {
    if (this.isChild(caller)) return true;
    if (caller.scope.kind === "household") return !(caller.speaker && this.cfg().approvals.approvers.includes(caller.speaker.role));
    return false;
  }
  private guard<T>(fn: () => Promise<T> | T) { return Promise.resolve().then(fn).catch((e) => { if (e instanceof RewardsError) return { error: e.message } as any; throw e; }); }

  async tools(caller: Caller): Promise<Tool[]> {
    const pol = policyOf(caller), skills = this.skills.forPolicy(pol);
    const T: Tool[] = [];
    const add = (t: Omit<Tool, "connector">) => T.push({ ...t, connector: this.id });

    const short = (d: string) => (d.length > 220 ? `${d.slice(0, 217).replace(/\s+\S*$/, "")}…` : d);
    if (skills.length) add({ name: "skill_load", write: false,
      description: `Load a skill: step-by-step instructions for a bigger job. Load it first, then follow it. Some skills point to extra files: load one by passing file. Skills: ${skills.map((s) => `${s.name} (${short(s.description)})`).join("; ")}`,
      parameters: { type: "object", properties: { name: { type: "string", enum: skills.map((s) => s.name) }, file: { type: "string", description: "One of the skill's files (references), e.g. references/triggers-and-conditions.md" } }, required: ["name"], additionalProperties: false },
      run: async (a) => {
        const s = skills.find((x) => x.name === a?.name);
        if (!s) return { error: `No skill called ${a?.name}.` };
        if (a?.file) { try { return { skill: s.name, file: a.file, text: this.skills.reference(s.name, String(a.file)).slice(0, 30_000) }; } catch (e: any) { return { error: e.message }; } }
        return { skill: s.name, title: s.title, instructions: s.body.slice(0, 30_000), ...(s.references?.length ? { files: s.references } : {}) };
      } });

    add({ name: "points_balance", write: false, description: "How many points each child (or one person) has.",
      parameters: { type: "object", properties: { person: { type: "string" } }, additionalProperties: false },
      run: (a) => this.guard(() => {
        if (this.isChild(caller) || a?.person) { const id = this.subject(caller, a?.person); return { person: id, points: this.rewards.balance(id), recent: this.rewards.history(id, 5).map((h) => ({ points: h.delta, reason: h.reason })) }; }
        return { balances: this.rewards.balances().filter((b) => b.role === "child" || b.points !== 0) };
      }) });
    add({ name: "rewards_list", write: false, description: "Jobs that earn points (activities) and rewards points can buy.",
      parameters: { type: "object", properties: {}, additionalProperties: false },
      run: async () => ({ activities: this.rewards.activities().map((a) => ({ id: a.id, name: a.name, points: a.points })), rewards: this.rewards.rewards().map((r) => ({ id: r.id, name: r.name, cost: r.cost, ...(r.kind === "money" ? { money: r.amount } : {}) })) }) });

    const awardTool: Tool = { name: "points_award", connector: this.id, write: true, explain: (a) => `give ${a?.person} ${a?.points ?? "points"} for ${a?.reason || a?.activity}`,
      description: "Give a child points: for an activity (by name or id) or a number of points (0.5, 1 or 2) with a reason. Grown-ups only.",
      parameters: { type: "object", properties: { person: { type: "string" }, activity: { type: "string" }, points: { type: "number" }, reason: { type: "string" } }, required: ["person"], additionalProperties: false },
      run: (a) => this.guard(() => this.rewards.award(this.subject(caller, a?.person), { activity: a?.activity, points: a?.points, reason: a?.reason }, this.by(caller))) };
    T.push(awardTool);
    const grantTool: Tool = { name: "reward_grant", connector: this.id, write: true, explain: (a) => `let ${a?.person} have "${a?.reward}"`,
      description: "Give a child a reward now, spending their points. Grown-ups only.",
      parameters: { type: "object", properties: { person: { type: "string" }, reward: { type: "string" } }, required: ["person", "reward"], additionalProperties: false },
      run: (a) => this.guard(() => this.rewards.grant(this.subject(caller, a?.person), String(a?.reward || ""), this.by(caller))) };
    T.push(grantTool);

    // A child's claim or reward becomes a request a parent approves; a grown-up's just happens.
    add({ name: "points_claim", write: true, selfApproves: true, explain: (a) => `points for ${a?.person ?? "a child"}: ${a?.activity}`,
      description: "A child says they did a job: ask for its points (a parent approves).",
      parameters: { type: "object", properties: { activity: { type: "string" }, person: { type: "string" } }, required: ["activity"], additionalProperties: false },
      run: (a) => this.guard(async () => {
        const who = this.subject(caller, a?.person), act = this.rewards.activities().find((x) => x.id === a?.activity || x.name.toLowerCase().includes(String(a?.activity || "").toLowerCase()));
        if (!act) return { error: `No job called "${a?.activity}". Jobs: ${this.rewards.activities().map((x) => x.name).join(", ")}` };
        if (!this.needsOk(caller)) return this.rewards.award(who, { activity: act.id }, this.by(caller));
        if (this.isChild(caller) && !act.kids_can_claim) return { error: `${act.name} is one a parent gives, not one to claim.` };
        const r = this.approvals!.create(caller, awardTool, { person: who, activity: act.name });
        return { status: "sent_for_approval", action: `${act.points} point${act.points === 1 ? "" : "s"} for ${act.name}`, code: r.id.slice(0, 5), note: "A parent will check and approve it." };
      }) });
    add({ name: "reward_redeem", write: true, selfApproves: true, explain: (a) => `a reward for ${a?.person ?? "a child"}: ${a?.reward}`,
      description: "A child wants to spend points on a reward (a parent approves).",
      parameters: { type: "object", properties: { reward: { type: "string" }, person: { type: "string" } }, required: ["reward"], additionalProperties: false },
      run: (a) => this.guard(async () => {
        const who = this.subject(caller, a?.person), r = this.rewards.rewards().find((x) => x.id === a?.reward || x.name.toLowerCase().includes(String(a?.reward || "").toLowerCase()));
        if (!r) return { error: `No reward called "${a?.reward}".` };
        const have = this.rewards.balance(who);
        if (have < r.cost) return { error: `Not enough points yet: ${have} of ${r.cost}.` };
        if (!this.needsOk(caller)) return this.rewards.grant(who, r.id, this.by(caller));
        const req = this.approvals!.create(caller, grantTool, { person: who, reward: r.name });
        return { status: "sent_for_approval", action: `${r.name} for ${r.cost} points`, code: req.id.slice(0, 5), note: "A parent will approve it." };
      }) });

    add({ name: "message_send", write: true, explain: (a) => `send ${a?.to} a message: "${String(a?.text || "").slice(0, 60)}"`,
      description: "Send a short message: to 'family' (the family chat), 'parents' (the grown-ups' chat), or one person (by name): their FAITH chat and their phone.",
      parameters: { type: "object", properties: { to: { type: "string" }, text: { type: "string" } }, required: ["to", "text"], additionalProperties: false },
      run: async (a) => {
        if (!this.notifier) return { error: "Messages aren't set up." };
        const to = String(a?.to || "").toLowerCase(), p = this.cfg().people.find((x) => x.id === to || x.name.toLowerCase() === to);
        if (to === "parents" && this.isChild(caller)) return { error: "Children can't message the parents' chat; message a parent directly." };
        const sent = await this.notifier.send(p ? p.id : to, String(a?.text || ""), { from: this.by(caller) });
        return sent.length ? { ok: true, sent_to: sent } : { error: `Couldn't reach ${a?.to}: no chat or phone is set up for them.` };
      } });
    return T;
  }
}
