import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { runLoop } from "../src/harness/llm.js";

// A model server that's busy or swapping models (Argos/llama-swap) gets two more tries.
test("the model answering 503 for a moment is tried again; a lasting error is reported plainly", async () => {
  process.env.FAITH_RETRY_SCALE = "0";
  let n = 0, fails = 1;
  const s = createServer((req, res) => {
    req.resume(); n++;
    if (n <= fails) { res.statusCode = 503; res.setHeader("content-type", "text/html"); return res.end("<html><body><h1>Service Unavailable</h1></body></html>"); }
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ choices: [{ message: { role: "assistant", content: "Fish tacos." } }] }));
  });
  await new Promise<void>((r) => s.listen(0, "127.0.0.1", r));
  const baseUrl = `http://127.0.0.1:${(s.address() as AddressInfo).port}`;
  try {
    const r = await runLoop({ baseUrl, model: "m", messages: [{ role: "user", content: "dinner?" }], tools: [], maxRounds: 2 });
    assert.equal(r.text, "Fish tacos.");
    assert.equal(n, 2);
    n = 0; fails = 5;
    await assert.rejects(runLoop({ baseUrl, model: "m", messages: [{ role: "user", content: "dinner?" }], tools: [], maxRounds: 2 }), /answered 503: Service Unavailable$/);
    assert.equal(n, 3, "three tries in all");
  } finally { s.close(); delete process.env.FAITH_RETRY_SCALE; }
});

test("a tool the router didn't shortlist still runs when the model names it", async () => {
  let n = 0;
  const s = createServer((req, res) => {
    req.resume(); n++;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ choices: [{ message: n === 1 ? { role: "assistant", content: null, tool_calls: [{ id: "c1", type: "function", function: { name: "HassClimateSetTemperature", arguments: "{\"temperature\":22}" } }] } : { role: "assistant", content: "Set to 22." } }] }));
  });
  await new Promise<void>((r) => s.listen(0, "127.0.0.1", r));
  let ran: any = null;
  try {
    const r = await runLoop({ baseUrl: `http://127.0.0.1:${(s.address() as AddressInfo).port}`, model: "m", messages: [{ role: "user", content: "22 please" }], maxRounds: 3,
      tools: [{ name: "GetLiveContext", description: "", parameters: {}, run: async () => "x" }],
      callable: [{ name: "HassClimateSetTemperature", description: "", parameters: {}, run: async (a: any) => { ran = a; return { ok: true }; } }] });
    assert.deepEqual(ran, { temperature: 22 });
    assert.deepEqual(r.toolsUsed, ["HassClimateSetTemperature"]);
  } finally { s.close(); }
});
