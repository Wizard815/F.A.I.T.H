import { contextBridge, ipcRenderer, type IpcRendererEvent } from "electron";

// Only these calls reach the main process; the page gets no Node, no Electron, no key.
const CHANNELS = ["state", "signIn", "signOut", "setSettings", "ask", "stop", "newTopic", "latest", "confirm", "approvals", "decide",
  "dashboard", "transcribe", "speak", "photo", "openLink", "inbox", "markRead", "board", "writeBrief", "addLog", "addProject", "updateProject", "importOrb"];

const call = (ch: string) => (...args: unknown[]) => ipcRenderer.invoke(`faith:${ch}`, ...args);
const listen = (ch: string) => (cb: (...a: any[]) => void) => {
  const f = (_e: IpcRendererEvent, ...a: any[]) => cb(...a);
  ipcRenderer.on(`faith:${ch}`, f);
  return () => { ipcRenderer.removeListener(`faith:${ch}`, f); };
};

contextBridge.exposeInMainWorld("faith", {
  ...Object.fromEntries(CHANNELS.map((c) => [c, call(c)])),
  onChat: listen("chat"), onInbox: listen("inboxItems"), onStatus: listen("status"), onSignedOut: listen("signedOut"),
  onAsk: listen("askFocus"), onShow: listen("show"), onLayout: listen("layout"),
});
