import { useEffect, useState } from "react";
import { api } from "../api";
import { roleLabel } from "../roles";
import { Badge, PageHead, Panel } from "./Shell";

const BLANK = { name: "", title: "", description: "", who: [] as string[], body: "" };
const ROLES = ["admin", "parent", "kid-pro", "kid-lite", "household", "parents"];

export function Skills() {
  const [d, setD] = useState<{ skills: any[]; problems: string[] } | null>(null), [edit, setEdit] = useState<typeof BLANK | null>(null), [msg, setMsg] = useState("");
  const load = () => api("/api/admin/skills").then(setD).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);
  const save = () => api(`/api/admin/skills/${edit!.name}`, { method: "PUT", body: edit }).then(() => { setMsg(`Saved ${edit!.name}.`); setEdit(null); load(); }).catch((e) => setMsg(e.message));
  return (<>
    <PageHead title="Skills" sub="Recipes for bigger family jobs. FAITH sees each skill's description and loads the steps when one fits. Your own skills override FAITH's built-in ones with the same name." right={<button className="btn-primary" onClick={() => setEdit({ ...BLANK })}>New skill</button>} />
    {msg && <p className="mb-4">{msg}</p>}
    {d?.problems.map((p) => <p key={p} className="mb-2 text-danger">{p}</p>)}
    {edit && (
      <Panel title={edit.name ? `Skill: ${edit.name}` : "New skill"}>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-[14px] text-muted">Name (lowercase-with-dashes)<input className="field" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-[14px] text-muted">Title<input className="field" value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></label>
          <label className="flex flex-col gap-1 text-[14px] text-muted sm:col-span-2">When to use it (one line FAITH reads)<input className="field" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[14px] text-muted">Who may use it (none ticked = everyone):
          {ROLES.map((r) => <label key={r} className="flex items-center gap-1"><input type="checkbox" checked={edit.who.includes(r)} onChange={(e) => setEdit({ ...edit, who: e.target.checked ? [...edit.who, r] : edit.who.filter((x) => x !== r) })} />{roleLabel(r)}</label>)}</div>
        <textarea className="field mt-3 min-h-[240px] py-3 font-mono text-[14px]" value={edit.body} onChange={(e) => setEdit({ ...edit, body: e.target.value })} placeholder={"1. First, ...\n2. Then, ...\nKeep it short."} />
        <div className="mt-3 flex gap-2"><button className="btn-primary" onClick={save}>Save</button><button className="btn-ghost" onClick={() => setEdit(null)}>Cancel</button></div>
      </Panel>
    )}
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      {d?.skills.map((s) => (
        <Panel key={s.name}>
          <div className="mb-1 flex items-center gap-2"><h2 className="text-[18px] font-semibold">{s.title}</h2><Badge ok={null}>{s.builtin ? "built-in" : "yours"}</Badge></div>
          <p className="text-[15px] text-muted">{s.description}</p>
          <p className="mt-2 text-[13px] text-muted">{s.name}{s.who ? ` · for ${s.who.join(", ")}` : " · for everyone"}</p>
          <div className="mt-3 flex gap-2">
            <button className="btn-soft" onClick={() => setEdit({ name: s.name, title: s.title, description: s.description, who: s.who || [], body: s.body })}>{s.builtin ? "Copy and edit" : "Edit"}</button>
            {!s.builtin && <button className="btn-ghost" onClick={() => api(`/api/admin/skills/${s.name}`, { method: "DELETE" }).then(load).catch((e) => setMsg(e.message))}>Delete</button>}
          </div>
        </Panel>))}
    </div>
  </>);
}
