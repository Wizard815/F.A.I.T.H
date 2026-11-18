# FAITH and Home Assistant

## Container, not an add-on

FAITH runs as its own container on Unraid, next to Argos and the other apps on `ai_net`. A small integration inside HA connects the two.

Why not install it inside the HA VM:
- **Restarts.** HA restarts often (updates, YAML reloads). The family's assistant, its sign-in sessions and its chats shouldn't go down with it.
- **Reach.** FAITH needs the apps on `ai_net` (wiki, ALLGlance, Coinpile, Orb, Hermes, Argos). From the HA VM that's an extra network hop and more firewall rules.
- **Separation.** FAITH holds the family's sign-in secrets and is the one place that decides who sees what. HA's admin users shouldn't be able to read its database.

HA is still where the family meets FAITH: the kiosk, the voice and the automations. If you'd rather run it as an HA add-on later, the same image works; OpenFamily ships one this way.

## What the integration does (`ha/custom_components/faith`)

- **Sidebar page.** FAITH appears in HA's sidebar ("FAITH", a heart-house icon) for everyone. A wall tablet running the HA app or Fully Kiosk with that page is the family's command point, with the HA dashboards one tap away.
- **Assist agent.** Pick FAITH as the conversation agent of an Assist pipeline (Settings → Voice assistants).
  - Voice satellites, the HA app's Assist button and automations then talk to FAITH.
  - Each request carries the HA user. When it matches a person's `ha_user_id` (and `trust_ha_users` is on), FAITH answers in that person's view. Satellites and unknown users get the household view, where changes need approval.
- **Sensors:**

  | Sensor | Value | Attributes |
  |---|---|---|
  | `sensor.faith_today` | count | the items |
  | `sensor.faith_shopping_list` | count | the items |
  | `sensor.faith_next_meal` | the next meal | |
  | `sensor.faith_chores` | count | |
  | `sensor.faith_<screen>_screen` | who's signed in there, or "Household" | |

  The summary also counts changes waiting for approval (`pending_approvals`).

## Install

1. Copy `ha/custom_components/faith` to `/config/custom_components/faith` on the HA VM (Samba or SSH add-on), then restart HA.
2. On Unraid, make a token: `docker exec faith faith token add ha homeassistant`.
3. HA → Settings → Devices & services → Add → **FAITH**:
   - **FAITH URL:** how HA reaches it, e.g. `http://192.168.1.5:8097`.
   - **Token:** the one from step 2.
   - **Address for the sidebar page:** how the family's browsers reach it, e.g. `https://faith.home.lan`. Leave it empty to use the same URL.
4. Voice: Settings → Voice assistants → your pipeline → Conversation agent → **FAITH**.
5. People: Settings → People → each person → their HA user's id goes in `ha_user_id` in `faith.yaml`.

## The sidebar page and sign-in

The sidebar page is FAITH inside a frame. Browsers only send FAITH's sign-in cookie inside the frame when FAITH and HA count as the *same site*. Two setups work:

- **One domain behind your reverse proxy (recommended):** `ha.home.lan` and `faith.home.lan` are the same site, so keep `embed.cookie_samesite: strict`.
  - Add HA's address to `embed.allow_from` (FAITH refuses to be framed by anything else).
  - Face ID needs this setup anyway, because passkeys need https.
- **Different hosts or IPs:** set `embed.cookie_samesite: none`. This requires https (`public_url` starting with `https://`); without https, signing in inside the frame won't stick.

## Presence and faces (for auto sign-out)

Point each screen's `presence_entity` at a sensor that says someone is in front of it: Frigate's person occupancy for that camera zone, an mmWave sensor, and so on.
- FAITH signs a person out once nobody's been there, and nobody has touched the screen, for `away_seconds`.
- A hard limit (`max_idle_seconds`) applies even if someone stays in the room.

`face_entity` is optional: a sensor whose state is the recognised person's name (Frigate face recognition, Double Take).
- It highlights that person's tile.
- With `face_unlock: true` it signs them in on its own. Leave that off for screens children use: a face match is a weaker check than a PIN.

## Voice: a JARVIS for the house

The fully local path, through HA:

```
satellite (wake word) -> HA Assist pipeline -> speech-to-text -> FAITH (conversation agent) -> text-to-speech -> satellite
```

- **Speech-to-text and text-to-speech:** use the Wyoming faster-whisper and Piper containers (HA's standard local voice), or a Wyoming bridge to Argos's `/v1/audio/*` so one GPU serves everything.
  - omi-local's `omi-audio` already runs faster-whisper and Piper.
  - hermes-agent's plugin catalog has a `wyoming-voice-bridge`.
- **Wake word:** openWakeWord in HA, with a custom "Hey Faith" model.
- **On FAITH's own screen:** 🎤 records in the browser and Argos transcribes it; the reply is spoken back through Argos.

**Knowing who's speaking.** HA hands conversation agents the *text*, not the audio, so FAITH can't recognise a voice that came through a satellite. Today:
- **The HA app:** the request carries the signed-in HA user, so FAITH knows the person.
- **Satellites:** household view; changes are sent for approval.
- **FAITH's screen:** the person signed in.

Recognising each family member's voice is on the [roadmap](roadmap.md). When it comes, it will suggest who's talking, like the face sensor does, not unlock private things by itself.

## Mealie

FAITH reads and changes Mealie through HA's Mealie integration (shopping lists as to-do entities, the meal plan as calendars, plus Mealie's actions). That's two-way, unlike Mealie's own CalDAV. Setup is in [setup.md](setup.md#home-assistant-and-mealie-through-it).

## The family dashboard (FAITH's cards)

The family uses Home Assistant; FAITH's own page is the admin console. The integration serves four cards, loaded automatically:

```yaml
- type: custom:faith-who-card      # shared tablet: who's signed in, "Who's here?" PIN pad, sign out
  screen: kitchen
- type: custom:faith-card          # the day, meals, shopping, chores, the house, approvals
  screen: kitchen                  # optional: cards: [today, meals, shopping]
- type: custom:faith-chat-card     # talk or type to FAITH
  screen: kitchen
- type: custom:faith-rewards-card  # points, jobs to claim, rewards; parents give points
  screen: kitchen
```

- **Each card asks FAITH as the HA user who's looking.** Map each person's HA user with `ha_user_id` in `faith.yaml`. A mapped user sees their own view.
- **A tablet signed into HA as an unmapped "Family" user** sees the household view. Someone taps *Sign in* on the who card and enters their PIN. All FAITH cards on that tablet then show their view until they leave or sign out.
- **Private things never go into HA sensors.** The cards fetch them live, for the person looking only.
- **Phones:** give each person `ha_notify: [notify.mobile_app_<phone>]`. Approval requests arrive with Approve / Deny buttons. A tap decides as that person.
- **Actions for automations:** `faith.send_message` (`to`: family, parents or a person) posts to Mattermost and/or their phone. `faith.award_points` gives points; from an automation, it waits for a parent's approval.
- **Not yet checked in a live Home Assistant.** The cards build and the integration's tests pass against HA 2026.2. A run on a real dashboard (Docker HA) is next.
