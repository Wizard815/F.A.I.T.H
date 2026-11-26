import type { FastifyInstance, FastifyRequest } from "fastify";
import type { Agent } from "../harness/agent.js";
import type { Caller } from "../scope.js";
import { ProjectError, type Projects } from "../projects/projects.js";

type Ctx = { projects: Projects; agent: Agent; need: (req: FastifyRequest) => Caller };

/** Family projects for FAITH's apps and small screens (docs/projects.md).
 *  Reading shows only the projects this view may see. Changes go through the
 *  project tools (Agent.wrap: the role's rules, approvals, Yes cards, the action log),
 *  the same as when FAITH makes them in a chat. */
export function registerProjectRoutes(app: FastifyInstance, x: Ctx) {
  const { projects, agent } = x;
  const run = async (c: Caller, tool: string, args: Record<string, unknown>) => {
    const r = await agent.runTool(c, tool, args);
    if (r.out && typeof r.out === "object" && "error" in r.out) throw new ProjectError(400, String(r.out.error));
    return { ...(r.out as object), pending: r.pending, requests: r.requests };
  };
  const label = (c: Caller, id: string) => {
    const p = projects.get(c, id);
    return p.owner.startsWith("person:") ? "mine" : p.owner === "household" ? "family" : "parents";
  };

  app.get("/api/projects", async (req) => {
    const c = x.need(req), q = req.query as any;
    return { projects: projects.list(c, { resolved: q?.resolved === "1" || q?.resolved === "true" }) };
  });
  /** For D.A.S.H and other little screens: counts and a few short lines. */
  app.get("/api/projects/glance", async (req) => projects.glance(x.need(req)));
  app.put("/api/projects/:id", async (req) => projects.setInstructions(x.need(req), String((req.params as any).id), (req.body as any)?.instructions));
  app.post("/api/projects/:id/threads", async (req) => {
    const c = x.need(req), b = (req.body as any) || {};
    return run(c, "project_thread_start", { project: label(c, String((req.params as any).id)), brief: String(b.brief ?? ""), ...(b.title ? { title: String(b.title) } : {}) });
  });
  app.get("/api/projects/:id/threads/:thread", async (req) => projects.messages(x.need(req), String((req.params as any).thread)));
  app.post("/api/projects/:id/threads/:thread/message", async (req) =>
    run(x.need(req), "project_thread_message", { thread: String((req.params as any).thread), text: String((req.body as any)?.text ?? "") }));
  app.put("/api/projects/:id/threads/:thread/resolved", async (req) =>
    run(x.need(req), "project_thread_resolve", { thread: String((req.params as any).thread), resolved: (req.body as any)?.resolved !== false }));
}
