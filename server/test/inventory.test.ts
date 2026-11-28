import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeModel } from "./fakes.js";

// The house inventory (Homebox): search, locations, tags, adding and changing items.
// One household account. Items tagged "private", and prices and serial numbers, are for
// grown-ups only. Homebox's API comes in three shapes (labels, tags, entities): FAITH
// asks which and speaks it, so the fake plays each.

type Mode = "labels" | "tags" | "entities";
function fakeHomebox(mode: Mode) {
  const seen: { path: string; auth: string; body: any }[] = [];
  const tags = [{ id: "t1", name: "Cables" }, { id: "t2", name: "private" }, { id: "t3", name: "Camping" }];
  const locs = [{ id: "l1", name: "Garage" }, { id: "l2", name: "Office" }, { id: "l3", name: "Garage shelf", parent: { id: "l1", name: "Garage" } }];
  const items: any[] = [
    { id: "i1", name: "HDMI cable", description: "2 m", quantity: 3, loc: "l2", tags: ["t1"], notes: "", purchasePrice: 9, serialNumber: "" },
    { id: "i2", name: "Grandma's ring", description: "", quantity: 1, loc: "l2", tags: ["t2"], notes: "In the small box", purchasePrice: 2400, serialNumber: "" },
    { id: "i3", name: "Tent", description: "4 person", quantity: 1, loc: "l1", tags: ["t3"], notes: "", purchasePrice: 180, serialNumber: "SN-42", modelNumber: "T4" },
  ];
  const tagKey = mode === "labels" ? "labels" : "tags", tagIdsKey = mode === "labels" ? "labelIds" : "tagIds";
  const out = (it: any) => {
    const l = locs.find((x) => x.id === it.loc), o: any = { id: it.id, name: it.name, description: it.description, quantity: it.quantity, notes: it.notes, purchasePrice: it.purchasePrice, serialNumber: it.serialNumber, modelNumber: it.modelNumber ?? "", archived: !!it.archived,
      [tagKey]: it.tags.map((t: string) => tags.find((x) => x.id === t)), createdAt: "2026-01-01" };
    if (mode === "entities") o.parent = { id: l!.id, name: l!.name }; else o.location = { id: l!.id, name: l!.name };
    return o;
  };
  const s: Server = createServer(async (req, res) => {
    let raw = ""; for await (const c of req) raw += c;
    const url = new URL(req.url!, "http://x"), p = url.pathname, auth = String(req.headers.authorization || "");
    const body = raw ? JSON.parse(raw) : null;
    seen.push({ path: `${req.method} ${p}${url.search}`, auth, body });
    res.setHeader("content-type", "application/json");
    const json = (v: unknown, code = 200) => { res.statusCode = code; res.end(JSON.stringify(v)); };
    if (p === "/api/v1/users/login") return body?.username === "faith@home" && body?.password === "pw" ? json({ token: "Bearer hb-tok", expiresAt: new Date(Date.now() + 3600_000).toISOString() }) : json({ error: "bad" }, 401);
    if (auth !== "Bearer hb-tok") return json({ error: "unauthorized" }, 401);
    const itemsPath = mode === "entities" ? "/api/v1/entities" : "/api/v1/items", tagsPath = mode === "labels" ? "/api/v1/labels" : "/api/v1/tags";
    if (mode !== "entities" && p.startsWith("/api/v1/entities")) return json({}, 404);
    if (mode === "labels" && p.startsWith("/api/v1/tags")) return json({}, 404);
    if (req.method === "GET" && p === tagsPath) return json(tags);
    if (req.method === "POST" && p === tagsPath) { const t = { id: `t${tags.length + 1}`, name: body.name }; tags.push(t); return json(t, 201); }
    if (req.method === "GET" && mode !== "entities" && p === "/api/v1/locations") return json(locs.map((l) => ({ ...l, itemCount: items.filter((i) => i.loc === l.id).length })));
    if (req.method === "POST" && (p === "/api/v1/locations" || (mode === "entities" && p === itemsPath && body?.isLocation))) { const l: any = { id: `l${locs.length + 1}`, name: body.name, ...(body.parentId ? { parent: { id: body.parentId, name: locs.find((x) => x.id === body.parentId)!.name } } : {}) }; locs.push(l); return json(l, 201); }
    if (req.method === "GET" && p === "/api/v1/entity-types") return json([{ id: "et-item", name: "Item", isLocation: false }, { id: "et-loc", name: "Location", isLocation: true }]);
    if (req.method === "GET" && p === itemsPath) {
      if (url.searchParams.get("isLocation") === "true") return json({ page: 1, pageSize: 1000, total: locs.length, items: locs.map((l) => ({ ...l, itemCount: items.filter((i) => i.loc === l.id).length })) });
      const q = (url.searchParams.get("q") || "").toLowerCase(), locF = url.searchParams.getAll(mode === "entities" ? "parentIds" : "locations"), tagF = url.searchParams.getAll(tagKey);
      const hit = items.filter((i) => (!q || `${i.name} ${i.description} ${i.notes}`.toLowerCase().includes(q)) && (!locF.length || locF.includes(i.loc)) && tagF.every((t) => i.tags.includes(t)) && (!i.archived || url.searchParams.get("includeArchived")));
      return json({ page: 1, pageSize: 20, total: hit.length, items: hit.map(out) });
    }
    if (req.method === "POST" && p === itemsPath) {
      const it = { id: `i${items.length + 1}`, name: body.name, description: body.description, quantity: 1, loc: body[mode === "entities" ? "parentId" : "locationId"], tags: body[tagIdsKey] ?? [], notes: "", purchasePrice: 0, serialNumber: "" };
      items.push(it); return json({ id: it.id, name: it.name }, 201);
    }
    const m = p.match(new RegExp(`^${itemsPath}/([^/]+)$`));
    const it = m && items.find((i) => i.id === m[1]);
    if (m && !it) return json({ error: "not found" }, 404);
    if (it && req.method === "GET") return json(out(it));
    if (it && req.method === "PUT") {
      assert.equal(body.id, it.id); assert.ok(body.name, "the whole item is sent back");
      for (const k of ["location", "labels", "tags", "parent", "createdAt"]) assert.ok(!(k in body), `no ${k} in an update`);
      Object.assign(it, { name: body.name, description: body.description, quantity: body.quantity, notes: body.notes, archived: body.archived, loc: body[mode === "entities" ? "parentId" : "locationId"], tags: body[tagIdsKey] });
      return json(out(it));
    }
    json({ error: `no ${req.method} ${p}` }, 404);
  });
  return { s, seen, items, tags, locs };
}

const env: Record<string, string> = { HOMEBOX_USER: "faith@home", HOMEBOX_PASSWORD: "pw" };
let model: Awaited<ReturnType<typeof fakeModel>>;
const apps: { mode: Mode; A: App; hb: ReturnType<typeof fakeHomebox> }[] = [];
let script: (req: any) => any = () => ({ content: "ok" });

before(async () => {
  model = await fakeModel((req) => script(req));
  for (const mode of ["labels", "tags", "entities"] as Mode[]) {
    const hb = fakeHomebox(mode);
    await new Promise<void>((r) => hb.s.listen(0, "127.0.0.1", r));
    const cfg = parseConfig({
      model: { base_url: model.url },
      people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "kid", name: "Kid", role: "kid-pro" }],
      connectors: [{ id: "homebox", type: "homebox", url: `http://127.0.0.1:${(hb.s.address() as AddressInfo).port}/api/v1` }],
    }, {});
    apps.push({ mode, hb, A: await buildApp({ config: () => cfg, dataFile: ":memory:", env }) });
  }
});
after(async () => { for (const a of apps) { await a.A.app.close(); a.hb.s.close(); } model.close(); });

const as = (A: App, i: number) => ({ scope: { kind: "person" as const, person: A.registry["cfg"]().people[i] }, channel: "personal" as const, label: "x" });
const house = { scope: { kind: "household" as const }, channel: "hub" as const, label: "household" };
const tool = async (A: App, caller: any, name: string) => (await A.registry.toolsFor(caller)).tools.find((t) => t.name === name);
const run = async (A: App, caller: any, name: string, args: any = {}) => (await tool(A, caller, name))!.run(args) as Promise<any>;

for (const mode of ["labels", "tags", "entities"] as Mode[]) {
  const get = () => apps.find((a) => a.mode === mode)!;

  test(`TestHomebox_${mode}: search by words, location and tag, with the household login`, async () => {
    const { A, hb } = get();
    const r = await run(A, as(A, 0), "inventory_search", { query: "hdmi" });
    assert.deepEqual(r.items.map((i: any) => [i.name, i.location, i.tags, i.quantity]), [["HDMI cable", "Office", ["Cables"], 3]]);
    assert.ok(hb.seen.filter((s) => !s.path.includes("login")).every((s) => s.auth === "Bearer hb-tok"));
    assert.equal(hb.seen.filter((s) => s.path.includes("login")).length, 1, "one login, then the token is kept");
    const g = await run(A, as(A, 0), "inventory_search", { location: "garage" });
    assert.deepEqual(g.items.map((i: any) => i.name), ["Tent"], "an exact name wins over Garage shelf");
    const c = await run(A, as(A, 0), "inventory_search", { tags: ["camping"] });
    assert.deepEqual(c.items.map((i: any) => i.name), ["Tent"]);
    const none = await run(A, as(A, 0), "inventory_search", { tags: ["Tools"] });
    assert.match(none.note, /no tag Tools/);
    await assert.rejects(run(A, as(A, 0), "inventory_search", { location: "attic" }), /no location "attic".*Garage, Office/);
  });

  test(`TestHomebox_${mode}: private items and prices are for grown-ups only`, async () => {
    const { A } = get();
    const grown = await run(A, as(A, 0), "inventory_search", {});
    assert.ok(grown.items.some((i: any) => i.name === "Grandma's ring"));
    assert.equal(grown.items.find((i: any) => i.name === "Tent").serial_number, "SN-42");
    assert.equal(grown.items.find((i: any) => i.name === "Tent").purchase_price, 180);
    for (const caller of [as(A, 1), house]) {
      const r = await run(A, caller, "inventory_search", {});
      assert.ok(!r.items.some((i: any) => i.name === "Grandma's ring"), caller.label);
      assert.equal(r.items.find((i: any) => i.name === "Tent").serial_number, undefined);
      assert.equal(r.items.find((i: any) => i.name === "Tent").purchase_price, undefined);
      await assert.rejects(run(A, caller, "inventory_item", { item_id: "i2" }), /no item i2/);
      assert.ok(!(await run(A, caller, "inventory_tags")).tags.includes("private"));
    }
    assert.ok((await run(A, as(A, 0), "inventory_tags")).tags.includes("private"));
  });

  test(`TestHomebox_${mode}: who can change it: grown-ups; the kitchen screen asks; a kid can't`, async () => {
    const { A } = get();
    assert.ok(await tool(A, as(A, 0), "inventory_update"));
    assert.ok(!(await tool(A, as(A, 1), "inventory_update")), "kid-pro's allowlist doesn't have it");
    assert.ok(await tool(A, as(A, 1), "inventory_search"), "but they can look things up");
    const h = await tool(A, house, "inventory_add");
    assert.ok(!h || h.approval, "the shared screen's change waits for a grown-up");
  });

  test(`TestHomebox_${mode}: add an item with a new tag, after the Yes`, async () => {
    const { A, hb } = get();
    let k = 0;
    script = () => (k++ === 0 ? { tool_calls: [{ name: "inventory_add", args: { name: "Headlamp", location: "Garage shelf", quantity: 2, tags: ["Camping", "Batteries"], notes: "AAA" } }] } : { content: "Added." });
    const r = await A.agent.turn({ caller: as(A, 0), text: "add 2 headlamps to the garage shelf" });
    if (r.pending.length) {
      assert.match(r.pending[0].summary, /add 2 × "Headlamp" to the inventory in Garage shelf, tagged Camping, Batteries/);
      await A.agent.confirm(as(A, 0), r.pending[0].id, true);
    }
    const it = hb.items.find((i) => i.name === "Headlamp")!;
    assert.ok(it, "added");
    assert.equal(it.loc, "l3");
    assert.equal(it.quantity, 2);
    assert.equal(it.notes, "AAA");
    assert.deepEqual(it.tags.map((t: string) => hb.tags.find((x) => x.id === t)!.name), ["Camping", "Batteries"]);
    assert.ok(hb.tags.some((t) => t.name === "Batteries"), "the new tag was made");
  });

  test(`TestHomebox_${mode}: update moves, retags and archives, keeping the rest`, async () => {
    const { A, hb } = get();
    const r = await run(A, as(A, 0), "inventory_update", { item_id: "i1", location: "Garage", quantity: 2, add_tags: ["Office stuff"], remove_tags: ["cables"] });
    assert.match(r.changed, /move to Garage, quantity 2, tag Office stuff, untag cables/);
    const it = hb.items.find((i) => i.id === "i1")!;
    assert.equal(it.loc, "l1"); assert.equal(it.quantity, 2); assert.equal(it.description, "2 m", "untouched fields stay");
    assert.deepEqual(it.tags.map((t: string) => hb.tags.find((x) => x.id === t)!.name), ["Office stuff"]);
    await run(A, as(A, 0), "inventory_update", { item_id: "i1", archived: true });
    assert.equal((await run(A, as(A, 0), "inventory_search", { query: "hdmi" })).items.length, 0, "archived items drop out");
    assert.equal((await run(A, as(A, 0), "inventory_search", { query: "hdmi", archived: true })).items.length, 1);
    await assert.rejects(run(A, as(A, 0), "inventory_update", { item_id: "nope", quantity: 1 }), /no item nope/);
  });

  test(`TestHomebox_${mode}: locations, and adding one inside another`, async () => {
    const { A, hb } = get();
    const r = await run(A, as(A, 0), "inventory_locations");
    assert.ok(r.locations.some((l: any) => l.name === "Garage shelf" && l.in === "Garage"));
    await run(A, as(A, 0), "inventory_add_location", { name: "Blue bin", inside: "Garage" });
    const bin = hb.locs.find((l) => l.name === "Blue bin") as any;
    assert.equal(bin.parent?.name, "Garage");
    if (mode === "entities") assert.equal(hb.seen.filter((s) => s.body?.isLocation).at(-1)!.body.entityTypeId, "et-loc");
  });
}

test("TestHomebox_login: no account, no tools; a wrong password says so", async () => {
  const { A } = apps[0];
  delete env.HOMEBOX_PASSWORD;
  assert.ok(!(await tool(A, as(A, 0), "inventory_search")), "no account, no tool");
  env.HOMEBOX_PASSWORD = "wrong";
  const fresh = parseConfig({ model: { base_url: model.url }, people: [{ id: "wizard", name: "Wizard", role: "admin" }], connectors: [{ id: "homebox", type: "homebox", url: `http://127.0.0.1:${(apps[0].hb.s.address() as AddressInfo).port}` }] }, {});
  const B = await buildApp({ config: () => fresh, dataFile: ":memory:", env });
  const why = await (B.registry.connectors.find((c) => c.id === "homebox") as any).ping(as(B, 0)).then(() => "", (e: any) => e.message);
  assert.match(why, /Homebox refused the login in HOMEBOX_USER \/ HOMEBOX_PASSWORD/);
  await B.app.close();
  env.HOMEBOX_PASSWORD = "pw";
});
