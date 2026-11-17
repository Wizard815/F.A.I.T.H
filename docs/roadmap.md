# Roadmap

## Built

- One container: home screen, wall view, chat, apps launcher, approvals; light and dark.
- Sign-in: PIN on paired screens, password, Face ID (passkeys), camera face suggestion or unlock; auto sign-out from idle and presence.
- Household and person views on the backends' own tokens: wiki, ALLGlance (scoped tokens on ALLGlance branch `claude/nice-darwin-wx3t3u`), Home Assistant, Coinpile, Orb, Hermes, Hermes Studio.
- Roles: admin, adult, child, household. The household view's changes wait for approval, an admin can overrule a denial, and locks / alarm / garage wait for a Yes.
- Mealie through Home Assistant: shopping lists, meal plan, recipes.
- Argos as the engine: chat, vision (photos), speech-to-text, text-to-speech.
- Home Assistant integration: Assist agent with the HA user, sidebar page, sensors.
- FAITH as an OpenAI-compatible model for other apps.

## Next

1. **Mattermost.**
   - A FAITH bot account. Family members DM it, and their Mattermost user maps to their person, so it gets their view.
   - Approvals are posted to a family channel with Approve / Deny buttons.
   - Uses Mattermost's bot WebSocket (DMs aren't possible with outgoing webhooks).
2. **Knowing who's speaking.** HA hands conversation agents text, not audio, so this goes in front of speech-to-text:
   - A small speaker-ID service (ECAPA-style voice embeddings, local) that each person enrols by reading a few sentences while signed in.
   - FAITH's own mic sends audio, so it can be identified there first.
   - For satellites it needs a Wyoming wrapper that passes the speaker on.
   - Either way it only *suggests* a person, like the camera. A voice is easy to imitate, and children sound alike.
   - Omi already recognises its wearers. Its conversations reach the wiki per person.
3. **"Hey Faith" everywhere.** Satellites in each room with a custom openWakeWord model, and FAITH's voice from Argos's TTS. Each satellite's room is passed in so "turn the lights off" means *this* room.
4. **Notifications.**
   - HA mobile-app notifications when something waits for approval: an automation on `sensor.faith_*`, or a direct `notify` call from FAITH.
   - A morning brief per person.
5. **ALLGlance: a Mealie adapter**, so `allglance_get_day` includes tonight's dinner for agents that only use ALLGlance.
6. **Kids:** chores with points and rewards (OpenFamily's idea), on top of lastGLANCE chores.
7. **Per-person dashboards:** cards each person arranges, saved in FAITH.
8. **Routines** (family-agent): "every school morning at 7, read out the day".
