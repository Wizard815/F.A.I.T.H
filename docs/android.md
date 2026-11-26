# The Android app

FAITH on your phone: ask, talk, show it a photo, say Yes to a held change, and get FAITH's messages as notifications. It follows [clients.md](clients.md), like D.A.S.H and the desktop app.

## What it does

- **Sign in once** with your FAITH id and password. The phone keeps a key for you (encrypted with the Android Keystore), never the password. *Sign out of this phone* removes the key on FAITH too.
- **Ask**, typed or by voice: hold the 🎙 button, tap again to send. The answer is written as it comes. *Read answers aloud* uses FAITH's own voice (Argos).
- **Yes / No** cards for held changes (a lock, the garage), on your own phone, by you.
- **Photos.** The 📷 button picks one, or **Share → FAITH** from any app (Photos, the browser). It's made a 1600 px JPEG on the phone first.
- **Notifications** from FAITH's inbox: a bigger job's answer, the doorbell, approvals to decide. Checked every 15 minutes in the background (Android's shortest), and live while the app is open. No Google push: nothing goes through the cloud.
- **The phone's assistant.** Settings → Apps → Default apps → **Digital assistant app** → FAITH. Long-press home (or power, on some phones) opens FAITH listening.
- **Photos from your library:** "show me photos of Robin at the beach" shows them in the answer, from your own Immich account. Tap one to open it in Immich.
- **New topic** starts a fresh conversation.
- **Projects**, the third tab: your family projects ([projects.md](projects.md)). Your own, Family and (for grown-ups) Parents, each with its background threads and whether they're working, done or waiting. Tap one to read it, send it more to do, or put it away. *Start a thread* picks the project. Words going to Family or Parents show a Yes card first, because everyone there reads them.
- **Board**, the second tab: the info board ([dashboard.md](dashboard.md)). Your morning brief (*Write it now*), the weather, FAITH's day cards, your projects (tap the status to move one), your log (*Log it*), news, and for admins uptime and FAITH's server. Bringing projects over from Pondering Orb is on the desktop app.

## Three layouts

Pick one in Settings (the ⋮ menu → Voice focus / Voice panel / Voice dashboard). Each person picks their own, on each device.

| Layout | For | What's on screen |
|---|---|---|
| **Voice focus** | Just talking: a desk, a bedside, when you don't need a screen | FAITH (tap it, to talk), what it heard, its answer, and a Yes for a held change. Every answer is read aloud. A small *Projects: 1 needs you* button shows when a thread wants you. |
| **Voice panel** | A kitchen or hallway screen, like a smart speaker with a display | A big clock, the weather and a few panels: your brief, next up, dinner, shopping, the house, projects. Tap a panel and FAITH tells you about it (Projects opens the list). A big Talk button. |
| **Voice dashboard** | Everything | Ask, the Board (projects, log, brief, weather, news), Projects (the family threads) and the Inbox. |

- In both voice layouts FAITH answers in a few plain sentences, made for reading aloud, and can still use everything you can (your calendar, the house, your notes, the board).
- They start on a clean screen. The conversation carries on behind it, so "and tomorrow?" still works.
- A change that needs a Yes (a lock, the garage) always shows Yes and No on the screen, in every layout.
- Voice panel goes back to its panels after half a minute of quiet.
- Both show FAITH's emblem, as on the web screens: the d20 with its hive of bees. It turns slowly when idle, draws in and glows with your voice while it listens, spins up while it thinks, and pulses while it speaks. With Android's animations off (Accessibility → Remove animations) it stays still.

**What goes wrong:**
- Nothing is read aloud: FAITH's voice (Argos's text-to-speech) isn't set up, or the computer's sound is off. The answer still shows.
- A panel is missing: that part isn't set up on FAITH (no meal plan, no shopping list, no weather entity), so there's nothing to show.

## Get the APK

GitHub builds it for you. In the repository, open **Actions → android**, pick the newest green run, and download **faith-android-apk** at the bottom (a zip with `faith-<version>-<commit>.apk`). Open it on the phone and allow installing from that app once.

- It runs on every push that changes `android/`, or from **Run workflow** on that page.
- A tag like `android-v0.2.0` also makes a GitHub release with the APK attached, easier to find from a phone: **Releases** on the repository's front page.
- **Installing over an older APK** needs the same signing key. Each run signs with a new debug key unless you give it one: make it once (`keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -validity 10000 -dname "CN=Android Debug"`), then add `base64 -w0 debug.keystore` as the repository secret `ANDROID_DEBUG_KEYSTORE`. Without it, uninstall the old app first (you sign in again).
- The run also checks the screen snapshots. If a screen changed on purpose, run `./gradlew recordPaparazziDebug` and commit the images; the run's **paparazzi-diffs** shows what changed.

## Build it

Needs JDK 17+ and the Android SDK (Android Studio, or the command-line tools with `platforms;android-35` and `build-tools;35.0.0`).

```bash
cd android
echo "sdk.dir=$HOME/Android/Sdk" > local.properties
./gradlew assembleDebug testDebugUnitTest
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. Copy it to the phone and open it (allow installing from that app once).

- For a release build, make your own signing key (`keytool -genkey -v -keystore faith.jks -alias faith -keyalg RSA -keysize 4096 -validity 10000`) and sign it with `apksigner`. Keep the key out of git.
- **See the screens without a phone:** `./gradlew recordPaparazziDebug` draws the emblem, Voice focus (light and dark, and with a project waiting), Voice panel, and the Projects list and a thread into `app/src/test/snapshots/images/`.
- **Check it against your FAITH** without a phone: `FAITH_URL=http://<faith>:8097 FAITH_PERSON=sam FAITH_PASSWORD=… ./gradlew testDebugUnitTest --tests '*LiveContractTest*'`. It signs in, asks, says No to a held lock, and signs out. Add `FAITH_HA_TOKEN` (the HA integration's FAITH token) to test the inbox, `FAITH_AUDIO=talk.m4a` to test speech-to-text, and `FAITH_TTS=1` to test reading aloud.

## On the phone

- FAITH's address is usually `http://<server>:8097` on the home Wi-Fi. The app allows plain http for that. Outside the house, use your reverse proxy's `https://` address.
- Every person needs a FAITH password to sign in (FAITH's admin page → People → Set).
- Children can use it. FAITH's rules for children still apply.

**What goes wrong:**
- "FAITH isn't answering": you're not on the home Wi-Fi, or FAITH is down.
- The board is missing a part (weather, news, uptime): it isn't set up in `board:` in faith.yaml, or it's not for your role.
- "This phone isn't signed in to FAITH any more": the key was removed (*Tokens & screens* on the admin page, or `faith token revoke`). Sign in again.
- No notifications: allow them for FAITH in Android's settings, and don't put FAITH in battery "Restricted" mode (it can't check the inbox then).
- The assistant gesture opens Google: pick FAITH as the digital assistant app (above).

## Not built yet

- Photos taken straight from the camera (the 📷 button picks existing photos for now). Sideways phone photos are turned upright before sending.
- A home screen widget with today's plan.
- Approving the household's requests from the board (the desktop app has it).
- Signing in with a passkey instead of a password.
