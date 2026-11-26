import type { Connector, Tool } from "../connectors/types.js";
import type { Caller } from "../scope.js";
import { ownOwner, ProjectError, visibleOwners, type Projects } from "./projects.js";

/** The project tools: what Studio's coordinator tool (ekko_studio_use_project) does,
 *  for the family's projects. Every call goes through Agent.wrap like any tool, so the
 *  role's rules apply (a child's writes follow the child allowlist; the household's
 *  wait for approval). A thread gets none of them: threads can't start threads. */
export class ProjectTools implements Connector {
  id = "projects";
  constructor(private projects: Projects) {}
  describe() { return "Family projects: background threads that work on a job and report back (your own project, Family, and Parents for grown-ups)"; }

  async tools(c: Caller): Promise<Tool[]> {
    const P = this.projects;
    if (!P.cfg().projects.enabled || c.work?.thread) return [];
    const T: Tool[] = [];
    const add = (t: Omit<Tool, "connector">) => T.push({ ...t, connector: this.id });
    const guard = <A>(f: (a: A) => unknown) => async (a: A) => { try { return await f(a ?? ({} as A)); } catch (e) { if (e instanceof ProjectError) return { error: e.message }; throw e; } };
    const own = ownOwner(c);
    const label = (o: string) => (o.startsWith("person:") ? "mine" : o === "household" ? "family" : "parents");
    const names = visibleOwners(c).map(label);
    const here = c.work?.project;
    const project = { type: "string", enum: names, description: here ? "Leave out for this project." : "mine (your own), family, or parents." };
    // Words a person sends into a project others read (Family, Parents) are shown to them first:
    // the model may have put something private in a brief, and the code doesn't let that go out alone.
    const shared = (a: any, thread?: string) => {
      if (c.work || c.scope.kind !== "person" || c.audience) return null;
      try {
        const p = thread ? P.thread(c, thread).project : P.get(c, String(a?.project || here || "mine"));
        return p.owner === own ? null : p;
      } catch { return null; }
    };

    add({ name: "projects_list", write: false, description: "The family projects you can see and their threads: what's working, done, waiting or failed, with each thread's last line. Start here for thread ids.",
      parameters: { type: "object", properties: { resolved: { type: "boolean", description: "Include resolved threads too." } }, additionalProperties: false },
      run: guard((a: any) => ({ projects: P.list(c, { resolved: !!a.resolved }).map((p) => ({ project: label(p.owner), name: p.name,
        threads: p.threads.map((t) => ({ id: t.id, title: t.title, status: t.status, resolved: t.resolved, last: t.last_text.slice(0, 300), ...(t.throwaway ? { throwaway: true } : {}) })) })) })) });
    add({ name: "project_thread_read", write: false, description: "The latest messages of one project thread (id from projects_list).",
      parameters: { type: "object", properties: { thread: { type: "string" } }, required: ["thread"], additionalProperties: false },
      run: guard((a: any) => P.messages(c, String(a.thread))) });
    add({ name: "project_thread_start", write: true, explain: (a) => `start a thread in ${a?.project || "my"} project: ${a?.title || String(a?.brief || "").slice(0, 60)}`,
      description: "Start a background thread in a family project. It works on the job with that project's own tools and reports back when it's done (to the person, or the family or parents chat). Write the whole job in brief: the thread doesn't see this conversation.",
      parameters: { type: "object", properties: { project, title: { type: "string", description: "A few words." }, brief: { type: "string", description: "The whole job, in plain words." },
        throwaway: { type: "boolean", description: "Only when the person asks for a throwaway, private or incognito thread, in their own project: it can look things up but not change anything, and it's deleted when put away or after a day." } }, required: ["brief"], additionalProperties: false },
      redact: (a) => (a?.throwaway === true ? JSON.stringify({ project: a.project ?? "mine", throwaway: true }) : null),
      // A throwaway into a shared project is refused by start(): don't ask for a Yes first.
      confirm: (a) => { const p = a?.throwaway === true ? null : shared(a); return p ? `send this to the ${p.name} project, where ${p.owner === "household" ? "the whole family" : "the parents"} can read it: "${String(a?.brief || "").slice(0, 300)}"` : null; },
      run: guard((a: any) => { const t = P.start(c, String(a.project || here || "mine"), a); return { ok: true, thread: t.id, title: t.title, note: t.throwaway ? "It's working. It keeps nothing: they read the answer in Projects, and it's deleted when put away." : "It's working in the background and will report back." }; }) });
    add({ name: "project_thread_message", write: true, explain: (a) => `tell a project thread: ${String(a?.text || "").slice(0, 80)}`,
      description: "Give a finished project thread more to do. It carries on in its own conversation and reports back again.",
      parameters: { type: "object", properties: { thread: { type: "string" }, text: { type: "string" } }, required: ["thread", "text"], additionalProperties: false },
      redact: (a) => { try { return P.thread(c, String(a?.thread || "")).throwaway ? JSON.stringify({ thread: a.thread, throwaway: true }) : null; } catch { return null; } },
      confirm: (a) => { const p = shared(a, String(a?.thread || "")); return p ? `send this to the ${p.name} project, where ${p.owner === "household" ? "the whole family" : "the parents"} can read it: "${String(a?.text || "").slice(0, 300)}"` : null; },
      run: guard((a: any) => { const t = P.message(c, String(a.thread), a.text); return { ok: true, thread: t.id, status: t.status }; }) });
    add({ name: "project_thread_resolve", write: true, explain: () => "put a project thread away",
      description: "Mark a project thread resolved (put away), or reopen it with resolved: false. Putting a throwaway thread away deletes it.",
      parameters: { type: "object", properties: { thread: { type: "string" }, resolved: { type: "boolean" } }, required: ["thread"], additionalProperties: false },
      run: guard((a: any) => { const t = P.resolve(c, String(a.thread), a.resolved !== false); return { ok: true, thread: t.id, resolved: t.resolved, ...(t.deleted ? { deleted: true } : {}) }; }) });
    return T;
  }
}
