---
name: plan-week-dinners
title: "Plan the week's dinners"
description: "Pick dinners for the next 7 days around the family's schedule, put them on Mealie's meal plan and add what's missing to the shopping list."
who: [admin, adult, parents]
---
1. Find the busy evenings: call allglance_get_day for each of the next 7 days and note evenings with something after 17:00.
2. See what's already planned with meals (start today, days 7). Don't replace planned dinners.
3. For each free evening, find a recipe with recipes_search: quick ones ("quick", "30 minutes", "one pan") on busy evenings, anything the family likes on quiet ones. Don't repeat a recipe in the same week.
4. Before writing anything, list the plan (day, dinner, why) and ask the person if it's good. In a routine, just propose the plan and stop.
5. Once they agree, put each dinner on the plan with meal_plan (entry_type dinner).
6. For each new recipe, read its ingredients with recipe_get, then add what's missing to the shopping list with shopping_add (check shopping_list first so nothing is added twice).
7. Finish with the plan in one short list.
