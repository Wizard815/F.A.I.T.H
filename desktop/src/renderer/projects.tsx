import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, CheckCircle2, ChevronRight, CircleAlert, EyeOff, FolderKanban, Loader2, NotebookPen, Plus, RotateCcw, Send, Trash2, X } from "lucide-react";
import { Empty, ErrorText, cn } from "@web/ui";
import type { FamilyProject, ProjectChange, ProjectThread, ThreadStatus, ThreadView } from "../faith";
import { api, msg, Rich } from "./talk";

/** Family projects (docs/projects.md): your own, Family, and Parents for grown-ups.
 *  FAITH works on a thread in the background and tells you when it's done. */

export const STATUS_WORDS: Record<ThreadStatus, string> = { working: "Working", waiting: "Waiting for approval", failed: "Didn't work", done: "Done" };
/** Mine, Family, Parents: what people call them. */
export const projectLabel = (p: FamilyProject) => (p.owner.startsWith("person:") ? "Mine" : p.name);

/** What the voice layouts say about projects: what needs you, what's working, and the one to mention. */
export function projectGlance(list: FamilyProject[] | null) {
  if (!list) return null;
  const all = list.flatMap((p) => p.threads.filter((t) => !t.resolved).map((t) => ({ ...t, project: projectLabel(p) })));
  const needs = all.filter((t) => t.status === "waiting" || t.status === "failed");
  const working = all.filter((t) => t.status === "working");
  const done = all.filter((t) => t.status === "done");
  const top = needs[0] ?? working[0] ?? done[0];
  return { needs: needs.length, working: working.length, done: done.length, top: top ? { title: top.title, project: top.project, status: top.status } : null };
}

/** Threads the way Hermes Studio's projects group them: what needs you first, put-away ones last. */
export type ThreadGroup = { key: "needs" | "working" | "done" | "away"; label: string; threads: ProjectThread[] };
export function threadGroups(threads: ProjectThread[]): ThreadGroup[] {
  const newest = [...threads].sort((a, b) => b.updated_at - a.updated_at);
  const groups: ThreadGroup[] = [
    { key: "needs", label: "Needs you", threads: newest.filter((t) => !t.resolved && (t.status === "waiting" || t.status === "failed")) },
    { key: "working", label: "Working", threads: newest.filter((t) => !t.resolved && t.status === "working") },
    { key: "done", label: "Done", threads: newest.filter((t) => !t.resolved && t.status === "done") },
    { key: "away", label: "Put away", threads: newest.filter((t) => t.resolved) },
  ];
  return groups.filter((g) => g.threads.length);
}

/** "just now", "5 min ago", "3 h ago", "yesterday", "4 days ago". */
export function ago(at: number, now = Date.now()) {
  const m = Math.max(0, Math.round((now - at) / 60_000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

/** A thread's last words as a one-line preview: Markdown marks taken out. */
export const preview = (t: string) => t.replace(/\*\*([^*]+)\*\*/g, "$1").replace(/^\s*(?:[-*•]|\d+\.)\s+/gm, "").replace(/\s+/g, " ").trim();

/** A narrow window (or a phone-sized one) shows the list or one thread, not both. */
function useNarrow() {
  const [n, setN] = useState(() => matchMedia("(max-width: 719px)").matches);
  useEffect(() => { const q = matchMedia("(max-width: 719px)"), f = () => setN(q.matches); q.addEventListener("change", f); return () => q.removeEventListener("change", f); }, []);
  return n;
}

/** Projects, refreshed every 10 seconds while something is working (every minute otherwise). */
export function useProjects(withPutAway = false) {
  const [list, setList] = useState<FamilyProject[] | null>(null), [err, setErr] = useState("");
  const load = useCallback(() => api.projects(withPutAway).then((d) => { setList(d.projects); setErr(""); }).catch((e) => setErr(msg(e))), [withPutAway]);
  const busy = !!list?.some((p) => p.threads.some((t) => t.status === "working"));
  useEffect(() => { void load(); const i = setInterval(load, busy ? 10_000 : 60_000); return () => clearInterval(i); }, [load, busy]);
  return { list, err, load };
}

/** Marks a throwaway thread, in words. */
export const ThrowawayBadge = () => <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[12px] font-medium text-muted"><EyeOff size={13} />Throwaway</span>;

export function StatusBadge({ s }: { s: ThreadStatus }) {
  const icon = s === "working" ? <Loader2 size={13} className="animate-spin" /> : s === "done" ? <CheckCircle2 size={13} /> : <CircleAlert size={13} />;
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium", s === "done" ? "bg-surface-2 text-muted" : s === "working" ? "bg-primary-soft" : "bg-danger/15 text-danger")}>{icon}{STATUS_WORDS[s]}</span>;
}

/** A Yes or an approval a change is waiting for. */
function Held({ change, onDone }: { change: ProjectChange; onDone: (said: string) => void }) {
  const [said, setSaid] = useState("");
  if (change.requests?.length) return <p className="rounded-input bg-primary-soft px-3 py-2 text-[14px]" role="status">Sent to a grown-up for approval: {change.requests[0].summary}</p>;
  const p = change.pending?.[0];
  if (!p) return null;
  const answer = async (yes: boolean) => {
    try { const r = await api.confirm(p.id, yes); setSaid(r.text); onDone(r.text); } catch (e) { setSaid(msg(e)); }
  };
  return (
    <div className="card p-4" role="group" aria-label="Waiting for your Yes">
      <p className="text-[13px] text-muted">{said ? "Answered" : "Waiting for your Yes"}</p>
      <p className="font-semibold">{p.summary}</p>
      {said ? <p className="mt-1 text-[14px]">{said}</p> : (
        <div className="mt-3 flex gap-2">
          <button className="btn-primary flex-1" onClick={() => void answer(true)}><Check size={16} />Yes</button>
          <button className="btn-soft flex-1" onClick={() => void answer(false)}><X size={16} />No</button>
        </div>
      )}
    </div>
  );
}

function NewThread({ projects, onStarted }: { projects: FamilyProject[]; onStarted: (c: ProjectChange, project: string) => void }) {
  const [project, setProject] = useState(projects[0]?.id ?? ""), [title, setTitle] = useState(""), [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false), [err, setErr] = useState(""), [throwaway, setThrowaway] = useState(false);
  const shared = projects.find((p) => p.id === project && !p.owner.startsWith("person:"));
  const away = throwaway && !shared;
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    try { onStarted(await api.startThread(project, brief, title || undefined, away), project); setTitle(""); setBrief(""); setThrowaway(false); } catch (x) { setErr(msg(x)); } finally { setBusy(false); }
  };
  return (
    <form className="card flex flex-col gap-3 p-4" onSubmit={go} aria-label="Start a thread">
      <p className="font-serif text-[18px] font-semibold">Start a thread</p>
      <label className="label">Project
        <select className="field" aria-label="Project" value={project} onChange={(e) => setProject(e.target.value)}>
          {projects.map((p) => <option key={p.id} value={p.id}>{projectLabel(p)}</option>)}
        </select>
      </label>
      <label className="label">Title <span className="font-normal text-muted">(optional)</span>
        <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Saturday plans" maxLength={80} />
      </label>
      <label className="label">What should FAITH do?
        <textarea className="field min-h-[88px] py-2.5" value={brief} onChange={(e) => setBrief(e.target.value)} required maxLength={4000}
          placeholder="Find three dinners everyone will eat this week, using what's in the pantry." />
      </label>
      {shared ? <p className="text-[13px] text-muted">Everyone who can see {shared.name} will read this. You'll be asked to say Yes first.</p> : (
        <label className="flex min-h-[44px] cursor-pointer items-start gap-3 text-[14px]">
          <input type="checkbox" className="mt-1 h-5 w-5 accent-[rgb(var(--primary))]" checked={throwaway} onChange={(e) => setThrowaway(e.target.checked)} />
          <span><span className="font-semibold">Throwaway</span>
            <span className="block text-[13px] text-muted">Keeps nothing. It only looks things up, nobody is told what it said, and it's deleted when you put it away or after a day.</span></span>
        </label>
      )}
      {err && <ErrorText>{err}</ErrorText>}
      <button className="btn-primary self-start" disabled={busy || !brief.trim()}><Plus size={16} />{busy ? "Starting…" : "Start"}</button>
    </form>
  );
}

function ThreadPane({ project, thread, onChanged }: { project: string; thread: ProjectThread; onChanged: () => void }) {
  const [v, setV] = useState<ThreadView | null>(null), [err, setErr] = useState("");
  const [text, setText] = useState(""), [change, setChange] = useState<ProjectChange | null>(null);
  const load = useCallback(() => api.projectThread(project, thread.id).then((d) => { setV(d); setErr(""); }).catch((e) => setErr(msg(e))), [project, thread.id]);
  useEffect(() => { void load(); }, [load, thread.updated_at]);
  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    try { const c = await api.messageThread(project, thread.id, text); setText(""); setChange(c); onChanged(); } catch (x) { setErr(msg(x)); }
  };
  const resolve = async () => { try { await api.resolveThread(project, thread.id, !thread.resolved); onChanged(); } catch (x) { setErr(msg(x)); } };
  const away = !!thread.throwaway;
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-3" aria-label={`Thread: ${thread.title}`}>
      <header className="flex flex-wrap items-center gap-2">
        <h2 className="font-serif text-[20px] font-semibold">{thread.title}</h2>
        <StatusBadge s={thread.status} />
        {away && <ThrowawayBadge />}
        <button className="btn-ghost ml-auto min-h-[44px] text-[13px]" onClick={() => void resolve()} disabled={away && thread.status === "working"}>
          {away ? <><Trash2 size={14} />Delete</> : thread.resolved ? <><RotateCcw size={14} />Bring back</> : <><Check size={14} />Put away</>}</button>
      </header>
      {away && <p className="text-[13px] text-muted">A throwaway thread: it only looks things up and keeps nothing. Delete it when you're done, or it goes by itself after a day.</p>}
      {err && <ErrorText>{err}</ErrorText>}
      <ol className="flex flex-col gap-3 overflow-auto" aria-live="polite">
        {v?.messages.map((m, i) => (
          <li key={i} className={cn("rounded-card px-4 py-3 text-[15px] leading-relaxed", m.role === "user" ? "bg-surface-2" : "border border-border bg-surface")}>
            <span className="mb-1 block text-[12px] font-medium text-muted">{m.role === "user" ? (i === 0 ? "The job" : "Asked") : "FAITH"}</span>
            {m.role === "user" ? <p className="whitespace-pre-wrap">{i === 0 ? thread.brief : m.text}</p> : <Rich text={m.text} />}
          </li>
        ))}
        {thread.status === "working" && <li className="inline-flex items-center gap-2 text-muted"><Loader2 size={16} className="animate-spin" />FAITH is working on it…</li>}
        {v && !v.messages.length && thread.status !== "working" && <Empty>{thread.last_text || "Nothing here yet."}</Empty>}
      </ol>
      {change && <Held change={change} onDone={onChanged} />}
      <form className="mt-auto flex gap-2" onSubmit={send}>
        <input className="field flex-1" value={text} onChange={(e) => setText(e.target.value)} aria-label="Tell this thread what to do next"
          placeholder={thread.status === "working" ? "Wait for it to finish…" : "What next?"} disabled={thread.status === "working"} />
        <button className="icon-btn border-primary bg-primary text-primary-foreground hover:bg-primary-hover" aria-label="Send to the thread" disabled={!text.trim() || thread.status === "working"}><Send size={17} /></button>
      </form>
    </section>
  );
}

/** What every thread in a project should know: Studio's Context tab, for a family. */
function Instructions({ p, onSaved, close }: { p: FamilyProject; onSaved: () => void; close: () => void }) {
  const [text, setText] = useState(p.instructions ?? ""), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr("");
    try { await api.setProjectInstructions(p.id, text); onSaved(); close(); } catch (x) { setErr(msg(x)); } finally { setBusy(false); }
  };
  return (
    <form className="card mb-2 flex flex-col gap-2 p-3" onSubmit={save} aria-label={`Instructions for ${projectLabel(p)}`}>
      <label className="label">What every thread here should know
        <textarea className="field min-h-[88px] py-2 text-[14px]" value={text} onChange={(e) => setText(e.target.value)} maxLength={2000}
          placeholder={p.owner.startsWith("person:") ? "I'm vegetarian. Keep plans under $50." : "Robin doesn't eat mushrooms. Saturdays start at 9."} />
      </label>
      <span className="text-[12px] text-muted">{text.length} / 2000{p.owner.startsWith("person:") ? "" : `. Everyone who can see ${p.name} reads these.`}</span>
      {err && <ErrorText>{err}</ErrorText>}
      <div className="flex gap-2">
        <button className="btn-primary min-h-[44px]" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        <button type="button" className="btn-ghost min-h-[44px]" onClick={close}>Cancel</button>
      </div>
    </form>
  );
}

function ThreadRow({ t, open, onOpen }: { t: ProjectThread; open: boolean; onOpen: () => void }) {
  return (
    <li>
      <button className={cn("card w-full p-3 text-left hover:bg-surface-2", open && "border-primary", t.resolved && "opacity-80")} aria-current={open ? "true" : undefined} onClick={onOpen}>
        <span className="flex items-center gap-2"><span className="min-w-0 flex-1 truncate font-semibold">{t.title}</span>{t.throwaway && <EyeOff size={14} className="text-muted" aria-label="Throwaway" />}<StatusBadge s={t.status} /></span>
        {t.last_text && <span className="mt-1 line-clamp-2 block text-[13px] text-muted">{preview(t.last_text)}</span>}
        <span className="mt-1 block text-[12px] text-muted">{ago(t.updated_at)}</span>
      </button>
    </li>
  );
}

/** One project in the list: its threads grouped as Needs you, Working, Done, and Put away (folded). */
function ProjectSection({ p, open, onOpen, onSaved }: { p: FamilyProject; open?: string; onOpen: (thread: string) => void; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const groups = threadGroups(p.threads), needs = groups.find((g) => g.key === "needs")?.threads.length ?? 0;
  return (
    <section aria-label={projectLabel(p)}>
      <h2 className="mb-1.5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-muted">
        <FolderKanban size={14} />{projectLabel(p)}
        {needs > 0 && <span className="rounded-full bg-danger/15 px-2 py-0.5 text-[11px] normal-case tracking-normal text-danger">{needs} need{needs === 1 ? "s" : ""} you</span>}
        <button className="icon-btn ml-auto h-11 w-11 border-transparent" aria-label={`Instructions for ${projectLabel(p)}`} aria-expanded={editing} onClick={() => setEditing(!editing)}><NotebookPen size={15} /></button>
      </h2>
      {editing && <Instructions p={p} onSaved={onSaved} close={() => setEditing(false)} />}
      {!editing && p.instructions && <p className="mb-2 line-clamp-2 text-[12px] text-muted">Every thread knows: {p.instructions}</p>}
      {!groups.length && <Empty>No threads yet.</Empty>}
      {groups.map((g) => g.key === "away" ? (
        <details key={g.key} className="group mt-2">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-1 text-[13px] font-medium text-muted"><ChevronRight size={14} className="transition-transform group-open:rotate-90" />{g.label} · {g.threads.length}</summary>
          <ul className="flex flex-col gap-1.5">{g.threads.map((t) => <ThreadRow key={t.id} t={t} open={open === t.id} onOpen={() => onOpen(t.id)} />)}</ul>
        </details>
      ) : (
        <div key={g.key} className="mt-2">
          <h3 className="mb-1 text-[13px] font-medium text-muted">{g.label} · {g.threads.length}</h3>
          <ul className="flex flex-col gap-1.5">{g.threads.map((t) => <ThreadRow key={t.id} t={t} open={open === t.id} onOpen={() => onOpen(t.id)} />)}</ul>
        </div>
      ))}
    </section>
  );
}

/** Voice dashboard's Projects tab: projects on the left, the open thread on the right. */
export function Projects() {
  const { list, err, load } = useProjects(true);
  const [open, setOpen] = useState<{ project: string; thread: string } | null>(null);
  const [starting, setStarting] = useState(false), [change, setChange] = useState<ProjectChange | null>(null);
  const openThread = list?.find((p) => p.id === open?.project)?.threads.find((t) => t.id === open?.thread);
  const narrow = useNarrow(), detail = !!(openThread || starting || change);
  const back = () => { setOpen(null); setStarting(false); setChange(null); };
  return (
    <div className="flex h-full gap-4 overflow-hidden p-4">
      <nav className={cn("flex shrink-0 flex-col gap-4 overflow-auto", narrow ? "w-full" : "w-[300px]", narrow && detail && "hidden")} aria-label="Projects">
        <button className="btn-primary" onClick={() => { setStarting(true); setOpen(null); }}><Plus size={16} />Start a thread</button>
        {err && <ErrorText>{err}</ErrorText>}
        {!list && !err && <p className="text-muted">Loading…</p>}
        {list?.map((p) => <ProjectSection key={p.id} p={p} open={open?.thread} onOpen={(t) => { setOpen({ project: p.id, thread: t }); setStarting(false); }} onSaved={() => void load()} />)}
      </nav>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-3 overflow-auto", narrow && !detail && "hidden")}>
        {narrow && <button className="btn-ghost -ml-2 min-h-[44px] self-start text-[14px]" onClick={back}><ArrowLeft size={16} />All projects</button>}
        {change && <Held change={change} onDone={() => { void load(); }} />}
        {starting && list && <NewThread projects={list} onStarted={(c, project) => { setChange(c.pending?.length || c.requests?.length ? c : null); setStarting(false); void load().then(() => c.thread && setOpen({ project, thread: c.thread })); }} />}
        {openThread && <ThreadPane project={open!.project} thread={openThread} onChanged={() => void load()} />}
        {!starting && !openThread && !change && (
          <div className="m-auto max-w-sm text-center text-muted">
            <p className="font-serif text-[22px] text-foreground">Background jobs for FAITH</p>
            <p className="mt-2 text-[14px]">Start a thread and FAITH works on it while you do other things. It tells you when it's done. Only you see your own project; Family is for everyone.</p>
          </div>
        )}
      </div>
    </div>
  );
}
