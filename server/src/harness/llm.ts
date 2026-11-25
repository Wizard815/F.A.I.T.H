/** The model loop. FAITH talks to one OpenAI-compatible endpoint (Argos, the
 *  owner's llama-swap fork) and runs the tool loop itself, so every tool call
 *  goes through FAITH's scope and policy checks. Adapted from Pondering Orb's
 *  Golem loop (server/src/integrations/llm.ts, MIT). */

import type { ModelGate } from "./gate.js";

export type Msg = { role: "system" | "user" | "assistant" | "tool"; content: string | null | { type: string; [k: string]: unknown }[]; tool_calls?: any[]; tool_call_id?: string };
export type LoopTool = { name: string; description: string; parameters: Record<string, unknown>; run: (args: any) => Promise<unknown> };
export type LoopEvent = { type: "text"; delta: string } | { type: "tool"; name: string } | { type: "tool_result"; name: string; ok: boolean };

/** Some local models put their reasoning in the answer: <think>…</think>
 *  (Hy4 also writes </think:id>). Keep only what comes after it. */
export function visible(text: string) {
  const closes = [...text.matchAll(/<\/think(?::[\w-]+)?>/gi)];
  const last = closes.at(-1), after = last ? text.slice(last.index! + last[0].length) : text;
  const out = after.replace(/<think(?::[\w-]+)?>[\s\S]*$/i, "");   // one still open at the end
  return out.trim() ? out : "";
}

export class ModelError extends Error { constructor(public status: number, message: string) { super(message); } }

export type LoopOpts = {
  baseUrl: string; model: string; key?: string; temperature?: number; timeoutMs?: number;
  messages: Msg[]; tools: LoopTool[]; maxRounds: number;
  /** Tools the caller may use that weren't offered this turn (the router's shortlist): run if the model names one anyway.
   *  One a tool result names (a skill's steps, say) is offered from the next round on. */
  callable?: LoopTool[];
  onEvent?: (e: LoopEvent) => void; signal?: AbortSignal;
  /** The model's queue, and whether this turn is a big job running in the background (it waits behind quick ones). */
  gate?: ModelGate; background?: () => boolean;
};

/** Run the loop, streaming text when the server streams. Servers that ignore
 *  stream:true and answer with plain JSON still work. */
const RETRY_MS = [1500, 4000], MAX_PROMOTED = 12;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, Number(process.env.FAITH_RETRY_SCALE ?? 1) * ms));

export async function runLoop(o: LoopOpts): Promise<{ text: string; toolsUsed: string[] }> {
  const msgs = [...o.messages], used: string[] = []; let full = "";
  const schema = (t: LoopTool) => ({ type: "function", function: { name: t.name, description: t.description, parameters: t.parameters } });
  const tools = o.tools.map(schema), shown = new Set(o.tools.map((t) => t.name));
  /** A loaded skill names the tools its steps use: offer those it names that the router left out. */
  const offerNamed = (text: string) => {
    for (const t of o.callable ?? []) {
      if (shown.size >= o.tools.length + MAX_PROMOTED) break;
      if (!shown.has(t.name) && new RegExp(`\\b${t.name.replace(/[^\w-]/g, "")}\\b`).test(text)) { shown.add(t.name); tools.push(schema(t)); }
    }
  };
  const emit = o.onEvent ?? (() => {});
  for (let round = 0; round < o.maxRounds; round++) {
    // Wait for a turn at the model (quick questions first), and hold it only while it answers.
    const release = o.gate ? await o.gate.acquire(o.background) : () => {};
    const { text, calls } = await (async () => { try {
      let res!: Response;
      const signal = o.signal ? AbortSignal.any([o.signal, AbortSignal.timeout(o.timeoutMs ?? 180_000)]) : AbortSignal.timeout(o.timeoutMs ?? 180_000);
      // A model server that's busy or swapping models (Argos/llama-swap) can answer 429/502/503/504
      // for a moment: try again twice before giving up. Nothing has been streamed yet, so it's safe.
      for (let attempt = 0; ; attempt++) {
        try {
          res = await fetch(`${o.baseUrl}/chat/completions`, { method: "POST", signal,
            headers: { "Content-Type": "application/json", ...(o.key ? { Authorization: `Bearer ${o.key}` } : {}) },
            body: JSON.stringify({ model: o.model || undefined, messages: msgs, tools: tools.length ? tools : undefined, temperature: o.temperature, stream: true }) });
        } catch (e: any) {
          if (o.signal?.aborted) throw new ModelError(499, "Stopped.");
          if (attempt < 2 && e?.name !== "TimeoutError") { await sleep(RETRY_MS[attempt]); continue; }
          throw new ModelError(502, `Couldn't reach the model at ${o.baseUrl} (${e?.name === "TimeoutError" ? "timed out" : e?.cause?.code || e?.message}).`);
        }
        if (attempt < 2 && [429, 502, 503, 504].includes(res.status)) { await res.body?.cancel().catch(() => {}); await sleep(RETRY_MS[attempt]); continue; }
        break;
      }
      if (!res.ok) throw new ModelError(502, `The model answered ${res.status}: ${(await res.text()).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 200)}`);
      let text = ""; const calls: { id: string; name: string; args: string }[] = [];
      if (!(res.headers.get("content-type") || "").includes("text/event-stream")) {
        const m = (await res.json())?.choices?.[0]?.message || {};
        text = m.content || ""; if (text) emit({ type: "text", delta: text });
        for (const c of m.tool_calls || []) calls.push({ id: c.id, name: c.function?.name, args: c.function?.arguments || "" });
      } else {
        const reader = res.body!.getReader(), dec = new TextDecoder(); let buf = "", last = -1;
        const line = (raw: string) => {
          const l = raw.trim(); if (!l.startsWith("data:")) return;
          const data = l.slice(5).trim(); if (data === "[DONE]") return;
          let ev: any; try { ev = JSON.parse(data); } catch { return; }
          if (ev.error) throw new ModelError(502, `The model reported an error: ${String(ev.error.message || ev.error).slice(0, 200)}`);
          const d = ev.choices?.[0]?.delta || {};
          if (d.content) { text += d.content; emit({ type: "text", delta: d.content }); }
          for (const tc of d.tool_calls || []) {
            // Without an index, a chunk with a new id starts a new call.
            const k = tc.index ?? (tc.id && calls[last]?.id && calls[last].id !== tc.id ? last + 1 : Math.max(last, 0)); last = k;
            calls[k] ??= { id: "", name: "", args: "" };
            if (tc.id) calls[k].id = tc.id;
            // Some servers repeat the whole name in every chunk.
            if (tc.function?.name && !calls[k].name.endsWith(tc.function.name)) calls[k].name += tc.function.name;
            if (tc.function?.arguments) calls[k].args += tc.function.arguments;
          }
        };
        for (;;) {
          const { done, value } = await reader.read(); if (done) break;
          buf += dec.decode(value, { stream: true });
          let i; while ((i = buf.indexOf("\n")) >= 0) { const l = buf.slice(0, i); buf = buf.slice(i + 1); line(l); }
        }
        if (buf) line(buf + dec.decode());
      }
      return { text, calls };
    } finally { release(); } })();
    const said = visible(text);
    full += said;
    const real = calls.filter(Boolean).map((c, i) => ({ ...c, id: c.id || `call_${round}_${i}` }));
    if (!real.length) return { text: full.trim(), toolsUsed: used };
    msgs.push({ role: "assistant", content: text || null, tool_calls: real.map((c) => ({ id: c.id, type: "function", function: { name: c.name, arguments: c.args || "{}" } })) });
    for (const c of real) {
      if (o.signal?.aborted) throw new ModelError(499, "Stopped.");
      const t = o.tools.find((x) => x.name === c.name) ?? o.callable?.find((x) => x.name === c.name); emit({ type: "tool", name: c.name });
      let out: unknown, ok = true;
      try {
        let args: any = {};
        try { args = c.args ? JSON.parse(c.args) : {}; } catch { throw new Error(`the arguments weren't valid JSON: ${c.args.slice(0, 120)}`); }
        out = t ? await t.run(args) : { error: `There is no tool called ${c.name}. Use one of: ${o.tools.map((x) => x.name).join(", ")}` };
        if (t) used.push(t.name);
        if (out && typeof out === "object" && "error" in (out as any)) ok = false;
      } catch (e: any) { out = { error: e?.message || String(e) }; ok = false; }
      emit({ type: "tool_result", name: c.name, ok });
      const content = (typeof out === "string" ? out : JSON.stringify(out)).slice(0, 20000);
      msgs.push({ role: "tool", tool_call_id: c.id, content });
      if (ok) offerNamed(content);
    }
    if (said) { full += "\n\n"; emit({ type: "text", delta: "\n\n" }); }
  }
  return { text: (full + "\n\nI ran out of steps before finishing. Try asking for one thing at a time.").trim(), toolsUsed: used };
}
