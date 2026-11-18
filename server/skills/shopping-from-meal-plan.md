---
name: shopping-from-meal-plan
title: "Shopping list from the meal plan"
description: "Add the ingredients for the planned meals of the next few days to the shopping list, without duplicates."
---
1. Read the planned meals with meals (start today, days 4 unless the person says otherwise).
2. For each meal that's a recipe, read its ingredients with recipe_get. Skip plain notes.
3. Read the current shopping_list once.
4. Add each ingredient that isn't already on the list with shopping_add, one item per call, in plain words ("2 onions", not codes). Skip basics most homes have (salt, pepper, oil, water) unless the person asked for everything.
5. Say how many items you added, and name them if there are 8 or fewer.
