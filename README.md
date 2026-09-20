# FlatMMO Companion

FlatMMO Companion is a web-only deterministic knowledge and decision assistant for FlatMMO.

Public site:
https://etherealaporia-alt.github.io/FlatMMO-Companion/

AI grounding page:
https://etherealaporia-alt.github.io/FlatMMO-Companion/ai.html

Canonical AI JSON:
https://etherealaporia-alt.github.io/FlatMMO-Companion/flatmmo-context.json

## Current build

The `v2-online` branch is the active development branch. Project data is deliberately kept at the repository root because the mobile maintenance workflow flattens archive directory structures.

The human UI is a deterministic conversational assistant. v1.7 adds a browser-side natural-language interpreter that resolves intent, entities and limited follow-up context before querying the structured FlatMMO knowledge graph. It can answer ordinary phrasing about quests, skills, monsters, areas, rooms, NPCs, resource locations, item sources, travel, requirements and known material calculations. It also retains recent session state with optional/disposable `localStorage`, creates a portable `#player=<username>` link, and performs stats-aware requirement checks using public skill data, explicitly labelled user-entered levels, or temporary levels stated in a question.

The current public-profile loader is interim and may be blocked by normal browser cross-origin policy. It fails cleanly. The player-provider boundary is already isolated so an official player API can replace the loader without redesigning the assistant.

Browser persistence is a convenience, not a dependency. Clearing site data must result in a harmless cold start.

## Current source scope

Included:
- monsters and drops
- 21 named quests in the public context: 19 normalized core records plus 2 conservative observation-backed placeholders
- skills and mechanics
- explicit mechanics/calculation-readiness rules
- areas, rooms, services, NPCs and resource nodes
- equipment, weapons, crafting requirements and production relationships
- monster/quest/location cross-links

Human-side player support:
- username selection
- optional local session persistence
- portable player link
- interim public skill-level/XP loading when browser policy permits
- stats-only requirement and nearby-unlock reasoning
- conversational intent/entity resolution across quests, monsters, skills, areas, rooms, NPCs, resources/items, equipment and mechanics
- short follow-up references such as “it”, “there” and requirement/location follow-ups
- deterministic area-level route finding from explicit world connections
- known production-chain expansion for supported material calculations

Still pending or intentionally incomplete:
- official player API integration for reliable player snapshots
- automatic bank, inventory, equipped gear and quest-completion state
- exact combat hit-chance/damage-resolution formulas
- exact DPS, kill-time, survivability and recommended-level calculations
- Agility level 1–19 Run-step formula
- complete zero-Sleep behavior by activity
- market data
- official news/change-note ingestion

FlatMMO is treated as an independent game. Missing mechanics must never be inferred from RuneScape or other games.

See `flatmmo-sources.json`, `flatmmo-status.json`, `flatmmo-rules.json` and `flatmmo-overrides.json` for provenance, readiness and known limitations.

## Updating and AI access

The knowledge files are manually maintained static snapshots. The GitHub Pages workflow publishes committed files; it does not refresh game data. The official player API/schema is still pending. Public AI retrieval is optional and best-effort; the human assistant works without AI.

The JSON, text and HTML grounding copies contain the same context. Compact quest-step and monster-room arrays have explicit field-order schemas in `flatmmo-context.json`. After changing the context, regenerate both copies and update `aiContextSha256` in `flatmmo-status.json`.

## v1.6 player reliability and manual levels

Use **Enter skill levels** to supply known levels, with or without a username. Leave unknown skills blank. Saving replaces the current snapshot and marks it as user-entered; XP is unknown. The current session works when browser storage is unavailable. Portable links carry only a username, never manual levels.

A failed public-profile refresh retains the previous snapshot only for the same username, with its original timestamp and a warning. Editing the username clears a different player's levels immediately. Late requests cannot overwrite a new player, manual entry, or a cleared session. Successful public-profile loads replace manual levels. Cached manual levels retain their unverified source label.

This update changes player handling, not game mechanics. Official player API integration remains pending.

## v1.6.1 visual polish

The Companion takes visual cues from FlatMMO's public website: charcoal panels, warm brown controls, cream text, green primary buttons and monospace headings. Body text remains readable sans-serif. All styling is local CSS and system fonts; no external art or font downloads are required.

The manual-level dialog keeps its header and action footer outside the scrolling field area. Save and Cancel stay visible within the dialog. Phone widths use two columns, larger inputs and touch targets; dynamic viewport height and safe-area padding help on smaller screens. Real-device keyboard behaviour still needs checking.

The assistant JavaScript and game data are unchanged from v1.6. Player-state logic checks pass. The unpublished preview could not be rendered in cloud Chrome because local-file URLs are blocked; check the deployed layout after upload.


## v1.7 conversational query engine

v1.7 replaces the narrow entity-card dispatcher with a deterministic natural-language query layer. Questions are interpreted as an intent plus one or more structured entities before the answer is composed. The engine indexes monsters, quests, skills, areas, internal rooms, NPCs, resources/items, equipment, mechanics and readiness rules. Supported intents include information, location/acquisition, drops, requirements/readiness, walkthroughs, materials, progression, travel, counts/lists, comparisons and player-aware next-step queries.

Short follow-ups can reuse recent conversational context, so sequences such as `What does a gorilla drop?` followed by `Where is it?` remain on the same subject. A question can also supply temporary levels such as `Mining 40 and Crafting 48`; those values are used for that answer only and do not overwrite the saved player snapshot.

The interpreter remains deterministic and local to the browser. It is not an LLM and does not invent FlatMMO facts. Ambiguous or unsupported questions fall back to a clarification-style response rather than borrowing mechanics from another game. Combat calculations remain gated by the same readiness rules as before.


## v1.7.1 conversational follow-up hotfix

v1.7.1 tightens entity matching and follow-up context. Short entity names now match whole normalized words/phrases, preventing names such as `Bat` from matching inside unrelated words such as `combat`. Elliptical alternative-source follow-ups such as `Any ways other than combat?` can inherit the previous item/resource subject and acquisition intent.

The acquisition index now combines item-specific sources from structured world/resource nodes, crafting and production recipes, quest rewards, explicit item-named NPC shops/trades/services, and monster drops. Generic shop descriptions remain service/location evidence rather than being treated as complete inventories. If only combat sources are recorded for an item, the Companion says that no item-specific non-combat source is currently documented rather than inventing one or claiming none exists in the game.
