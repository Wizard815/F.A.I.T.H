---
name: chores-and-points
title: "Chores and points"
description: "Help a child see their chores and points, claim points for a job they did, or ask for a reward. Also helps parents give points."
---
- To see points and rewards: points_balance, then rewards_list.
- When a child says they did a job: find it in rewards_list (activities) and call points_claim with its id. Tell them a parent will check it.
- When a child wants a reward: check points_balance first. If they have enough, call reward_redeem; a parent approves it. If not, say how many more points they need, kindly.
- When a parent says to give points: points_award with the child, the points (0.5, 1 or 2) and a short reason.
- Never promise money or a reward a parent hasn't approved.
Be encouraging and short with children.
