import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { parseConfig, ConfigError } from "../src/config.js";
import { buildApp, type App } from "../src/app.js";
import { fakeFirefly, fakeModel } from "./fakes.js";

// The kid's card: approved money rewards are recorded in Firefly III.
let ff: Awaited<ReturnType<typeof fakeFirefly>>, model: Awaited<ReturnType<typeof fakeModel>>, A: App, haTok = "";
const env = { FIREFLY_TOKEN: "ff-token" };

before(async () => {
  ff = await fakeFirefly([{ id: "1", name: "Joint checking", balance: 500 }, { id: "7", name: "Robin's card", balance: 12.5 }]);
  model = await fakeModel(() => ({ content: "ok" }));
  const cfg = parseConfig({
    model: { base_url: model.url },
    people: [
      { id: "wizard", name: "Wizard", role: "admin", ha_user_id: "ha-wiz" },
      { id: "robin", name: "Robin", role: "child", ha_user_id: "ha-robin", firefly_account: "Robin's card" },
      { id: "kai", name: "Kai", role: "child" },
    ],
    rewards: { payout: "firefly", firefly: { url: ff.url, from_account: "Joint checking" } },
  }, {});
  A = await buildApp({ config: () => cfg, dataFile: ":memory:", env });
  haTok = A.auth.addToken("ha", "homeassistant");
  A.rewards.saveReward({ id: "five", name: "$5 to your card", cost: 10, kind: "money", amount: 5 });
});
after(async () => { await A.app.close(); ff.close(); model.close(); });

const give = (who: string, n: number) => { for (let i = 0; i < n; i++) A.rewards.award(who, { points: 2, reason: "Clean your room" }, "wizard"); };

test("an approved money reward is recorded as a transfer to the kid's card account", async () => {
  give("robin", 5);
  const r = await A.rewards.grant("robin", "five", "wizard");
  assert.equal(r.payout!.status, "paid", r.payout!.note!);
  const t = ff.txs.at(-1);
  assert.equal(t.type, "transfer");
  assert.equal(t.source_id, "1"); assert.equal(t.destination_id, "7", "account names are looked up");
  assert.equal(t.amount, "5.00");
  assert.deepEqual(t.tags, ["faith", "kid-reward"]);
  assert.equal(t.external_id, `faith-payout-${r.payout!.id}`);
  assert.match(t.notes, /wizard/);
  assert.equal(r.payout!.ref, t.id);
  assert.equal(r.balance, 0, "the points are spent");
  assert.deepEqual(await A.rewards.card("robin"), { amount: 17.5, currency: "USD" });
});

test("a kid without a card account: recorded as owed, and Firefly isn't touched", async () => {
  const before = ff.txs.length;
  give("kai", 5);
  const r = await A.rewards.grant("kai", "five", "wizard");
  assert.equal(r.payout!.status, "owed");
  assert.match(r.payout!.note!, /firefly_account/);
  assert.equal(ff.txs.length, before);
});

test("Firefly down: the payout fails and waits; a retry records it once", async () => {
  give("robin", 5);
  ff.mode.fail = "down";
  const r = await A.rewards.grant("robin", "five", "wizard");
  assert.equal(r.payout!.status, "failed");
  assert.match(r.payout!.note!, /retry/);
  ff.mode.fail = "";
  const before = ff.txs.length;
  assert.equal((await A.rewards.pay(r.payout!.id)).status, "paid");
  assert.equal(ff.txs.length, before + 1);
  await assert.rejects(A.rewards.pay(r.payout!.id), /already paid/);
});

test("an answer lost on the way back doesn't record the reward twice", async () => {
  give("robin", 5);
  ff.mode.fail = "after-record";
  const r = await A.rewards.grant("robin", "five", "wizard");
  assert.equal(r.payout!.status, "failed", "FAITH didn't hear back");
  ff.mode.fail = "";
  const before = ff.txs.length;
  const again = await A.rewards.pay(r.payout!.id);
  assert.equal(again.status, "paid");
  assert.match(again.note!, /Already in Firefly/);
  assert.equal(ff.txs.length, before, "found by its external id, not sent again");
});

test("the card balance shows to the kid and to a parent, never on the shared view", async () => {
  const H = (user_id?: string) => A.app.inject({ method: "POST", url: "/api/ha/rewards", headers: { authorization: `Bearer ${haTok}` }, payload: user_id ? { user_id } : {} }).then((r) => r.json());
  assert.equal((await H("ha-robin")).me.card.currency, "USD");
  assert.ok((await H("ha-wiz")).kids.find((k: any) => k.id === "robin").card);
  assert.equal((await H()).kids.find((k: any) => k.id === "robin").card, null);
});

test("payout: firefly needs the Firefly address and the parents' account", () => {
  assert.throws(() => parseConfig({ model: { base_url: "http://x" }, rewards: { payout: "firefly" } }, {}), ConfigError);
});
