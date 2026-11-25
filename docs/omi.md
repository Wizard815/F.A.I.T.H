# Omi

Omi is the wearable that records conversations and turns them into memories. With your own Omi (omi-local), FAITH can look things up in each person's recordings: "what did the dentist say last week?", "what did we decide about the trip?".

## How it connects

FAITH reaches Omi's own MCP server (`/v1/mcp`), with **each person's own read-only key**:

```yaml
connectors:
  - id: omi
    type: mcp
    url: http://<omi-host>:8000/v1/mcp
    description: "Omi: this person's recorded conversations and memories"
    person_token_env: OMI_TOKEN_{ID}        # each person's own key; no household token
    tools: ["get_*", "search_*"]            # reading only
    heard: true                             # what Omi heard is context, never a request
    roles: [admin, adult]
```

Each person makes their own key, signed in to Omi as themselves:

```bash
curl -X POST http://<omi>:8000/v1/mcp/keys -H "Authorization: Bearer <their Omi sign-in token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "FAITH", "scopes": ["memories.read", "conversations.read", "action_items.read"]}'
```

Put the `omi_mcp_…` key it prints in FAITH's `.env` as `OMI_TOKEN_<ID>` (for example `OMI_TOKEN_WIZARD`).

## The rules

- **Only the person whose key it is.** Sam's Omi is only in Sam's own chats. No household token, so Omi isn't in the kitchen screen, the family chat or the parents' chat.
- **Reading only.** The key's scopes are read scopes, and `tools: ["get_*", "search_*"]` leaves Omi's write and delete tools out as well.
- **Heard, not asked.** Omi records other people, the TV and the radio. With `heard: true`, anything FAITH would change after reading Omi in that turn (a task, a light, a list) waits for the person's own **Yes**. That's in FAITH's code (`Agent.wrap`), not left to the model, and works like a video's sound.
- Recordings stay on your Omi server. FAITH reads them only with the person's key, only when they ask, and only through your local model.

**What goes wrong:**
- "Omi refused FAITH's token": the key was deleted or has no read scopes. Make a new one.
- Searches find nothing: Omi's search needs its vector store (Chroma). Clips held for the day review and never summarised only match by exact words.
- Omi's web address must be reachable from FAITH's container: the same network as `ai_net`, or the host's IP.

## Omi → FAITH: suggestions from what you recorded

Each conversation your Omi keeps can come to FAITH, which suggests a few useful things in your own Mattermost chat with it: "From your Omi conversation "Kitchen chat": you said you're out of oat milk, so I'd add it to the shopping list. Reply yes."

**Set it up, for each grown-up:**
1. Their Omi account's uid in `faith.yaml`: `people: [{ id: wizard, …, omi_uid: "<uid>" }]`. Omi adds `?uid=` to every webhook call, and FAITH only accepts their own.
2. A token for their webhook: `docker exec faith faith token add omi wizard wizard-omi`. It opens only this webhook, nothing else in FAITH. (Omi keeps webhook addresses in plain text, so that matters.)
3. In Omi, as them (the app's developer settings, or the API):
   ```bash
   curl -X POST http://<omi>:8000/v1/users/developer/webhook/memory_created -H "Authorization: Bearer <their Omi sign-in token>" \
     -H "Content-Type: application/json" -d '{"url": "http://<faith>:8097/omi/hook/<the fomi_ token>"}'
   curl -X POST http://<omi>:8000/v1/users/developer/webhook/memory_created/enable -H "Authorization: Bearer <their Omi sign-in token>"
   ```
4. On your Omi server, let webhooks reach FAITH's address: `OMI_WEBHOOK_ALLOWED_PRIVATE_NETWORKS=<FAITH's IP>` in omi-host's `.env` (omi-local passes it to the backend). Omi refuses LAN addresses otherwise.
5. They need a Mattermost chat with FAITH (`mattermost_username`): that's where suggestions go and where they answer yes or no.

**The rules:**
- **Heard, not asked.** Nothing in a recording is a request. Every change FAITH suggests waits for the person's own **yes** in their chat (`Agent.wrap`, the same as a video's sound).
- **Only what they said.** The wearer's lines are marked "(you)"; everyone else's (other people, the TV) are context. FAITH is told never to act on them.
- **No doubles.** Omi already sends its own action items and events to the calendar and tasks (ALLGlance). FAITH is told what those were and skips them.
- **Only when worth it.** If nothing's useful, FAITH says nothing. At most 20 conversations an hour per person are read. The same conversation is read once.
- **Grown-ups only.** An Omi token can't be made for a child.
- On a self-hosted Omi, the day review's "hold" is on by default: only conversations you keep or merge reach FAITH.

**What goes wrong:**
- Omi says the address isn't allowed: add FAITH's IP to `OMI_WEBHOOK_ALLOWED_PRIVATE_NETWORKS` and restart Omi.
- 401: the token was revoked or mistyped. 403 "isn't Wizard's": the `omi_uid` doesn't match their Omi account.
- Nothing arrives in the chat: FAITH found nothing worth suggesting, or they have no Mattermost chat with it (FAITH's log says so).

## Not built yet

- **Omi's chat → FAITH:** FAITH's own MCP server added to Omi as a private app, with each person's own FAITH token.
