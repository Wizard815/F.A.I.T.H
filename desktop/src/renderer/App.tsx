import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, Check, CloudSun, FolderKanban, LayoutDashboard, Newspaper, NotebookPen, Server, Sparkles, ImagePlus, Loader2, MessageCircle, Mic, RotateCcw, Send, Settings, Square, Volume2, X } from "lucide-react";
import { Avatar, Card, Empty, ErrorText, Sheet, cn, niceTime } from "@web/ui";
import type { Board as BoardData, ChatEvent, InboxItem, PhotoRef } from "../faith";
import type { FaithBridge, State } from "../shared";

declare global { interface Window { faith: FaithBridge } }
const api = window.faith;
const msg = (e: unknown) => (e instanceof Error ? e.message.replace(/^Error invoking remote method '[^']+': (Error: )?/, "") : String(e));

/** Follow the computer's light or dark setting. */
function useOsTheme() {
  useEffect(() => {
    const q = matchMedia("(prefers-color-scheme: dark)");
    const set = () => document.documentElement.classList.toggle("dark", q.matches);
    set(); q.addEventListener("change", set);
    return () => q.removeEventListener("change", set);
  }, []);
}

export function App() {
  useOsTheme();
  const [st, setSt] = useState<State | null>(null);
  const [note, setNote] = useState("");
  useEffect(() => { api.state().then(setSt); return api.onSignedOut((m) => { setNote(m); api.state().then(setSt); }); }, []);
  if (!st) return null;
  return st.signedIn ? <Main st={st} setSt={setSt} /> : <SignIn st={st} note={note} onDone={(s) => { setNote(""); setSt(s); }} />;
}

// ---------------------------------------------------------------- sign in

function SignIn({ st, note, onDone }: { st: State; note: string; onDone: (s: State) => void }) {
  const [url, setUrl] = useState(st.url || "");
  const [person, setPerson] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    try { onDone(await api.signIn(url, person, password)); } catch (x) { setErr(msg(x)); } finally { setBusy(false); setPassword(""); }
  };
  return (
    <main className="grid min-h-full place-items-center p-6">
      <form className="card w-full max-w-sm p-7" onSubmit={go}>
        <p className="eyebrow">FAITH on this computer</p>
        <h1 className="mb-5 mt-1 text-[30px] font-semibold leading-tight">Sign in</h1>
        {note && <p className="mb-4 rounded-input bg-primary-soft px-3 py-2 text-[14px]" role="status">{note}</p>}
        <div className="flex flex-col gap-4">
          <label className="label">FAITH's address
            <input className="field" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="http://faith:8097" required autoFocus={!st.url} inputMode="url" />
          </label>
          <label className="label">Your FAITH id
            <input className="field" value={person} onChange={(e) => setPerson(e.target.value)} placeholder="sam" required autoFocus={!!st.url} autoCapitalize="off" />
          </label>
          <label className="label">Password
            <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {err && <div role="alert"><ErrorText>{err}</ErrorText></div>}
          <button className="btn-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
          <p className="text-[13px] text-muted">FAITH gives this computer its own key and the password isn't kept. No password yet? A grown-up sets one on FAITH's admin page (People → Set).</p>
        </div>
      </form>
    </main>
  );
}

// ---------------------------------------------------------------- the app

type Tab = "ask" | "board" | "inbox";

function Main({ st, setSt }: { st: State; setSt: (s: State) => void }) {
  const [tab, setTab] = useState<Tab>("ask");
  const [problem, setProblem] = useState<string | null>(null);
  const [items, setItems] = useState<InboxItem[]>([]), [unread, setUnread] = useState(0);
  const [settings, setSettings] = useState(false);
  useEffect(() => {
    api.inbox().then(setItems);
    const offs = [
      api.onInbox((it, n) => { setItems(it); setUnread(n); }),
      api.onStatus(setProblem),
      api.onShow((t) => setTab(t)),
    ];
    return () => offs.forEach((f) => f());
  }, []);
  useEffect(() => { if (tab === "inbox" && unread) { api.markRead(); setUnread(0); } }, [tab, unread]);
  const tabs: [Tab, string, ReactNode][] = [["ask", "Ask", <MessageCircle size={17} />], ["board", "Board", <LayoutDashboard size={17} />], ["inbox", unread ? `Inbox (${unread} new)` : "Inbox", <Bell size={17} />]];
  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Avatar name={st.person?.name || "?"} color={st.person?.color} size={34} />
        <div className="min-w-0">
          <p className="font-serif text-[19px] font-semibold leading-none">FAITH</p>
          <p className="truncate text-[13px] text-muted">{st.person?.name}</p>
        </div>
        <button className="icon-btn ml-auto" aria-label="Settings" onClick={() => setSettings(true)}><Settings size={18} /></button>
      </header>
      <nav className="flex gap-1 border-b border-border px-3 py-2" aria-label="FAITH">
        {tabs.map(([id, label, icon]) => (
          <button key={id} className={cn("btn min-h-[44px] flex-1 px-2 text-[14px]", tab === id ? "bg-primary-soft text-foreground" : "text-muted hover:text-foreground")}
            aria-current={tab === id ? "page" : undefined} onClick={() => setTab(id)}>{icon}{label}</button>
        ))}
      </nav>
      {problem && <p className="bg-primary-soft px-4 py-2 text-[14px]" role="status">{problem}</p>}
      <div className="min-h-0 flex-1">
        {tab === "ask" && <Ask st={st} />}
        {tab === "board" && <Board />}
        {tab === "inbox" && <Inbox items={items} onAsk={() => setTab("ask")} onApprovals={() => setTab("board")} />}
      </div>
      {settings && <SettingsSheet st={st} setSt={setSt} onClose={() => setSettings(false)} />}
    </div>
  );
}

// ---------------------------------------------------------------- ask

type Line = { id: string; who: "me" | "faith"; text: string; images?: string[]; photos?: PhotoRef[]; checking?: string[]; confirm?: { id: string; summary: string; answer?: string }; note?: string; error?: boolean; busy?: boolean };
let seq = 0;
const lineId = () => `l${++seq}`;

/** FAITH writes a little Markdown: **bold**, lists, paragraphs. Shown as text, never as HTML. */
function Rich({ text }: { text: string }) {
  const bold = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (/^\*\*[^*]+\*\*$/.test(p) ? <strong key={i}>{p.slice(2, -2)}</strong> : p));
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) blocks.push(<ul key={blocks.length} className="ml-5 list-disc">{list.map((l, i) => <li key={i}>{bold(l)}</li>)}</ul>); list = []; };
  for (const line of text.split("\n")) {
    const m = /^\s*(?:[-*•]|\d+\.)\s+(.*)$/.exec(line);
    if (m) { list.push(m[1]); continue; }
    flush();
    if (line.trim()) blocks.push(<p key={blocks.length}>{bold(line)}</p>);
  }
  flush();
  return <div className="flex flex-col gap-2">{blocks}</div>;
}

const friendly = (name: string) => {
  if (name.includes("day") || name.includes("calendar")) return "checking the calendar";
  if (name.includes("shopping")) return "checking the shopping list";
  if (name.includes("meal") || name.includes("recipe")) return "checking meals";
  if (name.startsWith("Hass") || name.startsWith("home_") || name.includes("camera")) return "checking the house";
  if (/notes|wiki|memory|context/.test(name)) return "checking your notes";
  if (name.startsWith("coinpile")) return "checking money";
  if (name.startsWith("photos_")) return "looking through photos";
  return "checking";
};

/** A photo as FAITH wants it: upright, at most 1600 px on its long side, JPEG. */
async function shrink(file: Blob): Promise<string> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}

/** Photos an answer showed (Immich). A click opens the photo in Immich, in the browser. */
function Photos({ photos }: { photos: PhotoRef[] }) {
  const [src, setSrc] = useState<Record<string, string>>({});
  useEffect(() => {
    let live = true;
    for (const p of photos) api.photo(p.source, p.id).then((u) => live && setSrc((m) => ({ ...m, [p.id]: u }))).catch(() => {});
    return () => { live = false; };
  }, [photos.map((p) => p.id).join()]);
  const label = (p: PhotoRef) => [p.kind === "video" ? "Video" : "Photo", p.taken && `from ${p.taken.slice(0, 10)}`, p.place && `in ${p.place}`, p.people?.length && `with ${p.people.join(", ")}`].filter(Boolean).join(" ");
  return (
    <ul className="mt-3 grid w-72 max-w-full grid-cols-3 gap-2" aria-label={`${photos.length} photo${photos.length > 1 ? "s" : ""}`}>
      {photos.map((p) => (
        <li key={p.id}>
          <button type="button" className="relative block aspect-square w-full overflow-hidden rounded-input bg-surface-2" title={label(p)}
            aria-label={`${label(p)}${p.link ? ". Opens in Immich." : ""}`} onClick={() => p.link && api.openLink(p.link)}>
            {src[p.id] && <img src={src[p.id]} alt="" className="h-full w-full object-cover" />}
            {p.kind === "video" && <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 text-[11px] text-white">Video</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}

function Ask({ st }: { st: State }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [drag, setDrag] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null), end = useRef<HTMLDivElement>(null), audio = useRef<HTMLAudioElement | null>(null);
  const current = useRef<{ ask: string; line: string; answer: string } | null>(null);
  const readAloud = useRef(st.settings.readAloud);
  readAloud.current = st.settings.readAloud;
  const update = (id: string, f: (l: Line) => Line) => setLines((ls) => ls.map((l) => (l.id === id ? f(l) : l)));

  useEffect(() => {
    api.latest().then((ms) => setLines(ms.filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({ id: lineId(), who: m.role === "user" ? "me" : "faith", text: m.content })))).catch(() => {});
    const offs = [api.onAsk(() => box.current?.focus()), api.onChat(onEvent)];
    box.current?.focus();
    return () => offs.forEach((f) => f());
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [lines]);

  const speak = async (t: string) => {
    try {
      const mp3 = await api.speak(t);
      audio.current?.pause();
      const a = new Audio(URL.createObjectURL(new Blob([mp3], { type: "audio/mpeg" })));
      audio.current = a; await a.play();
    } catch (e) { setStatus(`Couldn't read it aloud: ${msg(e)}`); }
  };

  function onEvent(id: string, e: ChatEvent) {
    const cur = current.current;
    if (!cur || cur.ask !== id) return;
    const L = cur.line;
    if (e.type === "text") { cur.answer += e.delta; update(L, (l) => ({ ...l, text: cur.answer })); }
    else if (e.type === "tool") { const w = friendly(e.name); setStatus(`FAITH is ${w}…`); update(L, (l) => ({ ...l, checking: [...new Set([...(l.checking || []), w])] })); }
    else if (e.type === "photos") update(L, (l) => ({ ...l, photos: e.items }));
    else if (e.type === "confirm") setLines((ls) => [...ls, { id: lineId(), who: "faith", text: "", confirm: { id: e.id, summary: e.summary } }]);
    else if (e.type === "approval") setLines((ls) => [...ls, { id: lineId(), who: "faith", text: "", note: `Sent to a grown-up to approve: ${e.summary}` }]);
    else if (e.type === "done") {
      cur.answer = e.text || cur.answer;
      update(L, (l) => ({ ...l, text: cur.answer, busy: false }));
      setStatus("FAITH answered."); setBusy(null); current.current = null;
      if (readAloud.current && cur.answer.trim()) void speak(cur.answer);
    } else if (e.type === "error") {
      update(L, (l) => ({ ...l, text: e.message, error: true, busy: false }));
      setStatus(e.message); setBusy(null); current.current = null;
    }
  }

  const ask = async (q: string, imgs = photos) => {
    const t = q.trim() || (imgs.length ? "What's in this photo?" : "");
    if (!t || busy) return;
    const L = lineId();
    setLines((ls) => [...ls, { id: lineId(), who: "me", text: t, images: imgs }, { id: L, who: "faith", text: "", busy: true }]);
    setText(""); setPhotos([]); setStatus("FAITH is thinking…");
    try {
      const id = await api.ask({ text: t, images: imgs });
      current.current = { ask: id, line: L, answer: "" }; setBusy(id);
    } catch (e) { update(L, (l) => ({ ...l, text: msg(e), error: true, busy: false })); setStatus(msg(e)); }
  };

  const answer = async (line: Line, approve: boolean) => {
    if (!line.confirm) return;
    try {
      const r = await api.confirm(line.confirm.id, approve);
      update(line.id, (l) => ({ ...l, confirm: { ...l.confirm!, answer: r.text || (approve ? "Done." : "Cancelled.") } }));
      setStatus(r.text || "");
    } catch (e) { update(line.id, (l) => ({ ...l, confirm: { ...l.confirm!, answer: msg(e) } })); setStatus(msg(e)); }
  };

  const addFiles = async (files: Iterable<File>) => {
    const imgs = [...files].filter((f) => f.type.startsWith("image/"));
    if (!imgs.length) { setStatus("Only photos can go to FAITH."); return; }
    try {
      const urls = await Promise.all(imgs.slice(0, 4).map(shrink));
      setPhotos((p) => [...p, ...urls].slice(0, 4)); setStatus(`${urls.length} photo${urls.length > 1 ? "s" : ""} ready to send.`);
    } catch { setStatus("That photo couldn't be read. Try a JPEG or PNG."); }
  };

  const talk = async () => {
    if (rec) { rec.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" }), parts: Blob[] = [];
      r.ondataavailable = (e) => parts.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop()); setRec(null);
        const blob = new Blob(parts, { type: "audio/webm" });
        if (blob.size < 2000) { setStatus("That was too short. Click the microphone, talk, then click it again."); return; }
        setStatus("Listening back…");
        try {
          const heard = await api.transcribe(await blob.arrayBuffer(), "audio/webm");
          if (!heard) { setStatus("I didn't catch that."); return; }
          void ask(heard);
        } catch (e) { setStatus(msg(e)); }
      };
      r.start(); setRec(r); setStatus("Listening. Click the microphone again to send.");
    } catch { setStatus("FAITH can't use the microphone. Allow it in your computer's privacy settings."); }
  };

  return (
    <section className={cn("relative flex h-full flex-col", drag && "outline outline-2 outline-primary")}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); void addFiles(e.dataTransfer.files); }} aria-label="Ask FAITH">
      <div className="flex-1 overflow-auto px-4 py-4">
        {!lines.length && <div className="mt-10 text-center text-muted"><p className="font-serif text-[22px] text-foreground">What can I do for you?</p><p className="mt-2 text-[14px]">Ask, click 🎙 to talk, or drop a photo here.</p></div>}
        <ol className="flex flex-col gap-3" aria-live="polite">
          {lines.map((l) => (
            <li key={l.id} className={cn("max-w-[88%] rounded-card px-4 py-3 text-[15px] leading-relaxed", l.who === "me" ? "self-end bg-primary text-primary-foreground" : "self-start border border-border bg-surface", l.error && "border-danger")}>
              <span className="sr-only">{l.who === "me" ? "You:" : "FAITH:"}</span>
              {l.images?.length ? <div className="mb-2 flex gap-2">{l.images.map((u, i) => <img key={i} src={u} alt={`Photo ${i + 1}`} className="h-20 w-20 rounded-input object-cover" />)}</div> : null}
              {l.checking?.length ? <p className="mb-1 text-[13px] text-muted">{l.checking.join(", ")}…</p> : null}
              {l.busy && !l.text ? <span className="inline-flex items-center gap-2 text-muted"><Loader2 size={16} className="animate-spin" />Thinking…</span> : null}
              {l.text && (l.who === "faith" && !l.error ? <Rich text={l.text} /> : <p className="whitespace-pre-wrap">{l.text}</p>)}
              {l.photos?.length ? <Photos photos={l.photos} /> : null}
              {l.note && <p>{l.note}</p>}
              {l.confirm && (
                <div>
                  <p className="font-semibold">{l.confirm.summary}</p>
                  {l.confirm.answer ? <p className="mt-2 text-muted">{l.confirm.answer}</p> : (
                    <div className="mt-3 flex gap-2">
                      <button className="btn-primary flex-1" onClick={() => answer(l, true)}><Check size={16} />Yes</button>
                      <button className="btn-soft flex-1" onClick={() => answer(l, false)}><X size={16} />No</button>
                    </div>
                  )}
                </div>
              )}
              {l.who === "faith" && l.text && !l.busy && !l.error && <button className="btn-ghost -mb-2 -ml-3 mt-1 min-h-[44px] text-[13px]" onClick={() => speak(l.text)} aria-label="Read this answer aloud"><Volume2 size={15} />Read aloud</button>}
            </li>
          ))}
        </ol>
        <div ref={end} />
      </div>
      <p className="sr-only" role="status" aria-live="polite">{status}</p>
      <form className="border-t border-border p-3" onSubmit={(e) => { e.preventDefault(); void ask(text); }}>
        {photos.length > 0 && (
          <div className="mb-2 flex gap-2">
            {photos.map((u, i) => (
              <span key={i} className="relative">
                <img src={u} alt={`Photo ${i + 1} to send`} className="h-14 w-14 rounded-input object-cover" />
                <button type="button" className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-foreground text-background" aria-label={`Remove photo ${i + 1}`} onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}><X size={14} /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <label className="icon-btn cursor-pointer" aria-label="Add a photo" title="Add a photo">
            <ImagePlus size={18} />
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => { if (e.target.files) void addFiles(e.target.files); e.target.value = ""; }} />
          </label>
          <textarea ref={box} className="field max-h-40 min-h-[44px] flex-1 resize-none py-2.5" rows={1} value={text} aria-label="Your question"
            placeholder={rec ? "Listening…" : "Ask FAITH"} onChange={(e) => setText(e.target.value)}
            onPaste={(e) => { const f = [...e.clipboardData.files]; if (f.length) { e.preventDefault(); void addFiles(f); } }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void ask(text); } }} />
          <button type="button" className={cn("icon-btn", rec && "border-primary bg-primary text-primary-foreground hover:bg-primary-hover")} onClick={talk}
            aria-label={rec ? "Stop and send what you said" : "Talk to FAITH"} aria-pressed={!!rec}>{rec ? <Square size={16} /> : <Mic size={18} />}</button>
          {busy
            ? <button type="button" className="icon-btn" aria-label="Stop the answer" onClick={() => api.stop(busy)}><Square size={16} /></button>
            : <button className="icon-btn border-primary bg-primary text-primary-foreground hover:bg-primary-hover" aria-label="Send" disabled={!text.trim() && !photos.length}><Send size={17} /></button>}
        </div>
        <div className="mt-1 flex items-center justify-between text-[12px] text-muted">
          <span aria-hidden="true">{status}</span>
          <button type="button" className="btn-ghost min-h-[36px] px-2 text-[12px]" onClick={async () => { await api.newTopic(); setLines([]); setStatus("A fresh start."); box.current?.focus(); }}><RotateCcw size={13} />New topic</button>
        </div>
      </form>
    </section>
  );
}

// ---------------------------------------------------------------- the board (Pondering Orb's Main and Daily, through FAITH)

const STATUS: Record<string, string> = { next: "Next", active: "Active", blocked: "Blocked", paused: "Paused", shipped: "Shipped" };
const failed = (v: unknown): v is { error: string } => !!v && typeof v === "object" && "error" in (v as any);
const dayName = (d: string) => { const t = new Date(`${d}T12:00:00`); return Number.isNaN(t.getTime()) ? d : t.toLocaleDateString([], { weekday: "short" }); };

/** One of FAITH's day cards (the same as the Home Assistant card). */
function DayCard({ c, decide }: { c: any; decide: (id: string, approve: boolean) => void }) {
  return (
    <Card title={c.title} count={c.items?.length ?? c.approvals?.length}>
      {c.error ? <ErrorText>{c.error}</ErrorText> : c.empty ? <Empty>{c.empty}</Empty> : c.text ? <Rich text={c.text} /> : null}
      {c.items && (
        <ul className="flex flex-col gap-2">
          {c.items.map((it: any, i: number) => (
            <li key={i} className="flex gap-3 text-[15px]">
              {(it.time || it.label) && <span className="w-20 shrink-0 text-muted">{it.label || niceTime(it.time)}</span>}
              <span className={cn(it.done && "text-muted line-through")}>{it.title}{it.done && <span className="sr-only"> (done)</span>}</span>
              {it.meta && <span className="ml-auto text-[13px] text-muted">{it.meta}</span>}
            </li>
          ))}
        </ul>
      )}
      {c.entities && (
        <ul className="flex flex-col gap-1.5">{c.entities.map((e: any) => <li key={e.entity_id} className="flex justify-between text-[15px]"><span>{e.name}</span><span className="text-muted">{e.state}</span></li>)}</ul>
      )}
      {c.approvals && (
        <ul className="flex flex-col gap-3">
          {c.approvals.map((a: any) => (
            <li key={a.id}>
              <p className="font-semibold">{a.summary}</p>
              <p className="text-[13px] text-muted">Asked by {a.requested_by}</p>
              <div className="mt-2 flex gap-2">
                <button className="btn-primary flex-1" onClick={() => decide(a.id, true)}>Approve</button>
                <button className="btn-soft flex-1" onClick={() => decide(a.id, false)}>Decline</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Board() {
  const [b, setB] = useState<BoardData | null>(null), [err, setErr] = useState("");
  const [status, setStatus] = useState("");
  const [writing, setWriting] = useState(false);
  const [logText, setLogText] = useState(""), [logProject, setLogProject] = useState("");
  const [newProject, setNewProject] = useState("");
  const load = useCallback(() => api.board().then((d) => { setB(d); setErr(""); }).catch((e) => setErr(msg(e))), []);
  useEffect(() => { void load(); const i = setInterval(load, 60_000); return () => clearInterval(i); }, [load]);
  const act = async (f: () => Promise<unknown>, done: string) => {
    try { await f(); setStatus(done); return true; } catch (e) { setStatus(msg(e)); return false; } finally { await load(); }
  };
  const decide = (id: string, approve: boolean) => void act(() => api.decide(id, approve), approve ? "Approved." : "Declined.");
  const brief = async () => {
    setWriting(true); setStatus("FAITH is writing your brief. This can take a minute.");
    await act(() => api.writeBrief(), "Your brief is ready.");
    setWriting(false);
  };
  const w = b?.weather, n = b?.news, up = b?.uptime, sys = b?.system;
  return (
    <section className="h-full overflow-auto p-4" aria-label="Board">
      <p className={cn("text-[14px] text-muted", status && "mb-3")} role="status" aria-live="polite">{status}</p>
      {err && <div role="alert"><ErrorText>{err}</ErrorText></div>}
      {!b && !err && <p className="text-muted">Loading…</p>}
      {b && (
        <div className="grid gap-4 md:grid-cols-2">
          {b.person && (
            <Card icon={<Sparkles size={18} />} title="Morning brief" className="md:col-span-2"
              action={<button className="btn-soft min-h-[44px] px-3 text-[14px]" onClick={brief} disabled={writing}>{writing ? <><Loader2 size={15} className="animate-spin" />Writing…</> : b.brief ? "Write it again" : "Write it now"}</button>}>
              {b.brief ? <Rich text={b.brief.text} /> : <Empty>No brief yet today. FAITH writes it from your board, your calendar and the news.</Empty>}
            </Card>
          )}
          {w && (
            <Card icon={<CloudSun size={18} />} title="Weather">
              {failed(w) ? <ErrorText>{w.error}</ErrorText> : (
                <>
                  <p className="text-[15px]"><span className="font-serif text-[28px] font-semibold">{w.temperature ?? "–"}{w.unit}</span> <span className="capitalize">{w.condition}</span></p>
                  <p className="text-[13px] text-muted">{[w.feels_like != null && `Feels like ${w.feels_like}${w.unit}`, w.humidity != null && `humidity ${w.humidity}%`, w.wind != null && `wind ${w.wind} ${w.wind_unit}`].filter(Boolean).join(" · ")}</p>
                  {w.days.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-1.5">
                      {w.days.slice(0, 5).map((d) => <li key={d.date} className="flex gap-3 text-[15px]"><span className="w-12 text-muted">{dayName(d.date)}</span><span className="flex-1 capitalize">{d.condition}</span><span>{d.high ?? "–"}° / {d.low ?? "–"}°</span>{d.rain != null && <span className="w-24 text-right text-muted">{d.rain}% rain</span>}</li>)}
                    </ul>
                  )}
                </>
              )}
            </Card>
          )}
          {b.cards.map((c) => <DayCard key={c.id} c={c} decide={decide} />)}
          {b.projects && (
            <Card icon={<FolderKanban size={18} />} title="Projects" count={b.projects.length}>
              {!b.projects.length && (
                <div className="flex flex-col gap-2">
                  <Empty>No projects yet. Add one below, or bring yours over from Pondering Orb.</Empty>
                  <button className="btn-soft" onClick={async () => { try { const r = await api.importOrb(); setStatus(`Brought over ${r.projects} projects and ${r.logs} log entries from Pondering Orb.`); await load(); } catch (e) { setStatus(msg(e)); } }}>Bring my projects over from Pondering Orb</button>
                </div>
              )}
              <ul className="flex flex-col gap-3">
                {b.projects.map((p) => (
                  <li key={p.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{p.fav && <span aria-label="Starred">★ </span>}{p.name}</span>
                      <select className="field ml-auto w-auto min-w-[120px] py-1 text-[14px]" aria-label={`Status of ${p.name}`} value={p.status}
                        onChange={(e) => act(() => api.updateProject(p.name, { status: e.target.value }), `${p.name} is now ${STATUS[e.target.value] || e.target.value}.`)}>
                        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    {p.next && <p className="text-[14px]">Next: {p.next}</p>}
                    {p.last && <p className="text-[13px] text-muted">Last: {p.last}{p.last_day ? ` (${p.last_day})` : ""}</p>}
                  </li>
                ))}
              </ul>
              <form className="mt-3 flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (newProject.trim() && await act(() => api.addProject(newProject.trim()), `Added ${newProject.trim()}.`)) setNewProject(""); }}>
                <input className="field" value={newProject} onChange={(e) => setNewProject(e.target.value)} aria-label="New project's name" placeholder="A new project" />
                <button className="btn-soft shrink-0" disabled={!newProject.trim()}>Add</button>
              </form>
            </Card>
          )}
          {b.log && (
            <Card icon={<NotebookPen size={18} />} title="Log">
              <form className="mb-3 flex flex-col gap-2" onSubmit={async (e) => { e.preventDefault(); if (logText.trim() && await act(() => api.addLog(logText.trim(), logProject || undefined), "Logged.")) setLogText(""); }}>
                <label className="label">What did you get done?
                  <input className="field" value={logText} onChange={(e) => setLogText(e.target.value)} placeholder="Fixed the gate latch" />
                </label>
                <div className="flex gap-2">
                  <select className="field" aria-label="Which project" value={logProject} onChange={(e) => setLogProject(e.target.value)}>
                    <option value="">General</option>
                    {b.projects?.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
                  <button className="btn-primary shrink-0 whitespace-nowrap" disabled={!logText.trim()}>Log it</button>
                </div>
              </form>
              {b.log.length ? (
                <ul className="flex flex-col gap-1.5">{b.log.map((l) => <li key={l.id} className="flex gap-3 text-[15px]"><span className="w-20 shrink-0 text-muted">{l.day.slice(5)}</span><span className="flex-1">{l.text}</span><span className="text-[13px] text-muted">{l.project}</span></li>)}</ul>
              ) : <Empty>Nothing logged yet.</Empty>}
            </Card>
          )}
          {n && (
            <Card icon={<Newspaper size={18} />} title="News">
              {failed(n) ? <ErrorText>{n.error}</ErrorText> : (
                <>
                  {n.errors.map((e) => <ErrorText key={e}>{e}</ErrorText>)}
                  {n.items.length ? <ul className="flex flex-col gap-2">{n.items.map((i) => <li key={i.link} className="text-[15px]"><a className="underline decoration-border underline-offset-2 hover:decoration-primary" href={i.link} target="_blank" rel="noreferrer">{i.title}</a> <span className="text-[13px] text-muted">{i.source}</span></li>)}</ul> : <Empty>No headlines right now.</Empty>}
                </>
              )}
            </Card>
          )}
          {up && (
            <Card icon={<Server size={18} />} title="Uptime">
              {failed(up) ? <ErrorText>{up.error}</ErrorText> : (
                <>
                  <p className="text-[15px]"><strong>{up.up} up</strong>{up.down ? <>, <strong className="text-danger">{up.down} down</strong></> : ", none down"}</p>
                  <ul className="mt-2 flex flex-col gap-1">{up.monitors.filter((m) => m.status !== "up" && !m.ignored).map((m) => <li key={m.name} className="flex justify-between text-[15px]"><span>{m.name}</span><span className="text-muted">{m.status === "down" ? "Down" : "Waiting"}</span></li>)}</ul>
                </>
              )}
            </Card>
          )}
          {sys && (
            <Card icon={<Server size={18} />} title="FAITH's server">
              {failed(sys) ? <ErrorText>{sys.error}</ErrorText> : (
                <>
                  <p className="text-[15px]">Load {sys.load}% · memory {sys.memory}% of {sys.memory_gib} GiB{sys.disks.map((d) => ` · ${d.mount} ${d.pct}% full`).join("")} · up {sys.uptime_days} days</p>
                  {sys.sources.filter((x) => x.ok === false).map((x) => <p key={x.label} className="text-[14px] text-danger">{x.label} is down{x.error ? `: ${x.error}` : ""}</p>)}
                  {sys.sources.length > 0 && !sys.sources.some((x) => x.ok === false) && <p className="text-[13px] text-muted">Every connection is answering.</p>}
                </>
              )}
            </Card>
          )}
        </div>
      )}
      {b && !b.cards.length && !b.person && !w && !n && <Empty>Nothing on the board yet. A grown-up sets it up in faith.yaml (dashboard and board).</Empty>}
    </section>
  );
}

// ---------------------------------------------------------------- inbox

function Inbox({ items, onApprovals }: { items: InboxItem[]; onAsk: () => void; onApprovals: () => void }) {
  return (
    <section className="h-full overflow-auto p-4" aria-label="Inbox">
      {!items.length && <Empty>Nothing yet. A bigger job's answer, the doorbell and approvals to decide land here, and as notifications.</Empty>}
      <ol className="flex flex-col gap-3" aria-live="polite">
        {items.map((it) => (
          <li key={it.id} className="card p-4">
            <div className="flex items-baseline gap-2">
              <p className="font-semibold">{it.title || "FAITH"}</p>
              <span className="ml-auto text-[12px] text-muted">{new Date(it.at).toLocaleString([], { weekday: "short", hour: "numeric", minute: "2-digit" })}</span>
            </div>
            <div className="mt-1 text-[15px]"><Rich text={it.text} /></div>
            {it.kind === "approval" && <button className="btn-soft mt-3" onClick={onApprovals}>Decide on the board</button>}
          </li>
        ))}
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------- settings

function SettingsSheet({ st, setSt, onClose }: { st: State; setSt: (s: State) => void; onClose: () => void }) {
  const [err, setErr] = useState(""), [shortcut, setShortcut] = useState(st.settings.shortcut);
  const set = async (p: Partial<State["settings"]>) => { try { setSt(await api.setSettings(p)); setErr(""); } catch (e) { setErr(msg(e)); } };
  const Toggle = ({ k, label, hint }: { k: "readAloud" | "notifications" | "startAtLogin"; label: string; hint: string }) => (
    <label className="flex min-h-[44px] cursor-pointer items-start gap-3">
      <input type="checkbox" className="mt-1 h-5 w-5 accent-[rgb(var(--primary))]" checked={st.settings[k]} onChange={(e) => set({ [k]: e.target.checked })} />
      <span><span className="font-medium">{label}</span><br /><span className="text-[13px] text-muted">{hint}</span></span>
    </label>
  );
  return (
    <Sheet title="Settings" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Toggle k="readAloud" label="Read answers aloud" hint="In FAITH's own voice (from your server)." />
        <Toggle k="notifications" label="Notifications" hint="A bigger job's answer, the doorbell, approvals. FAITH keeps running in the tray when you close the window." />
        <Toggle k="startAtLogin" label="Start when I sign in to this computer" hint="In the tray, ready for notifications." />
        <form className="label" onSubmit={(e) => { e.preventDefault(); void set({ shortcut: shortcut.trim() }); }}>
          Shortcut to ask FAITH from anywhere
          <span className="flex gap-2"><input className="field" value={shortcut} onChange={(e) => setShortcut(e.target.value)} aria-describedby="sc-hint" /><button className="btn-soft">Save</button></span>
          <span id="sc-hint" className="text-[13px] font-normal">Like CommandOrControl+Alt+F. Empty turns it off.</span>
        </form>
        {err && <div role="alert"><ErrorText>{err}</ErrorText></div>}
        <hr className="border-border" />
        <p className="text-[14px] text-muted">Signed in as <strong className="text-foreground">{st.person?.name}</strong> to {st.url}.{" "}
          {st.keyring === "os" ? "This computer's key is kept in its keychain." : "This computer has no keyring, so the key is kept in a file only your account can read."}</p>
        <button className="btn-soft" onClick={async () => { try { setSt(await api.signOut()); } catch (e) { setErr(msg(e)); } }}>Sign out of this computer</button>
        <p className="text-[13px] text-muted">That also removes this computer's key on FAITH. Lost a computer? Remove it on FAITH's admin page (Tokens & screens).</p>
      </div>
    </Sheet>
  );
}
