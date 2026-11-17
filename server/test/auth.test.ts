import test from "node:test";
import assert from "node:assert/strict";
import { parseConfig } from "../src/config.js";
import { openDb } from "../src/db.js";
import { Auth } from "../src/auth/sessions.js";
import { Presence } from "../src/auth/presence.js";

function setup(hub: any = {}) {
  let now = 1_000_000;
  const cfg = parseConfig({ people: [{ id: "wizard", name: "Wizard", role: "admin" }, { id: "kid", name: "Kid", role: "child", face_names: ["Kiddo"] }],
    hub: { idle_seconds: 120, away_seconds: 45, max_idle_seconds: 900, devices: [{ id: "kitchen", name: "Kitchen", presence_entity: "binary_sensor.p", face_entity: "sensor.face" }, { id: "hall", name: "Hall" }], ...hub } }, {});
  const db = openDb(":memory:");
  const presence = new Presence(() => cfg, undefined, () => now);
  const auth = new Auth(db, () => cfg, presence, () => now);
  return { cfg, auth, presence, tick: (s: number) => { now += s * 1000; }, now: () => now };
}

test("PINs: wrong tries lock the person out for a while", () => {
  const { cfg, auth, tick } = setup();
  const wiz = cfg.people[0];
  assert.throws(() => auth.setPin("wizard", "12"), /4 to 8 digits/);
  auth.setPin("wizard", "2468");
  auth.check(wiz, "pin", "2468");
  for (let i = 0; i < 4; i++) assert.throws(() => auth.check(wiz, "pin", "0000"), /Wrong PIN/);
  assert.throws(() => auth.check(wiz, "pin", "0000"), /Locked/);
  assert.throws(() => auth.check(wiz, "pin", "2468"), /Too many/); // even the right PIN, while locked
  tick(301);
  auth.check(wiz, "pin", "2468");
});

test("pairing a screen gives the household view; a PIN sign-in gives the person's", () => {
  const { cfg, auth } = setup();
  const code = auth.pairCode("hall");
  assert.throws(() => auth.pair("000000" === code ? "111111" : "000000"), /wrong or expired/);
  const { token: dev } = auth.pair(code);
  assert.throws(() => auth.pair(code), /wrong or expired/); // one use
  const house = auth.resolve({ deviceToken: dev })!;
  assert.equal(house.scope.kind, "household");
  assert.equal(house.channel, "hub");
  const ses = auth.startSession(cfg.people[0], "hall");
  const me = auth.resolve({ deviceToken: dev, sessionToken: ses })!;
  assert.equal(me.scope.kind === "person" && me.scope.person.id, "wizard");
  // A hub session cookie carried to another browser doesn't work there.
  assert.equal(auth.resolve({ sessionToken: ses }), null);
});

test("without a camera, a hub signs out after idle_seconds without a tap", () => {
  const { cfg, auth, tick } = setup();
  const { token: dev } = auth.pair(auth.pairCode("hall"));
  const ses = auth.startSession(cfg.people[0], "hall");
  tick(100);
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: ses })!.scope.kind, "person");
  auth.touch(auth.resolve({ deviceToken: dev, sessionToken: ses })!.sessionHash);
  tick(100);
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: ses })!.scope.kind, "person");
  tick(30);
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: ses })!.scope.kind, "household");
});

test("with a camera: stays signed in while someone's there, signs out once they've left and nobody taps", () => {
  const { cfg, auth, presence, tick } = setup();
  const { token: dev } = auth.pair(auth.pairCode("kitchen"));
  presence.set("kitchen", true);
  const ses = auth.startSession(cfg.people[0], "kitchen");
  tick(300); // idle 5 min, but someone's in the kitchen
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: ses })!.scope.kind, "person");
  presence.set("kitchen", false);
  tick(30);
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: ses })!.scope.kind, "person"); // not gone long enough
  tick(20);
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: ses })!.scope.kind, "household");
});

test("with a camera: a hard cap applies even if someone stays in the room", () => {
  const { cfg, auth, presence, tick } = setup();
  const { token: dev } = auth.pair(auth.pairCode("kitchen"));
  presence.set("kitchen", true);
  const ses = auth.startSession(cfg.people[0], "kitchen");
  tick(901);
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: ses })!.scope.kind, "household");
});

test("the sweeper ends expired hub sessions, and a new sign-in replaces the last person", () => {
  const { cfg, auth, tick } = setup();
  const { token: dev } = auth.pair(auth.pairCode("hall"));
  const a = auth.startSession(cfg.people[0], "hall");
  const b = auth.startSession(cfg.people[1], "hall");
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: a })!.scope.kind, "household");
  assert.equal(auth.resolve({ deviceToken: dev, sessionToken: b })!.scope.kind, "person");
  tick(121);
  assert.deepEqual(auth.sweep(), ["hall"]);
});

test("a recognized face suggests the right person for 30 seconds", () => {
  const { presence, tick } = setup();
  presence.set("kitchen", true, "Kiddo");
  assert.equal(presence.face("kitchen"), "kid");
  tick(31);
  assert.equal(presence.face("kitchen"), undefined);
});

test("API tokens: household, person and Home Assistant kinds", () => {
  const { auth } = setup();
  const h = auth.addToken("household", "tablet-api"), p = auth.addToken("person", "wiz-phone", "wizard"), ha = auth.addToken("ha", "homeassistant");
  assert.equal(auth.resolve({ bearer: h })!.scope.kind, "household");
  const pc = auth.resolve({ bearer: p })!;
  assert.equal(pc.scope.kind === "person" && pc.scope.person.id, "wizard");
  assert.equal(auth.resolve({ bearer: ha })!.channel, "voice");
  assert.throws(() => auth.addToken("household", "tablet-api"), /exists/);
  assert.ok(auth.revokeToken("tablet-api"));
  assert.equal(auth.resolve({ bearer: h }), null);
});
