package family.faith.app

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.MediaPlayer
import android.media.MediaRecorder
import android.net.Uri
import android.os.Build
import android.util.Base64
import java.io.ByteArrayOutputStream
import java.io.File

/** Push-to-talk: records AAC in an MP4 file (audio/mp4), which FAITH's speech-to-text reads. */
class Recorder(private val context: Context) {
    private var rec: MediaRecorder? = null
    private val file get() = File(context.cacheDir, "faith-talk.m4a")

    fun start() {
        stopQuietly()
        val r = if (Build.VERSION.SDK_INT >= 31) MediaRecorder(context) else @Suppress("DEPRECATION") MediaRecorder()
        r.setAudioSource(MediaRecorder.AudioSource.VOICE_RECOGNITION)
        r.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
        r.setAudioEncoder(MediaRecorder.AudioEncoder.AAC)
        r.setAudioSamplingRate(16_000)
        r.setAudioEncodingBitRate(48_000)
        r.setOutputFile(file.absolutePath)
        r.prepare(); r.start()
        rec = r
    }

    /** The recording, or null if it was too short to hold anything. */
    fun stop(): ByteArray? {
        val r = rec ?: return null
        rec = null
        return try { r.stop(); r.release(); file.readBytes().takeIf { it.size > 2_000 } } catch (e: RuntimeException) { r.release(); null }
    }

    private fun stopQuietly() { try { rec?.stop() } catch (_: RuntimeException) {}; rec?.release(); rec = null }
}

/** Plays FAITH's spoken answer (MP3 bytes from /api/voice/speak). */
class Speaker(private val context: Context) {
    private var player: MediaPlayer? = null
    fun play(mp3: ByteArray) {
        stop()
        val f = File(context.cacheDir, "faith-say.mp3").apply { writeBytes(mp3) }
        player = MediaPlayer().apply { setDataSource(f.absolutePath); setOnCompletionListener { it.release(); player = null }; prepare(); start() }
    }
    fun stop() { player?.release(); player = null }
}

object Photos {
    const val MAX_PX = 1600

    /** A shared or taken photo as FAITH wants it: a JPEG at most 1600 px on its long side, as a data URL. */
    fun dataUrl(context: Context, uri: Uri): String? {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        context.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, bounds) } ?: return null
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) return null
        var sample = 1
        while (maxOf(bounds.outWidth, bounds.outHeight) / (sample * 2) >= MAX_PX) sample *= 2
        val bmp = context.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, BitmapFactory.Options().apply { inSampleSize = sample }) } ?: return null
        val scale = minOf(1f, MAX_PX.toFloat() / maxOf(bmp.width, bmp.height))
        val sized = if (scale < 1f) Bitmap.createScaledBitmap(bmp, (bmp.width * scale).toInt(), (bmp.height * scale).toInt(), true) else bmp
        val out = ByteArrayOutputStream()
        sized.compress(Bitmap.CompressFormat.JPEG, 85, out)
        return "data:image/jpeg;base64," + Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP)
    }
}
