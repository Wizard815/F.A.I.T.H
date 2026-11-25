import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { schemaRecipe } from "../src/connectors/mealie.js";
import { fakeModel } from "./fakes.js";

// A recipe from a photo (a cookbook page, Grandma's card) into Mealie: the model reads it,
// recipe_add sends it to Mealie as a schema.org Recipe, after the person's Yes.
const card = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const got: { path: string; auth: string; body: any }[] = [];
let mealie: ReturnType<typeof createServer>, mealieUrl = "", model: Awaited<ReturnType<typeof fakeModel>>, A: App;
let script: (req: any) => any = () => ({ content: "ok" });
const env: Record<string, string> = { MEALIE_TOKEN: "mealie-tok" };

before(async () => {
  mealie = createServer(async (req, res) => {
    let raw = ""; for await (const c of req) raw += c;
    const auth = String(req.headers.authorization || "");
    got.push({ path: `${req.method} ${req.url}`, auth, body: raw ? JSON.parse(raw) : null });
    res.setHeader("content-type", "application/json");
    if (auth !== "Bearer mealie-tok") { res.statusCode = 401; return res.end(JSON.stringify({ detail: "Not authenticated" })); }
    if (req.url === "/api/users/self") return res.end(JSON.stringify({ username: "faith" }));
    if (req.method === "POST" && req.url === "/api/recipes/create/html-or-json") { res.statusCode = 201; return res.end(JSON.stringify("grandmas-apple-pie")); }
    if (req.method === "POST" && req.url === "/api/recipes/create/url") { res.statusCode = 201; return res.end(JSON.stringify("weeknight-chili")); }
    if (req.url === "/api/recipes/grandmas-apple-pie") return res.end(JSON.stringify({ id: "r-1", name: "Grandma's apple pie" }));
    if (req.url === "/api/recipes/weeknight-chili") return res.end(JSON.stringify({ id: "r-2", name: "Weeknight chili" }));
    res.statusCode = 404; res.end("{}");
  });
  await new Promise<void>((r) => mealie.listen(0, "127.0.0.1", r));
  mealieUrl = `http://127.0.0.1:${(mealie.address() as AddressInfo).port}`;
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "kid", name: "Kid", role: "child" }],
    connectors: [{ id: "mealie", type: "mealie", url: mealieUrl }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
});
after(async () => { await A.app.close(); mealie.close(); model.close(); });

const as = (i: number) => ({ scope: { kind: "person" as const, person: A.registry["cfg"]().people[i] }, channel: "personal" as const, label: "x" });
const names = async (c: any) => (await A.registry.toolsFor(c)).tools.map((t) => t.name);
const pie = { name: "Grandma's apple pie", servings: "8", prep_minutes: 30, cook_minutes: 50,
  ingredients: ["6 apples", "1 cup sugar", "2 pie crusts"], steps: ["Slice the apples.", "Mix with the sugar.", "Bake at 375°F for 50 minutes."],
  notes: "Use tart apples.", source: "Grandma's card", tags: ["dessert"] };

test("a recipe card photo: added to Mealie only after the person's Yes, as a schema.org Recipe", async () => {
  let k = 0, result = "";
  script = (req) => {
    if (k++ === 0) return { tool_calls: [{ name: "recipe_add", args: pie }] };
    result = String([...req.messages].reverse().find((m: any) => m.role === "tool")?.content ?? "");
    return { content: "Added." };
  };
  const r = await A.agent.turn({ caller: as(0), text: "put this in mealie", images: [card] });
  assert.equal(r.pending.length, 1, "it waits for a Yes");
  assert.match(r.pending[0].summary, /add the recipe "Grandma's apple pie" to Mealie \(3 ingredients, 3 steps\)/);
  assert.ok(!got.some((g) => g.path.startsWith("POST")), "nothing sent before the Yes");
  await A.agent.confirm(as(0), r.pending[0].id, true);
  const sent = got.find((g) => g.path === "POST /api/recipes/create/html-or-json")!;
  assert.equal(sent.auth, "Bearer mealie-tok");
  assert.equal(sent.body.includeTags, true);
  const ld = JSON.parse(sent.body.data);
  assert.equal(ld["@type"], "Recipe");
  assert.equal(ld.name, "Grandma's apple pie");
  assert.deepEqual(ld.recipeIngredient, pie.ingredients);
  assert.deepEqual(ld.recipeInstructions.map((s: any) => s.text), [...pie.steps, "Note: Use tart apples."]);
  assert.equal(ld.prepTime, "PT30M");
  assert.equal(ld.cookTime, "PT50M");
  assert.equal(ld.recipeYield, "8");
  assert.equal(ld.description, "From Grandma's card.");
  assert.equal(ld.keywords, "dessert");
});

test("the result gives the recipe id (for the meal plan)", async () => {
  const t = (await A.registry.toolsFor(as(0))).tools.find((x) => x.name === "recipe_add")!;
  assert.deepEqual(await t.run(pie), { ok: true, name: "Grandma's apple pie", slug: "grandmas-apple-pie", recipe_id: "r-1", note: "Saved in Mealie." });
  const u = (await A.registry.toolsFor(as(0))).tools.find((x) => x.name === "recipe_import")!;
  assert.equal(((await u.run({ url: "https://example.com/chili" })) as any).recipe_id, "r-2");
  await assert.rejects(() => u.run({ url: "chili please" }) as Promise<unknown>, /isn't a web address/);
});

test("a recipe without ingredients or steps isn't sent: FAITH asks instead", async () => {
  const t = (await A.registry.toolsFor(as(0))).tools.find((x) => x.name === "recipe_add")!;
  const n = got.length;
  await assert.rejects(() => t.run({ name: "Soup", ingredients: [], steps: ["Boil."] }) as Promise<unknown>, /needs a name, its ingredients and its steps/);
  assert.equal(got.length, n);
});

test("who gets it: grown-ups yes, children no, and nobody without a token", async () => {
  assert.ok((await names(as(0))).includes("recipe_add"));
  assert.ok(!(await names(as(1))).includes("recipe_add"), "not children, by default");
  delete env.MEALIE_TOKEN;
  assert.ok(!(await names(as(0))).includes("recipe_add"), "no token, no tool");
  env.MEALIE_TOKEN = "wrong";
  const why = await (A.registry.connectors.find((c) => c.id === "mealie") as any).ping(as(0)).then(() => "", (e: any) => e.message);
  assert.match(why, /Mealie refused the token in MEALIE_TOKEN \(401\).*API Tokens/);
  env.MEALIE_TOKEN = "mealie-tok";
});

test("the skill is offered to grown-ups and the shared view, not to children", () => {
  for (const p of ["admin", "adult", "parents", "household"] as const) assert.ok(A.skills.forPolicy(p).some((s) => s.name === "recipe-from-photo"), p);
  assert.ok(!A.skills.forPolicy("child").some((s) => s.name === "recipe-from-photo"));
  assert.match(A.skills.get("recipe-from-photo")!.body, /recipe_add/);
});

test("schema.org: times only when given", () => {
  const r = schemaRecipe({ name: "Toast", ingredients: ["bread"], steps: ["Toast it."] });
  assert.equal(r.prepTime, undefined);
  assert.equal(r.description, undefined);
});
