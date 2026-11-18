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
export type Skill = { name: string; title: string; description: string; who?: PolicyName[]; body: string; builtin: boolean; file: string };

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
  return { name, title: String(head.title || name), description: String(head.description).trim(), who, body: m[2].trim(), builtin, file };
}

export class Skills {
  private cache?: { key: string; list: Skill[]; problems: string[] };
  constructor(private userDir: () => string, private builtinDir = BUILTIN_DIR) {}

  private files(dir: string) {
    if (!existsSync(dir)) return [];
    return readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => join(dir, f));
  }
  /** Every skill, re-read when a file changes. */
  all(): { list: Skill[]; problems: string[] } {
    const files = [...this.files(this.builtinDir).map((f) => [f, true] as const), ...this.files(this.userDir()).map((f) => [f, false] as const)];
    const key = files.map(([f]) => `${f}:${statSync(f).mtimeMs}`).join("|");
    if (this.cache?.key === key) return this.cache;
    const byName = new Map<string, Skill>(), problems: string[] = [];
    for (const [f, builtin] of files) {
      try { const s = parseSkill(readFileSync(f, "utf8"), f, builtin); byName.set(s.name, s); } // user files come later and win
      catch (e: any) { problems.push(e.message); }
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
    unlinkSync(s.file); this.cache = undefined;
  }
}
