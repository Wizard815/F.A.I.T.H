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
- ha-mcp for the admin (86 Home Assistant tools), with a tool router that offers a local model only the tools a question needs, and SKILL.md skill packs (homeassistant-ai/skills).
- HA's Assist API for the house (assist_api): HA's overview, intents, satellite rooms and exposure, with FAITH's rules checked on the actual targets.
- Who's home, from HA's person entities: in FAITH's answers, on the hub card, and a `home` message target.
- Each person arranges their own day card in HA (order and hidden sections, saved in FAITH).
- `faith init`: finds the services on the network and writes a first config and the list of tokens to make.
- Satellites speak in FAITH's voice (Wyoming text-to-speech through Argos) and know their room (HA areas).
- An integrations watch: every source checked on a schedule; the parents hear once when one goes down and when it's back; `sensor.faith_integrations_down` in HA.
- Mattermost: photos go to the vision model, voice messages through Argos's speech-to-text.
- Routines that run for each person in their own view and go only to them (a morning brief in each personal chat).
- Voice ID on HA's voice satellites: FAITH is the pipeline's speech-to-text (Wyoming), so it knows who said what; checked with HA's own Wyoming integration.
- Points and rewards: 0.5 / 1 / 2 point jobs, rewards, parent approval.
- The kid's card: approved money rewards are recorded in Firefly III as transfers to the child's account, with retry and no double recording; the card balance shows on the points card ([rewards](rewards.md)).
- Voice ID: `voiceid/` service (local, resemblyzer); FAITH keeps voiceprints and names the speaker on a shared screen.
- Photos and videos from the phone (HA card button, Mattermost): videos become frames plus what their sound says; any change from a photo or video waits for the person's Yes.
- The fast path: simple commands go to HA's own sentence matcher with FAITH's rules checked first; no model, under a second.
- Cameras: "who's at the door?" through HA's cameras and the local vision model, for the people each camera lists; `faith.look` for doorbell automations; HA's face recognition (Frigate, Double Take) names who it is.
- Quick, small and big requests: a big job says so and sends its answer when done; a model queue puts quick questions first.
- Mattermost chats start fresh after 4 quiet hours or on "new topic".
- Snap a receipt (`receipt-to-coinpile` skill): cash is recorded in Coinpile, a card payment is matched when the bank sends it; one Yes in FAITH (Coinpile's `act` token).
- Live-tested against the family's real apps (wiki, ALLGlance with Vikunja and Mealie, Coinpile, Orb, Hermes, Hermes Studio, Firefly, HA, Mattermost, voice ID) through Argos: `server/scripts/eval-live.ts`.

## Next

1. **A run on the real Unraid HA VM** with a real satellite and real voices. Synthetic voices are easier to tell apart than family members.
2. **"Hey Faith" everywhere.** A custom openWakeWord model for the satellites (trained once, then loaded into HA's openWakeWord).
3. **Recipe from a photo.** A cookbook page or a handwritten card into Mealie.
