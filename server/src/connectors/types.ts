import type { Caller } from "../scope.js";

/** One tool the model can call. FAITH decides which tools a caller gets
 *  (scope + role policy); the backend decides what the caller's token may see. */
export type Tool = {
  name: string;                       // what the model sees, e.g. allglance_get_day, home_control
  connector: string;
  description: string;
  parameters: Record<string, unknown>;
  write: boolean;                     // changes something
  /** A sentence describing the action when it must wait for an on-screen Yes, else null. */
  confirm?: (args: any) => string | null;
  run: (args: any) => Promise<unknown>;
  /** Set by the registry: this change waits for a family member's approval. */
  approval?: boolean;
  /** The tool makes its own approval request (with everything filled in), so the registry doesn't. */
  selfApproves?: boolean;
  /** A plain sentence for what this call would do (approval cards); defaults to the tool name and arguments. */
  explain?: (args: any) => string;
};

export interface Connector {
  id: string;
  /** The tools this caller gets from this source (already token-scoped), or [] if none. */
  tools(caller: Caller): Promise<Tool[]>;
  /** A short line for the system prompt saying what this source is. */
  describe(): string;
  /** Is it up? Throws with a plain reason when it isn't (no caches). Defaults to listing tools. */
  ping?(caller: Caller): Promise<void>;
}

export class ToolError extends Error {}

/** fetch with a timeout and a clear message when the other app is down. */
export async function call(url: string, init: RequestInit & { timeoutMs?: number } = {}) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), init.timeoutMs ?? 15000);
  try {
    const res = await fetch(url, { ...init, signal: init.signal ?? ctl.signal });
    const text = await res.text();
    let body: any = text; try { body = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
    return { status: res.status, ok: res.ok, body, headers: res.headers };
  } catch (e: any) {
    const why = e?.name === "AbortError" ? "timed out" : (e?.cause?.code || e?.message || "failed");
    throw new ToolError(`Couldn't reach ${new URL(url).host} (${why}).`);
  } finally { clearTimeout(t); }
}
