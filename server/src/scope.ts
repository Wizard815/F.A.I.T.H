import type { Config, Person, PolicyName } from "./config.js";

/** Whose eyes a request has. Household = nobody signed in: the blanket family
 *  tokens, which the backends themselves stop from reading anyone's private
 *  things. Person = one signed-in member: their own tokens. */
export type Scope = { kind: "household" } | { kind: "person"; person: Person };

/** Where the request comes from. Confirmations need a screen (hub/personal). */
export type Channel = "hub" | "personal" | "api" | "voice";

export type Caller = {
  scope: Scope;
  channel: Channel;
  deviceId?: string;
  sessionHash?: string;
  label: string;           // for logs: "wizard on kitchen", "household on kitchen", "token:ha"
};

export const policyName = (s: Scope): PolicyName => (s.kind === "person" ? s.person.role : "household");
export const scopeKey = (s: Scope) => (s.kind === "person" ? `person:${s.person.id}` : "household");
export const who = (s: Scope) => (s.kind === "person" ? s.person.id : "household");

export function personById(cfg: Config, id: string | undefined | null) {
  return id ? cfg.people.find((p) => p.id === id) : undefined;
}
