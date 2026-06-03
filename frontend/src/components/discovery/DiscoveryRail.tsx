"use client";

import type { ModeSection, ModeSectionId } from "@/lib/presentation/modeSections";

interface Props {
  sections: ModeSection[];
  active: ModeSectionId;
  unlocked: Set<ModeSectionId>;
  pathLabel: string;
  onSelect: (id: ModeSectionId) => void;
}

export function DiscoveryRail({
  sections,
  active,
  unlocked,
  pathLabel,
  onSelect,
}: Props) {
  return (
    <nav className="flex flex-col gap-2" aria-label={pathLabel}>
      {sections.map((section, index) => {
        const isActive = active === section.id;
        const wasExplored = unlocked.has(section.id);

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onSelect(section.id)}
            className={`relative w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
              isActive
                ? "border-ink/15 bg-card shadow-md ring-2 ring-coral/15 scale-[1.02]"
                : "border-cream-dark bg-card/70 hover:border-sage/40 hover:bg-card hover:shadow-sm"
            }`}
          >
            <span className="flex items-start gap-3">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  isActive ? "bg-ink text-cream" : "bg-cream-dark text-ink-muted"
                }`}
              >
                {index + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-ink">{section.title}</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-ink-muted">
                  {section.tagline}
                </span>
              </span>
              {wasExplored && !isActive ? (
                <span className="text-sage text-xs font-bold">✓</span>
              ) : null}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
