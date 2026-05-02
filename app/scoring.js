// Scoring engine — takes the user's quiz answers and the catalog,
// returns a list of tools sorted by best match.

import { catalog } from "./catalog";

export function scoreTools(answers) {
  // Pull values out of the answers (handle missing answers safely)
  const size = answers.size?.value || 1;
  const industry = answers.industry?.value;
  const techComfort = answers["tech-comfort"]?.value || 2;
  const budget = answers.budget?.value;
  const decisionStyle = answers["decision-style"]?.value;

  // Combine all pain tags from multi-select answers + tag-bearing single selects
  const painTags = new Set();
  for (const key of Object.keys(answers)) {
    const ans = answers[key];
    if (Array.isArray(ans)) {
      ans.forEach((opt) => opt.tags?.forEach((t) => painTags.add(t)));
    } else if (ans?.tags) {
      ans.tags.forEach((t) => painTags.add(t));
    }
  }

  // Score each tool
  const scored = catalog.map((tool) => {
    let score = 0;
    const reasons = [];

    // 1) Size match (hard filter — score 0 if outside band)
    if (size < tool.minSize || size > tool.maxSize) {
      return { tool, score: 0, reasons: [] };
    }

    // 2) Pain match (the big one)
    const painMatches = tool.painTags.filter((t) => painTags.has(t));
    if (painMatches.length > 0) {
      score += painMatches.length * 10;
      reasons.push(`Helps with ${painMatches.join(", ")}`);
    }

    // 3) Industry match
    if (industry && tool.industryTags.includes(industry)) {
      score += 8;
      reasons.push(`Built for ${industry.replace("-", " ")}`);
    }

    // 4) Tech comfort match (penalise tools above the user's comfort)
    const comfortGap = tool.techComfort - techComfort;
    if (comfortGap <= 0) {
      score += 3;
    } else if (comfortGap === 1) {
      score -= 2;
    } else {
      score -= 6;
    }

    // 5) Budget match
    const tierMap = { Free: 0, Low: 1, Mid: 2, High: 3 };
    const userBudget = { free: 0, low: 1, mid: 2, high: 3 }[budget] ?? 1;
    const toolTier = tierMap[tool.priceTier];
    if (toolTier <= userBudget) {
      score += 2;
    } else {
      score -= (toolTier - userBudget) * 4;
    }

    // 6) Free-tier bonus if user picked "as close to free as possible"
    if (budget === "free" && tool.priceTier === "Free") {
      score += 3;
    }

    // 7) UK brand bonus if that's the decision driver
    if (decisionStyle === "uk-brand" && tool.ukSpecific) {
      score += 4;
      reasons.push("UK-built");
    } else if (tool.ukSpecific) {
      score += 1;
    }

    // 8) Simple bonus if "easy to learn" matters most
    if (decisionStyle === "simple" && tool.techComfort === 1) {
      score += 3;
    }

    return { tool, score, reasons };
  });

  // Sort by score descending, drop zeros
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);
}

// Pick the best tools to show — top N overall, but cap per category
// so the user doesn't see 5 accounting tools and nothing else.
export function topPicks(scored, { maxTotal = 8, maxPerCategory = 2 } = {}) {
  const picks = [];
  const counts = {};
  for (const s of scored) {
    const cat = s.tool.category;
    counts[cat] = counts[cat] || 0;
    if (counts[cat] >= maxPerCategory) continue;
    picks.push(s);
    counts[cat]++;
    if (picks.length >= maxTotal) break;
  }
  return picks;
}