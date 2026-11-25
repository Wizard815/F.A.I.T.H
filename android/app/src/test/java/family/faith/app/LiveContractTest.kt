package family.faith.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assume.assumeTrue
import org.junit.Test
import java.io.File

/** The app's own network code against a real FAITH. Skipped unless these are set:
 *    FAITH_URL=http://192.168.1.20:8097 FAITH_PERSON=sam FAITH_PASSWORD=…
 *  optional: FAITH_HA_TOKEN (FAITH's Home Assistant integration token, to send a message to the
 *  inbox), FAITH_AUDIO (a short m4a of someone talking) and FAITH_TTS=1 (Argos has a voice model).
 *    ./gradlew testDebugUnitTest --tests '*LiveContractTest*' */
class LiveContractTest {
    private val env = System.getenv()
    private val url = env["FAITH_URL"].orEmpty()

    @Test fun theWholeContract() {
        assumeTrue("set FAITH_URL, FAITH_PERSON and FAITH_PASSWORD to run against a real FAITH", url.isNotBlank())
        val person = env.getValue("FAITH_PERSON")

        // 1. Sign in once: a client token, never the password again.
        val r = FaithApi(url, null).signIn(person, env.getValue("FAITH_PASSWORD"), "live test")
        val token = r.getString("token"); val name = r.getString("name")
        assertTrue(token.startsWith("fapp_"))
        val api = FaithApi(url, token)
        assertEquals(person, api.me().getString("id"))
        println("signed in as $person: $name")

        // 2 and 4. Ask; a lock waits for a Yes on this app. Say No.
        val events = mutableListOf<org.json.JSONObject>()
        api.chat("unlock the front door", null, emptyList()) { events += it }
        println("events: " + events.map { it.optString("type") }.distinct())
        val confirm = events.firstOrNull { it.optString("type") == "confirm" }
        assertTrue("a lock waits for a Yes: ${events.lastOrNull()}", confirm != null)
        println("held: ${confirm!!.optString("summary")}")
        val no = api.confirm(confirm.optString("id"), false)
        println("no -> $no")
        assertTrue(no.startsWith("Okay, I won't"))

        // 3. Voice: a recording to text, and the answer read aloud.
        env["FAITH_AUDIO"]?.let { path ->
            val heard = api.transcribe(File(path).readBytes(), "audio/mp4")
            println("heard: $heard")
            assertTrue(heard.isNotBlank())
        }
        if (env["FAITH_TTS"] == "1") {   // only when Argos has a text-to-speech model
            val mp3 = api.speak("Hello from FAITH.")
            println("speech: ${mp3.size} bytes")
            assertTrue(mp3.size > 1000)
        }

        // 5. The inbox: a message sent to this person arrives on a long poll.
        val (_, start) = api.inbox(0, 0)
        env["FAITH_HA_TOKEN"]?.let { ha ->
            Thread {
                Thread.sleep(1500)
                val c = java.net.URL("$url/api/ha/send").openConnection() as java.net.HttpURLConnection
                c.requestMethod = "POST"; c.doOutput = true
                c.setRequestProperty("Content-Type", "application/json"); c.setRequestProperty("Authorization", "Bearer $ha")
                c.outputStream.use { it.write("{\"to\":\"$person\",\"message\":\"Front door: It's the courier.\",\"user_id\":null}".toByteArray()) }
                println("sent through HA: ${c.responseCode}")
            }.start()
            val t0 = System.currentTimeMillis()
            val (items, last) = api.inbox(start, 20)
            println("inbox after ${System.currentTimeMillis() - t0} ms: ${items.map { it.text }}")
            assertTrue(items.any { it.text.contains("courier") })
            assertTrue(last > start)
        }

        // Signing out removes this app's token on FAITH.
        api.removeClient(name)
        val gone = try { api.me(); false } catch (e: FaithError) { println("after sign-out: ${e.message}"); true }
        assertTrue(gone)
    }
}
