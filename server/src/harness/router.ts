import { createHash } from "node:crypto";
import { envValue, glob, type Config } from "../config.js";
import type { Tool } from "../connectors/types.js";

/** Picking the tools a question needs. A local model handles a dozen or two
 *  tools well and a hundred badly (ha-mcp alone brings 86), so when a caller
 *  has more than `tools.max`, FAITH offers only the most relevant ones:
 *  - FAITH's own tools and `tools.always` are always there;
 *  - the rest are ranked against the question (and the one before it, so
 *    "yes, do that" keeps the same tools), by embeddings from Argos when
 *    `model.embed_model` is set, else by shared words. */
export class ToolRouter {
  private vectors = new Map<string, number[]>();
  private warned = false;
  constructor(private cfg: () => Config, private env: NodeJS.ProcessEnv = process.env, private log: (m: string) => void = () => {}) {}

  async pick(tools: Tool[], question: string): Promise<Tool[]> {
    const { max, always } = this.cfg().tools;
    if (tools.length <= max) return tools;
    const keep = tools.filter((t) => t.connector === "faith" || t.always || always.some((p) => glob(p, t.name)));
    const rest = tools.filter((t) => !keep.includes(t));
    const room = Math.max(0, max - keep.length);
    const scores = (await this.byEmbedding(rest, question)) ?? rest.map((t) => words(question, t));
    const ranked = rest.map((t, i) => ({ t, s: scores[i] })).sort((a, b) => b.s - a.s).slice(0, room).map((x) => x.t);
    return [...keep, ...ranked];
  }

  private async byEmbedding(tools: Tool[], question: string): Promise<number[] | undefined> {
    const m = this.cfg().model;
    if (!m.embed_model) return undefined;
    try {
      const texts = tools.map(describe), missing = [...new Set(texts.filter((t) => !this.vectors.has(key(t))))];
      for (let i = 0; i < missing.length; i += 64) {
        const batch = missing.slice(i, i + 64), vs = await this.embed(batch);
        batch.forEach((t, j) => this.vectors.set(key(t), vs[j]));
      }
      if (this.vectors.size > 5000) this.vectors.clear(); // tool lists changed a lot; start over next time
      const [q] = await this.embed([question]);
      return texts.map((t) => cosine(q, this.vectors.get(key(t)) ?? []));
    } catch (e: any) {
      if (!this.warned) { this.warned = true; this.log(`tool router: embeddings failed (${e.message}); ranking tools by shared words instead.`); }
      return undefined;
    }
  }

  private async embed(input: string[]): Promise<number[][]> {
    const m = this.cfg().model, key = envValue(m.api_key_env, this.env);
    const r = await fetch(`${m.base_url}/embeddings`, { method: "POST", signal: AbortSignal.timeout(30_000),
      headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) }, body: JSON.stringify({ model: m.embed_model, input }) });
    if (!r.ok) throw new Error(`embeddings answered ${r.status}`);
    const d: any = await r.json();
    const out = (d?.data ?? []).sort((a: any, b: any) => (a.index ?? 0) - (b.index ?? 0)).map((x: any) => (x.embedding as number[]).map(Number));
    if (out.length !== input.length) throw new Error("embeddings sent the wrong number of vectors");
    return out;
  }
}

const spaced = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " "); // HassClimateSetTemperature -> Hass Climate Set Temperature
const describe = (t: Tool) => `${spaced(t.name)}: ${t.description}`.slice(0, 600);
const key = (t: string) => createHash("sha1").update(t).digest("hex");
function cosine(a: number[], b: number[]) {
  let d = 0, na = 0, nb = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return na && nb ? d / Math.sqrt(na * nb) : 0;
}

const STOP = new Set("a an the to of in on for and or is are be it this that my me i you we our your please can could would will do does what whats how when where who which with at by from up off out about any some".split(" "));
const stem = (w: string) => w.replace(/(ing|ed|es|s)$/, "");
const tokens = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);

/** Shared words between the question and the tool (its name counts double). */
export function words(question: string, t: Tool) {
  const q = new Set(tokens(question));
  if (!q.size) return 0;
  const name = tokens(spaced(t.name)), desc = tokens(t.description);
  let s = 0;
  for (const w of new Set(name)) if (q.has(w)) s += 2;
  for (const w of new Set(desc)) if (q.has(w)) s += 1;
  return s / Math.sqrt(name.length + desc.length + 1);
}
