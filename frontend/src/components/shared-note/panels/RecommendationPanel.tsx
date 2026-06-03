import type { RecommendationLabel } from "@/lib/viewModel";

interface Props {
  recommendation: RecommendationLabel;
  justification: string;
  positive: boolean;
}

export function RecommendationPanel({
  recommendation,
  justification,
  positive,
}: Props) {
  return (
    <div className="panel-enter">
      <div
        className={`rounded-3xl p-6 sm:p-8 ${
          positive
            ? "border border-sage/40 bg-gradient-to-br from-sage-soft/60 to-card shadow-md"
            : "border border-cream-dark bg-card shadow-sm"
        }`}
      >
        <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
          Verdict
        </p>
        <p className="mt-2 text-2xl font-semibold text-ink">{recommendation}</p>
        <p className="mt-4 text-base leading-relaxed text-ink-muted">
          {justification}
        </p>
      </div>
    </div>
  );
}
