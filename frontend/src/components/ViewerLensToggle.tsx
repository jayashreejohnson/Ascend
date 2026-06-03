"use client";

import type { ViewerLens } from "@/lib/types";

interface Props {
  lens: ViewerLens;
  onChange: (lens: ViewerLens) => void;
}

export function ViewerLensToggle({ lens, onChange }: Props) {
  return (
    <div
      className="inline-flex rounded-full bg-cream-dark p-1 text-sm"
      role="tablist"
      aria-label="Viewing lens"
    >
      <button
        type="button"
        role="tab"
        aria-selected={lens === "for_me"}
        className={`rounded-full px-4 py-1.5 transition-colors ${
          lens === "for_me"
            ? "bg-card text-ink shadow-sm"
            : "text-ink-muted hover:text-ink"
        }`}
        onClick={() => onChange("for_me")}
      >
        For me
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={lens === "for_project"}
        className={`rounded-full px-4 py-1.5 transition-colors ${
          lens === "for_project"
            ? "bg-card text-ink shadow-sm"
            : "text-ink-muted hover:text-ink"
        }`}
        onClick={() => onChange("for_project")}
      >
        For my project
      </button>
    </div>
  );
}
