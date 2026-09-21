# FlatMMO AI Prototype — GitHub → Cloudflare setup

This package is designed to be added to the **`v2-online`** branch of `etherealaporia-alt/FlatMMO-Companion` without replacing the existing Companion.

## Repository layout after upload

```text
/ai-prototype.html
/CLOUDFLARE-GITHUB-SETUP.md
/CLOUDFLARE-PROTOTYPE-MANIFEST.json
/cloudflare-worker/
  .gitignore
  package.json
  wrangler.jsonc
  /src/
    index.js
```

The existing FlatMMO files remain untouched.

## 1. Upload these files to GitHub

Upload the contents of this package to the **root of `v2-online`**, preserving the `cloudflare-worker/` folder structure.

Do not put any passwords, API tokens or Cloudflare secrets in GitHub.

The prototype page will then be available through GitHub Pages after the normal Pages deployment at approximately:

```text
https://etherealaporia-alt.github.io/FlatMMO-Companion/ai-prototype.html
```

## 2. Connect Cloudflare Workers to the GitHub repository

In Cloudflare:

1. Open **Workers & Pages**.
2. Create/import a Worker from a Git repository, or open the Worker and choose **Settings → Builds → Connect**.
3. Authorize Cloudflare's GitHub integration if prompted.
4. Repository: **`etherealaporia-alt/FlatMMO-Companion`**.
5. Production branch: **`v2-online`**.
6. Root directory: **`cloudflare-worker`**.
7. Build command: **leave blank**.
8. Deploy command: **`npx wrangler deploy`** (the Cloudflare default is fine).
9. Save/deploy.

`wrangler.jsonc` supplies the Worker name, Workers AI binding, model, and data URL. The Worker uses the `AI` binding as `env.AI`; no external model API key is required.

## 3. Add the prototype password as a Cloudflare runtime secret

After the first Worker deployment:

1. Open the deployed Worker.
2. Go to **Settings → Variables & Secrets**.
3. Add a **Secret** named exactly:

```text
PROTOTYPE_TOKEN
```

4. Give it a random password known only to you while this is a private test.
5. Deploy/apply the secret change.

Do **not** add `PROTOTYPE_TOKEN` as a GitHub file, Wrangler `vars` value, or ordinary plaintext variable.

The Worker deliberately fails closed until this secret exists. Opening the Worker URL before configuring it should return a JSON health response with `ready: false` and HTTP 503 rather than exposing an unprotected AI endpoint.

## 4. Check the Worker

Open the Worker's `.workers.dev` URL in a browser.

When configured correctly, the health response should contain:

```json
{
  "ok": true,
  "service": "FlatMMO AI Prototype",
  "protected": true,
  "ready": true
}
```

The response also reports the configured model.

## 5. Open the GitHub Pages prototype

Open:

```text
https://etherealaporia-alt.github.io/FlatMMO-Companion/ai-prototype.html
```

Enter:

- the Cloudflare Worker URL, such as `https://flatmmo-ai-prototype.<subdomain>.workers.dev`
- the same `PROTOTYPE_TOKEN` password you stored in Cloudflare

Enable **Show tool trace** while testing.

The browser stores the Worker URL and prototype password only in that browser's localStorage. The password is never added to the repository by these files.

## What this prototype is testing

The LLM handles ordinary language, references, corrections and tool selection. FlatMMO-specific facts come from deterministic tools reading the current published Companion JSON.

Current tools:

- `search_entities`
- `get_item`
- `find_item_sources`
- `get_monster`
- `get_quest`
- `get_skill`
- `find_route`
- `search_rules`
- `lookup_term`

This deliberately does **not** replace the production conversation engine yet.

## Important deployment note

Because Cloudflare is connected to `v2-online`, future pushes to that branch can trigger a Worker build as well as the existing GitHub Pages workflow. That is expected. The Worker project is isolated by setting its Cloudflare **Root directory** to `cloudflare-worker`.
