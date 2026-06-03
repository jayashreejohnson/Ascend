"use client";

import type { ReactNode } from "react";
import type { SharedNotePayload } from "@/lib/types";
import type { ForMeSectionId } from "@/lib/presentation/modeSections";
import type { ModeSection } from "@/lib/presentation/modeSections";
import type { RecommendationLabel } from "@/lib/viewModel";
import type { ReasoningStep, SurfaceHiddenPair } from "@/lib/presentation/modeContent";
import { ReasoningTimeline } from "./ReasoningTimeline";
import { SurfaceHiddenCompare } from "./SurfaceHiddenCompare";
import { SuggestedNextStep } from "../shared-note/SuggestedNextStep";

interface Props {
  section: ModeSection;
  sectionId: ForMeSectionId;
  note: SharedNotePayload;
  standOut: string[];
  concerns: string[];
  hiddenValuable: string[];
  likelyAsked: string[];
  improveActions: string[];
  surfaceHidden: SurfaceHiddenPair[];
  timeline: ReasoningStep[];
  recommendation: RecommendationLabel;
  positive: boolean;
}

function SectionHeader({ section }: { section: ModeSection }) {
  return (
    <header className="mb-6">
      <h2 className="text-xl font-bold text-ink sm:text-2xl">{section.title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{section.tagline}</p>
    </header>
  );
}

function YouBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-xl border border-sage/20 bg-sage-soft/25 px-4 py-3 text-sm text-ink">
      <span className="text-sage font-bold" aria-hidden>
        →
      </span>
      <span>{children}</span>
    </li>
  );
}

export function ForMeModePanel({
  section,
  sectionId,
  note,
  standOut,
  concerns,
  hiddenValuable,
  likelyAsked,
  improveActions,
  surfaceHidden,
  timeline,
  recommendation,
  positive,
}: Props) {
  const { project } = note;

  return (
    <div className="panel-enter min-h-[260px]">
      <SectionHeader section={section} />

      {sectionId === "stand-out" && (
        <ul className="space-y-3">
          {standOut.map((item) => (
            <YouBullet key={item}>
              <strong className="text-ink">Your evidence:</strong> {item}
            </YouBullet>
          ))}
        </ul>
      )}

      {sectionId === "surface-hidden" && (
        <SurfaceHiddenCompare pairs={surfaceHidden} lens="for_me" />
      )}

      {sectionId === "hidden-valuable" && (
        <ul className="space-y-3">
          {hiddenValuable.map((item) => (
            <YouBullet key={item}>
              You might not have led with this—but <strong>your signal</strong> is
              stronger here: {item}
            </YouBullet>
          ))}
        </ul>
      )}

      {sectionId === "reviewer-questions" && (
        <ul className="space-y-3">
          {concerns.length > 0 ? (
            concerns.map((item) => (
              <li
                key={item}
                className="rounded-xl border-l-4 border-coral bg-coral-soft/30 px-4 py-3 text-sm text-ink"
              >
                <span className="font-semibold">Reviewers might question: </span>
                {item}
              </li>
            ))
          ) : (
            <p className="text-sm text-ink-muted">
              No major concerns flagged—you're in a strong position for this read.
            </p>
          )}
        </ul>
      )}

      {sectionId === "likely-asked" && (
        <ol className="space-y-3">
          {likelyAsked.map((q, i) => (
            <li
              key={q}
              className="flex gap-3 rounded-xl bg-card border border-cream-dark px-4 py-3 text-sm"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-honey-soft text-xs font-bold text-ink">
                {i + 1}
              </span>
              <span className="text-ink">{q}</span>
            </li>
          ))}
        </ol>
      )}

      {sectionId === "mind-changed" && (
        <ReasoningTimeline steps={timeline} lens="for_me" />
      )}

      {sectionId === "strengthen" && (
        <ul className="space-y-2">
          {improveActions.map((action) => (
            <li
              key={action}
              className="flex gap-2 rounded-xl border border-cream-dark bg-card px-4 py-3 text-sm text-ink transition hover:border-coral/40"
            >
              <span className="text-coral font-bold" aria-hidden>
                ✓
              </span>
              {action}
            </li>
          ))}
        </ul>
      )}

      {sectionId === "next-move" && (
        <>
          <p className="mb-4 text-sm text-ink-muted">
            {positive
              ? `You're positioned for a conversation at ${project.lab_name}. Take one intentional step.`
              : "Explore on your timeline—no pressure to force a fit."}
          </p>
          {positive && (
            <p className="mb-4 rounded-xl bg-sage-soft/50 px-4 py-3 text-sm">
              <span className="font-semibold">You'd work with:</span> {project.pi_name}{" "}
              · {project.lab_name}
            </p>
          )}
          <SuggestedNextStep
            project={project}
            lens="for_me"
            positiveRecommendation={positive}
          />
        </>
      )}
    </div>
  );
}
