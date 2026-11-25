# FAITH's apps (clients)

FAITH has more than one front door: the Home Assistant cards, Mattermost, voice satellites, and its own apps:
- **D.A.S.H**: the pocket handheld (ESP32).
- **The Android app**: `android/` ([android.md](android.md)).
- **The desktop app**: `desktop/` ([desktop.md](desktop.md)), for Windows, macOS and Linux.

They all follow this page, so a change to FAITH reaches every one of them the same way. Every call below is plain HTTPS to FAITH (`http://<faith>:8097` on your network) with `Authorization: Bearer <token>`.

## 1. Signing in: one person, their own screen

An app signs in as **one person** and counts as **their own screen**:
- it sees their private things, as their phone or laptop would;
- it can answer **Yes** to a held change (a lock, the garage), on that app, by that person.

| Client | How it signs in |
|---|---|
| Android, desktop (has a keyboard) | `POST /api/auth/client` `{ "person": "sam", "password": "…", "name": "Pixel 8" }` → `{ "token": "fapp_…", "name": "sam-pixel-8-x7k2" }`. Once. |
| D.A.S.H (no keyboard) | On the server: `docker exec faith faith token add client wizard dash`. Type the token into D.A.S.H's phone setup. |

- **Keep only the token,** never the password: the Android Keystore, the OS keychain, or the ESP32's NVS.
- **Removing an app:** `GET /api/me/clients` lists a person's apps, and `DELETE /api/me/clients/<name>` removes one. Or on the server: `faith token revoke <name>`. Do this when a phone is lost.
- **Children** can have an app. The usual rules apply: what they can see, and that a child can't say Yes to a lock.
- **Not these tokens:**
  - A plain `person` token is for scripts. It's nobody's screen, so it can't say Yes.
  - An `omi` token opens only Omi's webhook.

`GET /api/me` says who the token is (id, name, role, colour).

## 2. Asking

`POST /api/chat` `{ "text": "…", "conversation_id"?: "…", "images"?: ["data:image/jpeg;base64,…"] }` answers as a stream (Server-Sent Events, `data: {json}` lines):

| Event | Means |
|---|---|
| `{"type":"conversation","id":"…"}` | Keep this id and send it back to continue the same conversation. |
| `{"type":"text","delta":"…"}` | The answer, as it's written. |
| `{"type":"tool","name":"…"}` | FAITH is looking something up (show "checking the calendar…"). |
| `{"type":"confirm","id":"…","summary":"unlock Front door"}` | A change waits for this person's **Yes** (section 4). |
| `{"type":"approval","id":"…","summary":"…"}` | A change was sent to a grown-up to approve. |
| `{"type":"done","text":"…"}` | The whole answer. |
| `{"type":"error","message":"…"}` | Show the message as it is: it's written for people. |

- `GET /api/chat/latest`: the last conversation's messages, to show when the app opens.
- A bigger job ("plan the week's dinners") can take a while. Keep the stream open; its answer also arrives in the inbox (section 5).
- Photos: shrink to 1600 px JPEG first; at most 4.

## 3. Voice

1. Record while the button is held.
2. `POST /api/voice/transcribe` with the recording as the body (`Content-Type: audio/wav`, `audio/webm` or `audio/mp4`) → `{ "text": "…" }`.
3. Ask it with `/api/chat`. Show what was heard.
4. `POST /api/voice/speak` `{ "text": "…" }` → MP3 bytes, to read the answer aloud.

Speech-to-text and the voice are Argos's, on your own server.

## 4. Yes and No

- A `confirm` event: show `summary` word for word, with **Yes** and **No**.
- `POST /api/chat/confirm/<id>` `{ "approve": true }` → `{ "ok": true, "text": "Done: unlock Front door." }`.
- A held change expires after 10 minutes ("That request has expired. Ask again.").
- **Never answer Yes for the person.** No auto-confirm, no "always yes". On D.A.S.H, a tap plus the side button. Locks, alarms and covers say Yes only on a screen the person is holding (FAITH also refuses them from anywhere else).
- **Approvals** (the household's requests, for grown-ups):
  - `GET /api/approvals` → `{ "can_approve": true, "requests": [ … ] }`;
  - `POST /api/approvals/<id>` `{ "approve": true }`.

## 5. The inbox (notifications)

What FAITH sends a person also waits in their inbox, for their apps. Examples:
- a bigger job's answer;
- "Front door: It's Sam";
- a routine's morning brief;
- an approval to decide (grown-ups).

`GET /api/inbox?after=<last id seen>&wait=30` → `{ "items": [ { "id", "at", "kind", "title", "text", "ref" } ], "last": <id> }`
- `kind` is `message` or `approval` (then `ref` is the approval id, for section 4).
- `wait` (up to 30 s) holds the request open until something arrives: a long poll. Call it again with the `last` it gave you.
- Items are kept for 30 days.
- **No cloud push.** FAITH doesn't use Google's or Apple's push services (local only). Each app fetches its own:
  - **Android:** a long poll while open, and every 15 minutes in the background. It then shows a normal notification.
  - **Desktop:** a long poll from the tray.
  - **D.A.S.H:** a long poll while awake.

## 6. Glance and the board

- `GET /api/dashboard` → the same day cards as the Home Assistant card: today, meals, shopping, chores, the house, approvals.
- Each card is `{ id, title, kind, items | entities | approvals | text | empty | error }`.
- `GET /api/session` → name, `pending_approvals`, `can_approve`.

**The board** ([dashboard.md](dashboard.md)): Pondering Orb's Main and Daily pages, for the signed-in person.

`GET /api/board` →
```json
{ "person": { "id": "sam", "name": "Sam" }, "day": "2026-11-25",
  "brief": { "day": "2026-11-25", "text": "Good morning…", "by": "morning", "at": 1764050000000 },
  "weather": { "place": "Home", "condition": "rainy", "unit": "°F", "temperature": 44, "feels_like": 40, "humidity": 80, "wind": 8, "wind_unit": "mph",
               "days": [ { "date": "2026-11-26", "condition": "cloudy", "high": 47, "low": 35, "rain": 20 } ] },
  "news": { "items": [ { "title": "…", "link": "https://…", "source": "…", "published": 0, "summary": "…" } ], "errors": [] },
  "projects": [ { "id": "…", "name": "Garden shed", "status": "active", "next": "Order the timber", "fav": false, "archived": false, "last": "Cleared it", "last_day": "2026-11-24" } ],
  "log": [ { "id": 1, "project": "Garden shed", "text": "Cleared it", "by": "you", "day": "2026-11-24", "at": 0 } ],
  "uptime": { "up": 12, "down": 1, "monitors": [ { "name": "Printer", "group": "Home", "status": "down", "uptime24": 50, "ping": null, "ignored": false } ] },
  "system": { "name": "…", "cores": 8, "load": 12, "memory": 41, "memory_gib": 32, "disks": [ { "mount": "/data", "pct": 63 } ], "uptime_days": 9, "sources": [ { "label": "wiki", "ok": true } ] },
  "cards": [ …the day cards… ] }
```
- A part is `null` when it isn't set up, or isn't for this viewer. Then don't show it.
- A part that's set up but didn't load is `{ "error": "…" }`. Show the error as it is.
- `person`, `brief`, `projects` and `log` are `null` for the household (a shared screen, HA's token).

Changes (a signed-in person's own; each goes through FAITH's rules and the action log):

| Call | Does |
|---|---|
| `POST /api/board/brief` | Writes today's brief now → `{ day, text, by, at }`. It takes as long as the model needs (allow 5 minutes). |
| `POST /api/board/log` `{ "text", "project"? }` | Logs what you got done. No project: General. Too long is refused (`board.log_max`). |
| `POST /api/board/projects` `{ "name", "status"?, "next"? }` | Adds a project. |
| `PATCH /api/board/projects/<name>` `{ "status"?, "next"?, "name"?, "starred"?, "archived"? }` | Changes one. `POST` works too, for apps that can't send `PATCH`. |
| `POST /api/board/import` `{ "from": "orb" }` or `{ "projects", "logs" }` | Brings projects and the log over from Pondering Orb → `{ projects, logs, skipped }`. |

Errors come back as `{ "error": "…" }` with 400 (a wrong value), 403 (not for your role, e.g. a child) or 409 (the brief is already being written).

## 7. Rules for every app

- **Local first.** Talk to FAITH on your own network; use https beyond it. No analytics, no cloud services.
- **Plain words.** Show FAITH's messages and errors as they are. If FAITH can't be reached, say "FAITH isn't answering. Check that its container is running (or that you're on the home Wi-Fi)."
- **Accessible.**
  - Every control has a name (a screen reader says it).
  - Touch targets are 44 px or more.
  - State is shown with words, not colour alone.
  - New answers are announced.
- **What it can see is FAITH's decision.** An app never asks another service directly for a person's data. It asks FAITH, which uses that person's own tokens.

## Which client does what

| | D.A.S.H | Android | Desktop |
|---|---|---|---|
| Sign in | client token (CLI) | password → client token | password → client token |
| Ask, Yes/No, inbox | ✓ | ✓ | ✓ |
| Voice | push-to-talk (Hermes first, FAITH as the fallback) | push-to-talk; can be the phone's **assistant** (hold home / power) | click to talk; a shortcut from anywhere (Ctrl+Alt+F) |
| Photos | — | camera, and **Share → FAITH** from any app | drag and drop, paste |
| Notifications | buzz + card | Android notifications | tray and the computer's notifications |
| Board | — | Board tab | Board tab (and bringing projects over from Orb) |
