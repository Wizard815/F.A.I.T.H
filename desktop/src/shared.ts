import type { Board, ChatEvent, InboxItem, Person } from "./faith.js";
import type { Settings } from "./store.js";

/** What the page may ask the main process for. The page never sees the key:
 *  every call to FAITH is made by the main process. */
export type State = {
  signedIn: boolean;
  url?: string;
  person?: Person;
  settings: Pick<Settings, "readAloud" | "notifications" | "startAtLogin" | "shortcut">;
  /** "os": the key is encrypted by the OS keychain; "file": no keyring (Linux), a file only this user can read. */
  keyring: "os" | "file";
  platform: string;
};

export type FaithBridge = {
  state(): Promise<State>;
  signIn(url: string, person: string, password: string): Promise<State>;
  signOut(): Promise<State>;
  setSettings(patch: Partial<State["settings"]>): Promise<State>;
  /** Starts a question; its events come through onChat with this id. */
  ask(q: { text: string; images?: string[] }): Promise<string>;
  stop(id: string): Promise<void>;
  newTopic(): Promise<void>;
  latest(): Promise<{ role: string; content: string }[]>;
  confirm(id: string, approve: boolean): Promise<{ ok: boolean; text: string }>;
  approvals(): Promise<{ can_approve: boolean; requests: any[] }>;
  decide(id: string, approve: boolean): Promise<unknown>;
  dashboard(): Promise<{ cards: any[] }>;
  board(): Promise<Board>;
  writeBrief(): Promise<{ day: string; text: string }>;
  addLog(text: string, project?: string): Promise<unknown>;
  addProject(name: string, status?: string, next?: string): Promise<unknown>;
  updateProject(name: string, patch: { status?: string; next?: string; starred?: boolean; archived?: boolean }): Promise<unknown>;
  importOrb(): Promise<{ projects: number; logs: number; skipped: string[] }>;
  transcribe(audio: ArrayBuffer, mime: string): Promise<string>;
  speak(text: string): Promise<ArrayBuffer>;
  inbox(): Promise<InboxItem[]>;
  markRead(): Promise<void>;
  onChat(cb: (id: string, e: ChatEvent) => void): () => void;
  onInbox(cb: (items: InboxItem[], unread: number) => void): () => void;
  onStatus(cb: (problem: string | null) => void): () => void;
  onSignedOut(cb: (message: string) => void): () => void;
  /** The global shortcut or the tray's "Ask FAITH": focus the question box. */
  onAsk(cb: () => void): () => void;
  /** A notification or the tray asked to show a tab. */
  onShow(cb: (tab: "ask" | "board" | "inbox") => void): () => void;
};

export const CHANNELS = [
  "state", "signIn", "signOut", "setSettings", "ask", "stop", "newTopic", "latest", "confirm", "approvals", "decide",
  "dashboard", "transcribe", "speak", "inbox", "markRead", "board", "writeBrief", "addLog", "addProject", "updateProject", "importOrb",
] as const;
