package family.faith.app

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/** FAITH on the phone: sign in once, then ask, talk, say Yes. Opened as the phone's assistant it
 *  starts listening; shared a photo, it attaches it (docs/android.md, docs/clients.md). */
class MainActivity : ComponentActivity() {
    private val chat: ChatModel by viewModels()
    private var pendingIntent by mutableStateOf<Intent?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        pendingIntent = intent
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED)
            requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1)
        setContent { FaithTheme { Root(chat, pendingIntent) { pendingIntent = null } } }
    }
    override fun onNewIntent(intent: Intent) { super.onNewIntent(intent); pendingIntent = intent }
    override fun onStart() { super.onStart(); chat.startInbox() }
    override fun onStop() { super.onStop(); chat.stopInbox() }
}

// ---------------------------------------------------------------- look: brass & honey
private val Gold = Color(0xFF86601D); private val GoldLight = Color(0xFFDEB25A)
@Composable
fun FaithTheme(content: @Composable () -> Unit) {
    val dark = isSystemInDarkTheme()
    val scheme = if (dark) darkColorScheme(primary = GoldLight, onPrimary = Color(0xFF22160C), background = Color(0xFF18110C), surface = Color(0xFF241A13),
        onBackground = Color(0xFFF5ECDC), onSurface = Color(0xFFF5ECDC), surfaceVariant = Color(0xFF3A2A16), onSurfaceVariant = Color(0xFFB09C84), error = Color(0xFFE2745E))
    else lightColorScheme(primary = Gold, onPrimary = Color(0xFFFFFAF0), background = Color(0xFFF6EFE4), surface = Color(0xFFFCF8F1),
        onBackground = Color(0xFF2B1E15), onSurface = Color(0xFF2B1E15), surfaceVariant = Color(0xFFEFE5D5), onSurfaceVariant = Color(0xFF6E5A47), error = Color(0xFFB84838))
    MaterialTheme(colorScheme = scheme, content = content)
}
private val Serif = FontFamily.Serif

@Composable
fun Root(chat: ChatModel, intent: Intent?, consumed: () -> Unit) {
    var signedIn by remember { mutableStateOf(chat.store.signedIn) }
    Surface(Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
        if (!signedIn) SignIn(chat.store) { signedIn = true; chat.startInbox(); chat.loadHistory() }
        else Chat(chat, intent, consumed) { chat.store.signOut(); chat.lines.clear(); signedIn = false }
    }
}

// ---------------------------------------------------------------- signing in (once)
@Composable
fun SignIn(store: Store, done: () -> Unit) {
    var url by remember { mutableStateOf(store.baseUrl.ifBlank { "http://" }) }
    var person by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var error by remember { mutableStateOf("") }
    var busy by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    Column(Modifier.fillMaxSize().padding(24.dp).systemBarsPadding(), verticalArrangement = Arrangement.spacedBy(14.dp)) {
        Text("FAITH", fontFamily = Serif, fontSize = 34.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.semantics { heading() })
        Text("Sign in once. This phone then keeps a key for you, never your password.", color = MaterialTheme.colorScheme.onSurfaceVariant)
        OutlinedTextField(url, { url = it }, label = { Text("FAITH's address") }, supportingText = { Text("Like http://192.168.1.20:8097") },
            singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri), modifier = Modifier.fillMaxWidth())
        OutlinedTextField(person, { person = it.lowercase().trim() }, label = { Text("Your name in FAITH (id)") }, supportingText = { Text("Like sam") },
            singleLine = true, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(password, { password = it }, label = { Text("Your FAITH password") }, singleLine = true,
            visualTransformation = PasswordVisualTransformation(), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password), modifier = Modifier.fillMaxWidth())
        if (error.isNotBlank()) Text(error, color = MaterialTheme.colorScheme.error, modifier = Modifier.semantics { liveRegion = LiveRegionMode.Assertive })
        Button(enabled = !busy && url.length > 8 && person.isNotBlank() && password.isNotBlank(), modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp), onClick = {
            busy = true; error = ""
            scope.launch {
                try {
                    val r = withContext(Dispatchers.IO) { FaithApi(url, null).signIn(person, password, Build.MODEL ?: "phone") }
                    store.baseUrl = url; store.token = r.getString("token"); store.clientName = r.optString("name")
                    store.personName = r.optJSONObject("person")?.optString("name") ?: person
                    store.inboxLast = 0; password = ""
                    done()
                } catch (e: FaithError) { error = e.message ?: "That didn't work." } finally { busy = false }
            }
        }) { Text(if (busy) "Signing in…" else "Sign in") }
        Text("No password yet? A grown-up sets one for you on FAITH's admin page (People).", color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp)
    }
}

// ---------------------------------------------------------------- the chat
@Composable
fun Chat(chat: ChatModel, intent: Intent?, consumed: () -> Unit, signOut: () -> Unit) {
    val ctx = androidx.compose.ui.platform.LocalContext.current
    var input by remember { mutableStateOf("") }
    var menu by remember { mutableStateOf(false) }
    val list = rememberLazyListState()
    val scope = rememberCoroutineScope()
    val mic = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { ok -> if (ok) chat.startTalking() else chat.status.value = "FAITH needs the microphone to hear you. Allow it in Android's settings." }
    val talk = { if (ctx.checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) chat.startTalking() else mic.launch(Manifest.permission.RECORD_AUDIO) }
    val pick = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri: Uri? -> if (uri != null) attach(chat, ctx, uri, scope) }

    LaunchedEffect(Unit) { if (chat.lines.isEmpty()) chat.loadHistory() }
    LaunchedEffect(chat.lines.size) { if (chat.lines.isNotEmpty()) list.animateScrollToItem(chat.lines.size - 1) }
    // Opened as the assistant (hold home / power): start listening. Shared from another app: attach it.
    LaunchedEffect(intent) {
        val i = intent ?: return@LaunchedEffect
        when (i.action) {
            Intent.ACTION_ASSIST, "android.intent.action.VOICE_COMMAND" -> talk()
            Intent.ACTION_SEND -> {
                @Suppress("DEPRECATION") val uri = if (Build.VERSION.SDK_INT >= 33) i.getParcelableExtra(Intent.EXTRA_STREAM, Uri::class.java) else i.getParcelableExtra(Intent.EXTRA_STREAM)
                if (uri != null) attach(chat, ctx, uri, scope) else i.getStringExtra(Intent.EXTRA_TEXT)?.let { input = it }
            }
        }
        consumed()
    }

    Column(Modifier.fillMaxSize().systemBarsPadding().imePadding()) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text("FAITH", fontFamily = Serif, fontSize = 26.sp, fontWeight = FontWeight.SemiBold, modifier = Modifier.semantics { heading() })
                Text(chat.store.personName, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 14.sp)
            }
            TextButton(onClick = { chat.newTopic() }, modifier = Modifier.heightIn(min = 48.dp)) { Text("New topic") }
            Box {
                TextButton(onClick = { menu = true }, modifier = Modifier.heightIn(min = 48.dp).semantics { contentDescription = "More" }) { Text("⋮", fontSize = 22.sp) }
                DropdownMenu(menu, { menu = false }) {
                    DropdownMenuItem(text = { Text(if (chat.store.speakReplies) "Stop reading answers aloud" else "Read answers aloud") }, onClick = { chat.store.speakReplies = !chat.store.speakReplies; menu = false })
                    DropdownMenuItem(text = { Text("Sign out of this phone") }, onClick = {
                        menu = false
                        val api = chat.store.api(); val name = chat.store.clientName
                        scope.launch { withContext(Dispatchers.IO) { try { api.removeClient(name) } catch (_: Exception) { /* signed out here anyway */ } }; signOut() }
                    })
                }
            }
        }
        LazyColumn(Modifier.weight(1f).fillMaxWidth().padding(horizontal = 12.dp), state = list, verticalArrangement = Arrangement.spacedBy(8.dp)) {
            if (chat.lines.isEmpty()) item { Text("Ask anything, or hold the mic and talk.", color = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.padding(8.dp)) }
            itemsIndexed(chat.lines) { _, l -> LineView(l, chat.thumbs) { yes -> l.confirm?.let { chat.answer(it, yes) } } }
        }
        Text(chat.status.value, color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp,
            modifier = Modifier.padding(horizontal = 16.dp).semantics { liveRegion = LiveRegionMode.Polite })
        chat.attached.value?.let {
            Row(Modifier.padding(horizontal = 16.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("📷 Photo attached", modifier = Modifier.weight(1f))
                TextButton(onClick = { chat.attached.value = null }, modifier = Modifier.heightIn(min = 48.dp)) { Text("Remove photo") }
            }
        }
        Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            OutlinedButton(onClick = { if (chat.listening.value) chat.stopTalking() else talk() }, modifier = Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp)
                .semantics { contentDescription = if (chat.listening.value) "Stop and send" else "Talk to FAITH" }) { Text(if (chat.listening.value) "■" else "🎙") }
            OutlinedButton(onClick = { pick.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                modifier = Modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp).semantics { contentDescription = "Show FAITH a photo" }) { Text("📷") }
            OutlinedTextField(input, { input = it }, placeholder = { Text("Ask FAITH") }, modifier = Modifier.weight(1f).semantics { contentDescription = "Ask FAITH" }, maxLines = 4)
            Button(onClick = { chat.ask(input); input = "" }, enabled = !chat.busy.value && (input.isNotBlank() || chat.attached.value != null),
                modifier = Modifier.heightIn(min = 48.dp)) { Text("Send") }
        }
    }
}

@Composable
fun LineView(l: Line, thumbs: Map<String, ImageBitmap> = emptyMap(), answer: (Boolean) -> Unit) {
    val c = l.confirm
    if (c != null) {
        Card(colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant), modifier = Modifier.fillMaxWidth()) {
            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(c.summary, fontWeight = FontWeight.SemiBold)
                when (c.state) {
                    "waiting" -> Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(onClick = { answer(true) }, modifier = Modifier.heightIn(min = 48.dp).semantics { contentDescription = "Yes: ${c.summary}" }) { Text("Yes") }
                        OutlinedButton(onClick = { answer(false) }, modifier = Modifier.heightIn(min = 48.dp).semantics { contentDescription = "No: ${c.summary}" }) { Text("No") }
                    }
                    else -> Text(when (c.state) { "yes" -> "Doing it…"; "done" -> "Done."; "failed" -> "It didn't work."; else -> "Not done." }, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
        }
        return
    }
    Row(Modifier.fillMaxWidth(), horizontalArrangement = if (l.me) Arrangement.End else Arrangement.Start) {
        Column(Modifier.widthIn(max = 320.dp)
            .background(if (l.me) MaterialTheme.colorScheme.primary else if (l.fromInbox) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.surface, RoundedCornerShape(16.dp))
            .padding(horizontal = 14.dp, vertical = 10.dp)) {
            if (l.photo) Text("📷 photo", color = if (l.me) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 13.sp)
            Text(l.text.replace("**", ""), color = if (l.me) MaterialTheme.colorScheme.onPrimary else MaterialTheme.colorScheme.onSurface)
            if (l.checking.isNotEmpty()) Text(l.checking.distinct().joinToString(" · "), color = MaterialTheme.colorScheme.onSurfaceVariant, fontSize = 12.sp)
            if (l.shown.isNotEmpty()) ShownPhotos(l.shown, thumbs)
        }
    }
}

/** Photos an answer showed: a tap opens the photo in Immich. */
@Composable
fun ShownPhotos(photos: List<Shown>, thumbs: Map<String, ImageBitmap>) {
    val ctx = LocalContext.current
    Row(Modifier.padding(top = 8.dp).horizontalScroll(rememberScrollState()), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        photos.take(8).forEach { p ->
            Box(Modifier.size(88.dp).clip(RoundedCornerShape(10.dp)).background(MaterialTheme.colorScheme.surfaceVariant)
                .clickable(enabled = p.link != null, onClickLabel = "Open in Immich") { p.link?.let { ctx.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(it))) } }
                .semantics { contentDescription = p.label }) {
                thumbs[p.id]?.let { Image(it, contentDescription = null, contentScale = ContentScale.Crop, modifier = Modifier.fillMaxSize()) }
                if (p.kind == "video") Text("Video", fontSize = 11.sp, color = Color.White, modifier = Modifier.align(Alignment.BottomStart).padding(4.dp).background(Color(0x99000000), RoundedCornerShape(8.dp)).padding(horizontal = 6.dp))
            }
        }
    }
}

private fun attach(chat: ChatModel, ctx: android.content.Context, uri: Uri, scope: kotlinx.coroutines.CoroutineScope) {
    chat.status.value = "Getting the photo ready"
    scope.launch {
        val url = withContext(Dispatchers.IO) { try { Photos.dataUrl(ctx, uri) } catch (_: Exception) { null } }
        chat.attached.value = url
        chat.status.value = if (url != null) "Photo attached. Ask about it, or just send." else "That photo couldn't be opened."
    }
}
