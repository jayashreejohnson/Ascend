import type { InsightSnapshotData } from "@/lib/presentation/insights";

interface Props {
  data: InsightSnapshotData;
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-cream-dark/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition hover:border-sage/30 hover:shadow-md">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
        {label}
      </p>
      <p className={`mt-1 text-lg font-semibold tracking-tight ${accent ?? "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}

export function InsightSnapshot({ data }: Props) {
  return (
    <div className="rounded-3xl border border-cream-dark bg-gradient-to-br from-card via-honey-soft/20 to-sage-soft/30 p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold uppercase tracking-widest text-ink-muted">
          Insight Snapshot
        </h2>
        <span className="rounded-full bg-sage/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sage">
          Live read
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric label="Signals matched" value={data.signalsMatched} accent="text-sage" />
        <Metric
          label="Main uncertainty"
          value={data.mainUncertainty}
          accent="text-coral"
        />
        <Metric label="Confidence" value={data.confidence} />
        <Metric
          label="Recommendation"
          value={data.recommendation}
          accent="text-sage"
        />
      </div>
    </div>
  );
}
