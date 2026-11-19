import type { Config, Person, PolicyName } from "./config.js";

/** Whose eyes a request has. Household = nobody signed in: the blanket family
 *  tokens, which the backends themselves stop from reading anyone's private
 *  things. Person = one signed-in member: their own tokens. */
export type Scope = { kind: "household" } | { kind: "person"; person: Person };

/** Where the request comes from. Confirmations need someone who can answer
 *  (a screen, or a Mattermost chat where they reply "yes"). */
export type Channel = "hub" | "personal" | "api" | "voice" | "mattermost" | "ha" | "routine";

export type Caller = {
  scope: Scope;
  channel: Channel;
  deviceId?: string;
  sessionHash?: string;
  label: string;           // for logs: "wizard on kitchen", "household on kitchen", "token:ha"
  /** Group chats: who wrote the message. The scope stays "household" because
   *  everyone in the chat reads the answer; the speaker only decides whose
   *  changes need approval. */
  speaker?: Person;
  /** Group chats: who reads the answer. */
  audience?: "family" | "parents";
};

/** The role policy that applies: the parents' chat has its own. */
export const policyOf = (c: Caller): PolicyName => (c.audience === "parents" ? "parents" : policyName(c.scope));

export const policyName = (s: Scope): PolicyName => (s.kind === "person" ? s.person.role : "household");
export const scopeKey = (s: Scope) => (s.kind === "person" ? `person:${s.person.id}` : "household");
export const who = (s: Scope) => (s.kind === "person" ? s.person.id : "household");

/** Who is speaking on a shared channel, for logs and approval requests:
 *  "Sam in the family chat" (Mattermost), or "Sam (by voice)" (a screen or satellite). */
export const speakerLabel = (c: Caller, by: "id" | "name" = "name") => {
  if (!c.speaker) return undefined;
  const n = by === "id" ? c.speaker.id : c.speaker.name;
  return c.channel === "mattermost" ? `${n} in the ${c.audience} chat` : `${n} (by voice)`;
};

export function personById(cfg: Config, id: string | undefined | null) {
  return id ? cfg.people.find((p) => p.id === id) : undefined;
}
