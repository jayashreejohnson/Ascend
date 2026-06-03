"use client";

import type { ExploreSection, ExploreSectionId } from "@/lib/presentation/sections";

interface Props {
  sections: ExploreSection[];
  active: ExploreSectionId;
  disabledIds?: ExploreSectionId[];
  explored: Set<ExploreSectionId>;
  onSelect: (id: ExploreSectionId) => void;
}

export function ExploreNav({
  sections,
  active,
  disabledIds = [],
  explored,
  onSelect,
}: Props) {
  return (
    <nav aria-label="Explore sections" className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {sections.map((section) => {
          const isActive = active === section.id;
          const isDisabled = disabledIds.includes(section.id);
          const wasExplored = explored.has(section.id);

          return (
            <button
              key={section.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(section.id)}
              className={`shrink-0 rounded-2xl border px-4 py-3 text-left transition-all duration-200 ${
                isActive
                  ? "border-coral/50 bg-card shadow-md scale-[1.02]"
                  : isDisabled
                    ? "cursor-not-allowed border-cream-dark/60 bg-cream-dark/30 opacity-50"
                    : "border-cream-dark bg-card/60 hover:border-sage/40 hover:bg-card hover:shadow-sm"
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    wasExplored ? "bg-sage" : "bg-cream-dark"
                  }`}
                  aria-hidden
                />
                <span className="text-sm font-semibold text-ink">
                  {section.shortLabel}
                </span>
              </span>
              <span className="mt-0.5 block text-[10px] text-ink-muted">
                {section.description}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
