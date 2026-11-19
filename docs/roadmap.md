# Roadmap

## Built

- One container: home screen, wall view, chat, apps launcher, approvals; light and dark.
- Sign-in: PIN on paired screens, password, Face ID (passkeys), camera face suggestion or unlock; auto sign-out from idle and presence.
- Household and person views on the backends' own tokens: wiki, ALLGlance (household and person tokens), Home Assistant, Coinpile, Orb, Hermes, Hermes Studio.
- Roles: admin, adult, child, household. The household view's changes wait for approval, an admin can overrule a denial, and locks / alarm / garage wait for a Yes.
- Mealie through Home Assistant: shopping lists, meal plan, recipes.
- Argos as the engine: chat, vision (photos), speech-to-text, text-to-speech.
- Home Assistant integration: Assist agent with the HA user, sidebar page, sensors.
- FAITH as an OpenAI-compatible model for other apps.
- Mattermost: a personal DM for each person, a family channel and a parents' channel that FAITH makes and keeps tidy; approvals in the parents' chat (tested against a real Mattermost).

- Skills (Markdown recipes FAITH loads when one fits; built-in ones plus your own) and routines (a skill on a schedule, sent to a chat or a phone).
- Notifications: HA phone pushes with Approve / Deny buttons; `faith.send_message` from HA automations.
- The family dashboard in Home Assistant: five FAITH cards, each person's own view; FAITH's page is the admin console.
- The look: brass & honey (brown and gold), the d20-and-bees emblem that shows listening / thinking / speaking, hexagon faces, an HA theme.
- The hub card: the wall tablet's home. Tap FAITH to talk; answers are read aloud through Argos.
- Checked in a real Home Assistant 2026.2.3: config flow, sensors, theme, every card, hub sign-in and the admin sidebar page.
- Voice ID on HA's voice satellites: FAITH is the pipeline's speech-to-text (Wyoming), so it knows who said what; checked with HA's own Wyoming integration.
- Points and rewards: 0.5 / 1 / 2 point jobs, rewards, parent approval; money rewards recorded as owed (Firefly card payout is a placeholder in `server/src/rewards.ts`).
- Voice ID: `voiceid/` service (local, resemblyzer); FAITH keeps voiceprints and names the speaker on a shared screen.

## Next

0. **A run on the real Unraid HA VM** with a real satellite and real voices.

1. **Mattermost extras:** photos sent in a chat go to the vision model; voice messages through Argos's speech-to-text; a morning brief in each personal DM.
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
