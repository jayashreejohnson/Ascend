import type { SkillAlignmentData } from "@/lib/presentation/insights";

interface Props {
  data: SkillAlignmentData;
}

function Chip({
  label,
  variant,
}: {
  label: string;
  variant: "bring" | "need" | "overlap" | "gap";
}) {
  const styles = {
    bring: "bg-sage-soft/80 text-ink border-sage/30",
    need: "bg-honey-soft/80 text-ink border-honey/40",
    overlap: "bg-sage text-white border-sage shadow-sm",
    gap: "bg-coral-soft text-ink border-coral/50",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium transition hover:scale-105 ${styles[variant]}`}
    >
      {label}
    </span>
  );
}

export function SkillAlignment({ data }: Props) {
  const { studentBrings, opportunityNeeds, overlap, gaps } = data;
  const matchPct =
    opportunityNeeds.length > 0
      ? Math.round((overlap.length / opportunityNeeds.length) * 100)
      : 0;

  return (
    <div className="rounded-3xl border border-cream-dark bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-ink">Signal alignment</h3>
          <p className="text-sm text-ink-muted">
            What they bring vs what the opportunity needs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-24 overflow-hidden rounded-full bg-cream-dark">
            <div
              className="h-full rounded-full bg-sage transition-all duration-700 ease-out"
              style={{ width: `${matchPct}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-sage">{matchPct}% overlap</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-sage/20 bg-sage-soft/20 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-sage">
            Student brings
          </p>
          <div className="flex flex-wrap gap-2">
            {studentBrings.map((s) => (
              <Chip key={s} label={s} variant="bring" />
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-honey/30 bg-honey-soft/30 p-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-honey">
            Opportunity needs
          </p>
          <div className="flex flex-wrap gap-2">
            {opportunityNeeds.map((s) => (
              <Chip
                key={s}
                label={s}
                variant={overlap.some((o) => o.toLowerCase() === s.toLowerCase()) ? "overlap" : "need"}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-cream-dark pt-4">
        {overlap.length > 0 ? (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-sage">
              Overlap
            </p>
            <div className="flex flex-wrap gap-2">
              {overlap.map((s) => (
                <Chip key={`o-${s}`} label={s} variant="overlap" />
              ))}
            </div>
          </div>
        ) : null}
        {gaps.length > 0 ? (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-coral">
              Gaps
            </p>
            <div className="flex flex-wrap gap-2">
              {gaps.map((s) => (
                <Chip key={`g-${s}`} label={s} variant="gap" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
