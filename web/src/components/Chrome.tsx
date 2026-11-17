import { Bell, House, LayoutGrid, LogIn, LogOut, MessageCircle, Moon, MonitorSmartphone, Sun } from "lucide-react";
import type { Session } from "../api";
import { Avatar, cn } from "../ui";

export type Tab = "home" | "ask" | "apps";

/** The bar along the top: page title on the left, quick actions on the right. */
export function TopBar({ session, title, dark, onTheme, onKiosk, onApprovals, onSignIn, onSignOut, onSettings }: {
  session: Session; title: string; dark: boolean; onTheme: () => void; onKiosk?: () => void; onApprovals: () => void; onSignIn: () => void; onSignOut: () => void; onSettings: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-2 px-4 sm:px-8">
        <span className="mr-1 h-4 w-4 rounded-full bg-primary shadow-[0_0_14px_rgb(var(--primary))]" />
        <span className="font-serif text-[20px] font-semibold">{title}</span>
        <div className="ml-auto flex items-center gap-2">
          <button className="icon-btn relative" onClick={onApprovals} title="Waiting for approval">
            <Bell size={19} />
            {session.pending_approvals > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">{session.pending_approvals}</span>}
          </button>
          {onKiosk && <button className="icon-btn hidden sm:inline-flex" onClick={onKiosk} title="Wall screen view"><MonitorSmartphone size={19} /></button>}
          <button className="icon-btn hidden sm:inline-flex" onClick={onTheme} title={dark ? "Light" : "Dark"}>{dark ? <Sun size={19} /> : <Moon size={19} />}</button>
          {session.person ? (
            <>
              <button className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 hover:bg-surface-2" onClick={onSettings} title="Settings">
                <Avatar name={session.person.name} color={session.person.color} size={32} /><span className="hidden font-medium sm:inline">{session.person.name}</span>
              </button>
              <button className="icon-btn border-transparent" onClick={onSignOut} title="Sign out"><LogOut size={19} /></button>
            </>
          ) : session.device ? <button className="btn-primary" onClick={onSignIn}><LogIn size={18} />Sign in</button> : null}
        </div>
      </div>
    </header>
  );
}

/** The floating pill of tabs at the bottom. */
export function TabBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: JSX.Element }[] = [
    { id: "home", label: "Home", icon: <House size={21} /> },
    { id: "ask", label: "Ask", icon: <MessageCircle size={21} /> },
    { id: "apps", label: "Apps", icon: <LayoutGrid size={21} /> },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="card flex gap-1 rounded-[22px] p-1.5 shadow-lift">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => onTab(t.id)} className={cn("flex min-w-[84px] flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-[13px] font-medium transition-colors", tab === t.id ? "bg-primary-soft text-primary" : "text-muted hover:text-foreground")}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
