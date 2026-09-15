# CLEAN REGEN — EXACT REPOSITORY STEPS

This package is intentionally completely flat. Your phone's extractor flattening files is now the expected behaviour.

## Current v2-online branch state reviewed before generation

The branch currently contains:
- `.github/workflows/deploy-pages.yml`
- `AI_TEST_PROMPTS.md`
- `BOOTSTRAP_STATUS.md`
- `PUT_IN_REPO_ROOT.md`
- `README.md`
- `database.js`
- `flatmmo-context.txt`
- `index.html`
- `robots.txt`
- `sitemap.xml`

## Leave this existing file/folder alone

- `.github/workflows/deploy-pages.yml`

It is already working and successfully deploys GitHub Pages from `v2-online`.

## Delete these obsolete files

- `BOOTSTRAP_STATUS.md`
- `PUT_IN_REPO_ROOT.md`
- `database.js`

## Replace these existing files with the regenerated versions in this package

- `AI_TEST_PROMPTS.md`
- `README.md`
- `flatmmo-context.txt`
- `index.html`
- `robots.txt`
- `sitemap.xml`

## Add these new files from this package

- `ai.html`
- `flatmmo-context.json`
- `flatmmo-monsters.json`
- `flatmmo-quests.json`
- `flatmmo-skills.json`
- `flatmmo-mechanics.json`
- `flatmmo-areas.json`
- `flatmmo-equipment.json`
- `flatmmo-sources.json`
- `flatmmo-status.json`
- `llms.txt`

## Expected clean root afterwards

`.github/` remains as the one existing folder. Everything else in this build is a root-level file.

Do not upload the ZIP itself to GitHub. Extract it locally, then upload/replace the files inside it at the repository root.
