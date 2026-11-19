import type { FastifyInstance, FastifyRequest } from "fastify";
import type { Config, Person } from "../config.js";
import { envValue } from "../config.js";
import type { Db } from "../db.js";
import { AuthError, type Auth } from "../auth/sessions.js";
import type { Approvals } from "../approvals.js";
import type { Registry } from "../connectors/registry.js";
import type { Rewards } from "../rewards.js";
import type { Routines } from "../routines.js";
import type { Skills } from "../skills.js";
import type { Voices } from "../voice.js";
import type { Notifier } from "../notifier.js";
import type { Caller } from "../scope.js";

export type AdminCtx = {
  cfg: () => Config; db: Db; env: NodeJS.ProcessEnv; auth: Auth; approvals: Approvals; registry: Registry; rewards: Rewards; routines: Routines;
  skills: Skills; voices: Voices; notifier: Notifier; needAdmin: (req: FastifyRequest) => Caller & { scope: { kind: "person"; person: Person } }; person: (id: unknown) => Person;
};

/** FAITH's own page is the admin console: the family uses Home Assistant
 *  (and Mattermost). Everything here needs an admin signed in. */
export function registerAdminRoutes(app: FastifyInstance, x: AdminCtx) {
  const { cfg, auth, rewards, routines, skills, voices, needAdmin } = x;

  // ---- overview: is everything connected? ----
  app.get("/api/admin/overview", async (req) => {
    needAdmin(req);
    const c = cfg();
    const views: Caller[] = [{ scope: { kind: "household" }, channel: "hub", label: "household" }, ...c.people.map((p) => ({ scope: { kind: "person" as const, person: p }, channel: "personal" as const, label: p.id }))];
    const sources = await Promise.all(views.map(async (v) => {
      const set = await x.registry.toolsFor(v);
      return { view: v.scope.kind === "person" ? v.scope.person.id : "household", sources: set.sources, tools: set.tools.length, writes: set.tools.filter((t) => t.write).length, problems: set.problems };
    }));
    const probe = async (url: string, headers: Record<string, string> = {}) => {
      try { const r = await fetch(url, { headers, signal: AbortSignal.timeout(6000) }); return { ok: r.ok, status: r.status }; }
      catch (e: any) { return { ok: false, status: 0, error: e?.cause?.code || e?.message }; }
    };
    const key = envValue(c.model.api_key_env, x.env);
    return {
      name: c.name, people: c.people.length, sources,
      model: { url: c.model.base_url, model: c.model.model || "(server default)", ...(await probe(`${c.model.base_url}/models`, key ? { Authorization: `Bearer ${key}` } : {})) },
      mattermost: c.mattermost ? { url: c.mattermost.url, ready: !!x.notifier.bot?.familyId, family: x.notifier.bot?.familyId ?? null, parents: x.notifier.bot?.parentsId ?? null } : null,
      voice_id: c.voice_id ? { url: c.voice_id.url, ...(await probe(`${c.voice_id.url}/health`)) } : null,
      skills: { count: skills.all().list.length, problems: skills.all().problems },
      routines: routines.list().length, pending_approvals: x.approvals.pendingCount(),
      payouts_owed: rewards.payouts("owed").length,
    };
  });

  // ---- people ----
  app.get("/api/admin/people", async (req) => {
    needAdmin(req);
    const vs = voices.status();
    return cfg().people.map((p) => ({ ...p, methods: auth.methods(p.id), voice_samples: vs.find((v) => v.person === p.id)?.samples ?? 0, points: rewards.balance(p.id) }));
  });
  app.put("/api/admin/people/:id/pin", async (req) => { needAdmin(req); auth.setPin(x.person((req.params as any).id).id, String((req.body as any)?.pin ?? "")); return { ok: true }; });
  app.put("/api/admin/people/:id/password", async (req) => { needAdmin(req); auth.setPassword(x.person((req.params as any).id).id, String((req.body as any)?.password ?? "")); return { ok: true }; });
  app.post("/api/admin/people/:id/signout", async (req) => { needAdmin(req); auth.endPerson(x.person((req.params as any).id).id); return { ok: true }; });

  // ---- voice ID: record a few clips per person ----
  app.post("/api/admin/voice/:id", async (req) => {
    needAdmin(req);
    const p = x.person((req.params as any).id), buf = req.body as Buffer;
    if (!Buffer.isBuffer(buf) || !buf.length) throw new AuthError(400, "Send a recording (audio/*).");
    return voices.enroll(p, buf, String(req.headers["content-type"] || "audio/webm").split(";")[0]);
  });
  app.post("/api/admin/voice-test", async (req) => {
    needAdmin(req);
    const buf = req.body as Buffer;
    const m = await voices.identify(buf, String(req.headers["content-type"] || "audio/webm").split(";")[0]);
    return m ? { person: m.person.id, name: m.person.name, score: Math.round(m.score * 100) / 100 } : { person: null };
  });
  app.delete("/api/admin/voice/:id", async (req) => { needAdmin(req); voices.forget(x.person((req.params as any).id).id); return { ok: true }; });

  // ---- skills ----
  app.get("/api/admin/skills", async (req) => { needAdmin(req); const a = skills.all(); return { skills: a.list.map(({ file, ...s }) => s), problems: a.problems }; });
  app.put("/api/admin/skills/:name", async (req) => { needAdmin(req); const b: any = req.body || {}; const { file, ...s } = skills.save({ ...b, name: (req.params as any).name }); return s; });
  app.delete("/api/admin/skills/:name", async (req) => { needAdmin(req); skills.remove((req.params as any).name); return { ok: true }; });

  // ---- routines ----
  app.get("/api/admin/routines", async (req) => { needAdmin(req); return routines.list(); });
  app.post("/api/admin/routines", async (req) => { needAdmin(req); return routines.save(req.body as any); });
  app.delete("/api/admin/routines/:id", async (req) => { needAdmin(req); routines.remove((req.params as any).id); return { ok: true }; });
  app.post("/api/admin/routines/:id/run", async (req) => { needAdmin(req); return routines.run((req.params as any).id); });

  // ---- points and rewards ----
  app.get("/api/admin/rewards", async (req) => {
    needAdmin(req);
    return { activities: rewards.activities(true), rewards: rewards.rewards(true), balances: rewards.balances(), history: rewards.history(undefined, 40), payouts: rewards.payouts(), payout_provider: rewards.payout.name,
      cards: Object.fromEntries(await Promise.all(cfg().people.filter((p) => p.firefly_account).map(async (p) => [p.id, (await rewards.card(p.id)) ?? null] as const))), allowed_points: cfg().rewards.allowed_points, currency: cfg().rewards.currency };
  });
  app.post("/api/admin/rewards/activities", async (req) => { needAdmin(req); return rewards.saveActivity(req.body as any); });
  app.post("/api/admin/rewards/catalog", async (req) => { needAdmin(req); return rewards.saveReward(req.body as any); });
  app.post("/api/admin/rewards/award", async (req) => { const a = needAdmin(req), b: any = req.body || {}; return rewards.award(x.person(b.person).id, { points: Number(b.points), activity: b.activity, reason: b.reason }, a.scope.person.id); });
  app.post("/api/admin/rewards/payouts/:id/paid", async (req) => { needAdmin(req); rewards.markPaid((req.params as any).id); return { ok: true }; });
  app.post("/api/admin/rewards/payouts/:id/retry", async (req) => { needAdmin(req); return rewards.pay((req.params as any).id); });

  // ---- the action log, and tokens ----
  app.get("/api/admin/audit", async (req) => { needAdmin(req); return x.db.prepare("SELECT * FROM audit ORDER BY id DESC LIMIT 200").all(); });
  app.get("/api/admin/tokens", async (req) => { needAdmin(req); return auth.tokens(); });
  app.post("/api/admin/tokens", async (req) => {
    needAdmin(req);
    const b: any = req.body || {};
    return { token: auth.addToken(b.kind, String(b.name || ""), b.person) };
  });
  app.delete("/api/admin/tokens/:name", async (req) => { needAdmin(req); return { ok: auth.revokeToken((req.params as any).name) }; });
  app.post("/api/admin/send", async (req) => { const a = needAdmin(req), b: any = req.body || {}; return { sent: await x.notifier.send(String(b.to), String(b.text || ""), { from: a.scope.person.id }) }; });
}
