import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, stringify } from "yaml";
import type { PolicyName } from "./config.js";

/** A skill is a written recipe for a family job that takes several steps
 *  ("plan this week's dinners"). It's a Markdown file with a small header:
 *
 *    ---
 *    name: plan-week-dinners
 *    title: Plan the week's dinners
 *    description: One line: when to use it.
 *    who: [admin, adult]        # roles that may use it (household, parents, child too)
 *    ---
 *    The steps, in plain words.
 *
 *  The model sees every skill's name and description; it loads the full text
 *  with skill_load only when one fits, so prompts stay small. FAITH ships some
 *  (server/skills); the family's own live in skills.dir and win on a name clash. */
export type Skill = { name: string; title: string; description: string; who?: PolicyName[]; body: string; builtin: boolean; file: string;
  /** Skill packs (SKILL.md folders): other files the skill may point to, e.g. references/triggers.md. */
  references?: string[]; pack?: string };

/** A skill pack: a folder of skills in the common SKILL.md layout (one folder per
 *  skill, SKILL.md plus references/), such as homeassistant-ai/skills. */
export type SkillPack = { dir: string; who?: PolicyName[] };

const here = dirname(fileURLToPath(import.meta.url));
export const BUILTIN_DIR = process.env.FAITH_BUILTIN_SKILLS || resolve(here, "../skills");
const NAME = /^[a-z0-9][a-z0-9-]{1,48}$/;

export class SkillError extends Error {}

export function parseSkill(text: string, file: string, builtin: boolean): Skill {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new SkillError(`${file}: a skill starts with a --- header (name, title, description).`);
  let head: any;
  try { head = parse(m[1]) || {}; } catch (e: any) { throw new SkillError(`${file}: the header isn't valid YAML (${e.message}).`); }
  const name = String(head.name || "").trim();
  if (!NAME.test(name)) throw new SkillError(`${file}: name "${name}" must be lowercase letters, digits and dashes.`);
  if (!head.description) throw new SkillError(`${file}: needs a one-line description (when to use it).`);
  const who = head.who ? (Array.isArray(head.who) ? head.who : [head.who]).map(String) as PolicyName[] : undefined;
  return { name, title: String(head.title || name), description: String(head.description).replace(/\s+/g, " ").trim(), who, body: m[2].trim(), builtin, file };
}

export class Skills {
  private cache?: { key: string; list: Skill[]; problems: string[] };
  constructor(private userDir: () => string, private builtinDir = BUILTIN_DIR, private packs: () => SkillPack[] = () => []) {}

  /** SKILL.md files in a pack: the folder itself, or folders below it (a cloned repo's skills/ too). */
  private packFiles(dir: string, depth = 0): string[] {
    if (!existsSync(dir) || depth > 3) return [];
    if (existsSync(join(dir, "SKILL.md"))) return [join(dir, "SKILL.md")];
    return readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory() && !d.name.startsWith(".") && d.name !== "node_modules").flatMap((d) => this.packFiles(join(dir, d.name), depth + 1));
  }
  private references(dir: string) {
    const out: string[] = [];
    const walk = (d: string, rel: string) => { for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      if (e.isDirectory() && rel.split("/").length < 3) walk(join(d, e.name), rel ? `${rel}/${e.name}` : e.name);
      else if (e.isFile() && /\.(md|ya?ml|txt|json)$/i.test(e.name) && e.name !== "SKILL.md") out.push(rel ? `${rel}/${e.name}` : e.name);
    } };
    walk(dir, "");
    return out.sort();
  }
  /** One reference file of a pack skill, never outside its folder. */
  reference(name: string, file: string) {
    const s = this.get(name);
    if (!s?.references?.includes(file)) throw new SkillError(`${name} has no file ${file}.${s?.references?.length ? ` It has: ${s.references.join(", ")}.` : ""}`);
    return readFileSync(join(dirname(s.file), file), "utf8");
  }

  private files(dir: string) {
    if (!existsSync(dir)) return [];
    return readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => join(dir, f));
  }
  /** Every skill, re-read when a file changes. */
  all(): { list: Skill[]; problems: string[] } {
    const packs = this.packs().flatMap((p) => this.packFiles(p.dir).map((f) => [f, p] as const));
    const files = [...this.files(this.builtinDir).map((f) => [f, true] as const), ...packs.map(([f]) => [f, false] as const), ...this.files(this.userDir()).map((f) => [f, false] as const)];
    const key = files.map(([f]) => `${f}:${statSync(f).mtimeMs}`).join("|");
    if (this.cache?.key === key) return this.cache;
    const byName = new Map<string, Skill>(), problems: string[] = [];
    for (const [f, builtin] of files) {
      try {
        const s = parseSkill(readFileSync(f, "utf8"), f, builtin), pack = packs.find(([pf]) => pf === f)?.[1];
        if (pack) { s.pack = pack.dir; s.who ??= pack.who; s.references = this.references(dirname(f)); }
        byName.set(s.name, s); // packs come after FAITH's, your own files last: later wins
      } catch (e: any) { problems.push(e.message); }
    }
    this.cache = { key, list: [...byName.values()].sort((a, b) => a.name.localeCompare(b.name)), problems };
    return this.cache;
  }
  forPolicy(p: PolicyName) { return this.all().list.filter((s) => !s.who || s.who.includes(p)); }
  get(name: string) { return this.all().list.find((s) => s.name === name); }

  /** Save one of the family's own skills (the admin page). */
  save(s: { name: string; title?: string; description: string; who?: PolicyName[]; body: string }) {
    const head: Record<string, unknown> = { name: s.name, title: s.title || s.name, description: s.description };
    if (s.who?.length) head.who = s.who;
    const text = `---\n${stringify(head).trim()}\n---\n${String(s.body || "").trim()}\n`;
    const dir = this.userDir(), file = join(dir, `${s.name}.md`);
    parseSkill(text, file, false); // refuse what wouldn't load
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, text);
    this.cache = undefined;
    return this.get(s.name)!;
  }
  remove(name: string) {
    const s = this.get(name);
    if (!s) throw new SkillError(`No skill called ${name}.`);
    if (s.builtin) throw new SkillError(`${name} comes with FAITH. Save a skill with the same name to change it.`);
    if (s.pack) throw new SkillError(`${name} comes from the skill pack in ${s.pack}. Remove it from skills.packs in faith.yaml instead.`);
    unlinkSync(s.file); this.cache = undefined;
  }
}
