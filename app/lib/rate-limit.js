// Per-IP sliding-window rate limiter for the /api/recommend route.
//
// Why in-memory: SWA Functions are serverless. Cold starts reset the Map,
// which means a determined attacker can sometimes get fresh quota by waiting
// for instance recycle. That's fine for a portfolio site — it stops casual
// abuse and bots, which is the realistic threat. For real abuse, swap this
// for Upstash Redis (drop-in replacement, free tier).

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10;          // per IP, per window
const buckets = new Map();        // ip -> [timestamp, timestamp, ...]

function getClientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-azure-clientip") || "unknown";
}

export function checkRateLimit(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const cutoff = now - WINDOW_MS;

  const hits = (buckets.get(ip) || []).filter((t) => t > cutoff);

  if (hits.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((hits[0] + WINDOW_MS - now) / 1000);
    return { ok: false, retryAfter };
  }

  hits.push(now);
  buckets.set(ip, hits);

  if (buckets.size > 1000) {
    for (const [key, arr] of buckets) {
      const live = arr.filter((t) => t > cutoff);
      if (live.length === 0) buckets.delete(key);
      else buckets.set(key, live);
    }
  }

  return { ok: true, remaining: MAX_REQUESTS - hits.length };
}