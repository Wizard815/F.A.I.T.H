import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Person } from "./faith.js";

export type Settings = {
  url?: string;
  person?: Person;
  clientName?: string;          // this computer's key name on FAITH (for signing out)
  conversationId?: string;
  inboxSeen?: number;           // the last inbox item this computer has seen
  readAloud: boolean;
  notifications: boolean;
  startAtLogin: boolean;
  shortcut: string;
};
export const DEFAULTS: Settings = { readAloud: false, notifications: true, startAtLogin: false, shortcut: "CommandOrControl+Alt+F" };

/** The OS keychain (Electron's safeStorage), or a stand-in in tests.
 *  `plainOk`: with no keychain (Linux without a keyring), keep the key in a file only this
 *  account can read, as other command-line tools do. macOS and Windows always have one. */
export type Vault = { available: () => boolean; encrypt: (s: string) => Buffer; decrypt: (b: Buffer) => string; plainOk?: boolean };

/** Settings in a JSON file; the key encrypted by the OS keychain when there is one. Both files
 *  are readable by this account only. The password is never kept. */
export class Store {
  private file: string;
  private keyFile: string;
  private plainFile: string;
  settings: Settings;
  constructor(private dir: string, private vault: Vault) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    this.file = join(dir, "settings.json");
    this.keyFile = join(dir, "faith.key");
    this.plainFile = join(dir, "faith.key.txt");
    let s: Partial<Settings> = {};
    try { s = JSON.parse(readFileSync(this.file, "utf8")); } catch { /* first run */ }
    this.settings = { ...DEFAULTS, ...s };
  }
  set(patch: Partial<Settings>) {
    this.settings = { ...this.settings, ...patch };
    writeFileSync(this.file, JSON.stringify(this.settings, null, 2), { mode: 0o600 });
  }

  /** Where the key goes: the keychain, a file only this account reads, or nowhere. */
  get keeping(): "os" | "file" | "none" { return this.vault.available() ? "os" : this.vault.plainOk ? "file" : "none"; }

  get token(): string | undefined {
    try {
      if (existsSync(this.keyFile) && this.vault.available()) return this.vault.decrypt(readFileSync(this.keyFile));
      if (existsSync(this.plainFile) && this.vault.plainOk) return readFileSync(this.plainFile, "utf8").trim() || undefined;
    } catch { /* a key from another computer account, or a changed keychain: sign in again */ }
    return undefined;
  }
  saveToken(token: string) {
    const how = this.keeping;
    if (how === "none") throw new Error(NO_KEYCHAIN);
    const [file, data] = how === "os" ? [this.keyFile, this.vault.encrypt(token)] : [this.plainFile, token];
    writeFileSync(file, data, { mode: 0o600 });
    chmodSync(file, 0o600);
  }
  forget() {
    rmSync(this.keyFile, { force: true });
    rmSync(this.plainFile, { force: true });
    this.set({ person: undefined, clientName: undefined, conversationId: undefined, inboxSeen: undefined });
  }
}

export const NO_KEYCHAIN = "This computer has no keychain FAITH can use, so it can't keep you signed in. On Linux, install and unlock a keyring (GNOME Keyring or KWallet).";
