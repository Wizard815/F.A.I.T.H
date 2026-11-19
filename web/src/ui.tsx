import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";

export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
export const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export function useNow(everyMs = 15000) {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), everyMs); return () => clearInterval(i); }, [everyMs]);
  return t;
}

/** A person's face tile: a hexagon, one cell of the hive. */
export const HEX = "polygon(50% 0, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)";
export function Avatar({ name, color, size = 36 }: { name: string; color?: string; size?: number }) {
  return (
    <span className="inline-grid shrink-0 place-items-center font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36, background: color || "rgb(var(--primary))", clipPath: HEX }}>{initials(name)}</span>
  );
}

export function Dot({ color }: { color?: string }) {
  return <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: color || "rgb(var(--muted))" }} />;
}

/** A dashboard card: an icon in a soft square, a serif title, an optional action on the right. */
export function Card({ icon, title, count, action, children, className }: { icon?: ReactNode; title: string; count?: number; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("card flex flex-col p-5 sm:p-6", className)}>
      <header className="mb-4 flex items-center gap-3">
        {icon && <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary">{icon}</span>}
        <h3 className="text-[20px] font-semibold leading-tight">{title}</h3>
        {count !== undefined && count > 0 && <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[13px] text-muted">{count}</span>}
        <span className="ml-auto">{action}</span>
      </header>
      {children}
    </section>
  );
}

/** A centered sheet over the page (sign-in, settings, approvals). */
export function Sheet({ title, onClose, children, wide }: { title?: ReactNode; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
      <div className={cn("card max-h-[92vh] w-full overflow-auto p-6 shadow-lift", wide ? "max-w-2xl" : "max-w-md")} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-start gap-3">
          {title && <h2 className="text-[26px] font-semibold leading-tight">{title}</h2>}
          <button className="icon-btn ml-auto h-9 w-9 border-transparent" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Empty = ({ children }: { children: ReactNode }) => <p className="py-2 text-muted">{children}</p>;
export const ErrorText = ({ children }: { children: ReactNode }) => <p className="text-[14px] text-danger">{children}</p>;

/** Times like "18:00" or "2026-11-17" as the screen shows them. */
export function niceTime(t?: string) {
  if (!t) return "";
  if (/^\d{2}:\d{2}$/.test(t)) { const [h, m] = t.split(":").map(Number); return new Date(2000, 0, 1, h, m).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
    const d = new Date(`${t}T12:00:00`), today = new Date();
    const diff = Math.round((new Date(d.toDateString()).getTime() - new Date(today.toDateString()).getTime()) / 86400000);
    return diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
  }
  return t;
}
