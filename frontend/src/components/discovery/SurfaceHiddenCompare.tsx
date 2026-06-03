import type { SurfaceHiddenPair } from "@/lib/presentation/modeContent";

interface Props {
  pairs: SurfaceHiddenPair[];
  lens: "for_me" | "for_project";
}

export function SurfaceHiddenCompare({ pairs, lens }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink-muted">
        {lens === "for_me"
          ? "Important signals about you are often hidden below what recruiters skim first."
          : "Important signals about this candidate are often hidden below the first pass."}
      </p>
      <div className="space-y-3">
        {pairs.map((pair) => (
          <div
            key={pair.id}
            className="grid overflow-hidden rounded-2xl border border-cream-dark bg-card shadow-sm transition hover:shadow-md md:grid-cols-2"
          >
            <div className="border-b border-cream-dark bg-cream-dark/40 px-4 py-4 md:border-b-0 md:border-r">
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-muted">
                Surface signal
              </p>
              <p className="mt-2 text-sm font-medium text-ink-muted line-through decoration-coral/60 decoration-2">
                {pair.surface}
              </p>
            </div>
            <div className="bg-gradient-to-br from-sage-soft/50 to-card px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sage">
                Hidden signal
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">{pair.hidden}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
