import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CalendarClock, Check, CloudSun, FolderKanban, Home, Keyboard, Mic, RotateCcw, Settings, ShoppingBasket, Sparkles, Square, UtensilsCrossed, X } from "lucide-react";
import { Emblem } from "@web/emblem/Emblem";
import { cn, useNow } from "@web/ui";
import type { Board as BoardData } from "../faith";
import type { State } from "../shared";
import { api, msg, Photos, Rich, useDark, useTalk, type Line } from "./talk";
import { projectGlance, STATUS_WORDS, useProjects } from "./projects";

/** "1 thread needs you" / "2 working": a few words about projects, or null with nothing to say. */
export function projectWords(g: ReturnType<typeof projectGlance>) {
  if (!g || (!g.needs && !g.working && !g.review)) return null;
  const parts = [g.needs && `${g.needs} need${g.needs > 1 ? "" : "s"} you`, g.review && `${g.review} to review`, g.working && `${g.working} working`].filter(Boolean);
  return parts.join(" · ");
}

/** The last thing said each way, and any change still waiting for a Yes: what the voice layouts show. */
function lastExchange(lines: Line[]) {
  const said = [...lines].reverse().find((l) => l.who === "me");
  const reply = [...lines].reverse().find((l) => l.who === "faith" && !l.confirm && !l.note);
  // Held changes since the last thing said, answered or not (an answered one shows what happened).
  const from = said ? lines.indexOf(said) : 0;
  const held = lines.slice(from).filter((l) => l.confirm);
  const notes = lines.filter((l) => l.note).slice(-1);
  return { said, reply, held, notes };
}

/** Space (outside a text box) talks; Escape stops listening or speaking. The app's shortcut talks too. */
function useTalkKeys(talk: () => void, cancel: () => void) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement;
      if (e.code === "Space" && !typing && !e.repeat) { e.preventDefault(); talk(); }
      if (e.key === "Escape") cancel();
    };
    window.addEventListener("keydown", k);
    const off = api.onAsk(() => talk());
    return () => { window.removeEventListener("keydown", k); off(); };
  }, [talk, cancel]);
}

function HeldChanges({ held, answer, big }: { held: Line[]; answer: (l: Line, yes: boolean) => void; big?: boolean }) {
  if (!held.length) return null;
  return (
    <div className="flex w-full flex-col gap-3">
      {held.map((l) => (
        <div key={l.id} className="card p-4 text-left">
          <p className="text-[13px] text-muted">{l.confirm!.answer ? "Answered" : "Waiting for your Yes"}</p>
          <p className={cn("font-semibold", big && "text-[18px]")}>{l.confirm!.summary}</p>
          {l.confirm!.answer ? <p className="mt-1 text-[15px]">{l.confirm!.answer}</p> : (
            <div className="mt-3 flex gap-2">
              <button className="btn-primary min-h-[52px] flex-1 text-[17px]" onClick={() => answer(l, true)}><Check size={18} />Yes</button>
              <button className="btn-soft min-h-[52px] flex-1 text-[17px]" onClick={() => answer(l, false)}><X size={18} />No</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TypeBox({ onSend, onClose }: { onSend: (q: string) => void; onClose: () => void }) {
  const [text, setText] = useState("");
  return (
    <form className="flex w-full gap-2" onSubmit={(e) => { e.preventDefault(); if (text.trim()) { onSend(text); setText(""); } }}>
      <input className="field flex-1" autoFocus value={text} onChange={(e) => setText(e.target.value)} aria-label="Type to FAITH" placeholder="Type instead of talking" onKeyDown={(e) => e.key === "Escape" && onClose()} />
      <button className="btn-primary" disabled={!text.trim()}>Send</button>
    </form>
  );
}

const hint = (t: ReturnType<typeof useTalk>) =>
  t.rec ? "Listening… tap FAITH or press Space to send" : t.busy ? "Thinking…" : t.speaking ? "Speaking… press Escape to stop" : "Tap FAITH or press Space to talk";

// ---------------------------------------------------------------- Voice focus

/** Voice focus: FAITH and a voice, nothing else to look at. It reads every answer aloud and
 *  can still use everything the person's FAITH can (the board, the calendar, the house…).
 *  On screen only what has to be: what was heard, the answer, and a Yes for a held change. */
export function Focus({ st, onSettings }: { st: State; onSettings: () => void }) {
  const t = useTalk(true, true, false), dark = useDark();
  const [typing, setTyping] = useState(false);
  useTalkKeys(t.talk, t.cancel);
  const { said, reply, held, notes } = lastExchange(t.lines);
  const projects = projectWords(projectGlance(useProjects().list));
  const size = Math.min(320, Math.round(Math.min(window.innerWidth * 0.7, window.innerHeight * 0.42)));
  return (
    <main className="relative flex h-full flex-col items-center gap-4 overflow-auto px-6 pb-5 pt-4 text-center" aria-label="FAITH, voice focus">
      <div className="flex w-full items-center">
        <p className="eyebrow">FAITH · {st.person?.name}</p>
        <button className="icon-btn ml-auto border-transparent" aria-label="Settings" onClick={onSettings}><Settings size={18} /></button>
      </div>
      <button className="mt-2 rounded-full" onClick={t.talk} aria-pressed={!!t.rec}
        aria-label={t.rec ? "Stop and send what you said" : "Talk to FAITH"}>
        <Emblem size={size} state={t.state} level={t.level} tone={dark ? "dark" : "light"} />
      </button>
      <p className="text-[14px] font-medium text-muted" aria-hidden="true">{hint(t)}</p>
      {projects && !said && (
        <button className="btn-soft min-h-[44px] rounded-full text-[14px]" onClick={() => void t.ask("How are my projects going? Start with anything that needs me.")}>
          <FolderKanban size={15} />Projects: {projects}
        </button>
      )}
      <section className="flex w-full max-w-xl flex-col items-center gap-3" aria-live="polite">
        {said && <p className="text-[15px] italic text-muted"><span className="sr-only">You said: </span>“{said.text}”</p>}
        {reply && (reply.busy && !reply.text
          ? (reply.checking?.length ? <p className="text-[15px] text-muted">{reply.checking.join(", ")}…</p> : null)
          : <div className={cn("font-serif text-[22px] leading-snug [&_ul]:mx-auto [&_ul]:w-fit [&_ul]:text-left", reply.error && "text-danger")}><span className="sr-only">FAITH: </span><Rich text={reply.text} /></div>)}
        {reply?.photos?.length ? <Photos photos={reply.photos} /> : null}
        {notes.map((n) => <p key={n.id} className="text-[15px]">{n.note}</p>)}
        <HeldChanges held={held} answer={t.answer} big />
      </section>
      <p className="sr-only" role="status">{t.status}</p>
      <div className="mt-auto flex w-full max-w-xl flex-col items-center gap-2">
        {typing && <TypeBox onSend={(q) => void t.ask(q)} onClose={() => setTyping(false)} />}
        <div className="flex gap-2">
          <button className="btn-ghost text-[14px]" onClick={() => setTyping(!typing)} aria-expanded={typing}><Keyboard size={16} />{typing ? "Hide typing" : "Type instead"}</button>
          <button className="btn-ghost text-[14px]" onClick={() => void t.newTopic()}><RotateCcw size={15} />New topic</button>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------- Voice panel

const failed = (v: unknown): v is { error: string } => !!v && typeof v === "object" && "error" in (v as any);
const greeting = (d: Date) => (d.getHours() < 12 ? "Good morning" : d.getHours() < 18 ? "Good afternoon" : "Good evening");
const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

/** What the panel's tiles say, from the board FAITH serves this person. */
export function glance(b: BoardData | null, now = new Date()) {
  const cards = b?.cards ?? [];
  const kind = (k: string) => cards.find((c: any) => c.kind === k);
  const today = kind("schedule"), meals = kind("meals"), shop = kind("checklist"), house = kind("entities"), waiting = kind("approvals");
  const next = (today?.items ?? []).find((i: any) => !i.done && (!i.time || !/^\d{2}:\d{2}$/.test(i.time) || i.time >= hhmm(now)));
  const dinner = (meals?.items ?? []).find((i: any) => /dinner/i.test(i.label || "")) ?? meals?.items?.at(-1);
  const left = (shop?.items ?? []).filter((i: any) => !i.done);
  const w = b?.weather && !failed(b.weather) ? b.weather : null;
  return {
    weather: w ? { now: `${w.temperature ?? "–"}${w.unit}`, what: w.condition, later: w.days?.[0] ? `${w.days[0].high ?? "–"}° / ${w.days[0].low ?? "–"}°` : "" } : null,
    next: next ? { title: next.title as string, time: (next.time as string) || "" } : today ? null : undefined,
    dinner: dinner ? (dinner.title as string) : meals ? null : undefined,
    shopping: shop ? { count: left.length, first: left.slice(0, 3).map((i: any) => i.title as string) } : undefined,
    house: house ? ((house.entities ?? []) as any[]).slice(0, 3).map((e: any) => `${e.name}: ${e.state}` as string) : undefined,
    approvals: waiting ? (waiting.approvals ?? []).length : 0,
    brief: b?.brief?.text ? (b.brief.text.split(/(?<=[.!?])\s+/).find((x: string) => !/^(good (morning|afternoon|evening)|hi|hello)\b/i.test(x)) ?? b.brief.text) : undefined,
  };
}

function Tile({ icon, title, children, ask, wide }: { icon: ReactNode; title: string; children: ReactNode; ask: () => void; wide?: boolean }) {
  return (
    <button className={cn("card flex min-h-[112px] flex-col items-start gap-1.5 p-4 text-left transition-colors hover:bg-surface-2", wide && "col-span-2")} onClick={ask}>
      <span className="flex items-center gap-2 text-[13px] font-medium text-muted"><span className="text-primary">{icon}</span>{title}</span>
      <span className="text-[17px] font-semibold leading-snug">{children}</span>
    </button>
  );
}

/** Voice panel: like a kitchen speaker with a screen. A big clock, the weather, and a few panels
 *  (next up, dinner, shopping, the house). Tapping a panel asks FAITH about it; every answer is
 *  read aloud and shown as a caption. Talking is the main way in. */
export function Panel({ st, onSettings }: { st: State; onSettings: () => void }) {
  const t = useTalk(true, true, false), dark = useDark(), now = useNow(15_000);
  const [b, setB] = useState<BoardData | null>(null), [err, setErr] = useState("");
  const [typing, setTyping] = useState(false);
  const load = useCallback(() => api.board().then((d) => { setB(d); setErr(""); }).catch((e) => setErr(msg(e))), []);
  useEffect(() => { void load(); const i = setInterval(load, 60_000); return () => clearInterval(i); }, [load]);
  useEffect(() => { if (!t.busy) void load(); }, [t.busy, load]);   // an answer may have changed something
  useTalkKeys(t.talk, t.cancel);
  const g = glance(b, now), { said, reply, held, notes } = lastExchange(t.lines);
  const pg = projectGlance(useProjects().list);
  const showing = !!(said || held.length);
  // Back to the panels after half a minute of quiet (nothing waiting for a Yes).
  useEffect(() => {
    if (!showing || t.busy || t.rec || t.speaking || held.some((l) => !l.confirm!.answer)) return;
    const i = setTimeout(() => t.setLines([]), 30_000);
    return () => clearTimeout(i);
  }, [showing, t.busy, t.rec, t.speaking, held, t.lines]);
  const ask = (q: string) => () => void t.ask(q);
  return (
    <main className="flex h-full flex-col gap-4 overflow-auto p-5" aria-label="FAITH, voice panel">
      <header className="flex items-start gap-3">
        <div>
          <p className="font-serif text-[52px] font-semibold leading-none tabular-nums">{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</p>
          <p className="mt-1 text-[15px] text-muted">{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</p>
          <p className="mt-2 text-[17px]">{greeting(now)}, {st.person?.name}.</p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1">
          <button className="icon-btn border-transparent" aria-label="Settings" onClick={onSettings}><Settings size={18} /></button>
          {g.weather && (
            <button className="text-right" onClick={ask("What's the weather today?")} aria-label={`Weather: ${g.weather.now}, ${g.weather.what}. Ask FAITH about the weather.`}>
              <span className="flex items-center justify-end gap-1.5 font-serif text-[30px] font-semibold"><CloudSun size={24} className="text-primary" />{g.weather.now}</span>
              <span className="block text-[14px] capitalize text-muted">{g.weather.what}{g.weather.later && ` · ${g.weather.later}`}</span>
            </button>
          )}
        </div>
      </header>
      {err && <p className="text-[14px] text-danger" role="alert">{err}</p>}

      {showing ? (
        <section className="flex flex-1 flex-col gap-3" aria-live="polite">
          {said && <p className="text-[15px] italic text-muted"><span className="sr-only">You said: </span>“{said.text}”</p>}
          {reply && (reply.busy && !reply.text
            ? <p className="text-[16px] text-muted">{reply.checking?.length ? `${reply.checking.join(", ")}…` : "Thinking…"}</p>
            : <div className={cn("card p-4 font-serif text-[20px] leading-snug", reply.error && "border-danger")}><span className="sr-only">FAITH: </span><Rich text={reply.text} />
                {reply.photos?.length ? <Photos photos={reply.photos} /> : null}</div>)}
          {notes.map((n) => <p key={n.id} className="text-[15px]">{n.note}</p>)}
          <HeldChanges held={held} answer={t.answer} />
          <button className="btn-soft self-start" onClick={() => { t.quiet(); t.setLines([]); }}>Back to the panels</button>
        </section>
      ) : (
        <section className="grid flex-1 auto-rows-min grid-cols-2 gap-3" aria-label="Today at a glance">
          {g.brief && <Tile wide icon={<Sparkles size={16} />} title="Your brief" ask={ask("Read me my morning brief.")}>{g.brief}</Tile>}
          {g.next !== undefined && <Tile icon={<CalendarClock size={16} />} title="Next up" ask={ask("What's on today?")}>{g.next ? <>{g.next.title}{g.next.time && <span className="block text-[14px] font-normal text-muted">{g.next.time}</span>}</> : "Nothing else today"}</Tile>}
          {g.dinner !== undefined && <Tile icon={<UtensilsCrossed size={16} />} title="Dinner" ask={ask("What's for dinner tonight?")}>{g.dinner ?? "Not planned yet"}</Tile>}
          {g.shopping && <Tile icon={<ShoppingBasket size={16} />} title="Shopping" ask={ask("What's on the shopping list?")}>{g.shopping.count ? `${g.shopping.count} item${g.shopping.count > 1 ? "s" : ""}` : "Nothing on the list"}{g.shopping.first.length > 0 && <span className="block truncate text-[14px] font-normal text-muted">{g.shopping.first.join(", ")}</span>}</Tile>}
          {g.house && <Tile icon={<Home size={16} />} title="The house" ask={ask("How's the house?")}>{g.house.length ? g.house.map((h) => <span key={h} className="block text-[15px]">{h}</span>) : "All quiet"}</Tile>}
          {pg && (pg.needs || pg.working || pg.top) ? <Tile wide icon={<FolderKanban size={16} />} title="Projects" ask={ask("How are my projects going? Start with anything that needs me.")}>
            {projectWords(pg) ?? "All done"}
            {pg.top && <span className="block truncate text-[14px] font-normal text-muted">{pg.top.project}: {pg.top.title} ({(pg.top.stage === "review" ? "ready for review" : STATUS_WORDS[pg.top.status]).toLowerCase()})</span>}
          </Tile> : null}
          {g.approvals > 0 && <Tile wide icon={<Check size={16} />} title="Waiting for a grown-up" ask={ask("What's waiting for approval?")}>{g.approvals} request{g.approvals > 1 ? "s" : ""} to decide</Tile>}
          {!b && !err && <p className="col-span-2 text-muted">Loading…</p>}
        </section>
      )}

      <p className="sr-only" role="status">{t.status}</p>
      <footer className="flex flex-col items-center gap-2">
        {typing && <TypeBox onSend={(q) => void t.ask(q)} onClose={() => setTyping(false)} />}
        <div className="flex w-full items-center gap-3">
          <button className="icon-btn border-transparent" aria-label={typing ? "Hide typing" : "Type instead"} aria-expanded={typing} onClick={() => setTyping(!typing)}><Keyboard size={18} /></button>
          <button className={cn("mx-auto flex min-h-[64px] items-center gap-3 rounded-full px-6 text-[17px] font-semibold", t.rec ? "bg-primary text-primary-foreground" : "bg-primary-soft text-foreground")}
            onClick={t.talk} aria-pressed={!!t.rec} aria-label={t.rec ? "Stop and send what you said" : "Talk to FAITH"}>
            <Emblem size={44} state={t.state} level={t.level} tone={dark ? "dark" : "light"} />
            {t.rec ? <><Square size={16} />Send</> : t.busy ? "Thinking…" : t.speaking ? "Speaking…" : <><Mic size={18} />Talk</>}
          </button>
          <button className="icon-btn border-transparent" aria-label="New topic" onClick={() => void t.newTopic()}><RotateCcw size={17} /></button>
        </div>
      </footer>
    </main>
  );
}
