export default function ImpactChip({ impact }) {
  if (!impact?.label || !impact?.sourceUrl) return null;

  const ring =
    impact.confidence === "high"
      ? "ring-emerald-200 hover:ring-emerald-400"
      : "ring-amber-200 hover:ring-amber-400";

  const dot =
    impact.confidence === "high" ? "bg-emerald-500" : "bg-amber-500";

  const tooltip = [
    impact.full,
    impact.sourceCaveat ? `Source: ${impact.sourceCaveat}` : null,
    impact.year ? `Data: ${impact.year}` : null,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <a
      href={impact.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={tooltip}
      className={`inline-flex items-center gap-1.5 bg-white text-xs text-slate-700 hover:text-slate-900 px-2.5 py-1 rounded-full ring-1 ${ring} transition`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
      <span className="font-medium">{impact.label}</span>
      <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}