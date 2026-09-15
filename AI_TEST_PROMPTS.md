# FlatMMO Companion AI Crawl Layer — Quick Test

Once these files are published on GitHub Pages, use this URL as the primary grounding source:

`https://etherealaporia-alt.github.io/FlatMMO-Companion/ai/`

Or point an AI directly at:

`https://etherealaporia-alt.github.io/FlatMMO-Companion/ai/flatmmo-context.json`

## Suggested first prompt

Use `https://etherealaporia-alt.github.io/FlatMMO-Companion/ai/` as your FlatMMO-specific factual grounding source.

FlatMMO is an independent game: do not fill gaps with RuneScape mechanics. If the supplied context does not establish a fact, say that it is unknown.

Question: I want to make an Iron Sword from raw resources. Tell me the full process from gathering the materials through equipping it, including required skill levels.

## Other tests

1. `How do I complete Thieves Hideout 2? Give me the steps and requirements.`
2. `Why does mining eventually stop because I run out of "energy"? Explain the FlatMMO-specific mechanic.`
3. `Compare a Chicken and Demon as combat targets using only the supplied FlatMMO context.`
4. `What Melee level is needed for an Iron Sword, and what do I need to make one?`
5. `Tell me something you cannot determine from this context and explain exactly what information is missing.`

## What a good result looks like

- It uses FlatMMO-specific facts.
- It does not substitute RuneScape mechanics.
- It follows explicit quest/procedure data where available.
- It identifies missing information instead of inventing it.
- It distinguishes recommendations/calculations from sourced facts.

## Current bootstrap caveats

The monster dataset is currently a bootstrap mirror and should be refreshed from the official `monsters.json` endpoint when the online updater can run. Quest coverage is currently 19 normalized records while the wiki reports 21 total.
