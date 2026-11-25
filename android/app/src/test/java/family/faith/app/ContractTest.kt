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

    @Test fun toolNamesInPlainWords() {
        assertEquals("checking the calendar", ChatModel.friendlyTool("allglance_get_day"))
        assertEquals("checking the house", ChatModel.friendlyTool("HassTurnOff"))
        assertEquals("checking your notes", ChatModel.friendlyTool("wiki_notes_search"))
        assertEquals("checking", ChatModel.friendlyTool("something_else"))
    }
}
