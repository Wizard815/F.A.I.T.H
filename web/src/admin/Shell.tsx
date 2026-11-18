import { Activity, Bot, CalendarClock, KeyRound, ListChecks, LogOut, Moon, ShieldCheck, Star, Sun, Users } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "../ui";
import { Emblem } from "../emblem/Emblem";

export type Page = "overview" | "people" | "skills" | "routines" | "rewards" | "approvals" | "access";
export const PAGES: { id: Page; label: string; icon: ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Activity size={18} /> },
  { id: "people", label: "People", icon: <Users size={18} /> },
  { id: "skills", label: "Skills", icon: <Bot size={18} /> },
  { id: "routines", label: "Routines", icon: <CalendarClock size={18} /> },
  { id: "rewards", label: "Points & rewards", icon: <Star size={18} /> },
  { id: "approvals", label: "Approvals & log", icon: <ListChecks size={18} /> },
  { id: "access", label: "Tokens & screens", icon: <KeyRound size={18} /> },
];

export function Shell({ page, onPage, name, who, dark, onTheme, onSignOut, children }: { page: Page; onPage: (p: Page) => void; name: string; who: string; dark: boolean; onTheme: () => void; onSignOut: () => void; children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <aside className="border-b border-border bg-surface md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 px-4 py-4"><Emblem size={44} tone={dark ? "dark" : "light"} /><span className="font-serif text-[20px] font-semibold">{name}</span><span className="ml-1 rounded-full bg-primary-soft px-2 py-0.5 text-[12px] font-semibold text-primary">Admin</span></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:overflow-visible">
          {PAGES.map((p) => (
            <button key={p.id} onClick={() => onPage(p.id)} className={cn("flex shrink-0 items-center gap-3 rounded-input px-3 py-2.5 text-left font-medium transition-colors", page === p.id ? "bg-primary-soft text-primary" : "text-muted hover:text-foreground")}>{p.icon}{p.label}</button>
          ))}
        </nav>
        <div className="hidden px-5 py-4 text-[14px] text-muted md:block">
          <div className="flex items-center gap-2"><ShieldCheck size={16} />{who}</div>
          <div className="mt-3 flex gap-2"><button className="icon-btn h-9 w-9" onClick={onTheme} title="Light / dark">{dark ? <Sun size={16} /> : <Moon size={16} />}</button><button className="icon-btn h-9 w-9" onClick={onSignOut} title="Sign out"><LogOut size={16} /></button></div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8">{children}</main>
    </div>
  );
}

export const PageHead = ({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) => (
  <div className="mb-6 flex flex-wrap items-end gap-4"><div><h1 className="text-[32px] font-semibold leading-tight">{title}</h1>{sub && <p className="mt-1 max-w-2xl text-muted">{sub}</p>}</div><div className="ml-auto">{right}</div></div>
);
export const Panel = ({ title, children, right }: { title?: string; children: ReactNode; right?: ReactNode }) => (
  <section className="card p-5">{title && <div className="mb-3 flex items-center gap-3"><h2 className="text-[19px] font-semibold">{title}</h2><div className="ml-auto">{right}</div></div>}{children}</section>
);
export const Badge = ({ ok, children }: { ok: boolean | null; children: ReactNode }) => (
  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[13px] font-medium", ok === null ? "bg-surface-2 text-muted" : ok ? "bg-success/15 text-success" : "bg-danger/15 text-danger")}><span className="h-1.5 w-1.5 rounded-full bg-current" />{children}</span>
);
export const Table = ({ head, children }: { head: string[]; children: ReactNode }) => (
  <div className="overflow-x-auto"><table className="w-full text-left text-[15px]"><thead><tr className="border-b border-border text-[12px] uppercase tracking-[0.1em] text-muted">{head.map((h) => <th key={h} className="py-2 pr-4 font-medium">{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>
);
export const Td = ({ children, className }: { children?: ReactNode; className?: string }) => <td className={cn("border-b border-border py-2.5 pr-4 align-top", className)}>{children}</td>;
export const when = (ms?: number | null) => (ms ? new Date(ms).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "never");
