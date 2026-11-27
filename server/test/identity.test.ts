import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeMcp, fakeModel } from "./fakes.js";

// FAITH checks each wiki token with whoami before using it: a person's view gets only
// their own member (or child) token, a shared view a shared agent's, never the master key.
const WHO: Record<string, string> = {
  "w-wiz-admin": "You are acting for: Wizard (admin, id wizard).",
  "w-wiz": "You are acting for: Wizard (member, id wizard).",
  "w-sam": "You are acting for: Sam (member, id sam).",
  "w-robin-member": "You are acting for: Robin (member, id robin).",
  "w-robin": "You are acting for: Robin (child, id robin).",
  "w-house": "You are acting for: FAITH (shared, id faith).",
  "w-parents": "You are acting for: FAITH parents (shared-parents, id faith-parents).",
  "w-master": "You are acting for: Master key (master, id master).",
};
let wiki: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App;
const env: Record<string, string> = {};
before(async () => {
  wiki = await fakeMcp([
    { name: "whoami", readOnly: true, run: (_a, t) => WHO[t] ?? "who?" },
    { name: "notes_search", readOnly: true, run: () => ({ results: [] }) },
  ]);
  model = await fakeModel(() => ({ content: "ok" }));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "sam", name: "Sam", role: "adult" }, { id: "robin", name: "Robin", role: "child" }],
    connectors: [{ id: "wiki", type: "mcp", url: wiki.url, household_token_env: "W_H", person_token_env: "W_{ID}", parents_token_env: "W_P" }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
});
after(async () => { await A.app.close(); wiki.close(); model.close(); });
const people = () => A.registry["cfg"]().people;
const as = (i: number) => ({ scope: { kind: "person" as const, person: people()[i] }, channel: "personal" as const, label: people()[i].id });
const house = { scope: { kind: "household" as const }, channel: "hub" as const, label: "kitchen" };
const parents = { scope: { kind: "household" as const }, channel: "mattermost" as const, audience: "parents" as const, label: "parents chat" };
const family = { scope: { kind: "household" as const }, channel: "mattermost" as const, audience: "family" as const, label: "family chat" };
const wikiTools = async (c: any) => (await A.registry.toolsFor(c)).tools.filter((t) => t.name.startsWith("wiki_")).length;
const why = async (c: any) => { try { await (A.registry.connectors.find((x) => x.id === "wiki") as any).ping(c); return ""; } catch (e: any) { return e.message as string; } };

test("wrong tokens give the view no wiki at all, and say why", async () => {
  Object.assign(env, { W_WIZARD: "w-wiz-admin", W_SAM: "w-wiz", W_ROBIN: "w-robin-member", W_H: "w-master", W_P: "w-sam" });
  assert.equal(await wikiTools(as(0)), 0);
  assert.match(await why(as(0)), /W_WIZARD is an admin token: it reads every person's notes.*--as member/);
  assert.equal(await wikiTools(as(1)), 0);
  assert.match(await why(as(1)), /W_SAM belongs to wizard, not Sam/);
  assert.equal(await wikiTools(as(2)), 0);
  assert.match(await why(as(2)), /Robin is a kid in FAITH \(kid-lite\) but not a child in wiki/);
  assert.equal(await wikiTools(house), 0);
  assert.match(await why(house), /master key.*FAITH never uses it/);
  assert.equal(await wikiTools(parents), 0);
  assert.match(await why(parents), /W_P is sam's own token, so the shared view would see private notes/);
});

test("the right tokens: each view gets the wiki", async () => {
  Object.assign(env, { W_WIZARD: "w-wiz", W_SAM: "w-sam", W_ROBIN: "w-robin", W_H: "w-house", W_P: "w-parents" });
  for (const c of [as(0), as(1), as(2), house, parents, family]) {
    assert.ok(await wikiTools(c) > 0, c.label);
    assert.equal(await why(c), "", c.label);
  }
});

test("the grown-ups' token in the family chat is refused (children read it)", async () => {
  Object.assign(env, { W_H: "w-parents" });
  assert.equal(await wikiTools(family), 0);
  assert.match(await why(family), /grown-ups' token, so the whole family \(children too\)/);
  Object.assign(env, { W_H: "w-house" });
});
