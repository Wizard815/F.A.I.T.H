import { useCallback, useEffect, useRef, useState } from "react";
import { api, type AppLink, type Card, type Session } from "./api";
import { ApprovalList } from "./components/cards";
import { TabBar, TopBar, type Tab } from "./components/Chrome";
import { Settings } from "./components/Settings";
import { SignIn } from "./components/SignIn";
import { Welcome } from "./components/Welcome";
import { Apps } from "./pages/Apps";
import { Ask } from "./pages/Ask";
import { Home } from "./pages/Home";
import { Kiosk } from "./pages/Kiosk";
import { Sheet } from "./ui";

// Per-browser niceties only (theme, wall view on/off); nothing that matters lives here.
const store = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } } };

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState("");
  const [cards, setCards] = useState<Card[] | null>(null), [cardErr, setCardErr] = useState("");
  const [apps, setApps] = useState<AppLink[]>([]);
  const [tab, setTab] = useState<Tab>("home");
  const [sheet, setSheet] = useState<"signin" | "settings" | "approvals" | null>(null);
  const [listen, setListen] = useState(false);
  const [wallOff, setWallOff] = useState(store.get("faith.wall") === "off");
  const [dark, setDark] = useState(() => (store.get("faith.theme") ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark");
  const lastPing = useRef(0);

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  const refresh = useCallback(async () => {
    try { setSession(await api<Session>("/api/session")); setError(""); } catch (e: any) { setError(e.message); }
  }, []);
  useEffect(() => { refresh(); const i = setInterval(refresh, 8000); return () => clearInterval(i); }, [refresh]);

  const personId = session?.person?.id ?? null, ready = !!session && (!!session.device || !!session.person);
  const loadCards = useCallback(() => {
    api<{ cards: Card[] }>("/api/dashboard").then((d) => { setCards(d.cards); setCardErr(""); }).catch((e) => setCardErr(e.message));
  }, []);
  // Everything on screen follows whoever is signed in: reload when that changes.
  useEffect(() => {
    if (!ready) return;
    setCards(null); loadCards(); setSheet(null); setTab("home");
    api<AppLink[]>("/api/apps").then(setApps).catch(() => setApps([]));
    const i = setInterval(loadCards, 60000); return () => clearInterval(i);
  }, [personId, ready, loadCards]);

  // Taps and keys keep a person signed in on a shared screen (one ping per 15 s at most).
  useEffect(() => {
    const ping = () => { if (!session?.person || !session.device || Date.now() - lastPing.current < 15000) return; lastPing.current = Date.now(); api("/api/activity", { body: {} }).catch(() => {}); };
    window.addEventListener("pointerdown", ping); window.addEventListener("keydown", ping);
    return () => { window.removeEventListener("pointerdown", ping); window.removeEventListener("keydown", ping); };
  }, [session?.person?.id, session?.device?.id]);

  if (!session) return <div className="grid h-full place-items-center text-muted">{error || ""}</div>;
  if (!session.device && !session.person) return <Welcome session={session} onDone={refresh} />;

  const signOut = async () => { await api("/api/auth/logout", { body: {} }).catch(() => {}); refresh(); };
  const wall = !!session.device && !session.person && !wallOff;
  const setWall = (on: boolean) => { setWallOff(!on); store.set("faith.wall", on ? "on" : "off"); if (on) setTab("home"); };
  const titles: Record<Tab, string> = { home: "Today", ask: `Ask ${session.name}`, apps: "Apps" };

  return (
    <div className="flex h-full flex-col">
      {wall && tab === "home" ? (
        <main className="flex-1 overflow-y-auto">
          <Kiosk session={session} cards={cards} reload={loadCards} onSignIn={() => setSheet("signin")} onAsk={() => setTab("ask")} onTalk={() => { setListen(true); setTab("ask"); }} onExit={() => setWall(false)} />
        </main>
      ) : (
        <>
          <TopBar session={session} title={titles[tab]} dark={dark} onTheme={() => { setDark(!dark); store.set("faith.theme", dark ? "light" : "dark"); }}
            onKiosk={session.device && !session.person ? () => setWall(true) : undefined} onApprovals={() => setSheet("approvals")}
            onSignIn={() => setSheet("signin")} onSignOut={signOut} onSettings={() => setSheet("settings")} />
          <main className="min-h-0 flex-1 overflow-y-auto">
            {tab === "home" && <Home session={session} cards={cards} apps={apps} error={cardErr} reload={() => { loadCards(); refresh(); }} />}
            {tab === "ask" && <Ask key={personId ?? "household"} session={session} startListening={listen} onListened={() => setListen(false)} />}
            {tab === "apps" && <Apps apps={apps} signedIn={!!session.person} />}
          </main>
          <TabBar tab={tab} onTab={setTab} />
        </>
      )}

      {session.device && session.person && session.remaining_seconds !== null && session.remaining_seconds <= 20 && (
        <button className="fixed left-1/2 top-4 z-40 -translate-x-1/2 rounded-full bg-foreground px-5 py-3 font-medium text-background shadow-lift"
          onClick={() => api("/api/activity", { body: {} }).then(refresh)}>Signing {session.person.name} out in {session.remaining_seconds}s · tap to stay</button>
      )}
      {sheet === "signin" && <SignIn session={session} onClose={() => setSheet(null)} onDone={() => { setSheet(null); refresh(); }} />}
      {sheet === "settings" && session.person && <Settings session={session} onClose={() => setSheet(null)} />}
      {sheet === "approvals" && <ApprovalsSheet session={session} onClose={() => setSheet(null)} onChanged={() => { refresh(); loadCards(); }} />}
    </div>
  );
}

function ApprovalsSheet({ session, onClose, onChanged }: { session: Session; onClose: () => void; onChanged: () => void }) {
  const [data, setData] = useState<{ requests: any[] } | null>(null);
  const load = () => api("/api/approvals").then(setData).catch(() => setData({ requests: [] }));
  useEffect(() => { load(); }, []);
  const pending = data?.requests.filter((r) => r.status === "pending") ?? [];
  const done = data?.requests.filter((r) => r.status !== "pending").slice(0, 8) ?? [];
  return (
    <Sheet title="Waiting for approval" onClose={onClose} wide>
      <p className="-mt-2 mb-4 text-muted">Changes asked for from the shared screen wait here until a grown-up approves them.{session.person?.role === "admin" ? " As the admin you can also overrule a denial." : ""}</p>
      {data ? <ApprovalList items={pending} canApprove={session.can_approve} onChanged={() => { load(); onChanged(); }} /> : <p className="text-muted">Loading…</p>}
      {done.length > 0 && (
        <div className="mt-6">
          <div className="eyebrow mb-2">Recently</div>
          <ul className="flex flex-col">{done.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 border-b border-border py-2.5 text-[15px] last:border-0">
              <span className="first-letter:uppercase">{r.summary}</span>
              <span className="flex items-center gap-2 text-muted">
                <span className={r.status === "approved" ? "text-success" : r.status === "denied" ? "text-danger" : ""}>{r.status}</span>{r.decided_by && ` by ${r.decided_by}`}{r.overruled && " (overruled)"}
                {session.person?.role === "admin" && r.status === "denied" && <button className="btn-soft min-h-[34px] px-3 text-[13px]" onClick={() => api(`/api/approvals/${r.id}`, { body: { approve: true } }).then(() => { load(); onChanged(); })}>Overrule</button>}
              </span>
            </li>))}
          </ul>
        </div>
      )}
    </Sheet>
  );
}
