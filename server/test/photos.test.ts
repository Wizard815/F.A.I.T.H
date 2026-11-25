import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { MattermostBot } from "../src/mattermost.js";
import { fakeHa, fakeImmich, fakeMattermost, fakeModel } from "./fakes.js";

// The family's photo library (Immich). Each person's FAITH searches with their own Immich
// account's key, so they see what Immich lets that account see. FAITH checks whose account
// a key is before using it; the shared screens use a family account's key, if any.
const P = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const LIB = {
  "k-wiz": { email: "wizard@example.org", name: "Wizard", photos: [
    { id: P(1), what: "beach sunset", people: ["Robin"], city: "Holland", date: "2026-07-04" },
    { id: P(2), what: "birthday cake", people: ["Robin", "Sam"], date: "2026-03-12" },
    { id: P(3), what: "dog in the snow", date: "2026-01-20", video: true },
  ] },
  "k-sam": { email: "sam@example.org", name: "Sam", photos: [{ id: P(9), what: "beach towels", date: "2026-07-05" }] },
  "k-robin": { email: "robin@example.org", name: "Robin", photos: [{ id: P(20), what: "lego castle", date: "2026-10-01" }] },
  "k-family": { email: "family@example.org", name: "Family", photos: [{ id: P(30), what: "beach group photo", people: ["Robin", "Sam", "Wizard"], date: "2026-07-04" }] },
};
let immich: Awaited<ReturnType<typeof fakeImmich>>, model: Awaited<ReturnType<typeof fakeModel>>, ha: Awaited<ReturnType<typeof fakeHa>>, mm: Awaited<ReturnType<typeof fakeMattermost>>;
let A: App, bot: MattermostBot;
let script: (req: any) => any = () => ({ content: "ok" });
const env: Record<string, string> = { IMMICH_KEY_WIZARD: "k-wiz", IMMICH_KEY_SAM: "k-sam", IMMICH_KEY_ROBIN: "k-robin", HA: "ha", MATTERMOST_BOT_TOKEN: "mm-token" };
before(async () => {
  immich = await fakeImmich(LIB);
  ha = await fakeHa({});
  mm = await fakeMattermost(["wizard", "sam"]);
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [
      { id: "wizard", name: "Wizard", role: "admin", immich_user: "wizard@example.org", mattermost_username: "wizard" },
      { id: "sam", name: "Sam", role: "adult", immich_user: "Sam@Example.org", mattermost_username: "sam" },
      { id: "robin", name: "Robin", role: "child" },
    ],
    connectors: [
      { id: "photos", type: "immich", url: `${immich.url}/api`, public_url: "https://photos.example.org", household_key_env: "IMMICH_KEY_FAMILY" },
      { id: "homeassistant", type: "homeassistant", url: ha.url, token_env: "HA" },
    ],
    mattermost: { url: mm.url, team: "family" },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
  bot = new MattermostBot(() => cfg, A.db, A.agent, A.approvals, { info() {}, warn() {} }, env);
  await bot.setup();
});
after(async () => { await A.app.close(); for (const s of [immich, model, ha, mm]) s.close(); });

const people = () => A.registry["cfg"]().people;
const as = (i: number) => ({ scope: { kind: "person" as const, person: people()[i] }, channel: "personal" as const, label: people()[i].id });
const house = { scope: { kind: "household" as const }, channel: "hub" as const, label: "kitchen" };
const photoTools = async (c: any) => (await A.registry.toolsFor(c)).tools.filter((t) => t.name.startsWith("photos_")).map((t) => t.name);
const tool = async (c: any, name: string) => (await A.registry.toolsFor(c)).tools.find((t) => t.name === name)!;
const why = async (c: any) => (A.registry.connectors.find((x) => x.id === "photos") as any).ping(c).then(() => "", (e: any) => e.message);
const lastTool = (req: any) => String([...req.messages].reverse().find((m: any) => m.role === "tool")?.content ?? "");

test("each person searches their own library, with their own key, and sees the photos", async () => {
  let k = 0, said = "";
  script = (req) => (k++ === 0 ? { tool_calls: [{ name: "photos_search", args: { query: "beach" } }] } : ((said = lastTool(req)), { content: "Here's the beach." }));
  const events: any[] = [];
  const r = await A.agent.turn({ caller: as(0), text: "show me beach photos", onEvent: (e) => events.push(e) });
  assert.deepEqual(r.photos?.map((p) => p.id), [P(1)], "Wizard's beach, not Sam's");
  assert.deepEqual(events.find((e) => e.type === "photos")?.items.map((p: any) => p.id), [P(1)]);
  assert.equal(r.photos![0].place, "Holland, USA");
  assert.deepEqual(r.photos![0].people, ["Robin"]);
  assert.equal(r.photos![0].link, `https://photos.example.org/photos/${P(1)}`);
  assert.ok(immich.seen.filter((s) => s.path.startsWith("POST /search")).every((s) => s.key === "k-wiz"));
  assert.match(said, /beach sunset|2026-07-04/);
  k = 0;
  const s = await A.agent.turn({ caller: as(1), text: "show me beach photos" });
  assert.deepEqual(s.photos?.map((p) => p.id), [P(9)], "Sam gets Sam's");
});

test("people, dates and videos become Immich's filters", async () => {
  const t = await tool(as(0), "photos_search");
  const r: any = await t.run({ people: ["robin"], after: "2026-03-01", before: "2026-12-31" });
  assert.deepEqual(r.photos.map((p: any) => p.id).sort(), [P(1), P(2)]);
  const q = immich.seen.filter((s) => s.path === "POST /search/metadata").at(-1)!.body;
  assert.deepEqual(q.personIds, ["person-robin"]);
  assert.equal(q.takenAfter, "2026-03-01T00:00:00.000Z");
  assert.equal(q.takenBefore, "2026-12-31T23:59:59.999Z");
  assert.deepEqual(((await t.run({ videos: true })) as any).photos.map((p: any) => p.kind), ["video"]);
  assert.match(((await t.run({ people: ["Grandpa"] })) as any).note, /doesn't know a face named Grandpa/);
  assert.deepEqual(((await (await tool(as(0), "photos_people")).run({})) as any).people.sort(), ["Robin", "Sam"]);
});

test("a key of someone else's account is refused, and says why", async () => {
  env.IMMICH_KEY_WIZARD = "k-sam";
  assert.deepEqual(await photoTools(as(0)), []);
  assert.match(await why(as(0)), /IMMICH_KEY_WIZARD is the Immich account sam@example.org, not Wizard's/);
  env.IMMICH_KEY_WIZARD = "k-wiz";
  // Robin has no immich_user, but this key is Sam's own account.
  env.IMMICH_KEY_ROBIN = "k-sam";
  (A.registry.connectors.find((x) => x.id === "photos") as any).who.clear();
  assert.deepEqual(await photoTools(as(2)), []);
  assert.match(await why(as(2)), /IMMICH_KEY_ROBIN is Sam's Immich account, so Robin would see Sam's photos/);
  env.IMMICH_KEY_ROBIN = "k-robin";
  assert.ok((await photoTools(as(2))).includes("photos_search"), "a child with their own account");
});

test("the shared screens: no family key, no photos; never a person's own account", async () => {
  assert.deepEqual(await photoTools(house), []);
  env.IMMICH_KEY_FAMILY = "k-sam";
  assert.deepEqual(await photoTools(house), []);
  assert.match(await why(house), /IMMICH_KEY_FAMILY is Sam's own Immich account, so the shared view would see Sam's photos/);
  env.IMMICH_KEY_FAMILY = "k-family";
  const r: any = await (await tool(house, "photos_search")).run({ query: "beach" });
  assert.deepEqual(r.photos.map((p: any) => p.id), [P(30)]);
});

test("thumbnails come through FAITH with the asker's own key; another library's photo doesn't", async () => {
  const tok = A.auth.addToken("client", "wizard-laptop-t", "wizard");
  const H = { authorization: `Bearer ${tok}` };
  const ok = await A.app.inject({ url: `/api/photos/photos/${P(1)}`, headers: H });
  assert.equal(ok.statusCode, 200);
  assert.equal(ok.headers["content-type"], "image/jpeg");
  assert.equal(ok.body, `jpeg:${P(1)}`);
  assert.equal((await A.app.inject({ url: `/api/photos/photos/${P(9)}`, headers: H })).statusCode, 404, "Sam's photo, Wizard's key");
  assert.equal((await A.app.inject({ url: `/api/photos/photos/not-an-id`, headers: H })).statusCode, 404);
  assert.equal((await A.app.inject({ url: `/api/photos/photos/${P(1)}` })).statusCode, 401);
});

test("the Home Assistant card gets the photos and their pictures", async () => {
  const haTok = A.auth.addToken("ha", "homeassistant-p");
  let k = 0;
  script = () => (k++ === 0 ? { tool_calls: [{ name: "photos_search", args: { query: "beach" } }] } : { content: "The family at the beach." });
  const r = (await A.app.inject({ method: "POST", url: "/api/ha/chat", headers: { authorization: `Bearer ${haTok}` }, payload: { text: "beach photos" } })).json();
  assert.deepEqual(r.photos.map((p: any) => p.id), [P(30)], "the household's family account");
  const pic = (await A.app.inject({ method: "POST", url: "/api/ha/photo", headers: { authorization: `Bearer ${haTok}` }, payload: { source: "photos", id: P(30) } })).json();
  assert.equal(pic.data_url, `data:image/jpeg;base64,${Buffer.from(`jpeg:${P(30)}`).toString("base64")}`);
});

test("a share link always waits for the person's own Yes, and expires", async () => {
  let k = 0;
  script = () => (k++ === 0 ? { tool_calls: [{ name: "photos_share", args: { ids: [P(1), P(2)], days: 3 } }] } : { content: "Tap Yes." });
  const r = await A.agent.turn({ caller: as(0), text: "make a link for grandma" });
  assert.equal(r.pending.length, 1);
  assert.equal(r.pending[0].summary, "make a link that lets anyone who has it see 2 photos for 3 days");
  assert.equal(immich.links.length, 0);
  const y: any = await A.agent.confirm(as(0), r.pending[0].id, true);
  assert.equal(immich.links.length, 1);
  assert.deepEqual(immich.links[0].assetIds, [P(1), P(2)]);
  assert.equal(immich.links[0].by, "k-wiz");
  const days = (Date.parse(immich.links[0].expiresAt) - Date.now()) / 86_400_000;
  assert.ok(days > 2.9 && days < 3.1);
  assert.match(JSON.stringify(y), /share1|Done/);
});

test("albums: made once, then added to", async () => {
  const t = await tool(as(0), "photos_album_add");
  assert.equal(((await t.run({ album: "Summer", ids: [P(1)] })) as any).new_album, true);
  assert.equal(((await t.run({ album: "summer", ids: [P(2)] })) as any).new_album, undefined);
  assert.deepEqual(immich.albums.map((a) => [a.albumName, a.assets]), [["Summer", [P(1), P(2)]]]);
});

test("looking at photos: what's in them counts as media, so a change after it waits for a Yes", async () => {
  let k = 0;
  script = (req) => {
    k++;
    if (req.messages?.[0]?.content?.includes?.("You describe one camera picture")) return { content: "Robin holding a beach ball." };
    if (k === 1) return { tool_calls: [{ name: "photos_look", args: { ids: [P(1)], question: "who is holding the ball?" } }] };
    if (k <= 3) return { tool_calls: [{ name: "photos_album_add", args: { album: "Ball", ids: [P(1)] } }] };
    return { content: "Tap Yes to add it." };
  };
  const r = await A.agent.turn({ caller: as(0), text: "who's holding the ball? put it in an album" });
  assert.equal(r.pending.length, 1, "the album change waits");
  assert.ok(!immich.albums.some((a) => a.albumName === "Ball"));
});

test("smart search off: a plain message", async () => {
  immich.smart(false);
  await assert.rejects((await tool(as(0), "photos_search")).run({ query: "cake" }) as Promise<unknown>, /smart search is off/);
  immich.smart(true);
});

test("Mattermost: the photos go into the chat, fetched with that chat's own key", async () => {
  let k = 0;
  script = () => (k++ === 0 ? { tool_calls: [{ name: "photos_search", args: { query: "beach" } }] } : { content: "From the Fourth of July." });
  await bot.handle({ id: "x1", user_id: mm.id("wizard"), channel_id: `dm_${mm.id("wizard")}`, message: "beach photos?" });
  const post = mm.posts.at(-1)!;
  assert.equal(post.message, "From the Fourth of July.");
  assert.equal(post.file_ids?.length, 1);
  assert.equal(mm.files.get(post.file_ids![0])!.bytes.toString(), `jpeg:${P(1)}`, "Wizard's DM: Wizard's photo");
});
