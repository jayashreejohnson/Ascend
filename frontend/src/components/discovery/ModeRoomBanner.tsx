import type { ModeCopy } from "@/lib/presentation/modeContent";
import type { ViewerLens } from "@/lib/types";

interface Props {
  copy: ModeCopy;
  lens: ViewerLens;
}

export function ModeRoomBanner({ copy, lens }: Props) {
  return (
    <div
      className={`mb-6 rounded-2xl border px-4 py-3 ${
        lens === "for_me"
          ? "border-coral/25 bg-coral-soft/25"
          : "border-sage/25 bg-sage-soft/30"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
        {lens === "for_me" ? "✨ Mentor mode" : "🔬 Reviewer mode"}
      </p>
      <p className="mt-1 text-sm font-semibold text-ink">{copy.roomTitle}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{copy.roomDescription}</p>
    </div>
  );
}
