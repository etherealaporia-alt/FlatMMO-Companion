# Put These Files at the Repository Root

This ZIP is a repository overlay for the `v2-online` branch of:

`etherealaporia-alt/FlatMMO-Companion`

Extract it, then copy/replace the contents directly into the repository root. Do **not** upload the outer `flatmmo-v2-repo-overlay` folder as a folder.

After placement, the repository should contain paths such as:

- `.github/workflows/update-flatmmo-cache.yml`
- `data/knowledge/monsters.json`
- `data/knowledge/quests.json`
- `data/knowledge/skills.json`
- `data/knowledge/mechanics.json`
- `data/knowledge/areas.json`
- `data/knowledge/equipment.json`
- `data/knowledge/sources.json`
- `data/cache/...`
- `scripts/update-source-cache.mjs`
- `scripts/build-ai-context.mjs`
- `ai/index.html`
- `ai/flatmmo-context.json`
- `ai/flatmmo-context.txt`
- `sitemap.xml`

Your existing root `index.html`, `database.js`, and `README.md` are **not** included, so they will remain untouched.

## GitHub Pages test branch

For immediate testing, configure GitHub Pages to publish from:

- Branch: `v2-online`
- Folder: `/ (root)`

Then the AI page should be available at:

`https://etherealaporia-alt.github.io/FlatMMO-Companion/ai/`

and the JSON at:

`https://etherealaporia-alt.github.io/FlatMMO-Companion/ai/flatmmo-context.json`

## Important robots.txt note

A GitHub Pages *project* site lives below `/FlatMMO-Companion/`. The web standard only recognizes `robots.txt` at the host root (`https://etherealaporia-alt.github.io/robots.txt`), which this repository cannot control unless the Pages setup later uses a custom/root domain. The included `robots.txt` is therefore harmless but should not be relied upon for crawl control on the current project URL. The AI page itself includes `index,follow`, and the sitemap points at the correct project URLs.

## First online refresh

The current monster database is a populated bootstrap mirror. Once the workflow is present in GitHub, manually run:

`Actions` → `Update FlatMMO source cache` → `Run workflow`

on `v2-online` if GitHub permits manual dispatch from that branch. That first successful online run should replace/refine the bootstrap cache from the canonical upstream sources.

After source data changes, run:

`node scripts/build-ai-context.mjs`

to regenerate the AI files from `data/knowledge/*`.

The updater/build automation can be tightened further once the first live run has been tested.
