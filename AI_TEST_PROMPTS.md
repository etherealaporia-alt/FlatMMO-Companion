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

# World / room model v1.2 tests

Use:
`https://etherealaporia-alt.github.io/FlatMMO-Companion/flatmmo-context.json`

## Everbrook room test
List the documented places in Everbrook where I can sleep. For each one, name the internal room/sub-location rather than just saying "Everbrook".

Expected grounding: Cow Farm farmhouse, Mayor's House, Fisherman's Shop, Inside Chef's House.

## Functional NPC / travel test
I'm in Everbrook and want to get to Omboko. Which NPC handles that route, where are they, and what coin requirement is documented?

Expected grounding: Ned the Boat Guy at Everbrook Docks; hold 25 Coins.

## Bank + shop distinction test
In Everbrook, distinguish the East Town Square from the Bank and Fisherman's Shop. Which of those rooms actually contains the bed?

Expected grounding: East Town Square contains the entrances; Fisherman's Shop contains a documented bed; Bank is a separate interior.

## Thieves Hideout room test
Where are the beds inside Thieves Hideout, and how many are documented?

Expected grounding: first interior room named Thieves Hideout; 4 beds.

## Mystic Vale services test
Where is the documented bed in Mystic Vale? Where are the Magic Shop, General Supply Shop and Unpowered Orb digging location?

## Frostvale beds test
Name every documented Frostvale bed location in this dataset and identify which rooms are cold-safe.

## Navigation uncertainty test
Give me the full internal-room route through the Desert.
Expected behavior: say the Desert room model is currently partial rather than inventing a route.

## Area vs room test
Is "Ghost Mansion Bank" the same thing as the whole Ghost Mansion area? Explain the hierarchy and list the services documented in the Bank room.

# Entity / relationship graph v1.3 tests

Use:
`https://etherealaporia-alt.github.io/FlatMMO-Companion/flatmmo-context.json`

## Quest-room linking: Sewer Doll
Give me the Sewer Doll quest step-by-step. For each step, name the exact internal room when the dataset has one.
Expected: Cemetery -> Sewer Gold Ore -> Cemetery. Do not invent an intermediate room.

## Quest-room linking: Mount Frostvale
Where exactly do I go for each Mount Frostvale quest step?
Expected: FrostBoot links to Frostvale River; Mayor interactions link to Mayor's House; final step spans River and Northern Entrance.

## Partial quest location test
Give me exact room-by-room directions for Desert Island.
Expected behavior: explain that Desert room coverage is partial and most steps are only area-linked; do not invent room IDs.

## Monster-room test
Where exactly are Giant Spiders documented?
Expected: sewer.giant_spiders and beach.quicksand_giant_spiders are exact current room-page links. Preserve that the bootstrap monster record's broad area label is Sewer, so the Beach link is a retained cross-source disagreement rather than a silent overwrite.

## Monster source conflict test
Where is Seagull?
Expected: the bootstrap monster record says Beach, while exact current room-page evidence links seagull to Dock Haven Seagulls / Water Spirit. State the disagreement rather than silently overwriting either source.

## Unlinked monster test
Where exactly can I find Dust Devil?
Expected: report its broad monster source area (Desert) but say v1.3 has no exact room link. Do not invent a Desert room.

## Resource node test: Gold Ore
List the exact rooms with structured Gold Ore nodes.
Expected: Sewer Gold Ore and Beach Quicksand Giant Spiders.

## Resource node test: Graphite
Where is Graphite explicitly indexed, and what Mining requirement is attached when documented?
Expected: Volcano Graphite Room has Graphite with Mining 70; Lava Enchantment Altar also records Graphite but no extra level should be invented for that node.

## Resource node test: Unpowered Orb
Where can I dig Unpowered Orbs and what tool is explicitly documented?
Expected: Mystic Vale Orb Pile; Shovel.

## Bed uncertainty test
A room has bedCount 0. Does that prove there is no bed?
Expected: No. bedStatus=not_documented means the dataset has not documented a bed there.

