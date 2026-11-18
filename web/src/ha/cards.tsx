/** FAITH's Home Assistant cards. Add them to any dashboard:
 *    type: custom:faith-card          (the day, meals, shopping, chores, the house, approvals)
 *    type: custom:faith-who-card      (a shared tablet: "Who's here?", sign in with a PIN, sign out)
 *    type: custom:faith-chat-card     (talk or type to FAITH)
 *    type: custom:faith-rewards-card  (points, jobs and rewards)
 *  Every card asks FAITH as the HA user who's looking (or the person signed in
 *  on this screen with the who card), so each person sees their own things. */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import css from "./cards.css?inline";
import { makeApi, setHubSession, type Api, type CardConfig, type Hass } from "./bridge";
import { Emblem } from "../emblem/Emblem";

declare global {
  namespace JSX { interface IntrinsicElements { "ha-card": any; "ha-icon": any } }
  interface Window { customCards?: { type: string; name: string; description: string; preview?: boolean }[] }
}

type Item = { title: string; time?: string; meta?: string; label?: string; done?: boolean };
type CardData = { id: string; title: string; kind: string; items?: Item[]; approvals?: { id: string; summary: string; requested_by: string }[]; entities?: { entity_id: string; name: string; state: string }[]; text?: string; error?: string; empty?: string };
type Person = { id: string; name: string; role: string; color?: string };
type View = { name: string; person: Person | null; household: boolean; hub: { person: Person; remaining_seconds: number } | null; can_sign_in: boolean; can_approve: boolean; pending_approvals: number; cards: CardData[]; apps: { id: string; name: string; url: string; icon?: string }[] };

const ICON: Record<string, string> = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" };
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const Avatar = ({ p, size = 40 }: { p: Person; size?: number }) => <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.38, background: p.color || "var(--fc-accent)" }}>{initials(p.name)}</span>;
function niceTime(t?: string) {
  if (!t) return "";
  if (/^\d{2}:\d{2}$/.test(t)) { const [h, m] = t.split(":").map(Number); return new Date(2000, 0, 1, h, m).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const d = new Date(`${t}T12:00:00`), diff = Math.round((new Date(d.toDateString()).getTime() - new Date(new Date().toDateString()).getTime()) / 86400000);
    return diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : d.toLocaleDateString([], { weekday: "short", day: "numeric" });
  }
  return t;
}

/** Reload when this tablet's sign-in changes (any FAITH card on it can change it). */
function useView<T>(api: Api, path: string, body: Record<string, unknown> = {}, everyMs = 60_000) {
  const [data, setData] = useState<T | null>(null), [err, setErr] = useState("");
  const load = useCallback(() => api.call<T>(path, body).then((d) => { setData(d); setErr(""); }).catch((e) => setErr(e.message)), [api, path, JSON.stringify(body)]);
  useEffect(() => {
    load(); const i = setInterval(load, everyMs);
    const on = (e: Event) => { const s = (e as CustomEvent).detail?.screen; if (!s || s === api.screen) load(); };
    window.addEventListener("faith-hub-changed", on);
    return () => { clearInterval(i); window.removeEventListener("faith-hub-changed", on); };
  }, [load, everyMs]);
  return { data, err, load };
}

// ------------------------------------------------------------------ faith-card
function Approvals({ api, items, can, onDone }: { api: Api; items: NonNullable<CardData["approvals"]>; can: boolean; onDone: () => void }) {
  const [msg, setMsg] = useState("");
  const decide = (id: string, approve: boolean) => api.call(`/api/ha/approvals/${id}`, { approve }).then((r: any) => { setMsg(r.text); onDone(); }).catch((e) => setMsg(e.message));
  return (<>
    <ul>{items.map((a) => (
      <li key={a.id} className="row">
        <div className="grow"><div>{a.summary}</div><div className="meta">Asked by {a.requested_by.replace(/^household on /, "the ")}</div></div>
        {can && <div className="btns"><button className="primary" onClick={() => decide(a.id, true)}>Approve</button><button onClick={() => decide(a.id, false)}>Deny</button></div>}
      </li>))}
    </ul>
    {!can && <div className="meta">A grown-up approves these (signed in here, or on their phone).</div>}
    {msg && <div className="toast">{msg}</div>}
  </>);
}

function Section({ c, api, can, reload }: { c: CardData; api: Api; can: boolean; reload: () => void }) {
  const items = c.items ?? [];
  let body: ReactNode;
  if (c.error) body = <div className="err">{c.error}</div>;
  else if (c.empty) body = <div className="empty">{c.empty}</div>;
  else if (c.kind === "schedule") body = <ul>{items.map((i, n) => <li key={n} className="row"><span className="time">{niceTime(i.time)}</span><div className="grow"><div>{i.title}</div>{i.meta && <div className="meta">{i.meta}</div>}</div></li>)}</ul>;
  else if (c.kind === "meals") body = <ul>{items.map((i, n) => <li key={n} className="row"><span className="label grow">{i.label}{i.time && niceTime(i.time) !== "Today" ? ` · ${niceTime(i.time)}` : ""}</span><span>{i.title}</span></li>)}</ul>;
  else if (c.kind === "checklist" || c.kind === "list") body = <ul>{items.map((i, n) => <li key={n} className="row">{c.kind === "checklist" && <span className={`check ${i.done ? "done" : ""}`} />}<span className="grow">{i.label && <span className="label">{i.label} </span>}{i.title}</span>{(i.meta || i.time) && <span className="meta">{i.meta || niceTime(i.time)}</span>}</li>)}</ul>;
  else if (c.kind === "entities") body = <div className="tiles">{(c.entities ?? []).map((e) => <div key={e.entity_id} className="tile"><div className="meta">{e.name}</div><div className="v">{e.state}</div></div>)}</div>;
  else if (c.kind === "approvals") body = <Approvals api={api} items={c.approvals ?? []} can={can} onDone={reload} />;
  else body = <div style={{ whiteSpace: "pre-wrap" }}>{c.text}</div>;
  const n = c.kind === "checklist" ? items.length : c.kind === "approvals" ? c.approvals?.length : undefined;
  return (<div className="section"><h3><ha-icon icon={ICON[c.id] || "mdi:note-text-outline"} />{c.title}{n ? <span className="count">{n}</span> : null}</h3>{body}</div>);
}

function FaithCard({ api, config }: { api: Api; config: CardConfig }) {
  const { data, err, load } = useView<View>(api, "/api/ha/view", config.cards ? { cards: config.cards } : {});
  if (err) return <ha-card><div className="err">{err}</div></ha-card>;
  if (!data) return <ha-card><div className="empty">Loading…</div></ha-card>;
  const who = data.person ? `${data.person.name}'s` : "The family's";
  return (
    <ha-card>
      {config.title !== "" && <>
        <div className="eyebrow">{new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
        <div className="hello">{config.title ?? <>{who} <em>day</em>, at a glance.</>}</div>
      </>}
      {config.show_apps !== false && data.apps.length > 0 && <div className="section"><div className="apps">{data.apps.map((a) => <a key={a.id} href={a.url} target="_blank" rel="noreferrer"><span>{a.icon || "↗"}</span>{a.name}</a>)}</div></div>}
      {data.cards.map((c) => <Section key={c.id} c={c} api={api} can={data.can_approve} reload={load} />)}
      {!data.cards.length && <div className="empty">Nothing to show yet.</div>}
    </ha-card>
  );
}

// ------------------------------------------------------------------ faith-who-card
function WhoCard({ api, config }: { api: Api; config: CardConfig }) {
  const { data, err, load } = useView<View>(api, "/api/ha/view", { cards: [] }, 10_000);
  const [people, setPeople] = useState<{ people: (Person & { pin: boolean })[]; suggested: string | null; face_unlock: boolean } | null>(null);
  const [pick, setPick] = useState<Person | null>(null), [pin, setPin] = useState(""), [msg, setMsg] = useState("");
  const last = useRef(0);
  // Taps anywhere on the tablet keep the signed-in person signed in.
  useEffect(() => {
    if (!data?.hub) return;
    const ping = () => { if (Date.now() - last.current > 15_000) { last.current = Date.now(); api.call("/api/ha/hub/activity").catch(() => {}); } };
    window.addEventListener("pointerdown", ping, true); return () => window.removeEventListener("pointerdown", ping, true);
  }, [data?.hub?.person.id]);
  // Signed out by the server (idle, nobody there): forget the session on this tablet.
  useEffect(() => { if (data && !data.hub && data.household && api.screen && localStorage.getItem(`faith.hub.${api.screen}`)) setHubSession(api.screen, null); }, [data]);
  if (!api.screen) return <ha-card><div className="err">Give this card the screen it's on: <code>screen: kitchen</code></div></ha-card>;
  if (err) return <ha-card><div className="err">{err}</div></ha-card>;
  if (!data) return <ha-card><div className="empty">…</div></ha-card>;

  const signIn = async (body: Record<string, unknown>) => {
    setMsg("");
    try { const r: any = await api.call("/api/ha/hub/signin", body); setHubSession(api.screen!, r.hub_session); setPick(null); setPin(""); setPeople(null); }
    catch (e: any) { setMsg(e.message); setPin(""); }
  };
  const signOut = async () => { await api.call("/api/ha/hub/signout").catch(() => {}); setHubSession(api.screen!, null); load(); };

  if (data.hub) return (
    <ha-card><div className="head"><Avatar p={data.hub.person} size={44} /><div><h2>{data.hub.person.name}</h2><div className="sub">Signed in on this screen{data.hub.remaining_seconds < 60 ? ` · signing out in ${data.hub.remaining_seconds}s` : ""}</div></div>
      <div className="right"><button onClick={signOut}>Sign out</button></div></div></ha-card>
  );
  if (data.person) return <ha-card><div className="head"><Avatar p={data.person} size={44} /><div><h2>{data.person.name}</h2><div className="sub">Your own Home Assistant account</div></div></div></ha-card>;
  if (!people && !pick) return (
    <ha-card><div className="head"><ha-icon icon="mdi:account-group-outline" /><div><h2>Shared view</h2><div className="sub">Everyone sees the family's things. Sign in for your own.</div></div>
      <div className="right"><button className="primary" onClick={() => api.call("/api/ha/hub/people").then((p: any) => { setPeople(p); const s = p.people.find((x: any) => x.id === p.suggested); if (s) setPick(s); }).catch((e) => setMsg(e.message))}>Sign in</button></div></div>
      {msg && <div className="err">{msg}</div>}</ha-card>
  );
  if (!pick) return (
    <ha-card><div className="head"><h2>Who's here?</h2><div className="right"><button className="ghost" onClick={() => setPeople(null)}>Cancel</button></div></div>
      <div className="people">{people!.people.map((p) => <button key={p.id} className={`person ${people!.suggested === p.id ? "suggested" : ""}`} onClick={() => setPick(p)}><Avatar p={p} size={52} />{p.name}</button>)}</div>
      {msg && <div className="err">{msg}</div>}</ha-card>
  );
  const press = (d: string) => setPin((p) => (p + d).slice(0, 8));
  return (
    <ha-card><div className="head"><Avatar p={pick} size={44} /><h2>Hi, {pick.name}</h2><div className="right"><button className="ghost" onClick={() => { setPick(null); setPin(""); setMsg(""); }}>Back</button></div></div>
      <div className="pin">
        {people?.face_unlock && people.suggested === pick.id && <button className="primary" onClick={() => signIn({ person: pick.id, face: true })}>It's me (camera)</button>}
        <div className="dots">{Array.from({ length: Math.max(4, pin.length) }, (_, i) => <span key={i} className={i < pin.length ? "on" : ""} />)}</div>
        <div className="keys">{["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => <button key={d} onClick={() => press(d)}>{d}</button>)}
          <button onClick={() => setPin(pin.slice(0, -1))}>⌫</button><button onClick={() => press("0")}>0</button>
          <button className="primary" disabled={pin.length < 4} onClick={() => signIn({ person: pick.id, pin })}>OK</button></div>
        {msg && <div className="err">{msg}</div>}
      </div></ha-card>
  );
}

// ------------------------------------------------------------------ faith-chat-card
type Line = { me?: boolean; text: string; tools?: string[]; confirm?: { id: string; summary: string; done?: string }; waiting?: string };
const FRIENDLY: [RegExp, string][] = [[/get_day|tasks/, "Checked the calendar"], [/chores/, "Looked at chores"], [/^meals$|meal_plan/, "Meal plan"], [/recipe/, "Recipes"], [/shopping/, "Shopping list"],
  [/home_/, "The house"], [/memory_|context_for|wiki|notes/, "The wiki"], [/points|reward/, "Points"], [/skill_load/, "Used a skill"], [/message_send/, "Sent a message"], [/hermes|studio/, "Hermes"], [/coinpile/, "Money"]];
const friendly = (t: string) => FRIENDLY.find(([r]) => r.test(t))?.[1] ?? t.replace(/_/g, " ");

function ChatCard({ api, config }: { api: Api; config: CardConfig }) {
  const [lines, setLines] = useState<Line[]>([]), [text, setText] = useState(""), [busy, setBusy] = useState(false), [rec, setRec] = useState<MediaRecorder | null>(null), [said, setSaid] = useState(0);
  const conv = useRef<string | null>(null), end = useRef<HTMLDivElement>(null);
  const reset = useCallback(() => { conv.current = null; api.call("/api/ha/chat/history").then((h: any) => { conv.current = h.conversation_id; setLines(h.messages.map((m: any) => ({ me: m.role === "user", text: m.content }))); }).catch(() => setLines([])); }, [api]);
  useEffect(() => { reset(); const on = (e: Event) => { if ((e as CustomEvent).detail?.screen === api.screen) reset(); }; window.addEventListener("faith-hub-changed", on); return () => window.removeEventListener("faith-hub-changed", on); }, [reset]);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [lines]);
  const [, tick] = useState(0);
  useEffect(() => { if (!said) return; const t = setTimeout(() => tick((n) => n + 1), 3100); return () => clearTimeout(t); }, [said]);

  const send = async (body: Record<string, unknown>, shown: string) => {
    setBusy(true); setLines((l) => [...l, ...(shown ? [{ me: true, text: shown }] : []), { text: "…" }]);
    try {
      const r: any = await api.call("/api/ha/chat", { ...body, conversation_id: conv.current });
      conv.current = r.conversation_id;
      setLines((l) => [...l.slice(0, -1), ...(r.heard ? [{ me: true, text: r.heard + (r.speaker ? ` (${r.speaker.name})` : "") }] : []),
        ...r.confirms.map((c: any) => ({ text: "", confirm: c })), ...r.approvals.map((a: any) => ({ text: "", waiting: a.summary })), { text: r.text, tools: r.tools }]);
      setSaid(Date.now());
    } catch (e: any) { setLines((l) => [...l.slice(0, -1), { text: `Sorry, that didn't work: ${e.message}` }]); }
    finally { setBusy(false); }
  };
  const mic = async () => {
    if (rec) { rec.stop(); setRec(null); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }), r = new MediaRecorder(stream), parts: Blob[] = [];
      r.ondataavailable = (e) => e.data.size && parts.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(parts, { type: r.mimeType || "audio/webm" }), b64 = btoa(String.fromCharCode(...new Uint8Array(await blob.arrayBuffer())));
        send({ audio: b64, mime: blob.type.split(";")[0] }, "");
      };
      r.start(); setRec(r);
    } catch { setLines((l) => [...l, { text: "The microphone isn't available (Home Assistant needs https for it)." }]); }
  };
  const answer = (id: string, approve: boolean) => api.call(`/api/ha/confirm/${id}`, { approve }).then((r: any) => setLines((l) => l.map((x) => (x.confirm?.id === id ? { ...x, confirm: { ...x.confirm, done: r.text } } : x)))).catch((e) => setLines((l) => [...l, { text: e.message }]));

  return (
    <ha-card>
      <div className="head"><Emblem className="emblem" size={56} tone={api.dark ? "dark" : "light"} state={rec ? "listening" : busy ? "thinking" : Date.now() - said < 3000 ? "speaking" : "idle"} /><h2>{config.title ?? "Ask FAITH"}</h2>{lines.length > 0 && <div className="right"><button className="ghost" onClick={() => { conv.current = null; setLines([]); }}>New</button></div>}</div>
      <div className="chat">
        {!lines.length && <div className="empty">What's on today? What's for dinner? Add milk to the list. Turn off the lights.</div>}
        {lines.map((l, i) => l.confirm ? (
          <div key={i} className="box"><div>Do this? <b>{l.confirm.summary}</b></div>{l.confirm.done ? <div className="meta">{l.confirm.done}</div> : <div className="btns"><button className="primary" onClick={() => answer(l.confirm!.id, true)}>Yes</button><button onClick={() => answer(l.confirm!.id, false)}>No</button></div>}</div>
        ) : l.waiting ? (
          <div key={i} className="box wait"><div>Waiting for a grown-up: <b>{l.waiting}</b></div></div>
        ) : (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: l.me ? "flex-end" : "flex-start" }}>
            <div className={`msg ${l.me ? "me" : "faith"}`}>{l.text}</div>
            {!!l.tools?.length && <div className="chips">{[...new Set(l.tools.map(friendly))].map((t) => <span key={t} className="chip">{t}</span>)}</div>}
          </div>
        ))}
        <div ref={end} />
      </div>
      <form className="ask" onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (t && !busy) { setText(""); send({ text: t }, t); } }}>
        <button type="button" className={rec ? "rec" : ""} title={rec ? "Stop and send" : "Talk"} disabled={busy} onClick={mic}><ha-icon icon={rec ? "mdi:stop" : "mdi:microphone"} /></button>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={rec ? "Listening… tap stop when done" : "Ask FAITH"} />
        <button className="primary" type="submit" disabled={busy || !text.trim()} title="Send"><ha-icon icon="mdi:send" /></button>
      </form>
    </ha-card>
  );
}

// ------------------------------------------------------------------ faith-rewards-card
type RewardsView = { me: (Person & { points: number; history: any[] }) | null; kids: (Person & { points: number })[]; activities: { id: string; name: string; points: number; kids_can_claim: boolean }[]; rewards: { id: string; name: string; cost: number; kind: string; amount: number | null }[]; can_give: boolean; allowed_points: number[] };

function RewardsCard({ api, config }: { api: Api; config: CardConfig }) {
  const { data, err, load } = useView<RewardsView>(api, "/api/ha/rewards");
  const [msg, setMsg] = useState("");
  const act = (path: string, args: Record<string, unknown>, ok: string) => api.call(path, { args }).then((r: any) => { setMsg(r.approval ? `${ok} A grown-up will approve it.` : ok); load(); }).catch((e) => setMsg(e.message));
  if (err) return <ha-card><div className="err">{err}</div></ha-card>;
  if (!data) return <ha-card><div className="empty">Loading…</div></ha-card>;
  const pts = (n: number) => `${n} pt${n === 1 ? "" : "s"}`;
  return (
    <ha-card>
      <div className="head"><ha-icon icon="mdi:star-circle-outline" /><h2>{config.title ?? "Points & rewards"}</h2></div>
      {data.me ? (<>
        <div className="section"><div className="eyebrow">{data.me.name}'s points</div><div className="big">{data.me.points}</div></div>
        <div className="section"><h3>Jobs</h3><ul>{data.activities.filter((a) => a.kids_can_claim).map((a) => (
          <li key={a.id} className="row"><span className="grow">{a.name}</span><span className="pill">+{pts(a.points)}</span><button onClick={() => act("/api/ha/rewards/claim", { activity: a.id }, `Asked for ${pts(a.points)} for "${a.name}".`)}>I did it</button></li>))}</ul></div>
        <div className="section"><h3>Rewards</h3><ul>{data.rewards.map((r) => (
          <li key={r.id} className="row"><span className="grow">{r.name}</span><span className="pill">{pts(r.cost)}</span><button className="primary" disabled={data.me!.points < r.cost} onClick={() => act("/api/ha/rewards/redeem", { reward: r.id }, `Asked for "${r.name}".`)}>Get it</button></li>))}</ul></div>
      </>) : (<>
        {!data.kids.length && <div className="empty">No children in FAITH's family list yet.</div>}
        <ul>{data.kids.map((k) => (
          <li key={k.id} className="row"><Avatar p={k} size={34} /><span className="grow">{k.name}</span><span className="pill">{pts(k.points)}</span>
            {data.can_give && <div className="btns">{data.allowed_points.map((n) => <button key={n} onClick={() => act("/api/ha/rewards/award", { person: k.id, points: n, reason: "Well done (from the dashboard)" }, `Gave ${k.name} ${pts(n)}.`)}>+{n}</button>)}</div>}
          </li>))}</ul>
        {!data.can_give && data.kids.length > 0 && <div className="meta">Sign in to give points.</div>}
      </>)}
      {msg && <div className="toast">{msg}</div>}
    </ha-card>
  );
}

// ------------------------------------------------------------------ registering the elements
function define(tag: string, name: string, description: string, Comp: (p: { api: Api; config: CardConfig }) => JSX.Element, size: number) {
  if (customElements.get(tag)) return;
  class FaithElement extends HTMLElement {
    private _hass?: Hass; private _config?: CardConfig; private _root?: Root; private _api?: Api;
    setConfig(config: CardConfig) { this._config = { ...config }; this._api = undefined; this.render(); }
    set hass(h: Hass) { const first = !this._hass; this._hass = h; if (first) this.render(); }
    getCardSize() { return size; }
    static getStubConfig() { return tag === "faith-who-card" ? { screen: "kitchen" } : {}; }
    connectedCallback() { this.render(); }
    private render() {
      if (!this._config || !this._hass) return;
      if (!this._root) {
        const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });
        const style = document.createElement("style"); style.textContent = css; shadow.appendChild(style);
        const mount = document.createElement("div"); shadow.appendChild(mount); this._root = createRoot(mount);
      }
      this._api ??= makeApi(() => this._hass, this._config);
      this._root.render(<Comp api={this._api} config={this._config} />);
    }
  }
  customElements.define(tag, FaithElement);
  (window.customCards ??= []).push({ type: tag, name, description, preview: false });
}

define("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", FaithCard, 6);
define("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", WhoCard, 2);
define("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", ChatCard, 6);
define("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", RewardsCard, 4);
