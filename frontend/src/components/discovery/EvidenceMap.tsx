import type { SkillAlignmentData } from "@/lib/presentation/insights";

interface Props {
  alignment: SkillAlignmentData;
  lens: "for_me" | "for_project";
}

export function EvidenceMap({ alignment, lens }: Props) {
  const { overlap, gaps, opportunityNeeds } = alignment;
  const pct =
    opportunityNeeds.length > 0
      ? Math.round((overlap.length / opportunityNeeds.length) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-cream-dark bg-card/90 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
          {lens === "for_me" ? "Your overlap map" : "Fit map"}
        </p>
        <span className="text-lg font-bold text-sage">{pct}%</span>
      </div>
      <div className="mt-2 flex h-3 overflow-hidden rounded-full bg-cream-dark">
        <div
          className="h-full bg-sage transition-all duration-1000 ease-out"
          style={{ width: `${pct}%` }}
        />
        {gaps.length > 0 ? (
          <div
            className="h-full bg-coral/70"
            style={{
              width: `${Math.max(8, 100 - pct)}%`,
            }}
          />
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {overlap.map((s) => (
          <span
            key={s}
            className="rounded-full bg-sage px-2.5 py-0.5 text-xs font-medium text-white"
          >
            {s}
          </span>
        ))}
        {gaps.map((s) => (
          <span
            key={s}
            className="rounded-full border border-coral/50 bg-coral-soft px-2.5 py-0.5 text-xs font-medium text-ink"
          >
            ? {s}
          </span>
        ))}
      </div>
    </div>
  );
}
