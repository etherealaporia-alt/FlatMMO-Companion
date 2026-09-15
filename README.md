# FlatMMO Companion

This is the flat-root `v2-online` development layout.

Public site:
https://etherealaporia-alt.github.io/FlatMMO-Companion/

AI grounding page:
https://etherealaporia-alt.github.io/FlatMMO-Companion/ai.html

Canonical AI JSON:
https://etherealaporia-alt.github.io/FlatMMO-Companion/flatmmo-context.json

## Layout

All project data files are deliberately stored at the repository root to keep the mobile maintenance workflow simple. The existing GitHub Pages deployment workflow under `.github/workflows/deploy-pages.yml` is left unchanged.

The human UI is intentionally minimal while the data/knowledge architecture is being validated.

## Current source scope

Included:
- monsters
- quests
- skills
- mechanics
- areas/locations
- equipment/weapons

Excluded for now:
- official news/change notes
- player profiles/player state
- market data

See `flatmmo-sources.json` and `flatmmo-status.json` for provenance/status.
