import { useState } from "react";
import { api, type Session } from "../api";
import { cn, ErrorText } from "../ui";
import { passkeySignIn } from "./SignIn";

/** First visit on a device FAITH doesn't know: sign in, or pair it as a family screen. */
export function Welcome({ session, onDone }: { session: Session; onDone: () => void }) {
  const [mode, setMode] = useState<"signin" | "pair">("signin");
  const [name, setName] = useState(""), [pw, setPw] = useState(""), [code, setCode] = useState(""), [err, setErr] = useState("");
  const go = async (fn: () => Promise<unknown>) => { setErr(""); try { await fn(); onDone(); } catch (e: any) { setErr(e.message); } };
  const id = name.trim().toLowerCase();
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-6 px-5 py-10">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft"><span className="h-6 w-6 rounded-full bg-primary shadow-[0_0_22px_rgb(var(--primary))]" /></div>
      <div>
        <div className="eyebrow">Family Agent for Intelligent Tasks & Help</div>
        <h1 className="mt-2 text-[40px] font-semibold leading-[1.05]">Hi, I'm <em className="italic text-primary">{session.name}</em>.</h1>
        <p className="mt-3 text-[17px] text-muted">Sign in with your own account, or pair this screen as one of the house's shared screens.</p>
      </div>
      <div className="grid grid-cols-2 rounded-input border border-border bg-surface p-1">
        {(["signin", "pair"] as const).map((m) => (
          <button key={m} className={cn("rounded-[9px] py-2.5 font-semibold", mode === m ? "bg-primary-soft text-primary" : "text-muted")} onClick={() => { setMode(m); setErr(""); }}>{m === "signin" ? "Sign in" : "Pair this screen"}</button>
        ))}
      </div>
      {mode === "signin" ? (
        <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); go(() => api("/api/auth/password", { body: { person: id, password: pw } })); }}>
          <input className="field" placeholder="Your name in FAITH (e.g. wizard)" value={name} onChange={(e) => setName(e.target.value)} autoCapitalize="none" autoComplete="username" />
          <input className="field" type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
          <button className="btn-primary" type="submit">Sign in</button>
          {session.passkeys_possible && <button type="button" className="btn-soft" disabled={!id} onClick={() => go(() => passkeySignIn(id))}>Use Face ID</button>}
        </form>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); go(() => api("/api/pair", { body: { code } })); }}>
          <p className="text-muted">An admin makes a code in Settings → Screens, or with <code>faith pair kitchen</code> on the server.</p>
          <input className="field text-center font-serif text-[28px] tracking-[0.3em]" placeholder="000000" inputMode="numeric" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
          <button className="btn-primary" type="submit" disabled={code.length !== 6}>Pair</button>
        </form>
      )}
      {err && <ErrorText>{err}</ErrorText>}
    </div>
  );
}
