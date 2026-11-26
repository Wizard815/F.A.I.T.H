package family.faith.app

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

/** What the app reads from GET /api/projects and the thread calls (docs/projects.md). */
class ProjectsTest {
    val sample = JSONObject("""{"projects":[
        {"id":"person-sam","owner":"person:sam","name":"Sam","threads":[
          {"id":"t1","title":"Dinner ideas","brief":"Find three dinners","status":"done","resolved":false,"last_text":"Tonight is **fish tacos**.\n- tortillas"},
          {"id":"t2","title":"Gift for Robin","brief":"x","status":"working","resolved":false,"last_text":""}]},
        {"id":"family","owner":"household","name":"Family","threads":[
          {"id":"t3","title":"Saturday","brief":"Plan Saturday","status":"waiting","resolved":false,"last_text":"Waiting for approval"}]},
        {"id":"parents","owner":"parents","name":"Parents","threads":[]}]}""")

    @Test fun projectsAndThreads() {
        val ps = ProjectsJson.projects(sample)
        assertEquals(listOf("Mine", "Family", "Parents"), ps.map { it.label })
        assertEquals(listOf("t1", "t2"), ps[0].threads.map { it.id })
        assertEquals(true, ps[1].threads[0].needsYou)
        assertEquals("Tonight is fish tacos. tortillas", ProjectsJson.preview(ps[0].threads[0].last))
    }

    @Test fun whatTheVoiceLayoutsSay() {
        val g = ProjectGlance.from(ProjectsJson.projects(sample))!!
        assertEquals("1 needs you · 1 working", g.words)
        assertEquals("Family: Saturday (waiting for approval)", g.top)
        assertNull(ProjectGlance(0, 0, null).words)
        assertNull(ProjectGlance.from(null))
    }

    @Test fun aChangeHeldForAYes() {
        val c = ProjectsJson.change(JSONObject("""{"pending":[{"id":"p1","summary":"send this to the Family project"}],"requests":[]}"""))
        assertNull(c.thread)
        assertEquals("p1" to "send this to the Family project", c.pending[0])
        assertEquals("t9", ProjectsJson.change(JSONObject("""{"ok":true,"thread":"t9","pending":[],"requests":[]}""")).thread)
        val m = ProjectsJson.messages(JSONObject("""{"thread":{},"messages":[{"role":"user","text":"job"},{"role":"assistant","text":"done"}]}"""))
        assertEquals(listOf(false, true), m.map { it.fromFaith })
    }
}
