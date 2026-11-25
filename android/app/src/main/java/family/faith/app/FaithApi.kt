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
    fun chat(text: String, conversationId: String?, images: List<String>, onEvent: (JSONObject) -> Unit) {
        val body = JSONObject().put("text", text)
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

    /** The answer in FAITH's voice: MP3 bytes. */
    fun speak(text: String): ByteArray {
        val c = open("/api/voice/speak", "POST", "application/json", readTimeoutMs = 120_000)
        try {
            send(c, JSONObject().put("text", text).toString().toByteArray())
            return c.inputStream.readBytes()
        } finally { c.disconnect() }
    }

    /** What FAITH sent this person since `after` (section 5). `waitSeconds` > 0 long-polls. */
    fun inbox(after: Long, waitSeconds: Int): Pair<List<InboxItem>, Long> {
        val d = json("/api/inbox?after=$after&wait=$waitSeconds", readTimeoutMs = (waitSeconds + 15) * 1000)
        return parseInbox(d, after)
    }

    companion object {
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
