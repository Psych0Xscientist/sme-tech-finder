export default function TrustpilotBadge({ tool }) {
  if (!tool?.trustScore || !tool?.trustReviews) return null;

  const score = tool.trustScore;
  const colour =
    score >= 4 ? "text-emerald-600" :
    score >= 3 ? "text-amber-500" :
    "text-slate-500";

  return (
    <a
      href={tool.trustUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 mt-1"
    >
      <span className={`${colour} font-semibold`}>★ {score.toFixed(1)}</span>
      <span>·</span>
      <span>{tool.trustReviews.toLocaleString()} reviews on Trustpilot</span>
    </a>
  );
}