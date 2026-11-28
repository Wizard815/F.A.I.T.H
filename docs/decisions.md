# Decisions

## Build new, borrow from the references

FAITH started from a look at five projects. None was forked.

| Project | What it is | Licence | What FAITH took |
|---|---|---|---|
| [NexaFlowFrance/OpenFamily](https://github.com/NexaFlowFrance/OpenFamily) | family organizer web app (shopping, meals, tasks, calendar, budget, rewards) with parent/child roles, a kiosk view and an HA add-on | AGPL-3.0 | **The look:** warm paper and neutral dark, Fraunces over Instrument Sans, hairline cards, the "day at a glance" stats strip, the big-clock kiosk, the pill tab bar. Also the parent-only actions and display links. Ideas only, no code: copying AGPL code would make FAITH AGPL. |
| [tianhaoz95/family-agent](https://github.com/tianhaoz95/family-agent) | local-first household agent (planner and sub-agents, MCP, routines) with desktop and mobile apps | MIT | **The chat:** bubbles, the "N tool calls" chips, Copy / Read aloud, the pill composer with photo and mic. Also small-model prompting lessons (`docs/DECISIONS.md`) and the idea of an env var that locks a setting. |
| [adgapar/teya](https://github.com/adgapar/teya) | wall-mounted Android voice agent with per-person memory and speaker ID | Apache-2.0 | Tools allowed per channel; per-person memory kept apart (FAITH leaves that to the wiki); voice ID as a hint, not a key. |
| [TencentCloud/Octop](https://github.com/TencentCloud/Octop) | multi-user self-hosted assistant platform (experts, IM channels, tool approval) | MIT | Tool approval before risky actions, one runtime behind every surface (web, voice, API), IM channels as a later surface (Mattermost). |
| Wizard815/pondering-orb | Wizard's own dashboard | PolyForm Shield (own) | The stack (Fastify, `node:sqlite`, React/Vite, one image), the Golem tool loop, the MCP client, the config-names-the-env-var convention, the Studio integration. Later the board: projects, the log, the morning brief, the feed reader and Uptime Kuma ([dashboard.md](dashboard.md)). |

**Why not fork OpenFamily?** It's an organizer, not an agent: no chat, no tool loop, no MCP. Its data lives in its own Postgres, while your data already lives in ALLGlance, Mealie, the wiki and Coinpile. FAITH needs to *aggregate* those, not replace them. You could still run OpenFamily unmodified next to FAITH, but it can only pull HA's shopping lists one way; it can't read ALLGlance, the wiki or Mealie.

**Why not fork family-agent?** It's the closest *agent*, but it ships as desktop and mobile apps with no Docker or web build. It has no child role, no Home Assistant, two very large files, and calls itself a prototype.

## A container next to Home Assistant, not inside it

See [home-assistant.md](home-assistant.md#container-not-an-add-on). In short: HA restarts shouldn't take the family's assistant down, FAITH needs the apps on `ai_net`, and its secrets shouldn't be readable by HA admins. HA embeds FAITH (sidebar page, Assist agent, sensors) through the integration.

## FAITH's own agent loop

FAITH's loop is about 100 lines (adapted from Orb's Golem). Running it in FAITH means every tool call passes through the same scope, role, approval and confirmation checks. Hermes stays available for big jobs, per person.

## The board lives in FAITH

Pondering Orb was one person's dashboard, with its own Golem. FAITH's apps now have its board, per person, and FAITH's agent does the Golem's jobs. One agent, one set of rules: a board change is a tool call like any other (`Agent.wrap`).

FAITH keeps family data in the apps that own it. Orb's projects, log and briefs had no other home, so FAITH keeps them now (`board_*` tables), one set per person. Tasks, chores and the calendar stay in ALLGlance. The weather comes from Home Assistant, not a weather service.

## Local only

FAITH talks to one OpenAI-compatible endpoint: Argos, on your hardware. The wiki's rule (personal notes only go to local models) holds as long as `model.base_url` points at Argos. Nothing in FAITH calls a cloud service, and the fonts are bundled. The one exception you can turn on is the board's news feeds (`board.news.feeds`, off by default); point them at a local reader to keep even that at home.
