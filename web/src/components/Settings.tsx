import { startRegistration } from "@simplewebauthn/browser";
import { ScanFace, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { api, type Session } from "../api";
import { ErrorText, Sheet } from "../ui";

const Section = ({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) => (
  <section className="flex flex-col gap-3 border-t border-border pt-5 first:border-0 first:pt-0">
    <div><h3 className="text-[18px] font-semibold">{title}</h3>{hint && <p className="text-[14px] text-muted">{hint}</p>}</div>
    {children}
  </section>
);

export function Settings({ session, onClose }: { session: Session; onClose: () => void }) {
  const [me, setMe] = useState<any>(null), [msg, setMsg] = useState(""), [err, setErr] = useState("");
  const [pin, setPin] = useState(""), [curPin, setCurPin] = useState(""), [pw, setPw] = useState(""), [curPw, setCurPw] = useState(""), [dev, setDev] = useState(""), [code, setCode] = useState("");
  const load = () => api("/api/me").then(setMe).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);
  const go = async (fn: () => Promise<unknown>, ok: string) => { setErr(""); setMsg(""); try { await fn(); setMsg(ok); load(); } catch (e: any) { setErr(e.message); } };
  const addPasskey = async () => {
    const opts = await api("/api/me/passkeys/start", { body: {} });
    const response = await startRegistration({ optionsJSON: opts });
    await api("/api/me/passkeys/finish", { body: { response, label: /iPhone|iPad/.test(navigator.userAgent) ? "iPhone / iPad" : /Android/.test(navigator.userAgent) ? "Android" : "This device" } });
  };
  const p = session.person!;
  return (
    <Sheet title={`${p.name}'s settings`} onClose={onClose} wide>
      <div className="flex flex-col gap-6">
        <Section title="Face ID" hint="Sign in with your face or fingerprint on this device.">
          {session.passkeys_possible ? (
            <>
              {me?.passkeys?.length > 0 && <ul className="flex flex-col">{me.passkeys.map((k: any) => (
                <li key={k.id} className="flex items-center justify-between border-b border-border py-2 last:border-0"><span>{k.label}</span>
                  <button className="btn-ghost" onClick={() => go(() => api(`/api/me/passkeys/${encodeURIComponent(k.id)}`, { method: "DELETE" }), "Removed.")}><Trash2 size={16} />Remove</button></li>))}</ul>}
              <button className="btn-soft w-fit" onClick={() => go(addPasskey, "Face ID is set up on this device.")}><ScanFace size={18} />Add Face ID on this device</button>
            </>
          ) : <p className="text-muted">Face ID needs FAITH on its https address. PINs and passwords work meanwhile.</p>}
        </Section>
        <Section title="PIN" hint="4 to 8 digits, for the family's screens.">
          <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); go(() => api("/api/me/pin", { method: "PUT", body: { pin, current: curPin } }), "PIN changed."); }}>
            {me?.methods?.pin && <input className="field max-w-[11rem]" type="password" inputMode="numeric" placeholder="Current PIN" value={curPin} onChange={(e) => setCurPin(e.target.value)} />}
            <input className="field max-w-[11rem]" type="password" inputMode="numeric" placeholder="New PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
            <button className="btn-soft" type="submit">Save</button>
          </form>
        </Section>
        <Section title="Password" hint="For your own phone or computer.">
          <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); go(() => api("/api/me/password", { method: "PUT", body: { password: pw, current: curPw } }), "Password changed."); }}>
            {me?.methods?.password && <input className="field max-w-[14rem]" type="password" placeholder="Current password" value={curPw} onChange={(e) => setCurPw(e.target.value)} />}
            <input className="field max-w-[14rem]" type="password" placeholder="New password" value={pw} onChange={(e) => setPw(e.target.value)} />
            <button className="btn-soft" type="submit">Save</button>
          </form>
        </Section>
        {p.role === "admin" && (
          <Section title="Screens" hint="Pair a new wall screen or tablet: make a code here, then type it on that screen.">
            <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); go(async () => setCode((await api("/api/admin/pair-code", { body: { device: dev } })).code), "Type the code on the new screen within 10 minutes."); }}>
              <input className="field max-w-[14rem]" placeholder="Screen id, e.g. kitchen" value={dev} onChange={(e) => setDev(e.target.value)} />
              <button className="btn-soft" type="submit">Make pairing code</button>
            </form>
            {code && <div className="font-serif text-[44px] font-semibold tracking-[0.3em]">{code}</div>}
          </Section>
        )}
        {msg && <p className="text-success">{msg}</p>}
        {err && <ErrorText>{err}</ErrorText>}
      </div>
    </Sheet>
  );
}
