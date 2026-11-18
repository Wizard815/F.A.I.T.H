import { useEffect, useState } from "react";
import { api } from "../api";
import { Badge, PageHead, Panel, Table, Td } from "./Shell";

export function Overview() {
  const [d, setD] = useState<any>(null), [err, setErr] = useState("");
  const load = () => api("/api/admin/overview").then(setD).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);
  if (err) return <p className="text-danger">{err}</p>;
  if (!d) return <p className="text-muted">Checking every source…</p>;
  return (<>
    <PageHead title="Overview" sub="Is everything connected? Each view (nobody signed in, and each person) is checked with its own tokens." right={<button className="btn-soft" onClick={() => { setD(null); load(); }}>Check again</button>} />
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[["People", d.people], ["Waiting for approval", d.pending_approvals], ["Routines", d.routines], ["Money rewards owed", d.payouts_owed]].map(([k, v]) => (
        <div key={k} className="card px-5 py-4"><div className="eyebrow">{k}</div><div className="mt-1 font-serif text-[36px] font-semibold leading-none">{v}</div></div>))}
    </div>
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="The engine (Argos)"><div className="flex items-center gap-3"><Badge ok={d.model.ok}>{d.model.ok ? "answering" : `not answering${d.model.error ? `: ${d.model.error}` : ""}`}</Badge><span className="text-muted">{d.model.model} · {d.model.url}</span></div></Panel>
      <Panel title="Mattermost">{d.mattermost ? <div className="flex items-center gap-3"><Badge ok={d.mattermost.ready}>{d.mattermost.ready ? "chats ready" : "not connected yet"}</Badge><span className="text-muted">{d.mattermost.url}</span></div> : <p className="text-muted">Not set up (mattermost: in faith.yaml).</p>}</Panel>
      <Panel title="Voice ID">{d.voice_id ? <div className="flex items-center gap-3"><Badge ok={d.voice_id.ok}>{d.voice_id.ok ? "answering" : "not answering"}</Badge><span className="text-muted">{d.voice_id.url}</span></div> : <p className="text-muted">Not set up (voice_id: in faith.yaml).</p>}</Panel>
      <Panel title="Skills"><div className="flex items-center gap-3"><Badge ok={!d.skills.problems.length}>{d.skills.count} skills</Badge>{d.skills.problems.map((p: string) => <span key={p} className="text-[14px] text-danger">{p}</span>)}</div></Panel>
    </div>
    <div className="mt-5"><Panel title="Sources per view">
      <Table head={["View", "Sources", "Tools", "Problems"]}>
        {d.sources.map((s: any) => (<tr key={s.view}><Td className="font-medium">{s.view}</Td><Td>{s.sources.join(", ") || <span className="text-muted">none</span>}</Td><Td>{s.tools} ({s.writes} change things)</Td><Td>{s.problems.length ? <span className="text-danger">{s.problems.join("; ")}</span> : <Badge ok>fine</Badge>}</Td></tr>))}
      </Table>
    </Panel></div>
  </>);
}
