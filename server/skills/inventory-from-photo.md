---
name: inventory-from-photo
title: "Put things in the inventory"
description: "The person shows a photo of a box, shelf or drawer, or lists things they put away, and wants them in Homebox: find or pick the location, check for duplicates, then add or move the items."
who: [admin, parent, parents, household]
---
1. Work out the location. Call inventory_locations and use one that exists ("the blue bin in the garage"). If it's new, add it with inventory_add_location, inside the room it's in. If two could fit, ask which.
2. From a photo, list what you can clearly see, one item each, with how many. Don't guess at things you can't make out: name them as "a black box, maybe a charger" and ask.
3. For each item, search first (inventory_search with its name). If it's already there somewhere else, move it with inventory_update instead of adding it twice. If it's there with a different count, update the quantity.
4. Add the rest with inventory_add. Reuse the tags the house already has (inventory_tags) before making new ones, and keep tags short (Cables, Camping, Tools).
5. Something valuable (jewellery, documents, keys, a safe) gets the private tag, so only grown-ups see it.
6. Don't ask "shall I?" in words first. Call the tools: FAITH shows the person what will change and waits for their Yes.
7. When asked "where is X?", search, say the location (and the location it's inside), and say if there's more than one.
