# Connecting FAITH to everything

Every source gets up to two tokens:
- **Household** (the blanket family token): FAITH uses it when nobody is signed in. It can only see shared things.
- **Person** (one per family member): used once they sign in. It also sees their own private things.

The names of the variables go in `faith.yaml` (`household_token_env`, `person_token_env: X_{ID}`). The values go in `.env`. Leave a value empty and that source isn't offered in that view.

Run `docker exec faith faith doctor` after each step. For each view it lists the sources, the tools (`*` = changes things) and what failed.

## Argos (the engine)

- Point `model.base_url` at Argos's `/v1`.
- Pick `model.model`, a model with good tool calling. A Qwen3 instruct model works well, and an alias in Argos keeps the config stable when you swap models.
- If Argos has API keys (Settings → Security), put one in `ARGOS_API_KEY`.
- **Photos:** set `model.vision_model` to a vision model id (Qwen3-VL). Turns with a photo use it.
- **Voice:**
  - Set `voice.stt_model` to the speech-to-text model Argos serves on `/v1/audio/transcriptions` (a whisper.cpp model).
  - Set `voice.tts_model` and `voice.tts_voice` for `/v1/audio/speech`.
  - The screen's 🎤 button records, Argos transcribes, and the reply is spoken when 🔊 is on, or always when you spoke.
- Argos serves models on demand: the first question after a while can take as long as a model load.

## Family wiki (LLM-will-remember-this)

The wiki already has exactly this model (`schema/agents.md` → Family). On the vault host:

```bash
node scripts/family-setup.mjs add-shared faith FAITH   # FAITH as the family's shared agent
node scripts/family-setup.mjs token faith              # -> WIKI_TOKEN_HOUSEHOLD
node scripts/family-setup.mjs token sam                # -> WIKI_TOKEN_SAM (one per member)
node scripts/family-setup.mjs token wizard --label faith --as member   # -> WIKI_TOKEN_WIZARD (the admin: see below)
node scripts/family-setup.mjs add-member --name Robin --role child     # children: no household/parents/
```

- **The grown-ups' chat:** `node scripts/family-setup.mjs add-shared faith-parents "FAITH parents" --audience parents`, then `token faith-parents` → `WIKI_TOKEN_PARENTS` (`parents_token_env`). It also reads `household/parents/`, the grown-ups' shared notes; the family view and children never do.
- **Children:** add them with `--role child` in the wiki too. FAITH refuses a child's wiki token that isn't a child's.
- **The master key** (`token master`) reads everyone's notes and writes nothing. It's for your own tools (backups, a dashboard). FAITH never uses it.
- **FAITH checks every token** with the wiki's `whoami` before using it, and refuses one that's wrong for the view. That view then gets no wiki at all, and the admin page's integrations watch says why:
  - a person's token must be their own member (or child) token: not an admin token, not someone else's, not the master key;
  - the household token must be the family's shared agent, and the parents' token a shared agent too.
- **The admin's token goes "as member".** A plain admin token reads everyone's notes, so a search in the admin's chat, or on a screen they signed into, could turn up Sam's surprise for them. `--as member` (wiki branch with that option) sees only their own notes, like everyone else. Keep the full admin token for the wiki's own maintenance.

- Connector URL: `http://<vault>:27123/family-mcp`.
- The shared-agent token reads `household/` and each profile's "Shared with the family" section, never private notes. A member's token reads their own root as well.
- **Check first:** the wiki's own note says `/family-mcp` still needs checking on RaidLab after the bridge is deployed. `faith doctor` calls `wiki_whoami` with each token.
- **How FAITH uses it as memory:**
  - **Whoever is talking gets their context** at the start of a chat, again every 15 minutes, and when the day changes. In a group chat or by voice that's the speaker, through the shared token: only what they share with the family.
  - **"Remember that…"** goes to `memory_log`, under "Decisions / facts worth keeping", in the notes of **whoever said it**. FAITH sets that in code (`teller_tools`), not only in the prompt. If Sam says "remember Wizard's present is a watch" in the family chat, it lands in Sam's notes, not Wizard's. Only `household` is kept as the model gave it.
  - **Recall.** The context is only today's note, so FAITH searches the person's notes before answering about something they told it before. `always: [memory_log, notes_search]` keeps those offered for every question.
  - **Finished chats are filed.** When a personal chat is put away ("new topic", or 4 quiet hours), it goes to that person's `raw/sources/` as a source for the wiki's Ingest (`memory.file_conversations`). Group chats and shared screens aren't filed.
  - The morning brief mentions the person's follow-ups; the evening wrap-up asks what's worth remembering.
- The wiki's rule is that personal roots are read only by local models. Argos is local, so FAITH follows it; don't point `model.base_url` at a cloud API.

## ALLGlance

Needs ALLGlance's scoped tokens (on ALLGlance's `main` since commit `de238ec`).

```bash
docker exec allglance node scripts/tokens.mjs add-household faith                  # -> ALLGLANCE_TOKEN_HOUSEHOLD
docker exec allglance node scripts/tokens.mjs add-person wizard faith-wizard       # -> ALLGLANCE_TOKEN_WIZARD
```

- **`GATEWAY_TOKEN` must be set on ALLGlance.** Without it the gateway is open, and anyone could skip the scoped tokens.
- **What is private:**
  - Vikunja: a task with the label `private`, or one in a project listed in `VIKUNJA_PRIVATE_PROJECTS`.
  - dayGLANCE: a block with `#private` in its title.
  - lastGLANCE chores and lifeGLANCE milestones have no private marker, so everyone sees them.
- **Omi:**
  - Omi's tools go only to the person named in `OMI_OWNER_ID`.
  - Vikunja's native passthrough tools are admin-only, so FAITH doesn't get them.
- **Ids:**
  - `allglance_owner_id` in `faith.yaml` is the person's id in `allglance_list_users`.
  - When Vikunja and dayGLANCE use different ids for one person, give `add-person` the extra ones with `--also`.
- Check with `curl -H "Authorization: Bearer $TOKEN" http://<host>:8090/api/allglance/whoami`.

## Home Assistant (and Mealie through it)

1. **Make FAITH an HA user.** In HA: Settings → People → add a user `FAITH`, not an admin. As that user: Profile → Security → Long-lived token → `HA_TOKEN`.
   - FAITH can still only touch what `expose` lists, and roles narrow it further (children: lights, media, fans).
   - Optional: give each person their own HA token (`person_token_env: HA_TOKEN_{ID}`) so HA's logbook shows who did what.
2. **Mealie.** Add HA's Mealie integration (Mealie URL and an API token from your Mealie profile).
   - Each Mealie shopping list becomes a `todo.*` entity: list them in `shopping_lists`.
   - The meal plan becomes `calendar.mealie_*` entities: list them in `meal_calendars`. FAITH can then read and change both, and changes reach Mealie.
   - For `meal_plan` and `recipes_search`, set `mealie_config_entry_id`: Settings → Devices & services → Mealie → ⋮ → Copy entry ID.
   - **Adding recipes** (from a photo of a cookbook page or a card, or a link) needs Mealie itself, because HA can't add one. Add a `mealie` connector (below).
3. **The other direction (HA → FAITH)** is the integration: see [home-assistant.md](home-assistant.md).

## Mealie (adding recipes)

HA's Mealie integration reads recipes and changes the meal plan and lists. Adding a recipe needs Mealie's own API:

```yaml
connectors:
  - id: mealie
    type: mealie
    url: http://<server-ip>:9000
    token_env: MEALIE_TOKEN   # Mealie: your profile → API Tokens
```

- Then show FAITH a cookbook page or a recipe card ("put this in Mealie"), or send a recipe link. FAITH reads it, shows what it will add, and adds it after your Yes.
- Grown-ups, the parents chat and the shared screens get it. Add `roles: [admin, adult, child, parents, household]` to let children add recipes too.
- Needs Mealie 1.10 or newer.

**What goes wrong:**
- "Mealie refused the token": make a new API token in Mealie and put it in `MEALIE_TOKEN`.
- A handwritten amount it can't read: FAITH asks instead of guessing. Check the recipe in Mealie afterwards anyway.
- The photo isn't kept with the recipe. Add it in Mealie if you want the original card there.

## Coinpile

- In Coinpile: Settings → Home Assistant & API → make a token with the **mcp** and **act** scopes for each person → `COINPILE_TOKEN_<ID>`.
- Connector URL: `http://<host>:8190/api/v1/mcp`.
- Money is never in the household view: there's no household token.
- With **act**, FAITH asks for the Yes, using Coinpile's own sentence ("Record in Firefly III: paid 15.75 …"). One Yes in FAITH is enough. Each change still shows on Coinpile's Agent page, marked "Yes given in FAITH".
- Without **act**, a change only *asks*: it waits for a second Yes on Coinpile's Agent page.
- A change Coinpile would refuse (an unknown account, say) is refused before you're asked.
- Receipts: send FAITH a photo of a receipt. The `receipt-to-coinpile` skill checks whether the bank already sent that payment. Cash gets recorded. A card payment waits for the bank, so it isn't counted twice. When it arrives, FAITH can set its category.
- Coinpile withholds a linked partner's numbers from other apps over MCP, so FAITH sees only that person's own share.

## Pondering Orb

- Orb is Wizard's personal dashboard and stays his. FAITH reaches it only in Wizard's view.
- Add `faith:<random>` to Orb's `ORB_API_TOKENS` and put the same `<random>` in `ORB_TOKEN_WIZARD`. Orb records `faith` as the writer.
- Connector URL: `http://<host>:8095/mcp`.

## Hermes and Hermes Studio

- **Hermes agent:** enable the API server (`API_SERVER_ENABLED=true`, `API_SERVER_KEY`).
  - Make one profile per person (`hermes profile create wizard`). FAITH calls `/p/<person>/v1`, so each person's Hermes has its own memory.
  - Give each profile its own key: `API_SERVER_KEY` in `~/.hermes/profiles/wizard/.env`. Put it in FAITH's `HERMES_API_KEY_WIZARD` (`key_env: HERMES_API_KEY_{PROFILE}`).
  - Hermes refuses one shared key on a person's profile (401). A person whose key is missing gets no Hermes in FAITH.
  - Children don't get Hermes by default.
- **Hermes Studio:** each person signs in with their own Studio account (`STUDIO_USER_<ID>`, `STUDIO_PASSWORD_<ID>`).
  - FAITH can list and read their Studio chats, and start a job there (`studio_start`), which they follow in Studio.
  - Studio's MCP bridge is stdio-only, so this goes through Studio's REST API, like Orb does.

## Mattermost

FAITH runs as a bot with a personal DM for each person, a family channel and a parents' channel: see [mattermost.md](mattermost.md).

## The other apps

Every app the family uses goes under `apps:` in `faith.yaml`. They become the launcher on the home screen and the Apps tab.
- `who: person` hides an app until someone signs in.
- `roles` / `people` limit it further (Orb for Wizard only, Coinpile for adults).

## Tokens for other apps

`faith token add household <name>` / `person <id> <name>` makes a token for FAITH's OpenAI-compatible endpoint (`/v1/chat/completions`, model `faith`). Omi, Open WebUI or a script can then talk to FAITH with that view's access and rules.
