import { CalendarDays, ClipboardCheck, House, ListChecks, ShieldCheck, ShoppingCart, StickyNote, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { api, type Card as CardData } from "../api";
import { Card, Empty, ErrorText, niceTime } from "../ui";

const ICONS: Record<string, JSX.Element> = {
  today: <CalendarDays size={18} />, meals: <UtensilsCrossed size={18} />, shopping: <ShoppingCart size={18} />,
  chores: <ListChecks size={18} />, home: <House size={18} />, approvals: <ShieldCheck size={18} />,
};

/** One dashboard card, drawn for what it holds. */
export function DashCard({ card, canApprove, onChanged, big }: { card: CardData; canApprove: boolean; onChanged: () => void; big?: boolean }) {
  const icon = ICONS[card.id] ?? (card.kind === "checklist" ? <ClipboardCheck size={18} /> : <StickyNote size={18} />);
  const count = card.kind === "checklist" || card.kind === "approvals" ? (card.items?.length ?? card.approvals?.length) : undefined;
  return (
    <Card icon={icon} title={card.title} count={count} className={card.kind === "schedule" && big ? "lg:row-span-2" : undefined}>
      {card.error ? <ErrorText>{card.error}</ErrorText> : card.empty ? <Empty>{card.empty}</Empty> : <Body card={card} canApprove={canApprove} onChanged={onChanged} big={big} />}
    </Card>
  );
}

function Body({ card, canApprove, onChanged, big }: { card: CardData; canApprove: boolean; onChanged: () => void; big?: boolean }) {
  const items = card.items ?? [];
  switch (card.kind) {
    case "schedule":
      return (
        <ul className="flex flex-col gap-5">
          {items.map((i, n) => (
            <li key={n} className={`grid items-baseline gap-4 ${big ? "grid-cols-[150px_1fr]" : "grid-cols-[88px_1fr]"}`}>
              <span className={`whitespace-nowrap font-serif text-muted ${big ? "text-[26px] leading-none" : "text-[17px]"}`}>{niceTime(i.time)}</span>
              <div>
                <div className={big ? "text-[26px] font-semibold leading-tight" : "text-[17px] font-medium"}>{i.title}</div>
                {i.meta && <div className="mt-1 text-[14px] text-muted">{i.meta}</div>}
              </div>
            </li>
          ))}
        </ul>
      );
    case "meals":
      return (
        <ul className="flex flex-col">
          {items.map((i, n) => (
            <li key={n} className="flex items-baseline justify-between gap-4 border-b border-border py-2.5 last:border-0">
              <span className="eyebrow">{i.label}{i.time && niceTime(i.time) !== "Today" ? ` · ${niceTime(i.time)}` : ""}</span>
              <span className="text-right text-[16px] font-medium">{i.title}</span>
            </li>
          ))}
        </ul>
      );
    case "checklist":
    case "list":
      return (
        <ul className="flex flex-col">
          {items.map((i, n) => (
            <li key={n} className="flex items-center gap-3 border-b border-border py-2.5 last:border-0">
              {card.kind === "checklist" && <span className={`h-5 w-5 shrink-0 rounded-full border-2 ${i.done ? "border-success bg-success" : "border-border-strong"}`} />}
              <span className={`flex-1 text-[16px] ${i.done ? "text-muted line-through" : ""}`}>{i.label ? <span className="eyebrow mr-2">{i.label}</span> : null}{i.title}</span>
              {(i.meta || i.time) && <span className="text-[13px] text-muted">{i.meta || niceTime(i.time)}</span>}
            </li>
          ))}
        </ul>
      );
    case "entities":
      return (
        <ul className="grid grid-cols-2 gap-2">
          {(card.entities ?? []).map((e) => (
            <li key={e.entity_id} className="rounded-xl bg-surface-2 px-3 py-2.5">
              <div className="truncate text-[13px] text-muted">{e.name}</div>
              <div className="text-[18px] font-semibold capitalize">{e.state}</div>
            </li>
          ))}
        </ul>
      );
    case "approvals":
      return <ApprovalList items={card.approvals ?? []} canApprove={canApprove} onChanged={onChanged} />;
    default:
      return <p className="max-h-60 overflow-auto whitespace-pre-wrap text-[15px] leading-relaxed">{card.text}</p>;
  }
}

/** Household changes waiting for a family member. */
export function ApprovalList({ items, canApprove, onChanged }: { items: { id: string; summary: string; requested_by: string }[]; canApprove: boolean; onChanged: () => void }) {
  const [msg, setMsg] = useState(""), [busy, setBusy] = useState("");
  const decide = async (id: string, approve: boolean) => {
    setBusy(id);
    try { const r = await api(`/api/approvals/${id}`, { body: { approve } }); setMsg(r.text); onChanged(); } catch (e: any) { setMsg(e.message); } finally { setBusy(""); }
  };
  if (!items.length) return <Empty>Nothing is waiting.</Empty>;
  return (
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col">
        {items.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-3 border-b border-border py-3 last:border-0">
            <div className="min-w-[10rem] flex-1">
              <div className="text-[16px] font-medium first-letter:uppercase">{a.summary}</div>
              <div className="text-[13px] text-muted">Asked from {a.requested_by.replace(/^household on /, "the ")}</div>
            </div>
            {canApprove && (
              <div className="flex gap-2">
                <button className="btn-primary" disabled={!!busy} onClick={() => decide(a.id, true)}>Approve</button>
                <button className="btn-soft" disabled={!!busy} onClick={() => decide(a.id, false)}>Deny</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!canApprove && <p className="text-[14px] text-muted">A grown-up signs in to approve these.</p>}
      {msg && <p className="text-[14px]">{msg}</p>}
    </div>
  );
}
