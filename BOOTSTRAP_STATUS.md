# FlatMMO Companion — Populated Bootstrap Knowledge Cache

This package is the first populated local knowledge database for the `v2-online` design.

## Included

- **82 monsters** with stats, weaknesses and drop tables
- **19 normalized quest records**
- **18 skill records**
- **20 mechanics records**
- **14 area/location records**
- normalized weapon/equipment progression for swords, scimitars, bows, staves, arrows, armour sets and rings
- source/provenance registry
- the previously designed daily update scaffolding

## Intentionally excluded

- official news/change notes
- player profiles / player state
- market data

## Important bootstrap distinction

The wiki-derived files are **normalized facts and procedures**, not wholesale copies of the wiki prose. They are sufficient for development and AI-context generation without repeatedly querying the wiki.

The current execution environment could not directly resolve `flatmmo.com`, so `monsters.json` could not be pulled live from the canonical endpoint here. The package therefore bootstraps monsters from Dounford-Felipe's MIT-licensed `FlatMMO-Wiki-Extras` mirror, whose updater states that its monster data comes from the game server.

**That monster snapshot must be considered provisional until the first successful online updater run replaces it from:**

`https://flatmmo.com/data/monsters.json`

## Wiki update policy

Liam/Dounford approved the caching approach discussed for the project:
- check `recentchanges` about once per day
- query only since the previous successful check
- retrieve only relevant changed pages
- serve users and AI from our cache

## Known gaps

The wiki says there are 21 quests, but the currently retrievable Quest Summary exposed 19 named rows. This bootstrap stores those 19 and preserves the discrepancy instead of inventing missing quests.

A few individual wiki pages also returned interstitial/internal-error responses in this browsing environment. Their category/source is retained and they are marked for enrichment on the first canonical refresh.

## Development rule

During design/testing, use `data/knowledge/*.json` as the source of truth instead of going back to the wiki unless:
1. a required fact is absent,
2. a fact is explicitly marked uncertain/partial, or
3. we are testing the updater itself.
