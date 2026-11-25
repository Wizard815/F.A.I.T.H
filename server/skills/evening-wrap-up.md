---
name: evening-wrap-up
title: "Evening wrap-up"
description: "An end-of-day check: tomorrow's first things, chores left, and whether the house is shut up for the night."
---
1. Tomorrow: call allglance_get_day for tomorrow and pick the first two or three things (and anything before 9:00).
2. Chores still open today: allglance_list_chores.
3. The house: home_find with domain lock, then domain cover and light. Note any door unlocked, garage or cover open, and lights still on in empty rooms.
4. Don't lock or switch anything yourself. Say what's open and offer to do it (locks need a Yes).
5. For one person: ask if anything from today is worth remembering (a decision, something to follow up). Log what they say with memory_log, section "decisions" or "follow_ups". Don't log anything they didn't say.

Keep it short: "Tomorrow: …", "Still to do: …", "The house: …".
