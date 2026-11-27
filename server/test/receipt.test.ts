import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeMcp, fakeModel } from "./fakes.js";

// A receipt photo into Coinpile. Coinpile's "act" token marks its change tools
// destructive and offers preview_change, so FAITH asks with Coinpile's own
// sentence, and one Yes in FAITH is enough. A change Coinpile would refuse is
// refused before anyone is asked.
let srv: Awaited<ReturnType<typeof fakeMcp>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App;
let script: (req: any) => any = () => ({ content: "ok" });
const recorded: any[] = [];
const receipt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

before(async () => {
  srv = await fakeMcp([
    { name: "list_accounts", readOnly: true, run: () => [{ id: "ff:1", name: "Cash", type: "cash" }] },
    { name: "record_transaction", destructive: true, description: "CHANGES THINGS: get the user's yes first. Record a transaction in Firefly III.",
      run: (a) => { recorded.push(a); return { done: true }; } },
    { name: "preview_change", readOnly: true, run: (a) => a.arguments?.account_id === "ff:1"
      ? { what: `Record in Firefly III: paid ${Math.abs(a.arguments.amount).toFixed(2)} "${a.arguments.description}", account Cash` }
      : { error: "it would be refused: unknown account (use an id from list_accounts)" } },
  ]);
  model = await fakeModel((req) => script(req));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "kid", name: "Kid", role: "child" }],
    connectors: [{ id: "coinpile", type: "mcp", url: srv.url, person_token_env: "COINPILE_TOKEN_{ID}", roles: ["admin", "adult"] }],
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env: { COINPILE_TOKEN_WIZARD: "cp-wiz" } });
});
after(async () => { await A.app.close(); srv.close(); model.close(); });

const wiz = () => ({ scope: { kind: "person" as const, person: A.registry["cfg"]().people[0] }, channel: "personal" as const, label: "wizard" });
const toolResult = (req: any) => String([...req.messages].reverse().find((m: any) => m.role === "tool")?.content ?? "");

test("receipt: FAITH asks with Coinpile's own sentence, and records it only after the person's Yes", async () => {
  let k = 0;
  script = () => (k++ === 0
    ? { tool_calls: [{ name: "coinpile_record_transaction", args: { account_id: "ff:1", amount: -23.45, description: "Corner Market", date: "2026-11-24", category: "Groceries" } }] }
    : { content: "Tap Yes to record it." });
  const r = await A.agent.turn({ caller: wiz(), text: "log this receipt, I paid cash", images: [receipt] });
  assert.equal(r.pending.length, 1);
  assert.equal(r.pending[0].summary, 'Record in Firefly III: paid 23.45 "Corner Market", account Cash');
  assert.equal(recorded.length, 0, "nothing recorded before the Yes");
  assert.ok(srv.seen.some((x) => x.tool === "preview_change" && x.token === "cp-wiz"), "the preview uses the person's own token");
  await A.agent.confirm(wiz(), r.pending[0].id, true);
  assert.equal(recorded.length, 1);
  assert.equal(recorded[0].description, "Corner Market");
});

test("receipt: a change Coinpile would refuse is refused before anyone is asked", async () => {
  let k = 0, said = "";
  script = (req) => {
    if (k++ === 0) return { tool_calls: [{ name: "coinpile_record_transaction", args: { account_id: "ff:99", amount: -5, description: "Bakery" } }] };
    said = toolResult(req);
    return { content: "That account doesn't exist." };
  };
  const before = recorded.length;
  const r = await A.agent.turn({ caller: wiz(), text: "log this receipt", images: [receipt] });
  assert.equal(r.pending.length, 0, "no Yes asked for");
  assert.equal(recorded.length, before);
  assert.match(said, /won't do that: it would be refused: unknown account/);
});

test("receipt: the skill is offered to grown-ups, not to children", () => {
  assert.ok(A.skills.forPolicy("parent").some((s) => s.name === "receipt-to-coinpile"));
  assert.ok(A.skills.forPolicy("admin").some((s) => s.name === "receipt-to-coinpile"));
  assert.ok(!A.skills.forPolicy("kid-pro").some((s) => s.name === "receipt-to-coinpile"));
  assert.match(A.skills.get("receipt-to-coinpile")!.body, /coinpile_search_transactions/);
});

test("a loaded skill's tools are offered in the next round, even ones the router left out", async () => {
  const { runLoop } = await import("../src/harness/llm.js");
  const m = await fakeModel((req) => {
    const names = (req.tools ?? []).map((t: any) => t.function.name);
    rounds.push(names);
    return rounds.length === 1 ? { tool_calls: [{ name: "skill_load", args: { name: "receipt-to-coinpile" } }] } : { content: "ok" };
  });
  const rounds: string[][] = [];
  const t = (name: string, out: unknown = null) => ({ name, description: name, parameters: { type: "object", properties: {} }, run: async () => out });
  try {
    await runLoop({ baseUrl: m.url, model: "x", maxRounds: 3, messages: [{ role: "user", content: "log this receipt" }],
      tools: [t("skill_load", { steps: "2. Call coinpile_search_transactions with the total." })],
      callable: [t("coinpile_search_transactions"), t("coinpile_search"), t("home_control")] });
  } finally { m.close(); }
  assert.deepEqual(rounds[0], ["skill_load"]);
  assert.deepEqual(rounds[1], ["skill_load", "coinpile_search_transactions"], "only the tool it names, by its whole name");
});
