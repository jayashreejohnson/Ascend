"use client";

import { useCallback, useEffect, useState } from "react";
import type { DiscoverySignal } from "@/lib/presentation/discoverySignals";
import { DiscoveryCard } from "./DiscoveryCard";

interface Props {
  signals: DiscoverySignal[];
  intro: string;
  autoRevealFirst?: boolean;
}

export function SignalRevealStack({
  signals,
  intro,
  autoRevealFirst = true,
}: Props) {
  const [revealed, setRevealed] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (autoRevealFirst && signals[0]) initial.add(signals[0].id);
    return initial;
  });

  useEffect(() => {
    const initial = new Set<string>();
    if (autoRevealFirst && signals[0]) initial.add(signals[0].id);
    setRevealed(initial);
  }, [signals, autoRevealFirst]);

  const revealNext = useCallback(() => {
    const next = signals.find((s) => !revealed.has(s.id));
    if (next) setRevealed((prev) => new Set(prev).add(next.id));
  }, [signals, revealed]);

  const revealAll = useCallback(() => {
    setRevealed(new Set(signals.map((s) => s.id)));
  }, [signals]);

  if (signals.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-cream-dark px-4 py-8 text-center text-sm text-ink-muted">
        Nothing in this layer for this lens—try switching perspective above.
      </p>
    );
  }

  const hiddenCount = signals.filter((s) => !revealed.has(s.id)).length;

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-ink-muted">{intro}</p>
      <div className="space-y-3">
        {signals.map((signal, index) => (
          <DiscoveryCard
            key={signal.id}
            signal={signal}
            index={index}
            revealed={revealed.has(signal.id)}
            onReveal={
              !revealed.has(signal.id)
                ? () => setRevealed((prev) => new Set(prev).add(signal.id))
                : undefined
            }
          />
        ))}
      </div>
      {hiddenCount > 0 ? (
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={revealNext}
            className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            Reveal next signal ({hiddenCount} left)
          </button>
          <button
            type="button"
            onClick={revealAll}
            className="rounded-full border border-cream-dark bg-card px-4 py-2 text-sm font-medium text-ink transition hover:border-sage"
          >
            Show all
          </button>
        </div>
      ) : null}
    </div>
  );
}
