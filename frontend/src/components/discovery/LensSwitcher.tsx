"use client";

import type { ViewerLens } from "@/lib/types";

interface Props {
  lens: ViewerLens;
  onChange: (lens: ViewerLens) => void;
}

export function LensSwitcher({ lens, onChange }: Props) {
  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-2xl border border-cream-dark bg-card/80 p-1.5 shadow-inner"
      role="tablist"
      aria-label="Choose product mode"
    >
      <button
        type="button"
        role="tab"
        aria-selected={lens === "for_me"}
        onClick={() => onChange("for_me")}
        className={`rounded-xl px-4 py-3 text-left transition-all duration-300 ${
          lens === "for_me"
            ? "bg-gradient-to-br from-coral to-coral/80 text-white shadow-lg scale-[1.02]"
            : "text-ink-muted hover:bg-cream-dark/50"
        }`}
      >
        <span className="block text-sm font-bold">For me</span>
        <span
          className={`mt-0.5 block text-[10px] leading-tight ${
            lens === "for_me" ? "text-white/90" : ""
          }`}
        >
          Signal coach · mentor · your next moves
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={lens === "for_project"}
        onClick={() => onChange("for_project")}
        className={`rounded-xl px-4 py-3 text-left transition-all duration-300 ${
          lens === "for_project"
            ? "bg-gradient-to-br from-sage to-sage/85 text-white shadow-lg scale-[1.02]"
            : "text-ink-muted hover:bg-cream-dark/50"
        }`}
      >
        <span className="block text-sm font-bold">For my project</span>
        <span
          className={`mt-0.5 block text-[10px] leading-tight ${
            lens === "for_project" ? "text-white/90" : ""
          }`}
        >
          Reviewer workspace · assess · decide
        </span>
      </button>
    </div>
  );
}
