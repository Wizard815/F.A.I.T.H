import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { EmblemState } from "@web/emblem/Emblem";
import type { ChatEvent, PhotoRef } from "../faith";
import type { FaithBridge } from "../shared";

declare global { interface Window { faith: FaithBridge } }
export const api = window.faith;
export const msg = (e: unknown) => (e instanceof Error ? e.message.replace(/^Error invoking remote method '[^']+': (Error: )?/, "") : String(e));

/** The computer is in dark mode (FAITH follows it). */
export function useDark() {
  const [dark, setDark] = useState(() => matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => { const q = matchMedia("(prefers-color-scheme: dark)"), f = () => setDark(q.matches); q.addEventListener("change", f); return () => q.removeEventListener("change", f); }, []);
  return dark;
}

export type Line = { id: string; who: "me" | "faith"; text: string; images?: string[]; photos?: PhotoRef[]; checking?: string[]; confirm?: { id: string; summary: string; answer?: string }; note?: string; error?: boolean; busy?: boolean };
let seq = 0;
export const lineId = () => `l${++seq}`;

/** FAITH writes a little Markdown: **bold**, lists, paragraphs. Shown as text, never as HTML. */
export function Rich({ text }: { text: string }) {
  const bold = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((p, i) => (/^\*\*[^*]+\*\*$/.test(p) ? <strong key={i}>{p.slice(2, -2)}</strong> : p));
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => { if (list.length) blocks.push(<ul key={blocks.length} className="ml-5 list-disc">{list.map((l, i) => <li key={i}>{bold(l)}</li>)}</ul>); list = []; };
  for (const line of text.split("\n")) {
    const m = /^\s*(?:[-*•]|\d+\.)\s+(.*)$/.exec(line);
    if (m) { list.push(m[1]); continue; }
    flush();
    if (line.trim()) blocks.push(<p key={blocks.length}>{bold(line)}</p>);
  }
  flush();
  return <div className="flex flex-col gap-2">{blocks}</div>;
}

export const friendly = (name: string) => {
  if (name.includes("day") || name.includes("calendar")) return "checking the calendar";
  if (name.includes("shopping")) return "checking the shopping list";
  if (name.includes("meal") || name.includes("recipe")) return "checking meals";
  if (name.startsWith("Hass") || name.startsWith("home_") || name.includes("camera")) return "checking the house";
  if (/notes|wiki|memory|context/.test(name)) return "checking your notes";
  if (name.startsWith("coinpile")) return "checking money";
  if (name.startsWith("photos_")) return "looking through photos";
  return "checking";
};

/** A photo as FAITH wants it: upright, at most 1600 px on its long side, JPEG. */
export async function shrink(file: Blob): Promise<string> {
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}

/** Photos an answer showed (Immich). A click opens the photo in Immich, in the browser. */
export function Photos({ photos }: { photos: PhotoRef[] }) {
  const [src, setSrc] = useState<Record<string, string>>({});
  useEffect(() => {
    let live = true;
    for (const p of photos) api.photo(p.source, p.id).then((u) => live && setSrc((m) => ({ ...m, [p.id]: u }))).catch(() => {});
    return () => { live = false; };
  }, [photos.map((p) => p.id).join()]);
  const label = (p: PhotoRef) => [p.kind === "video" ? "Video" : "Photo", p.taken && `from ${p.taken.slice(0, 10)}`, p.place && `in ${p.place}`, p.people?.length && `with ${p.people.join(", ")}`].filter(Boolean).join(" ");
  return (
    <ul className="mt-3 grid w-72 max-w-full grid-cols-3 gap-2" aria-label={`${photos.length} photo${photos.length > 1 ? "s" : ""}`}>
      {photos.map((p) => (
        <li key={p.id}>
          <button type="button" className="relative block aspect-square w-full overflow-hidden rounded-input bg-surface-2" title={label(p)}
            aria-label={`${label(p)}${p.link ? ". Opens in Immich." : ""}`} onClick={() => p.link && api.openLink(p.link)}>
            {src[p.id] && <img src={src[p.id]} alt="" className="h-full w-full object-cover" />}
            {p.kind === "video" && <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-2 text-[11px] text-white">Video</span>}
          </button>
        </li>
      ))}
    </ul>
  );
}


const rms = (an: AnalyserNode) => { const a = new Uint8Array(an.fftSize); an.getByteTimeDomainData(a); let s = 0; for (const v of a) s += ((v - 128) / 128) ** 2; return Math.min(1, Math.sqrt(s / a.length) * 4); };
let ctx: AudioContext | undefined;
const audioCtx = () => (ctx ??= new AudioContext());

/** One conversation with FAITH, shared by every layout: asking (streamed), push-to-talk,
 *  reading answers aloud, and Yes/No on held changes. `spoken`: FAITH answers in a few
 *  plain sentences, for reading aloud. `history`: show the last conversation (the voice layouts
 *  start on a clean screen; the conversation itself carries on). `state` and `level` drive the emblem. */
export function useTalk(readAloud: boolean, spoken = false, history = true) {
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [rec, setRec] = useState<MediaRecorder | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const current = useRef<{ ask: string; line: string; answer: string } | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null), meter = useRef<AnalyserNode | null>(null);
  const aloud = useRef(readAloud);
  aloud.current = readAloud;
  const update = (id: string, f: (l: Line) => Line) => setLines((ls) => ls.map((l) => (l.id === id ? f(l) : l)));

  const quiet = useCallback(() => { audio.current?.pause(); audio.current = null; meter.current = null; setSpeaking(false); }, []);
  const speak = useCallback(async (t: string) => {
    try {
      const mp3 = await api.speak(t);
      quiet();
      const a = new Audio(URL.createObjectURL(new Blob([mp3], { type: "audio/mpeg" })));
      try { const node = audioCtx().createAnalyser(); node.fftSize = 512; audioCtx().createMediaElementSource(a).connect(node); node.connect(audioCtx().destination); meter.current = node; await audioCtx().resume(); } catch { /* no meter */ }
      audio.current = a; setSpeaking(true);
      const done = () => { if (audio.current === a) { audio.current = null; meter.current = null; setSpeaking(false); } };
      a.onended = done; a.onerror = done;
      await a.play();
    } catch (e) { setSpeaking(false); setStatus(`Couldn't read it aloud: ${msg(e)}`); }
  }, [quiet]);

  const onEvent = useCallback((id: string, e: ChatEvent) => {
    const cur = current.current;
    if (!cur || cur.ask !== id) return;
    const L = cur.line;
    if (e.type === "text") { cur.answer += e.delta; update(L, (l) => ({ ...l, text: cur.answer })); }
    else if (e.type === "tool") { const w = friendly(e.name); setStatus(`FAITH is ${w}…`); update(L, (l) => ({ ...l, checking: [...new Set([...(l.checking || []), w])] })); }
    else if (e.type === "photos") update(L, (l) => ({ ...l, photos: e.items }));
    else if (e.type === "confirm") setLines((ls) => [...ls, { id: lineId(), who: "faith", text: "", confirm: { id: e.id, summary: e.summary } }]);
    else if (e.type === "approval") setLines((ls) => [...ls, { id: lineId(), who: "faith", text: "", note: `Sent to a grown-up to approve: ${e.summary}` }]);
    else if (e.type === "done") {
      cur.answer = e.text || cur.answer;
      update(L, (l) => ({ ...l, text: cur.answer, busy: false }));
      setStatus("FAITH answered."); setBusy(null); current.current = null;
      if (aloud.current && cur.answer.trim()) void speak(cur.answer);
    } else if (e.type === "error") {
      update(L, (l) => ({ ...l, text: e.message, error: true, busy: false }));
      setStatus(e.message); setBusy(null); current.current = null;
    }
  }, [speak]);

  useEffect(() => {
    if (history) api.latest().then((ms) => setLines(ms.filter((m) => m.role === "user" || m.role === "assistant").map((m) => ({ id: lineId(), who: m.role === "user" ? "me" : "faith", text: m.content })))).catch(() => {});
    return api.onChat(onEvent);
  }, [onEvent, history]);

  const ask = useCallback(async (q: string, imgs: string[] = []) => {
    const t = q.trim() || (imgs.length ? "What's in this photo?" : "");
    if (!t || current.current) return;
    quiet();
    const L = lineId();
    setLines((ls) => [...ls, { id: lineId(), who: "me", text: t, images: imgs }, { id: L, who: "faith", text: "", busy: true }]);
    setStatus("FAITH is thinking…");
    current.current = { ask: "", line: L, answer: "" };
    try {
      const id = await api.ask({ text: t, images: imgs, spoken });
      current.current = { ask: id, line: L, answer: "" }; setBusy(id);
    } catch (e) { current.current = null; update(L, (l) => ({ ...l, text: msg(e), error: true, busy: false })); setStatus(msg(e)); }
  }, [quiet, spoken]);

  const answer = useCallback(async (line: Line, approve: boolean) => {
    if (!line.confirm) return;
    try {
      const r = await api.confirm(line.confirm.id, approve);
      const said = r.text || (approve ? "Done." : "Cancelled.");
      update(line.id, (l) => ({ ...l, confirm: { ...l.confirm!, answer: said } }));
      setStatus(said);
      if (aloud.current) void speak(said);
    } catch (e) { update(line.id, (l) => ({ ...l, confirm: { ...l.confirm!, answer: msg(e) } })); setStatus(msg(e)); }
  }, [speak]);

  /** Click to talk, click again to send. */
  const talk = useCallback(async () => {
    if (rec) { rec.stop(); return; }
    quiet();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const r = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" }), parts: Blob[] = [];
      try { const node = audioCtx().createAnalyser(); node.fftSize = 512; audioCtx().createMediaStreamSource(stream).connect(node); meter.current = node; await audioCtx().resume(); } catch { /* no meter */ }
      r.ondataavailable = (e) => parts.push(e.data);
      r.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop()); setRec(null); meter.current = null;
        const blob = new Blob(parts, { type: "audio/webm" });
        if (blob.size < 2000) { setStatus("That was too short. Talk, then send it."); return; }
        setStatus("Listening back…");
        try {
          const heard = await api.transcribe(await blob.arrayBuffer(), "audio/webm");
          if (!heard) { setStatus("I didn't catch that."); return; }
          void ask(heard);
        } catch (e) { setStatus(msg(e)); }
      };
      r.start(); setRec(r); setStatus("Listening. Send it when you're done.");
    } catch { setStatus("FAITH can't use the microphone. Allow it in your computer's privacy settings."); }
  }, [rec, quiet, ask]);
  const cancel = useCallback(() => {
    if (rec) { rec.onstop = null as any; rec.stream.getTracks().forEach((t) => t.stop()); rec.stop(); setRec(null); meter.current = null; setStatus("Stopped listening."); }
    else quiet();
  }, [rec, quiet]);

  const newTopic = useCallback(async () => { await api.newTopic(); quiet(); setLines([]); setStatus("A fresh start."); }, [quiet]);
  const level = useCallback(() => (meter.current ? rms(meter.current) : undefined), []);
  const state: EmblemState = rec ? "listening" : busy ? "thinking" : speaking ? "speaking" : "idle";
  return { lines, setLines, busy, status, setStatus, rec, speaking, state, level, ask, answer, talk, cancel, speak, quiet, newTopic };
}
