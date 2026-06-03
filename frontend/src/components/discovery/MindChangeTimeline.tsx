import type { MindShift } from "@/lib/presentation/discoverySignals";

interface Props {
  shifts: MindShift[];
}

export function MindChangeTimeline({ shifts }: Props) {
  if (shifts.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-bold uppercase tracking-widest text-ink-muted">
        What changed our mind
      </h3>
      <ol className="mt-4 space-y-4">
        {shifts.map((shift, i) => (
          <li
            key={shift.id}
            className="relative pl-6 animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <span
              className="absolute left-0 top-2 h-3 w-3 rounded-full bg-coral ring-4 ring-coral-soft"
              aria-hidden
            />
            <div className="rounded-2xl border border-cream-dark bg-gradient-to-r from-cream-dark/30 to-card p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                {shift.trigger}
              </p>
              <p className="mt-2 text-sm text-ink-muted line-through decoration-coral/40">
                {shift.before}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">{shift.after}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
