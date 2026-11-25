# The desktop app

FAITH on your computer (Windows, macOS, Linux): ask, talk, drop in a photo, say Yes to a held change, and get FAITH's notifications from the tray. It follows [clients.md](clients.md), like the Android app and D.A.S.H.

## What it does

- **Sign in once** with FAITH's address, your FAITH id and password. FAITH gives this computer its own key. The key is encrypted by the computer's keychain (macOS Keychain, Windows' DPAPI, a Linux keyring), and the password isn't kept.
- **Ask**, typed or by voice: click 🎙, talk, then click it again to send. The answer is written as it comes, with what FAITH is checking ("checking the calendar…").
- **Yes / No** for held changes (a lock, the garage), on your own computer, by you.
- **Photos:** drag them onto the window, paste them, or use the photo button. Up to 4, made 1600 px JPEGs first and turned upright.
- **Your photo library:** "show me photos of Robin at the beach" shows them in the answer, from your own Immich account. Click one to open it in Immich.
- **Read aloud:** each answer has *Read aloud*, or turn on *Read answers aloud* in Settings. It uses FAITH's own voice (Argos).
- **Board:** the info board ([dashboard.md](dashboard.md)), beside Ask. Your morning brief (*Write it now*), the weather, FAITH's day cards (the same as the Home Assistant card), your projects and their status, your log, news, and for admins uptime and FAITH's server. Grown-ups approve or decline the household's requests there. With no projects yet, *Bring my projects over from Pondering Orb* copies them and your log from Orb.
- **Inbox and notifications:** a bigger job's answer, the doorbell, approvals to decide. The app keeps a connection to FAITH open from the tray (a long poll) and shows a normal notification. Nothing goes through Google's, Apple's or Microsoft's push services.
- **From anywhere:** Ctrl+Alt+F (⌘⌥F on a Mac) opens FAITH ready to type. Change it in Settings.
- **Closing the window** keeps FAITH in the tray. Quit from the tray menu. *Start when I sign in to this computer* starts it in the tray.
- Light or dark follows the computer's setting.

## Three layouts

Pick one in Settings (the gear, or the tray menu → Layout). Each person picks their own, on each device.

| Layout | For | What's on screen |
|---|---|---|
| **Voice focus** | Just talking: a desk, a bedside, when you don't need a screen | FAITH (tap it, press Space or to talk), what it heard, its answer, and a Yes for a held change. Every answer is read aloud. |
| **Voice panel** | A kitchen or hallway screen, like a smart speaker with a display | A big clock, the weather and a few panels: your brief, next up, dinner, shopping, the house. Tap a panel and FAITH tells you about it. A big Talk button. |
| **Voice dashboard** | Everything | Ask, the Board (projects, log, brief, weather, news) and the Inbox. |

- In both voice layouts FAITH answers in a few plain sentences, made for reading aloud, and can still use everything you can (your calendar, the house, your notes, the board).
- They start on a clean screen. The conversation carries on behind it, so "and tomorrow?" still works.
- A change that needs a Yes (a lock, the garage) always shows Yes and No on the screen, in every layout.
- Voice panel goes back to its panels after half a minute of quiet.

**What goes wrong:**
- Nothing is read aloud: FAITH's voice (Argos's text-to-speech) isn't set up, or the computer's sound is off. The answer still shows.
- A panel is missing: that part isn't set up on FAITH (no meal plan, no shopping list, no weather entity), so there's nothing to show.

## Get it

Build the installers on GitHub: **Actions → desktop → Run workflow**. When it finishes, the run's page has:
- Windows: `FAITH Setup 0.1.0.exe`
- macOS: `FAITH-0.1.0-arm64.dmg` (Apple silicon)
- Linux: `FAITH-0.1.0.AppImage` and `faith-desktop_0.1.0_amd64.deb`

Pushing a tag like `desktop-v0.1.0` runs it too.

The installers aren't signed:
- **Windows** says "Windows protected your PC": More info → Run anyway.
- **macOS** says it can't check the app: right-click it in Applications → Open → Open. Once.
- To sign them, add your own certificates to the workflow ([electron-builder: code signing](https://www.electron.build/code-signing)).

**Or build it yourself** (Node 22):

```bash
cd desktop
npm ci
npm start                                  # run it
npx electron-builder --publish never       # installers for this computer, in desktop/release/
```

## Using it

- FAITH's address is usually `http://<server-ip>:8097` at home. Away from home, use your reverse proxy's `https://` address.
- Each person needs a FAITH password (FAITH's admin page → People → Set).
- Each computer account has its own sign-in, so two people sharing one computer each use their own account. FAITH's rules for children still apply.
- **Sign out of this computer** (Settings) also removes this computer's key on FAITH. A lost laptop: remove its key on FAITH's admin page (*Tokens & screens*) or with `faith token revoke <name>`.

**What goes wrong:**
- The board is missing a part (weather, news, uptime): it isn't set up in `board:` in faith.yaml, or it's not for your role. See [dashboard.md](dashboard.md).
- "FAITH isn't answering": you're not on the home network, the address is wrong, or FAITH is down.
- "This computer isn't signed in to FAITH any more": its key was removed. Sign in again.
- "This computer has no keychain FAITH can use" (Linux): this only happens if no keyring can be found. Normally, without a keyring, the app keeps the key in a file only your account can read, and Settings says so. Install GNOME Keyring or KWallet to have it encrypted.
- No notifications: allow them for FAITH in the computer's settings, and check *Notifications* in FAITH's tray menu.
- The microphone does nothing: allow FAITH to use it in the computer's privacy settings.
- The shortcut doesn't work: another app uses it. Pick another in Settings.

## How it's built

- Electron. The page uses FAITH's own look (`web/src/index.css`, `web/src/ui.tsx`), with the fonts bundled. Nothing is loaded from the internet.
- Only the main process talks to FAITH and holds the key. The page gets a narrow bridge (`src/preload.ts`), no Node, no key, and a strict content security policy. Links open in your browser.
- Tests:
  - `npm test`: the client against a real FAITH with fakes.
  - `xvfb-run -a npm run e2e`: the real app driven by Playwright. Sign in, ask, Yes to a lock, a notification, the board (weather, a project, a log entry), sign out.

## Not built yet

- Signing in with a passkey instead of a password.
- Updating itself. Download the new installer for now.
- Hold-to-talk on the keyboard shortcut.
