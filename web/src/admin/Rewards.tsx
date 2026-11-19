import { useEffect, useState } from "react";
import { api } from "../api";
import { Badge, PageHead, Panel, Table, Td, when } from "./Shell";

export function Rewards() {
  const [d, setD] = useState<any>(null), [msg, setMsg] = useState("");
  const load = () => api("/api/admin/rewards").then(setD).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);
  const go = (p: Promise<unknown>, ok: string) => p.then(() => { setMsg(ok); load(); }).catch((e) => setMsg(e.message));
  if (!d) return <p className="text-muted">{msg || "Loading…"}</p>;
  const kids = d.balances.filter((b: any) => b.role === "child");
  return (<>
    <PageHead title="Points & rewards" sub={`Children earn ${d.allowed_points.join(", ")} points for jobs and spend them on rewards. They claim and ask; a parent approves (on the dashboard, a phone notification, or the parents' chat).`} />
    {msg && <p className="mb-4">{msg}</p>}
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Balances">
        {!kids.length && <p className="text-muted">No children in faith.yaml yet.</p>}
        <ul>{kids.map((k: any) => (
          <li key={k.person} className="flex flex-wrap items-center gap-3 border-b border-border py-3 last:border-0">
            <span className="flex-1 font-medium">{k.name}{d.cards?.[k.person] && <span className="ml-2 text-[14px] font-normal text-muted">card {Number(d.cards[k.person].amount).toFixed(2)} {d.cards[k.person].currency}</span>}</span><span className="font-serif text-[26px] font-semibold">{k.points}</span>
            <div className="flex gap-1">{d.allowed_points.map((n: number) => <button key={n} className="btn-soft min-h-[36px] px-3" onClick={() => go(api("/api/admin/rewards/award", { body: { person: k.person, points: n, reason: "From the admin page" } }), `Gave ${k.name} ${n}.`)}>+{n}</button>)}</div>
          </li>))}</ul>
      </Panel>
      <Panel title="Money rewards" right={<Badge ok={null}>payout: {d.payout_provider}</Badge>}>
        <p className="mb-3 text-[14px] text-muted">{d.payout_provider === "manual" ? "Money rewards are recorded as owed: pay them yourself, then tick them off. To record them on a kid's card in Firefly III, set rewards.payout: firefly." : "Approved money rewards are recorded in Firefly III as a transfer from your account to the kid's card account (tagged faith). If one fails, fix the cause and retry it."}</p>
        {!d.payouts.length ? <p className="text-muted">Nothing owed.</p> : <ul>{d.payouts.map((p: any) => (
          <li key={p.id} className="flex items-center gap-3 border-b border-border py-2 last:border-0"><span className="flex-1">{p.person_id}: {d.currency}{p.amount} for {p.reason}{p.note && <span className="block text-[13px] text-muted">{p.note}</span>}</span><Badge ok={p.status === "paid" ? true : p.status === "failed" ? false : null}>{p.status}</Badge>
            {p.status !== "paid" && d.payout_provider === "firefly" && <button className="btn-soft min-h-[36px]" onClick={() => go(api(`/api/admin/rewards/payouts/${p.id}/retry`, { body: {} }), "Sent to Firefly again.")}>Retry</button>}
            {p.status !== "paid" && <button className="btn-soft min-h-[36px]" onClick={() => go(api(`/api/admin/rewards/payouts/${p.id}/paid`, { body: {} }), "Marked paid.")}>Paid</button>}</li>))}</ul>}
      </Panel>
      <Panel title="Jobs that earn points">
        <Table head={["Job", "Points", "Kids can claim", "On"]}>{d.activities.map((a: any) => (
          <tr key={a.id}><Td>{a.name}</Td><Td><select className="field min-h-[34px] w-20 py-0" value={a.points} onChange={(e) => go(api("/api/admin/rewards/activities", { body: { ...a, points: Number(e.target.value) } }), "Saved.")}>{d.allowed_points.map((n: number) => <option key={n}>{n}</option>)}</select></Td>
            <Td><input type="checkbox" checked={a.kids_can_claim} onChange={(e) => go(api("/api/admin/rewards/activities", { body: { ...a, kids_can_claim: e.target.checked } }), "Saved.")} /></Td>
            <Td><input type="checkbox" checked={a.active} onChange={(e) => go(api("/api/admin/rewards/activities", { body: { ...a, active: e.target.checked } }), "Saved.")} /></Td></tr>))}</Table>
        <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget; go(api("/api/admin/rewards/activities", { body: { name: (f.elements.namedItem("n") as HTMLInputElement).value, points: Number((f.elements.namedItem("p") as HTMLSelectElement).value) } }), "Added."); f.reset(); }}>
          <input name="n" className="field flex-1" placeholder="New job, e.g. Walk the dog" /><select name="p" className="field w-20">{d.allowed_points.map((n: number) => <option key={n}>{n}</option>)}</select><button className="btn-soft">Add</button></form>
      </Panel>
      <Panel title="Rewards">
        <Table head={["Reward", "Costs", "Kind", "On"]}>{d.rewards.map((r: any) => (
          <tr key={r.id}><Td>{r.name}</Td><Td>{r.cost} pts</Td><Td>{r.kind === "money" ? `${d.currency}${r.amount}` : "treat"}</Td>
            <Td><input type="checkbox" checked={r.active} onChange={(e) => go(api("/api/admin/rewards/catalog", { body: { ...r, active: e.target.checked } }), "Saved.")} /></Td></tr>))}</Table>
        <form className="mt-3 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget, money = Number((f.elements.namedItem("m") as HTMLInputElement).value);
          go(api("/api/admin/rewards/catalog", { body: { name: (f.elements.namedItem("n") as HTMLInputElement).value, cost: Number((f.elements.namedItem("c") as HTMLInputElement).value), ...(money ? { kind: "money", amount: money } : {}) } }), "Added."); f.reset(); }}>
          <input name="n" className="field flex-1" placeholder="New reward" /><input name="c" className="field w-24" type="number" step="0.5" min="0.5" placeholder="points" /><input name="m" className="field w-28" type="number" step="0.01" min="0" placeholder={`${d.currency} (money)`} /><button className="btn-soft">Add</button></form>
      </Panel>
    </div>
    <div className="mt-5"><Panel title="Recent points">
      <Table head={["When", "Who", "Points", "For", "By"]}>{d.history.map((h: any) => <tr key={h.id}><Td>{when(h.at)}</Td><Td>{h.person_id}</Td><Td className={h.delta < 0 ? "text-danger" : "text-success"}>{h.delta > 0 ? "+" : ""}{h.delta}</Td><Td>{h.reason}</Td><Td>{h.by}</Td></tr>)}</Table>
    </Panel></div>
  </>);
}
