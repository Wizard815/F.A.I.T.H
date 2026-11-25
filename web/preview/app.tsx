// FAITH's family UI as a clickable preview: React (bundled in), FAITH's real emblem renderer,
// example data and a scripted FAITH. Build: node web/scripts/preview.mjs (writes docs/brand/faith-hub.html).
// Everything is in the one page: nothing is fetched from the internet.
import * as ReactAll from "react";
import * as ReactDOM from "react-dom/client";
import { EmblemRenderer, type EmblemState } from "../src/emblem/emblem.ts";

const React: any = ReactAll;
const { useState, useEffect, useRef, useCallback } = React;

// ---------------------------------------------------------------- example family
type Person = { id: string; name: string; role: "admin" | "adult" | "child"; color: string };
const PEOPLE: Person[] = [
  { id: "wizard", name: "Wizard", role: "admin", color: "#7A4E2D" },
  { id: "sam", name: "Sam", role: "adult", color: "#A0522D" },
  { id: "robin", name: "Robin", role: "child", color: "#C08A2E" },
];
const PINS: Record<string, string> = { wizard: "1234", sam: "5678", robin: "0000" };
const SCHEDULE = [
  { time: "07:30", title: "School drop-off", who: "Sam" },
  { time: "15:15", title: "School pickup", who: "Sam" },
  { time: "16:30", title: "Robin's swim lesson", who: "Robin, Sam" },
  { time: "18:00", title: "Family dinner", who: "Everyone" },
];
const PRIVATE = [{ time: "09:30", title: "Dentist", who: "Wizard" }, { time: "20:00", title: "Call about the ring", who: "Wizard" }];
const MEALS = [{ label: "Breakfast", title: "Pancakes & berries" }, { label: "Lunch", title: "Tomato soup" }, { label: "Dinner", title: "Fish tacos" }];
const JOBS = [{ id: "cat", name: "Feed the cat", points: 0.5 }, { id: "room", name: "Tidy your room", points: 1 }, { id: "dinner", name: "Help with dinner", points: 2 }];
const REWARDS = [{ id: "screen", name: "30 minutes extra screen time", cost: 3 }, { id: "movie", name: "Pick Friday's movie", cost: 5 }, { id: "card", name: "$5 to your card", cost: 20, money: 5 }];

type Approval = { id: string; summary: string; by: string; apply: () => void };
type Line = { me?: boolean; text: string; chips?: string[]; confirm?: { summary: string; done?: string; run: () => void }; waiting?: string };

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
const clock = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return new Date(2000, 0, 1, h, m).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
const nowMinutes = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const greeting = () => { const h = new Date().getHours(); return h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const pts = (n: number) => `${n} pt${n === 1 ? "" : "s"}`;

// ---------------------------------------------------------------- theme + emblem
function useDark() {
  const get = () => { const t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
  const [dark, setDark] = useState(get);
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)"), on = () => setDark(get());
    mq.addEventListener("change", on);
    const mo = new MutationObserver(on); mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { mq.removeEventListener("change", on); mo.disconnect(); };
  }, []);
  return dark;
}

function Emblem({ size, state }: { size: number; state: EmblemState }) {
  const ref = useRef(null), r = useRef(null), dark = useDark();
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => { r.current = new EmblemRenderer(ref.current, { state, tone: dark ? "dark" : "light", still }); return () => r.current?.destroy(); }, []);
  useEffect(() => { r.current?.set({ state, tone: dark ? "dark" : "light" }); }, [state, dark]);
  return <canvas ref={ref} className="emblem" style={{ width: size, height: size }} role="img" aria-label={`FAITH, ${state}`} />;
}

const Hex = ({ p, size = 44, ring }: { p: Person; size?: number; ring?: boolean }) => {
  const face = <span className="hex" style={{ width: size, height: size, fontSize: size * 0.36, background: p.color }}>{initials(p.name)}</span>;
  return ring ? <span className="hexring">{face}</span> : face;
};

/** Bold, italics and bullets from FAITH's replies, as elements. */
function Md({ text }: { text: string }) {
  return <>{text.split("\n").map((line, i) => <span key={i} className="md-line">{line.split(/(\*\*[^*]+\*\*)/g).map((t, j) => (/^\*\*.+\*\*$/.test(t) ? <b key={j}>{t.slice(2, -2)}</b> : t))}{"\n"}</span>)}</>;
}

// ---------------------------------------------------------------- the app
function App() {
  const VIEWS = [["hub", "Wall tablet"], ["family", "Family day"], ["chat", "Ask FAITH"], ["points", "Points"], ["admin", "Admin"]] as const;
  const fromHash = () => (VIEWS.some(([v]) => v === location.hash.slice(1)) ? location.hash.slice(1) : "hub");
  const [view, setView] = useState(fromHash);
  useEffect(() => { const on = () => setView(fromHash()); addEventListener("hashchange", on); return () => removeEventListener("hashchange", on); }, []);
  const go = (v: string) => { location.hash = v; setView(v); };

  // shared family state, so a change in one view shows in the others
  const [me, setMe] = useState(null as Person | null);
  const [shopping, setShopping] = useState(["Milk", "Eggs", "Tortillas", "Limes", "Coriander"]);
  const [done, setDone] = useState([] as string[]);
  const [door, setDoor] = useState("Locked");
  const [lights, setLights] = useState("On");
  const [points, setPoints] = useState(7.5);
  const [card, setCard] = useState(17.5);
  const [approvals, setApprovals] = useState([{ id: "a1", summary: "Add candy to the shopping list", by: "Robin in the family chat", apply: () => setShopping((s: string[]) => [...s, "Candy"]) }] as Approval[]);
  const [toast, setToast] = useState("");
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 3500); return () => clearTimeout(t); }, [toast]);
  const ask = (summary: string, by: string, apply: () => void) => setApprovals((a: Approval[]) => [...a, { id: `a${Date.now()}`, summary, by, apply }]);
  const decide = (id: string, ok: boolean) => setApprovals((a: Approval[]) => { const r = a.find((x) => x.id === id); if (r && ok) r.apply(); setToast(r ? `${ok ? "Approved" : "Denied"}: ${r.summary}.` : ""); return a.filter((x) => x.id !== id); });
  const fam = { me, setMe, shopping, setShopping, done, setDone, door, setDoor, lights, setLights, points, setPoints, card, setCard, approvals, ask, decide, setToast, go };

  return (
    <div className="shell">
      <a href="#main" className="skip" onClick={(e: any) => { e.preventDefault(); document.getElementById("main")?.focus(); }}>Skip to the page</a>
      <header className="top">
        <div className="brand"><Emblem size={40} state="idle" /><span className="brand-name">FAITH</span><span className="tag">Preview · example family</span></div>
        <nav aria-label="Screens" className="tabs">
          {VIEWS.map(([id, label]) => <button key={id} aria-current={view === id ? "page" : undefined} onClick={() => go(id)}>{label}{id === "admin" && approvals.length ? <span className="count" aria-label={`${approvals.length} waiting`}>{approvals.length}</span> : null}</button>)}
        </nav>
        <div className="who">{me ? <><Hex p={me} size={26} /><span>{me.name}</span><button className="link" onClick={() => setMe(null)}>Sign out</button></> : <span className="muted">Nobody signed in</span>}</div>
      </header>
      <main id="main" tabIndex={-1}>
        {view === "hub" && <Hub f={fam} />}
        {view === "family" && <Family f={fam} />}
        {view === "chat" && <Chat f={fam} />}
        {view === "points" && <Points f={fam} />}
        {view === "admin" && <Admin f={fam} />}
      </main>
      <div className="toast" role="status">{toast}</div>
    </div>
  );
}

// ---------------------------------------------------------------- talking to (scripted) FAITH
function useFaith(f: any) {
  const [lines, setLines] = useState([] as Line[]), [state, setState] = useState("idle" as EmblemState);
  const reply = useCallback((q: string) => {
    const t = q.toLowerCase(), view = f.me ? f.me.name : "the household";
    let out: Line[] = [];
    const item = (t.match(/(?:need|add|buy)\s+(?:some\s+)?([a-z ]+?)(?:\s+to the (?:shopping )?list)?[.!?]*$/) || [])[1];
    if (/dinner|eat|meal/.test(t)) out = [{ text: "Tonight is **Fish tacos**. Robin's swim lesson ends at 5:15, so dinner at 6 works.", chips: ["Meal plan"] }];
    else if (/today|schedule|on\b|calendar/.test(t)) {
      const list = [...SCHEDULE, ...(f.me?.id === "wizard" ? PRIVATE : [])].sort((a, b) => a.time.localeCompare(b.time));
      out = [{ text: `Here's ${f.me ? "your" : "the family's"} day:\n${list.map((s) => `${clock(s.time)} ${s.title}`).join("\n")}${f.me?.id === "wizard" ? "\n\nThe dentist and your call are private: only you see them." : ""}`, chips: ["Checked the calendar"] }];
    }
    else if (item) {
      const thing = item.trim().replace(/^\w/, (c: string) => c.toUpperCase());
      if (f.me && f.me.role !== "child") { f.setShopping((s: string[]) => [...s, thing]); out = [{ text: `Added **${thing}** to the shopping list.`, chips: ["Shopping list"] }]; }
      else { f.ask(`Add ${thing.toLowerCase()} to the shopping list`, f.me ? `${f.me.name} on the kitchen screen` : "the kitchen screen", () => f.setShopping((s: string[]) => [...s, thing])); out = [{ text: "", waiting: `add ${thing.toLowerCase()} to the shopping list` }, { text: "I've asked a grown-up to approve that. It'll happen as soon as someone says yes." }]; }
    }
    else if (/lock|door/.test(t)) out = [{ text: "", confirm: { summary: "Lock the Front door", run: () => f.setDoor("Locked") } }, { text: "Tap **Yes** and I'll lock the front door." }];
    else if (/unlock/.test(t)) out = [{ text: "", confirm: { summary: "Unlock the Front door", run: () => f.setDoor("Unlocked") } }, { text: "Tap **Yes** to unlock it." }];
    else if (/light/.test(t)) { const on = !/off/.test(t); f.setLights(on ? "On" : "Off"); out = [{ text: `Turned the kitchen lights ${on ? "on" : "off"}.`, chips: ["The house"] }]; }
    else if (/who.*home|anyone home/.test(t)) out = [{ text: "Wizard and Robin are home. Sam is away." }];
    else out = [{ text: `In this preview I know about today, dinner, the shopping list, the lights and the front door (talking with ${view}). Try one of the suggestions.` }];
    return out;
  }, [f.me]);
  const send = (q: string) => {
    const text = q.trim(); if (!text) return;
    setLines((l: Line[]) => [...l, { me: true, text }]); setState("thinking");
    setTimeout(() => { setLines((l: Line[]) => [...l, ...reply(text)]); setState("speaking"); setTimeout(() => setState("idle"), 2200); }, 1100);
  };
  const answer = (i: number, yes: boolean) => setLines((l: Line[]) => l.map((x, j) => (j === i && x.confirm ? (yes && x.confirm.run(), { ...x, confirm: { ...x.confirm, done: yes ? "Done." : "Okay, I left it." } }) : x)));
  return { lines, state, setState, send, answer, reset: () => setLines([]) };
}

const SUGGEST = ["What's for dinner?", "What's on today?", "We need bread", "Lock the front door", "Who's home?"];

function Held({ l, onAnswer }: { l: Line; onAnswer: (yes: boolean) => void }) {
  if (l.confirm) return <div className="box"><div>Do this? <b>{l.confirm.summary}</b></div>{l.confirm.done ? <div className="muted">{l.confirm.done}</div> : <div className="btns"><button className="primary" onClick={() => onAnswer(true)}>Yes</button><button onClick={() => onAnswer(false)}>No</button></div>}</div>;
  return <div className="box wait">Waiting for a grown-up: <b>{l.waiting}</b></div>;
}

function AskBar({ onSend, placeholder, busy, onMic, listening }: any) {
  const [text, setText] = useState("");
  return (
    <form className="ask" onSubmit={(e: any) => { e.preventDefault(); onSend(text); setText(""); }}>
      <button type="button" className={listening ? "rec" : ""} aria-label={listening ? "Stop and send" : "Talk to FAITH"} aria-pressed={!!listening} onClick={onMic}>{listening ? "■" : "🎙"}</button>
      <input id="ask" value={text} onChange={(e: any) => setText(e.target.value)} aria-label="Message to FAITH" placeholder={placeholder} disabled={busy} />
      <button className="primary" type="submit" disabled={busy || !text.trim()} aria-label="Send">Send</button>
    </form>
  );
}

// ---------------------------------------------------------------- the wall tablet
function Hub({ f }: any) {
  const c = useFaith(f), [now, setNow] = useState(new Date()), [pick, setPick] = useState(null as Person | null), [listening, setListening] = useState(false);
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 10_000); return () => clearInterval(i); }, []);
  const next = [...SCHEDULE, ...(f.me?.id === "wizard" ? PRIVATE : [])].sort((a, b) => a.time.localeCompare(b.time)).find((s) => { const [h, m] = s.time.split(":").map(Number); return h * 60 + m >= nowMinutes(); });
  const last = [...c.lines].reverse().find((l: Line) => !l.me && !l.confirm && !l.waiting), heard = [...c.lines].reverse().find((l: Line) => l.me);
  const held = c.lines.map((l: Line, i: number) => ({ l, i })).filter(({ l }: any) => (l.confirm && !l.confirm.done) || l.waiting).slice(-2);
  const mic = () => {
    if (!listening) { setListening(true); c.setState("listening"); return; }
    setListening(false); c.send(SUGGEST[Math.floor(Math.random() * 3)]);
  };
  return (
    <section className="panel hub" aria-label="Wall tablet">
      <div className="hub-top">
        <div><div className="clock">{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div><div className="eyebrow">{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div></div>
        {f.approvals.length > 0 && <button className="pill" onClick={() => f.go("admin")}>{f.approvals.length} waiting for approval</button>}
      </div>
      <div className="hub-mid">
        <h1 className="hello">{greeting()}, <em>{f.me ? f.me.name : "everyone"}</em>.</h1>
        <p className="muted">{[next ? `Next: ${clock(next.time)} ${next.title}` : "Nothing else today", "Home now: Wizard, Robin"].join(" · ")}</p>
        <button className="orb" onClick={mic} aria-label={listening ? "Stop listening and send" : "Talk to FAITH"}><Emblem size={Math.min(300, window.innerWidth - 80)} state={c.state} /></button>
        <div className="hint">{listening ? "Listening… tap FAITH to send" : c.state === "thinking" ? "Thinking…" : c.state === "speaking" ? "" : "Tap FAITH to talk"}</div>
        {heard && !listening && <div className="heard">“{heard.text}”</div>}
        <div aria-live="polite">{last && <div className="reply"><Md text={last.text} /></div>}</div>
        {held.map(({ l, i }: any) => <Held key={i} l={l} onAnswer={(y) => c.answer(i, y)} />)}
      </div>
      <div className="chips">{SUGGEST.map((s) => <button key={s} className="chip" onClick={() => c.send(s)}>{s}</button>)}</div>
      <AskBar onSend={c.send} placeholder="Or type to FAITH" busy={c.state === "thinking"} onMic={mic} listening={listening} />
      {!f.me && <div className="faces" aria-label="Sign in">{PEOPLE.map((p) => <button key={p.id} className="face" onClick={() => setPick(p)}><Hex p={p} size={56} />{p.name}</button>)}</div>}
      {pick && <PinPad p={pick} onBack={() => setPick(null)} onOk={() => { f.setMe(pick); setPick(null); f.setToast(`Signed in as ${pick.name} on this screen.`); }} />}
    </section>
  );
}

function PinPad({ p, onBack, onOk }: { p: Person; onBack: () => void; onOk: () => void }) {
  const [pin, setPin] = useState(""), [err, setErr] = useState("");
  const tryPin = (v: string) => { if (v === PINS[p.id]) onOk(); else { setErr("That PIN didn't match. Try again."); setPin(""); } };
  const press = (d: string) => setPin((x: string) => { const n = (x + d).slice(0, 4); if (n.length === 4) setTimeout(() => tryPin(n), 150); return n; });
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === "Backspace") setPin((x: string) => x.slice(0, -1)); else if (e.key === "Escape") onBack(); else return; e.preventDefault(); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);
  return (
    <div className="overlay" role="dialog" aria-label={`PIN for ${p.name}`}>
      <div className="pin">
        <div className="pin-head"><Hex p={p} /><h2>Hi, {p.name}</h2><button className="link" onClick={onBack}>Back</button></div>
        <p className="muted small">Example PIN: {PINS[p.id]}</p>
        <div className="dots" role="status" aria-label={`${pin.length} of 4 digits entered`}>{[0, 1, 2, 3].map((i) => <span key={i} className={i < pin.length ? "on" : ""} />)}</div>
        <div className="keys">{["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => <button key={d} onClick={() => press(d)}>{d}</button>)}<button onClick={() => setPin(pin.slice(0, -1))} aria-label="Delete">⌫</button><button onClick={() => press("0")}>0</button><span /></div>
        <div className="err" role="alert">{err}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- the family day card
function Family({ f }: any) {
  const [arranging, setArranging] = useState(false), [order, setOrder] = useState(["today", "meals", "shopping", "chores", "home"]), [hidden, setHidden] = useState([] as string[]);
  const TITLES: Record<string, string> = { today: "Today", meals: "Meals", shopping: "Shopping", chores: "Chores", home: "The house" };
  const schedule = [...SCHEDULE, ...(f.me?.id === "wizard" ? PRIVATE : [])].sort((a, b) => a.time.localeCompare(b.time));
  const section = (id: string) => {
    if (id === "today") return <ul className="rows">{schedule.map((s) => <li key={s.title}><span className="time">{clock(s.time)}</span><span className="grow">{s.title}<span className="muted small block">{s.who}</span></span>{PRIVATE.includes(s as any) && <span className="pill quiet">private</span>}</li>)}</ul>;
    if (id === "meals") return <ul className="rows">{MEALS.map((m) => <li key={m.label}><span className="label grow">{m.label}</span><span>{m.title}</span></li>)}</ul>;
    if (id === "shopping") return <ul className="rows">{f.shopping.map((s: string) => { const got = f.done.includes(s); return <li key={s}><label className="check-row"><input type="checkbox" checked={got} onChange={() => f.setDone((d: string[]) => (got ? d.filter((x) => x !== s) : [...d, s]))} /><span className={got ? "struck" : ""}>{s}</span></label></li>; })}</ul>;
    if (id === "chores") return <ul className="rows">{[["Bins out", "Robin"], ["Water the plants", "Sam"], ["Empty the dishwasher", "Robin"]].map(([c, w]) => <li key={c}><span className="grow">{c}</span><span className="muted small">{w}</span></li>)}</ul>;
    return <div className="tiles">{[["Thermostat", "Heat · 68°F"], ["Front door", f.door], ["Kitchen lights", f.lights], ["Outside", "39°F"]].map(([k, v]) => <div key={k} className="tile"><div className="muted small">{k}</div><div className="v">{v}</div></div>)}</div>;
  };
  if (arranging) return (
    <section className="panel narrow"><h2>Arrange your card</h2>
      <ul className="rows">{order.map((id: string, i: number) => <li key={id}><label className="check-row grow"><input type="checkbox" checked={!hidden.includes(id)} onChange={(e: any) => setHidden((h: string[]) => (e.target.checked ? h.filter((x) => x !== id) : [...h, id]))} />Show {TITLES[id]}</label>
        <button className="ghost" aria-label={`Move ${TITLES[id]} up`} disabled={i === 0} onClick={() => setOrder((o: string[]) => { const n = [...o]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; return n; })}>↑</button>
        <button className="ghost" aria-label={`Move ${TITLES[id]} down`} disabled={i === order.length - 1} onClick={() => setOrder((o: string[]) => { const n = [...o]; [n[i + 1], n[i]] = [n[i], n[i + 1]]; return n; })}>↓</button></li>)}</ul>
      <div className="btns"><button className="primary" onClick={() => { setArranging(false); f.setToast("Saved. This is your card now."); }}>Save</button><button onClick={() => setArranging(false)}>Cancel</button></div>
    </section>
  );
  return (
    <section className="panel">
      <div className="card-head"><div><div className="eyebrow">{new Date().toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div><h1 className="hello">{f.me ? `${f.me.name}'s` : "The family's"} <em>day</em>, at a glance.</h1></div>
        {f.me ? <button className="ghost" onClick={() => setArranging(true)}>Arrange</button> : <p className="muted small right">Sign in on the wall tablet to see your own things and arrange this card.</p>}</div>
      <div className="grid">{order.filter((id: string) => !hidden.includes(id)).map((id: string) => <div key={id} className="sect"><h3>{TITLES[id]}{id === "shopping" && <span className="count quiet">{f.shopping.length}</span>}</h3>{section(id)}</div>)}</div>
    </section>
  );
}

// ---------------------------------------------------------------- chat
function Chat({ f }: any) {
  const c = useFaith(f), end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest" }); }, [c.lines]);
  return (
    <section className="panel narrow chatp">
      <div className="card-head"><div className="row"><Emblem size={64} state={c.state} /><div><h2>Ask FAITH</h2><p className="muted small">{f.me ? `As ${f.me.name}: your own things too.` : "Shared view: changes go to a grown-up first."}</p></div></div>{c.lines.length > 0 && <button className="ghost" onClick={c.reset}>New</button>}</div>
      <div className="log" role="log" aria-live="polite" aria-label="Conversation with FAITH">
        {!c.lines.length && <p className="muted">Ask about today, dinner or the house. Try a suggestion below.</p>}
        {c.lines.map((l: Line, i: number) => (l.confirm || l.waiting ? <Held key={i} l={l} onAnswer={(y) => c.answer(i, y)} /> : <div key={i} className={`msgw ${l.me ? "me" : ""}`}><div className={`msg ${l.me ? "me" : "faith"}`}>{l.me ? l.text : <Md text={l.text} />}</div>{l.chips && <div className="chips small">{l.chips.map((x) => <span key={x} className="chip static">{x}</span>)}</div>}</div>))}
        {c.state === "thinking" && <div className="msg faith typing" aria-label="FAITH is thinking">…</div>}
        <div ref={end} />
      </div>
      <div className="chips">{SUGGEST.map((s) => <button key={s} className="chip" onClick={() => c.send(s)}>{s}</button>)}</div>
      <AskBar onSend={c.send} placeholder="Ask FAITH" busy={c.state === "thinking"} onMic={() => c.send("What's on today?")} />
    </section>
  );
}

// ---------------------------------------------------------------- points
function Points({ f }: any) {
  const robin = PEOPLE[2], parent = f.me && f.me.role !== "child";
  return (
    <div className="two">
      <section className="panel">
        <div className="mine"><div className="honey"><span className="big">{f.points}</span><span className="label">points</span></div>
          <div><div className="eyebrow">Robin's points</div><p className="muted small">Do jobs, ask a grown-up, and spend them on rewards.</p><p className="cardbal">Robin's card: <b>${f.card.toFixed(2)}</b> <span className="muted small">(Firefly)</span></p></div></div>
        <h3>Jobs</h3>
        <ul className="rows">{JOBS.map((j) => <li key={j.id}><span className="grow">{j.name}</span><span className="pill">+{pts(j.points)}</span><button onClick={() => { f.ask(`${pts(j.points)} for "${j.name}"`, "Robin", () => f.setPoints((p: number) => p + j.points)); f.setToast(`Asked a grown-up for ${pts(j.points)}.`); }}>I did it</button></li>)}</ul>
        <h3>Rewards</h3>
        <ul className="rows">{REWARDS.map((r) => <li key={r.id}><span className="grow">{r.name}</span><span className="pill">{pts(r.cost)}</span><button className="primary" disabled={f.points < r.cost} onClick={() => { f.ask(`"${r.name}" for ${pts(r.cost)}`, "Robin", () => { f.setPoints((p: number) => p - r.cost); if (r.money) f.setCard((c: number) => c + r.money!); }); f.setToast(`Asked a grown-up for "${r.name}".`); }}>Get it</button></li>)}</ul>
      </section>
      <section className="panel">
        <h2>For grown-ups</h2>
        {parent ? <><p className="muted small">Give points straight away. Steps are 0.5, 1 and 2.</p>
          <div className="row"><Hex p={robin} /><span className="grow"><b>Robin</b> · {pts(f.points)}</span>{[0.5, 1, 2].map((n) => <button key={n} aria-label={`Give Robin ${pts(n)}`} onClick={() => { f.setPoints((p: number) => p + n); f.setToast(`Gave Robin ${pts(n)}.`); }}>+{n}</button>)}</div></>
          : <p className="muted">Sign in as Wizard or Sam on the wall tablet to give points. Claims and rewards wait in the Admin screen until a grown-up approves them.</p>}
        <p className="muted small">An approved money reward is recorded in Firefly as a transfer to Robin's card account.</p>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------- admin
function Admin({ f }: any) {
  const [coin, setCoin] = useState(false), [checking, setChecking] = useState(false);
  const sources: [string, boolean, string][] = [["The model (Argos)", true, "up for 3 d"], ["Family wiki", true, "up for 3 d"], ["ALLGlance", true, "up for 26 h"], ["Home Assistant", true, "up for 3 d"], ["Coinpile", coin, coin ? "up for just now" : "down for 4 min"], ["Mattermost", true, "up for 2 d"], ["Voice ID", true, "up for 3 d"]];
  return (
    <div className="two">
      <section className="panel">
        <div className="card-head"><h2>Waiting for approval</h2><span className="count">{f.approvals.length}</span></div>
        {!f.approvals.length ? <p className="muted">Nothing waiting. Ask the wall tablet for something while nobody is signed in, or claim a job as Robin.</p>
          : <ul className="rows">{f.approvals.map((a: Approval) => <li key={a.id}><span className="grow">{a.summary}<span className="muted small block">Asked by {a.by}</span></span><button className="primary" aria-label={`Approve: ${a.summary}`} onClick={() => f.decide(a.id, true)}>Approve</button><button aria-label={`Deny: ${a.summary}`} onClick={() => f.decide(a.id, false)}>Deny</button></li>)}</ul>}
        <p className="muted small">Any grown-up approves, here, from a phone notification or in the parents' chat. The admin can overrule a denial.</p>
      </section>
      <section className="panel">
        <div className="card-head"><h2>Integrations watch</h2><button disabled={checking} onClick={() => { setChecking(true); setTimeout(() => { setCoin(true); setChecking(false); f.setToast("Coinpile is back. The parents were told."); }, 900); }}>{checking ? "Checking…" : "Check now"}</button></div>
        <p className="muted small">Checked every 2 min. When one stops answering twice in a row, the parents get one message, and another when it's back.</p>
        <ul className="rows">{[...sources].sort((a, b) => Number(a[1]) - Number(b[1])).map(([n, ok, t]) => <li key={n}><span className="grow">{n}</span><span className={`badge ${ok ? "ok" : "bad"}`}>{t}</span></li>)}</ul>
        {!coin && <p className="err small">Coinpile: couldn't reach 192.168.1.5:8190 (connection refused)</p>}
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
