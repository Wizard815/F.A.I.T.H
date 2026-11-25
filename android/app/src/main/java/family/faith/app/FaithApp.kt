package family.faith.app

import android.Manifest
import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.concurrent.TimeUnit

class FaithApp : Application() {
    override fun onCreate() {
        super.onCreate()
        val ch = NotificationChannel(CHANNEL, getString(R.string.channel_inbox), NotificationManager.IMPORTANCE_DEFAULT)
        ch.description = getString(R.string.channel_inbox_about)
        getSystemService(NotificationManager::class.java).createNotificationChannel(ch)
        scheduleInbox(this)
    }

    companion object {
        const val CHANNEL = "inbox"

        /** Every 15 minutes (Android's shortest), on any network: FAITH's inbox. No cloud push. */
        fun scheduleInbox(context: Context) {
            val req = PeriodicWorkRequestBuilder<InboxWorker>(15, TimeUnit.MINUTES)
                .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build()).build()
            WorkManager.getInstance(context).enqueueUniquePeriodicWork("faith-inbox", ExistingPeriodicWorkPolicy.KEEP, req)
        }

        /** One of FAITH's messages as a notification; tapping it opens the app. */
        fun notify(context: Context, item: InboxItem) {
            if (Build.VERSION.SDK_INT >= 33 && context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return
            val open = PendingIntent.getActivity(context, 0, Intent(context, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK),
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
            val n = NotificationCompat.Builder(context, CHANNEL)
                .setSmallIcon(R.drawable.ic_stat_faith)
                .setContentTitle(item.title)
                .setContentText(item.text.lineSequence().first())
                .setStyle(NotificationCompat.BigTextStyle().bigText(item.text))
                .setContentIntent(open).setAutoCancel(true).build()
            try { NotificationManagerCompat.from(context).notify(item.id.toInt(), n) } catch (e: SecurityException) { /* notifications turned off */ }
        }
    }
}

/** In the background: fetch FAITH's inbox and show what's new as notifications. */
class InboxWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result = withContext(Dispatchers.IO) {
        val store = Store(applicationContext)
        if (!store.signedIn) return@withContext Result.success()
        try {
            val (items, last) = store.api().inbox(store.inboxLast, 0)
            items.forEach { FaithApp.notify(applicationContext, it) }
            store.inboxLast = last
            Result.success()
        } catch (e: FaithError) { Result.retry() }
    }
}
