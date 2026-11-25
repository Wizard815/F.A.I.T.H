package family.faith.app

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/** The parts of docs/clients.md the app reads: FAITH's chat stream and the inbox. */
class ContractTest {
    @Test fun chatStreamLines() {
        assertEquals("text", Sse.parse("data: {\"type\":\"text\",\"delta\":\"Hi\"}")!!.getString("type"))
        assertEquals("unlock Front door", Sse.parse("data:{\"type\":\"confirm\",\"id\":\"p1\",\"summary\":\"unlock Front door\"}")!!.getString("summary"))
        assertNull(Sse.parse(""))
        assertNull(Sse.parse(": keep-alive"))
        assertNull(Sse.parse("data: not json"))
    }

    @Test fun inboxItemsAndTheLastId() {
        val d = JSONObject("""{"items":[{"id":7,"at":1,"kind":"message","title":"FAITH","text":"Front door: It's Sam.","ref":null},
            {"id":8,"at":2,"kind":"approval","title":"Waiting for approval","text":"add bread","ref":"a1"}],"last":8}""")
        val (items, last) = FaithApi.parseInbox(d, 6)
        assertEquals(listOf(7L, 8L), items.map { it.id })
        assertNull(items[0].ref)
        assertEquals("a1", items[1].ref)
        assertEquals(8L, last)
        assertEquals(6L, FaithApi.parseInbox(JSONObject("{\"items\":[]}"), 6).second)
    }

    @Test fun theBoard() {
        val b = BoardView.parse(JSONObject("""{"person":{"id":"sam","name":"Sam"},"day":"2026-11-25",
            "brief":{"day":"2026-11-25","text":"Good morning.","by":"you","at":1},
            "weather":{"place":"Home","condition":"rainy","unit":"°F","temperature":44,"feels_like":null,"humidity":80,"wind":null,"wind_unit":"",
              "days":[{"date":"2026-11-26","condition":"cloudy","high":47,"low":35,"rain":null}]},
            "news":{"error":"Town News: The feed answered 503."},
            "projects":[{"id":"p1","name":"Garden shed","status":"blocked","next":"Order timber","fav":true,"archived":false,"last":"Cleared it"}],
            "log":[{"id":1,"project":"Garden shed","text":"Cleared it","by":"you","day":"2026-11-25","at":1}],
            "uptime":{"up":3,"down":1,"monitors":[{"name":"Printer","group":"Home","status":"down","uptime24":50,"ignored":false}]},
            "system":null,
            "cards":[{"id":"today","title":"Today","kind":"schedule","items":[{"title":"Dentist","time":"09:30"}]},{"id":"chores","title":"Chores","kind":"list","empty":"Nothing here."}]}"""))
        assertEquals("Sam", b.person)
        assertEquals("Good morning.", b.brief)
        assertEquals("44", b.weather!!.value!!.temperature)
        assertEquals("–", b.weather!!.value!!.days[0].rain)
        assertNull(b.news!!.value)
        assertEquals("Town News: The feed answered 503.", b.news!!.error)
        assertEquals("Blocked", BoardView.statusWord(b.projects!![0].status))
        assertEquals("3 up, 1 down\nPrinter is down", b.uptime!!.value)
        assertNull(b.system)
        assertEquals(listOf("Dentist"), b.cards[0].items.map { it.title })
        assertEquals("Nothing here.", b.cards[1].empty)
        // The household's board: no one's projects, log or brief.
        val h = BoardView.parse(JSONObject("""{"person":null,"brief":null,"projects":null,"log":null,"weather":null,"news":null,"uptime":null,"system":null,"cards":[]}"""))
        assertNull(h.person); assertNull(h.projects); assertNull(h.log); assertNull(h.brief)
    }

    @Test fun photosFaithShowed() {
        val e = JSONObject("""{"type":"photos","items":[{"source":"photos","id":"00000000-0000-4000-8000-000000000001","kind":"photo","taken":"2026-07-04 10:00","place":"Holland, USA","people":["Robin"],"link":"https://photos.example.org/photos/x"},
            {"source":"photos","id":"","kind":"video","taken":""}]}""")
        val p = FaithApi.parsePhotos(e)
        assertEquals(1, p.size)
        assertEquals("Photo from 2026-07-04 in Holland, USA with Robin", p[0].label)
        assertEquals("https://photos.example.org/photos/x", p[0].link)
        assertEquals(emptyList<Shown>(), FaithApi.parsePhotos(JSONObject("{\"type\":\"photos\"}")))
    }

    @Test fun toolNamesInPlainWords() {
        assertEquals("checking the calendar", ChatModel.friendlyTool("allglance_get_day"))
        assertEquals("checking the house", ChatModel.friendlyTool("HassTurnOff"))
        assertEquals("checking your notes", ChatModel.friendlyTool("wiki_notes_search"))
        assertEquals("looking through photos", ChatModel.friendlyTool("photos_search"))
        assertEquals("checking", ChatModel.friendlyTool("something_else"))
    }
}

class PhotoTest {
    @Test fun sidewaysPhotosAreTurnedUpright() {
        assertEquals(90f, Photos.turnFor(6))
        assertEquals(180f, Photos.turnFor(3))
        assertEquals(270f, Photos.turnFor(8))
        assertEquals(0f, Photos.turnFor(1))
        assertEquals(0f, Photos.turnFor(0))
    }
}

class GlanceTest {
    private val board = BoardView.parse(JSONObject("""{"person":{"id":"sam","name":"Sam"},"brief":{"text":"Good evening, Sam. Rain until late. Dinner is fish tacos.","day":"x","by":"faith","at":1},
        "weather":{"place":"Home","condition":"rainy","unit":"°F","temperature":44,"days":[]},"news":null,"projects":[],"log":[],"uptime":null,"system":null,
        "cards":[{"id":"today","title":"Today","kind":"schedule","items":[{"title":"School pickup","time":"15:15"},{"title":"Swim lesson","time":"18:30"},{"title":"Book club","time":"20:00"}]},
          {"id":"meals","title":"Meals","kind":"meals","items":[{"title":"Pancakes","label":"breakfast"},{"title":"Fish tacos","label":"dinner"}]},
          {"id":"shopping","title":"Shopping","kind":"checklist","items":[{"title":"Limes"},{"title":"Milk","done":true},{"title":"Tortillas"}]},
          {"id":"home","title":"Home","kind":"entities","entities":[{"entity_id":"lock.front_door","name":"Front door","state":"locked"}]}]}"""))

    @Test fun thePanelsTiles() {
        val g = Glance.from(board, "18:47")
        assertEquals("Book club", g.next); assertEquals("20:00", g.nextTime)
        assertEquals("Fish tacos", g.dinner)
        assertEquals(2, g.shopping); assertEquals(listOf("Limes", "Tortillas"), g.shoppingFirst)
        assertEquals(listOf("Front door: locked"), g.house)
        assertEquals("Rain until late.", g.brief)
        assertEquals("44°F", g.weather)
    }

    @Test fun nothingLeftTodayAndNoCards() {
        assertEquals("", Glance.from(board, "21:00").next)
        val empty = Glance.from(null, "09:00")
        assertNull(empty.next); assertNull(empty.dinner); assertNull(empty.shopping); assertNull(empty.house); assertNull(empty.weather)
    }

    @Test fun theLayouts() {
        assertEquals(listOf("voice-focus", "voice-panel", "voice-dashboard"), Layouts.ALL)
        assertEquals("Voice panel: talk, with a few panels", Layouts.NAMES["voice-panel"])
    }
}

class EmblemTest {
    @Test fun theD20AndTheHive() {
        assertEquals(12, EmblemEngine.ICO.size)
        assertEquals(30, EmblemEngine.EDGES.size)
        assertEquals(20, EmblemEngine.FACES.size)
        assertEquals(7, EmblemEngine.BEE.size)
        assertEquals(20, EmblemEngine.LINKS.size)
    }

    @Test fun itEasesIntoEachMood() {
        val e = EmblemEngine()
        e.state = EmblemState.THINKING
        repeat(200) { e.step(0.016) }
        assertEquals(0.55, e.cur.spin, 0.01)
        assertEquals(3.2, e.cur.rings, 0.05)
        e.state = EmblemState.IDLE; e.settle()
        assertEquals(0.16, e.cur.spin, 1e-9)
        val t = e.t; e.step(5.0)
        assertEquals(t + 0.05, e.t, 1e-9)   // a long pause moves it on by one frame at most
    }

    @Test fun theVoiceLevel() {
        val e = EmblemEngine()
        assertEquals(0.0, e.level(0.8f), 0.0)   // idle: no voice
        e.state = EmblemState.LISTENING
        assertEquals(0.8, e.level(0.8f), 1e-6)
        assertEquals(1.0, e.level(3f), 0.0)
        assertTrue(e.level(null) in 0.1..0.5)      // no meter: a gentle pulse
    }

    @Test fun listeningDrawsTheHiveIn() {
        val e = EmblemEngine()
        val far = e.beeAt(0, 1.0).map { kotlin.math.abs(it) }.sum()
        e.state = EmblemState.LISTENING; e.settle()
        val near = e.beeAt(0, 1.0).map { kotlin.math.abs(it) }.sum()
        assertEquals(far * 0.7, near, 1e-9)
    }
}
