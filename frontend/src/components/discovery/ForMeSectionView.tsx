"use client";

import type { SharedNotePayload } from "@/lib/types";
import type { ModeSection } from "@/lib/presentation/modeSections";
import type { ForMeSectionId } from "@/lib/presentation/modeSections";
import type { SurfaceHiddenPair, ReasoningStep } from "@/lib/presentation/modeContent";
import type { RecommendationLabel } from "@/lib/viewModel";
import { SurfaceHiddenCompare } from "./SurfaceHiddenCompare";
import { ReasoningTimeline } from "./ReasoningTimeline";
import { SuggestedNextStep } from "../shared-note/SuggestedNextStep";

interface Props {
  section: ModeSection;
  note: SharedNotePayload;
  standOut: string[];
  surfaceHidden: SurfaceHiddenPair[];
  hiddenValuable: string[];
  reviewerConcerns: string[];
  likelyAsked: string[];
  improveActions: string[];
  reasoningSteps: ReasoningStep[];
  recommendation: RecommendationLabel;
  positive: boolean;
}

export function ForMeSectionView({
  section,
  note,
  standOut,
  surfaceHidden,
  hiddenValuable,
  reviewerConcerns,
  likelyAsked,
  improveActions,
  reasoningSteps,
  recommendation,
  positive,
}: Props) {
  const id = section.id as ForMeSectionId;

  return (
    <div className="panel-enter min-h-[260px]">
      <header className="mb-6">
        <h2 className="text-xl font-bold text-ink sm:text-2xl">{section.title}</h2>
        <p className="mt-1 text-sm text-ink-muted">{section.tagline}</p>
      </header>

      {id === "stand-out" && (
        <ul className="space-y-3">
          {standOut.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-sage/25 bg-sage-soft/35 px-4 py-4 text-sm leading-relaxed text-ink transition hover:shadow-md"
            >
              <span className="font-semibold text-sage">Your strength · </span>
              {item}
            </li>
          ))}
        </ul>
      )}

      {id === "surface-hidden" && (
        <SurfaceHiddenCompare pairs={surfaceHidden} lens="for_me" />
      )}

      {id === "hidden-valuable" && (
        <ul className="space-y-3">
          {hiddenValuable.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-coral/20 bg-gradient-to-r from-coral-soft/30 to-card px-4 py-4"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-coral">
                You didn&apos;t realize this counted
              </p>
              <p className="mt-2 text-sm font-medium text-ink">{item}</p>
            </li>
          ))}
        </ul>
      )}

      {id === "reviewer-questions" && (
        <ul className="space-y-3">
          {reviewerConcerns.length > 0 ? (
            reviewerConcerns.map((item) => (
              <li
                key={item}
                className="rounded-2xl border-l-4 border-coral bg-coral-soft/25 px-4 py-3 text-sm text-ink"
              >
                <span className="font-semibold">They may ask · </span>
                {item}
              </li>
            ))
          ) : (
            <p className="text-sm text-ink-muted">No major reviewer concerns flagged.</p>
          )}
        </ul>
      )}

      {id === "likely-asked" && (
        <ol className="space-y-3">
          {likelyAsked.map((q, i) => (
            <li
              key={q}
              className="flex gap-3 rounded-2xl bg-card border border-cream-dark px-4 py-3 text-sm text-ink"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-honey-soft text-xs font-bold text-ink">
                {i + 1}
              </span>
              {q}
            </li>
          ))}
        </ol>
      )}

      {id === "mind-changed" && (
        <ReasoningTimeline
          steps={reasoningSteps}
          lens="for_me"
          intro="This is how your file went from 'probably pass' to the recommendation you see today. Hidden signals changed the outcome."
        />
      )}

      {id === "strengthen" && (
        <ul className="space-y-2">
          {improveActions.map((action) => (
            <li
              key={action}
              className="flex items-start gap-2 rounded-xl bg-honey-soft/40 px-4 py-3 text-sm text-ink"
            >
              <span className="text-coral font-bold" aria-hidden>
                →
              </span>
              {action}
            </li>
          ))}
        </ul>
      )}

      {id === "next-move" && (
        <>
          <p className="mb-4 rounded-xl bg-sage-soft/40 px-4 py-3 text-sm text-ink">
            <span className="font-semibold">Your read:</span> {recommendation}
            {positive ? (
              <>
                {" "}
                — {note.project.pi_name} at {note.project.lab_name} may be worth
                your time.
              </>
            ) : null}
          </p>
          <SuggestedNextStep
            project={note.project}
            lens="for_me"
            positiveRecommendation={positive}
          />
        </>
      )}
    </div>
  );
}
