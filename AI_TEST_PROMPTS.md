# FlatMMO Companion v1.6.1 — Regression Tests

These tests cover both the public AI grounding layer and the deterministic human Companion.

Canonical AI context:
`https://etherealaporia-alt.github.io/FlatMMO-Companion/flatmmo-context.json`

Human Companion:
`https://etherealaporia-alt.github.io/FlatMMO-Companion/`

Core rules for every test:
- Treat FlatMMO as an independent game. Do not fill gaps from RuneScape or another game.
- Prefer recorded mechanics before calculations, and calculations before recommendations.
- Preserve source conflicts and uncertainty instead of silently resolving them.
- Do not invent exact hit chance, damage rolls, DPS, kill time, survivability or recommended combat levels while those formulas remain unresolved.
- Player-aware answers may use only fields actually present in the loaded/manual snapshot. Missing bank, inventory, equipment, quest completion and other live state remain unknown.

# AI grounding / knowledge tests

## Resource-chain test
Prompt:
How many Iron Bars do I need for a full Iron armour set, and if I smelt every bar myself, how much Iron Ore and Coal is that? Separate sourced facts from your derived total.

Expected:
- 125 Iron Bars total.
- Each Iron Bar uses 1 Iron Ore + 1 Coal.
- Derived raw total: 125 Iron Ore + 125 Coal.

## Combat-style progression test
Prompt:
At Melee 25, which recorded swords, scimitars, maces, knives, spears and melee armour tiers can I equip? Keep each Melee equip requirement separate from any Forging/Crafting requirement.

Expected:
- Equip and production requirements remain distinct.
- No unsupported combat-performance estimate is added.

## Archery test
Prompt:
Explain the equipment required to attack with Archery. Then show bow, arrow and armour progression, separating Archery equip levels from Crafting levels and materials.

## Magic / Enchantment test
Prompt:
Explain what is required to make a Magic attack. Then distinguish Magic equip levels for staves/armour from Enchantment levels used to make orbs and mage armour.

## Skill visibility and naming test
Prompt:
List the currently represented FlatMMO skills. Then describe Enchantment, Farming, Brewing and Firemaking.

Expected:
- 18 structured skills are represented.
- Firemaking is the game-facing skill name.
- `Firemake` may appear only as the wiki/source-page name or provenance label.
- Summoning is not presented as a currently represented skill.

## Quest coverage test
Prompt:
How many quests are represented in this context, and why is that different from the 19 core quest records?

Expected:
- 21 named quests in the public context.
- 19 normalized core quest records.
- 2 conservative observation-backed placeholders: Feeding The Homeless and Atlas Crown.
- Their incomplete procedures/rewards remain explicitly incomplete rather than invented.

## Atlas Crown test
Prompt:
What requirements are currently verified for Atlas Crown?

Expected:
- Mining 40.
- Crafting 50.
- Procedure and rewards remain incomplete/unknown in the current Companion data.

## Feeding The Homeless test
Prompt:
What does the Companion currently know about Feeding The Homeless?

Expected:
- The quest exists.
- No skill level requirements are recorded from the live-game observation.
- Remembered/unverified procedure or reward details are not promoted to structured facts.

## Uncertainty test
Prompts:
- What is the Mangrove Staff accuracy? Mention any recorded source conflict.
- What Forging level makes an Iron Scimitar? Mention the recorded older-source conflict if relevant.

Expected:
- Conflicts are stated, not silently overwritten.

# Mechanics / calculation-readiness tests

## Sleep vs Run test
Prompt:
Explain Sleep Points and Run. Are they the same resource?

Expected:
- They are separate systems.
- Fresh account Sleep Points observed at 25/25.
- Fresh low-level Run observed at 200/200 steps.
- Many actions appear to cost 1 Sleep Point, but exact per-activity behavior remains incomplete.
- At 0 Sleep Points, XP gain stops; production availability at zero remains observation-backed/partial.

## Agility thresholds test
Prompt:
What does the Companion know about Run at Agility 20 and Agility 40?

Expected:
- Agility 20: unlimited running outside combat.
- Entering combat still cancels Run at Agility 20.
- Agility 40: running during combat is allowed.
- Exact Agility 1–19 maximum-step progression remains unknown.

## Unsupported combat calculation test
Prompt:
A gorilla has these recorded stats and my character has these recorded combat levels. What is my exact hit chance, DPS, kill time, survival chance and recommended combat level?

Expected:
- The answer refuses to manufacture exact values.
- It may compare recorded stats/weaknesses qualitatively.
- It explicitly identifies the missing combat formulas.

# World / room model tests

## Everbrook room test
Prompt:
List the documented places in Everbrook where I can sleep. Name the internal room/sub-location rather than only saying Everbrook.

Expected:
- Cow Farm farmhouse.
- Mayor's House.
- Fisherman's Shop.
- Inside Chef's House.

## Functional NPC / travel test
Prompt:
I'm in Everbrook and want to get to Omboko. Which NPC handles that route, where are they, and what coin requirement is documented?

Expected:
- Ned the Boat Guy at Everbrook Docks.
- Hold 25 Coins.

## Bank + shop distinction test
Prompt:
In Everbrook, distinguish the East Town Square from the Bank and Fisherman's Shop. Which of those rooms actually contains the documented bed?

Expected:
- East Town Square contains entrances.
- Fisherman's Shop contains a documented bed.
- Bank is a separate interior.

## Thieves Hideout room test
Prompt:
Where are the beds inside Thieves Hideout, and how many are documented?

Expected:
- First interior room named Thieves Hideout.
- 4 documented beds.

## Mystic Vale services test
Prompt:
Where is the documented bed in Mystic Vale? Where are the Magic Shop, General Supply Shop and Unpowered Orb digging location?

## Frostvale beds test
Prompt:
Name every documented Frostvale bed location in this dataset and identify which rooms are cold-safe.

## Navigation uncertainty test
Prompt:
Give me the full internal-room route through the Desert.

Expected:
- State that Desert room coverage is partial.
- Do not invent a route or room adjacency.

## Area vs room test
Prompt:
Is "Ghost Mansion Bank" the same thing as the whole Ghost Mansion area? Explain the hierarchy and list the services documented in the Bank room.

# Entity / relationship graph tests

## Quest-room linking: Sewer Doll
Prompt:
Give me the Sewer Doll quest step-by-step. For each step, name the exact internal room when the dataset has one.

Expected:
- Cemetery -> Sewer Gold Ore -> Cemetery.
- No invented intermediate room.

## Quest-room linking: Mount Frostvale
Prompt:
Where exactly do I go for each Mount Frostvale quest step?

Expected:
- FrostBoot links to Frostvale River.
- Mayor interactions link to Mayor's House.
- Final step spans River and Northern Entrance.

## Partial quest location test
Prompt:
Give me exact room-by-room directions for Desert Island.

Expected:
- Explain that Desert room coverage is partial and most steps are only area-linked.
- Do not invent room IDs.

## Monster-room test
Prompt:
Where exactly are Giant Spiders documented?

Expected:
- `sewer.giant_spiders` and `beach.quicksand_giant_spiders` are exact current room-page links.
- Preserve the bootstrap monster record's broad Sewer area label as a retained cross-source disagreement with the Beach link.

## Monster source conflict test
Prompt:
Where is Seagull?

Expected:
- Bootstrap monster record says Beach.
- Exact current room-page evidence links Seagull to Dock Haven Seagulls / Water Spirit.
- State the disagreement rather than silently overwriting either source.

## Unlinked monster test
Prompt:
Where exactly can I find Dust Devil?

Expected:
- Report the broad source area: Desert.
- Say there is no exact linked room in the current dataset.
- Do not invent a Desert room.

## Resource node test: Gold Ore
Prompt:
List the exact rooms with structured Gold Ore nodes.

Expected:
- Sewer Gold Ore.
- Beach Quicksand Giant Spiders.

## Resource node test: Graphite
Prompt:
Where is Graphite explicitly indexed, and what Mining requirement is attached when documented?

Expected:
- Volcano Graphite Room: Graphite with Mining 70.
- Lava Enchantment Altar also records Graphite, but no extra level is invented for that node.

## Resource node test: Unpowered Orb
Prompt:
Where can I dig Unpowered Orbs and what tool is explicitly documented?

Expected:
- Mystic Vale Orb Pile.
- Shovel.

## Bed uncertainty test
Prompt:
A room has bedCount 0. Does that prove there is no bed?

Expected:
- No.
- `bedStatus=not_documented` means the dataset has not documented a bed there.

# Human Companion v1.6.1 tests

These tests apply to the deployed deterministic human UI rather than an external AI reading the context file.

## Cold-start test
Steps:
1. Clear site/browser data or use **Clear local session**.
2. Reload the Companion.

Expected:
- Knowledge loads normally without requiring saved browser state.
- No player is assumed.
- The assistant remains usable for non-player-specific queries.

## Manual skill-list test
Steps:
1. Open **Enter skill levels**.
2. Inspect the fields.

Expected:
- 18 skill fields.
- Firemaking is present.
- Summoning is absent.
- Unknown skills can be left blank.

## Firemaking readiness regression
Steps:
1. Enter Crafting 5 and Firemaking 30 manually.
2. Ask: `Can I do Healing Torches?`

Expected:
- Crafting 5 is recognized as a skill requirement.
- Firemaking 30 is recognized as a skill requirement.
- `Piece of Paper` and `42 Normal Logs for the initial documented route` are not misclassified as skills; their ownership remains unknown with the current player snapshot.

## Legacy Firemake cache compatibility
Setup:
Use a previously saved v1.6.1 manual snapshot whose skill key is `firemake`, if one exists.

Expected:
- It is displayed/used as Firemaking.
- Opening the manual form shows the saved level in the Firemaking field.
- A subsequent manual save writes the canonical Firemaking field/key.

## Atlas Crown readiness test
Steps:
1. Enter Mining 40 and Crafting 50 manually.
2. Ask: `Can I do Atlas Crown?`

Expected:
- Both known skill requirements pass.
- The Companion does not claim knowledge of inventory, quest completion, access state, procedure or rewards that it does not have.

## Partial manual snapshot test
Steps:
1. Enter only Mining 40.
2. Ask: `Can I do Atlas Crown?`

Expected:
- Mining 40 passes.
- Crafting 50 is reported as unavailable/unknown rather than assumed to be 1 or 0.

## Non-skill requirement parsing test
Prompts after loading any manual snapshot:
- `Can I do Lost Cat?`
- `Can I do Shrimp Sandwich?`
- `Can I do Mount Frostvale?`

Expected:
- Quantities such as `1 Milk Bucket`, `5 Cooked Shrimp`, `100 Oak Logs`, etc. are not interpreted as skill-level requirements.
- Item ownership remains unknown until inventory/bank data exists.

## Same-player refresh-failure test
Steps:
1. Have a snapshot for a username loaded or cached.
2. Trigger a public-profile refresh in an environment where the direct browser fetch fails.

Expected:
- The prior snapshot is retained only for the same username.
- Original snapshot time/source remains visible.
- The UI marks the refresh as failed / levels potentially outdated.

## Cross-player isolation test
Steps:
1. Load or manually enter levels for Player A.
2. Edit the username to Player B before loading Player B.

Expected:
- Player A's levels disappear immediately.
- Player A's levels are never reused for Player B.

## Portable-link test
Steps:
1. Set a username and create/copy the portable link.
2. Inspect/open it in a clean browser context.

Expected:
- Link contains only `#player=<username>`.
- Manual skill levels are not encoded in the URL.
- The destination attempts to load public stats; if unavailable it fails cleanly and offers manual entry.

## Manual snapshot persistence test
Steps:
1. Enter manual skill levels and reload in a browser where localStorage works.

Expected:
- Manual levels may restore from localStorage and remain clearly labelled user-entered/unverified.
- This persistence is a convenience only; clearing storage produces a harmless cold start.

## What-should-I-do-next test
Steps:
1. Load or enter a partial skill snapshot.
2. Ask: `What should I do next?`

Expected:
- Suggestions are deterministic and stats-only.
- Nearby equipment/crafting unlocks may be shown from known levels.
- Skill-ready quests may be shown only from structured skill requirements.
- The Companion explicitly does not pretend to know bank, inventory, equipment, quest completion or access state.

## Combat recommendation guardrail test
Prompt:
What combat level should I be before fighting a gorilla, and what exact DPS will I do?

Expected:
- No exact recommended level or DPS is invented.
- Recorded monster/player facts may be compared.
- Missing combat formulas are stated as the blocker.
