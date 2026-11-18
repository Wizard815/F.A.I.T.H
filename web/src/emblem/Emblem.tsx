import { useEffect, useRef } from "react";
import { EmblemRenderer, type EmblemState, type EmblemTone } from "./emblem";

export type { EmblemState, EmblemTone };

const reduced = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** FAITH's emblem as a square canvas. `state` shows what the agent is doing. */
export function Emblem({ size = 160, state = "idle", level, tone = "dark", still, className }: { size?: number; state?: EmblemState; level?: number; tone?: EmblemTone; still?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null), r = useRef<EmblemRenderer>();
  useEffect(() => {
    r.current = new EmblemRenderer(ref.current!, { state, level, tone, still: still ?? reduced() });
    return () => r.current?.destroy();
  }, []);
  useEffect(() => { r.current?.set({ state, level, tone, still: still ?? reduced() }); }, [state, level, tone, still]);
  return <canvas ref={ref} className={className} style={{ width: size, height: size, display: "block" }} role="img" aria-label={`FAITH (${state})`} />;
}
