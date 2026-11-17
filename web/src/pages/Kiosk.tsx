import { CalendarDays, LogIn, Maximize2, Minimize2, Mic, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { Card as CardData, Session } from "../api";
import { DashCard } from "../components/cards";
import { Card, Empty, useNow } from "../ui";

/** The wall screen: a big clock and the family's day, readable across the kitchen. */
export function Kiosk({ session, cards, reload, onSignIn, onAsk, onTalk, onExit }: {
  session: Session; cards: CardData[] | null; reload: () => void; onSignIn: () => void; onAsk: () => void; onTalk: () => void; onExit: () => void;
}) {
  const now = useNow(10000);
  const [full, setFull] = useState(!!document.fullscreenElement);
  useEffect(() => { const f = () => setFull(!!document.fullscreenElement); document.addEventListener("fullscreenchange", f); return () => document.removeEventListener("fullscreenchange", f); }, []);
  const toggleFull = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()).catch(() => {});
  const today = cards?.find((c) => c.id === "today");
  const side = cards?.filter((c) => ["meals", "approvals", "chores", "shopping"].includes(c.id)) ?? [];
  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="flex min-h-full flex-col gap-6 px-5 pb-8 pt-6 sm:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-serif text-[72px] font-semibold leading-[0.95] tracking-tight sm:text-[120px]">{time}</div>
          <div className="mt-2 text-[22px] text-muted sm:text-[28px]">{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
        </div>
        <div className="flex gap-2">
          <button className="icon-btn" onClick={onExit} title="Full home screen"><Sparkles size={18} /></button>
          <button className="icon-btn" onClick={toggleFull} title="Full screen">{full ? <Minimize2 size={18} /> : <Maximize2 size={18} />}</button>
          {!session.person && <button className="btn-primary" onClick={onSignIn}><LogIn size={18} />Sign in</button>}
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {today ? <DashCard card={today} canApprove={session.can_approve} onChanged={reload} big />
          : <Card icon={<CalendarDays size={18} />} title="Today's schedule"><Empty>{cards ? "Nothing planned today." : "Loading…"}</Empty></Card>}
        <div className="flex flex-col gap-5">
          {side.map((c) => <DashCard key={c.id} card={c} canApprove={session.can_approve} onChanged={reload} />)}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="card flex items-center gap-2 rounded-full p-2 shadow-lift">
          <button className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95" onClick={onTalk} aria-label="Talk to Faith"><Mic size={24} /></button>
          <button className="px-4 text-[17px] text-muted hover:text-foreground" onClick={onAsk}>Ask {session.name} anything…</button>
        </div>
      </div>
    </div>
  );
}
