package family.faith.app

import android.app.Application
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

// ---------------------------------------------------------------- family projects (docs/projects.md)

/** `throwaway`: keeps nothing, read-only, deleted when put away or after a day (docs/projects.md). */
data class FamilyThread(val id: String, val title: String, val brief: String, val status: String, val resolved: Boolean, val last: String,
                        val throwaway: Boolean = false, val stage: String = "", val updatedAt: Long = 0) {
    /** Same names as Hermes Studio: working, needs_you, review (finished, unread), done (read), resolved (put away). */
    val stageNow: String get() = stage.ifBlank { if (resolved) "resolved" else if (status == "working") "working" else if (status == "done") "done" else "needs_you" }
    val needsYou get() = !resolved && (status == "waiting" || status == "failed")
}
data class FamilyProject(val id: String, val owner: String, val name: String, val threads: List<FamilyThread>, val instructions: String = "") {
    /** Mine, Family, Parents: what people call them. */
    val label get() = if (owner.startsWith("person:")) "Mine" else name
}
data class ThreadMessage(val fromFaith: Boolean, val text: String)
/** A change: done, or waiting for this person's Yes (pending), or for a grown-up's approval (requests). */
data class ProjectChange(val thread: String?, val pending: List<Pair<String, String>>, val requests: List<String>, val deleted: Boolean = false)

object ProjectsJson {
    private fun <T> JSONArray?.list(f: (JSONObject) -> T): List<T> = if (this == null) emptyList() else (0 until length()).map { f(getJSONObject(it)) }
    fun projects(d: JSONObject): List<FamilyProject> = d.optJSONArray("projects").list { p ->
        FamilyProject(p.optString("id"), p.optString("owner"), p.optString("name"), p.optJSONArray("threads").list { t ->
            FamilyThread(t.optString("id"), t.optString("title"), t.optString("brief"), t.optString("status"), t.optBoolean("resolved"), t.optString("last_text"),
                t.optBoolean("throwaway"), t.optString("stage"), t.optLong("updated_at")) }, p.optString("instructions"))
    }
    fun messages(d: JSONObject): List<ThreadMessage> = d.optJSONArray("messages").list { ThreadMessage(it.optString("role") != "user", it.optString("text")) }
    fun change(d: JSONObject) = ProjectChange(d.optString("thread").ifBlank { null },
        d.optJSONArray("pending").list { it.optString("id") to it.optString("summary") }, d.optJSONArray("requests").list { it.optString("summary") }, d.optBoolean("deleted"))

    fun statusWord(s: String) = when (s) { "working" -> "Working"; "waiting" -> "Waiting for approval"; "failed" -> "Didn't work"; "done" -> "Done"; else -> s }
    val STAGES = listOf("needs_you", "working", "review", "done", "resolved")
    fun stageLabel(s: String) = when (s) { "needs_you" -> "Needs you"; "working" -> "Working"; "review" -> "Ready for review"; "done" -> "Done"; "resolved" -> "Put away"; else -> s }
    /** Threads grouped by stage, newest first in each, empty groups left out. */
    fun groups(threads: List<FamilyThread>): List<Pair<String, List<FamilyThread>>> {
        val newest = threads.sortedByDescending { it.updatedAt }
        return STAGES.map { s -> s to newest.filter { it.stageNow == s } }.filter { it.second.isNotEmpty() }
    }
    /** "just now", "5 min ago", "3 h ago", "yesterday", "4 days ago"; blank without a time. */
    fun ago(at: Long, now: Long): String {
        if (at <= 0) return ""
        val m = Math.round((now - at).coerceAtLeast(0) / 60_000.0)
        if (m < 1) return "just now"
        if (m < 60) return "$m min ago"
        val h = Math.round(m / 60.0)
        if (h < 24) return "$h h ago"
        val d = Math.round(h / 24.0)
        return if (d == 1L) "yesterday" else "$d days ago"
    }
    /** A one-line preview: Markdown marks taken out. */
    fun preview(t: String) = t.replace("**", "").replace(Regex("(?m)^\\s*(?:[-*•]|\\d+\\.)\\s+"), "").replace(Regex("\\s+"), " ").trim()
}

/** What the voice layouts say about projects. */
data class ProjectGlance(val needs: Int, val working: Int, val top: String?, val review: Int = 0) {
    /** "1 needs you · 1 to review · 2 working", or null with nothing to say. */
    val words: String? get() = listOfNotNull(if (needs > 0) "$needs need${if (needs > 1) "" else "s"} you" else null,
        if (review > 0) "$review to review" else null, if (working > 0) "$working working" else null).joinToString(" · ").ifBlank { null }
    companion object {
        fun from(list: List<FamilyProject>?): ProjectGlance? {
            if (list == null) return null
            val all = list.flatMap { p -> p.threads.filter { !it.resolved }.map { p.label to it } }
            val needs = all.filter { it.second.needsYou }; val working = all.filter { it.second.status == "working" }
            val review = all.filter { it.second.stageNow == "review" }
            val top = (needs + review + working + all.filter { it.second.status == "done" }).firstOrNull()?.let { (p, t) ->
                "$p: ${t.title} (${(if (t.stageNow == "review") "ready for review" else ProjectsJson.statusWord(t.status)).lowercase()})" }
            return ProjectGlance(needs.size, working.size, top, review.size)
        }
    }
}

// ---------------------------------------------------------------- state

class ProjectsModel(app: Application) : AndroidViewModel(app) {
    val store = Store(app)
    val list = mutableStateOf<List<FamilyProject>?>(null)
    val error = mutableStateOf("")
    val status = mutableStateOf("")
    val open = mutableStateOf<Pair<String, String>?>(null)      // project id, thread id
    val messages = mutableStateOf<List<ThreadMessage>>(emptyList())
    val change = mutableStateOf<ProjectChange?>(null)
    private suspend fun <T> io(block: () -> T): T = withContext(Dispatchers.IO) { block() }

    fun load() { if (store.baseUrl.isBlank()) return; viewModelScope.launch { try { list.value = io { store.api().projects() }; error.value = ""; reloadOpen() } catch (e: FaithError) { error.value = e.message ?: "" } } }
    private suspend fun reloadOpen() { open.value?.let { (p, t) -> messages.value = io { store.api().projectThread(p, t) } } }
    fun openThread(project: String, thread: String) { open.value = project to thread; change.value = null; messages.value = emptyList(); viewModelScope.launch { try { reloadOpen() } catch (e: FaithError) { status.value = e.message ?: "" } } }
    fun close() { open.value = null; change.value = null }
    private fun act(done: String, block: () -> ProjectChange) {
        viewModelScope.launch {
            try {
                val c = io(block)
                if (c.deleted) open.value = null
                change.value = if (c.pending.isNotEmpty() || c.requests.isNotEmpty()) c else null
                status.value = if (c.pending.isNotEmpty()) "Waiting for your Yes." else if (c.requests.isNotEmpty()) "Sent to a grown-up for approval." else done
                list.value = io { store.api().projects() }; reloadOpen()
            } catch (e: FaithError) { status.value = e.message ?: "That didn't work." }
        }
    }
    fun start(project: String, title: String, brief: String, throwaway: Boolean = false) =
        act(if (throwaway) "Started. It keeps nothing: read the answer here." else "Started. FAITH will tell you when it's done.") { store.api().startThread(project, brief, title.ifBlank { null }, throwaway) }
    fun message(text: String) { val (p, t) = open.value ?: return; act("Sent.") { store.api().messageThread(p, t, text) } }
    fun resolve(resolved: Boolean, throwaway: Boolean = false) { val (p, t) = open.value ?: return; act(if (throwaway) "Deleted." else if (resolved) "Put away." else "Brought back.") { store.api().resolveThread(p, t, resolved) } }
    /** Now, for "5 min ago" (tests set it). */
    var now: () -> Long = { System.currentTimeMillis() }
    fun saveInstructions(project: String, text: String, done: () -> Unit) {
        viewModelScope.launch {
            try { io { store.api().setProjectInstructions(project, text) }; status.value = "Saved. Every new thread there gets it."; done(); list.value = io { store.api().projects() } }
            catch (e: FaithError) { status.value = e.message ?: "That didn't work." }
        }
    }
    fun answer(id: String, yes: Boolean) {
        viewModelScope.launch {
            try { status.value = io { store.api().confirm(id, yes) }; change.value = null; load() } catch (e: FaithError) { status.value = e.message ?: "" }
        }
    }
    /** Every 10 seconds while a thread is working, every minute otherwise. */
    suspend fun keepFresh() { while (true) { load(); delay(if (list.value?.any { p -> p.threads.any { it.status == "working" } } == true) 10_000 else 60_000) } }
}

// ---------------------------------------------------------------- on screen

@Composable
private fun StatusChip(s: String) {
    val bad = s == "waiting" || s == "failed"
    Text(ProjectsJson.statusWord(s), fontSize = 12.sp, fontWeight = FontWeight.Medium,
        color = if (bad) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.clip(RoundedCornerShape(50)).background(MaterialTheme.colorScheme.surfaceVariant).padding(horizontal = 8.dp, vertical = 3.dp))
}

@Composable
private fun ThrowawayChip() {
    Text("Throwaway", fontSize = 12.sp, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurfaceVariant,
        modifier = Modifier.clip(RoundedCornerShape(50)).background(MaterialTheme.colorScheme.surfaceVariant).padding(horizontal = 8.dp, vertical = 3.dp))
}

@Composable
private fun HeldCard(c: ProjectChange, answer: (String, Boolean) -> Unit) {
    Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant), modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            c.requests.firstOrNull()?.let { Text("Sent to a grown-up for approval: $it") }
            c.pending.firstOrNull()?.let { (id, summary) ->
                Text("Waiting for your Yes", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(summary, fontWeight = FontWeight.SemiBold)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = { answer(id, true) }, modifier = Modifier.heightIn(min = 48.dp).semantics { contentDescription = "Yes: $summary" }) { Text("Yes") }
                    OutlinedButton(onClick = { answer(id, false) }, modifier = Modifier.heightIn(min = 48.dp).semantics { contentDescription = "No: $summary" }) { Text("No") }
                }
            }
        }
    }
}

@Composable
private fun ThreadRow(t: FamilyThread, now: Long, open: () -> Unit) {
    Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(MaterialTheme.colorScheme.surface)
        .clickable(onClickLabel = "Open ${t.title}") { open() }.padding(12.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(t.title, fontWeight = FontWeight.SemiBold, maxLines = 1, overflow = TextOverflow.Ellipsis, modifier = Modifier.weight(1f))
            if (t.throwaway) { ThrowawayChip(); Spacer(Modifier.width(6.dp)) }
            StatusChip(t.status)
        }
        if (t.last.isNotBlank()) Text(ProjectsJson.preview(t.last), fontSize = 14.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 2, overflow = TextOverflow.Ellipsis)
        val when_ = ProjectsJson.ago(t.updatedAt, now)
        if (t.stageNow == "review" || when_.isNotBlank()) Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            if (t.stageNow == "review") Text("New", fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.primary)
            if (when_.isNotBlank()) Text(when_, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

/** What every thread in a project should know. */
@Composable
private fun InstructionsDialog(p: FamilyProject, close: () -> Unit, save: (String) -> Unit) {
    var text by remember { mutableStateOf(p.instructions) }
    AlertDialog(onDismissRequest = close, title = { Text("Instructions for ${p.label}") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(text, { text = it.take(2000) }, label = { Text("What every thread here should know") }, minLines = 3, modifier = Modifier.fillMaxWidth())
                Text("${text.length} / 2000" + if (p.owner.startsWith("person:")) "" else ". Everyone who can see ${p.name} reads these.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        },
        confirmButton = { Button(onClick = { save(text) }, modifier = Modifier.heightIn(min = 48.dp)) { Text("Save") } },
        dismissButton = { TextButton(onClick = close, modifier = Modifier.heightIn(min = 48.dp)) { Text("Cancel") } })
}

/** Voice dashboard's Projects tab: the list, or one thread. Start a thread from the button at the top. */
@Composable
fun ProjectsScreen(m: ProjectsModel) {
    LaunchedEffect(Unit) { m.keepFresh() }
    var starting by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<FamilyProject?>(null) }
    var showAway by remember { mutableStateOf(setOf<String>()) }
    val open = m.open.value
    val thread = open?.let { (p, t) -> m.list.value?.firstOrNull { it.id == p }?.threads?.firstOrNull { it.id == t } }
    Column(Modifier.fillMaxSize().padding(horizontal = 12.dp)) {
        Text(m.status.value, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp, modifier = Modifier.padding(vertical = 4.dp).semantics { liveRegion = LiveRegionMode.Polite })
        m.change.value?.let { HeldCard(it, m::answer); Spacer(Modifier.height(8.dp)) }
        if (thread != null) ThreadDetail(m, thread)
        else LazyColumn(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.dp), contentPadding = PaddingValues(bottom = 12.dp)) {
            item { Button(onClick = { starting = true }, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)) { Text("+  Start a thread") } }
            if (m.error.value.isNotBlank()) item { Text(m.error.value, color = MaterialTheme.colorScheme.error) }
            if (m.list.value == null && m.error.value.isBlank()) item { Text("Loading…", color = MaterialTheme.colorScheme.onSurfaceVariant) }
            m.list.value?.forEach { p ->
                val groups = ProjectsJson.groups(p.threads)
                item {
                    Row(Modifier.padding(top = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(p.label.uppercase(), fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.weight(1f).semantics { heading() })
                        TextButton(onClick = { editing = p }, modifier = Modifier.heightIn(min = 48.dp)) { Text("Instructions") }
                    }
                    if (p.instructions.isNotBlank()) Text("Every thread knows: ${p.instructions}", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 2, overflow = TextOverflow.Ellipsis)
                }
                if (groups.isEmpty()) item { Text("No threads yet.", color = MaterialTheme.colorScheme.onSurfaceVariant) }
                groups.forEach { (stage, threads) ->
                    val away = stage == "resolved"
                    item(key = "${p.id}-$stage") {
                        val label = "${ProjectsJson.stageLabel(stage)} · ${threads.size}"
                        if (away) TextButton(onClick = { showAway = if (p.id in showAway) showAway - p.id else showAway + p.id }, modifier = Modifier.heightIn(min = 48.dp)) {
                            Text((if (p.id in showAway) "▾  " else "▸  ") + label, color = MaterialTheme.colorScheme.onSurfaceVariant) }
                        else Text(label, fontSize = 13.sp, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(top = 4.dp))
                    }
                    if (!away || p.id in showAway) items(threads, key = { it.id }) { t -> ThreadRow(t, m.now()) { m.openThread(p.id, t.id) } }
                }
            }
        }
    }
    editing?.let { p -> InstructionsDialog(p, { editing = null }) { text -> m.saveInstructions(p.id, text) { editing = null } } }
    if (starting) StartDialog(m.list.value.orEmpty(), { starting = false }) { p, title, brief, away -> m.start(p, title, brief, away); starting = false }
}

@Composable
private fun ColumnScope.ThreadDetail(m: ProjectsModel, t: FamilyThread) {
    var input by remember { mutableStateOf("") }
    Row(verticalAlignment = Alignment.CenterVertically) {
        TextButton(onClick = { m.close() }, modifier = Modifier.heightIn(min = 48.dp)) { Text("←  All projects") }
        Spacer(Modifier.weight(1f))
        TextButton(onClick = { m.resolve(!t.resolved, t.throwaway) }, enabled = !(t.throwaway && t.status == "working"), modifier = Modifier.heightIn(min = 48.dp)) {
            Text(if (t.throwaway) "Delete" else if (t.resolved) "Bring back" else "Put away") }
    }
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(t.title, fontFamily = Serif, fontSize = 22.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f, fill = false).semantics { heading() })
        StatusChip(t.status)
        if (t.throwaway) ThrowawayChip()
    }
    if (t.throwaway) Text("A throwaway thread: it only looks things up and keeps nothing. Delete it when you're done, or it goes by itself after a day.",
        fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(top = 4.dp))
    LazyColumn(Modifier.weight(1f).padding(top = 8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        items(m.messages.value.withIndex().toList()) { (i, msg) ->
            Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp))
                .background(if (msg.fromFaith) MaterialTheme.colorScheme.surface else MaterialTheme.colorScheme.surfaceVariant).padding(12.dp)) {
                Text(if (msg.fromFaith) "FAITH" else if (i == 0) "The job" else "Asked", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(if (!msg.fromFaith && i == 0) t.brief else msg.text.replace("**", ""))
            }
        }
        if (t.status == "working") item { Text("FAITH is working on it…", color = MaterialTheme.colorScheme.onSurfaceVariant) }
    }
    Row(Modifier.padding(vertical = 10.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        OutlinedTextField(input, { input = it }, enabled = t.status != "working", placeholder = { Text(if (t.status == "working") "Wait for it to finish…" else "What next?") },
            modifier = Modifier.weight(1f).semantics { contentDescription = "Tell this thread what to do next" }, maxLines = 3)
        Button(onClick = { m.message(input); input = "" }, enabled = input.isNotBlank() && t.status != "working", modifier = Modifier.heightIn(min = 48.dp)) { Text("Send") }
    }
}

@Composable
private fun StartDialog(projects: List<FamilyProject>, close: () -> Unit, start: (String, String, String, Boolean) -> Unit) {
    var project by remember { mutableStateOf(projects.firstOrNull()?.id ?: "mine") }
    var title by remember { mutableStateOf("") }
    var brief by remember { mutableStateOf("") }
    var throwaway by remember { mutableStateOf(false) }
    val shared = projects.firstOrNull { it.id == project && !it.owner.startsWith("person:") }
    AlertDialog(onDismissRequest = close, title = { Text("Start a thread") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    projects.forEach { p -> FilterChip(selected = p.id == project, onClick = { project = p.id }, label = { Text(p.label) }, modifier = Modifier.heightIn(min = 48.dp)) }
                }
                OutlinedTextField(title, { title = it.take(80) }, label = { Text("Title (optional)") }, singleLine = true, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(brief, { brief = it.take(4000) }, label = { Text("What should FAITH do?") }, minLines = 3, modifier = Modifier.fillMaxWidth())
                if (shared != null) Text("Everyone who can see ${shared.name} will read this. You'll be asked to say Yes first.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                else Row(Modifier.fillMaxWidth().heightIn(min = 48.dp).toggleable(value = throwaway, role = Role.Checkbox, onValueChange = { throwaway = it }),
                    verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Checkbox(checked = throwaway, onCheckedChange = null)
                    Column {
                        Text("Throwaway", fontWeight = FontWeight.SemiBold)
                        Text("Keeps nothing. It only looks things up, nobody is told what it said, and it's deleted when you put it away or after a day.",
                            fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                }
            }
        },
        confirmButton = { Button(onClick = { start(project, title, brief, throwaway && shared == null) }, enabled = brief.isNotBlank(), modifier = Modifier.heightIn(min = 48.dp)) { Text("Start") } },
        dismissButton = { TextButton(onClick = close, modifier = Modifier.heightIn(min = 48.dp)) { Text("Cancel") } })
}
