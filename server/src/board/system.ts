import { cpus, freemem, hostname, loadavg, totalmem, uptime as osUptime } from "node:os";
import { statfs } from "node:fs/promises";
import { call, ToolError } from "../connectors/types.js";

/** FAITH's own machine, from Node (no /proc mount, no Docker socket): load, memory, disks.
 *  A small part of Pondering Orb's System tab (pondering-orb/server/src/integrations/system.ts). */
export async function hostStats(disks: string[]) {
  const n = cpus().length || 1;
  const out = [];
  for (const m of disks) { try { const s = await statfs(m); out.push({ mount: m, pct: Math.round((1 - s.bavail / s.blocks) * 100) }); } catch { /* not mounted here */ } }
  return {
    name: hostname(), cores: n,
    load: Math.round((loadavg()[0] / n) * 100),            // the last minute, as a share of all cores
    memory: Math.round((1 - freemem() / totalmem()) * 100), memory_gib: Math.round(totalmem() / 1073741824),
    disks: out, uptime_days: Math.floor(osUptime() / 86400),
  };
}

export type Monitor = { name: string; group: string; status: "up" | "down" | "pending"; uptime24: number | null; ping: number | null; ignored: boolean };

/** Uptime Kuma's public status page (it must be published). Ported from Orb's uptime.ts. */
export async function uptime(base: string, slug: string, ignore: string[] = []): Promise<{ monitors: Monitor[] }> {
  const skip = new Set(ignore.map((n) => n.toLowerCase()));
  const [page, hb] = await Promise.all([call(`${base}/api/status-page/${encodeURIComponent(slug)}`, { timeoutMs: 10_000 }), call(`${base}/api/status-page/heartbeat/${encodeURIComponent(slug)}`, { timeoutMs: 10_000 })]);
  if (!page.ok) throw new ToolError(`Uptime Kuma has no published status page "${slug}" (it answered ${page.status}). Publish it in Uptime Kuma, or fix board.uptime.slug.`);
  const beats = hb.body?.heartbeatList || {}, up = hb.body?.uptimeList || {};
  const monitors: Monitor[] = [];
  for (const g of page.body?.publicGroupList || []) for (const m of g.monitorList || []) {
    const list: any[] = beats[m.id] || [], last = list[list.length - 1];
    monitors.push({
      name: String(m.name), group: String(g.name || "Services"),
      status: !last ? "pending" : last.status === 1 ? "up" : last.status === 0 ? "down" : "pending",
      uptime24: up[`${m.id}_24`] != null ? Math.round(up[`${m.id}_24`] * 1000) / 10 : null,
      ping: last?.ping ?? null, ignored: skip.has(String(m.name).toLowerCase()),
    });
  }
  return { monitors };
}
