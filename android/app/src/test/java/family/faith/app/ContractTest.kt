package family.faith.app

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
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

    @Test fun toolNamesInPlainWords() {
        assertEquals("checking the calendar", ChatModel.friendlyTool("allglance_get_day"))
        assertEquals("checking the house", ChatModel.friendlyTool("HassTurnOff"))
        assertEquals("checking your notes", ChatModel.friendlyTool("wiki_notes_search"))
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
