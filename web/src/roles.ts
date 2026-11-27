/** The four tiers (server/src/config.ts). Labels for people, not config names. */
export const ROLE_LABELS: Record<string, string> = { admin: "Admin", parent: "Parent", "kid-pro": "Kid (teen)", "kid-lite": "Kid (young)", household: "Shared screen", parents: "Parents' chat" };
export const roleLabel = (r: string) => ROLE_LABELS[r] ?? r;
export const isKid = (r: string | undefined) => r === "kid-pro" || r === "kid-lite";
