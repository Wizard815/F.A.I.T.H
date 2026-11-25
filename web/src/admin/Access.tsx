import { useEffect, useState } from "react";
import { api } from "../api";
import { PageHead, Panel, Table, Td, when } from "./Shell";

export function Access() {
  const [tokens, setTokens] = useState<any[]>([]), [devices, setDevices] = useState<any[]>([]), [people, setPeople] = useState<any[]>([]);
  const [made, setMade] = useState(""), [code, setCode] = useState(""), [msg, setMsg] = useState("");
  const load = () => { api("/api/admin/tokens").then(setTokens); api("/api/admin/devices").then(setDevices); api("/api/admin/people").then(setPeople); };
  useEffect(() => { load(); }, []);
  return (<>
    <PageHead title="Tokens & screens" sub="Tokens let other apps use FAITH: an ha token for the Home Assistant integration, household or person tokens for apps that talk to FAITH like a model. Each is shown once." />
    {msg && <p className="mb-4 text-danger">{msg}</p>}
    <div className="grid gap-5 lg:grid-cols-2">
      <Panel title="Tokens">
        <form className="mb-4 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); const f = e.currentTarget, kind = (f.elements.namedItem("k") as HTMLSelectElement).value;
          api("/api/admin/tokens", { body: { kind: kind.startsWith("person:") ? "person" : kind, person: kind.startsWith("person:") ? kind.slice(7) : undefined, name: (f.elements.namedItem("n") as HTMLInputElement).value } }).then((r) => { setMade(r.token); setMsg(""); load(); f.reset(); }).catch((er) => setMsg(er.message)); }}>
          <select name="k" aria-label="Token kind" className="field w-44"><option value="ha">Home Assistant</option><option value="household">household</option>{people.map((p) => <option key={p.id} value={`person:${p.id}`}>person: {p.name}</option>)}</select>
          <input name="n" className="field flex-1" aria-label="Token name" placeholder="name, e.g. homeassistant" /><button className="btn-primary">Make token</button></form>
        {made && <p className="mb-4 break-all rounded-input bg-primary-soft p-3 font-mono text-[14px]">{made}<br /><span className="font-sans text-muted">Copy it now: FAITH keeps only its hash.</span></p>}
        <Table head={["Name", "Kind", "Last used", ""]}>{tokens.map((t) => <tr key={t.name}><Td>{t.name}</Td><Td>{t.kind}{t.person_id ? `: ${t.person_id}` : ""}</Td><Td>{when(t.last_used)}</Td><Td><button className="btn-ghost" onClick={() => api(`/api/admin/tokens/${t.name}`, { method: "DELETE" }).then(load)}>Revoke</button></Td></tr>)}</Table>
      </Panel>
      <Panel title="Paired screens (outside Home Assistant)">
        <p className="mb-3 text-[14px] text-muted">The family's screens run Home Assistant with FAITH's cards; a tablet signed into HA as the family uses the who card's PIN pad. Pair a browser here only if it shows FAITH's own page.</p>
        <form className="mb-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); api("/api/admin/pair-code", { body: { device: (e.currentTarget.elements.namedItem("d") as HTMLInputElement).value } }).then((r) => setCode(r.code)).catch((er) => setMsg(er.message)); }}>
          <input name="d" className="field flex-1" aria-label="Screen id" placeholder="screen id, e.g. kitchen" /><button className="btn-soft">Pairing code</button></form>
        {code && <p className="mb-3 font-serif text-[40px] font-semibold tracking-[0.3em]">{code}</p>}
        <Table head={["Screen", "Last seen", ""]}>{devices.map((d) => <tr key={d.id}><Td>{d.name}</Td><Td>{when(d.last_seen)}</Td><Td><button className="btn-ghost" onClick={() => api(`/api/admin/devices/${d.id}`, { method: "DELETE" }).then(load)}>Unpair</button></Td></tr>)}</Table>
      </Panel>
    </div>
  </>);
}
