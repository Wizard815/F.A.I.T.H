import { FaithError, SignedOut, type Faith, type InboxItem } from "./faith.js";

/** The tray's long poll on FAITH's inbox (docs/clients.md section 5). No cloud push:
 *  the app asks FAITH, which holds the request open until something arrives. */
export class InboxWatch {
  private ctl?: AbortController;
  running = false;
  constructor(
    private faith: () => Faith | undefined,
    private seen: { get: () => number | undefined; set: (id: number) => void },
    private on: {
      items: (items: InboxItem[], fresh: boolean) => void;
      status: (problem: string | null) => void;
      signedOut: (message: string) => void;
    },
    private pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms)),
    private wait = 30,
  ) {}

  start() {
    if (this.running) return;
    this.running = true;
    void this.loop();
  }
  stop() { this.running = false; this.ctl?.abort(); }

  private async loop() {
    let backoff = 2000;
    while (this.running) {
      const f = this.faith();
      if (!f?.token) { this.running = false; return; }
      this.ctl = new AbortController();
      try {
        const after = this.seen.get();
        // First time on this computer: what's already there isn't news. Show it, don't pop it up.
        const fresh = after !== undefined;
        const r = await f.inbox(after ?? 0, fresh ? this.wait : 0, this.ctl.signal);
        if (!this.running) return;
        this.seen.set(r.last);
        if (r.items.length || !fresh) this.on.items(r.items, fresh);
        this.on.status(null);
        backoff = 2000;
      } catch (e) {
        if (!this.running) return;
        if (e instanceof SignedOut) { this.running = false; this.on.signedOut(e.message); return; }
        this.on.status(e instanceof FaithError ? e.message : String(e));
        await this.pause(backoff);
        backoff = Math.min(backoff * 2, 60_000);
      }
    }
  }
}
