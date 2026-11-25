package family.faith.app

import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/** What the app keeps: FAITH's address, who's signed in, and the client token, encrypted with a
 *  key in the Android Keystore (it never leaves the phone). Never the password. */
class Store(context: Context) {
    private val prefs = context.getSharedPreferences("faith", Context.MODE_PRIVATE)

    var baseUrl: String
        get() = prefs.getString("base_url", "") ?: ""
        set(v) = prefs.edit().putString("base_url", v.trim().trimEnd('/')).apply()
    var personName: String
        get() = prefs.getString("person_name", "") ?: ""
        set(v) = prefs.edit().putString("person_name", v).apply()
    var clientName: String
        get() = prefs.getString("client_name", "") ?: ""
        set(v) = prefs.edit().putString("client_name", v).apply()
    var inboxLast: Long
        get() = prefs.getLong("inbox_last", 0)
        set(v) = prefs.edit().putLong("inbox_last", v).apply()
    var speakReplies: Boolean
        get() = prefs.getBoolean("speak_replies", false)
        set(v) = prefs.edit().putBoolean("speak_replies", v).apply()
    /** How the app looks: voice-focus, voice-panel or voice-dashboard (docs/android.md). */
    var layout: String
        get() = prefs.getString("layout", Layouts.DASHBOARD) ?: Layouts.DASHBOARD
        set(v) = prefs.edit().putString("layout", if (v in Layouts.ALL) v else Layouts.DASHBOARD).apply()
    var conversationId: String?
        get() = prefs.getString("conversation_id", null)
        set(v) = prefs.edit().putString("conversation_id", v).apply()

    var token: String?
        get() = prefs.getString("token", null)?.let { decrypt(it) }
        set(v) = prefs.edit().putString("token", v?.let { encrypt(it) }).apply()

    val signedIn get() = baseUrl.isNotBlank() && token != null

    fun signOut() { prefs.edit().remove("token").remove("conversation_id").remove("person_name").remove("client_name").apply() }

    fun api() = FaithApi(baseUrl, token)

    // ---- the Keystore key that encrypts the token
    private fun key(): SecretKey {
        val ks = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        (ks.getKey(ALIAS, null) as? SecretKey)?.let { return it }
        val gen = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")
        gen.init(KeyGenParameterSpec.Builder(ALIAS, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM).setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE).build())
        return gen.generateKey()
    }
    private fun encrypt(plain: String): String {
        val c = Cipher.getInstance("AES/GCM/NoPadding").apply { init(Cipher.ENCRYPT_MODE, key()) }
        val out = c.iv + c.doFinal(plain.toByteArray())
        return Base64.encodeToString(out, Base64.NO_WRAP)
    }
    private fun decrypt(stored: String): String? = try {
        val b = Base64.decode(stored, Base64.NO_WRAP)
        val c = Cipher.getInstance("AES/GCM/NoPadding").apply { init(Cipher.DECRYPT_MODE, key(), GCMParameterSpec(128, b, 0, 12)) }
        String(c.doFinal(b, 12, b.size - 12))
    } catch (e: Exception) { null }   // the key is gone (a restore to another phone): sign in again

    companion object { private const val ALIAS = "faith-client-token" }
}
