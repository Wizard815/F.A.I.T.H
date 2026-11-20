/** FAITH's Home Assistant cards. Add them to any dashboard:
 *    type: custom:faith-card          (the day, meals, shopping, chores, the house, approvals)
 *    type: custom:faith-who-card      (a shared tablet: "Who's here?", sign in with a PIN, sign out)
 *    type: custom:faith-chat-card     (talk or type to FAITH)
 *    type: custom:faith-rewards-card  (points, jobs and rewards)
 *    type: custom:faith-hub-card      (the wall screen: FAITH to talk to, the time, who's here)
 *  Every card asks FAITH as the HA user who's looking (or the person signed in
 *  on this screen with the who card), so each person sees their own things. */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import css from "./cards.css?inline";
import { hubSession, makeApi, setHubSession, type Api, type CardConfig, type Hass } from "./bridge";
import { Emblem, type EmblemState } from "../emblem/Emblem";

declare global {
  namespace JSX { interface IntrinsicElements { "ha-card": any; "ha-icon": any } }
  interface Window { customCards?: { type: string; name: string; description: string; preview?: boolean }[] }
}

type Item = { title: string; time?: string; meta?: string; label?: string; done?: boolean };
type CardData = { id: string; title: string; kind: string; items?: Item[]; approvals?: { id: string; summary: string; requested_by: string }[]; entities?: { entity_id: string; name: string; state: string }[]; text?: string; error?: string; empty?: string };
type Person = { id: string; name: string; role: string; color?: string };
type Layout = { can_arrange: boolean; available: { id: string; title: string }[]; order: string[]; hidden: string[]; saved: boolean };
type View = { layout?: Layout; home?: Person[]; name: string; person: Person | null; household: boolean; hub: { person: Person; remaining_seconds: number } | null; can_sign_in: boolean; can_approve: boolean; pending_approvals: number; cards: CardData[]; apps: { id: string; name: string; url: string; icon?: string }[] };

const ICON: Record<string, string> = { today: "mdi:calendar-today", meals: "mdi:silverware-fork-knife", shopping: "mdi:cart-outline", chores: "mdi:broom", home: "mdi:home-outline", approvals: "mdi:shield-check-outline" };
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
/** A person's face tile: a hexagon, one cell of the hive. */
const Avatar = ({ p, size = 40, ring }: { p: Person; size?: number; ring?: boolean }) => {
  const face = <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.36, background: p.color || "var(--fc-accent)" }}>{initials(p.name)}</span>;
  return ring ? <span className="hexring">{face}</span> : face;
};
function niceTime(t?: string) {
  if (!t) return "";
  if (/^\d{2}:\d{2}$/.test(t)) { const [h, m] = t.split(":").map(Number); return new Date(2000, 0, 1, h, m).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const d = new Date(`${t}T12:00:00`), diff = Math.round((new Date(d.toDateString()).getTime() - new Date(new Date().toDateString()).getTime()) / 86400000);
    return diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : d.toLocaleDateString([], { weekday: "short", day: "numeric" });
  }
  return t;
}

/** FAITH's replies can carry a little Markdown (bold, italics, code, bullets).
 *  Render just that, as React elements (never as HTML). */
function Md({ text }: { text: string }) {
  const inline = (line: string) => line.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*\s][^*]*\*|`[^`]+`)/g).map((t, i) =>
    /^(\*\*|__).+\1$/.test(t) ? <b key={i}>{t.slice(2, -2)}</b> : /^\*.+\*$/.test(t) ? <i key={i}>{t.slice(1, -1)}</i> : /^`.+`$/.test(t) ? <code key={i}>{t.slice(1, -1)}</code> : t);
  const out: ReactNode[] = [];
  let list: ReactNode[] = [];
  const flush = () => { if (list.length) out.push(<ul key={`l${out.length}`} className="md-list">{list}</ul>); list = []; };
  text.split("\n").forEach((raw, i) => {
    const line = raw.replace(/^#{1,6}\s+/, "");
    const m = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (m) { list.push(<li key={i}>{inline(m[1])}</li>); return; }
    flush();
    out.push(<span key={i} className="md-line">{inline(line)}{"\n"}</span>);
  });
  flush();
  return <>{out}</>;
}

/** Times like "15:15" that have already passed today don't count as "next". */
const upcoming = (time?: string, now = new Date()) => {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return true;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m >= now.getHours() * 60 + now.getMinutes();
};

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
        {can && <div className="btns"><button className="primary" aria-label={`Approve: ${a.summary}`} onClick={() => decide(a.id, true)}>Approve</button><button aria-label={`Deny: ${a.summary}`} onClick={() => decide(a.id, false)}>Deny</button></div>}
      </li>))}
    </ul>
    {!can && <div className="meta">A grown-up approves these (signed in here, or on their phone).</div>}
    <div className="toast" role="status">{msg}</div>
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

/** A signed-in person arranges their own day card: order, and which sections show. */
function Arrange({ api, layout, onDone }: { api: Api; layout: Layout; onDone: () => void }) {
  const all = layout.available, [order, setOrder] = useState<string[]>([...layout.order, ...all.map((a) => a.id).filter((id) => !layout.order.includes(id))]);
  const [hidden, setHidden] = useState<string[]>(layout.hidden), [msg, setMsg] = useState("");
  const title = (id: string) => all.find((a) => a.id === id)?.title ?? id;
  const move = (i: number, by: number) => setOrder((o) => { const n = [...o], j = i + by; if (j < 0 || j >= n.length) return o; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const save = (body: Record<string, unknown>) => api.call("/api/ha/prefs/cards", body).then(onDone).catch((e) => setMsg(e.message));
  return (
    <div className="section">
      <h3>Arrange your card</h3>
      <ul aria-label="Sections, in order">{order.map((id, i) => (
        <li key={id} className="row">
          <label className="grow" style={{ display: "flex", gap: 8, alignItems: "center" }}><input type="checkbox" checked={!hidden.includes(id)} onChange={(e) => setHidden((h) => (e.target.checked ? h.filter((x) => x !== id) : [...h, id]))} />Show {title(id)}</label>
          <button className="ghost" aria-label={`Move ${title(id)} up`} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
          <button className="ghost" aria-label={`Move ${title(id)} down`} disabled={i === order.length - 1} onClick={() => move(i, 1)}>↓</button>
        </li>))}</ul>
      <div className="btns" style={{ marginTop: 10 }}>
        <button className="primary" onClick={() => save({ order, hidden })}>Save</button>
        <button onClick={onDone}>Cancel</button>
        {layout.saved && <button className="ghost" onClick={() => save({ reset: true })}>Back to the default</button>}
      </div>
      <div className="err" role="alert">{msg}</div>
    </div>
  );
}

function FaithCard({ api, config }: { api: Api; config: CardConfig }) {
  const { data, err, load } = useView<View>(api, "/api/ha/view", config.cards ? { cards: config.cards } : {});
  const [arranging, setArranging] = useState(false);
  if (err) return <ha-card><div className="err">{err}</div></ha-card>;
  if (!data) return <ha-card><div className="empty">Loading…</div></ha-card>;
  const who = data.person ? `${data.person.name}'s` : "The family's";
  if (arranging && data.layout) return <ha-card><Arrange api={api} layout={data.layout} onDone={() => { setArranging(false); load(); }} /></ha-card>;
  return (
    <ha-card>
      {config.title !== "" && <>
        <div className="head" style={{ marginBottom: 0 }}><div className="eyebrow">{new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
          {data.layout?.can_arrange && <div className="right"><button className="ghost" onClick={() => setArranging(true)}>Arrange</button></div>}</div>
        <div className="hello">{config.title ?? <>{who} <em>day</em>, at a glance.</>}</div>
      </>}
      {config.show_apps !== false && data.apps.length > 0 && <div className="section"><div className="apps">{data.apps.map((a) => <a key={a.id} href={a.url} target="_blank" rel="noreferrer"><span>{a.icon || "↗"}</span>{a.name}</a>)}</div></div>}
      {data.cards.map((c) => <Section key={c.id} c={c} api={api} can={data.can_approve} reload={load} />)}
      {!data.cards.length && <div className="empty">Nothing to show yet.</div>}
    </ha-card>
  );
}

// ------------------------------------------------------------------ signing in on a shared tablet
type People = { people: (Person & { pin: boolean })[]; suggested: string | null; face_unlock: boolean };
const loadPeople = (api: Api) => api.call<People>("/api/ha/hub/people");

/** The PIN pad (or "It's me" when the camera sees them) for one person. */
function PinPad({ api, people, pick, onBack, onDone }: { api: Api; people: People | null; pick: Person; onBack: () => void; onDone: () => void }) {
  const [pin, setPin] = useState(""), [msg, setMsg] = useState("");
  const signIn = async (body: Record<string, unknown>) => {
    setMsg("");
    try { const r: any = await api.call("/api/ha/hub/signin", body); setHubSession(api.screen!, r.hub_session); onDone(); }
    catch (e: any) { setMsg(e.message); setPin(""); }
  };
  const press = (d: string) => setPin((p) => (p + d).slice(0, 8));
  // A keyboard works too: digits, Backspace, Enter, Escape.
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const el = e.composedPath()[0] as HTMLElement | undefined;
      if (el && /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return; // typing somewhere else
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") setPin((p) => p.slice(0, -1));
      else if (e.key === "Enter") { if (pin.length >= 4) signIn({ person: pick.id, pin }); }
      else if (e.key === "Escape") onBack();
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  }, [pin, pick.id]);
  return (
    <div className="pin" role="group" aria-label={`PIN for ${pick.name}`}>
      <div className="head" style={{ margin: 0 }}><Avatar p={pick} size={44} /><h2>Hi, {pick.name}</h2><button className="ghost" style={{ marginLeft: "auto" }} onClick={onBack}>Back</button></div>
      {people?.face_unlock && people.suggested === pick.id && <button className="primary" onClick={() => signIn({ person: pick.id, face: true })}>It's me (camera)</button>}
      <div className="dots" role="status" aria-label={`${pin.length} digit${pin.length === 1 ? "" : "s"} entered`}>{Array.from({ length: Math.max(4, pin.length) }, (_, i) => <span key={i} className={i < pin.length ? "on" : ""} />)}</div>
      <div className="keys">{["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => <button key={d} onClick={() => press(d)}>{d}</button>)}
        <button onClick={() => setPin(pin.slice(0, -1))} aria-label="Delete">⌫</button><button onClick={() => press("0")}>0</button>
        <button className="primary" disabled={pin.length < 4} onClick={() => signIn({ person: pick.id, pin })}>OK</button></div>
      <div className="err" role="alert">{msg}</div>
    </div>
  );
}

/** Keeps a tablet's sign-in alive while people touch it, and forgets it once the server signed them out. */
function useHubKeepAlive(api: Api, data: View | null) {
  const last = useRef(0);
  useEffect(() => {
    if (!data?.hub) return;
    const ping = () => { if (Date.now() - last.current > 15_000) { last.current = Date.now(); api.call("/api/ha/hub/activity").catch(() => {}); } };
    window.addEventListener("pointerdown", ping, true); return () => window.removeEventListener("pointerdown", ping, true);
  }, [data?.hub?.person.id]);
  useEffect(() => { if (data && !data.hub && data.household && api.screen && hubSession(api.screen)) setHubSession(api.screen, null); }, [data]);
}
const signOut = async (api: Api) => { await api.call("/api/ha/hub/signout").catch(() => {}); setHubSession(api.screen!, null); };

// ------------------------------------------------------------------ faith-who-card
function WhoCard({ api }: { api: Api; config: CardConfig }) {
  const { data, err } = useView<View>(api, "/api/ha/view", { cards: [] }, 10_000);
  const [people, setPeople] = useState<People | null>(null), [pick, setPick] = useState<Person | null>(null), [msg, setMsg] = useState("");
  useHubKeepAlive(api, data);
  if (!api.screen) return <ha-card><div className="err">Give this card the screen it's on: <code>screen: kitchen</code></div></ha-card>;
  if (err) return <ha-card><div className="err">{err}</div></ha-card>;
  if (!data) return <ha-card><div className="empty">…</div></ha-card>;

  if (data.hub) return (
    <ha-card><div className="head"><Avatar p={data.hub.person} size={44} /><div><h2>{data.hub.person.name}</h2><div className="sub">Signed in on this screen{data.hub.remaining_seconds < 60 ? ` · signing out in ${data.hub.remaining_seconds}s` : ""}</div></div>
      <div className="right"><button onClick={() => signOut(api)}>Sign out</button></div></div></ha-card>
  );
  if (data.person) return <ha-card><div className="head"><Avatar p={data.person} size={44} /><div><h2>{data.person.name}</h2><div className="sub">Your own Home Assistant account</div></div></div></ha-card>;
  if (pick) return <ha-card><PinPad api={api} people={people} pick={pick} onBack={() => setPick(null)} onDone={() => { setPick(null); setPeople(null); }} /></ha-card>;
  if (!people) return (
    <ha-card><div className="head"><ha-icon icon="mdi:account-group-outline" /><div><h2>Shared view</h2><div className="sub">Everyone sees the family's things. Sign in for your own.</div></div>
      <div className="right"><button className="primary" onClick={() => loadPeople(api).then((p) => { setPeople(p); const s = p.people.find((x) => x.id === p.suggested); if (s) setPick(s); }).catch((e) => setMsg(e.message))}>Sign in</button></div></div>
      {msg && <div className="err">{msg}</div>}</ha-card>
  );
  return (
    <ha-card><div className="head"><h2>Who's here?</h2><div className="right"><button className="ghost" onClick={() => setPeople(null)}>Cancel</button></div></div>
      <div className="people">{people.people.map((p) => <button key={p.id} className={`person ${people.suggested === p.id ? "suggested" : ""}`} onClick={() => setPick(p)}><Avatar p={p} size={52} />{p.name}</button>)}</div></ha-card>
  );
}

// ------------------------------------------------------------------ talking to FAITH (chat card and hub card)
type Line = { me?: boolean; text: string; tools?: string[]; confirm?: { id: string; summary: string; done?: string }; waiting?: string };
const FRIENDLY: [RegExp, string][] = [[/get_day|tasks/, "Checked the calendar"], [/chores/, "Looked at chores"], [/^meals$|meal_plan/, "Meal plan"], [/recipe/, "Recipes"], [/shopping/, "Shopping list"],
  [/home_/, "The house"], [/memory_|context_for|wiki|notes/, "The wiki"], [/points|reward/, "Points"], [/skill_load/, "Used a skill"], [/message_send/, "Sent a message"], [/hermes|studio/, "Hermes"], [/coinpile/, "Money"]];
const friendly = (t: string) => FRIENDLY.find(([r]) => r.test(t))?.[1] ?? t.replace(/_/g, " ");

let audioCtx: AudioContext | undefined;
const ac = () => (audioCtx ??= new AudioContext());
const meter = (an: AnalyserNode) => { const a = new Uint8Array(an.fftSize); an.getByteTimeDomainData(a); let s = 0; for (const v of a) s += ((v - 128) / 128) ** 2; return Math.min(1, Math.sqrt(s / a.length) * 4); };
const toBase64 = (bytes: Uint8Array) => { let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s); };

/** One conversation with FAITH: text or a recording, Yes/No on held actions,
 *  and (when `speak`) the reply read aloud by Argos. `level` feeds the emblem. */
function useChat(api: Api, speak: boolean) {
  const [lines, setLines] = useState<Line[]>([]), [busy, setBusy] = useState(false), [rec, setRec] = useState<MediaRecorder | null>(null), [talking, setTalking] = useState(false), [said, setSaid] = useState(0);
  const conv = useRef<string | null>(null), an = useRef<AnalyserNode | null>(null), playing = useRef<HTMLAudioElement | null>(null);
  const reset = useCallback(() => { conv.current = null; api.call("/api/ha/chat/history").then((h: any) => { conv.current = h.conversation_id; setLines(h.messages.map((m: any) => ({ me: m.role === "user", text: m.content }))); }).catch(() => setLines([])); }, [api]);
  useEffect(() => { reset(); const on = (e: Event) => { if ((e as CustomEvent).detail?.screen === api.screen) reset(); }; window.addEventListener("faith-hub-changed", on); return () => window.removeEventListener("faith-hub-changed", on); }, [reset]);
  const [, tick] = useState(0);
  useEffect(() => { if (!said) return; const t = setTimeout(() => tick((n) => n + 1), 3100); return () => clearTimeout(t); }, [said]);
  useEffect(() => () => { playing.current?.pause(); }, []);

  const say = async (text: string) => {
    try {
      const r: any = await api.call("/api/ha/speak", { text });
      playing.current?.pause();
      const audio = new Audio(`data:${r.mime};base64,${r.audio}`), node = ac().createAnalyser();
      node.fftSize = 512; ac().createMediaElementSource(audio).connect(node); node.connect(ac().destination);
      playing.current = audio; an.current = node; setTalking(true);
      const done = () => { if (playing.current === audio) { an.current = null; setTalking(false); } };
      audio.onended = done; audio.onerror = done;
      await ac().resume(); await audio.play();
    } catch { an.current = null; setTalking(false); /* no voice: the text is still there */ }
  };
  const send = async (body: Record<string, unknown>, shown: string) => {
    setBusy(true); setLines((l) => [...l, ...(shown ? [{ me: true, text: shown }] : []), { text: "…" }]);
    try {
      const r: any = await api.call("/api/ha/chat", { ...body, conversation_id: conv.current });
      conv.current = r.conversation_id;
      setLines((l) => [...l.slice(0, -1), ...(r.heard ? [{ me: true, text: r.heard + (r.speaker ? ` (${r.speaker.name})` : "") }] : []),
        ...r.confirms.map((c: any) => ({ text: "", confirm: c })), ...r.approvals.map((a: any) => ({ text: "", waiting: a.summary })), { text: r.text, tools: r.tools }]);
      setSaid(Date.now());
      if (speak && r.text) say(r.text);
    } catch (e: any) { setLines((l) => [...l.slice(0, -1), { text: `Sorry, that didn't work: ${e.message}` }]); }
    finally { setBusy(false); }
  };
  const mic = async () => {
    if (rec) { rec.stop(); setRec(null); return; }
    playing.current?.pause(); an.current = null; setTalking(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }), r = new MediaRecorder(stream), parts: Blob[] = [];
      try { const node = ac().createAnalyser(); node.fftSize = 512; ac().createMediaStreamSource(stream).connect(node); an.current = node; ac().resume(); } catch { /* no meter */ }
      r.ondataavailable = (e) => e.data.size && parts.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop()); an.current = null;
        const blob = new Blob(parts, { type: r.mimeType || "audio/webm" });
        send({ audio: toBase64(new Uint8Array(await blob.arrayBuffer())), mime: blob.type.split(";")[0] }, "");
      };
      r.start(); setRec(r);
    } catch { setLines((l) => [...l, { text: "The microphone isn't available (Home Assistant needs https for it)." }]); }
  };
  const answer = (id: string, approve: boolean) => api.call(`/api/ha/confirm/${id}`, { approve }).then((r: any) => setLines((l) => l.map((x) => (x.confirm?.id === id ? { ...x, confirm: { ...x.confirm, done: r.text } } : x)))).catch((e) => setLines((l) => [...l, { text: e.message }]));
  const level = useCallback(() => (an.current ? meter(an.current) : undefined), []);
  const state: EmblemState = rec ? "listening" : busy ? "thinking" : talking || (!speak && Date.now() - said < 3000) ? "speaking" : "idle";
  const fresh = () => { conv.current = null; setLines([]); };
  return { lines, busy, rec, state, level, send, mic, answer, fresh };
}

function Held({ l, answer }: { l: Line; answer: (id: string, ok: boolean) => void }) {
  if (l.confirm) return <div className="box"><div>Do this? <b>{l.confirm.summary}</b></div>{l.confirm.done ? <div className="meta">{l.confirm.done}</div> : <div className="btns"><button className="primary" onClick={() => answer(l.confirm!.id, true)}>Yes</button><button onClick={() => answer(l.confirm!.id, false)}>No</button></div>}</div>;
  return <div className="box wait"><div>Waiting for a grown-up: <b>{l.waiting}</b></div></div>;
}

function AskBar({ c, placeholder = "Ask FAITH" }: { c: ReturnType<typeof useChat>; placeholder?: string }) {
  const [text, setText] = useState("");
  return (
    <form className="ask" onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (t && !c.busy) { setText(""); c.send({ text: t }, t); } }}>
      <button type="button" className={c.rec ? "rec" : ""} title={c.rec ? "Stop and send" : "Talk"} aria-label={c.rec ? "Stop recording and send" : "Talk to FAITH"} aria-pressed={!!c.rec} disabled={c.busy} onClick={c.mic}><ha-icon icon={c.rec ? "mdi:stop" : "mdi:microphone"} /></button>
      <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Message to FAITH" placeholder={c.rec ? "Listening… tap stop when done" : placeholder} />
      <button className="primary" type="submit" disabled={c.busy || !text.trim()} title="Send" aria-label="Send"><ha-icon icon="mdi:send" /></button>
    </form>
  );
}

// ------------------------------------------------------------------ faith-chat-card
function ChatCard({ api, config }: { api: Api; config: CardConfig }) {
  const c = useChat(api, config.speak === true), end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [c.lines]);
  return (
    <ha-card>
      <div className="head"><Emblem className="emblem" size={56} tone={api.dark ? "dark" : "light"} state={c.state} level={c.level} /><h2>{config.title ?? "Ask FAITH"}</h2>{c.lines.length > 0 && <div className="right"><button className="ghost" onClick={c.fresh}>New</button></div>}</div>
      <div className="chat" role="log" aria-live="polite" aria-label="Conversation with FAITH">
        {!c.lines.length && <div className="empty">What's on today? What's for dinner? Add milk to the list. Turn off the lights.</div>}
        {c.lines.map((l, i) => l.confirm || l.waiting ? <Held key={i} l={l} answer={c.answer} /> : (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: l.me ? "flex-end" : "flex-start" }}>
            <div className={`msg ${l.me ? "me" : "faith"}`}>{l.me ? l.text : <Md text={l.text} />}</div>
            {!!l.tools?.length && <div className="chips">{[...new Set(l.tools.map(friendly))].map((t) => <span key={t} className="chip">{t}</span>)}</div>}
          </div>
        ))}
        <div ref={end} />
      </div>
      <AskBar c={c} />
    </ha-card>
  );
}

// ------------------------------------------------------------------ faith-hub-card (the wall screen)
const greeting = (d: Date) => (d.getHours() < 5 ? "Good night" : d.getHours() < 12 ? "Good morning" : d.getHours() < 18 ? "Good afternoon" : "Good evening");

/** The kitchen tablet's home: FAITH in the middle (tap to talk), the time, who's
 *  here as hexagon faces, and FAITH's last answer, spoken aloud. */
function HubCard({ api, config }: { api: Api; config: CardConfig }) {
  const { data, err, load } = useView<View>(api, "/api/ha/view", { cards: (config.cards as string[] | undefined) ?? ["today"] }, 30_000);
  const c = useChat(api, config.speak !== false);
  const [now, setNow] = useState(new Date());
  const [people, setPeople] = useState<People | null>(null), [pick, setPick] = useState<Person | null>(null);
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 10_000); return () => clearInterval(i); }, []);
  useHubKeepAlive(api, data);
  const shared = !!api.screen && !!data && !data.person;
  useEffect(() => { if (shared && data?.can_sign_in) loadPeople(api).then(setPeople).catch(() => {}); }, [shared, data?.can_sign_in, data?.hub?.person.id]);
  if (err) return <ha-card class="hub"><div className="err">{err}</div></ha-card>;

  const me = data?.hub?.person ?? data?.person ?? null;
  const last = [...c.lines].reverse().find((l) => !l.me && !l.confirm && !l.waiting);
  const heard = [...c.lines].reverse().find((l) => l.me);
  const held = c.lines.filter((l) => (l.confirm && !l.confirm.done) || l.waiting).slice(-2);
  const next = data?.cards.flatMap((k) => (k.kind === "schedule" ? k.items ?? [] : [])).find((i) => !i.done && upcoming(i.time, now));
  const size = Number(config.size) || 300;
  const hint = c.rec ? "Listening… tap FAITH to send" : c.busy ? "Thinking…" : c.state === "speaking" ? "" : "Tap FAITH to talk";

  return (
    <ha-card class="hub">
      <div className="hub-top">
        <div>
          <div className="clock">{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
          <div className="eyebrow">{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>
        <div className="right">
          {!!data?.pending_approvals && <span className="pill">{data.pending_approvals} waiting for approval</span>}
          {data?.hub && <button onClick={() => signOut(api).then(load)}>Sign out {data.hub.person.name}</button>}
        </div>
      </div>
      <div className="hub-mid">
        <div className="hello">{greeting(now)}, <em>{me ? me.name : "everyone"}</em>.</div>
        {(next || !!data?.home?.length) && <div className="meta">{[next ? `Next: ${niceTime(next.time)} ${next.title}` : "", data?.home?.length ? `Home now: ${data.home.map((p) => p.name).join(", ")}` : ""].filter(Boolean).join(" · ")}</div>}
        <button className="orb" onClick={c.mic} disabled={c.busy} aria-label={c.rec ? "Stop and send" : "Talk to FAITH"}>
          <Emblem size={size} tone={api.dark ? "dark" : "light"} state={c.state} level={c.level} />
        </button>
        {hint && <div className="hint">{hint}</div>}
        {heard && !c.rec && <div className="heard">“{heard.text}”</div>}
        <div aria-live="polite">{last && last.text !== "…" && <div className="reply"><Md text={last.text} /></div>}</div>
        {held.map((l, i) => <Held key={i} l={l} answer={c.answer} />)}
      </div>
      {config.show_input !== false && <AskBar c={c} placeholder="Or type to FAITH" />}
      {shared && people && !data?.hub && (
        <div className="faces">
          {people.people.map((p) => <button key={p.id} className={`face ${people.suggested === p.id ? "on" : ""}`} onClick={() => setPick(p)}><Avatar p={p} size={56} ring={people.suggested === p.id} />{p.name}</button>)}
        </div>
      )}
      {pick && <div className="overlay"><PinPad api={api} people={people} pick={pick} onBack={() => setPick(null)} onDone={() => { setPick(null); load(); }} /></div>}
    </ha-card>
  );
}

// ------------------------------------------------------------------ faith-rewards-card
type Card = { amount: number; currency: string } | null;
type RewardsView = { me: (Person & { points: number; history: any[]; card: Card }) | null; kids: (Person & { points: number; card: Card })[]; activities: { id: string; name: string; points: number; kids_can_claim: boolean }[]; rewards: { id: string; name: string; cost: number; kind: string; amount: number | null }[]; can_give: boolean; allowed_points: number[] };

const money = (c: NonNullable<Card>) => { try { return new Intl.NumberFormat([], { style: "currency", currency: c.currency || "USD" }).format(c.amount); } catch { return `${c.amount.toFixed(2)} ${c.currency}`; } };

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
        <div className="section mine"><div className="honey"><span className="big">{data.me.points}</span><span className="label">points</span></div><div><div className="eyebrow">{data.me.name}'s points</div><div className="meta">Do jobs, ask a grown-up, and spend them on rewards.</div>{data.me.card && <div className="cardbal"><ha-icon icon="mdi:credit-card-outline" />My card: <b>{money(data.me.card)}</b></div>}</div></div>
        <div className="section"><h3>Jobs</h3><ul>{data.activities.filter((a) => a.kids_can_claim).map((a) => (
          <li key={a.id} className="row"><span className="grow">{a.name}</span><span className="pill">+{pts(a.points)}</span><button onClick={() => act("/api/ha/rewards/claim", { activity: a.id }, `Asked for ${pts(a.points)} for "${a.name}".`)}>I did it</button></li>))}</ul></div>
        <div className="section"><h3>Rewards</h3><ul>{data.rewards.map((r) => (
          <li key={r.id} className="row"><span className="grow">{r.name}{r.kind === "money" && r.amount && data.me!.card && !/card/i.test(r.name) ? <span className="meta"> · onto your card</span> : null}</span><span className="pill">{pts(r.cost)}</span><button className="primary" disabled={data.me!.points < r.cost} onClick={() => act("/api/ha/rewards/redeem", { reward: r.id }, `Asked for "${r.name}".`)}>Get it</button></li>))}</ul></div>
      </>) : (<>
        {!data.kids.length && <div className="empty">No children in FAITH's family list yet.</div>}
        <ul>{data.kids.map((k) => (
          <li key={k.id} className="row"><Avatar p={k} size={34} /><span className="grow">{k.name}{k.card && <span className="meta"> · card {money(k.card)}</span>}</span><span className="pill">{pts(k.points)}</span>
            {data.can_give && <div className="btns">{data.allowed_points.map((n) => <button key={n} aria-label={`Give ${k.name} ${pts(n)}`} onClick={() => act("/api/ha/rewards/award", { person: k.id, points: n, reason: "Well done (from the dashboard)" }, `Gave ${k.name} ${pts(n)}.`)}>+{n}</button>)}</div>}
          </li>))}</ul>
        {!data.can_give && data.kids.length > 0 && <div className="meta">Sign in to give points.</div>}
      </>)}
      <div className="toast" role="status">{msg}</div>
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
    static getStubConfig() { return tag === "faith-who-card" || tag === "faith-hub-card" ? { screen: "kitchen" } : {}; }
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

// Register only once Home Assistant's own frontend has started. Defined any
// earlier (our file can run first), the cards end up where HA doesn't look and
// the dashboard says "Custom element doesn't exist" until a reload (seen on HA
// 2026.2 about one load in three).
let registered = false;
function register() {
  if (registered) return;
  registered = true;
  define("faith-card", "FAITH", "The family's day from FAITH: today, meals, shopping, chores, the house and approvals, for whoever is looking.", FaithCard, 6);
  define("faith-who-card", "FAITH: who's here", "For a shared tablet: shows who is signed in, and lets a person sign in with their PIN.", WhoCard, 2);
  define("faith-chat-card", "FAITH: chat", "Talk or type to FAITH.", ChatCard, 6);
  define("faith-hub-card", "FAITH: hub", "The wall screen: FAITH in the middle (tap to talk, answers out loud), the time, and who's here.", HubCard, 9);
  define("faith-rewards-card", "FAITH: points & rewards", "Children's points, jobs to claim and rewards; parents give points.", RewardsCard, 4);
  for (const ms of [0, 500, 2000, 6000]) setTimeout(rebuildMissing, ms);
}
const haReady = () => !!customElements.get("home-assistant");
if (haReady()) register();
else {
  const poll = setInterval(() => { if (haReady()) { clearInterval(poll); register(); } }, 50);
  setTimeout(() => { clearInterval(poll); register(); }, 20_000); // not inside HA (a test page): go anyway
}

// If HA built the dashboard before our cards were registered, it shows
// "Custom element doesn't exist" for them. Ask HA to rebuild those cards.
function rebuildMissing() {
  const found: Element[] = [];
  const walk = (root: Document | ShadowRoot) => root.querySelectorAll("*").forEach((el) => {
    if (el.tagName === "HUI-ERROR-CARD") {
      const c: any = (el as any)._config ?? (el as any).config ?? {};
      if (/faith-[a-z-]*card/.test(`${c.origConfig?.type ?? ""} ${c.message ?? ""} ${c.error ?? ""}`)) found.push(el);
    }
    if (el.shadowRoot) walk(el.shadowRoot);
  });
  walk(document);
  for (const el of found) el.dispatchEvent(new CustomEvent("ll-rebuild", { bubbles: true, composed: true }));
  return found.length;
}
