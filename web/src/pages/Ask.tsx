import { ArrowUp, Check, Copy, Hourglass, ImagePlus, Lock, Mic, Square, Volume2, X } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { api, ApiError, chat, speak, startRecording, type ChatEvent, type Session } from "../api";
import { cn } from "../ui";

type Msg = {
  role: "user" | "assistant"; text: string; tools?: string[]; photo?: string;
  confirm?: { id: string; summary: string; answered?: string }; asked?: string;
};

const FRIENDLY: [RegExp, string][] = [
  [/get_day|list_tasks|calendar/, "Checked the calendar"], [/chores/, "Looked at chores"], [/milestones/, "Looked at life events"],
  [/create_task|update_task/, "Updated a task"], [/^meals$/, "Looked at the meal plan"], [/meal_plan/, "Planned a meal"],
  [/recipes/, "Searched recipes"], [/shopping_list/, "Read the shopping list"], [/shopping_add/, "Added to the shopping list"],
  [/shopping_done/, "Ticked off shopping"], [/home_find|home_state/, "Looked around the house"], [/home_control/, "Controlled a device"],
  [/context_for/, "Remembered who you are"], [/memory_|conversation_log/, "Saved to the wiki"], [/wiki|notes|query/, "Checked the wiki"],
  [/coinpile/, "Checked money"], [/orb_/, "Checked the Orb"], [/hermes/, "Asked Hermes"], [/studio/, "Used Hermes Studio"],
];
const friendly = (t: string) => FRIENDLY.find(([re]) => re.test(t))?.[1] ?? t.replace(/_/g, " ");

/** Just enough markdown for a family assistant: paragraphs, bullet and numbered lists, **bold**. */
function Rich({ text }: { text: string }) {
  const inline = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : <Fragment key={i}>{p}</Fragment>));
  const blocks: ReactNode[] = []; let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => { if (list) { const L = list.ordered ? "ol" : "ul"; blocks.push(<L key={blocks.length} className={cn("my-1 space-y-1 pl-5", list.ordered ? "list-decimal" : "list-disc")}>{list.items.map((x, i) => <li key={i}>{inline(x)}</li>)}</L>); list = null; } };
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd(), b = line.match(/^\s*[-*•]\s+(.*)/), o = line.match(/^\s*\d+[.)]\s+(.*)/);
    if (b || o) { const ordered = !!o; if (!list || list.ordered !== ordered) { flush(); list = { ordered, items: [] }; } list.items.push((b || o)![1]); continue; }
    flush();
    if (line.trim()) blocks.push(<p key={blocks.length}>{inline(line.replace(/^#+\s*/, ""))}</p>);
  }
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

export function Ask({ session, startListening, onListened }: { session: Session; startListening?: boolean; onListened?: () => void }) {
  const [msgs, setMsgs] = useState<Msg[]>([]), [text, setText] = useState(""), [busy, setBusy] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null), [rec, setRec] = useState<{ stop: () => Promise<string> } | null>(null);
  const conv = useRef<string | null>(null), end = useRef<HTMLDivElement>(null), ctl = useRef<AbortController | null>(null), file = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api("/api/chat/latest").then((d) => { conv.current = d.conversation_id; setMsgs(d.messages.map((m: any) => ({ role: m.role, text: m.content }))); }).catch(() => {});
    return () => ctl.current?.abort();
  }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs]);
  useEffect(() => { if (startListening) { mic(); onListened?.(); } }, [startListening]);

  const send = async (spoken?: string) => {
    const t = (spoken ?? text).trim(); if (!t || busy) return;
    const img = photo; let reply = "";
    setText(""); setPhoto(null); setBusy(true);
    setMsgs((m) => [...m, { role: "user", text: t, photo: img ?? undefined }, { role: "assistant", text: "", tools: [] }]);
    const patchLast = (f: (m: Msg) => Msg) => setMsgs((ms) => { const c = [...ms]; c[c.length - 1] = f(c[c.length - 1]); return c; });
    const before = (m: Msg) => setMsgs((ms) => [...ms.slice(0, -1), m, ms[ms.length - 1]]);
    ctl.current = new AbortController();
    try {
      await chat(t, conv.current, (e: ChatEvent) => {
        if (e.type === "conversation") conv.current = e.id;
        else if (e.type === "text") patchLast((m) => ({ ...m, text: m.text + e.delta }));
        else if (e.type === "tool") patchLast((m) => ({ ...m, tools: [...(m.tools || []), e.name] }));
        else if (e.type === "confirm") before({ role: "assistant", text: "", confirm: { id: e.id, summary: e.summary } });
        else if (e.type === "approval") before({ role: "assistant", text: "", asked: e.summary });
        else if (e.type === "done") { reply = e.text; patchLast((m) => ({ ...m, text: e.text })); }
        else if (e.type === "error") patchLast((m) => ({ ...m, text: `Sorry, that didn't work: ${e.message}` }));
      }, ctl.current.signal, img ? [img] : undefined);
      if (reply && (spoken || session.voice.speak_replies)) speak(reply).catch(() => {});
    } catch (e: any) { patchLast((m) => ({ ...m, text: e instanceof ApiError && e.status === 401 ? "You were signed out. Sign in again." : `Sorry, that didn't work: ${e.message}` })); }
    finally { setBusy(false); }
  };

  async function mic() {
    if (rec) {
      setRec(null);
      try { const heard = await rec.stop(); if (heard) send(heard); } catch (e: any) { setMsgs((m) => [...m, { role: "assistant", text: `I couldn't hear that: ${e.message}` }]); }
      return;
    }
    try { setRec(await startRecording()); } catch { setMsgs((m) => [...m, { role: "assistant", text: "The microphone isn't available here. It needs https and permission in the browser." }]); }
  }
  const pick = (f?: File) => {
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1280 / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
      setPhoto(c.toDataURL("image/jpeg", 0.85)); URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(f);
  };
  const answer = async (id: string, approve: boolean) => {
    const set = (answered: string) => setMsgs((ms) => ms.map((m) => (m.confirm?.id === id ? { ...m, confirm: { ...m.confirm, answered } } : m)));
    try { set((await api(`/api/chat/confirm/${id}`, { body: { approve } })).text); } catch (e: any) { set(e.message); }
  };

  const who = session.person?.name;
  const ideas = ["What's on today?", "What's for dinner this week?", "Add milk to the shopping list", "Turn off the kitchen lights"];
  return (
    <div className="mx-auto flex h-full w-full max-w-[860px] flex-col px-4 sm:px-6">
      <div className="flex-1 space-y-5 overflow-y-auto pb-6 pt-6">
        {!msgs.length && (
          <div className="flex flex-col items-center gap-6 pt-[10vh] text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary-soft"><span className="h-7 w-7 rounded-full bg-primary shadow-[0_0_24px_rgb(var(--primary))]" /></div>
            <h1 className="text-[34px] font-semibold leading-tight">How can I help{who ? `, ${who}` : ""}?</h1>
            <div className="flex max-w-lg flex-wrap justify-center gap-2">
              {ideas.map((i) => <button key={i} className="rounded-full border border-border bg-surface px-4 py-2 text-[15px] hover:bg-surface-2" onClick={() => send(i)}>{i}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => m.asked ? (
          <div key={i} className="card flex items-start gap-3 border-dashed p-4">
            <Hourglass size={18} className="mt-0.5 text-primary" />
            <div><div className="font-medium first-letter:uppercase">{m.asked}</div><div className="text-[14px] text-muted">Waiting for a grown-up to approve it on their screen or phone.</div></div>
          </div>
        ) : m.confirm ? (
          <div key={i} className="card flex flex-col gap-3 border-2 border-primary/50 p-4">
            <div className="flex items-start gap-3"><Lock size={18} className="mt-0.5 text-primary" /><div>Do this? <span className="font-semibold">{m.confirm.summary}</span></div></div>
            {m.confirm.answered ? <div className="text-[14px] text-muted">{m.confirm.answered}</div> : (
              <div className="flex gap-2"><button className="btn-primary" onClick={() => answer(m.confirm!.id, true)}><Check size={18} />Yes</button><button className="btn-soft" onClick={() => answer(m.confirm!.id, false)}><X size={18} />No</button></div>
            )}
          </div>
        ) : m.role === "user" ? (
          <div key={i} className="flex flex-col items-end gap-2">
            {m.photo && <img src={m.photo} alt="" className="max-h-56 rounded-2xl border border-border" />}
            <div className="max-w-[85%] rounded-[22px] rounded-br-md bg-primary px-4 py-2.5 text-[17px] text-primary-foreground">{m.text}</div>
          </div>
        ) : (
          <div key={i} className="flex max-w-[92%] flex-col gap-2">
            <div className="rounded-[22px] rounded-bl-md bg-surface-2 px-4 py-3 text-[17px] leading-relaxed">
              {m.text ? <Rich text={m.text} /> : <span className="inline-flex gap-1 py-1">{[0, 1, 2].map((d) => <span key={d} className="h-2 w-2 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${d * 150}ms` }} />)}</span>}
            </div>
            {!!m.tools?.length && (
              <div className="w-fit rounded-2xl border border-border bg-surface px-3 py-2">
                <div className="flex items-center gap-1.5 text-[13px] font-semibold text-muted"><Check size={14} className="text-primary" />{m.tools.length} tool call{m.tools.length > 1 ? "s" : ""}</div>
                <div className="mt-1.5 flex flex-wrap gap-1.5">{[...new Set(m.tools.map(friendly))].map((t) => <span key={t} className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-[13px]"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{t}</span>)}</div>
              </div>
            )}
            {m.text && !(busy && i === msgs.length - 1) && (
              <div className="flex gap-4 pl-1 text-[13px] text-muted">
                <button className="flex items-center gap-1.5 hover:text-foreground" onClick={() => navigator.clipboard?.writeText(m.text)}><Copy size={14} />Copy</button>
                <button className="flex items-center gap-1.5 hover:text-foreground" onClick={() => speak(m.text)}><Volume2 size={14} />Read aloud</button>
              </div>
            )}
          </div>
        ))}
        <div ref={end} />
      </div>

      <div className="pb-28 sm:pb-24">
        {photo && <div className="mb-2 flex items-center gap-2"><img src={photo} alt="" className="h-14 rounded-xl" /><button className="btn-ghost" onClick={() => setPhoto(null)}>Remove photo</button></div>}
        <form className="card flex items-center gap-1 rounded-full p-1.5 pl-2 shadow-lift" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full text-primary hover:bg-surface-2" title="Add a photo" disabled={busy} onClick={() => file.current?.click()}><ImagePlus size={22} /></button>
          <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={(e) => pick(e.target.files?.[0])} />
          <input className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[17px] placeholder:text-muted focus:outline-none" value={text} onChange={(e) => setText(e.target.value)}
            placeholder={rec ? "Listening… tap the square when you're done" : `Ask ${session.name} anything`} enterKeyHint="send" />
          <button type="button" className={cn("grid h-11 w-11 place-items-center rounded-full", rec ? "animate-pulse2 bg-danger text-white" : "text-foreground hover:bg-surface-2")} title={rec ? "Stop and send" : "Talk"} disabled={busy} onClick={mic}>{rec ? <Square size={18} fill="currentColor" /> : <Mic size={22} />}</button>
          {busy ? <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-surface-2" title="Stop" onClick={() => ctl.current?.abort()}><Square size={16} fill="currentColor" /></button>
            : <button type="submit" className="grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground disabled:bg-surface-2 disabled:text-muted" disabled={!text.trim()} title="Send"><ArrowUp size={22} /></button>}
        </form>
      </div>
    </div>
  );
}
