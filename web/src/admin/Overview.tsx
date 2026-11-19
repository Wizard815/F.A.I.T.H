import { useEffect, useState } from "react";
import { api } from "../api";
import { Badge, PageHead, Panel, Table, Td, when } from "./Shell";

const ago = (ms: number) => { const m = Math.round((Date.now() - ms) / 60000); return m < 1 ? "just now" : m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} d`; };

/** The integrations watch: checked on a schedule; the parents are told when one goes down. */
function Watch() {
  const [h, setH] = useState<any>(null), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const load = (fresh = false) => { setBusy(fresh); (fresh ? api("/api/admin/health/check", { body: {} }) : api("/api/admin/health")).then(setH).catch((e) => setErr(e.message)).finally(() => setBusy(false)); };
  useEffect(() => { load(); const i = setInterval(() => load(), 30_000); return () => clearInterval(i); }, []);
  if (err) return <p className="text-danger">{err}</p>;
  if (!h) return null;
  const sources = [...h.sources].sort((a: any, b: any) => (a.ok === b.ok ? a.label.localeCompare(b.label) : a.ok === false ? -1 : b.ok === false ? 1 : 0));
  return (
    <Panel title="Integrations watch" right={<button className="btn-soft min-h-[36px]" disabled={busy} onClick={() => load(true)}>{busy ? "Checking…" : "Check now"}</button>}>
      <p className="mb-3 text-[14px] text-muted">{h.interval_s > 0 ? `Checked every ${Math.round(h.interval_s / 60) || 1} min. When one stops answering twice in a row, the parents get one message, and another when it's back.` : "Off (health.interval_s: 0)."}</p>
      {!sources.length ? <p className="text-muted">Not checked yet. Press Check now.</p> : (
        <ul>{sources.map((s: any) => (
          <li key={s.id} className="flex flex-wrap items-center gap-3 border-b border-border py-2 last:border-0">
            <span className="min-w-[9rem] flex-1 font-medium capitalize">{s.label}</span>
            <Badge ok={s.ok}>{s.ok === null ? "not set up for any view" : s.ok ? `up for ${ago(s.since)}` : `down for ${ago(s.since)}`}</Badge>
            {s.ok === false && s.error && <span className="basis-full text-[14px] text-danger">{s.error}</span>}
          </li>))}</ul>)}
      {h.events.length > 0 && <details className="mt-3 text-[14px]"><summary className="cursor-pointer text-muted">Recent changes ({h.events.length})</summary>
        <ul className="mt-2">{h.events.slice(0, 15).map((e: any, i: number) => <li key={i} className="py-0.5">{when(e.at)} · <span className="capitalize">{e.label}</span> {e.ok ? "came back" : `went down${e.error ? ` (${e.error})` : ""}`}</li>)}</ul></details>}
    </Panel>
  );
}

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
    <div className="mt-5"><Watch /></div>
    <div className="mt-5"><Panel title="Sources per view">
      <Table head={["View", "Sources", "Tools", "Problems"]}>
        {d.sources.map((s: any) => (<tr key={s.view}><Td className="font-medium">{s.view}</Td><Td>{s.sources.join(", ") || <span className="text-muted">none</span>}</Td><Td>{s.tools} ({s.writes} change things)</Td><Td>{s.problems.length ? <span className="text-danger">{s.problems.join("; ")}</span> : <Badge ok>fine</Badge>}</Td></tr>))}
      </Table>
    </Panel></div>
  </>);
}
