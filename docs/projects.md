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

## How a thread runs

1. Someone asks in a chat ("look into this in the background"), and FAITH calls `project_thread_start`. Or an app calls the API below.
2. The thread runs behind quick questions in the model's queue, with every tool its owner may use. Every change goes through `Agent.wrap`, as always.
3. Nobody is watching a thread, so it can't get a Yes. A change that needs one is refused, and the thread says so in its summary. In Family, changes become approval requests and the thread shows **waiting**.
4. When it ends, the project's **coordinator** gets a turn. It sees the thread's last message, tells the owner, and may start one follow-up thread. Each follow-up counts one step; after `max_depth` steps the thread's own summary is sent instead, so a coordinator can't loop.
5. `project_thread_message` gives a finished thread more to do. It carries on in its own conversation.

Threads get no project tools, so a thread can't start threads. The coordinator can.

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
| `POST /api/projects/:id/threads` `{ "brief", "title"? }` | Start one. Returns `{ thread }`, or `pending` (a Yes to tap) or `requests` (waiting for approval) |
| `GET /api/projects/:id/threads/:thread` | Its latest messages |
| `POST /api/projects/:id/threads/:thread/message` `{ "text" }` | More to do |
| `PUT /api/projects/:id/threads/:thread/resolved` `{ "resolved" }` | Put away or bring back |

A thread's `status` is `working`, `done`, `waiting` (an approval is open) or `failed`.

## Set it up

It's on by default and reaches nothing new: threads only use the tools FAITH already has.

```yaml
projects:
  enabled: true          # false: no project tools and no threads
  max_working: 3         # threads working at once in one project (1 to 10)
  wake_coordinator: true # false: a finished thread's own summary is sent, with no coordinator turn
  max_depth: 2           # follow-up threads a chain of coordinator turns may start (0 to 5)
```

## What goes wrong

- **"Family already has 3 threads working":** wait for one to finish, or raise `max_working`. A local model answers one request at a time, so more threads only queue longer.
- **"FAITH restarted while this was running":** the thread's turn stopped with the old process. Send it a message to carry on.
- **Nobody heard back:** news goes through Mattermost and HA phone notifications. With neither set up, it's only in the person's inbox in FAITH's apps.
- **A thread says it needs a Yes:** do that part yourself in a chat, where FAITH can ask you.
- **Someone left the family:** their project and threads stay in FAITH's database but nobody can open them, not even with an old sign-in. Add them back to `people:` to see them again.
- **Seeing how threads went:** each finished thread adds a `project_thread_end` row to the action log, with its title and status (not what it said). Overseer reads the action log, so it sees those rows too.
- **"A thread can't start other threads":** ask the project's coordinator, or start the next thread yourself.

## In the apps

- **Desktop and Android:** a Projects tab (list, thread, send more, put away, start one; the Yes card for Family and Parents). Voice focus shows *Projects: 1 needs you*, and Voice panel has a Projects tile.
- **D.A.S.H:** a Projects tab and a Home card, from `/api/projects/glance` with the device's FAITH token (D.A.S.H's `firmware/README.md`).

## Not built yet

- Handoffs: a project asking another one a question, answered with that project's own tokens.
- Projects for the wiki's groups. FAITH has no groups list yet.
- A Home Assistant card (the HA integration's `CARD_PATHS` doesn't allow `/api/projects` yet) and a Mattermost command.
- Starting or answering threads from D.A.S.H. Its Projects screen reads `/api/projects/glance` and is read-only until hold-to-talk and pairing.
- Handing a thread's work to Hermes Studio's Projects once those have per-person owners. Today a thread can use `studio_start` as its owner's own Studio account.
