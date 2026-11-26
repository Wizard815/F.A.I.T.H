import type { Board, ChatEvent, FamilyProject, InboxItem, Person, ProjectChange, ThreadView } from "./faith.js";
import type { Settings } from "./store.js";

/** What the page may ask the main process for. The page never sees the key:
 *  every call to FAITH is made by the main process. */
export type State = {
  signedIn: boolean;
  url?: string;
  person?: Person;
  settings: Pick<Settings, "readAloud" | "notifications" | "startAtLogin" | "shortcut" | "layout">;
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
  /** `spoken`: the answer will be read aloud, so FAITH keeps it to a few plain sentences. */
  ask(q: { text: string; images?: string[]; spoken?: boolean }): Promise<string>;
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
  /** Family projects (docs/projects.md). */
  projects(resolved?: boolean): Promise<{ projects: FamilyProject[] }>;
  projectThread(project: string, thread: string): Promise<ThreadView>;
  /** `throwaway`: a private thread that keeps nothing, in your own project only. */
  startThread(project: string, brief: string, title?: string, throwaway?: boolean): Promise<ProjectChange>;
  messageThread(project: string, thread: string, text: string): Promise<ProjectChange>;
  resolveThread(project: string, thread: string, resolved: boolean): Promise<ProjectChange>;
  transcribe(audio: ArrayBuffer, mime: string): Promise<string>;
  speak(text: string): Promise<ArrayBuffer>;
  /** A photo's picture (data URL), fetched by the main process with this computer's key. */
  photo(source: string, id: string): Promise<string>;
  /** Open a photo in Immich, in the browser. */
  openLink(url: string): Promise<void>;
  inbox(): Promise<InboxItem[]>;
  markRead(): Promise<void>;
  onChat(cb: (id: string, e: ChatEvent) => void): () => void;
  onInbox(cb: (items: InboxItem[], unread: number) => void): () => void;
  onStatus(cb: (problem: string | null) => void): () => void;
  onSignedOut(cb: (message: string) => void): () => void;
  /** The global shortcut or the tray's "Ask FAITH": focus the question box. */
  onAsk(cb: () => void): () => void;
  /** A notification or the tray asked to show a tab. */
  onShow(cb: (tab: "ask" | "board" | "projects" | "inbox") => void): () => void;
  /** The tray changed the layout. */
  onLayout(cb: (layout: State["settings"]["layout"]) => void): () => void;
};

export const CHANNELS = [
  "state", "signIn", "signOut", "setSettings", "ask", "stop", "newTopic", "latest", "confirm", "approvals", "decide",
  "dashboard", "transcribe", "speak", "photo", "openLink", "inbox", "markRead", "board", "writeBrief", "addLog", "addProject", "updateProject", "importOrb", "projects", "projectThread", "startThread", "messageThread", "resolveThread",
] as const;
