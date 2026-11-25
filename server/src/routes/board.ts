import type { FastifyInstance, FastifyRequest } from "fastify";
import { envValue, personEnv, type Config, type Person } from "../config.js";
import type { Agent } from "../harness/agent.js";
import type { Registry } from "../connectors/registry.js";
import { call } from "../connectors/types.js";
import type { Caller } from "../scope.js";
import type { Board } from "../board/board.js";
import { BoardError } from "../board/store.js";

type Ctx = {
  cfg: () => Config; env: NodeJS.ProcessEnv; board: Board; agent: Agent; registry: Registry;
  need: (req: FastifyRequest) => Caller;
  needPerson: (req: FastifyRequest) => Caller & { scope: { kind: "person"; person: Person } };
};

/** The info board for FAITH's apps (docs/clients.md, section 6; docs/dashboard.md).
 *  Reading is for any viewer (the household sees only shared parts); changes are a
 *  signed-in person's own, and go through the board's tools (Agent.wrap: the role's
 *  rules and the action log), the same as when FAITH makes them in a chat. */
export function registerBoardRoutes(app: FastifyInstance, x: Ctx) {
  const { board, agent } = x;
  const run = async (c: Caller, tool: string, args: Record<string, unknown>) => {
    const r = await agent.runTool(c, tool, args);
    if (r.out && typeof r.out === "object" && "error" in r.out) throw new BoardError(400, String(r.out.error));
    return r.out;
  };

  app.get("/api/board", async (req) => board.view(x.need(req)));

  app.post("/api/board/brief", async (req) => {
    const c = x.needPerson(req);
    return board.writeBrief(c.scope.person, "you");
  });
  app.post("/api/board/log", async (req) => {
    const b = req.body as any;
    return run(x.needPerson(req), "board_log_add", { text: String(b?.text ?? ""), ...(b?.project ? { project: String(b.project) } : {}), by: "you" });
  });
  app.post("/api/board/projects", async (req) => {
    const b = req.body as any;
    return run(x.needPerson(req), "board_project_add", { name: b?.name, ...(b?.status ? { status: b.status } : {}), ...(b?.next ? { next: b.next } : {}) });
  });
  // PATCH, or POST for clients that can't send PATCH (Android's HttpURLConnection).
  app.route({ method: ["PATCH", "POST"], url: "/api/board/projects/:name", handler: async (req) => {
    const b = (req.body as any) || {};
    const args: Record<string, unknown> = { name: String((req.params as any).name) };
    for (const [k, to] of [["status", "status"], ["next", "next"], ["name", "new_name"], ["starred", "starred"], ["archived", "archived"]]) if (b[k] !== undefined) args[to] = b[k];
    return run(x.needPerson(req), "board_project_update", args);
  } });

  /** Moving over from Pondering Orb: its projects and logs, into this person's board.
   *  Either the JSON itself ({ projects, logs }, from Orb's /api/c/projects and /api/c/logs),
   *  or { from: "orb" }: FAITH reads them from this person's Orb, with their own Orb token. */
  app.post("/api/board/import", async (req) => {
    const c = x.needPerson(req), b = (req.body as any) || {}, p = c.scope.person;
    let data: { projects?: unknown; logs?: unknown } = b;
    if (b.from) {
      const id = String(b.from), con = x.cfg().connectors.find((k) => k.id === id && k.type === "mcp");
      if (!con || con.type !== "mcp" || !x.registry.allowedConnector(c, id)) throw new BoardError(400, `There's no Pondering Orb connection called "${id}" for you in faith.yaml.`);
      const token = envValue(personEnv(con.person_token_env, p.id), x.env);
      if (!token) throw new BoardError(400, `FAITH has no Orb token for you. Set ${personEnv(con.person_token_env, p.id) || "the connector's token"} first.`);
      const base = (con.url_env ? envValue(con.url_env, x.env) || con.url : con.url).replace(/\/mcp\/?$/, "");
      const get = async (coll: string) => {
        const r = await call(`${base}/api/c/${coll}`, { headers: { Authorization: `Bearer ${token}` } });
        if (!r.ok) throw new BoardError(502, `Pondering Orb answered ${r.status} for its ${coll}. Check the token in ${personEnv(con.person_token_env, p.id)}.`);
        return r.body;
      };
      data = { projects: await get("projects"), logs: await get("logs") };
    }
    if (!Array.isArray(data.projects) && !Array.isArray(data.logs)) throw new BoardError(400, "Send { projects: [...], logs: [...] } from Orb, or { from: \"orb\" }.");
    const r = board.store.importOrb(p.id, data);
    agent.audit(c, "board_import", `from ${b.from || "a file"}: ${r.projects} projects, ${r.logs} log entries`, true);
    return r;
  });
}
