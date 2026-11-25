package family.faith.app

import android.app.Application
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

// ---------------------------------------------------------------- what GET /api/board says (docs/clients.md, section 6)

data class CardItem(val title: String, val time: String, val label: String, val meta: String, val done: Boolean)
data class DayCard(val id: String, val title: String, val items: List<CardItem>, val text: String, val empty: String, val error: String)
data class Project(val name: String, val status: String, val next: String, val last: String, val starred: Boolean)
data class LogLine(val day: String, val project: String, val text: String)
data class Forecast(val date: String, val condition: String, val high: String, val low: String, val rain: String)
data class Weather(val temperature: String, val unit: String, val condition: String, val days: List<Forecast>)
data class Headline(val title: String, val source: String)

/** One section of the board. `error` set: it's set up but didn't load (say so). */
data class Part<T>(val value: T?, val error: String = "")

data class BoardView(
    val person: String?, val brief: String?,
    val weather: Part<Weather>?, val news: Part<List<Headline>>?,
    val projects: List<Project>?, val log: List<LogLine>?,
    val uptime: Part<String>?, val system: Part<String>?,
    val cards: List<DayCard>,
) {
    companion object {
        private fun JSONObject.str(k: String) = if (isNull(k)) "" else optString(k, "")
        private fun JSONObject.num(k: String) = if (isNull(k) || !has(k)) "–" else optDouble(k).let { if (it.isNaN()) "–" else Math.round(it).toString() }
        private fun <T> JSONArray?.list(f: (JSONObject) -> T): List<T> = if (this == null) emptyList() else (0 until length()).map { f(getJSONObject(it)) }
        /** null: not set up for this viewer. An object with "error": set up, but it didn't load. */
        private fun <T> JSONObject.part(k: String, f: (JSONObject) -> T): Part<T>? {
            val o = optJSONObject(k) ?: return null
            return if (o.has("error")) Part(null, o.optString("error")) else Part(f(o))
        }

        fun parse(d: JSONObject): BoardView = BoardView(
            person = d.optJSONObject("person")?.optString("name"),
            brief = d.optJSONObject("brief")?.optString("text"),
            weather = d.part("weather") { w -> Weather(w.num("temperature"), w.str("unit"), w.str("condition"),
                w.optJSONArray("days").list { Forecast(it.str("date"), it.str("condition"), it.num("high"), it.num("low"), it.num("rain")) }) },
            news = d.part("news") { n -> n.optJSONArray("items").list { Headline(it.str("title"), it.str("source")) } },
            projects = if (d.isNull("projects") || !d.has("projects")) null else d.optJSONArray("projects").list {
                Project(it.str("name"), it.str("status"), it.str("next"), it.str("last"), it.optBoolean("fav")) },
            log = if (d.isNull("log") || !d.has("log")) null else d.optJSONArray("log").list { LogLine(it.str("day"), it.str("project"), it.str("text")) },
            uptime = d.part("uptime") { u -> "${u.optInt("up")} up, ${u.optInt("down").let { if (it == 0) "none" else "$it" }} down" +
                u.optJSONArray("monitors").list { it }.filter { it.str("status") == "down" && !it.optBoolean("ignored") }.joinToString("") { "\n${it.str("name")} is down" } },
            system = d.part("system") { s -> "Load ${s.optInt("load")}% · memory ${s.optInt("memory")}% · up ${s.optInt("uptime_days")} days" +
                s.optJSONArray("sources").list { it }.filter { !it.isNull("ok") && !it.optBoolean("ok") }.joinToString("") { "\n${it.str("label")} is down" } },
            cards = d.optJSONArray("cards").list { c ->
                DayCard(c.str("id"), c.str("title"), c.optJSONArray("items").list { CardItem(it.str("title"), it.str("time"), it.str("label"), it.str("meta"), it.optBoolean("done")) },
                    c.str("text"), c.str("empty"), c.str("error")) },
        )

        val STATUSES = listOf("next" to "Next", "active" to "Active", "blocked" to "Blocked", "paused" to "Paused", "shipped" to "Shipped")
        fun statusWord(s: String) = STATUSES.firstOrNull { it.first == s }?.second ?: s
    }
}

// ---------------------------------------------------------------- the board's state

class BoardModel(app: Application) : AndroidViewModel(app) {
    val store = Store(app)
    val board = mutableStateOf<BoardView?>(null)
    val error = mutableStateOf("")
    val status = mutableStateOf("")       // announced to screen readers
    val writing = mutableStateOf(false)

    private suspend fun <T> io(block: () -> T): T = withContext(Dispatchers.IO) { block() }

    fun load() {
        viewModelScope.launch {
            try { board.value = io { store.api().board() }; error.value = "" } catch (e: FaithError) { error.value = e.message ?: "" }
        }
    }
    private fun act(done: String, block: () -> Unit) {
        viewModelScope.launch {
            try { io(block); status.value = done; load() } catch (e: FaithError) { status.value = e.message ?: "That didn't work." }
        }
    }
    fun log(text: String, project: String?) = act("Logged.") { store.api().addLog(text, project) }
    fun addProject(name: String) = act("Added $name.") { store.api().addProject(name) }
    fun move(p: Project, status: String) = act("${p.name} is now ${BoardView.statusWord(status)}.") { store.api().setProjectStatus(p.name, status) }
    fun writeBrief() {
        if (writing.value) return
        writing.value = true; status.value = "FAITH is writing your brief. This can take a minute."
        viewModelScope.launch {
            try { io { store.api().writeBrief() }; status.value = "Your brief is ready."; load() }
            catch (e: FaithError) { status.value = e.message ?: "That didn't work." }
            finally { writing.value = false }
        }
    }
}

// ---------------------------------------------------------------- the board on screen

@Composable
private fun Section(title: String, content: @Composable ColumnScope.() -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface), modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(title, fontFamily = FontFamily.Serif, fontSize = 20.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.semantics { heading() })
            content()
        }
    }
}
@Composable private fun Muted(t: String) = Text(t, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp)
@Composable private fun Problem(t: String) = Text(t, color = MaterialTheme.colorScheme.error, fontSize = 14.sp)

@Composable
fun BoardScreen(m: BoardModel) {
    LaunchedEffect(Unit) { m.load() }
    val b = m.board.value
    var logText by remember { mutableStateOf("") }
    var logProject by remember { mutableStateOf<String?>(null) }
    var newProject by remember { mutableStateOf("") }
    var moving by remember { mutableStateOf<Project?>(null) }

    LazyColumn(Modifier.fillMaxSize().padding(horizontal = 12.dp), verticalArrangement = Arrangement.spacedBy(10.dp), contentPadding = PaddingValues(vertical = 8.dp)) {
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(m.status.value, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp,
                    modifier = Modifier.weight(1f).semantics { liveRegion = LiveRegionMode.Polite })
                TextButton(onClick = { m.load() }, modifier = Modifier.heightIn(min = 48.dp)) { Text("Refresh") }
            }
        }
        if (m.error.value.isNotBlank()) item { Problem(m.error.value) }
        if (b == null) { if (m.error.value.isBlank()) item { Muted("Loading…") }; return@LazyColumn }

        if (b.person != null) item {
            Section("Morning brief") {
                if (b.brief != null) Text(b.brief.replace("**", "")) else Muted("No brief yet today. FAITH writes it from your board, your calendar and the news.")
                OutlinedButton(onClick = { m.writeBrief() }, enabled = !m.writing.value, modifier = Modifier.heightIn(min = 48.dp)) {
                    Text(if (m.writing.value) "Writing…" else if (b.brief != null) "Write it again" else "Write it now")
                }
            }
        }
        b.weather?.let { w -> item {
            Section("Weather") {
                val v = w.value
                if (v == null) Problem(w.error) else {
                    Text("${v.temperature}${v.unit} · ${v.condition}", fontSize = 18.sp)
                    v.days.take(5).forEach { d -> Muted("${d.date.takeLast(5)}  ${d.condition}  ${d.high}° / ${d.low}°  ${d.rain}% rain") }
                }
            }
        } }
        items(b.cards) { c ->
            Section(c.title) {
                when {
                    c.error.isNotBlank() -> Problem(c.error)
                    c.empty.isNotBlank() -> Muted(c.empty)
                    c.text.isNotBlank() -> Text(c.text.replace("**", ""))
                }
                c.items.forEach { i ->
                    val lead = i.label.ifBlank { i.time }
                    Text((if (lead.isNotBlank()) "$lead · " else "") + i.title + (if (i.meta.isNotBlank()) " (${i.meta})" else "") + (if (i.done) " (done)" else ""))
                }
            }
        }
        b.projects?.let { ps -> item {
            Section("Projects") {
                if (ps.isEmpty()) Muted("No projects yet. Add one here, or bring yours over from Pondering Orb on the desktop app.")
                ps.forEach { p ->
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(Modifier.weight(1f)) {
                            Text((if (p.starred) "★ " else "") + p.name, fontWeight = FontWeight.SemiBold)
                            if (p.next.isNotBlank()) Text("Next: ${p.next}", fontSize = 14.sp)
                            if (p.last.isNotBlank()) Muted("Last: ${p.last}")
                        }
                        OutlinedButton(onClick = { moving = p }, modifier = Modifier.heightIn(min = 48.dp).semantics { contentDescription = "${p.name} is ${BoardView.statusWord(p.status)}. Change it" }) {
                            Text(BoardView.statusWord(p.status))
                        }
                    }
                }
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(newProject, { newProject = it }, label = { Text("New project") }, singleLine = true, modifier = Modifier.weight(1f))
                    Button(onClick = { m.addProject(newProject.trim()); newProject = "" }, enabled = newProject.isNotBlank(), modifier = Modifier.heightIn(min = 48.dp)) { Text("Add") }
                }
            }
        } }
        b.log?.let { lines -> item {
            Section("Log") {
                OutlinedTextField(logText, { logText = it }, label = { Text("What did you get done?") }, singleLine = true, modifier = Modifier.fillMaxWidth())
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    var open by remember { mutableStateOf(false) }
                    Box(Modifier.weight(1f)) {
                        OutlinedButton(onClick = { open = true }, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp).semantics { contentDescription = "Project: ${logProject ?: "General"}. Change it" }) { Text(logProject ?: "General") }
                        DropdownMenu(open, { open = false }) {
                            (listOf<String?>(null) + (b.projects ?: emptyList()).map { it.name }).forEach { n ->
                                DropdownMenuItem(text = { Text(n ?: "General") }, onClick = { logProject = n; open = false })
                            }
                        }
                    }
                    Button(onClick = { m.log(logText.trim(), logProject); logText = "" }, enabled = logText.isNotBlank(), modifier = Modifier.heightIn(min = 48.dp)) { Text("Log it") }
                }
                if (lines.isEmpty()) Muted("Nothing logged yet.")
                lines.forEach { l -> Text("${l.day.takeLast(5)} · ${l.text}  (${l.project})", fontSize = 15.sp) }
            }
        } }
        b.news?.let { n -> item {
            Section("News") {
                val v = n.value
                if (v == null) Problem(n.error) else if (v.isEmpty()) Muted("No headlines right now.") else v.forEach { h -> Text("${h.title} · ${h.source}", fontSize = 15.sp) }
            }
        } }
        b.uptime?.let { u -> item { Section("Uptime") { if (u.value == null) Problem(u.error) else Text(u.value) } } }
        b.system?.let { s -> item { Section("FAITH's server") { if (s.value == null) Problem(s.error) else Text(s.value) } } }
    }

    moving?.let { p ->
        AlertDialog(onDismissRequest = { moving = null }, title = { Text(p.name) },
            text = {
                Column {
                    BoardView.STATUSES.forEach { (k, word) ->
                        TextButton(onClick = { m.move(p, k); moving = null }, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)) {
                            Text(if (k == p.status) "$word (now)" else word)
                        }
                    }
                }
            },
            confirmButton = {}, dismissButton = { TextButton(onClick = { moving = null }, modifier = Modifier.heightIn(min = 48.dp)) { Text("Cancel") } })
    }
}
