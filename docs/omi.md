# Omi

Omi is the wearable that records conversations and turns them into memories. With your own Omi (omi-local), FAITH can look things up in each person's recordings: "what did the dentist say last week?", "what did we decide about the trip?".

## How it connects

FAITH reaches Omi's own MCP server (`/v1/mcp`), with **each person's own read-only key**:

```yaml
connectors:
  - id: omi
    type: mcp
    url: http://192.168.1.5:8000/v1/mcp
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

## Not built yet

- **Omi → FAITH:** a kept conversation sent to FAITH, which proposes tasks or shopping items for that person to confirm. Omi's webhooks carry no auth header, so this needs its own token kind in FAITH. On your Omi, `OMI_WEBHOOK_ALLOWED_PRIVATE_NETWORKS` must allow FAITH's address.
- **Omi's chat → FAITH:** FAITH's own MCP server added to Omi as a private app, with each person's own FAITH token.
