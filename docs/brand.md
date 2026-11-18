# FAITH's look: brass & honey

**The idea.** FAITH keeps the family's hive. The emblem is a turning d20 (an icosahedron) holding a small hive of low-poly bees. Thread ties the bees to each other and to a glowing hexagon core, and two gold rings turn around the whole thing.
- The bees are the family and the apps FAITH connects.
- The threads are how they reach each other.
- The core is the agent.
- The rings keep watch.

Open [`brand/emblem.html`](brand/emblem.html) in a browser to see it move. Rebuild it with `node web/scripts/emblem-preview.mjs`.

**The emblem shows what FAITH is doing.**

| State | What you see |
|---|---|
| idle | a slow turn, a few sparks along the threads |
| listening | the hive draws in, and the core brightens with the voice |
| thinking | a faster turn; the rings spin up and sparks race along every thread |
| speaking | the core pulses |

- It's `web/src/emblem/emblem.ts`: canvas 2D with no dependencies. `Emblem.tsx` wraps it for React.
- It uses `tone: "dark"` on dark backgrounds and `"light"` on paper.
- With reduced motion turned on, it draws a single still frame.

**Colours.**

| Name | Hex | Use |
|---|---|---|
| Espresso | `#18110C` | night background |
| Walnut | `#241A13` | night cards |
| Saddle | `#5C4030` | lines, quiet text |
| Bronze | `#9A6B1F` | the accent on paper (gold that still reads on white) |
| Gold | `#DEB25A` | the accent at night |
| Honey | `#F4D68C` | highlights, sparks |
| Parchment | `#F6EFE4` | day background |
| Cream | `#F5ECDC` | night text |

- Tokens live in `web/src/index.css`. Change them there, not in components.
- Pale gold on paper fails contrast, so light mode uses bronze for text and buttons.

**The feel.**
- Warm, not techy.
- Thin gold hairlines and ring ticks, like a brass instrument.
- Hexagons for the hive: the core now, and face tiles and points later.
- Fraunces for headings, Instrument Sans for text, both bundled.

**Home Assistant.** Copy `ha/themes/faith.yaml` to HA's `config/themes/` and pick *FAITH*. The FAITH cards use `--faith-accent`, which defaults to gold, so they match even without the theme.
