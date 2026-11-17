import { ArrowUpRight } from "lucide-react";
import type { AppLink } from "../api";

/** The family homepage: every app this viewer may open. */
export function AppTiles({ apps, compact }: { apps: AppLink[]; compact?: boolean }) {
  return (
    <div className={compact ? "flex flex-wrap gap-3" : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"}>
      {apps.map((a) => {
        const img = a.icon && /^(https?:|\/)/.test(a.icon);
        const icon = <span className={`grid shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-2 ${compact ? "h-9 w-9 text-[18px]" : "h-14 w-14 text-[28px]"}`}>{img ? <img src={a.icon} alt="" className="h-full w-full object-cover" /> : a.icon || a.name[0]}</span>;
        return compact ? (
          <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="card flex items-center gap-3 py-2 pl-2 pr-4 transition-colors hover:bg-surface-2">
            {icon}<span className="font-medium">{a.name}</span>
          </a>
        ) : (
          <a key={a.id} href={a.url} target="_blank" rel="noreferrer" className="card group flex flex-col gap-4 p-5 transition-colors hover:bg-surface-2">
            <div className="flex items-start justify-between">{icon}<ArrowUpRight size={18} className="text-muted group-hover:text-foreground" /></div>
            <div className="font-serif text-[20px] font-semibold">{a.name}</div>
          </a>
        );
      })}
    </div>
  );
}

export function Apps({ apps, signedIn }: { apps: AppLink[]; signedIn: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 pb-32 pt-6 sm:px-8">
      <div>
        <div className="eyebrow">Everything in one place</div>
        <h1 className="mt-2 text-[34px] font-semibold sm:text-[42px]">Apps</h1>
        {!signedIn && <p className="mt-2 text-muted">Sign in to see your own apps too.</p>}
      </div>
      {apps.length ? <AppTiles apps={apps} /> : <p className="text-muted">No apps are set up yet (apps: in faith.yaml).</p>}
    </div>
  );
}
