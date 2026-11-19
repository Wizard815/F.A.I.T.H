import { startAuthentication } from "@simplewebauthn/browser";
import { useCallback, useEffect, useState } from "react";
import { api, type Session } from "./api";
import { Access } from "./admin/Access";
import { Approvals } from "./admin/Approvals";
import { Overview } from "./admin/Overview";
import { People } from "./admin/People";
import { Rewards } from "./admin/Rewards";
import { Routines } from "./admin/Routines";
import { Shell, type Page } from "./admin/Shell";
import { Skills } from "./admin/Skills";
import { ErrorText } from "./ui";
import { Emblem } from "./emblem/Emblem";

// Per-browser niceties only (theme, last page).
const store = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } } };

/** FAITH's own page is its admin console. The family uses Home Assistant (FAITH's cards) and Mattermost. */
export function App() {
  const [s, setS] = useState<Session | null>(null), [err, setErr] = useState("");
  const [page, setPage] = useState<Page>((store.get("faith.page") as Page) || "overview");
  const [dark, setDark] = useState(() => (store.get("faith.theme") ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark");
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  const refresh = useCallback(() => api<Session>("/api/session").then(setS).catch((e) => setErr(e.message)), []);
  useEffect(() => { refresh(); }, [refresh]);
  if (!s) return <div className="grid h-full place-items-center px-6 text-center text-muted" role="status">{err || "Loading…"}</div>;
  if (!s.person) return <SignIn s={s} onDone={refresh} />;
  const signOut = () => api("/api/auth/logout", { body: {} }).finally(refresh);
  if (s.person.role !== "admin") return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-4 px-5">
      <h1 className="text-[34px] font-semibold">Hi {s.person.name}.</h1>
      <p className="text-[17px] text-muted">This page is FAITH's admin console. The family's FAITH lives in Home Assistant (the FAITH cards on your dashboard) and in Mattermost.</p>
      <button className="btn-soft w-fit" onClick={signOut}>Sign out</button>
    </div>
  );
  const go = (p: Page) => { setPage(p); store.set("faith.page", p); };
  return (
    <Shell page={page} onPage={go} name={s.name} who={s.person.name} dark={dark} onTheme={() => { setDark(!dark); store.set("faith.theme", dark ? "light" : "dark"); }} onSignOut={signOut}>
      {page === "overview" && <Overview />}
      {page === "people" && <People me={s.person.id} passkeys={s.passkeys_possible} />}
      {page === "skills" && <Skills />}
      {page === "routines" && <Routines />}
      {page === "rewards" && <Rewards />}
      {page === "approvals" && <Approvals />}
      {page === "access" && <Access />}
    </Shell>
  );
}

function SignIn({ s, onDone }: { s: Session; onDone: () => void }) {
  const [id, setId] = useState(""), [pw, setPw] = useState(""), [err, setErr] = useState("");
  const go = (p: Promise<unknown>) => p.then(onDone).catch((e) => setErr(e.message));
  const faceId = async () => {
    const opts = await api("/api/auth/passkey/start", { body: { person: id.trim().toLowerCase() } });
    await api("/api/auth/passkey/finish", { body: { person: id.trim().toLowerCase(), response: await startAuthentication({ optionsJSON: opts }) } });
  };
  return (
    <div className="mx-auto flex min-h-full w-full max-w-sm flex-col justify-center gap-5 px-5">
      <Emblem size={180} className="-mb-2 -ml-4" tone={document.documentElement.classList.contains("dark") ? "dark" : "light"} />
      <div><div className="eyebrow">{s.name} · admin</div><h1 className="mt-2 text-[34px] font-semibold leading-tight">Sign in to run FAITH</h1></div>
      <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); go(api("/api/auth/password", { body: { person: id.trim().toLowerCase(), password: pw } })); }}>
        <label className="label">Your id in FAITH<input className="field font-normal" placeholder="e.g. wizard" value={id} onChange={(e) => setId(e.target.value)} autoCapitalize="none" autoComplete="username" required /></label>
        <label className="label">Password<input className="field font-normal" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required /></label>
        <button className="btn-primary" type="submit">Sign in</button>
        {s.passkeys_possible && <button type="button" className="btn-soft" disabled={!id} onClick={() => go(faceId())}>Use Face ID</button>}
      </form>
      <div role="alert" aria-live="assertive">{err && <ErrorText>{err}</ErrorText>}</div>
      <p className="text-[14px] text-muted">No password yet? On the server: <code>docker exec -it faith faith set-password &lt;id&gt;</code></p>
    </div>
  );
}
