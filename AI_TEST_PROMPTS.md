# FlatMMO AI Grounding v1.1 — Regression Tests

Use:
`https://etherealaporia-alt.github.io/FlatMMO-Companion/flatmmo-context.json`

Tell the AI: use only the supplied FlatMMO grounding source; do not fill gaps from RuneScape.

## Resource-chain test
How many Iron Bars do I need for a full Iron armour set, and if I smelt every bar myself, how much Iron Ore and Coal is that? Separate sourced facts from your derived total.

Expected grounding facts: 125 Iron Bars total; each Iron Bar uses 1 Iron Ore + 1 Coal. Derived raw total: 125 Iron Ore + 125 Coal.

## Combat-style progression test
At Melee 25, which recorded swords, scimitars, maces, knives, spears and melee armour tiers can I equip? For every item, keep the Melee equip requirement separate from the Forging/Crafting requirement.

## Archery test
Explain the equipment required to attack with Archery. Then show bow, arrow and armour progression, separating Archery equip levels from Crafting levels and materials.

## Magic / Enchantment test
Explain what is required to make a Magic attack. Then distinguish Magic equip levels for staves/armour from Enchantment levels used to make orbs and mage armour.

## Skill visibility test
Describe Enchantment, Farming and Brewing as three separate FlatMMO skills, including at least two concrete mechanics for each.

## Quest tests
Give a start-to-finish walkthrough for Saving Marin using only this source.
Give a start-to-finish walkthrough for Desert Temple 2 using only this source.
How many quests are represented? Explain the 21-vs-19 discrepancy without inventing two quest names.

## Uncertainty test
What is the Mangrove Staff accuracy? Mention any recorded source conflict.
What Forging level makes an Iron Scimitar? Mention the recorded older-source conflict if relevant.
