// Server-side validator for the /api/recommend payload.
//
// Two things come from the client and end up inside the LLM prompt:
//   1. `answers` — quiz responses. Each entry is an option object
//      { label, value, tags, ... } (or an array of them for multi-select).
//      Options may carry extra UI metadata (description, icon, etc.) — we
//      silently drop unknown fields when reconstructing the clean object.
//   2. `picks`   — scoring-engine tool list. Each pick is an object
//      { name, category, priceTier, description, ... }. Same rule: we only
//      keep the four fields that reach the LLM.
//
// Strict rules still apply to the fields that DO reach the model:
//   - Whitelist top-level answer keys.
//   - Hard length caps on every string.
//   - Regex on `value` / tag fields.
//   - Reject angle brackets / braces in free-text labels (blocks the most
//     common prompt-injection patterns).

const ANSWER_KEYS = new Set([
  "size",
  "industry",
  "tech-comfort",
  "biggest-pain",
  "where-time-goes",
  "current-stack",
  "growth-stage",
  "budget",
  "decision-style",
  "biggest-win",
]);

const SINGLE_KEYS = new Set([
  "size",
  "industry",
  "tech-comfort",
  "where-time-goes",
  "growth-stage",
  "budget",
  "decision-style",
  "biggest-win",
]);

const MULTI_KEYS = new Set(["biggest-pain", "current-stack"]);

const MAX_MULTI = 6;
const MAX_VALUE_LEN = 50;
const MAX_LABEL_LEN = 200;
const MAX_TAG_LEN = 40;
const MAX_TAGS = 8;

const VALUE_RE = /^[a-zA-Z0-9_-]+$/;
const LABEL_RE = /^[^<>{}\\]*$/;

const MAX_PICKS = 20;
const MAX_DESC_LEN = 400;
const MAX_NAME_LEN = 80;
const MAX_CATEGORY_LEN = 60;
const MAX_PRICE_TIER_LEN = 20;

function isPlainObject(x) {
  return x !== null && typeof x === "object" && !Array.isArray(x);
}

function validString(x, max, regex) {
  if (typeof x !== "string") return false;
  if (x.length === 0 || x.length > max) return false;
  if (regex && !regex.test(x)) return false;
  return true;
}

function validateOption(opt) {
  if (!isPlainObject(opt)) return null;
  if (!validString(opt.value, MAX_VALUE_LEN, VALUE_RE)) return null;
  if (!validString(opt.label, MAX_LABEL_LEN, LABEL_RE)) return null;

  // Tags are optional. Drop invalid ones silently rather than rejecting
  // the whole option — the option may carry UI tags we don't care about.
  let tags = [];
  if (Array.isArray(opt.tags)) {
    for (const t of opt.tags.slice(0, MAX_TAGS)) {
      if (validString(t, MAX_TAG_LEN, VALUE_RE)) tags.push(t);
    }
  }

  // Reconstruct a clean object — any extra UI metadata (description,
  // icon, etc.) is dropped here, so it never reaches the LLM.
  return { label: opt.label, value: opt.value, tags };
}

export function validateAnswers(answers) {
  if (!isPlainObject(answers)) {
    return { ok: false, error: "answers must be an object" };
  }

  for (const key of Object.keys(answers)) {
    if (!ANSWER_KEYS.has(key)) {
      return { ok: false, error: `Unknown answer key: ${key}` };
    }
  }

  const cleaned = {};

  for (const key of SINGLE_KEYS) {
    const v = answers[key];
    if (v == null) continue;
    const opt = validateOption(v);
    if (!opt) return { ok: false, error: `Invalid option for ${key}` };
    cleaned[key] = opt;
  }

  for (const key of MULTI_KEYS) {
    const v = answers[key];
    if (v == null) continue;
    if (!Array.isArray(v) || v.length > MAX_MULTI) {
      return { ok: false, error: `Invalid value for ${key}` };
    }
    const opts = [];
    const seen = new Set();
    for (const entry of v) {
      const opt = validateOption(entry);
      if (!opt) return { ok: false, error: `Invalid option in ${key}` };
      if (seen.has(opt.value)) continue;
      seen.add(opt.value);
      opts.push(opt);
    }
    cleaned[key] = opts;
  }

  return { ok: true, answers: cleaned };
}

export function validatePicks(picks) {
  if (picks == null) return { ok: true, picks: [] };
  if (!Array.isArray(picks)) {
    return { ok: false, error: "picks must be an array" };
  }
  if (picks.length > MAX_PICKS) {
    return { ok: false, error: `Too many picks (max ${MAX_PICKS})` };
  }

  const cleaned = [];
  for (const p of picks) {
    if (!isPlainObject(p)) return { ok: false, error: "Invalid pick" };
    if (!validString(p.name, MAX_NAME_LEN, LABEL_RE)) {
      return { ok: false, error: "Invalid pick.name" };
    }
    if (!validString(p.category, MAX_CATEGORY_LEN, LABEL_RE)) {
      return { ok: false, error: "Invalid pick.category" };
    }
    if (!validString(p.priceTier, MAX_PRICE_TIER_LEN, LABEL_RE)) {
      return { ok: false, error: "Invalid pick.priceTier" };
    }
    if (!validString(p.description, MAX_DESC_LEN, LABEL_RE)) {
      return { ok: false, error: "Invalid pick.description" };
    }
    cleaned.push({
      name: p.name,
      category: p.category,
      priceTier: p.priceTier,
      description: p.description,
    });
  }

  return { ok: true, picks: cleaned };
}