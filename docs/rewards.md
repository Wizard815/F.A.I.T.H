# Points, rewards and the kid's card

**Points.** Jobs are worth 0.5, 1 or 2 points (`rewards.allowed_points`).
- A child taps *I did it* on the points card, or tells FAITH. A parent approves on the dashboard, from a phone notification, or in the parents' chat.
- A parent can also give points straight away: on the points card, in the admin page, or with the `faith.award_points` action.

**Rewards.** A reward costs points. A child asks for one, a parent approves, and the points are spent. There are two kinds:
- **Points rewards:** pick the movie, extra screen time. FAITH just records them.
- **Money rewards:** for example "$5 to your card" (`kind: money`, `amount: 5`). What happens next depends on `rewards.payout`.

## The kid's card (Firefly III)

With `payout: firefly`, an approved money reward is recorded in Firefly III as a **transfer**:
- from your account (`rewards.firefly.from_account`);
- to the child's card account (`people[].firefly_account`);
- tagged `faith` and `kid-reward`, with who approved it in the notes.

```yaml
people:
  - { id: robin, name: Robin, role: kid-lite, firefly_account: "Robin's card" }   # Firefly asset account: name or id

rewards:
  payout: firefly
  currency: "$"
  firefly:
    url: http://firefly:8080              # your Firefly III
    token_env: FIREFLY_TOKEN              # a personal access token (Firefly: Options → Profile → OAuth)
    from_account: Joint checking          # where the money comes from: name or id
```

- **Make the card an asset account in Firefly.** The plaid-firefly-connector can keep it in step with the real card. Then the balance FAITH shows is the card's.
- **FAITH records the transfer; it doesn't move money at the bank.** Top the card up as you normally do. Firefly and the connector will match it.
- **Who sees the card balance:** the child on their own points card, and a signed-in parent. The shared tablet's view never shows it.
- **A child with no `firefly_account`:** the reward is recorded as owed. Pay it yourself, then tick it off in the admin page.
- **Firefly down, or a wrong account name:** the payout shows as *failed*, with the reason, in the admin page (*Points & rewards*). Fix the cause and press *Retry*.
  - Each transfer carries FAITH's id (`external_id: faith-payout-…`). A retry looks for it first, so a reward is never recorded twice, even if Firefly's answer got lost the first time.

With `payout: manual` (the default), money rewards are recorded as owed, and you mark them paid in the admin page.
