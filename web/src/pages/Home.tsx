import { CalendarDays, ListChecks, ShieldCheck, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import type { AppLink, Card as CardData, Session } from "../api";
import { DashCard } from "../components/cards";
import { AppTiles } from "./Apps";

/** The home screen: "your day, at a glance". The household view and each
 *  person's view share the layout; the server decides what's in the cards. */
export function Home({ session, cards, apps, error, reload }: { session: Session; cards: CardData[] | null; apps: AppLink[]; error: string; reload: () => void }) {
  const now = new Date();
  const get = (id: string) => cards?.find((c) => c.id === id);
  const n = (id: string) => get(id)?.items?.length ?? 0;
  const stats: { label: string; value: number; icon: ReactNode }[] = [
    { label: "Today", value: n("today"), icon: <CalendarDays size={15} /> },
    { label: "Chores", value: n("chores"), icon: <ListChecks size={15} /> },
    { label: "Shopping", value: n("shopping"), icon: <ShoppingCart size={15} /> },
    { label: "Waiting", value: session.pending_approvals, icon: <ShieldCheck size={15} /> },
  ];
  const who = session.person ? `${session.person.name}'s` : "The family's";
  const main = cards?.filter((c) => c.id !== "home") ?? [];
  const home = get("home");

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 pb-32 pt-6 sm:px-8">
      <div>
        <div className="eyebrow">{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
        <h1 className="mt-2 text-[34px] font-semibold leading-tight sm:text-[42px]">
          {who} <em className="font-serif italic text-primary">day</em>, at a glance.
        </h1>
        {session.household && <p className="mt-2 text-muted">This is the shared view. Sign in to see your own things too.</p>}
      </div>

      <div className="card grid grid-cols-2 divide-border overflow-hidden sm:grid-cols-4 sm:divide-x">
        {stats.map((s, i) => (
          <div key={s.label} className={`px-5 py-4 sm:px-6 sm:py-5 ${i < 2 ? "border-b border-border sm:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-border sm:border-r-0" : ""}`}>
            <div className="eyebrow flex items-center gap-2">{s.icon}{s.label}</div>
            <div className={`mt-1 font-serif text-[40px] font-semibold leading-none ${s.label === "Waiting" && s.value ? "text-primary" : ""}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {apps.length > 0 && <div className="hidden sm:block"><AppTiles apps={apps} compact /></div>}

      {error && <div className="card p-5 text-danger">{error}</div>}
      {!cards && !error && <div className="card p-6 text-muted">Loading…</div>}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {main.map((c) => <DashCard key={c.id} card={c} canApprove={session.can_approve} onChanged={reload} />)}
        {home && <DashCard card={home} canApprove={session.can_approve} onChanged={reload} />}
      </div>
    </div>
  );
}
