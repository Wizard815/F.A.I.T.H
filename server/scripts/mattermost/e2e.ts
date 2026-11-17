/** End-to-end check of FAITH's Mattermost bot against a real Mattermost
 *  (see setup.sh) and the demo (server/scripts/demo.ts with MATTERMOST_URL).
 *  Logs in as each family member and talks to FAITH like they would. */
const MM = process.env.MATTERMOST_URL || "http://localhost:8065";
const api = async (token: string, method: string, path: string, body?: unknown) => {
  const r = await fetch(`${MM}/api/v4${path}`, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" }, body: body === undefined ? undefined : JSON.stringify(body) });
  const t = await r.text(); const d = t ? JSON.parse(t) : null;
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${d?.message}`);
  return d;
};
const login = async (u: string, p: string) => {
  const r = await fetch(`${MM}/api/v4/users/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ login_id: u, password: p }) });
  if (!r.ok) throw new Error(`login ${u}: ${r.status}`);
  return { token: r.headers.get("token")!, id: (await r.json()).id as string };
};
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let failed = 0;
const check = (ok: boolean, what: string, detail = "") => { console.log(`${ok ? "ok  " : "FAIL"} ${what}${!ok && detail ? `\n     ${detail}` : ""}`); if (!ok) failed++; };

const wiz = await login("wizard", "Pass-wizard-123"), sam = await login("sam", "Pass-sam-123"), robin = await login("robin", "Pass-robin-123"), admin = await login("admin", "Admin-pass-123");
const team = await api(wiz.token, "GET", "/teams/name/family");
const bot = await api(wiz.token, "GET", "/users/username/faith");
const chan = async (who: { token: string }, name: string) => api(who.token, "GET", `/teams/${team.id}/channels/name/${name}`).catch(() => null);
const dm = async (who: { token: string; id: string }) => api(who.token, "POST", "/channels/direct", [who.id, bot.id]);

/** Post as someone and wait for FAITH's next post in that channel. */
async function ask(who: { token: string; id: string }, channelId: string, message: string, wait = 12000) {
  const since = Date.now();
  await api(who.token, "POST", "/posts", { channel_id: channelId, message });
  for (let t = 0; t < wait; t += 400) {
    await sleep(400);
    const p = await api(who.token, "GET", `/channels/${channelId}/posts?since=${since}`);
    const mine = Object.values<any>(p.posts).filter((x) => x.user_id === bot.id && x.create_at >= since).sort((a, b) => a.create_at - b.create_at);
    if (mine.length) return mine.map((x) => x.message).join("\n---\n");
  }
  return "";
}
async function lastBotPost(token: string, channelId: string, since: number) {
  const p = await api(token, "GET", `/channels/${channelId}/posts?since=${since}`);
  return Object.values<any>(p.posts).filter((x) => x.user_id === bot.id && x.create_at >= since).sort((a, b) => a.create_at - b.create_at).map((x) => x.message);
}

// 1. The chats FAITH made.
const family = await chan(wiz, "faith-family"), parents = await chan(wiz, "faith-parents");
check(!!family && family.type === "P", "FAITH made the private family channel");
check(!!parents && parents.type === "P", "FAITH made the private parents channel");
const members = async (c: any) => (await api(admin.token, "GET", `/channels/${c.id}/members?per_page=200`)).map((m: any) => m.user_id).sort();
check(JSON.stringify(await members(family)) === JSON.stringify([wiz.id, sam.id, robin.id, bot.id].sort()), "family channel: everyone and the bot");
check(JSON.stringify(await members(parents)) === JSON.stringify([wiz.id, sam.id, bot.id].sort()), "parents channel: grown-ups and the bot, not Robin");
check(!(await chan(robin, "faith-parents")), "Robin can't even see the parents channel");
const wizDm = await dm(wiz), samDm = await dm(sam), robinDm = await dm(robin);
const dmPosts = Object.values<any>((await api(wiz.token, "GET", `/channels/${wizDm.id}/posts?per_page=200`)).posts);
check(dmPosts.some((p) => p.user_id === bot.id && /private chat/.test(p.message)), "Wizard got a welcome in his personal chat");

// 2. Personal chat: his own private things.
let r = await ask(wiz, wizDm.id, "what's on today");
check(/Dentist/.test(r) && /ring/.test(r), "personal chat shows Wizard's private things", r);

// 3. Family chat: shared things only, and only when called.
r = await ask(wiz, family.id, "@faith what's on today");
check(/School pickup/.test(r) && !/Dentist|ring/.test(r), "family chat: shared day only, even when Wizard asks", r);
r = await ask(sam, family.id, "anyone seen my keys?", 4000);
check(r === "", "family chat: FAITH stays quiet unless called", r);

// 4. A child's change goes to the parents.
const before = Date.now();
r = await ask(robin, family.id, "@faith we need candy");
check(/approve/i.test(r), "Robin's request in the family chat is sent for approval", r);
await sleep(800);
const waiting = (await lastBotPost(sam.token, parents.id, before)).join("\n");
const code = waiting.match(/approve (\S+)`/)?.[1];
check(!!code && /candy/.test(waiting), "the parents chat got the request with a code", waiting);
const t2 = Date.now();
await api(sam.token, "POST", "/posts", { channel_id: parents.id, message: `approve ${code}` });
await sleep(2500);
const outP = (await lastBotPost(sam.token, parents.id, t2)).join("\n"), outF = (await lastBotPost(robin.token, family.id, t2)).join("\n");
check(/Approved by Sam/.test(outP), "Sam approved it in the parents chat", outP);
check(/Approved by Sam/.test(outF), "the family chat heard it was approved", outF);

// 5. A grown-up's change in the family chat just happens.
r = await ask(sam, family.id, "@faith we need milk");
check(/Added \*\*milk\*\*/.test(r), "Sam's change in the family chat happens straight away", r);

// 6. A lock in a personal chat waits for "yes".
r = await ask(wiz, wizDm.id, "lock the front door");
check(/yes/i.test(r), "a lock waits for Wizard's yes", r);
r = await ask(wiz, wizDm.id, "yes");
check(/^Done: lock/.test(r), "yes locks it", r);

// 7. Robin can't approve from his own chat, and kids get kid answers.
r = await ask(robin, robinDm.id, "approve abcde", 6000);
check(!/Approved/.test(r), "Robin can't approve things", r);

// 8. Someone puts Robin in the parents channel: FAITH takes him out again.
await api(admin.token, "POST", `/channels/${parents.id}/members`, { user_id: robin.id });
await sleep(5000);
check(!(await members(parents)).includes(robin.id), "FAITH removes Robin from the parents channel");

// 9. A stranger messaging FAITH.
await api(admin.token, "POST", "/users", { email: "visitor@example.test", username: "visitor", password: "Pass-visitor-123" }).catch(() => {});
const visitor = await login("visitor", "Pass-visitor-123");
r = await ask(visitor, (await dm(visitor)).id, "hi");
check(/only talk with the family/.test(r), "a stranger is turned away", r);

console.log(failed ? `\n${failed} check(s) failed` : "\nall checks passed");
process.exit(failed ? 1 : 0);
