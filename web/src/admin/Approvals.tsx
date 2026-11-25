import { useEffect, useState } from "react";
import { api } from "../api";
import { Badge, PageHead, Panel, Table, Td, when } from "./Shell";

export function Approvals() {
  const [reqs, setReqs] = useState<any[]>([]), [log, setLog] = useState<any[]>([]), [msg, setMsg] = useState("");
  const load = () => { api("/api/approvals").then((d) => setReqs(d.requests)); api("/api/admin/audit").then(setLog); };
  useEffect(() => { load(); }, []);
  const decide = (id: string, approve: boolean) => api(`/api/approvals/${id}`, { body: { approve } }).then((r) => { setMsg(r.text); load(); }).catch((e) => setMsg(e.message));
  return (<>
    <PageHead title="Approvals & log" sub="Changes asked for from the shared view and by children, and everything FAITH changed. As the admin you can overrule a denial." />
    {msg && <p className="mb-4">{msg}</p>}
    <Panel title="Requests">
      <Table head={["Asked", "What", "By", "Status", ""]}>{reqs.map((r) => (
        <tr key={r.id}><Td>{when(r.requested_at)}</Td><Td>{r.summary}</Td><Td>{r.requested_by}</Td>
          <Td><Badge ok={r.status === "approved" ? true : r.status === "pending" ? null : false}>{r.status}{r.decided_by ? ` by ${r.decided_by}` : ""}{r.overruled ? " (overruled)" : ""}</Badge></Td>
          <Td>{r.status === "pending" ? <div className="flex gap-2"><button className="btn-primary" onClick={() => decide(r.id, true)}>Approve</button><button className="btn-soft" onClick={() => decide(r.id, false)}>Deny</button></div>
            : r.status === "denied" ? <button className="btn-soft" onClick={() => decide(r.id, true)}>Overrule</button> : null}</Td></tr>))}</Table>
      {!reqs.length && <p className="text-muted">Nothing asked in the last day.</p>}
    </Panel>
    <div className="mt-5"><Panel title="What FAITH changed">
      <Table head={["When", "Who", "Where", "What", ""]}>{log.map((a) => <tr key={a.id}><Td>{when(a.at)}</Td><Td>{a.who}</Td><Td>{a.channel}</Td><Td><span className="font-medium">{a.tool}</span> <span className="text-[13px] text-muted">{a.summary.slice(0, 140)}</span></Td><Td><Badge ok={!!a.ok}>{a.ok ? "ok" : "failed"}</Badge></Td></tr>)}</Table>
    </Panel></div>
  </>);
}
