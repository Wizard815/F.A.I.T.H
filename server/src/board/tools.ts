import type { Connector, Tool } from "../connectors/types.js";
import type { Caller } from "../scope.js";
import { boardOwner, type Board } from "./board.js";
import { BoardError, STATUSES } from "./store.js";

/** The board's tools: what Pondering Orb's Golem could do with the board
 *  (pondering-orb/server/src/tools.ts), now FAITH's. They go through the same
 *  role policy, approvals and action log (Agent.wrap) as every other tool.
 *  Projects, the log and the brief are only in a person's own view: the
 *  household, group chats and HA's shared token never get them. */
export class BoardTools implements Connector {
  id = "board";
  constructor(private board: Board) {}
  describe() { return "The board: your projects (next, active, blocked, paused, shipped), your work log, today's morning brief, plus the weather, news and uptime where they're set up"; }

  async tools(c: Caller): Promise<Tool[]> {
    const b = this.board, me = boardOwner(c), T: Tool[] = [];
    const add = (t: Omit<Tool, "connector">) => T.push({ ...t, connector: this.id });
    const guard = <A>(f: (a: A) => unknown) => async (a: A) => { try { return await f(a ?? ({} as A)); } catch (e) { if (e instanceof BoardError) return { error: e.message }; throw e; } };
    const status = { type: "string", enum: [...STATUSES], description: "next, active, blocked, paused or shipped" };

    if (me) {
      const s = b.store, id = me.id;
      add({ name: "board_projects", write: false, description: "This person's projects on their board: name, status (next, active, blocked, paused, shipped), next step, starred, and the last thing logged. Start here for project names.",
        parameters: { type: "object", properties: { archived: { type: "boolean", description: "Include archived projects too." } }, additionalProperties: false },
        run: guard((a: any) => ({ projects: s.projects(id, { archived: !!a.archived }).map((p) => ({ name: p.name, status: p.status, next: p.next, starred: p.fav, archived: p.archived, last_logged: s.log(id, { project: p.name, limit: 1 })[0]?.text ?? "" })) })) });
      add({ name: "board_log", write: false, description: "This person's work log (short past-tense notes of what got done), newest first. For \"what did I do on…\" questions.",
        parameters: { type: "object", properties: { project: { type: "string", description: "Only this project (or General). Omit for all." }, limit: { type: "integer", minimum: 1, maximum: 100 } }, additionalProperties: false },
        run: guard((a: any) => ({ entries: s.log(id, { project: a.project ? String(a.project) : undefined, limit: Number(a.limit) || 20 }).map((l) => ({ day: l.day, project: l.project, text: l.text, by: l.by })) })) });
      add({ name: "board_log_add", write: true, explain: (a) => `log "${String(a?.text || "").slice(0, 80)}"${a?.project ? ` on ${a.project}` : ""}`,
        description: `Add a short entry to this person's work log: a few words in the past tense, e.g. "Fixed the gate latch". At most ${b.cfg().board.log_max} characters; longer is refused. project is one of their projects, or leave it out for General.`,
        parameters: { type: "object", properties: { text: { type: "string" }, project: { type: "string" } }, required: ["text"], additionalProperties: false },
        run: guard((a: any) => ({ ok: true, entry: s.addLog(id, { text: a.text, project: a.project, by: a.by ? String(a.by).slice(0, 20) : "faith", day: b.today() }) })) });
      add({ name: "board_project_add", write: true, explain: (a) => `add the project "${a?.name}"`,
        description: "Add a project to this person's board.",
        parameters: { type: "object", properties: { name: { type: "string" }, status, next: { type: "string", description: "The next step, in a few words." } }, required: ["name"], additionalProperties: false },
        run: guard((a: any) => ({ ok: true, project: s.addProject(id, a) })) });
      add({ name: "board_project_update", write: true, explain: (a) => `change the project "${a?.name}"${a?.status ? ` to ${a.status}` : ""}`,
        description: "Change one of this person's projects: move it to another status, set its next step, star it, rename it or archive it.",
        parameters: { type: "object", properties: { name: { type: "string", description: "The project's name now." }, status, next: { type: "string" }, new_name: { type: "string" }, starred: { type: "boolean" }, archived: { type: "boolean" } }, required: ["name"], additionalProperties: false },
        run: guard((a: any) => ({ ok: true, project: s.updateProject(id, String(a.name ?? a.id ?? ""), { status: a.status, next: a.next, name: a.new_name, fav: a.starred, archived: a.archived }) })) });
      add({ name: "board_brief", write: false, description: "Today's morning brief on this person's board, if it's been written.",
        parameters: { type: "object", properties: {}, additionalProperties: false },
        run: async () => s.brief(id, b.today()) ?? { note: "No brief yet today. It's written each morning for the people in board.brief, or when they press Write it now on the board." } });
    }
    if (b.weatherOn(c)) add({ name: "board_weather", write: false, description: "The weather now and the next days (from Home Assistant).",
      parameters: { type: "object", properties: {}, additionalProperties: false }, run: () => b.weather(c) });
    if (b.cfg().board.news.feeds.length) add({ name: "board_news", write: false, description: "News headlines from the family's feeds, newest first.",
      parameters: { type: "object", properties: {}, additionalProperties: false }, run: async () => { const n = await b.news(); return { headlines: n.items.map((i) => ({ title: i.title, source: i.source, summary: i.summary })), problems: n.errors }; } });
    if (b.uptimeOn(c)) add({ name: "board_uptime", write: false, description: "Which of the home's services are up or down (Uptime Kuma).",
      parameters: { type: "object", properties: {}, additionalProperties: false }, run: async () => { const u = await b.uptime(); return { up: u.up, down: u.down, down_now: u.monitors.filter((m) => m.status === "down" && !m.ignored).map((m) => m.name) }; } });
    return T;
  }
}
