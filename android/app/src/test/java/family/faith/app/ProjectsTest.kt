package family.faith.app

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

/** What the app reads from GET /api/projects and the thread calls (docs/projects.md). */
class ProjectsTest {
    val sample = JSONObject("""{"projects":[
        {"id":"person-sam","owner":"person:sam","name":"Sam","threads":[
          {"id":"t1","title":"Dinner ideas","brief":"Find three dinners","status":"done","stage":"done","resolved":false,"last_text":"Tonight is **fish tacos**.\n- tortillas","updated_at":1795700000000},
          {"id":"t2","title":"Gift for Robin","brief":"x","status":"working","stage":"working","resolved":false,"last_text":"","updated_at":1795729000000},
          {"id":"t4","title":"Surprise party ideas","brief":"Ideas for Kit's party","status":"done","stage":"review","resolved":false,"last_text":"A picnic at the lake.","throwaway":true,"updated_at":1795728000000},
          {"id":"t5","title":"Return the library books","brief":"x","status":"done","stage":"resolved","resolved":true,"last_text":"Due Friday.","updated_at":1795400000000}]},
        {"id":"family","owner":"household","name":"Family","instructions":"Robin doesn't eat mushrooms.","threads":[
          {"id":"t3","title":"Saturday","brief":"Plan Saturday","status":"waiting","stage":"needs_you","resolved":false,"last_text":"Waiting for approval","updated_at":1795726000000}]},
        {"id":"parents","owner":"parents","name":"Parents","threads":[]}]}""")

    @Test fun projectsAndThreads() {
        val ps = ProjectsJson.projects(sample)
        assertEquals(listOf("Mine", "Family", "Parents"), ps.map { it.label })
        assertEquals(listOf("t1", "t2", "t4", "t5"), ps[0].threads.map { it.id })
        assertEquals(listOf(false, false, true, false), ps[0].threads.map { it.throwaway })
        assertEquals("Robin doesn't eat mushrooms.", ps[1].instructions)
        assertEquals(true, ps[1].threads[0].needsYou)
        assertEquals("Tonight is fish tacos. tortillas", ProjectsJson.preview(ps[0].threads[0].last))
    }

    @Test fun whatTheVoiceLayoutsSay() {
        val g = ProjectGlance.from(ProjectsJson.projects(sample))!!
        assertEquals("1 needs you · 1 to review · 1 working", g.words)
        assertEquals("Family: Saturday (waiting for approval)", g.top)
        assertNull(ProjectGlance(0, 0, null).words)
        assertNull(ProjectGlance.from(null))
    }

    @Test fun stagesGroupedLikeStudio() {
        val ps = ProjectsJson.projects(sample)
        assertEquals(listOf("working", "review", "done", "resolved"), ProjectsJson.groups(ps[0].threads).map { it.first })
        assertEquals("Ready for review", ProjectsJson.stageLabel("review"))
        // An older FAITH without stages: worked out from status and resolved.
        assertEquals("needs_you", FamilyThread("x", "x", "x", "failed", false, "").stageNow)
        assertEquals("resolved", FamilyThread("x", "x", "x", "done", true, "").stageNow)
        val now = 1795730000000
        assertEquals("just now", ProjectsJson.ago(now - 20_000, now))
        assertEquals("5 min ago", ProjectsJson.ago(now - 5 * 60_000, now))
        assertEquals("3 h ago", ProjectsJson.ago(now - 3 * 3_600_000, now))
        assertEquals("yesterday", ProjectsJson.ago(now - 26 * 3_600_000, now))
        assertEquals("4 days ago", ProjectsJson.ago(now - 4 * 86_400_000L, now))
        assertEquals("", ProjectsJson.ago(0, now))
    }

    @Test fun aChangeHeldForAYes() {
        val c = ProjectsJson.change(JSONObject("""{"pending":[{"id":"p1","summary":"send this to the Family project"}],"requests":[]}"""))
        assertNull(c.thread)
        assertEquals("p1" to "send this to the Family project", c.pending[0])
        assertEquals(true, ProjectsJson.change(JSONObject("""{"ok":true,"thread":"t4","resolved":true,"deleted":true}""")).deleted)
        assertEquals("t9", ProjectsJson.change(JSONObject("""{"ok":true,"thread":"t9","pending":[],"requests":[]}""")).thread)
        val m = ProjectsJson.messages(JSONObject("""{"thread":{},"messages":[{"role":"user","text":"job"},{"role":"assistant","text":"done"}]}"""))
        assertEquals(listOf(false, true), m.map { it.fromFaith })
    }
}
