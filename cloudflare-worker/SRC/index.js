const MAX_TOOL_ROUNDS = 6;
const MAX_MESSAGES = 24;
const MAX_CONTENT = 5000;

const SYSTEM_PROMPT = `You are the conversational interface for FlatMMO Companion.

Your job is to understand ordinary human language and hold a natural conversation. You are NOT an authority on FlatMMO mechanics.

HARD RULES:
- Any FlatMMO-specific factual claim must come from the provided tools or from a tool result already present in this request.
- Do not infer FlatMMO mechanics from RuneScape, OSRS, Melvor Idle, WoW, or any other game.
- Foreign games may be discussed as comparisons, but the FlatMMO side of a comparison must be checked with tools.
- Never invent requirements, recipes, drop rates, locations, routes, prices, quest steps, combat formulas, unlocks, or player state.
- Missing or absent data means "not documented in the current Companion data", not "does not exist in FlatMMO".
- Exact combat hit chance, damage rolls, DPS, kill time, survivability, and generic recommended combat levels are unresolved unless a tool explicitly returns them.
- If a name is ambiguous, use search_entities and either resolve from context or ask a short clarification.
- Prefer re-checking a FlatMMO fact with a tool rather than trusting your general model memory.
- General English or genre explanations that do not assert FlatMMO-specific facts may be answered directly.

CONVERSATION:
- Follow pronouns, corrections, topic switches, implied subjects, and colloquial English naturally.
- Treat explicit corrections as authoritative: "not Bat, Gorilla", "the pickpocket one", "actually Coal Ore".
- Do not narrate memory or implementation details.
- Be concise for simple questions and explain more when the player asks.
- If the user gives a level, use it only as user-provided state unless the current request clearly says it is hypothetical.
- When a requested conclusion cannot be supported by the available FlatMMO data, say what is missing rather than guessing.

STYLE:
Sound like a knowledgeable player sitting beside the user: plain, calm, mildly informal, and comfortable saying "I don't know".`;

const TOOLS = [
  {
    name: "search_entities",
    description: "Search current FlatMMO Companion data for items, monsters, quests, skills, and areas by player wording. Use this to resolve names or ambiguity before factual lookup.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string", description: "The player's name or phrase to resolve." },
        types: { type: "array", items: { type: "string", enum: ["item","monster","quest","skill","area"] }, description: "Optional entity types to restrict the search." }
      },
      required: ["query"]
    }
  },
  {
    name: "get_item",
    description: "Return the authoritative current Companion record for one FlatMMO item, including documented acquisition routes and structured uses.",
    parameters: {
      type: "object",
      properties: {
        item: { type: "string", description: "Canonical item name or item id." }
      },
      required: ["item"]
    }
  },
  {
    name: "find_item_sources",
    description: "Find documented acquisition routes for one FlatMMO item and apply explicit player constraints conservatively.",
    parameters: {
      type: "object",
      properties: {
        item: { type: "string" },
        include_methods: { type: "array", items: { type: "string" }, description: "Optional acquisition types such as pickpocket, shop, monster_drop, farming, production, smelting, quest_reward." },
        exclude_combat: { type: "boolean" },
        exclude_stealing: { type: "boolean" },
        exclude_quests: { type: "boolean" },
        area: { type: "string", description: "Optional area name." },
        player_levels: { type: "object", additionalProperties: { type: "number" }, description: "User-provided skill levels relevant to access checks." }
      },
      required: ["item"]
    }
  },
  {
    name: "get_monster",
    description: "Return one monster's documented FlatMMO stats, area, room links, and drops.",
    parameters: {
      type: "object",
      properties: { monster: { type: "string" } },
      required: ["monster"]
    }
  },
  {
    name: "get_quest",
    description: "Return one quest's documented requirements, procedure, locations, and rewards.",
    parameters: {
      type: "object",
      properties: { quest: { type: "string" } },
      required: ["quest"]
    }
  },
  {
    name: "get_skill",
    description: "Return the current Companion record for one official FlatMMO skill.",
    parameters: {
      type: "object",
      properties: { skill: { type: "string" } },
      required: ["skill"]
    }
  },
  {
    name: "find_route",
    description: "Find a documented directed route between FlatMMO areas using current area connection data. Requirements are reported as requirements, not assumed costs.",
    parameters: {
      type: "object",
      properties: {
        from: { type: "string" },
        to: { type: "string" }
      },
      required: ["from","to"]
    }
  },
  {
    name: "search_rules",
    description: "Search documented FlatMMO mechanics/rules for a concept such as Sleep Points, Run, combat defence, progression, or other recorded rules.",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"]
    }
  },
  {
    name: "lookup_term",
    description: "Look up a curated FlatMMO/community term or English interpretation entry. This explains terminology only and is not mechanics authority.",
    parameters: {
      type: "object",
      properties: { term: { type: "string" } },
      required: ["term"]
    }
  }
];

function json(data, status = 200, origin = "*") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-headers": "content-type, authorization",
      "access-control-allow-methods": "POST, OPTIONS",
      "vary": "Origin"
    }
  });
}

function allowedOrigin(origin) {
  if (!origin) return "*";
  if (origin === "https://etherealaporia-alt.github.io") return origin;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  return null;
}

function norm(v) {
  return String(v ?? "").toLowerCase().replace(/[_-]+/g, " ").replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function titleId(v) {
  return String(v ?? "").split("_").map(x => x ? x[0].toUpperCase() + x.slice(1) : x).join(" ");
}

function compactSource(a) {
  const out = { type: a.type };
  for (const k of ["monster","victim","stall","chest","shop","area","location","skill","level","price","priceText","currency","min","max","rarity","rarityDenominator","quantity","outputQuantity","oneTime","quest","npc","service","bundle","milestoneTasks","source","authority","confidence"]) {
    if (a[k] !== undefined && a[k] !== null) out[k] = a[k];
  }
  if (a.materials) out.materials = a.materials;
  if (a.requirements) out.requirements = a.requirements;
  return out;
}

async function loadData(env, file) {
  const base = String(env.DATA_BASE || "https://etherealaporia-alt.github.io/FlatMMO-Companion/").replace(/\/+$/, "") + "/";
  const res = await fetch(base + file, { cf: { cacheTtl: 300, cacheEverything: true } });
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
  return res.json();
}

function bestRecord(records, query) {
  const q = norm(query);
  let best = null, bestScore = -1;
  for (const r of records || []) {
    const names = [r.id, r.name, ...(r.aliases || [])].filter(Boolean);
    let score = 0;
    for (const n of names) {
      const x = norm(n);
      if (!x) continue;
      if (x === q) score = Math.max(score, 1000);
      else if (x.startsWith(q) || q.startsWith(x)) score = Math.max(score, 700 - Math.abs(x.length - q.length));
      else if (x.includes(q) || q.includes(x)) score = Math.max(score, 500 - Math.abs(x.length - q.length));
      else {
        const qt = new Set(q.split(" ")), xt = new Set(x.split(" "));
        const shared = [...qt].filter(t => xt.has(t)).length;
        if (shared) score = Math.max(score, shared * 80);
      }
    }
    if (score > bestScore) { bestScore = score; best = r; }
  }
  return bestScore >= 80 ? best : null;
}

function routeAccessible(route, levels = {}) {
  if (!route.skill || route.level == null) return { status: "unknown_or_no_skill_gate" };
  const lookup = Object.entries(levels).find(([k]) => norm(k) === norm(route.skill));
  if (!lookup) return { status: "unknown", requirement: `${route.skill} ${route.level}` };
  const supplied = Number(lookup[1]);
  if (!Number.isFinite(supplied)) return { status: "unknown", requirement: `${route.skill} ${route.level}` };
  return { status: supplied >= Number(route.level) ? "met" : "not_met", requirement: `${route.skill} ${route.level}`, supplied };
}

async function searchEntities(env, args) {
  const wanted = new Set(args.types || ["item","monster","quest","skill","area"]);
  const files = {
    item: "flatmmo-items.json", monster: "flatmmo-monsters.json", quest: "flatmmo-quests.json",
    skill: "flatmmo-skills.json", area: "flatmmo-areas.json"
  };
  const results = [];
  for (const [type, file] of Object.entries(files)) {
    if (!wanted.has(type)) continue;
    const data = await loadData(env, file);
    const q = norm(args.query);
    for (const r of data.records || []) {
      const names = [r.name, r.id, ...(r.aliases || [])].filter(Boolean);
      let score = 0;
      for (const n of names) {
        const x = norm(n);
        if (x === q) score = Math.max(score, 1000);
        else if (x.startsWith(q) || q.startsWith(x)) score = Math.max(score, 700 - Math.abs(x.length - q.length));
        else if (x.includes(q) || q.includes(x)) score = Math.max(score, 500 - Math.abs(x.length - q.length));
        else {
          const shared = q.split(" ").filter(t => x.split(" ").includes(t)).length;
          score = Math.max(score, shared * 80);
        }
      }
      if (score >= 80) results.push({ id: r.id, type, name: r.name, score });
    }
  }
  return { query: args.query, results: results.sort((a,b) => b.score - a.score).slice(0,12) };
}

async function getItem(env, args) {
  const data = await loadData(env, "flatmmo-items.json");
  const r = bestRecord(data.records, args.item);
  if (!r) return { found: false, item: args.item };
  return {
    found: true,
    item: { id: r.id, name: r.name, categories: r.categories || [], acquisition: (r.acquisition || []).map(compactSource), uses: r.uses || [] },
    note: "Acquisition methods are additive. Missing methods mean not documented in this snapshot, not proven absent from the game."
  };
}

async function findItemSources(env, args) {
  const data = await loadData(env, "flatmmo-items.json");
  const r = bestRecord(data.records, args.item);
  if (!r) return { found: false, item: args.item, routes: [] };
  let routes = (r.acquisition || []).slice();
  const include = new Set((args.include_methods || []).map(norm));
  if (include.size) routes = routes.filter(x => include.has(norm(x.type)));
  if (args.exclude_combat) routes = routes.filter(x => x.type !== "monster_drop");
  if (args.exclude_stealing) routes = routes.filter(x => !["pickpocket","stall","map_chest","rogue_chest"].includes(x.type));
  if (args.exclude_quests) routes = routes.filter(x => x.type !== "quest_reward");
  if (args.area) routes = routes.filter(x => norm(x.area || x.location || "").includes(norm(args.area)));
  return {
    found: true,
    item: { id: r.id, name: r.name },
    routes: routes.map(x => ({ ...compactSource(x), access_from_supplied_levels: routeAccessible(x, args.player_levels || {}) })),
    unknowns: ["A listed skill unlock does not establish success probability unless a separate rule states it.", "Unlisted acquisition methods are not proven absent from FlatMMO."]
  };
}

async function getMonster(env, args) {
  const data = await loadData(env, "flatmmo-monsters.json");
  const r = bestRecord(data.records, args.monster);
  if (!r) return { found: false, monster: args.monster };
  return {
    found: true,
    monster: {
      id: r.id, name: r.name, area: r.area, boss: !!r.boss,
      stats: { damage: r.damage, accuracy: r.accuracy, defence: r.defence, magic_defence: r.magic_defence, hp: r.hp, weakness: r.weakness },
      drops: (r.drops || []).map(d => ({ item: titleId(d.item), min: d.min, max: d.max, rarityDenominator: d.rarity_denominator, unique: !!d.unique })),
      rooms: (r.roomRefs || []).map(x => ({ roomId: x.roomId, relation: x.relation, confidence: x.confidence }))
    }
  };
}

async function getQuest(env, args) {
  const data = await loadData(env, "flatmmo-quests.json");
  const r = bestRecord(data.records, args.quest);
  if (!r) return { found: false, quest: args.quest };
  return { found: true, quest: { id: r.id, name: r.name, difficulty: r.difficulty, locations: r.locations || [], requirements: r.requirements || [], rewards: r.rewards || [], procedure: r.procedure || [], source: r.source } };
}

async function getSkill(env, args) {
  const data = await loadData(env, "flatmmo-skills.json");
  const r = bestRecord(data.records, args.skill);
  if (!r) return { found: false, skill: args.skill };
  return { found: true, skill: r };
}

async function findRoute(env, args) {
  const data = await loadData(env, "flatmmo-areas.json");
  const from = bestRecord(data.records, args.from), to = bestRecord(data.records, args.to);
  if (!from || !to) return { found: false, from: args.from, to: args.to, reason: "Could not resolve one or both area names." };
  const byName = new Map((data.records || []).map(a => [norm(a.name), a]));
  const queue = [{ area: from, steps: [] }], seen = new Set([norm(from.name)]);
  while (queue.length) {
    const cur = queue.shift();
    if (norm(cur.area.name) === norm(to.name)) return { found: true, from: from.name, to: to.name, steps: cur.steps };
    for (const e of cur.area.externalConnections || []) {
      const next = byName.get(norm(e.area));
      if (!next || seen.has(norm(next.name))) continue;
      seen.add(norm(next.name));
      queue.push({ area: next, steps: [...cur.steps, { from: cur.area.name, to: next.name, method: e.method, fromRoom: e.fromRoom || null, requirements: e.requirements || [] }] });
    }
  }
  return { found: false, from: from.name, to: to.name, reason: "No directed route is documented in the current area graph." };
}

async function searchRules(env, args) {
  const [rules, mechanics] = await Promise.all([loadData(env, "flatmmo-rules.json"), loadData(env, "flatmmo-mechanics.json")]);
  const q = norm(args.query), rows = [];
  for (const r of rules.rules || []) {
    const hay = norm([r.id, r.name, ...(r.facts || []), ...(r.notes || [])].join(" "));
    const shared = q.split(" ").filter(t => hay.includes(t)).length;
    if (hay.includes(q) || shared) rows.push({ type: "rule", id: r.id, name: r.name, status: r.status, facts: r.facts || [], notes: r.notes || [], sources: r.sources || [], score: (hay.includes(q)?20:0)+shared });
  }
  for (const r of mechanics.records || []) {
    const hay = norm(JSON.stringify(r));
    const shared = q.split(" ").filter(t => hay.includes(t)).length;
    if (hay.includes(q) || shared) rows.push({ type: "mechanic", id: r.id, name: r.name, record: r, score: (hay.includes(q)?20:0)+shared });
  }
  return { query: args.query, results: rows.sort((a,b) => b.score-a.score).slice(0,8) };
}

async function lookupTerm(env, args) {
  const data = await loadData(env, "flatmmo-language.json");
  const q = norm(args.term), results = [];
  for (const e of data.flatmmoTerms || []) {
    if ((e.forms || []).some(f => norm(f) === q || norm(f).includes(q) || q.includes(norm(f)))) results.push({ class: e.class, term: e.forms?.[0] || e.id, definition: e.definition, mechanicsAuthority: false, evidence: e.evidence || [] });
  }
  for (const e of data.englishColloquialisms || []) {
    if ((e.forms || []).some(f => norm(f) === q)) results.push({ class: "english_colloquial", term: args.term, semantic: e.semantic, mechanicsAuthority: false });
  }
  return { term: args.term, results: results.slice(0,8) };
}

async function executeTool(env, name, args) {
  switch (name) {
    case "search_entities": return searchEntities(env, args);
    case "get_item": return getItem(env, args);
    case "find_item_sources": return findItemSources(env, args);
    case "get_monster": return getMonster(env, args);
    case "get_quest": return getQuest(env, args);
    case "get_skill": return getSkill(env, args);
    case "find_route": return findRoute(env, args);
    case "search_rules": return searchRules(env, args);
    case "lookup_term": return lookupTerm(env, args);
    default: return { error: "unknown_tool", name };
  }
}

function normalizeAi(raw) {
  const msg = raw?.choices?.[0]?.message;
  if (msg) {
    const calls = (msg.tool_calls || []).map(c => ({ name: c.function?.name || c.name, arguments: c.function?.arguments || c.arguments || {} }));
    return { content: msg.content || "", tool_calls: calls };
  }
  return { content: raw?.response || raw?.content || "", tool_calls: raw?.tool_calls || [] };
}

function cleanMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter(m => m && ["user","assistant"].includes(m.role) && typeof m.content === "string")
    .slice(-MAX_MESSAGES)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CONTENT) }));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const corsOrigin = allowedOrigin(origin);
    if (!corsOrigin) return new Response("Origin not allowed", { status: 403 });
    if (request.method === "OPTIONS") return json({ ok: true }, 200, corsOrigin);

    // A simple browser-visible health check makes Git-connected deployment easier to verify.
    if (request.method === "GET") {
      return json({
        ok: true,
        service: "FlatMMO AI Prototype",
        model: env.MODEL || "@cf/zai-org/glm-4.7-flash",
        protected: Boolean(env.PROTOTYPE_TOKEN),
        ready: Boolean(env.PROTOTYPE_TOKEN)
      }, env.PROTOTYPE_TOKEN ? 200 : 503, corsOrigin);
    }
    if (request.method !== "POST") return json({ error: "POST only" }, 405, corsOrigin);

    // Fail closed. A Git deployment must never become an unauthenticated public AI relay
    // just because the prototype secret has not been configured yet.
    const expected = env.PROTOTYPE_TOKEN;
    if (!expected) {
      return json({
        error: "prototype_not_configured",
        message: "PROTOTYPE_TOKEN has not been configured in Cloudflare runtime secrets yet."
      }, 503, corsOrigin);
    }
    const auth = request.headers.get("Authorization") || "";
    if (auth !== `Bearer ${expected}`) return json({ error: "unauthorized" }, 401, corsOrigin);

    let body;
    try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400, corsOrigin); }
    const history = cleanMessages(body.messages);
    if (!history.length || history[history.length - 1].role !== "user") return json({ error: "messages must end with a user message" }, 400, corsOrigin);

    const model = env.MODEL || "@cf/zai-org/glm-4.7-flash";
    const working = [{ role: "system", content: SYSTEM_PROMPT }, ...history];
    const trace = [];

    try {
      for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
        const raw = await env.AI.run(model, {
          messages: working,
          tools: TOOLS,
          parallel_tool_calls: false,
          max_completion_tokens: 500,
          temperature: 0.2
        });
        const ai = normalizeAi(raw);
        const call = ai.tool_calls?.[0];
        if (!call) {
          const answer = ai.content || "I couldn't form an answer from the available FlatMMO data.";
          return json({ answer, model, toolTrace: body.debug ? trace : undefined }, 200, corsOrigin);
        }

        let args = call.arguments;
        if (typeof args === "string") {
          try { args = JSON.parse(args); } catch { args = {}; }
        }
        const toolResult = await executeTool(env, call.name, args || {});
        trace.push({ tool: call.name, arguments: args || {}, result: toolResult });

        // Cloudflare's documented traditional tool loop accepts an assistant turn
        // describing the selected tool followed by a tool result turn.
        working.push({ role: "assistant", content: JSON.stringify({ name: call.name, arguments: args || {} }) });
        working.push({ role: "tool", content: JSON.stringify(toolResult) });
      }
      return json({ error: "tool_loop_limit", message: "The model requested too many tool calls for one reply.", toolTrace: body.debug ? trace : undefined }, 502, corsOrigin);
    } catch (err) {
      return json({ error: "ai_error", message: String(err?.message || err), toolTrace: body.debug ? trace : undefined }, 502, corsOrigin);
    }
  }
};
