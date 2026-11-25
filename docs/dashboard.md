# The board (Pondering Orb, inside FAITH)

FAITH's apps have two views: **Ask** (the helper) and **Board** (the info board). The board is Pondering Orb's Main and Daily pages, brought into FAITH. Orb's assistant, the Golem, is now FAITH itself: the same agent, tools and rules as everywhere else.

The board works in the desktop app and the Android app. The API is in [clients.md](clients.md), section 6.

## What's on it

| Part | Where it comes from | Who sees it |
|---|---|---|
| Morning brief | Written by FAITH from your board, your tools and the news | You only |
| Weather | A Home Assistant weather entity (`board.weather_entity`) | Everyone |
| The day cards | `dashboard:` in faith.yaml (today, meals, shopping, chores, the house, approvals, your own cards) | Each viewer, with their own tools |
| Projects | Your own, kept in FAITH: next, active, blocked, paused, shipped | You only |
| Log | Short notes of what you got done, per project or General | You only |
| News | RSS or Atom feeds (`board.news.feeds`) | Everyone |
| Uptime | Uptime Kuma's published status page (`board.uptime`) | `board.uptime.roles` (admins by default) |
| FAITH's server | Load, memory and disks of FAITH's machine, and which connections are down | `board.system.roles` (admins by default) |

**Privacy.** Projects, the log and the brief belong to one person. The household screen, Home Assistant's shared token and the Mattermost group chats never see them, and get none of the board's tools. A person's day cards use that person's own tokens, as before.

## Three layouts

The apps show the board three ways, picked per device in Settings:
- **Voice focus:** just talk to FAITH. It reads every answer aloud and can use all of the board.
- **Voice panel:** a clock, the weather and a few panels (brief, next up, dinner, shopping, the house), like a smart speaker's screen. A tap asks FAITH about that panel.
- **Voice dashboard:** the whole board, with Ask and the Inbox.

Details and what goes wrong: [desktop.md](desktop.md#three-layouts), [android.md](android.md#three-layouts).

## Set it up

Everything is optional. A part that isn't set up doesn't show.

```yaml
board:
  weather_entity: weather.home            # HA fetches the weather; FAITH only reads HA
  news:
    feeds: [http://freshrss:8080/i/?a=rss] # off until you add one; see below
    items: 8
  uptime: { url: http://uptime-kuma:3001, slug: home, roles: [admin] }
  system: { roles: [admin], disks: [/data] }
  brief:
    people: [wizard]                       # who gets a brief written each morning
    time: "07:00"                          # your TZ
    days: daily                            # or weekdays, weekends, mon,wed,fri
    send: false                            # true: also send it to their chat and phone
  log_max: 120                             # the longest log entry, in characters
```

**News reaches the internet.** FAITH fetches each feed from wherever it points. To keep it on your own network, point it at a local reader (FreshRSS, Miniflux) that does the fetching. With no feeds, FAITH fetches nothing.

**What goes wrong:**
- No weather: the entity name is wrong, or the view's HA token can't read it. The board says what HA answered.
- "Uptime Kuma has no published status page": publish the page in Uptime Kuma, or fix `slug`.
- A feed shows an error: the feed is down or the address is wrong. The other feeds still show.
- No morning brief: the person isn't in `board.brief.people`, or the model was down. A failed brief is tried again after 15 minutes, within the hour. **Write it now** on the board always works.

## FAITH is the Golem now

What the Golem did, FAITH does, through its own agent and tools. Every board change goes through `Agent.wrap`: the role's rules (a child's changes follow the child allowlist), approvals, and the action log.

| Orb's Golem | FAITH |
|---|---|
| `orb_list_projects`, `orb_get_project` | `board_projects` |
| `orb_list_logs`, `orb_add_log` | `board_log`, `board_log_add` |
| `orb_move_project` | `board_project_update` (status, next step, star, rename, archive) |
| (none) | `board_project_add`, `board_brief`, `board_weather`, `board_news`, `board_uptime` |
| Tasks, chores, calendar | ALLGlance's own tools, with each person's token (as before) |
| The morning brief (`daily.ts`) | `Board.writeBrief`: one FAITH turn with no tool that changes anything |

So "log that I fixed the gate latch on the shed project" works in Ask, in Mattermost (your own DM) and by voice when you're signed in.

## Moving over from Orb

1. In faith.yaml, keep your `orb` connector and `ORB_TOKEN_<YOUR ID>` (setup.md, Pondering Orb).
2. On the desktop app's board, with no projects yet: **Bring my projects over from Pondering Orb**. Or call `POST /api/board/import` with `{ "from": "orb" }`.
3. FAITH reads Orb's projects and log with your own Orb token. It skips projects and entries it already has, so running it twice is safe. A log entry for a project Orb no longer has goes to General.

No Orb connector? Save Orb's `/api/c/projects` and `/api/c/logs` and send them as `{ "projects": [...], "logs": [...] }` to the same address.

**What goes wrong:**
- "FAITH has no Orb token for you": set `ORB_TOKEN_<YOUR ID>`. FAITH never uses someone else's.
- "Pondering Orb answered 401": the token isn't in Orb's `ORB_API_TOKENS`.

## What came from Orb, and what didn't (yet)

Brought over:
- Projects (the five columns), the log, the morning brief and its prompt.
- The news feed reader (RSS and Atom).
- Uptime Kuma's status page.
- A small part of the System tab (load, memory, disks).

Not brought over:
- **Markets, stock picks, Robinhood:** they call cloud services. FAITH doesn't.
- **OpenRouter and other frontier models:** FAITH uses local models only.
- **Open-Meteo weather:** a cloud service. FAITH reads Home Assistant's weather instead.
- **Ground News links:** a cloud service.
- Project tasks in CalDAV, the Journal, Agents (Hermes Studio), Ideas (Milaclone), the Wiki page, Links, Upkeep (UpstreamManager), Firefly and Coinpile pages, Docker containers, and the movable panel grid. FAITH reaches some of these already through its connectors (Firefly, Coinpile, the wiki, Hermes Studio). The rest are for later.

Orb itself still runs. Retire it when you no longer miss anything.
