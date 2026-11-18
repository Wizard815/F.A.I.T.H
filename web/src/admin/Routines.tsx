import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api";
import { Badge, PageHead, Panel, when } from "./Shell";

const BLANK = { id: "", name: "", skill: "", prompt: "", days: "weekdays", time: "07:00", run_as: "household", person_id: "", deliver: ["family"] as string[], enabled: true };

export function Routines() {
  const [list, setList] = useState<any[] | null>(null), [skills, setSkills] = useState<any[]>([]), [people, setPeople] = useState<any[]>([]);
  const [edit, setEdit] = useState<typeof BLANK | null>(null), [msg, setMsg] = useState(""), [busy, setBusy] = useState("");
  const load = () => api("/api/admin/routines").then(setList).catch((e) => setMsg(e.message));
  useEffect(() => { load(); api("/api/admin/skills").then((d) => setSkills(d.skills)); api("/api/admin/people").then(setPeople); }, []);
  const save = () => api("/api/admin/routines", { body: { ...edit, id: edit!.id || undefined, skill: edit!.skill || null, person_id: edit!.person_id || null } }).then(() => { setMsg("Saved."); setEdit(null); load(); }).catch((e) => setMsg(e.message));
  const run = (id: string) => { setBusy(id); api(`/api/admin/routines/${id}/run`, { body: {} }).then((r) => setMsg(r.ok ? `Ran: ${r.status}` : r.status)).catch((e) => setMsg(e.message)).finally(() => { setBusy(""); load(); }); };
  const targets = ["family", "parents", ...people.map((p) => p.id)];
  return (<>
    <PageHead title="Routines" sub="A skill (or plain instructions) on a schedule, sent to the family chat, the parents' chat or one person. A routine runs as the household, the parents, or one person, with exactly that view's tools; household changes still need approval." right={<button className="btn-primary" onClick={() => setEdit({ ...BLANK })}>New routine</button>} />
    {msg && <p className="mb-4">{msg}</p>}
    {edit && (
      <Panel title={edit.id ? "Edit routine" : "New routine"}>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-[14px] text-muted sm:col-span-3">Name<input className="field" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} placeholder="Morning brief" /></label>
          <label className="flex flex-col gap-1 text-[14px] text-muted">Skill<select className="field" value={edit.skill} onChange={(e) => setEdit({ ...edit, skill: e.target.value })}><option value="">(none: use the instructions)</option>{skills.map((s) => <option key={s.name} value={s.name}>{s.title}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-[14px] text-muted">Days<select className="field" value={edit.days} onChange={(e) => setEdit({ ...edit, days: e.target.value })}>{["daily", "weekdays", "weekends", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon,wed,fri", "sun,wed"].map((d) => <option key={d}>{d}</option>)}</select></label>
          <label className="flex flex-col gap-1 text-[14px] text-muted">Time<input className="field" type="time" value={edit.time} onChange={(e) => setEdit({ ...edit, time: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-[14px] text-muted">Runs as<select className="field" value={edit.run_as} onChange={(e) => setEdit({ ...edit, run_as: e.target.value, deliver: e.target.value === "person" ? [edit.person_id || people[0]?.id] : edit.deliver })}><option value="household">the household (shared things)</option><option value="parents">the parents</option><option value="person">one person (their private things too)</option></select></label>
          {edit.run_as === "person" && <label className="flex flex-col gap-1 text-[14px] text-muted">Whose<select className="field" value={edit.person_id} onChange={(e) => setEdit({ ...edit, person_id: e.target.value, deliver: [e.target.value] })}><option value="">…</option>{people.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}
          <div className="flex flex-col gap-1 text-[14px] text-muted">Send to<div className="flex flex-wrap gap-2 pt-2">{targets.map((t) => <label key={t} className="flex items-center gap-1 text-foreground"><input type="checkbox" disabled={edit.run_as === "person"} checked={edit.deliver.includes(t)} onChange={(e) => setEdit({ ...edit, deliver: e.target.checked ? [...edit.deliver, t] : edit.deliver.filter((x) => x !== t) })} />{t}</label>)}</div></div>
          <label className="flex flex-col gap-1 text-[14px] text-muted sm:col-span-3">Extra instructions (optional with a skill)<textarea className="field min-h-[90px] py-2" value={edit.prompt} onChange={(e) => setEdit({ ...edit, prompt: e.target.value })} placeholder="Keep it to 5 lines. Mention the weather." /></label>
        </div>
        <div className="mt-3 flex items-center gap-3"><label className="flex items-center gap-2"><input type="checkbox" checked={edit.enabled} onChange={(e) => setEdit({ ...edit, enabled: e.target.checked })} />On</label><button className="btn-primary" onClick={save}>Save</button><button className="btn-ghost" onClick={() => setEdit(null)}>Cancel</button></div>
      </Panel>
    )}
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      {list?.length === 0 && <p className="text-muted">No routines yet. A good first one: the morning brief, weekdays at 07:00, to the family chat.</p>}
      {list?.map((r) => (
        <Panel key={r.id}>
          <div className="mb-1 flex items-center gap-2"><h2 className="text-[18px] font-semibold">{r.name}</h2><Badge ok={r.enabled ? (r.last_status?.startsWith("failed") ? false : true) : null}>{r.enabled ? "on" : "off"}</Badge></div>
          <p className="text-[15px] text-muted">{r.days} at {r.time} · as {r.run_as === "person" ? r.person_id : r.run_as} · to {r.deliver.join(", ")}{r.skill ? ` · skill ${r.skill}` : ""}</p>
          <p className="mt-2 text-[14px]">Last run: {when(r.last_at)}{r.last_status ? ` · ${r.last_status}` : ""}</p>
          {r.last_text && <p className="mt-2 max-h-28 overflow-auto whitespace-pre-wrap rounded-input bg-surface-2 p-3 text-[14px]">{r.last_text}</p>}
          <div className="mt-3 flex gap-2">
            <button className="btn-soft" disabled={busy === r.id} onClick={() => run(r.id)}><Play size={16} />{busy === r.id ? "Running…" : "Run now"}</button>
            <button className="btn-soft" onClick={() => setEdit({ ...BLANK, ...r, skill: r.skill || "", person_id: r.person_id || "" })}>Edit</button>
            <button className="btn-ghost" onClick={() => api(`/api/admin/routines/${r.id}`, { method: "DELETE" }).then(load)}>Delete</button>
          </div>
        </Panel>))}
    </div>
  </>);
}
