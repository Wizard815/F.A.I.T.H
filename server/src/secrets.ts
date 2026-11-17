import { createHash, randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";

/** PINs and passwords: scrypt with a per-secret salt. Tokens: random, stored as sha256. */
export function hashSecret(secret: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(secret, salt, 32, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}
export function verifySecret(secret: string, stored: string | null | undefined) {
  if (!stored) return false;
  const [kind, n, salt, hash] = stored.split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const want = Buffer.from(hash, "base64url");
  const got = scryptSync(secret, Buffer.from(salt, "base64url"), want.length, { N: Number(n) || 16384, r: 8, p: 1 });
  return timingSafeEqual(want, got);
}
export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export const newToken = (prefix: string) => `${prefix}${randomBytes(24).toString("base64url")}`;
export const newId = () => randomBytes(12).toString("base64url");
export const newPairCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");

export const validPin = (pin: string) => /^\d{4,8}$/.test(pin);
export const validPassword = (pw: string) => typeof pw === "string" && pw.length >= 8 && pw.length <= 200;
