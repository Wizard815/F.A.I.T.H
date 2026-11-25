import { startRegistration } from "@simplewebauthn/browser";
import { Mic, ScanFace, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { api, record } from "../api";
import { Avatar } from "../ui";
import { Badge, PageHead, Panel } from "./Shell";

export function People({ me, passkeys }: { me: string; passkeys: boolean }) {
  const [list, setList] = useState<any[] | null>(null), [msg, setMsg] = useState(""), [rec, setRec] = useState<{ who: string; stop: () => Promise<Blob> } | null>(null);
  const load = () => api("/api/admin/people").then(setList).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);
  const go = (p: Promise<unknown>, ok: string) => p.then(() => { setMsg(ok); load(); }).catch((e) => setMsg(e.message));
  const voice = async (id: string, test = false) => {
    if (rec) { const blob = await rec.stop(); setRec(null); if (test) { const r = await api("/api/admin/voice-test", { raw: blob }).catch((e) => ({ error: e.message })); setMsg(r.error ? r.error : r.person ? `That sounds like ${r.name} (${r.score}).` : "I don't recognise that voice."); } else go(api(`/api/admin/voice/${id}`, { raw: blob }), "Voice sample saved."); return; }
    try { const r = await record(); setRec({ who: test ? "test" : id, ...r }); setMsg(test ? "Speak for a few seconds, then press stop." : "Read a sentence or two in a normal voice, then press stop."); } catch { setMsg("No microphone (it needs https)."); }
  };
  const addFaceId = async () => {
    const opts = await api("/api/me/passkeys/start", { body: {} });
    await api("/api/me/passkeys/finish", { body: { response: await startRegistration({ optionsJSON: opts }), label: "Admin device" } });
  };
  return (<>
    <PageHead title="People" sub="The family comes from faith.yaml. Here you set their PINs (for shared screens) and passwords, and teach FAITH their voices." right={<button className="btn-soft" onClick={() => voice("test", true)}>{rec?.who === "test" ? <><Square size={16} />Stop</> : <><Mic size={16} />Test a voice</>}</button>} />
    {msg && <p className="mb-4 text-[15px]">{msg}</p>}
    <div className="grid gap-4 lg:grid-cols-2">
      {list?.map((p) => (
        <Panel key={p.id}>
          <div className="mb-4 flex items-center gap-3"><Avatar name={p.name} color={p.color} size={48} /><div><div className="font-serif text-[20px] font-semibold">{p.name}</div><div className="text-[14px] text-muted">{p.role} · id {p.id}{p.role === "child" ? ` · ${p.points} points` : ""}</div></div></div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Badge ok={p.methods.pin}>{p.methods.pin ? "PIN set" : "no PIN"}</Badge><Badge ok={p.methods.password}>{p.methods.password ? "password set" : "no password"}</Badge><Badge ok={p.methods.passkey}>{p.methods.passkey ? "Face ID set" : "no Face ID"}</Badge>
            <Badge ok={p.voice_samples >= 3 ? true : p.voice_samples ? null : false}>voice: {p.voice_samples} sample{p.voice_samples === 1 ? "" : "s"}</Badge>
            <Badge ok={!!p.ha_user_id}>{p.ha_user_id ? "HA user linked" : "no HA user"}</Badge><Badge ok={!!p.mattermost_username}>{p.mattermost_username ? "Mattermost linked" : "no Mattermost"}</Badge><Badge ok={!!p.ha_notify?.length}>{p.ha_notify?.length ? "phone pushes on" : "no phone pushes"}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = (e.currentTarget.elements.namedItem("pin") as HTMLInputElement).value; go(api(`/api/admin/people/${p.id}/pin`, { method: "PUT", body: { pin: v } }), `PIN set for ${p.name}.`); e.currentTarget.reset(); }}>
              <input name="pin" className="field w-32" type="password" inputMode="numeric" aria-label="New PIN (4 to 8 digits)" placeholder="New PIN" /><button className="btn-soft">Set</button></form>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); const v = (e.currentTarget.elements.namedItem("pw") as HTMLInputElement).value; go(api(`/api/admin/people/${p.id}/password`, { method: "PUT", body: { password: v } }), `Password set for ${p.name}.`); e.currentTarget.reset(); }}>
              <input name="pw" className="field w-40" type="password" aria-label="New password" placeholder="New password" /><button className="btn-soft">Set</button></form>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-soft" onClick={() => voice(p.id)} disabled={!!rec && rec.who !== p.id}>{rec?.who === p.id ? <><Square size={16} />Stop and save</> : <><Mic size={16} />Add a voice sample</>}</button>
            {p.voice_samples > 0 && <button className="btn-ghost" onClick={() => go(api(`/api/admin/voice/${p.id}`, { method: "DELETE" }), "Voice forgotten.")}>Forget voice</button>}
            <button className="btn-ghost" onClick={() => go(api(`/api/admin/people/${p.id}/signout`, { body: {} }), `${p.name} is signed out everywhere.`)}>Sign out everywhere</button>
            {p.id === me && passkeys && <button className="btn-ghost" onClick={() => go(addFaceId(), "Face ID added.")}><ScanFace size={16} />Add Face ID</button>}
          </div>
        </Panel>))}
    </div>
  </>);
}
