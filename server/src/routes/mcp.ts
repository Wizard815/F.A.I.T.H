import type { FastifyInstance, FastifyRequest } from "fastify";
import type { Agent } from "../harness/agent.js";
import type { Registry } from "../connectors/registry.js";
import type { Caller } from "../scope.js";
import { AuthError } from "../auth/sessions.js";

type Ctx = { agent: Agent; registry: Registry; apiCaller: (req: FastifyRequest) => Caller & { apiKind?: string }; name: () => string };

/** FAITH as an MCP server (Streamable HTTP, stateless JSON): Hermes, Open
 *  WebUI, Claude Desktop or any MCP client can use FAITH's tools with a FAITH
 *  token (`faith token add household|person ...`).
 *  - The token decides the view, exactly as everywhere else: a household
 *    token sees shared things; a person's token sees theirs.
 *  - Every call goes through Agent.wrap: household changes go for approval,
 *    and actions that need a Yes on a screen are refused (nobody can tap it).
 *  - faith_ask hands a whole question to FAITH (its tools, skills, memory). */
export function registerMcpRoutes(app: FastifyInstance, x: Ctx) {
  const ASK = { name: "faith_ask", description: "Ask FAITH, the family's assistant, a question or give it a job in plain words. It uses all of its own sources (calendar, wiki, the house, meals, shopping) and answers in text.",
    inputSchema: { type: "object", properties: { question: { type: "string" } }, required: ["question"], additionalProperties: false }, annotations: { readOnlyHint: false } };

  const who = (req: FastifyRequest) => {
    const c = x.apiCaller(req);
    if (c.apiKind === "ha") throw new AuthError(403, "Home Assistant tokens are for the integration. Use a household or person token (`faith token add`).");
    return c;
  };

  const handle = async (c: Caller, m: any): Promise<any> => {
    const ok = (result: unknown) => ({ jsonrpc: "2.0", id: m.id, result });
    const fail = (code: number, message: string) => ({ jsonrpc: "2.0", id: m.id, error: { code, message } });
    switch (m?.method) {
      case "initialize":
        return ok({ protocolVersion: typeof m.params?.protocolVersion === "string" ? m.params.protocolVersion : "2025-06-18", capabilities: { tools: { listChanged: false } },
          serverInfo: { name: "faith", title: x.name(), version: "0.3.0" },
          instructions: `${x.name()} is a family's assistant. Its tools act in the view of the token you use: a household token sees shared things only. Changes from the household view wait for a family member's approval.` });
      case "ping": return ok({});
      case "tools/list": {
        const set = await x.registry.toolsFor(c);
        return ok({ tools: [ASK, ...set.tools.map((t) => ({ name: t.name, description: t.description + (t.approval ? " (A family member approves this first.)" : ""), inputSchema: t.parameters,
          annotations: { readOnlyHint: !t.write, ...(t.confirm ? { destructiveHint: true } : {}) } }))] });
      }
      case "tools/call": {
        const name = String(m.params?.name || ""), args = m.params?.arguments ?? {};
        const text = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v));
        try {
          if (name === "faith_ask") {
            const q = String(args?.question || "").trim();
            if (!q) return ok({ content: [{ type: "text", text: "Ask something." }], isError: true });
            const r = await x.agent.turn({ caller: c, text: q });
            return ok({ content: [{ type: "text", text: r.text }] });
          }
          const r = await x.agent.runTool(c, name, args);
          const out: any = r.out;
          return ok({ content: [{ type: "text", text: text(out) }], ...(out && typeof out === "object" && !Array.isArray(out) ? { structuredContent: out } : {}), isError: !!(out && typeof out === "object" && "error" in out) });
        } catch (e: any) { return ok({ content: [{ type: "text", text: e.message }], isError: true }); }
      }
      default: return fail(-32601, `FAITH doesn't do ${m?.method}.`);
    }
  };

  app.post("/mcp", async (req, reply) => {
    const c = who(req), body: any = req.body;
    const msgs = Array.isArray(body) ? body : [body];
    const answers = (await Promise.all(msgs.filter((m) => m && m.id !== undefined).map((m) => handle(c, m))));
    if (!answers.length) return reply.status(202).send();
    return Array.isArray(body) ? answers : answers[0];
  });
  // No server-to-client stream: FAITH answers every request directly.
  app.get("/mcp", async (_req, reply) => reply.status(405).header("Allow", "POST").send({ error: "POST JSON-RPC to /mcp." }));
}
