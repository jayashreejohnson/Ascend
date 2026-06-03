"use client";

import { useState } from "react";
import type { ReasoningStep } from "@/lib/presentation/modeContent";

const TONE_STYLES: Record<
  ReasoningStep["tone"],
  { dot: string; line: string; label: string }
> = {
  neutral: { dot: "bg-ink-muted", line: "bg-ink-muted/30", label: "text-ink-muted" },
  dip: { dot: "bg-coral", line: "bg-coral/40", label: "text-coral" },
  discovery: { dot: "bg-honey", line: "bg-honey/50", label: "text-ink" },
  upgrade: { dot: "bg-sage", line: "bg-sage/50", label: "text-sage" },
  final: { dot: "bg-ink", line: "bg-ink/20", label: "text-ink font-bold" },
};

interface Props {
  steps: ReasoningStep[];
  lens: "for_me" | "for_project";
}

export function ReasoningTimeline({ steps, lens }: Props) {
  const [activeId, setActiveId] = useState<string | null>(
    steps[steps.length - 1]?.id ?? null
  );

  return (
    <div className="rounded-3xl border-2 border-cream-dark bg-gradient-to-b from-card to-honey-soft/20 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
        {lens === "for_me"
          ? "How your recommendation evolved"
          : "How the recommendation evolved"}
      </p>
      <p className="mt-2 font-serif text-xl font-semibold text-ink sm:text-2xl">
        What changed our mind
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Tap each step. Hidden signals are why OfficeHours exists.
      </p>

      <div className="mt-8 flex flex-col items-center">
        {steps.map((step, index) => {
          const style = TONE_STYLES[step.tone];
          const isActive = activeId === step.id;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex w-full max-w-md flex-col items-center">
              <button
                type="button"
                onClick={() => setActiveId(isActive ? null : step.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-center transition-all duration-300 ${
                  isActive
                    ? "border-ink/20 bg-card shadow-lg scale-[1.02]"
                    : "border-transparent bg-card/60 hover:bg-card hover:shadow-md"
                }`}
              >
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${style.label}`}
                >
                  {step.tone === "dip"
                    ? "Setback"
                    : step.tone === "discovery"
                      ? "Discovery"
                      : step.tone === "upgrade"
                        ? "Upgrade"
                        : step.tone === "final"
                          ? "Outcome"
                          : "Start"}
                </span>
                <p className={`mt-1 text-sm font-semibold ${isActive ? "text-ink" : "text-ink-muted"}`}>
                  {step.label}
                </p>
              </button>
              {!isLast ? (
                <div
                  className={`my-1 h-8 w-0.5 ${style.line}`}
                  aria-hidden
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
