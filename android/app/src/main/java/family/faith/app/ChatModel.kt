package family.faith.app

import android.app.Application
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import android.graphics.BitmapFactory
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/** One line in the chat. `confirm`: a change waiting for this person's Yes. */
data class Line(val text: String, val me: Boolean = false, val checking: List<String> = emptyList(),
                val confirm: Confirm? = null, val fromInbox: Boolean = false, val photo: Boolean = false,
                val shown: List<Shown> = emptyList())
data class Confirm(val id: String, val summary: String, val state: String = "waiting")   // waiting | yes | no | done | failed

/** The chat: asking (streamed), Yes/No, push-to-talk, and the inbox while the app is open. */
class ChatModel(app: Application) : AndroidViewModel(app) {
    val store = Store(app)
    val lines = mutableStateListOf<Line>()
    val busy = mutableStateOf(false)
    val listening = mutableStateOf(false)
    val speaking = mutableStateOf(false)
    /** A voice layout: answers are asked for short and always read aloud. */
    var voice = false
    val status = mutableStateOf("")            // announced to screen readers
    val attached = mutableStateOf<String?>(null)
    private val recorder = Recorder(app)
    private val speaker = Speaker(app)
    private var inboxJob: Job? = null

    private suspend fun <T> io(block: () -> T): T = withContext(Dispatchers.IO) { block() }

    fun ask(text: String) {
        val q = text.trim()
        val photo = attached.value
        if ((q.isEmpty() && photo == null) || busy.value) return
        attached.value = null
        lines += Line(q.ifEmpty { "What's in this photo?" }, me = true, photo = photo != null)
        lines += Line("…")
        busy.value = true; status.value = "FAITH is thinking"
        viewModelScope.launch {
            val checking = mutableListOf<String>()
            var answer = ""
            var shown = emptyList<Shown>()
            try {
                io {
                    store.api().chat(q.ifEmpty { "What's in this photo?" }, store.conversationId, listOfNotNull(photo), spoken = voice) { e ->
                        when (e.optString("type")) {
                            "conversation" -> store.conversationId = e.optString("id")
                            "text" -> { answer += e.optString("delta"); update(Line(answer.ifBlank { "…" }, checking = checking.toList(), shown = shown)) }
                            "tool" -> { checking += friendlyTool(e.optString("name")); update(Line(answer.ifBlank { "…" }, checking = checking.toList(), shown = shown)) }
                            "photos" -> { shown = FaithApi.parsePhotos(e); shown.forEach { thumb(it) }; update(Line(answer.ifBlank { "…" }, checking = checking.toList(), shown = shown)) }
                            "confirm" -> ui { lines.add(Line("", confirm = Confirm(e.optString("id"), e.optString("summary")))) }
                            "approval" -> ui { lines.add(Line("Sent to a grown-up to approve: ${e.optString("summary")}")) }
                            "done" -> { answer = e.optString("text", answer); update(Line(answer, checking = checking.toList(), shown = shown)) }
                            "error" -> throw FaithError(e.optString("message"))
                        }
                    }
                }
                status.value = "FAITH answered"
                if ((voice || store.speakReplies) && answer.isNotBlank()) speakOut(answer)
            } catch (e: FaithError) {
                update(Line(e.message ?: "That didn't work.")); status.value = e.message ?: ""
            } finally { busy.value = false }
        }
    }

    /** Every change to the chat happens on the main thread, in the order FAITH sent it. */
    private fun ui(block: () -> Unit) = viewModelScope.launch(Dispatchers.Main) { block() }

    /** Replace the last FAITH line (the one being written). */
    /** Pictures of the photos FAITH showed, fetched through FAITH with this phone's key. */
    val thumbs = mutableStateMapOf<String, ImageBitmap>()
    fun thumb(p: Shown) {
        if (thumbs.containsKey(p.id)) return
        viewModelScope.launch {
            val bmp = io { try { store.api().photo(p.source, p.id).let { BitmapFactory.decodeByteArray(it, 0, it.size) } } catch (_: Exception) { null } }
            if (bmp != null) thumbs[p.id] = bmp.asImageBitmap()
        }
    }

    private fun update(l: Line) = ui {
        val i = lines.indexOfLast { !it.me && it.confirm == null && !it.fromInbox }
        if (i >= 0) lines[i] = l else lines += l
    }

    fun answer(c: Confirm, yes: Boolean) {
        val i = lines.indexOfFirst { it.confirm?.id == c.id }
        if (i < 0 || c.state != "waiting") return
        lines[i] = lines[i].copy(confirm = c.copy(state = if (yes) "yes" else "no"))
        viewModelScope.launch {
            val said = try { io { store.api().confirm(c.id, yes) } } catch (e: FaithError) { e.message ?: "That didn't work." }
            lines[i] = lines[i].copy(confirm = c.copy(state = if (said.startsWith("Done")) "done" else if (yes) "failed" else "no"))
            lines += Line(said); status.value = said
            if (voice) speakOut(said)
        }
    }

    // ---- push-to-talk
    fun startTalking() {
        if (busy.value) return
        quiet()
        try { recorder.start(); listening.value = true; status.value = "Listening. Tap again to send." }
        catch (e: Exception) { status.value = "The microphone isn't available." }
    }
    fun stopTalking() {
        listening.value = false
        val audio = recorder.stop() ?: run { status.value = "That was too short. Hold the button while you talk."; return }
        busy.value = true; status.value = "Listening to what you said"
        viewModelScope.launch {
            val heard = try { io { store.api().transcribe(audio, "audio/mp4") } } catch (e: FaithError) { status.value = e.message ?: ""; lines += Line(e.message ?: ""); "" }
            busy.value = false
            if (heard.isBlank()) { if (status.value.startsWith("Listening")) status.value = "I didn't catch that."; return@launch }
            ask(heard)
        }
    }
    private suspend fun speakOut(text: String) {
        try {
            val mp3 = io { store.api().speak(text.replace(Regex("[*_#`>]"), "")) }
            speaking.value = true; speaker.play(mp3) { ui { speaking.value = false } }
        } catch (_: Exception) { speaking.value = false /* reading aloud is a nicety */ }
    }
    fun quiet() { speaker.stop(); speaking.value = false }

    // ---- the inbox while the app is open: a long poll (the worker covers the background)
    fun startInbox() {
        if (inboxJob?.isActive == true || !store.signedIn) return
        inboxJob = viewModelScope.launch {
            while (isActive) {
                try {
                    val (items, last) = io { store.api().inbox(store.inboxLast, 30) }
                    items.forEach { lines += Line("${it.title}: ${it.text}", fromInbox = true); FaithApp.notify(getApplication(), it) }
                    store.inboxLast = last
                } catch (e: FaithError) { delay(15_000) }
            }
        }
    }
    fun stopInbox() { inboxJob?.cancel(); inboxJob = null }

    fun loadHistory() {
        viewModelScope.launch {
            try {
                val d = io { store.api().latest() }
                val msgs = d.optJSONArray("messages") ?: return@launch
                if (lines.isNotEmpty()) return@launch
                store.conversationId = if (d.isNull("conversation_id")) null else d.optString("conversation_id")
                for (i in 0 until msgs.length()) { val m = msgs.getJSONObject(i); lines += Line(m.optString("content"), me = m.optString("role") == "user") }
            } catch (_: FaithError) { }
        }
    }
    fun newTopic() { store.conversationId = null; lines.clear(); status.value = "A fresh start." }

    override fun onCleared() { speaker.stop(); stopInbox() }

    companion object {
        /** "allglance_get_day" -> "checking the calendar": what a person reads while FAITH looks things up. */
        fun friendlyTool(name: String): String = when {
            name.contains("day") || name.contains("calendar") -> "checking the calendar"
            name.contains("shopping") -> "checking the shopping list"
            name.contains("meal") || name.contains("recipe") -> "checking meals"
            name.startsWith("Hass") || name.startsWith("home_") || name.contains("camera") -> "checking the house"
            name.contains("notes") || name.contains("wiki") || name.contains("memory") || name.contains("context") -> "checking your notes"
            name.startsWith("coinpile") -> "checking money"
            name.startsWith("photos_") -> "looking through photos"
            else -> "checking"
        }
    }
}
