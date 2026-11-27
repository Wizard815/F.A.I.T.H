#!/usr/bin/env node
import { resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { loadConfig, ConfigError, type Config } from "./config.js";
import { openDb } from "./db.js";
import { Auth, AuthError } from "./auth/sessions.js";
import { Registry } from "./connectors/registry.js";
import type { Caller } from "./scope.js";

const HELP = `faith: set up FAITH's people, screens and tokens

  faith people                          who's in the config and how they can sign in
  faith set-pin <person> [pin]          4-8 digits, for the family's paired screens
  faith set-password <person>           for their own phone or computer
  faith pair <device>                   one-time code to pair a wall screen (type it at /pair)
  faith devices                         paired screens
  faith unpair <device>
  faith token add household <name>      a blanket family token (shared things only)
  faith token add person <person> <name>  one person's token (their private things too)
  faith token add ha <name>             for the Home Assistant integration
  faith token add omi <person> <name>   for that person's Omi webhook (opens nothing else)
  faith token add client <person> <name>  a FAITH app signed in as that person (D.A.S.H, phone, desktop)
  faith token list | faith token revoke <name>
  faith signout <person>                end all their sessions
  faith doctor                          check every source with every token
  faith init [--hosts <server-ip>,<ha-ip>] [--person wizard:Wizard:admin ...] [--yes] [--force]
                                        find your services and write a first faith.yaml and .env checklist

Reads FAITH_CONFIG (default /config/faith.yaml) and FAITH_DATA (default /data).`;

async function ask(q: string) { const rl = createInterface({ input: stdin, output: stdout }); const a = await rl.question(q); rl.close(); return a.trim(); }

async function doctor(cfg: Config) {
  const reg = new Registry(() => cfg);
  const callers: Caller[] = [{ scope: { kind: "household" }, channel: "hub", label: "household" }, ...cfg.people.map((p) => ({ scope: { kind: "person" as const, person: p }, channel: "personal" as const, label: p.id }))];
  let bad = 0;
  for (const c of callers) {
    const set = await reg.toolsFor(c);
    console.log(`\n${c.label} (${c.scope.kind === "person" ? c.scope.person.role : "nobody signed in"})`);
    console.log(`  sources: ${set.sources.join(", ") || "none"}`);
    console.log(`  tools:   ${set.tools.length ? set.tools.map((t) => t.name + (t.write ? "*" : "")).join(", ") : "none"}`);
    for (const p of set.problems) { console.log(`  problem: ${p}`); bad++; }
    // Ask each source who it thinks we are, where it can say.
    for (const t of set.tools.filter((x) => /(^|_)whoami$/.test(x.name))) {
      try { console.log(`  ${t.name}: ${JSON.stringify(await t.run({})).slice(0, 200)}`); } catch (e: any) { console.log(`  ${t.name}: ${e.message}`); bad++; }
    }
  }
  try {
    const r = await fetch(`${cfg.model.base_url}/models`, { headers: process.env[cfg.model.api_key_env || ""] ? { Authorization: `Bearer ${process.env[cfg.model.api_key_env!]}` } : {}, signal: AbortSignal.timeout(10000) });
    const ids = r.ok ? ((await r.json()) as any).data?.map((m: any) => m.id) ?? [] : [];
    console.log(`\nmodel: ${cfg.model.base_url} answered ${r.status}${ids.length ? `; models: ${ids.slice(0, 12).join(", ")}` : ""}`);
    if (cfg.model.model && ids.length && !ids.includes(cfg.model.model)) { console.log(`  problem: ${cfg.model.model} isn't in that list`); bad++; }
  } catch (e: any) { console.log(`\nmodel: couldn't reach ${cfg.model.base_url} (${e.message})`); bad++; }
  console.log(bad ? `\n${bad} problem(s).` : "\nAll good. (* = changes things)");
  return bad ? 1 : 0;
}

/** faith init: probe the network for the family's services and write a first config. */
async function init(args: string[]) {
  const { discover, render, writeOnce } = await import("./init.js");
  const flag = (n: string) => args.includes(`--${n}`);
  const values = (n: string) => args.flatMap((a, i) => (a === `--${n}` && args[i + 1] ? [args[i + 1]] : []));
  const yes = flag("yes");
  let hosts = values("hosts").flatMap((h) => h.split(",")).map((h) => h.trim()).filter(Boolean);
  if (!hosts.length && !yes) hosts = (await ask("Which hosts run your services? (comma-separated IPs or names, e.g. 192.168.1.5,192.168.1.10): ")).split(",").map((h) => h.trim()).filter(Boolean);
  console.log(`\nLooking for services on ${[...hosts, "(and their usual container names)"].join(", ")}…`);
  const found = await discover(hosts, (m) => console.log(m));
  let people = values("person").map((p) => { const [id, name, role] = p.split(":"); return { id, name: name || id, role: (role || "parent") as any }; });
  if (!people.length && !yes) {
    console.log("\nThe family (empty name to stop). Roles: admin (you), parent, kid-pro (a teen), kid-lite (a young child).");
    for (;;) {
      const name = await ask("  Name: "); if (!name) break;
      const id = (await ask(`  Short id for ${name} [${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}]: `)) || name.toLowerCase().replace(/[^a-z0-9]+/g, "");
      const role = (await ask(`  Role [${people.length ? "parent" : "admin"}]: `)) || (people.length ? "parent" : "admin");
      people.push({ id, name, role: role as any });
    }
  }
  if (!people.length) people = [{ id: "admin", name: "Admin", role: "admin" }];
  const { yaml, dotenv, env } = render(found, people);
  const cfgPath = process.env.FAITH_CONFIG || "/config/faith.yaml", envPath = `${cfgPath.replace(/[^/]+$/, "")}faith.env.todo`;
  try { writeOnce(cfgPath, yaml, flag("force")); }
  catch (e: any) { console.error(`\n${e.message}`); return 1; }
  writeOnce(envPath, dotenv, true);
  console.log(`\nWrote ${cfgPath}, and ${envPath} with the ${env.length} token${env.length === 1 ? "" : "s"} to make (and how).`);
  console.log("Next: copy those lines into .env, fill them in, restart FAITH, then: docker exec faith faith doctor");
  return 0;
}

async function main(argv: string[]) {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === "help" || cmd === "--help") { console.log(HELP); return 0; }
  if (cmd === "init") return init(rest);
  const cfg = loadConfig(process.env.FAITH_CONFIG || "/config/faith.yaml");
  if (cmd === "doctor") return doctor(cfg);
  const db = openDb(resolve(process.env.FAITH_DATA || "/data", "faith.db"));
  const auth = new Auth(db, () => cfg);
  const person = (id?: string) => { const p = cfg.people.find((x) => x.id === id); if (!p) throw new AuthError(400, `No person "${id}". People: ${cfg.people.map((x) => x.id).join(", ")}`); return p; };
  switch (cmd) {
    case "people":
      for (const p of cfg.people) { const m = auth.methods(p.id); console.log(`${p.id.padEnd(12)} ${p.name.padEnd(14)} ${p.role.padEnd(8)} pin:${m.pin ? "yes" : "no"} password:${m.password ? "yes" : "no"} faceid:${m.passkey ? "yes" : "no"}`); }
      return 0;
    case "set-pin": { const p = person(rest[0]); auth.setPin(p.id, rest[1] || await ask(`New PIN for ${p.name}: `)); console.log(`PIN set for ${p.name}.`); return 0; }
    case "set-password": { const p = person(rest[0]); auth.setPassword(p.id, await ask(`New password for ${p.name}: `)); console.log(`Password set for ${p.name}.`); return 0; }
    case "pair": {
      if (!rest[0]) throw new AuthError(400, `Which screen? Devices in the config: ${cfg.hub.devices.map((d) => d.id).join(", ") || "none (add hub.devices)"}`);
      console.log(`Pairing code for ${rest[0]}: ${auth.pairCode(rest[0])}\nOn that screen open FAITH, choose "Pair this screen" and type it. It works once, for 10 minutes.`);
      return 0;
    }
    case "devices": for (const d of auth.devices()) console.log(`${d.id.padEnd(14)} ${d.name.padEnd(20)} last seen ${d.last_seen ? new Date(d.last_seen).toLocaleString() : "never"}`); return 0;
    case "unpair": auth.unpair(rest[0]); console.log(`Unpaired ${rest[0]}.`); return 0;
    case "signout": auth.endPerson(person(rest[0]).id); console.log(`Signed ${rest[0]} out everywhere.`); return 0;
    case "token": {
      const [sub, a, b, c] = rest;
      if (sub === "list") { for (const t of auth.tokens()) console.log(`${t.name.padEnd(20)} ${t.kind.padEnd(10)} ${t.person_id || ""}`); return 0; }
      if (sub === "revoke") { console.log(auth.revokeToken(a) ? `Revoked ${a}.` : `No token named ${a}.`); return 0; }
      if (sub === "add") {
        let token: string;
        if (a === "household") token = auth.addToken("household", b);
        else if (a === "ha") token = auth.addToken("ha", b);
        else if (a === "person") token = auth.addToken("person", c, person(b).id);
        else if (a === "omi") token = auth.addToken("omi", c, person(b).id);
        else if (a === "client") token = auth.addToken("client", c, person(b).id);
        else throw new AuthError(400, "faith token add household <name> | person <person> <name> | ha <name> | omi <person> <name> | client <person> <name>");
        console.log(`${token}\nShown once. FAITH keeps only its hash.`);
        return 0;
      }
      throw new AuthError(400, "faith token add | list | revoke");
    }
    default: console.log(HELP); return 1;
  }
}

main(process.argv.slice(2)).then((code) => process.exit(code), (e) => {
  if (e instanceof AuthError || e instanceof ConfigError) { console.error(e.message); process.exit(1); }
  console.error(e); process.exit(1);
});
