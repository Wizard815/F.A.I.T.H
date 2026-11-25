import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, Notification, safeStorage, session, shell, Tray } from "electron";
import { hostname } from "node:os";
import { join } from "node:path";
import { cleanUrl, Faith, FaithError, SignedOut, type InboxItem } from "./faith.js";
import type { State } from "./shared.js";
import { NO_KEYCHAIN, Store } from "./store.js";
import { InboxWatch } from "./watch.js";

// FAITH_DESKTOP_DATA: a separate profile (tests, or a second person on one computer account).
if (process.env.FAITH_DESKTOP_DATA) app.setPath("userData", process.env.FAITH_DESKTOP_DATA);
const TESTING = !!process.env.FAITH_DESKTOP_TEST;
if (!TESTING && !app.requestSingleInstanceLock()) app.quit();

const ROOT = join(__dirname, "..");
const icon = (name: string) => nativeImage.createFromPath(join(ROOT, "build", name));

let win: BrowserWindow | undefined, tray: Tray | undefined, quitting = false;
let store: Store, faith: Faith | undefined, watch: InboxWatch;
const inbox: InboxItem[] = [];
let unread = 0;
const asks = new Map<string, AbortController>();

const send = (ch: string, ...a: unknown[]) => { if (win && !win.isDestroyed()) win.webContents.send(`faith:${ch}`, ...a); };
const state = (): State => ({
  signedIn: !!faith?.token, url: store.settings.url, person: store.settings.person,
  settings: { readAloud: store.settings.readAloud, notifications: store.settings.notifications, startAtLogin: store.settings.startAtLogin, shortcut: store.settings.shortcut },
  keyring: store.keeping === "os" ? "os" : "file", platform: process.platform,
});

function show(tab?: "ask" | "board" | "inbox") {
  if (!win || win.isDestroyed()) createWindow();
  win!.show(); win!.focus();
  if (tab) send("show", tab);
}

function createWindow() {
  win = new BrowserWindow({
    width: 480, height: 760, minWidth: 380, minHeight: 520, show: !TESTING || !!process.env.FAITH_DESKTOP_SHOW,
    title: "FAITH", icon: icon("icon.png"), backgroundColor: "#18110c", autoHideMenuBar: true,
    webPreferences: { preload: join(__dirname, "preload.cjs"), contextIsolation: true, sandbox: true, nodeIntegration: false, spellcheck: true },
  });
  win.loadFile(join(ROOT, "dist", "renderer", "index.html"));
  // Nothing but the app itself in this window: links open in the browser.
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:\/\//.test(url)) void shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!url.startsWith("file://")) { e.preventDefault(); if (/^https?:\/\//.test(url)) void shell.openExternal(url); } });
  // Closing the window keeps FAITH in the tray, for notifications. Quit from the tray.
  win.on("close", (e) => { if (!quitting && tray) { e.preventDefault(); win!.hide(); } });
}

function setTray() {
  const n = unread;
  tray?.setToolTip(n ? `FAITH: ${n} new` : "FAITH");
  tray?.setContextMenu(Menu.buildFromTemplate([
    { label: "Ask FAITH", accelerator: store.settings.shortcut, click: () => { show("ask"); send("askFocus"); } },
    { label: n ? `Inbox (${n} new)` : "Inbox", click: () => show("inbox") },
    { label: "Board", click: () => show("board") },
    { type: "separator" },
    { label: "Notifications", type: "checkbox", checked: store.settings.notifications, click: (i) => setSettings({ notifications: i.checked }) },
    { label: "Start when I sign in to this computer", type: "checkbox", checked: store.settings.startAtLogin, click: (i) => setSettings({ startAtLogin: i.checked }) },
    { type: "separator" },
    { label: "Quit FAITH", click: () => { quitting = true; app.quit(); } },
  ]));
  if (process.platform === "darwin") app.dock?.setBadge(n ? String(n) : "");
  else app.setBadgeCount?.(n);
}

function setShortcut(next: string, prev?: string) {
  if (prev) globalShortcut.unregister(prev);
  if (!next) return true;
  try { return globalShortcut.register(next, () => { show("ask"); send("askFocus"); }); } catch { return false; }
}

function setSettings(patch: Partial<State["settings"]>) {
  const prev = store.settings.shortcut;
  store.set(patch);
  if (patch.startAtLogin !== undefined && !TESTING) app.setLoginItemSettings({ openAtLogin: patch.startAtLogin, args: ["--hidden"] });
  if (patch.shortcut !== undefined && patch.shortcut !== prev && !setShortcut(patch.shortcut, prev)) {
    store.set({ shortcut: prev }); setShortcut(prev);
    throw new FaithError(`"${patch.shortcut}" didn't work as a shortcut (another app may use it). The old one still works.`);
  }
  setTray();
  return state();
}

function signedOut(message: string) {
  watch.stop();
  store.forget(); faith = undefined; inbox.length = 0; unread = 0; setTray();
  send("signedOut", message);
}

function gotItems(items: InboxItem[], fresh: boolean) {
  inbox.unshift(...[...items].reverse());
  inbox.splice(100);
  if (fresh) {
    unread += items.length;
    if (store.settings.notifications && Notification.isSupported()) {
      for (const it of items.slice(-3)) {
        const n = new Notification({ title: it.title || "FAITH", body: it.text, icon: icon("icon.png"), silent: false });
        n.on("click", () => show(it.kind === "approval" ? "board" : "inbox"));
        n.show();
      }
    }
  }
  setTray();
  send("inboxItems", inbox, unread);
}

/** Runs a call to FAITH; a removed key signs this computer out. Errors reach the page as plain words. */
async function guarded<T>(fn: (f: Faith) => Promise<T>): Promise<T> {
  if (!faith?.token) throw new FaithError("Sign in first.");
  try { return await fn(faith); } catch (e) {
    if (e instanceof SignedOut) signedOut(e.message);
    throw e;
  }
}
const handle = (ch: string, fn: (...a: any[]) => unknown) =>
  ipcMain.handle(`faith:${ch}`, async (_e, ...a) => {
    try { return await fn(...a); } catch (e: any) {
      // Electron passes only the message on: keep it a sentence for people.
      throw new Error(e instanceof FaithError ? e.message : e?.message || "Something went wrong.");
    }
  });

function registerIpc() {
  handle("state", () => state());
  handle("signIn", async (url: string, person: string, password: string) => {
    const base = cleanUrl(url);
    if (store.keeping === "none") throw new FaithError(NO_KEYCHAIN);   // before FAITH makes a key it couldn't keep
    const f = new Faith(base);
    const d = await f.signIn(person, password, `${hostname().split(".")[0] || "computer"} desktop`);
    try { store.saveToken(d.token); } catch (e) { await f.signOut(d.name).catch(() => {}); throw e; }
    store.set({ url: base, person: d.person, clientName: d.name, conversationId: undefined, inboxSeen: undefined });
    faith = f;
    watch.start();
    return state();
  });
  handle("signOut", async () => {
    try { if (faith && store.settings.clientName) await faith.signOut(store.settings.clientName); } catch (e) {
      if (!(e instanceof SignedOut)) throw new FaithError(`Couldn't remove this computer's key on FAITH (${(e as Error).message}). Try again, or remove it on FAITH's admin page.`);
    }
    signedOut("Signed out of this computer.");
    return state();
  });
  handle("setSettings", (patch) => setSettings(patch));
  handle("newTopic", () => { store.set({ conversationId: undefined }); });
  handle("latest", () => guarded(async (f) => {
    const d = await f.latest();
    if (d.conversation_id) store.set({ conversationId: d.conversation_id });
    return d.messages;
  }));
  handle("ask", (q: { text: string; images?: string[] }) => {
    const id = Math.random().toString(36).slice(2), ctl = new AbortController();
    asks.set(id, ctl);
    void guarded((f) => f.chat({ text: q.text, images: q.images?.slice(0, 4), conversation_id: store.settings.conversationId }, (e) => {
      if (e.type === "conversation") store.set({ conversationId: e.id });
      send("chat", id, e);
    }, ctl.signal))
      .catch((e) => send("chat", id, { type: "error", message: e instanceof FaithError ? e.message : "Something went wrong." }))
      .finally(() => asks.delete(id));
    return id;
  });
  handle("stop", (id: string) => { asks.get(id)?.abort(); });
  handle("confirm", (id: string, approve: boolean) => guarded((f) => f.confirm(id, approve)));
  handle("approvals", () => guarded((f) => f.approvals()));
  handle("decide", (id: string, approve: boolean) => guarded((f) => f.decide(id, approve)));
  handle("dashboard", () => guarded((f) => f.dashboard()));
  handle("board", () => guarded((f) => f.board()));
  handle("writeBrief", () => guarded((f) => f.writeBrief()));
  handle("addLog", (text: string, project?: string) => guarded((f) => f.addLog(String(text), project ? String(project) : undefined)));
  handle("addProject", (name: string, status?: string, next?: string) => guarded((f) => f.addProject(String(name), status, next)));
  handle("updateProject", (name: string, patch: any) => guarded((f) => f.updateProject(String(name), { status: patch?.status, next: patch?.next, starred: patch?.starred, archived: patch?.archived })));
  handle("importOrb", () => guarded((f) => f.importOrb()));
  handle("transcribe", (audio: ArrayBuffer, mime: string) => guarded((f) => f.transcribe(new Uint8Array(audio), mime)));
  handle("speak", (text: string) => guarded(async (f) => (await f.speak(text)).buffer));
  handle("photo", (source: string, id: string) => guarded((f) => f.photo(source, id)));
  handle("openLink", (url: string) => { if (/^https?:\/\//.test(url)) return shell.openExternal(url); });
  handle("inbox", () => inbox);
  handle("markRead", () => { unread = 0; setTray(); });
}

app.whenReady().then(() => {
  store = new Store(app.getPath("userData"), {
    available: () => safeStorage.isEncryptionAvailable(),
    encrypt: (s) => safeStorage.encryptString(s),
    decrypt: (b) => safeStorage.decryptString(b),
    plainOk: process.platform === "linux",
  });
  const token = store.token;
  if (token && store.settings.url) faith = new Faith(store.settings.url, token);
  watch = new InboxWatch(() => faith, { get: () => store.settings.inboxSeen, set: (id) => store.set({ inboxSeen: id }) },
    { items: gotItems, status: (p) => send("status", p), signedOut });

  // The microphone (push-to-talk) is the only permission the page gets.
  session.defaultSession.setPermissionRequestHandler((_wc, perm, cb) => cb(perm === "media"));
  session.defaultSession.setPermissionCheckHandler((_wc, perm) => perm === "media");

  registerIpc();
  createWindow();
  tray = new Tray(icon(process.platform === "darwin" ? "tray.png" : "tray@2x.png").resize({ width: 22, height: 22 }));
  tray.on("click", () => (win?.isVisible() && win.isFocused() ? win.hide() : show()));
  setTray();
  setShortcut(store.settings.shortcut);
  if (faith) watch.start();
  if (!process.argv.includes("--hidden") && !TESTING) win!.show();
});
app.on("second-instance", () => show());
app.on("activate", () => show());
app.on("before-quit", () => { quitting = true; watch?.stop(); });
app.on("will-quit", () => globalShortcut.unregisterAll());
app.on("window-all-closed", () => { if (!tray) app.quit(); });
