# Screens, sign-in and sign-out

FAITH works like a home hub: a shared screen that anyone can use, and that one person at a time can sign in to.

## The ways in

| Where | How | Lasts |
|---|---|---|
| A paired wall screen, nobody signed in | nothing: the household view | until someone signs in |
| A paired wall screen (FAITH's hub or who card in HA) | tap their face tile, then their PIN; or the camera (below) | until they leave (below) or tap *Sign out* |
| Their own phone or computer | their own Home Assistant account (mapped with `ha_user_id`); FAITH's own page takes a password or Face ID (the admin console) | `personal.idle_days` without use, at most `personal.max_days` |
| Home Assistant Assist | the HA user's mapped person, or household | one request |
| Another app | a `faith token` (household or one person) | until revoked |

**PINs only work on paired screens** (`hub.pin_on_personal_devices: false`). A PIN is short, so it's only accepted from a screen that's physically in the house. Five wrong tries lock that person for five minutes.

**Face ID** is a passkey for FAITH's own page (the admin console), not the HA cards. Each person adds it on each device, and FAITH stores only the public key.
- Browsers allow passkeys only over https, so serve FAITH through your reverse proxy (e.g. `https://faith.home.lan`) and set `public_url`.
- Over plain http the Face ID buttons don't show; PINs and passwords still work.

**The camera.** `face_entity` on a screen points at a sensor whose state is the recognised person's name (Frigate face recognition, Double Take); `face_names` maps those names to people.
- By default it only highlights that person's tile.
- `face_unlock: true` lets the face alone sign them in. Leave that off where children can stand in front of the camera.

## Pairing a screen

```bash
docker exec faith faith pair kitchen      # or Tokens & screens on FAITH's admin page
```

On the tablet, the FAITH card in HA asks for the 6-digit code (one use, 10 minutes). The tablet keeps the pairing.
- Pairing again replaces it.
- `faith unpair kitchen` or Tokens & screens removes it.

## Signing out by itself

| Situation | Signs out when |
|---|---|
| No presence sensor | `idle_seconds` (default 120) pass without a tap |
| Presence sensor (`presence_entity`) | nobody has been there **and** nobody has tapped for `away_seconds` (default 45) |
| Presence sensor, someone stays | after `max_idle_seconds` (default 900) without a tap anyway |
| Any screen | after `max_hours` (default 8) |

- The last 20 seconds count down on the hub and who cards ("Signing out *name* in 12s") with a **Stay** button. Any tap on the screen also keeps them.
- A background sweep ends sessions on time even if nobody is polling.
- Signing someone else in on the same screen signs the previous person out.
- `faith signout <person>` ends all of a person's sessions everywhere.

## The household view and approvals

Anyone can use the household view, so FAITH treats it as a guest who lives here:
- It sees the shared calendar, chores, meals, shopping, the house and the wiki's shared notes, never anyone's private things.
- It can ask for changes. Each change waits in *Waiting for approval* until an adult approves or denies it.
- An admin can overrule a denial.
- `roles.household.approve_skip: [shopping_add]` would let the household add to the shopping list without asking. It's empty by default.
