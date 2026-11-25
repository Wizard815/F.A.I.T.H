package family.faith.app

import android.provider.Settings
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipPath
import androidx.compose.ui.graphics.drawscope.withTransform
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.Dp
import kotlin.math.*

/** FAITH's emblem, as the web screens draw it (web/src/emblem/emblem.ts): a turning d20 holding a
 *  small hive of low-poly bees tied together with thread, around a glowing core, inside two gold
 *  rings. It shows what FAITH is doing:
 *    idle       slow turn, a few sparks along the threads
 *    listening  the hive draws in, the core brightens with the voice level
 *    thinking   faster turn, the rings spin up, sparks race along every thread
 *    speaking   the core pulses with the voice */
enum class EmblemState { IDLE, LISTENING, THINKING, SPEAKING }

private typealias V = DoubleArray
private const val TAU = PI * 2

/** The emblem's shapes and motion, without any drawing: plain Kotlin, so it's tested. */
class EmblemEngine {
    companion object {
        private val PHI = (1 + sqrt(5.0)) / 2
        /** The d20's 12 corners, 30 edges and 20 faces. */
        val ICO: List<V> = run {
            val n = hypot(1.0, PHI); val out = mutableListOf<V>()
            for (a in listOf(-1.0, 1.0)) for (b in listOf(-PHI, PHI)) { out += doubleArrayOf(0.0, a / n, b / n); out += doubleArrayOf(a / n, b / n, 0.0); out += doubleArrayOf(b / n, 0.0, a / n) }
            out
        }
        private fun d2(a: V, b: V) = (a[0] - b[0]).pow(2) + (a[1] - b[1]).pow(2) + (a[2] - b[2]).pow(2)
        private val EDGE2 = 4 / (1 + PHI * PHI)
        val EDGES: List<Pair<Int, Int>> = (0 until 12).flatMap { i -> (i + 1 until 12).filter { j -> abs(d2(ICO[i], ICO[j]) - EDGE2) < 0.01 }.map { i to it } }
        private fun isEdge(i: Int, j: Int) = EDGES.any { (a, b) -> (a == i && b == j) || (a == j && b == i) }
        val FACES: List<Triple<Int, Int, Int>> = buildList {
            for (i in 0 until 12) for (j in i + 1 until 12) for (k in j + 1 until 12) if (isEdge(i, j) && isEdge(j, k) && isEdge(i, k)) add(Triple(i, j, k))
        }

        const val BEES = 7
        fun rnd(i: Int): Double { val x = sin(i * 127.1 + 311.7) * 43758.5453; return x - floor(x) }
        class Bee(val a: V, val w: V, val p: V, val flap: Double)
        val BEE = List(BEES) { i -> Bee(DoubleArray(3) { 0.3 + 0.16 * rnd(i * 9 + it) }, DoubleArray(3) { 0.22 + 0.3 * rnd(i * 9 + it + 3) }, DoubleArray(3) { TAU * rnd(i * 9 + it + 6) }, TAU * rnd(i * 3 + 100)) }
        enum class Kind { CORE, BEE, SHELL }
        class Link(val a: Int, val b: Int, val kind: Kind, val seed: Double)
        const val CORE = -1
        val LINKS: List<Link> = buildList {
            for (i in 0 until BEES) add(Link(CORE, i, Kind.CORE, rnd(i + 40)))
            for (i in 0 until BEES) add(Link(i, (i + 1) % BEES, Kind.BEE, rnd(i + 60)))
            for ((a, b) in listOf(0 to 3, 2 to 5, 4 to 6)) add(Link(a, b, Kind.BEE, rnd(a * 7 + b)))
            for ((a, v) in listOf(1 to 0, 3 to 7, 5 to 10)) add(Link(a, v, Kind.SHELL, rnd(a + v * 3)))
        }
        class Ring(val r: Double, val tiltX: Double, val tiltZ: Double, val precess: Double, val phase: Double, val width: Double, val ticks: Int)
        val RINGS = listOf(Ring(1.34, 1.12, 0.38, 0.21, 0.0, 0.024, 36), Ring(1.5, 1.38, -0.62, -0.15, PI / 2, 0.016, 0))

        fun rotX(v: V, a: Double): V { val c = cos(a); val s = sin(a); return doubleArrayOf(v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c) }
        fun rotY(v: V, a: Double): V { val c = cos(a); val s = sin(a); return doubleArrayOf(v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c) }
        fun rotZ(v: V, a: Double): V { val c = cos(a); val s = sin(a); return doubleArrayOf(v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]) }

        data class Mood(val spin: Double, val bees: Double, val rings: Double, val sparks: Double, val glow: Double, val gather: Double)
        val TARGETS = mapOf(
            EmblemState.IDLE to Mood(0.16, 1.0, 1.0, 0.3, 0.45, 0.0),
            EmblemState.LISTENING to Mood(0.1, 0.7, 0.6, 0.2, 0.6, 0.3),
            EmblemState.THINKING to Mood(0.55, 1.9, 3.2, 1.0, 0.8, 0.1),
            EmblemState.SPEAKING to Mood(0.22, 1.2, 1.4, 0.55, 0.55, 0.0),
        )
    }

    var state = EmblemState.IDLE
    var t = 0.0; private set
    var cur = TARGETS.getValue(EmblemState.IDLE); private set
    var spin = 0.6; private set
    var bees = 3.0; private set
    var rings = 1.2; private set
    var sparks = 0.0; private set
    val heading = DoubleArray(BEES)

    /** Move on by `dt` seconds, easing towards the current state's mood. */
    fun step(dt: Double) {
        val d = min(0.05, max(0.0, dt))
        val tg = TARGETS.getValue(state); val k = min(1.0, d * 2.5)
        fun ease(a: Double, b: Double) = a + (b - a) * k
        cur = Mood(ease(cur.spin, tg.spin), ease(cur.bees, tg.bees), ease(cur.rings, tg.rings), ease(cur.sparks, tg.sparks), ease(cur.glow, tg.glow), ease(cur.gather, tg.gather))
        t += d; spin += cur.spin * d; bees += cur.bees * d; rings += cur.rings * d; sparks += (0.25 + cur.sparks * 0.9) * d
    }
    /** Jump straight to a state's mood (reduced motion). */
    fun settle() { cur = TARGETS.getValue(state) }

    /** The voice level, 0..1: the real one when given, else a gentle made-up pulse. Only listening and speaking have one. */
    fun level(given: Float?): Double {
        if (state != EmblemState.LISTENING && state != EmblemState.SPEAKING) return 0.0
        if (given != null) return given.toDouble().coerceIn(0.0, 1.0)
        return if (state == EmblemState.SPEAKING) 0.5 + 0.5 * sin(t * 9) * sin(t * 2.3) else 0.3 + 0.2 * sin(t * 3)
    }

    /** Where one bee is (in the hive's own space) at hive-time `T`. */
    fun beeAt(i: Int, T: Double): V {
        val b = BEE[i]; val g = 1 - cur.gather
        return doubleArrayOf(b.a[0] * sin(b.w[0] * T + b.p[0]) * g, b.a[1] * sin(b.w[1] * T + b.p[1]) * g, b.a[2] * cos(b.w[2] * T + b.p[2]) * g)
    }
}

private class Pal(val edge: IntArray, val edgeBack: IntArray, val face: IntArray, val thread: IntArray, val spark: IntArray, val ringHi: IntArray, val ringLo: IntArray, val glow: IntArray,
                  val bee: List<IntArray>, val stripe: IntArray, val head: IntArray, val wing: IntArray, val core: IntArray)
private fun c(r: Int, g: Int, b: Int) = intArrayOf(r, g, b)
private val DARK = Pal(c(244, 214, 140), c(176, 132, 62), c(226, 178, 88), c(238, 206, 140), c(255, 236, 180), c(246, 216, 132), c(128, 92, 38), c(232, 166, 58),
    listOf(c(232, 184, 82), c(246, 212, 128), c(196, 146, 58)), c(46, 30, 18), c(52, 34, 20), c(255, 242, 214), c(255, 222, 140))
private val LIGHT = Pal(c(112, 74, 20), c(168, 130, 76), c(176, 128, 44), c(104, 70, 36), c(204, 136, 26), c(176, 122, 30), c(138, 104, 60), c(222, 170, 80),
    listOf(c(214, 160, 60), c(236, 192, 102), c(176, 124, 40)), c(52, 34, 20), c(58, 38, 22), c(255, 248, 230), c(214, 156, 50))
// Like the browser's rgba(): every channel clamped (a ring swinging forward mixes past 255).
private fun col(c: IntArray, a: Double) = Color(c[0].coerceIn(0, 255), c[1].coerceIn(0, 255), c[2].coerceIn(0, 255), (a.coerceIn(0.0, 1.0) * 255).roundToInt())

private class P(val x: Float, val y: Float, val z: Double, val s: Double) { val o get() = Offset(x, y) }

/** Draw one frame of the emblem into this square. */
private fun DrawScope.drawEmblem(e: EmblemEngine, dark: Boolean, given: Float?, still: Boolean) {
    val pal = if (dark) DARK else LIGHT
    val cx = size.width / 2; val cy = size.height / 2; val R = min(size.width, size.height) / 2 / 1.86
    val cam = 5.0; val lvl = e.level(given); val t = e.t; val px = density
    val ay = e.spin; val ax = 0.38 + 0.12 * sin(t * 0.31); val az = 0.08 * sin(t * 0.23)
    fun turn(v: V) = EmblemEngine.rotX(EmblemEngine.rotZ(EmblemEngine.rotY(v, ay), az), ax)
    fun proj(v: V): P { val s = cam / (cam - v[2]); return P((cx + v[0] * R * s).toFloat(), (cy - v[1] * R * s).toFloat(), v[2], s) }
    fun depth(z: Double) = (z + 1) / 2

    // glow behind everything
    val glow = e.cur.glow + lvl * 0.5
    drawRect(Brush.radialGradient(0f to col(pal.glow, 0.26 * glow), 0.45f to col(pal.glow, 0.1 * glow), 1f to col(pal.glow, 0.0), center = Offset(cx, cy), radius = (R * 1.6).toFloat()))

    // rings: every segment once; the back halves now, the front ones last
    class Seg(val a: P, val b: P, val z: Double, val wd: Double)
    class Mark(val a: P, val b: P, val z: Double)
    val ringSegs = mutableListOf<List<Seg>>(); val ringMarks = mutableListOf<List<Mark>>(); val beads = mutableListOf<P>()
    EmblemEngine.RINGS.forEachIndexed { ri, rg ->
        val pre = rg.phase + e.rings * rg.precess
        fun place(u: Double, rr: Double = rg.r): V = EmblemEngine.rotY(EmblemEngine.rotZ(EmblemEngine.rotX(doubleArrayOf(cos(u) * rr, 0.0, sin(u) * rr), rg.tiltX), rg.tiltZ), pre)
        val n = 96; val segs = mutableListOf<Seg>(); var prev = proj(place(0.0))
        for (i in 1..n) { val p = proj(place(i.toDouble() / n * TAU)); segs += Seg(prev, p, (prev.z + p.z) / 2, rg.width); prev = p }
        ringSegs += segs
        val spin = e.rings * 0.35 * (if (ri == 1) -1 else 1)
        ringMarks += List(rg.ticks) { i ->
            val u = i.toDouble() / rg.ticks * TAU + spin; val long = if (i % 3 == 0) 0.07 else 0.035
            val a = proj(place(u, rg.r - long)); val b = proj(place(u, rg.r + long)); Mark(a, b, (a.z + b.z) / 2)
        }
        if (ri == 0) for (off in listOf(0.0, PI)) beads += proj(place(spin * 1.6 + off)) else beads += proj(place(-spin * 1.2 + 1))
    }
    fun drawRings(front: Boolean) {
        for (segs in ringSegs) for (s in segs) {
            if ((s.z >= 0) != front) continue
            val d = depth(s.z).coerceIn(0.0, 1.0)
            val mix = IntArray(3) { (pal.ringLo[it] + (pal.ringHi[it] - pal.ringLo[it]) * d).roundToInt() }
            drawLine(col(mix, if (front) 1.0 else 0.55), s.a.o, s.b.o, max(px * 1.2f, (R * s.wd * s.a.s).toFloat()), StrokeCap.Round)
        }
        for (marks in ringMarks) for (m in marks) {
            if ((m.z >= 0) != front) continue
            drawLine(col(pal.ringHi, (if (front) 0.9 else 0.35) * (0.4 + 0.6 * depth(m.z))), m.a.o, m.b.o, (R * 0.008).toFloat(), StrokeCap.Round)
        }
        for (b in beads) {
            if ((b.z >= 0) != front) continue
            val r = (R * 0.034 * b.s).toFloat(); val a = if (front) 1.0 else 0.5
            drawCircle(Brush.radialGradient(listOf(col(pal.spark, a), col(pal.ringLo, a)), center = Offset(b.x - r * 0.3f, b.y - r * 0.3f), radius = r), r, b.o)
        }
    }
    drawRings(false)

    // the shell
    val v3 = EmblemEngine.ICO.map { turn(it) }; val vp = v3.map { proj(it) }
    fun edges(front: Boolean) {
        for ((i, j) in EmblemEngine.EDGES) {
            val z = (v3[i][2] + v3[j][2]) / 2
            if ((z >= -0.05) != front) continue
            val color = if (front) col(pal.edge, 0.55 + 0.45 * depth(z)) else col(pal.edgeBack, if (dark) 0.32 else 0.45)
            drawLine(color, vp[i].o, vp[j].o, max(px * (if (front) 1f else 0.6f), (R * (if (front) 0.013 else 0.008)).toFloat()), StrokeCap.Round)
        }
    }
    edges(false)

    // the hive inside
    class BeeAt(val v: V, val p: P, val next: P)
    val hive = List(EmblemEngine.BEES) { i -> val v = turn(e.beeAt(i, e.bees)); BeeAt(v, proj(v), proj(turn(e.beeAt(i, e.bees + 0.05)))) }
    val core = proj(doubleArrayOf(0.0, 0.0, 0.0))
    fun node(n: Int, kind: EmblemEngine.Companion.Kind, end: Char) = if (end == 'a' && n == EmblemEngine.CORE) core else if (kind == EmblemEngine.Companion.Kind.SHELL && end == 'b') vp[n] else hive[n].p
    class Thread(val l: EmblemEngine.Companion.Link, val a: P, val b: P)
    val threads = EmblemEngine.LINKS.map { Thread(it, node(it.a, it.kind, 'a'), node(it.b, it.kind, 'b')) }
    fun mid(a: P, b: P): Offset { val len = hypot(b.x - a.x, b.y - a.y); return Offset((a.x + b.x) / 2, (a.y + b.y) / 2 + len * 0.12f) }
    for (th in threads) {
        val m = mid(th.a, th.b); val z = (th.a.z + th.b.z) / 2; val k = th.l.kind
        val alpha = (if (k == EmblemEngine.Companion.Kind.CORE) 0.6 else if (k == EmblemEngine.Companion.Kind.SHELL) 0.35 else 0.5) * (0.5 + 0.5 * depth(z))
        val path = Path().apply { moveTo(th.a.x, th.a.y); quadraticBezierTo(m.x, m.y, th.b.x, th.b.y) }
        drawPath(path, col(pal.thread, alpha), style = Stroke(max(px * 0.6f, (R * (if (k == EmblemEngine.Companion.Kind.CORE) 0.009 else 0.0065)).toFloat()), cap = StrokeCap.Round))
    }
    // sparks along the threads
    for (th in threads) {
        if (th.l.kind == EmblemEngine.Companion.Kind.SHELL) continue
        val on = e.cur.sparks
        if (th.l.seed > on + 0.15) continue
        val u = (e.sparks * (0.6 + th.l.seed) + th.l.seed * 7) % 1.0
        val m = mid(th.a, th.b); val q = 1 - u
        val x = (q * q * th.a.x + 2 * q * u * m.x + u * u * th.b.x).toFloat(); val y = (q * q * th.a.y + 2 * q * u * m.y + u * u * th.b.y).toFloat()
        val r = (R * 0.018 * (0.6 + on * 0.6) * 2.4).toFloat(); val fade = sin(u * PI)
        drawCircle(Brush.radialGradient(listOf(col(pal.spark, 0.95 * fade), col(pal.spark, 0.0)), center = Offset(x, y), radius = r), r, Offset(x, y))
    }

    // the core: a small glowing hexagon, FAITH at the middle of it all
    val coreR = (R * (0.085 + 0.035 * lvl + 0.01 * sin(t * 2))).toFloat()
    drawCircle(Brush.radialGradient(listOf(col(pal.core, 0.55 * glow), col(pal.core, 0.0)), center = core.o, radius = coreR * 3.2f), coreR * 3.2f, core.o)
    val rot = e.spin * 0.5
    val hex = List(6) { i -> Offset(core.x + coreR * cos(rot + i * TAU / 6).toFloat(), core.y + coreR * sin(rot + i * TAU / 6).toFloat()) }
    for (i in 0 until 6) drawPath(Path().apply { moveTo(core.x, core.y); lineTo(hex[i].x, hex[i].y); lineTo(hex[(i + 1) % 6].x, hex[(i + 1) % 6].y); close() }, col(pal.bee[i % 3], 1.0))
    drawPath(Path().apply { hex.forEachIndexed { i, p -> if (i == 0) moveTo(p.x, p.y) else lineTo(p.x, p.y) }; close() }, col(pal.spark, 0.9), style = Stroke(coreR * 0.12f))

    // bees, back to front
    for (i in hive.indices.sortedBy { hive[it].v[2] }) {
        val b = hive[i]; val want = atan2((b.next.y - b.p.y).toDouble(), (b.next.x - b.p.x).toDouble())
        var dh = want - e.heading[i]
        dh = ((dh + PI) % TAU + TAU) % TAU - PI
        e.heading[i] += if (still) dh else dh * 0.15
        val flap = 0.35 + 0.65 * abs(sin(t * 26 + EmblemEngine.BEE[i].flap))
        drawBee(b.p.x, b.p.y, (R * 0.15 * b.p.s).toFloat(), e.heading[i], flap, 0.55 + 0.45 * depth(b.v[2]), pal)
    }

    // glassy front faces, then the front edges and corners
    val light = doubleArrayOf(-0.4, 0.6, 0.7)
    for ((i, j, k) in EmblemEngine.FACES) {
        val a = v3[i]; val b = v3[j]; val cc = v3[k]
        val n = doubleArrayOf((a[0] + b[0] + cc[0]) / 3, (a[1] + b[1] + cc[1]) / 3, (a[2] + b[2] + cc[2]) / 3)
        if (n[2] <= 0) continue
        val lit = max(0.0, (n[0] * light[0] + n[1] * light[1] + n[2] * light[2]) / sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]))
        drawPath(Path().apply { moveTo(vp[i].x, vp[i].y); lineTo(vp[j].x, vp[j].y); lineTo(vp[k].x, vp[k].y); close() }, col(pal.face, 0.03 + 0.07 * lit * lit))
    }
    edges(true)
    for (i in 0 until 12) {
        if (v3[i][2] < -0.05) continue
        drawCircle(col(pal.edge, 0.6 + 0.4 * depth(v3[i][2])), (R * 0.02 * vp[i].s).toFloat(), vp[i].o)
    }
    drawRings(true)
}

/** One low-poly bee seen from above, facing +x in its own space. */
private fun DrawScope.drawBee(x: Float, y: Float, k: Float, ang: Double, flap: Double, alpha: Double, pal: Pal) {
    fun poly(vararg pts: Pair<Float, Float>) = Path().apply { pts.forEachIndexed { i, (px, py) -> if (i == 0) moveTo(px, py) else lineTo(px, py) }; close() }
    withTransform({ translate(x, y); rotate(Math.toDegrees(ang).toFloat(), Offset.Zero); scale(k, k, Offset.Zero) }) {
        drawPath(poly(-1.02f to -0.08f, -1.28f to 0f, -1.02f to 0.08f), col(pal.head, alpha))   // stinger
        val body = listOf(-1.05f to 0f, -0.78f to -0.4f, -0.2f to -0.5f, 0.28f to -0.36f, 0.46f to 0f, 0.28f to 0.36f, -0.2f to 0.5f, -0.78f to 0.4f)
        for (i in body.indices) drawPath(poly(-0.3f to 0f, body[i], body[(i + 1) % body.size]), col(pal.bee[i % 3], alpha))
        clipPath(poly(*body.toTypedArray())) {
            drawPath(poly(-0.26f to -0.6f, -0.44f to -0.6f, -0.5f to 0.6f, -0.32f to 0.6f), col(pal.stripe, 0.92 * alpha))
            drawPath(poly(-0.64f to -0.6f, -0.8f to -0.6f, -0.86f to 0.6f, -0.7f to 0.6f), col(pal.stripe, 0.92 * alpha))
        }
        drawPath(poly(0.42f to 0f, 0.58f to -0.27f, 0.86f to -0.2f, 0.95f to 0f, 0.86f to 0.2f, 0.58f to 0.27f), col(pal.head, alpha))   // head
        drawPath(poly(0.7f to -0.2f, 0.84f to -0.14f, 0.74f to -0.08f), col(pal.bee[1], 0.9 * alpha))
        drawPath(poly(0.7f to 0.2f, 0.84f to 0.14f, 0.74f to 0.08f), col(pal.bee[1], 0.9 * alpha))
        val feelers = Path().apply { moveTo(0.9f, -0.1f); lineTo(1.08f, -0.2f); lineTo(1.2f, -0.4f); moveTo(0.9f, 0.1f); lineTo(1.08f, 0.2f); lineTo(1.2f, 0.4f) }
        drawPath(feelers, col(pal.head, alpha), style = Stroke(0.06f, cap = StrokeCap.Round))
        for (side in listOf(-1f, 1f)) {   // wings: the span beats
            val f = (side * flap).toFloat()
            val wing = poly(0.22f to 0.16f * side, 0.05f to 1.08f * f, -0.5f to 0.92f * f, -0.22f to 0.24f * side)
            drawPath(wing, col(pal.wing, 0.38 * alpha))
            drawPath(wing, col(pal.bee[1], 0.85 * alpha), style = Stroke(0.04f))
            drawLine(col(pal.bee[1], 0.85 * alpha), Offset(0.05f, 0.2f * side), Offset(-0.22f, 0.95f * f), 0.04f)
        }
    }
}

/** FAITH's emblem, live. `level` is read every frame (a microphone meter), or a gentle made-up pulse.
 *  With the phone's animations turned off (Accessibility → Remove animations) it stays still. */
@Composable
fun Emblem(state: EmblemState, size: Dp, dark: Boolean, modifier: Modifier = Modifier, level: () -> Float? = { null }) {
    val ctx = LocalContext.current
    val still = remember { Settings.Global.getFloat(ctx.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f }
    val engine = remember { EmblemEngine() }
    engine.state = state
    var frame by remember { mutableLongStateOf(0L) }
    LaunchedEffect(still) {
        if (still) { engine.settle(); frame++; return@LaunchedEffect }
        var last = 0L
        while (true) withFrameNanos { now -> if (last != 0L) engine.step((now - last) / 1e9); last = now; frame = now }
    }
    LaunchedEffect(state, still) { if (still) { engine.settle(); frame++ } }
    Canvas(modifier.size(size).semantics { contentDescription = "FAITH (${state.name.lowercase()})" }) {
        frame.let { }   // redraw on every frame
        drawEmblem(engine, dark, level(), still)
    }
}
