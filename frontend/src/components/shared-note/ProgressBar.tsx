interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-dark">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sage via-honey to-coral transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-medium text-ink-muted">
        {current} of {total} explored
      </span>
    </div>
  );
}
