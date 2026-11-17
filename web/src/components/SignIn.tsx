import { startAuthentication } from "@simplewebauthn/browser";
import { ChevronLeft, Delete, ScanFace } from "lucide-react";
import { useEffect, useState } from "react";
import { api, type Person, type Session } from "../api";
import { Avatar, cn, ErrorText, Sheet } from "../ui";

export async function passkeySignIn(person: string) {
  const opts = await api("/api/auth/passkey/start", { body: { person } });
  const response = await startAuthentication({ optionsJSON: opts });
  await api("/api/auth/passkey/finish", { body: { person, response } });
}

/** "Who's here?" then their way in: Face ID, the camera, a PIN or a password. */
export function SignIn({ session, onClose, onDone }: { session: Session; onClose: () => void; onDone: () => void }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [pick, setPick] = useState<Person | null>(null);
  const [pin, setPin] = useState(""), [pw, setPw] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  useEffect(() => { api<Person[]>("/api/people").then((p) => { setPeople(p); const s = p.find((x) => x.id === session.suggested); if (s) setPick(s); }).catch((e) => setErr(e.message)); }, []);
  const go = async (fn: () => Promise<unknown>) => { setErr(""); setBusy(true); try { await fn(); onDone(); } catch (e: any) { setErr(e.message); setPin(""); } finally { setBusy(false); } };
  const press = (d: string) => { if (busy) return; const p = (pin + d).slice(0, 8); setPin(p); };
  const submitPin = () => pick && pin.length >= 4 && go(() => api("/api/auth/pin", { body: { person: pick.id, pin } }));
  useEffect(() => {
    if (!pick?.methods?.pin) return;
    const k = (e: KeyboardEvent) => { if (/^\d$/.test(e.key)) press(e.key); else if (e.key === "Backspace") setPin((p) => p.slice(0, -1)); else if (e.key === "Enter") submitPin(); };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  });

  return (
    <Sheet title={pick ? undefined : "Who's here?"} onClose={onClose}>
      {!pick ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {people.map((p) => (
            <button key={p.id} onClick={() => setPick(p)} className={cn("flex flex-col items-center gap-3 rounded-card border bg-surface px-3 py-5 transition-colors hover:bg-surface-2", session.suggested === p.id ? "border-2 border-primary" : "border-border")}>
              <Avatar name={p.name} color={p.color} size={64} />
              <span className="font-serif text-[18px] font-semibold">{p.name}</span>
              {session.suggested === p.id && <span className="-mt-2 text-[12px] text-primary">I think that's you</span>}
            </button>
          ))}
          {!people.length && !err && <p className="col-span-full text-muted">Loading…</p>}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <button className="btn-ghost -mt-4 self-start pl-0" onClick={() => { setPick(null); setPin(""); setErr(""); }}><ChevronLeft size={18} />Everyone</button>
          <Avatar name={pick.name} color={pick.color} size={76} />
          <h2 className="-mt-2 text-[28px] font-semibold">Hi, {pick.name}</h2>
          {session.face_unlock && session.suggested === pick.id && <button className="btn-primary w-full" disabled={busy} onClick={() => go(() => api("/api/auth/face", { body: { person: pick.id } }))}><ScanFace size={20} />It's me</button>}
          {pick.methods?.passkey && session.passkeys_possible && <button className="btn-primary w-full" disabled={busy} onClick={() => go(() => passkeySignIn(pick.id))}><ScanFace size={20} />Use Face ID</button>}
          {pick.methods?.pin && (
            <>
              <div className="flex gap-3">{Array.from({ length: Math.max(4, pin.length) }, (_, i) => <span key={i} className={cn("h-3.5 w-3.5 rounded-full border-2", i < pin.length ? "border-primary bg-primary" : "border-border-strong")} />)}</div>
              <div className="grid grid-cols-3 gap-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => <PinKey key={d} onClick={() => press(d)}>{d}</PinKey>)}
                <PinKey onClick={() => setPin(pin.slice(0, -1))} label="Delete"><Delete size={22} /></PinKey>
                <PinKey onClick={() => press("0")}>0</PinKey>
                <button className="h-[68px] w-[76px] rounded-2xl bg-primary text-[17px] font-semibold text-primary-foreground disabled:opacity-40" disabled={pin.length < 4 || busy} onClick={submitPin}>OK</button>
              </div>
            </>
          )}
          {pick.methods?.password && (
            <form className="flex w-full flex-col gap-2" onSubmit={(e) => { e.preventDefault(); go(() => api("/api/auth/password", { body: { person: pick.id, password: pw } })); }}>
              {pick.methods?.pin && <div className="eyebrow text-center">or</div>}
              <input className="field" type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
              <button className="btn-soft" type="submit" disabled={busy || !pw}>Sign in with password</button>
            </form>
          )}
          {!pick.methods?.pin && !pick.methods?.password && !pick.methods?.passkey && <p className="text-center text-muted">{pick.name} can't sign in yet. A grown-up sets a PIN with <code>faith set-pin {pick.id}</code>.</p>}
        </div>
      )}
      {err && <div className="mt-4 text-center"><ErrorText>{err}</ErrorText></div>}
    </Sheet>
  );
}

const PinKey = ({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label?: string }) => (
  <button aria-label={label} onClick={onClick} className="grid h-[68px] w-[76px] place-items-center rounded-2xl border border-border bg-surface font-serif text-[28px] transition-colors hover:bg-surface-2 active:bg-primary-soft">{children}</button>
);
