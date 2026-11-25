/** One line for the model. A local GPU answers one request at a time, so
 *  FAITH queues model calls itself: a quick question goes ahead of a big job
 *  that's already running in the background, and nothing waits behind a
 *  job's tools (a turn holds its place only while the model is answering). */
export class ModelGate {
  private busy = 0;
  private queue: { background: () => boolean; go: () => void }[] = [];
  constructor(private size: () => number) {}

  /** Wait for a turn at the model; call the returned function when the answer is in. */
  async acquire(background: () => boolean = () => false): Promise<() => void> {
    if (this.busy < Math.max(1, this.size())) { this.busy++; return this.releaser(); }
    await new Promise<void>((go) => this.queue.push({ background, go }));
    return this.releaser();
  }
  private releaser() {
    let done = false;
    return () => {
      if (done) return; done = true;
      // The first one waiting that isn't a background job; else the oldest job.
      const i = this.queue.findIndex((q) => !q.background());
      const next = this.queue.splice(i >= 0 ? i : 0, 1)[0];
      if (next) next.go(); else this.busy--;
    };
  }
  /** How many model calls are waiting. */
  get waiting() { return this.queue.length; }
}
