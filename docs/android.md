# The Android app

FAITH on your phone: ask, talk, show it a photo, say Yes to a held change, and get FAITH's messages as notifications. It follows [clients.md](clients.md), like D.A.S.H and the desktop app.

## What it does

- **Sign in once** with your FAITH id and password. The phone keeps a key for you (encrypted with the Android Keystore), never the password. *Sign out of this phone* removes the key on FAITH too.
- **Ask**, typed or by voice: hold the 🎙 button, tap again to send. The answer is written as it comes. *Read answers aloud* uses FAITH's own voice (Argos).
- **Yes / No** cards for held changes (a lock, the garage), on your own phone, by you.
- **Photos.** The 📷 button picks one, or **Share → FAITH** from any app (Photos, the browser). It's made a 1600 px JPEG on the phone first.
- **Notifications** from FAITH's inbox: a bigger job's answer, the doorbell, approvals to decide. Checked every 15 minutes in the background (Android's shortest), and live while the app is open. No Google push: nothing goes through the cloud.
- **The phone's assistant.** Settings → Apps → Default apps → **Digital assistant app** → FAITH. Long-press home (or power, on some phones) opens FAITH listening.
- **New topic** starts a fresh conversation.

## Build it

Needs JDK 17+ and the Android SDK (Android Studio, or the command-line tools with `platforms;android-35` and `build-tools;35.0.0`).

```bash
cd android
echo "sdk.dir=$HOME/Android/Sdk" > local.properties
./gradlew assembleDebug testDebugUnitTest
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. Copy it to the phone and open it (allow installing from that app once).

- For a release build, make your own signing key (`keytool -genkey -v -keystore faith.jks -alias faith -keyalg RSA -keysize 4096 -validity 10000`) and sign it with `apksigner`. Keep the key out of git.
- **Check it against your FAITH** without a phone: `FAITH_URL=http://<faith>:8097 FAITH_PERSON=sam FAITH_PASSWORD=… ./gradlew testDebugUnitTest --tests '*LiveContractTest*'`. It signs in, asks, says No to a held lock, and signs out. Add `FAITH_HA_TOKEN` (the HA integration's FAITH token) to test the inbox, `FAITH_AUDIO=talk.m4a` to test speech-to-text, and `FAITH_TTS=1` to test reading aloud.

## On the phone

- FAITH's address is usually `http://<server>:8097` on the home Wi-Fi. The app allows plain http for that. Outside the house, use your reverse proxy's `https://` address.
- Every person needs a FAITH password to sign in (FAITH's admin page → People → Set).
- Children can use it. FAITH's rules for children still apply.

**What goes wrong:**
- "FAITH isn't answering": you're not on the home Wi-Fi, or FAITH is down.
- "This phone isn't signed in to FAITH any more": the key was removed (*Tokens & screens* on the admin page, or `faith token revoke`). Sign in again.
- No notifications: allow them for FAITH in Android's settings, and don't put FAITH in battery "Restricted" mode (it can't check the inbox then).
- The assistant gesture opens Google: pick FAITH as the digital assistant app (above).

## Not built yet

- Photos taken straight from the camera (the 📷 button picks existing photos for now). Sideways phone photos are turned upright before sending.
- A home screen widget with today's plan.
- Signing in with a passkey instead of a password.
