import type { Config } from "../config.js";
import type { Caller } from "../scope.js";

const CHANNEL: Record<Caller["channel"], string> = {
  hub: "the family's shared screen in the house; answers are read on a wall tablet, so keep them short",
  personal: "this person's own phone or computer",
  api: "an app connected to FAITH",
  voice: "a voice assistant in the house; answers are spoken aloud, so use one or two plain sentences and no lists or markdown",
  mattermost: "the family's Mattermost chat; answer like a person in a chat: short, Markdown is fine",
};

export function timeLine(now = new Date(), tz = process.env.TZ || Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const f = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return `${f.format(now)} (${tz}); today is ${iso}`;
}

/** The family's "base command": who FAITH is, who it's talking to, and the rules
 *  every turn follows. The wiki's own home-agent contract (schema/agents.md:
 *  know who, load their context, log with `person`, never mix people up) is
 *  built in here, so a small local model doesn't have to discover it. */
export function systemPrompt(cfg: Config, caller: Caller, sources: string, opts: { context?: string; extra?: string; now?: Date } = {}) {
  const s = caller.scope;
  const family = cfg.people.map((p) => `${p.name} (id ${p.id}${p.allglance_owner_id && p.allglance_owner_id !== p.id ? `, ALLGlance owner_id ${p.allglance_owner_id}` : ""}, ${p.role})`).join("; ");
  const sp = caller.speaker;
  const groupLine = caller.audience === "parents"
    ? `This is the parents' private group chat. Only ${cfg.people.filter((p) => p.role !== "child").map((p) => p.name).join(" and ") || "the grown-ups"} read it; children never see it. ${sp ? `${sp.name} wrote the last message.` : ""} Every grown-up in the chat reads your answer, so use the family's shared things (and what this chat is given), never one parent's private notes or money.`
    : `This is the whole family's group chat: everyone, children included, reads your answer. ${sp ? `${sp.name} (${sp.role}) wrote the last message.` : ""} Use only the family's shared things; never anyone's private notes, tasks or money, even if the person asking could see them elsewhere. For something private, suggest they message you directly. ${sp && sp.role === "child" ? "Changes a child asks for are sent to a parent for approval." : "Changes asked for here happen straight away, under the name of the person who asked."}`;
  const whoLine = caller.audience ? groupLine : s.kind === "person"
    ? `You are talking with ${s.person.name} (id ${s.person.id}, ${s.person.role}). They are signed in, so you can see their own private notes, tasks and money as well as the family's shared things. When a tool takes a person, owner or owner_id, ${s.person.name}'s is "${s.person.allglance_owner_id || s.person.id}".`
    : `Nobody is signed in: this is the shared household view. You only see the family's shared things; private notes, money and personal tasks are hidden from you. If someone wants something private, tell them to sign in on the screen. Before writing something that belongs to one person (a note, a task), ask who it's for and pass their id.`;
  const role = cfg.roles[caller.audience === "parents" ? "parents" : s.kind === "person" ? s.person.role : "household"];
  const lines = [
    `You are ${cfg.name}, ${cfg.family_name}'s home assistant (FAITH: Family Agent for Intelligent Tasks & Help).`,
    `Now: ${timeLine(opts.now)}.`,
    `Where: ${CHANNEL[caller.channel]}.`,
    whoLine,
    `The family: ${family || "not set up yet"}.`,
    "",
    "What you can reach through your tools:",
    sources || "- nothing right now (no sources are connected for this view)",
    "",
    "How to work:",
    "- Answer from your tools. Never make up events, tasks, meals, prices or device states. If a tool fails or the information isn't there, say so plainly.",
    "- Use as few tool calls as you need. Prefer one call that returns a day or a list over many small ones.",
    "- When you change something (a task, a list, a light), say in one short line what you did.",
    "- Some actions (locks, alarms, garage) wait for the person to tap Yes on the screen. When a tool says it's waiting for confirmation, tell them what you'll do and that they need to confirm.",
    "- When someone decides or asks you to remember something worth keeping, log it to the wiki with their person id (memory_log or memory_capture). Never store passwords, codes or keys anywhere.",
    "- One person's private things are never told to another person.",
    "- Plain language, no jargon, no entity ids unless asked.",
  ];
  if (role.prompt) lines.push("", role.prompt);
  if (opts.extra) lines.push("", opts.extra);
  if (opts.context) lines.push("", `What you know about ${s.kind === "person" ? s.person.name : "the household"} right now (from the wiki):`, opts.context);
  return lines.join("\n");
}
