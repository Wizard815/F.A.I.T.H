package family.faith.app

import android.Manifest
import android.content.pm.PackageManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

/** The three ways the app looks (the same as the desktop app's). */
object Layouts {
    const val FOCUS = "voice-focus"
    const val PANEL = "voice-panel"
    const val DASHBOARD = "voice-dashboard"
    val ALL = listOf(FOCUS, PANEL, DASHBOARD)
    val NAMES = mapOf(FOCUS to "Voice focus: just talk", PANEL to "Voice panel: talk, with a few panels", DASHBOARD to "Voice dashboard: everything")
}

/** What the voice panel's tiles say, from the board FAITH serves this person. Plain Kotlin, so it's tested. */
data class Glance(val next: String?, val nextTime: String, val dinner: String?, val shopping: Int?, val shoppingFirst: List<String>,
                  val house: List<String>?, val brief: String?, val weather: String?, val weatherWhat: String) {
    companion object {
        private val GREETING = Regex("^(good (morning|afternoon|evening)|hi|hello)\\b", RegexOption.IGNORE_CASE)
        fun from(b: BoardView?, now: String): Glance {
            val cards = b?.cards ?: emptyList()
            fun kind(k: String) = cards.firstOrNull { it.kind == k }
            val today = kind("schedule"); val meals = kind("meals"); val shop = kind("checklist"); val house = kind("entities")
            val next = today?.items?.firstOrNull { !it.done && (!Regex("^\\d{2}:\\d{2}$").matches(it.time) || it.time >= now) }
            val dinner = meals?.items?.firstOrNull { it.label.contains("dinner", true) } ?: meals?.items?.lastOrNull()
            val left = shop?.items?.filter { !it.done }
            val w = b?.weather?.value
            return Glance(
                next = next?.title ?: today?.let { "" }, nextTime = next?.time ?: "",
                dinner = dinner?.title ?: meals?.let { "" },
                shopping = left?.size, shoppingFirst = left?.take(3)?.map { it.title } ?: emptyList(),
                house = house?.items?.take(3)?.map { "${it.title}: ${it.meta}" },
                brief = b?.brief?.split(Regex("(?<=[.!?])\\s+"))?.firstOrNull { !GREETING.containsMatchIn(it) } ?: b?.brief,
                weather = w?.let { "${it.temperature}${it.unit}" }, weatherWhat = w?.condition ?: "",
            )
        }
    }
}

// ---------------------------------------------------------------- shared bits

/** Push-to-talk, asking for the microphone the first time. */
@Composable
fun rememberTalk(chat: ChatModel): () -> Unit {
    val ctx = LocalContext.current
    val mic = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { ok -> if (ok) chat.startTalking() else chat.status.value = "FAITH needs the microphone to hear you. Allow it in Android's settings." }
    return {
        if (chat.listening.value) chat.stopTalking()
        else if (ctx.checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) chat.startTalking()
        else mic.launch(Manifest.permission.RECORD_AUDIO)
    }
}

fun stateWord(chat: ChatModel) = when {
    chat.listening.value -> "Listening… tap to send"
    chat.busy.value -> "Thinking…"
    chat.speaking.value -> "Speaking…"
    else -> "Tap to talk"
}

/** FAITH's round talk button: a gold ring that breathes while listening, thinking or speaking. */
@Composable
fun TalkOrb(chat: ChatModel, size: Int, talk: () -> Unit) {
    val active = chat.listening.value || chat.busy.value || chat.speaking.value
    val pulse = rememberInfiniteTransition(label = "orb").animateFloat(0.92f, 1.06f, infiniteRepeatable(tween(if (chat.busy.value) 500 else 900), RepeatMode.Reverse), label = "pulse")
    val gold = MaterialTheme.colorScheme.primary
    Box(Modifier.size(size.dp).clip(CircleShape).clickable(onClickLabel = if (chat.listening.value) "Send" else "Talk") { talk() }
        .semantics { contentDescription = if (chat.listening.value) "Stop and send what you said" else "Talk to FAITH"; stateDescription = stateWord(chat) },
        contentAlignment = Alignment.Center) {
        Canvas(Modifier.fillMaxSize()) {
            val s = if (active) pulse.value else 1f
            drawCircle(gold.copy(alpha = 0.12f), radius = size.dp.toPx() / 2 * s)
            drawCircle(gold, radius = size.dp.toPx() / 2 * 0.82f * s, style = Stroke(width = 4.dp.toPx()))
            drawCircle(gold.copy(alpha = if (chat.listening.value) 0.9f else 0.55f), radius = size.dp.toPx() / 2 * 0.36f * s)
        }
        Text("FAITH", fontFamily = Serif, fontWeight = FontWeight.SemiBold, fontSize = (size / 9).sp, color = MaterialTheme.colorScheme.onBackground)
    }
}

/** The last exchange: what was heard, FAITH's answer, and a Yes for a held change. */
@Composable
fun Caption(chat: ChatModel, big: Boolean) {
    val lines = chat.lines
    val said = lines.lastOrNull { it.me }
    val from = if (said == null) 0 else lines.indexOf(said)
    val after = lines.drop(from)
    val reply = after.lastOrNull { !it.me && it.confirm == null && !it.fromInbox }
    Column(Modifier.fillMaxWidth().semantics { liveRegion = LiveRegionMode.Polite }, horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        said?.let { Text("“${it.text}”", fontStyle = FontStyle.Italic, color = MaterialTheme.colorScheme.onSurfaceVariant, textAlign = TextAlign.Center) }
        reply?.takeIf { it.text != "…" }?.let { Text(it.text.replace("**", ""), fontFamily = Serif, fontSize = if (big) 22.sp else 19.sp, textAlign = TextAlign.Center) }
        if (reply?.text == "…" && reply.checking.isNotEmpty()) Text(reply.checking.distinct().joinToString(", ") + "…", color = MaterialTheme.colorScheme.onSurfaceVariant)
        reply?.shown?.takeIf { it.isNotEmpty() }?.let { ShownPhotos(it, chat.thumbs) }
        after.filter { it.confirm != null }.forEach { l -> LineView(l, chat.thumbs) { yes -> l.confirm?.let { chat.answer(it, yes) } } }
    }
}

@Composable
fun LayoutMenuItems(store: Store, close: () -> Unit, changed: () -> Unit) {
    Layouts.ALL.forEach { l ->
        DropdownMenuItem(text = { Text((if (store.layout == l) "✓ " else "") + Layouts.NAMES[l]) }, onClick = { store.layout = l; close(); changed() },
            modifier = Modifier.semantics { if (store.layout == l) stateDescription = "on" })
    }
}

@Composable
private fun TopBar(chat: ChatModel, title: String, changed: () -> Unit, signOut: () -> Unit) {
    var menu by remember { mutableStateOf(false) }
    Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
        Text(title, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.weight(1f))
        Box {
            TextButton(onClick = { menu = true }, modifier = Modifier.heightIn(min = 48.dp).semantics { contentDescription = "Settings" }) { Text("⋮", fontSize = 22.sp) }
            DropdownMenu(menu, { menu = false }) {
                LayoutMenuItems(chat.store, { menu = false }, changed)
                DropdownMenuItem(text = { Text("New topic") }, onClick = { chat.newTopic(); menu = false })
                DropdownMenuItem(text = { Text("Sign out of this phone") }, onClick = { menu = false; signOut() })
            }
        }
    }
}

// ---------------------------------------------------------------- Voice focus

/** Just talk: a big FAITH button, what was heard and the answer, read aloud. */
@Composable
fun FocusScreen(chat: ChatModel, changed: () -> Unit, signOut: () -> Unit) {
    val talk = rememberTalk(chat)
    var typing by remember { mutableStateOf(false) }
    var input by remember { mutableStateOf("") }
    DisposableEffect(Unit) { chat.voice = true; onDispose { chat.voice = false } }
    Column(Modifier.fillMaxSize().padding(20.dp).verticalScroll(rememberScrollState()), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(14.dp)) {
        TopBar(chat, "FAITH · ${chat.store.personName}", changed, signOut)
        TalkOrb(chat, 240, talk)
        Text(stateWord(chat), color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp)
        Caption(chat, big = true)
        Text(chat.status.value, fontSize = 1.sp, color = Color.Transparent, modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite })
        Spacer(Modifier.weight(1f))
        if (typing) Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedTextField(input, { input = it }, placeholder = { Text("Type instead of talking") }, modifier = Modifier.weight(1f).semantics { contentDescription = "Type to FAITH" }, maxLines = 3)
            Button(onClick = { chat.ask(input); input = "" }, enabled = input.isNotBlank() && !chat.busy.value, modifier = Modifier.heightIn(min = 48.dp)) { Text("Send") }
        }
        TextButton(onClick = { typing = !typing }, modifier = Modifier.heightIn(min = 48.dp)) { Text(if (typing) "Hide typing" else "Type instead") }
    }
}

// ---------------------------------------------------------------- Voice panel

/** Like a kitchen speaker's screen: a clock, the weather and a few panels; a tap asks FAITH. */
@Composable
fun PanelScreen(chat: ChatModel, board: BoardModel, changed: () -> Unit, signOut: () -> Unit) {
    val talk = rememberTalk(chat)
    var now by remember { mutableStateOf(LocalDateTime.now()) }
    LaunchedEffect(Unit) { while (true) { board.load(); repeat(4) { delay(15_000); now = LocalDateTime.now() } } }
    DisposableEffect(Unit) { chat.voice = true; onDispose { chat.voice = false } }
    LaunchedEffect(chat.busy.value) { if (!chat.busy.value) board.load() }
    // A fresh screen: the conversation carries on, but the panel starts on its panels.
    var since by remember { mutableStateOf(chat.lines.size) }
    val asking = chat.lines.size > since
    LaunchedEffect(chat.lines.size, chat.busy.value, chat.speaking.value) {
        if (asking && !chat.busy.value && !chat.speaking.value && !chat.listening.value && chat.lines.none { it.confirm?.state == "waiting" }) { delay(30_000); since = chat.lines.size }
    }
    val g = Glance.from(board.board.value, now.format(DateTimeFormatter.ofPattern("HH:mm")))
    val ask = { q: String -> chat.ask(q) }
    val greet = when { now.hour < 12 -> "Good morning"; now.hour < 18 -> "Good afternoon"; else -> "Good evening" }
    Column(Modifier.fillMaxSize().padding(18.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Row(verticalAlignment = Alignment.Top) {
            Column(Modifier.weight(1f)) {
                Text(now.format(DateTimeFormatter.ofPattern("h:mm")), fontFamily = Serif, fontWeight = FontWeight.SemiBold, fontSize = 52.sp)
                Text(now.format(DateTimeFormatter.ofPattern("EEEE, MMMM d")), color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text("$greet, ${chat.store.personName}.", fontSize = 17.sp)
            }
            Column(horizontalAlignment = Alignment.End) {
                TopBar(chat, "", changed, signOut)
                g.weather?.let { w ->
                    Column(Modifier.clickable(onClickLabel = "Ask about the weather") { ask("What's the weather today?") }, horizontalAlignment = Alignment.End) {
                        Text(w, fontFamily = Serif, fontWeight = FontWeight.SemiBold, fontSize = 28.sp)
                        Text(g.weatherWhat.replaceFirstChar { it.uppercase() }, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp)
                    }
                }
            }
        }
        Box(Modifier.weight(1f).fillMaxWidth()) {
            if (asking) Column(Modifier.verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Caption(chat, big = false)
                OutlinedButton(onClick = { chat.quiet(); since = chat.lines.size }, modifier = Modifier.heightIn(min = 48.dp)) { Text("Back to the panels") }
            } else Column(Modifier.verticalScroll(rememberScrollState()).semantics { contentDescription = "Today at a glance" }, verticalArrangement = Arrangement.spacedBy(10.dp)) {
                g.brief?.let { Tile("Your brief", it, "Read me my morning brief.", ask) }
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    g.next?.let { Tile("Next up", it.ifBlank { "Nothing else today" } + (if (g.nextTime.isNotBlank()) "\n${g.nextTime}" else ""), "What's on today?", ask, Modifier.weight(1f)) }
                    g.dinner?.let { Tile("Dinner", it.ifBlank { "Not planned yet" }, "What's for dinner tonight?", ask, Modifier.weight(1f)) }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    g.shopping?.let { n -> Tile("Shopping", (if (n == 0) "Nothing on the list" else "$n item${if (n > 1) "s" else ""}") + (if (g.shoppingFirst.isNotEmpty()) "\n" + g.shoppingFirst.joinToString(", ") else ""), "What's on the shopping list?", ask, Modifier.weight(1f)) }
                    g.house?.let { Tile("The house", it.joinToString("\n").ifBlank { "All quiet" }, "How's the house?", ask, Modifier.weight(1f)) }
                }
                if (board.board.value == null) Text(board.error.value.ifBlank { "Loading…" }, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        Text(chat.status.value, fontSize = 1.sp, color = Color.Transparent, modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite })
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.Center, verticalAlignment = Alignment.CenterVertically) {
            Button(onClick = talk, modifier = Modifier.heightIn(min = 64.dp).semantics { contentDescription = if (chat.listening.value) "Stop and send what you said" else "Talk to FAITH" },
                shape = RoundedCornerShape(32.dp)) { Text(if (chat.listening.value) "■  Send" else if (chat.busy.value) "Thinking…" else if (chat.speaking.value) "Speaking…" else "🎙  Talk", fontSize = 18.sp) }
        }
    }
}

@Composable
private fun Tile(title: String, body: String, question: String, ask: (String) -> Unit, modifier: Modifier = Modifier) {
    Column(modifier.fillMaxWidth().heightIn(min = 96.dp).clip(RoundedCornerShape(18.dp)).background(MaterialTheme.colorScheme.surface)
        .clickable(onClickLabel = "Ask FAITH") { ask(question) }.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(title, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        Text(body, fontSize = 17.sp, fontWeight = FontWeight.SemiBold)
    }
}
