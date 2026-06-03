"use client";

import type { DiscoverySignal } from "@/lib/presentation/discoverySignals";
import { signalZoneMeta } from "@/lib/presentation/discoverySignals";

interface Props {
  signal: DiscoverySignal;
  index: number;
  revealed: boolean;
  onReveal?: () => void;
}

function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="mt-3 flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-dark">
        <div
          className="h-full rounded-full bg-gradient-to-r from-coral via-honey to-sage transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold text-ink-muted">{pct}% signal</span>
    </div>
  );
}

export function DiscoveryCard({ signal, index, revealed, onReveal }: Props) {
  const zone = signalZoneMeta(signal.category);

  if (!revealed && onReveal) {
    return (
      <button
        type="button"
        onClick={onReveal}
        className="discovery-card-hidden w-full rounded-2xl border-2 border-dashed border-coral/40 bg-coral-soft/20 px-5 py-8 text-center transition hover:border-coral hover:bg-coral-soft/40 hover:scale-[1.01]"
      >
        <span className="text-2xl" aria-hidden>
          ✨
        </span>
        <p className="mt-2 text-sm font-semibold text-ink">
          Tap to uncover signal #{index + 1}
        </p>
      </button>
    );
  }

  return (
    <article
      className="discovery-card-reveal rounded-2xl border border-cream-dark bg-card p-5 shadow-sm transition hover:shadow-lg hover:-translate-y-0.5"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xl" aria-hidden>
          {signal.icon}
        </span>
        <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
          {zone.zone}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wide text-coral">
          {signal.label}
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold leading-snug text-ink sm:text-lg">
        {signal.headline}
      </h3>
      <p className="mt-3 rounded-xl bg-honey-soft/40 px-3 py-2 text-sm leading-relaxed text-ink">
        <span className="font-semibold text-coral">Why it matters · </span>
        {signal.whyItMatters}
      </p>
      {signal.confidence !== undefined ? (
        <ConfidenceBar value={signal.confidence} />
      ) : null}
    </article>
  );
}
