package family.faith.app

import org.json.JSONArray
import org.json.JSONObject
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.SocketTimeoutException
import java.net.URL
import java.net.URLEncoder

/** A photo FAITH showed. Its picture comes from /api/photos/<source>/<id>; `link` opens it in Immich. */
data class Shown(val source: String, val id: String, val kind: String, val taken: String, val place: String?, val people: List<String>, val link: String?) {
    val label: String get() = listOfNotNull(if (kind == "video") "Video" else "Photo", taken.take(10).ifBlank { null }?.let { "from $it" }, place?.let { "in $it" }, people.takeIf { it.isNotEmpty() }?.let { "with " + it.joinToString(", ") }).joinToString(" ")
}

/** A message for people: shown as it is. */
class FaithError(message: String) : Exception(message)

data class InboxItem(val id: Long, val at: Long, val kind: String, val title: String, val text: String, val ref: String?)

/** One line of FAITH's chat stream (Server-Sent Events): `data: {json}`, or null for anything else. */
object Sse {
    fun parse(line: String): JSONObject? {
        val l = line.trim()
        if (!l.startsWith("data:")) return null
        return try { JSONObject(l.substring(5).trim()) } catch (e: Exception) { null }
    }
}

/** FAITH's client contract (docs/clients.md): sign in, ask, speak, say Yes, the inbox.
 *  Plain HttpURLConnection: no extra libraries, nothing leaves the home network. */
class FaithApi(baseUrl: String, private val token: String?) {
    val base = baseUrl.trim().trimEnd('/')

    private fun open(path: String, method: String, type: String? = null, readTimeoutMs: Int = 60_000): HttpURLConnection {
        val c = try { URL(base + path).openConnection() as HttpURLConnection } catch (e: Exception) {
            throw FaithError("That address doesn't look right. It's like http://192.168.1.20:8097")
        }
        c.requestMethod = method
        c.connectTimeout = 8_000
        c.readTimeout = readTimeoutMs
        c.setRequestProperty("Accept", "application/json, text/event-stream")
        if (token != null) c.setRequestProperty("Authorization", "Bearer $token")
        if (type != null) { c.doOutput = true; c.setRequestProperty("Content-Type", type) }
        return c
    }

    private fun send(c: HttpURLConnection, body: ByteArray?) {
        try {
            if (body != null) c.outputStream.use { it.write(body) }
            c.responseCode
        } catch (e: SocketTimeoutException) {
            throw FaithError("FAITH is taking too long to answer. Try again in a moment.")
        } catch (e: IOException) {
            throw FaithError("FAITH isn't answering. Check that you're on the home Wi-Fi and that FAITH is running.")
        }
        if (c.responseCode >= 400) {
            val msg = try { JSONObject(c.errorStream.bufferedReader().readText()).optString("error") } catch (e: Exception) { "" }
            // A 401 here is always this app's key: say it in the phone's terms, whatever FAITH's page would say.
            if (c.responseCode == 401 && token != null) throw FaithError("This phone isn't signed in to FAITH any more. Sign in again.")
            throw FaithError(msg.ifBlank { "FAITH answered ${c.responseCode}." })
        }
    }

    private fun json(path: String, method: String = "GET", body: JSONObject? = null, readTimeoutMs: Int = 60_000): JSONObject {
        val c = open(path, method, if (body != null) "application/json" else null, readTimeoutMs)
        try {
            send(c, body?.toString()?.toByteArray())
            return JSONObject(c.inputStream.bufferedReader().readText().ifBlank { "{}" })
        } finally { c.disconnect() }
    }

    /** Sign in once with a password: a client token for this person (docs/clients.md, section 1). */
    fun signIn(person: String, password: String, deviceName: String): JSONObject =
        json("/api/auth/client", "POST", JSONObject().put("person", person).put("password", password).put("name", deviceName))

    fun me(): JSONObject = json("/api/me")

    /** Signing out: this phone's key is removed on FAITH too. */
    fun removeClient(name: String) { if (name.isNotBlank()) json("/api/me/clients/" + URLEncoder.encode(name, "UTF-8"), "DELETE") }

    /** Ask, streaming the answer: each event as FAITH sends it (section 2). Blocking: call it off the main thread. */
    fun chat(text: String, conversationId: String?, images: List<String>, spoken: Boolean = false, onEvent: (JSONObject) -> Unit) {
        val body = JSONObject().put("text", text)
        if (spoken) body.put("spoken", true)   // read aloud: FAITH keeps it to a few plain sentences
        if (conversationId != null) body.put("conversation_id", conversationId)
        if (images.isNotEmpty()) body.put("images", JSONArray(images))
        val c = open("/api/chat", "POST", "application/json", readTimeoutMs = 300_000)
        try {
            send(c, body.toString().toByteArray())
            BufferedReader(InputStreamReader(c.inputStream)).useLines { lines -> lines.forEach { l -> Sse.parse(l)?.let(onEvent) } }
        } catch (e: SocketTimeoutException) {
            throw FaithError("FAITH is still working on it. The answer will come in your notifications.")
        } finally { c.disconnect() }
    }

    fun latest(): JSONObject = json("/api/chat/latest")

    /** Yes or No to a held change (section 4). */
    fun confirm(id: String, approve: Boolean): String =
        json("/api/chat/confirm/" + URLEncoder.encode(id, "UTF-8"), "POST", JSONObject().put("approve", approve)).optString("text")

    /** A recording to text (section 3). */
    fun transcribe(audio: ByteArray, mime: String): String {
        val c = open("/api/voice/transcribe", "POST", mime, readTimeoutMs = 120_000)
        try {
            send(c, audio)
            return JSONObject(c.inputStream.bufferedReader().readText()).optString("text")
        } finally { c.disconnect() }
    }

    /** A photo's picture (a JPEG), from the source that found it, with this phone's key. */
    fun photo(source: String, id: String): ByteArray {
        val c = open("/api/photos/" + URLEncoder.encode(source, "UTF-8") + "/" + URLEncoder.encode(id, "UTF-8"), "GET")
        try { return c.inputStream.readBytes() } finally { c.disconnect() }
    }

    /** The answer in FAITH's voice: MP3 bytes. */
    fun speak(text: String): ByteArray {
        val c = open("/api/voice/speak", "POST", "application/json", readTimeoutMs = 120_000)
        try {
            send(c, JSONObject().put("text", text).toString().toByteArray())
            return c.inputStream.readBytes()
        } finally { c.disconnect() }
    }

    /** The info board (section 6): brief, weather, the day cards, projects, the log, news. */
    fun board(): BoardView = BoardView.parse(json("/api/board"))

    /** The morning brief, written now by FAITH. The model takes its time. */
    fun writeBrief(): String = json("/api/board/brief", "POST", JSONObject(), readTimeoutMs = 300_000).optString("text")

    fun addLog(text: String, project: String?) {
        val b = JSONObject().put("text", text)
        if (!project.isNullOrBlank()) b.put("project", project)
        json("/api/board/log", "POST", b)
    }

    fun addProject(name: String) { json("/api/board/projects", "POST", JSONObject().put("name", name)) }

    fun setProjectStatus(name: String, status: String) {
        json("/api/board/projects/" + URLEncoder.encode(name, "UTF-8").replace("+", "%20"), "POST", JSONObject().put("status", status))
    }

    // Family projects (docs/projects.md): yours, Family, and Parents for grown-ups.
    private fun enc(s: String) = URLEncoder.encode(s, "UTF-8").replace("+", "%20")
    fun projects(): List<FamilyProject> = ProjectsJson.projects(json("/api/projects"))
    fun projectThread(project: String, thread: String): List<ThreadMessage> = ProjectsJson.messages(json("/api/projects/${enc(project)}/threads/${enc(thread)}"))
    /** `throwaway`: a private thread that keeps nothing, in your own project only. */
    fun startThread(project: String, brief: String, title: String?, throwaway: Boolean = false): ProjectChange {
        val b = JSONObject().put("brief", brief)
        if (!title.isNullOrBlank()) b.put("title", title)
        if (throwaway) b.put("throwaway", true)
        return ProjectsJson.change(json("/api/projects/${enc(project)}/threads", "POST", b))
    }
    fun messageThread(project: String, thread: String, text: String): ProjectChange =
        ProjectsJson.change(json("/api/projects/${enc(project)}/threads/${enc(thread)}/message", "POST", JSONObject().put("text", text)))
    fun resolveThread(project: String, thread: String, resolved: Boolean): ProjectChange =
        ProjectsJson.change(json("/api/projects/${enc(project)}/threads/${enc(thread)}/resolved", "PUT", JSONObject().put("resolved", resolved)))

    /** What FAITH sent this person since `after` (section 5). `waitSeconds` > 0 long-polls. */
    fun inbox(after: Long, waitSeconds: Int): Pair<List<InboxItem>, Long> {
        val d = json("/api/inbox?after=$after&wait=$waitSeconds", readTimeoutMs = (waitSeconds + 15) * 1000)
        return parseInbox(d, after)
    }

    companion object {
        /** A `photos` event: the photos FAITH showed (from Immich). */
        fun parsePhotos(e: JSONObject): List<Shown> {
            val a = e.optJSONArray("items") ?: return emptyList()
            return (0 until a.length()).mapNotNull { i ->
                val p = a.optJSONObject(i) ?: return@mapNotNull null
                val people = p.optJSONArray("people")
                Shown(p.optString("source"), p.optString("id"), p.optString("kind", "photo"), p.optString("taken"),
                    p.optString("place").ifBlank { null }, if (people == null) emptyList() else (0 until people.length()).map { people.optString(it) },
                    p.optString("link").ifBlank { null })
            }.filter { it.id.isNotBlank() && it.source.isNotBlank() }
        }

        fun parseInbox(d: JSONObject, after: Long): Pair<List<InboxItem>, Long> {
            val a = d.optJSONArray("items") ?: JSONArray()
            val items = (0 until a.length()).map { i ->
                val o = a.getJSONObject(i)
                InboxItem(o.getLong("id"), o.optLong("at"), o.optString("kind", "message"), o.optString("title", "FAITH"), o.optString("text"), if (o.isNull("ref")) null else o.optString("ref"))
            }
            return items to d.optLong("last", after)
        }
    }
}
