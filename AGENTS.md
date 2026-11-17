# FAITH agent guide

FAITH is the family's front-end agent: one container (server + web app) and a Home Assistant integration. Read `docs/architecture.md` before changing auth, connectors or the harness.

## Layout

| Path | What | Check |
|---|---|---|
| `server/` | Fastify + `node:sqlite`: auth, connectors, harness, API | `npm test` (node:test with fake model, MCP and HA servers in `server/test/fakes.ts`) |
| `web/` | React + Tailwind | `npm run build -w web` |
| `ha/custom_components/faith` | HA integration | `cd ha && pytest` (needs `pytest-homeassistant-custom-component`) |
| `server/scripts/demo.ts` | the whole thing with fakes | `node --import tsx server/scripts/demo.ts` |

## Rules

- **Privacy comes from tokens, not prompts.**
  - Never give the household view a person's token, and never run an approved household request with the approver's token.
  - A source without a token for a view must offer no tools.
- **Every tool call goes through `Agent.wrap`:** approval, confirmation, then the action log. New tools must not bypass it.
- **Secrets go in env vars only.** Config names the variable (`*_env`, `{ID}` templates). Store hashes, never tokens.
- **Local models only.** Don't add calls to cloud services or fetch fonts or assets from the internet.
- **UI:**
  - Use the tokens in `web/src/index.css` and the components in `web/src/ui.tsx`: warm paper or neutral dark, Fraunces headings, hairline cards.
  - OpenFamily (AGPL) is a design reference only. Don't copy its code.
- **Dependencies:** pin exact versions, at least two weeks old.
- **New behaviour gets a test** against the fakes; security rules (scopes, roles, approvals, confirmations) especially.
- Keep docs in plain, short sentences that say what goes wrong.
