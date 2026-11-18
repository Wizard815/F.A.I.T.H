/** FAITH's emblem, drawn live: a turning d20 (an icosahedron) holding a small
 *  hive of low-poly bees tied together with thread, around a glowing core, all
 *  inside two gold rings. Plain canvas 2D and no dependencies, so the admin page
 *  and the Home Assistant cards draw exactly the same thing.
 *
 *  It shows what the agent is doing:
 *    idle       slow turn, a few sparks along the threads
 *    listening  the hive draws in, the core brightens with the voice level
 *    thinking   faster turn, the rings spin up, sparks race along every thread
 *    speaking   the core pulses with the voice */

export type EmblemState = "idle" | "listening" | "thinking" | "speaking";
export type EmblemTone = "dark" | "light";
export type EmblemOptions = {
  state?: EmblemState;
  /** 0..1, the voice level while listening or speaking (a gentle made-up pulse if left out). */
  level?: number;
  /** "dark" for a dark background (bright gold), "light" for paper (deeper gold and brown). */
  tone?: EmblemTone;
  /** Draw one frame and don't animate (reduced motion, thumbnails). */
  still?: boolean;
};

type V = [number, number, number];
type P = { x: number; y: number; z: number; s: number };

const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;

// ---- the d20 ----
const ICO: V[] = (() => {
  const n = Math.hypot(1, PHI), out: V[] = [];
  for (const a of [-1, 1]) for (const b of [-PHI, PHI]) out.push([0, a / n, b / n], [a / n, b / n, 0], [b / n, 0, a / n]);
  return out;
})();
const d2 = (a: V, b: V) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
const EDGE2 = 4 / (1 + PHI * PHI);
const EDGES: [number, number][] = [];
for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) if (Math.abs(d2(ICO[i], ICO[j]) - EDGE2) < 0.01) EDGES.push([i, j]);
const FACES: [number, number, number][] = [];
const isEdge = (i: number, j: number) => EDGES.some(([a, b]) => (a === i && b === j) || (a === j && b === i));
for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) for (let k = j + 1; k < 12; k++) if (isEdge(i, j) && isEdge(j, k) && isEdge(i, k)) FACES.push([i, j, k]);

// ---- the hive: bees, the threads between them, and a few tied to the shell ----
const BEES = 7;
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const BEE = Array.from({ length: BEES }, (_, i) => ({
  a: [0, 1, 2].map((k) => 0.3 + 0.16 * rnd(i * 9 + k)) as V,
  w: [0, 1, 2].map((k) => 0.22 + 0.3 * rnd(i * 9 + k + 3)) as V,
  p: [0, 1, 2].map((k) => TAU * rnd(i * 9 + k + 6)) as V,
  flap: TAU * rnd(i * 3 + 100),
}));
type Link = { a: number; b: number; kind: "core" | "bee" | "shell"; seed: number };
const CORE = -1;
const LINKS: Link[] = [];
for (let i = 0; i < BEES; i++) LINKS.push({ a: CORE, b: i, kind: "core", seed: rnd(i + 40) });
for (let i = 0; i < BEES; i++) LINKS.push({ a: i, b: (i + 1) % BEES, kind: "bee", seed: rnd(i + 60) });
for (const [a, b] of [[0, 3], [2, 5], [4, 6]]) LINKS.push({ a, b, kind: "bee", seed: rnd(a * 7 + b) });
for (const [a, v] of [[1, 0], [3, 7], [5, 10]]) LINKS.push({ a, b: v, kind: "shell", seed: rnd(a + v * 3) });

// ---- the rings (an armillary pair) ----
const RINGS = [
  { r: 1.34, tiltX: 1.12, tiltZ: 0.38, precess: 0.21, phase: 0, width: 0.024, ticks: 36 },
  { r: 1.5, tiltX: 1.38, tiltZ: -0.62, precess: -0.15, phase: Math.PI / 2, width: 0.016, ticks: 0 },
];

const rotX = ([x, y, z]: V, a: number): V => { const c = Math.cos(a), s = Math.sin(a); return [x, y * c - z * s, y * s + z * c]; };
const rotY = ([x, y, z]: V, a: number): V => { const c = Math.cos(a), s = Math.sin(a); return [x * c + z * s, y, -x * s + z * c]; };
const rotZ = ([x, y, z]: V, a: number): V => { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c, z]; };

const PALETTE = {
  dark: {
    edge: [244, 214, 140], edgeBack: [176, 132, 62], face: [226, 178, 88], thread: [238, 206, 140], spark: [255, 236, 180],
    ringHi: [246, 216, 132], ringLo: [128, 92, 38], glow: [232, 166, 58],
    bee: [[232, 184, 82], [246, 212, 128], [196, 146, 58]], stripe: [46, 30, 18], head: [52, 34, 20], wing: [255, 242, 214], core: [255, 222, 140],
  },
  light: {
    edge: [112, 74, 20], edgeBack: [168, 130, 76], face: [176, 128, 44], thread: [104, 70, 36], spark: [204, 136, 26],
    ringHi: [176, 122, 30], ringLo: [138, 104, 60], glow: [222, 170, 80],
    bee: [[214, 160, 60], [236, 192, 102], [176, 124, 40]], stripe: [52, 34, 20], head: [58, 38, 22], wing: [255, 248, 230], core: [214, 156, 50],
  },
} as const;
type Pal = (typeof PALETTE)["dark"];
const rgba = (c: readonly number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a))})`;

const TARGETS: Record<EmblemState, { spin: number; bees: number; rings: number; sparks: number; glow: number; gather: number }> = {
  idle: { spin: 0.16, bees: 1, rings: 1, sparks: 0.3, glow: 0.45, gather: 0 },
  listening: { spin: 0.1, bees: 0.7, rings: 0.6, sparks: 0.2, glow: 0.6, gather: 0.3 },
  thinking: { spin: 0.55, bees: 1.9, rings: 3.2, sparks: 1, glow: 0.8, gather: 0.1 },
  speaking: { spin: 0.22, bees: 1.2, rings: 1.4, sparks: 0.55, glow: 0.55, gather: 0 },
};

export class EmblemRenderer {
  private ctx: CanvasRenderingContext2D;
  private opts: Required<Omit<EmblemOptions, "level">> & { level?: number };
  private raf = 0;
  private last = 0;
  private t = 0;
  private acc = { spin: 0.6, bees: 3, rings: 1.2, sparks: 0 };
  private cur = { ...TARGETS.idle };
  private ro?: ResizeObserver;
  private heading: number[] = new Array(BEES).fill(0);
  private w = 0; private h = 0; private dpr = 1;

  constructor(private canvas: HTMLCanvasElement, opts: EmblemOptions = {}) {
    this.ctx = canvas.getContext("2d")!;
    this.opts = { state: "idle", tone: "dark", still: false, ...opts };
    this.cur = { ...TARGETS[this.opts.state] };
    this.resize();
    if (typeof ResizeObserver !== "undefined") { this.ro = new ResizeObserver(() => { this.resize(); if (this.opts.still) this.frame(0); }); this.ro.observe(canvas); }
    this.opts.still ? this.frame(0) : this.loop();
  }

  set(o: EmblemOptions) {
    const was = this.opts.still;
    this.opts = { ...this.opts, ...o };
    if (this.opts.still) { cancelAnimationFrame(this.raf); this.raf = 0; this.cur = { ...TARGETS[this.opts.state] }; this.frame(0); }
    else if (was || !this.raf) this.loop();
  }

  destroy() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro?.disconnect(); }

  private resize() {
    this.dpr = Math.min(2, (typeof devicePixelRatio === "number" && devicePixelRatio) || 1);
    const r = this.canvas.getBoundingClientRect();
    this.w = Math.max(1, Math.round((r.width || this.canvas.width) * this.dpr));
    this.h = Math.max(1, Math.round((r.height || this.canvas.height) * this.dpr));
    if (this.canvas.width !== this.w) this.canvas.width = this.w;
    if (this.canvas.height !== this.h) this.canvas.height = this.h;
  }

  private loop() {
    this.last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.frame(dt);
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  }

  private frame(dt: number) {
    const tg = TARGETS[this.opts.state], k = Math.min(1, dt * 2.5);
    for (const key of Object.keys(tg) as (keyof typeof tg)[]) this.cur[key] += (tg[key] - this.cur[key]) * k;
    this.t += dt;
    this.acc.spin += this.cur.spin * dt;
    this.acc.bees += this.cur.bees * dt;
    this.acc.rings += this.cur.rings * dt;
    this.acc.sparks += (0.25 + this.cur.sparks * 0.9) * dt;
    this.draw();
  }

  private level() {
    const s = this.opts.state;
    if (s !== "listening" && s !== "speaking") return 0;
    if (typeof this.opts.level === "number") return Math.max(0, Math.min(1, this.opts.level));
    const t = this.t;
    return s === "speaking" ? 0.5 + 0.5 * Math.sin(t * 9) * Math.sin(t * 2.3) : 0.3 + 0.2 * Math.sin(t * 3);
  }

  private draw() {
    const { ctx, w, h } = this, pal: Pal = PALETTE[this.opts.tone] as Pal;
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 / 1.86;
    const CAM = 5;
    const lvl = this.level();
    const ay = this.acc.spin, ax = 0.38 + 0.12 * Math.sin(this.t * 0.31), az = 0.08 * Math.sin(this.t * 0.23);
    const turn = (v: V) => rotX(rotZ(rotY(v, ay), az), ax);
    const proj = (v: V): P => { const s = CAM / (CAM - v[2]); return { x: cx + v[0] * R * s, y: cy - v[1] * R * s, z: v[2], s }; };
    const depth = (z: number) => (z + 1) / 2; // 0 back .. 1 front

    ctx.clearRect(0, 0, w, h);

    // glow behind everything
    const glow = this.cur.glow + lvl * 0.5;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.6);
    g.addColorStop(0, rgba(pal.glow, 0.26 * glow));
    g.addColorStop(0.45, rgba(pal.glow, 0.1 * glow));
    g.addColorStop(1, rgba(pal.glow, 0));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // rings: work out every segment once, draw the back halves now and the front later
    type Seg = { a: P; b: P; z: number; wd: number };
    const ringSegs: Seg[][] = [], ringMarks: { a: P; b: P; z: number }[][] = [], beads: P[] = [];
    RINGS.forEach((rg, ri) => {
      const pre = rg.phase + this.acc.rings * rg.precess;
      const place = (u: number, rr = rg.r): V => rotY(rotZ(rotX([Math.cos(u) * rr, 0, Math.sin(u) * rr], rg.tiltX), rg.tiltZ), pre);
      const N = 96, segs: Seg[] = [];
      let prev = proj(place(0));
      for (let i = 1; i <= N; i++) {
        const v = place((i / N) * TAU), p = proj(v);
        segs.push({ a: prev, b: p, z: (prev.z + p.z) / 2, wd: rg.width });
        prev = p;
      }
      ringSegs.push(segs);
      const marks: { a: P; b: P; z: number }[] = [];
      const spin = this.acc.rings * 0.35 * (ri ? -1 : 1);
      for (let i = 0; i < rg.ticks; i++) {
        const u = (i / rg.ticks) * TAU + spin, long = i % 3 === 0 ? 0.07 : 0.035;
        const a = proj(place(u, rg.r - long)), b = proj(place(u, rg.r + long));
        marks.push({ a, b, z: (a.z + b.z) / 2 });
      }
      ringMarks.push(marks);
      if (ri === 0) for (const off of [0, Math.PI]) beads.push(proj(place(spin * 1.6 + off)));
      else beads.push(proj(place(-spin * 1.2 + 1)));
    });
    const drawRings = (front: boolean) => {
      ctx.lineCap = "round";
      ringSegs.forEach((segs) => {
        for (const s of segs) {
          if ((s.z >= 0) !== front) continue;
          const d = depth(s.z);
          ctx.strokeStyle = `rgb(${pal.ringLo.map((lo, i) => Math.round(lo + (pal.ringHi[i] - lo) * d)).join(",")})`;
          ctx.globalAlpha = front ? 1 : 0.55;
          ctx.lineWidth = Math.max(this.dpr * 1.2, R * s.wd * s.a.s);
          ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.stroke();
        }
      });
      ctx.lineWidth = R * 0.008;
      for (const marks of ringMarks) for (const m of marks) {
        if ((m.z >= 0) !== front) continue;
        ctx.strokeStyle = rgba(pal.ringHi, (front ? 0.9 : 0.35) * (0.4 + 0.6 * depth(m.z)));
        ctx.beginPath(); ctx.moveTo(m.a.x, m.a.y); ctx.lineTo(m.b.x, m.b.y); ctx.stroke();
      }
      for (const b of beads) {
        if ((b.z >= 0) !== front) continue;
        ctx.globalAlpha = front ? 1 : 0.5;
        const r = R * 0.034 * b.s, gg = ctx.createRadialGradient(b.x - r * 0.3, b.y - r * 0.3, r * 0.1, b.x, b.y, r);
        gg.addColorStop(0, rgba(pal.spark, 1)); gg.addColorStop(1, rgba(pal.ringLo, 1));
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    drawRings(false);

    // the shell
    const V3 = ICO.map(turn), VP = V3.map(proj);
    const edge = (front: boolean) => {
      for (const [i, j] of EDGES) {
        const z = (V3[i][2] + V3[j][2]) / 2;
        if ((z >= -0.05) !== front) continue;
        ctx.strokeStyle = front ? rgba(pal.edge, 0.55 + 0.45 * depth(z)) : rgba(pal.edgeBack, this.opts.tone === "light" ? 0.45 : 0.32);
        ctx.lineWidth = Math.max(this.dpr * (front ? 1 : 0.6), R * (front ? 0.013 : 0.008));
        ctx.beginPath(); ctx.moveTo(VP[i].x, VP[i].y); ctx.lineTo(VP[j].x, VP[j].y); ctx.stroke();
      }
    };
    edge(false);

    // the hive inside
    const gather = 1 - this.cur.gather;
    const bees = BEE.map((b) => {
      const at = (T: number): V => [b.a[0] * Math.sin(b.w[0] * T + b.p[0]) * gather, b.a[1] * Math.sin(b.w[1] * T + b.p[1]) * gather, b.a[2] * Math.cos(b.w[2] * T + b.p[2]) * gather];
      const v = turn(at(this.acc.bees)), next = proj(turn(at(this.acc.bees + 0.05)));
      return { v, p: proj(v), next };
    });
    const core = proj([0, 0, 0]);
    const nodeAt = (n: number, kind: Link["kind"], end: "a" | "b") => (end === "a" && n === CORE ? core : kind === "shell" && end === "b" ? VP[n] : bees[n].p);
    const threads = LINKS.map((l) => ({ l, A: nodeAt(l.a, l.kind, "a"), B: nodeAt(l.b, l.kind, "b") }));
    const curve = (A: P, B: P) => {
      const len = Math.hypot(B.x - A.x, B.y - A.y);
      return { mx: (A.x + B.x) / 2, my: (A.y + B.y) / 2 + len * 0.12 };
    };
    ctx.lineCap = "round";
    for (const { l, A, B } of threads) {
      const { mx, my } = curve(A, B), z = (A.z + B.z) / 2;
      ctx.strokeStyle = rgba(pal.thread, (l.kind === "core" ? 0.6 : l.kind === "shell" ? 0.35 : 0.5) * (0.5 + 0.5 * depth(z)));
      ctx.lineWidth = Math.max(this.dpr * 0.6, R * (l.kind === "core" ? 0.009 : 0.0065));
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.quadraticCurveTo(mx, my, B.x, B.y); ctx.stroke();
    }
    // sparks travelling along the threads
    for (const { l, A, B } of threads) {
      if (l.kind === "shell") continue;
      const on = this.cur.sparks;
      if (l.seed > on + 0.15) continue;
      const u = (this.acc.sparks * (0.6 + l.seed) + l.seed * 7) % 1;
      const { mx, my } = curve(A, B), q = 1 - u;
      const x = q * q * A.x + 2 * q * u * mx + u * u * B.x, y = q * q * A.y + 2 * q * u * my + u * u * B.y;
      const r = R * 0.018 * (0.6 + on * 0.6), fade = Math.sin(u * Math.PI);
      const gg = ctx.createRadialGradient(x, y, 0, x, y, r * 2.4);
      gg.addColorStop(0, rgba(pal.spark, 0.95 * fade)); gg.addColorStop(1, rgba(pal.spark, 0));
      ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, r * 2.4, 0, TAU); ctx.fill();
    }

    // the core: a small glowing hexagon, the agent at the middle of it all
    const coreR = R * (0.085 + 0.035 * lvl + 0.01 * Math.sin(this.t * 2));
    const cg = ctx.createRadialGradient(core.x, core.y, 0, core.x, core.y, coreR * 3.2);
    cg.addColorStop(0, rgba(pal.core, 0.55 * glow)); cg.addColorStop(1, rgba(pal.core, 0));
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(core.x, core.y, coreR * 3.2, 0, TAU); ctx.fill();
    this.hex(core.x, core.y, coreR, this.acc.spin * 0.5, pal);

    // bees, back to front
    const order = bees.map((b, i) => i).sort((i, j) => bees[i].v[2] - bees[j].v[2]);
    for (const i of order) {
      const b = bees[i], want = Math.atan2(b.next.y - b.p.y, b.next.x - b.p.x);
      let dh = want - this.heading[i];
      dh = ((dh + Math.PI) % TAU + TAU) % TAU - Math.PI;
      this.heading[i] += this.opts.still ? dh : dh * 0.15;
      const flap = 0.35 + 0.65 * Math.abs(Math.sin(this.t * 26 + BEE[i].flap));
      this.bee(b.p.x, b.p.y, R * 0.15 * b.p.s, this.heading[i], flap, 0.55 + 0.45 * depth(b.v[2]), pal);
    }

    // glassy front faces, then the front edges and corners
    const light: V = [-0.4, 0.6, 0.7];
    for (const [i, j, k] of FACES) {
      const a = V3[i], b = V3[j], c = V3[k];
      const n: V = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
      if (n[2] <= 0) continue;
      const lit = Math.max(0, (n[0] * light[0] + n[1] * light[1] + n[2] * light[2]) / Math.hypot(...n));
      ctx.fillStyle = rgba(pal.face, 0.03 + 0.07 * lit * lit);
      ctx.beginPath(); ctx.moveTo(VP[i].x, VP[i].y); ctx.lineTo(VP[j].x, VP[j].y); ctx.lineTo(VP[k].x, VP[k].y); ctx.closePath(); ctx.fill();
    }
    edge(true);
    for (let i = 0; i < 12; i++) {
      if (V3[i][2] < -0.05) continue;
      ctx.fillStyle = rgba(pal.edge, 0.6 + 0.4 * depth(V3[i][2]));
      ctx.beginPath(); ctx.arc(VP[i].x, VP[i].y, R * 0.02 * VP[i].s, 0, TAU); ctx.fill();
    }

    drawRings(true);
  }

  private hex(x: number, y: number, r: number, rot: number, pal: Pal) {
    const { ctx } = this, pts = Array.from({ length: 6 }, (_, i) => [x + r * Math.cos(rot + (i * TAU) / 6), y + r * Math.sin(rot + (i * TAU) / 6)]);
    for (let i = 0; i < 6; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % 6];
      ctx.fillStyle = rgba(pal.bee[i % 3], 1);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ax, ay); ctx.lineTo(bx, by); ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle = rgba(pal.spark, 0.9); ctx.lineWidth = r * 0.12;
    ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); ctx.stroke();
  }

  /** One low-poly bee seen from above, facing +x in its own space. */
  private bee(x: number, y: number, k: number, ang: number, flap: number, alpha: number, pal: Pal) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k);
    ctx.globalAlpha = alpha;
    const poly = (pts: number[][]) => { ctx.beginPath(); pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); };
    // stinger
    ctx.fillStyle = rgba(pal.head, 1); poly([[-1.02, -0.08], [-1.28, 0], [-1.02, 0.08]]); ctx.fill();
    // abdomen and thorax as facets
    const body = [[-1.05, 0], [-0.78, -0.4], [-0.2, -0.5], [0.28, -0.36], [0.46, 0], [0.28, 0.36], [-0.2, 0.5], [-0.78, 0.4]];
    const c = [-0.3, 0];
    for (let i = 0; i < body.length; i++) { ctx.fillStyle = rgba(pal.bee[i % 3], 1); poly([c, body[i], body[(i + 1) % body.length]]); ctx.fill(); }
    ctx.save(); poly(body); ctx.clip();
    ctx.fillStyle = rgba(pal.stripe, 0.92);
    poly([[-0.26, -0.6], [-0.44, -0.6], [-0.5, 0.6], [-0.32, 0.6]]); ctx.fill();
    poly([[-0.64, -0.6], [-0.8, -0.6], [-0.86, 0.6], [-0.7, 0.6]]); ctx.fill();
    ctx.restore();
    // head, eyes, feelers
    ctx.fillStyle = rgba(pal.head, 1); poly([[0.42, 0], [0.58, -0.27], [0.86, -0.2], [0.95, 0], [0.86, 0.2], [0.58, 0.27]]); ctx.fill();
    ctx.fillStyle = rgba(pal.bee[1], 0.9); poly([[0.7, -0.2], [0.84, -0.14], [0.74, -0.08]]); ctx.fill(); poly([[0.7, 0.2], [0.84, 0.14], [0.74, 0.08]]); ctx.fill();
    ctx.strokeStyle = rgba(pal.head, 1); ctx.lineWidth = 0.06; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(0.9, -0.1); ctx.lineTo(1.08, -0.2); ctx.lineTo(1.2, -0.4); ctx.moveTo(0.9, 0.1); ctx.lineTo(1.08, 0.2); ctx.lineTo(1.2, 0.4); ctx.stroke();
    // wings (the span beats)
    for (const side of [-1, 1]) {
      const f = side * flap;
      const wing = [[0.22, 0.16 * side], [0.05, 1.08 * f], [-0.5, 0.92 * f], [-0.22, 0.24 * side]];
      ctx.fillStyle = rgba(pal.wing, 0.38); poly(wing); ctx.fill();
      ctx.strokeStyle = rgba(pal.bee[1], 0.85); ctx.lineWidth = 0.04; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0.05, 0.2 * side); ctx.lineTo(-0.22, 0.95 * f); ctx.stroke();
    }
    ctx.restore();
  }
}
