package family.faith.app

import app.cash.paparazzi.DeviceConfig
import app.cash.paparazzi.Paparazzi
import app.cash.paparazzi.detectEnvironment
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import android.app.Application
import org.json.JSONObject
import org.junit.Rule
import org.junit.Test

/** The emblem drawn on the computer (no phone): `./gradlew recordPaparazziDebug` writes the
 *  pictures to src/test/snapshots, `verifyPaparazziDebug` checks nothing changed. */
class ScreensTest {
    // Paparazzi 1.3.5 draws with Android 14's layoutlib; the app builds against 15, so say 14
    // (Compose otherwise calls a text method layoutlib doesn't have).
    @get:Rule val paparazzi = Paparazzi(deviceConfig = DeviceConfig.PIXEL_5, environment = detectEnvironment().copy(compileSdkVersion = 34))

    @Test fun emblemStates() {
        paparazzi.snapshot {
            Column(Modifier.fillMaxSize().background(Color(0xFFF6EFE4)), horizontalAlignment = Alignment.CenterHorizontally) {
                Row { Emblem(EmblemState.IDLE, 180.dp, dark = false); Emblem(EmblemState.LISTENING, 180.dp, dark = false) }
                Row(Modifier.background(Color(0xFF18110C))) { Emblem(EmblemState.THINKING, 180.dp, dark = true); Emblem(EmblemState.SPEAKING, 180.dp, dark = true) }
            }
        }
    }

    /** An Application over Paparazzi's own context (the models want one). */
    private class TestApp(base: android.content.Context) : Application() {
        init { attachBaseContext(base) }
        private val prefs = MemoryPrefs()
        override fun getSharedPreferences(name: String?, mode: Int): android.content.SharedPreferences = prefs
    }
    /** Settings kept in memory (layoutlib has no real ones). */
    private class MemoryPrefs : android.content.SharedPreferences {
        val m = mutableMapOf<String, Any?>()
        override fun getAll() = m
        override fun getString(k: String?, d: String?) = m[k] as String? ?: d
        override fun getStringSet(k: String?, d: MutableSet<String>?) = d
        override fun getInt(k: String?, d: Int) = m[k] as Int? ?: d
        override fun getLong(k: String?, d: Long) = m[k] as Long? ?: d
        override fun getFloat(k: String?, d: Float) = m[k] as Float? ?: d
        override fun getBoolean(k: String?, d: Boolean) = m[k] as Boolean? ?: d
        override fun contains(k: String?) = m.containsKey(k)
        override fun registerOnSharedPreferenceChangeListener(l: android.content.SharedPreferences.OnSharedPreferenceChangeListener?) {}
        override fun unregisterOnSharedPreferenceChangeListener(l: android.content.SharedPreferences.OnSharedPreferenceChangeListener?) {}
        override fun edit(): android.content.SharedPreferences.Editor = object : android.content.SharedPreferences.Editor {
            override fun putString(k: String?, v: String?) = apply { m[k!!] = v }
            override fun putStringSet(k: String?, v: MutableSet<String>?) = this
            override fun putInt(k: String?, v: Int) = apply { m[k!!] = v }
            override fun putLong(k: String?, v: Long) = apply { m[k!!] = v }
            override fun putFloat(k: String?, v: Float) = apply { m[k!!] = v }
            override fun putBoolean(k: String?, v: Boolean) = apply { m[k!!] = v }
            override fun remove(k: String?) = apply { m.remove(k) }
            override fun clear() = apply { m.clear() }
            override fun commit() = true
            override fun apply() {}
        }
    }
    private fun app(): Application = TestApp(paparazzi.context)

    /** FAITH's theme, and a stand-in for the activity that would ask for the microphone. */
    @androidx.compose.runtime.Composable
    private fun Screen(content: @androidx.compose.runtime.Composable () -> Unit) {
        val owner = object : androidx.activity.result.ActivityResultRegistryOwner {
            override val activityResultRegistry = object : androidx.activity.result.ActivityResultRegistry() {
                override fun <I, O> onLaunch(requestCode: Int, contract: androidx.activity.result.contract.ActivityResultContract<I, O>, input: I, options: androidx.core.app.ActivityOptionsCompat?) {}
            }
        }
        androidx.compose.runtime.CompositionLocalProvider(androidx.activity.compose.LocalActivityResultRegistryOwner provides owner) {
            FaithTheme { androidx.compose.material3.Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) { content() } }
        }
    }

    private fun chat(): ChatModel {
        return ChatModel(app()).apply {
            store.personName = "Sam"
            lines += Line("What's for dinner?", me = true)
            lines += Line("Tonight is fish tacos. The tortillas, limes and coriander are already on the list.")
        }
    }

    @Test fun voiceFocus() {
        val c = chat()
        paparazzi.snapshot { Screen { FocusScreen(c, {}, {}) } }
    }

    @Test fun voiceFocusDark() {
        paparazzi.unsafeUpdateConfig(deviceConfig = DeviceConfig.PIXEL_5.copy(nightMode = com.android.resources.NightMode.NIGHT))
        val c = chat()
        paparazzi.snapshot { Screen { FocusScreen(c, {}, {}) } }
    }

    @Test fun voicePanel() {
        val c = chat().apply { lines.clear() }
        val b = BoardModel(app())
        b.board.value = BoardView.parse(JSONObject("""{"person":{"id":"sam","name":"Sam"},"brief":{"text":"Good evening, Sam. Rain until late tonight.","day":"x","by":"faith","at":1},
            "weather":{"place":"Home","condition":"rainy","unit":"°F","temperature":44,"days":[]},"news":null,"projects":[],"log":[],"uptime":null,"system":null,
            "cards":[{"id":"today","title":"Today","kind":"schedule","items":[{"title":"Book club call","time":"23:59"}]},
              {"id":"meals","title":"Meals","kind":"meals","items":[{"title":"Fish tacos","label":"dinner"}]},
              {"id":"shopping","title":"Shopping","kind":"checklist","items":[{"title":"Tortillas"},{"title":"Limes"},{"title":"Coriander"}]},
              {"id":"home","title":"Home","kind":"entities","entities":[{"entity_id":"lock.front_door","name":"Front door","state":"locked"},{"entity_id":"light.kitchen","name":"Kitchen lights","state":"on"}]}]}"""))
        val p = ProjectsModel(app()).apply { list.value = ProjectsJson.projects(ProjectsTest().sample) }
        paparazzi.snapshot { Screen { PanelScreen(c, b, {}, {}, p) } }
    }

    @Test fun projects() {
        val p = ProjectsModel(app()).apply { list.value = ProjectsJson.projects(ProjectsTest().sample) }
        paparazzi.snapshot { Screen { ProjectsScreen(p) } }
    }

    @Test fun projectsThread() {
        val p = ProjectsModel(app()).apply {
            list.value = ProjectsJson.projects(ProjectsTest().sample)
            open.value = "person-sam" to "t1"
            messages.value = listOf(ThreadMessage(false, "Find three dinners"), ThreadMessage(true, "Tonight is **fish tacos**. Tortillas and limes are on the list."))
        }
        paparazzi.snapshot { Screen { ProjectsScreen(p) } }
    }

    @Test fun voiceFocusProjects() {
        val c = chat().apply { lines.clear() }
        val p = ProjectsModel(app()).apply { list.value = ProjectsJson.projects(ProjectsTest().sample) }
        paparazzi.snapshot { Screen { FocusScreen(c, {}, {}, p) } }
    }
}
