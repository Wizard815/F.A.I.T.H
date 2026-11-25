import { call } from "../connectors/types.js";

/** News for the board: RSS 2.0 and Atom feeds, newest first. Ported from Pondering
 *  Orb's Daily page (pondering-orb/server/src/integrations/daily.ts). Off until a feed
 *  is listed in board.news.feeds; each feed is fetched from wherever it points, so use
 *  a local reader (FreshRSS, Miniflux) to keep it on your own network. */
export type NewsItem = { title: string; link: string; source: string; published: number; summary: string };
export type Feed = { url: string; title: string; items: NewsItem[]; error: string };

const UA = { "User-Agent": "FAITH (self-hosted family assistant)", Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" };
const ent = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_m, e: string) =>
  e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " } as Record<string, string>)[e.toLowerCase()]);
const strip = (s: string) => ent(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const pick = (x: string, t: string) => { const m = new RegExp(`<${t}\\b[^>]*>([\\s\\S]*?)</${t}>`, "i").exec(x); return m ? m[1] : ""; };

/** Items from one RSS 2.0 or Atom feed, newest first. Only http(s) links survive. */
export function parseFeed(xml: string, fallbackSource = ""): NewsItem[] {
  const feedTitle = strip(pick(xml.replace(/<(item|entry)\b[\s\S]*$/i, ""), "title")) || fallbackSource;
  const blocks = [...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/gi)].map((m) => m[0]);
  return blocks.map((b) => {
    const link = strip(pick(b, "link")) || (/<link\b[^>]*href="([^"]+)"/i.exec(b)?.[1] ?? "");
    const date = pick(b, "pubDate") || pick(b, "published") || pick(b, "updated") || pick(b, "dc:date");
    return { title: strip(pick(b, "title")), link: ent(link), source: strip(pick(b, "source")) || feedTitle, published: Date.parse(strip(date)) || 0,
      summary: strip(pick(b, "description") || pick(b, "summary") || pick(b, "content")).slice(0, 280) };
  }).filter((i) => i.title && /^https?:\/\//.test(i.link)).sort((a, b) => b.published - a.published);
}

const cache = new Map<string, { at: number; v: Feed }>();
const KEEP_MS = 15 * 60_000;
export const clearNewsCache = () => cache.clear();

/** One feed, cached for 15 minutes. A feed that fails says why instead of throwing. */
export async function feed(url: string): Promise<Feed> {
  const hit = cache.get(url);
  if (hit && Date.now() - hit.at < KEEP_MS) return hit.v;
  const host = (() => { try { return new URL(url).host; } catch { return url; } })();
  let v: Feed;
  try {
    const r = await call(url, { headers: UA, timeoutMs: 10_000 });
    if (!r.ok) v = { url, title: host, items: [], error: `The feed answered ${r.status}.` };
    else { const xml = String(r.body); v = { url, title: strip(pick(xml.replace(/<(item|entry)\b[\s\S]*$/i, ""), "title")) || host, items: parseFeed(xml, host), error: "" }; }
  } catch (e: any) { v = { url, title: host, items: [], error: e.message }; }
  cache.set(url, { at: Date.now(), v });
  return v;
}

/** Headlines from every feed, newest first, one per title. */
export async function news(feeds: string[], max: number): Promise<{ items: NewsItem[]; errors: string[] }> {
  const all = await Promise.all(feeds.map(feed));
  const seen = new Set<string>(), items: NewsItem[] = [];
  for (const i of all.flatMap((f) => f.items).sort((a, b) => b.published - a.published)) {
    const k = i.title.toLowerCase();
    if (!seen.has(k)) { seen.add(k); items.push(i); }
  }
  return { items: items.slice(0, max), errors: all.filter((f) => f.error).map((f) => `${f.title}: ${f.error}`) };
}
