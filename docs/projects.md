# Family projects

Every person has a project, and so do the Family and the Parents. A project holds **threads**: jobs FAITH works on in the background ("find three dinners Robin will eat", "plan Saturday"). When a thread finishes, FAITH tells whoever the project belongs to.

It works like Hermes Studio's Projects, but for the family: a thread is a FAITH conversation, not a coding agent, and it uses FAITH's own tools and rules.

## Who sees what

A project's owner decides whose tokens its threads use. It's the same split as the wiki's folders.

| Project | Who sees it | Its threads run with | News goes to |
|---|---|---|---|
| A person's own (`person-sam`) | That person, signed in | That person's own tokens and role | Their chat, phone and inbox |
| Family (`family`) | Everyone, the shared screen, the family chat | The household's tokens; changes wait for approval | The family chat (or everyone's phone) |
| Parents (`parents`) | Grown-ups, the parents' chat | The household's tokens with the parents' rules | The parents' chat |

- Nobody opens another person's project, not even an admin. A wrong id answers "There's no such thread in your projects."
- A thread runs as its project's owner, never as the person who asked. Sam starting a Family thread doesn't lend it Sam's wiki.
- **Words going to a shared project wait for a Yes.** When a signed-in person starts or messages a thread in Family or Parents, they see the exact words first ("send this to the Family project, where the whole family can read it: …") and tap Yes. The model can't send something private there by itself. From voice or an API token, that's refused.
- **A coordinator works only in its own project.** It runs with nobody watching, so Sam's coordinator can't start or message a Family thread, even if something it read tells it to. It refuses with "A project's coordinator works only in its own project."
- From the shared screen, starting a thread is a household change, so a grown-up approves it first.
- **The wiki.** A person's thread uses their own wiki token, so it reads their `people/<id>/` folder and `household/`. A Family or Parents thread uses the household token: `household/` only, never anyone's folder. The wiki enforces this, not FAITH's prompt.
- Children: the project tools follow the child allowlist. `project_thread_start` isn't on it, so a child can read their projects but not start threads. Add it to `roles.child.allow_writes` to change that.

## Throwaway threads

A throwaway thread is for a quick private question you don't want kept: a gift idea, a surprise, something you're just wondering about. Tick **Throwaway** when you start one, or ask in a chat for "a throwaway thread".

- **Only in your own project, started by you.** Family and Parents, the shared screen, voice and coordinators can't make one.
- **It only looks things up.** It gets no tools that change anything, so it can't add to the calendar, write a wiki note, ask Hermes (which remembers) or start other threads. Your chat isn't filed to the wiki either.
- **Nobody hears what it said.** No coordinator turn. Your inbox and phone get "Your throwaway thread has an answer", not the answer. Read it in Projects.
- **The action log keeps only that one ran** (`a throwaway thread (done)`), never its title, brief or answer. Overseer sees the same.
- **It's deleted** when you put it away, or `throwaway_hours` (24 by default) after it last changed: its messages and conversation go too. It can't be reopened.
- If you started it from a chat, your own chat still has what you typed there. Start it from Projects to keep even that out.

## How a thread runs

1. Someone asks in a chat ("look into this in the background"), and FAITH calls `project_thread_start`. Or an app calls the API below.
2. The thread runs behind quick questions in the model's queue, with every tool its owner may use. Every change goes through `Agent.wrap`, as always.
3. Nobody is watching a thread, so it can't get a Yes. A change that needs one is refused, and the thread says so in its summary. In Family, changes become approval requests and the thread shows **waiting**.
4. When it ends, the project's **coordinator** gets a turn. It sees the thread's last message, tells the owner, and may start one follow-up thread. Each follow-up counts one step; after `max_depth` steps the thread's own summary is sent instead, so a coordinator can't loop.
5. `project_thread_message` gives a finished thread more to do. It carries on in its own conversation.

Threads get no project tools, so a thread can't start threads. The coordinator can.

## Stages

Each thread has a `stage`, the same names Hermes Studio uses, so the apps group threads the same way.

| Stage | Shown as | Means |
|---|---|---|
| `working` | Working | It's running |
| `needs_you` | Needs you | It's waiting for an approval, or it failed |
| `review` | Ready for review | It finished and nobody has read it yet |
| `done` | Done | It finished and someone read it |
| `resolved` | Put away | Put away by hand, or by auto put-away |

- **Reading a finished thread reviews it.** Opening it in an app, or `project_thread_read` from a chat, turns `review` into `done`. A coordinator reading it doesn't count. In Family or Parents, one person reading it reviews it for everyone.
- **More to do starts it over:** sending a message, or a new answer, brings it back to `review` when it ends.
- **Auto put-away:** a `done` thread that nobody has touched for `auto_resolve_days` (3 by default) is put away. Threads that need you, or that nobody has read, are never put away on their own. `0` turns it off. Bring one back from *Put away* any time.

## Tools

| Tool | Does |
|---|---|
| `projects_list` | The projects you can see, with their threads and each one's last line |
| `project_thread_read` | A thread's latest messages |
| `project_thread_start` | A new background thread: `project` (mine, family, parents), `title`, `brief` |
| `project_thread_message` | More to do for a finished thread |
| `project_thread_resolve` | Put a thread away, or bring it back |

## API

Every route shows only this caller's projects and goes through the tools above.

| Call | Does |
|---|---|
| `GET /api/projects` (`?resolved=1`) | Your projects, each with its threads |
| `GET /api/projects/glance` | For little screens (D.A.S.H): at most 8 projects and 5 threads, short lines, counts of `needs_you` and `working` |
| `PUT /api/projects/:id` `{ "instructions" }` | The project's standing instructions, given to every thread (2000 characters at most) |
| `POST /api/projects/:id/threads` `{ "brief", "title"?, "throwaway"? }` | Start one. Returns `{ thread }`, or `pending` (a Yes to tap) or `requests` (waiting for approval). `throwaway: true` only in your own project |
| `GET /api/projects/:id/threads/:thread` | Its latest messages |
| `POST /api/projects/:id/threads/:thread/message` `{ "text" }` | More to do |
| `PUT /api/projects/:id/threads/:thread/resolved` `{ "resolved" }` | Put away or bring back. A throwaway one is deleted (`deleted: true`) |

Threads carry `throwaway: true` when they are one. A thread's `status` is `working`, `done`, `waiting` (an approval is open) or `failed`; its `stage` is in [Stages](#stages). The glance also counts `review`.

## Set it up

It's on by default and reaches nothing new: threads only use the tools FAITH already has.

```yaml
projects:
  enabled: true          # false: no project tools and no threads
  max_working: 3         # threads working at once in one project (1 to 10)
  wake_coordinator: true # false: a finished thread's own summary is sent, with no coordinator turn
  max_depth: 2           # follow-up threads a chain of coordinator turns may start (0 to 5)
  throwaway_hours: 24    # throwaway threads are deleted this long after they last changed (1 to 168)
  auto_resolve_days: 3   # read, finished threads are put away after this many quiet days (0 off, up to 60)
```

## What goes wrong

- **"Family already has 3 threads working":** wait for one to finish, or raise `max_working`. A local model answers one request at a time, so more threads only queue longer.
- **"FAITH restarted while this was running":** the thread's turn stopped with the old process. Send it a message to carry on.
- **Nobody heard back:** news goes through Mattermost and HA phone notifications. With neither set up, it's only in the person's inbox in FAITH's apps.
- **A thread says it needs a Yes:** do that part yourself in a chat, where FAITH can ask you.
- **Someone left the family:** their project and threads stay in FAITH's database but nobody can open them, not even with an old sign-in. Add them back to `people:` to see them again.
- **Seeing how threads went:** each finished thread adds a `project_thread_end` row to the action log, with its title and status (not what it said). Overseer reads the action log, so it sees those rows too.
- **"Throwaway threads are only for your own project":** start it from your own project, signed in as yourself.
- **A throwaway thread says it can't do something:** it only looks things up. Ask in a normal chat to change anything.
- **A thread vanished from the list:** it was put away (by hand or after `auto_resolve_days`). Open *Put away* to bring it back. Throwaway threads are deleted instead.
- **"A thread can't start other threads":** ask the project's coordinator, or start the next thread yourself.

## Hermes Studio

Studio has its own Projects for coding work. herdr is the engine behind its threads, and Studios pair into groups (about 6) through a bridge on each one. FAITH connects to that as the person, never as a Studio in the group:

- **As the person.** FAITH signs in to Studio with the person's own Studio account (`STUDIO_USER_{ID}`), the same as `studio_start`. A household view, a group chat or someone without a Studio account gets no Studio tools.
- **Or one owner.** Set `owner:` on the Studio connector to the family member who runs the homelab. Only they link Studio, with one Studio account (`STUDIO_USER`, `STUDIO_PASSWORD`): its chats, herdr threads and projects. Nobody else gets Studio tools, not even another admin, and the household view never does. Their own FAITH threads can hand Studio a job too.
- **`studio_projects`** lists that person's Studio projects with their open threads and stages (the same names as here). **`studio_project_message`** sends a project's coordinator a job or a question (Studio shows it as sent through FAITH). **`studio_project_task`** adds a task to its board, with the whole job in its notes. Both are changes, so they need a Yes like any other.
- **Studio decides.** FAITH never starts a Studio thread or a coding agent itself. Studio's coordinator, or the person, starts the task. If the work belongs on another Studio in the group, that coordinator sends it there through the bridge.
- **Studio's agents can still use the wiki and FAITH.** Studio's agents reach the LLM wiki through Studio's own wiki connection (hermes-studio `docs/llm-wiki.md`), with the owner's wiki token. To let them ask FAITH for something ("add milk to the list"), add FAITH's MCP server to Studio: `http://<faith-host>:8090/mcp` with the owner's person token (`docker exec faith faith token add person wizard studio`). It acts as the owner, so it sees only what they see, and the riskiest changes are refused there because nobody can tap Yes.
- **Why not join the group?** A paired Studio has one key for the whole box. FAITH's privacy comes from each person's own tokens, so a box-wide key would let one family member's work reach another's.

What goes wrong:
- **"Studio Projects are only for Studio's super admins":** Studio's project routes need a super admin. Use that person's Studio account, or start the job with `studio_start` instead.
- **A throwaway thread can't message or add a task:** it only looks things up.
- **"…has no coordinator" or a 429:** the Studio project has no coordinator chat, or 50 messages are still unread there. Open the project in Studio.

## In the apps

- **Desktop and Android:** a Projects tab, with its count of threads that need you. Threads are grouped by stage, with *Put away* folded at the bottom; each shows a *New* mark when it's ready for review and how long ago it changed. Read one, send more, put it away, start one, or edit the project's instructions. Family and Parents show the Yes card first. Voice focus shows *Projects: 1 needs you*, and Voice panel has a Projects tile.
- **D.A.S.H:** a Projects tab and a Home card, from `/api/projects/glance` with the device's FAITH token (D.A.S.H's `firmware/README.md`).

## Not built yet

- Handoffs: a project asking another one a question, answered with that project's own tokens.
- Projects for the wiki's groups. FAITH has no groups list yet.
- A Home Assistant card (the HA integration's `CARD_PATHS` doesn't allow `/api/projects` yet) and a Mattermost command.
- Starting or answering threads from D.A.S.H. Its Projects screen reads `/api/projects/glance` and is read-only until hold-to-talk and pairing.
- Studio projects for more than one family member who isn't a Studio super admin (Studio would need a project member role). With `owner:` that isn't needed. News from a Studio project coming back into a FAITH thread.
