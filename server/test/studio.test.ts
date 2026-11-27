import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { parseConfig, type Config } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import type { Caller } from "../src/scope.js";

// Hermes Studio's Projects through the person's own Studio sign-in (docs/projects.md, "Hermes Studio").
let studio: Server, url = "", A: App, cfg: Config;
const tasks: { who: string; path: string; body: any }[] = [];
before(async () => {
  studio = createServer((req, res) => {
    let raw = ""; req.on("data", (c) => (raw += c)); req.on("end", () => {
      const send = (status: number, body: unknown) => { res.statusCode = status; res.setHeader("content-type", "application/json"); res.end(JSON.stringify(body)); };
      const body = raw ? JSON.parse(raw) : null, who = String(req.headers.authorization || "").replace("Bearer jwt-", "");
      if (req.url === "/api/auth/login") return body.password === "pw" ? send(200, { token: `jwt-${body.username}` }) : send(401, { error: "no" });
      if (who !== "wiz" && req.url?.startsWith("/api/studio/projects")) return send(403, { error: "Super admin only" });
      if (req.url === "/api/studio/projects") return send(200, { projects: [{ id: "p1", name: "Overseer", counts: { needsYou: 1, working: 0, review: 0, done: 0, resolved: 1 },
        threads: [{ id: "t1", title: "Fix the collector", stage: "needs_you" }, { id: "t2", title: "Old", stage: "resolved" }] }] });
      if (req.method === "POST" && req.url === "/api/studio/projects/p1/tasks") { tasks.push({ who, path: req.url, body }); return send(200, { task: { id: "k1" } }); }
      if (req.method === "POST" && req.url === "/api/studio/projects/p1/message") { tasks.push({ who, path: req.url, body }); return send(200, { queued: true }); }
      if (req.url === "/api/studio/projects/nope/message") return send(404, { error: "Project not found" });
      send(404, { error: "not here" });
    });
  });
  await new Promise<void>((r) => studio.listen(0, "127.0.0.1", r));
  url = `http://127.0.0.1:${(studio.address() as any).port}`;
  cfg = parseConfig({ model: { base_url: "http://127.0.0.1:9" },
    people: [{ id: "wiz", name: "Wiz", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }, { id: "kid", name: "Kid", role: "child" }],
    connectors: [{ id: "studio", type: "studio", url }] }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { STUDIO_USER_WIZ: "wiz", STUDIO_PASSWORD_WIZ: "pw", STUDIO_USER_SAM: "sam", STUDIO_PASSWORD_SAM: "pw" } });
});
after(async () => { await A.app.close(); studio.close(); });

const P = (id: string) => cfg.people.find((p) => p.id === id)!;
const tools = async (c: Caller) => (await A.registry.toolsFor(c)).tools;
const person = (id: string, work?: Caller["work"]): Caller => ({ scope: { kind: "person", person: P(id) }, channel: "personal", label: id, work });

test("studio projects: the person's own sign-in sees their projects, open threads only", async () => {
  const list = (await tools(person("wiz"))).find((t) => t.name === "studio_projects")!;
  const r: any = await list.run({});
  assert.equal(r.projects[0].name, "Overseer");
  assert.deepEqual(r.projects[0].threads.map((t: any) => [t.title, t.stage]), [["Fix the collector", "needs_you"]], "resolved threads are left out");
});

test("studio projects: a task goes on the board as the person, and is a change", async () => {
  const add = (await tools(person("wiz"))).find((t) => t.name === "studio_project_task")!;
  assert.equal(add.write, true, "it goes through approval and confirmation like any change");
  await add.run({ project: "p1", title: "Look at Unraid logs", notes: "Why the array went read-only" });
  assert.deepEqual(tasks.at(-1), { who: "wiz", path: "/api/studio/projects/p1/tasks", body: { title: "Look at Unraid logs", notes: "Why the array went read-only" } });
});

test("studio projects: a message goes to the coordinator, marked as from FAITH", async () => {
  const msg = (await tools(person("wiz"))).find((t) => t.name === "studio_project_message")!;
  assert.equal(msg.write, true);
  await msg.run({ project: "p1", text: "Can Overseer collect the fan speeds too?" });
  assert.deepEqual(tasks.at(-1), { who: "wiz", path: "/api/studio/projects/p1/message", body: { text: "Can Overseer collect the fan speeds too?", app: "FAITH" } });
  await assert.rejects(Promise.resolve(msg.run({ project: "nope", text: "x" })), /Project not found/);
});

test("studio projects: not a super admin gets a plain answer; no account, the household and throwaways get nothing", async () => {
  const sam = (await tools(person("sam"))).find((t) => t.name === "studio_projects")!;
  await assert.rejects(Promise.resolve(sam.run({})), /only for Studio's super admins/);
  assert.ok(!(await tools(person("kid"))).some((t) => t.name.startsWith("studio")), "no Studio account: no Studio tools");
  assert.ok(!(await tools({ scope: { kind: "household" }, channel: "family", label: "wall" } as Caller)).some((t) => t.name.startsWith("studio")), "the household view has no person's sign-in");
  const thr = await tools(person("wiz", { project: "person-wiz", depth: 0, throwaway: true }));
  assert.ok(thr.some((t) => t.name === "studio_projects") && !thr.some((t) => t.name === "studio_project_task" || t.name === "studio_project_message"), "a throwaway thread can look but not add");
});
