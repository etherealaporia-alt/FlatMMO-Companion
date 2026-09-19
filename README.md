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

The human UI is a deterministic conversational assistant. It can query the structured FlatMMO knowledge graph, retain recent session state with optional/disposable `localStorage`, create a portable `#player=<username>` link, and perform stats-aware requirement checks when public player skill data can be loaded.

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
