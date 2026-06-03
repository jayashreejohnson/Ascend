import type { TrailStep } from "@/lib/presentation/conversationTrail";

const PHASE_DOT: Record<TrailStep["phase"], string> = {
  discovery: "bg-sage",
  question: "bg-honey",
  resolution: "bg-coral",
};

const CONFIDENCE_LABEL: Record<NonNullable<TrailStep["confidence"]>, string> = {
  high: "Strong signal",
  medium: "Needs look",
  low: "Unclear",
};

interface Props {
  steps: TrailStep[];
}

export function ConversationTrail({ steps }: Props) {
  return (
    <div className="relative pl-2">
      <div
        className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-sage via-honey to-coral opacity-40"
        aria-hidden
      />
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="relative pl-8 animate-slide-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <span
              className={`absolute left-0 top-3 h-[22px] w-[22px] rounded-full border-2 border-card shadow-sm ${PHASE_DOT[step.phase]}`}
              aria-hidden
            />
            <div className="rounded-2xl border border-cream-dark bg-card p-4 shadow-sm transition hover:border-sage/40 hover:shadow-md">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  {step.label}
                </span>
                {step.confidence ? (
                  <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[10px] font-medium text-ink-muted">
                    {CONFIDENCE_LABEL[step.confidence]}
                  </span>
                ) : null}
              </div>
              <p className="text-sm leading-relaxed text-ink">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
