"use client";

import type { SharedNotePayload } from "@/lib/types";
import type { ForProjectSectionId } from "@/lib/presentation/modeSections";
import type { ModeSection } from "@/lib/presentation/modeSections";
import type { RecommendationLabel } from "@/lib/viewModel";
import type {
  ReasoningStep,
  SurfaceHiddenPair,
} from "@/lib/presentation/modeContent";
import { ReasoningTimeline } from "./ReasoningTimeline";
import { SurfaceHiddenCompare } from "./SurfaceHiddenCompare";
import { SuggestedNextStep } from "../shared-note/SuggestedNextStep";
import { buildSkillAlignment } from "@/lib/presentation/insights";
import { EvidenceMap } from "./EvidenceMap";

interface Props {
  section: ModeSection;
  sectionId: ForProjectSectionId;
  note: SharedNotePayload;
  assessment: {
    headline: string;
    summary: string;
    confidence: string;
    skillsMet: string;
  };
  evidence: { strong: string[]; weak: string[] };
  openQuestions: string[];
  risks: string[];
  interviewQuestions: string[];
  assumptions: string[];
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

export function ForProjectModePanel({
  section,
  sectionId,
  note,
  assessment,
  evidence,
  openQuestions,
  risks,
  interviewQuestions,
  assumptions,
  surfaceHidden,
  timeline,
  recommendation,
  positive,
}: Props) {
  const { student, result, project } = note;
  const first = student.name.split(" ")[0];
  const alignment = buildSkillAlignment(note);

  return (
    <div className="panel-enter min-h-[260px]">
      <SectionHeader section={section} />

      {sectionId === "assessment" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-sage/30 bg-sage-soft/30 p-5">
            <p className="text-lg font-semibold text-ink">{assessment.headline}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {assessment.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-card px-3 py-1 font-medium">
                Confidence: {assessment.confidence}
              </span>
              <span className="rounded-full bg-card px-3 py-1 font-medium">
                Skills met: {assessment.skillsMet}
              </span>
            </div>
          </div>
          <p className="text-sm text-ink-muted">
            <span className="font-semibold text-ink">The candidate: </span>
            {first}, {student.year}, {student.field}. The evidence below determines
            whether the fit holds.
          </p>
        </div>
      )}

      {sectionId === "evidence-strength" && (
        <div className="space-y-6">
          <EvidenceMap alignment={alignment} lens="for_project" />
          <SurfaceHiddenCompare pairs={surfaceHidden} lens="for_project" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-sage">
                Strong evidence
              </p>
              <ul className="space-y-2">
                {evidence.strong.map((e) => (
                  <li
                    key={e}
                    className="rounded-lg bg-sage-soft/40 px-3 py-2 text-sm text-ink"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-coral">
                Weak evidence
              </p>
              <ul className="space-y-2">
                {evidence.weak.map((e) => (
                  <li
                    key={e}
                    className="rounded-lg bg-coral-soft/40 px-3 py-2 text-sm text-ink"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {sectionId === "mind-changed" && (
        <ReasoningTimeline steps={timeline} lens="for_project" />
      )}

      {sectionId === "open-questions" && (
        <div className="space-y-4">
          <ul className="space-y-2">
            {openQuestions.map((q) => (
              <li
                key={q}
                className="rounded-xl border border-honey/40 bg-honey-soft/30 px-4 py-3 text-sm text-ink"
              >
                {q}
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-dashed border-cream-dark p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              Assumptions in this read
            </p>
            <ul className="mt-2 space-y-1 text-sm text-ink-muted">
              {assumptions.map((a) => (
                <li key={a}>· {a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {sectionId === "risks" && (
        <ul className="space-y-3">
          {risks.map((r) => (
            <li
              key={r}
              className="rounded-xl border-l-4 border-coral bg-card px-4 py-3 text-sm text-ink shadow-sm"
            >
              <span className="font-semibold">Risk: </span>
              {r}
            </li>
          ))}
        </ul>
      )}

      {sectionId === "interview-questions" && (
        <>
          <p className="mb-4 text-sm text-ink-muted">
            Questions we&apos;d ask next—derived from gaps and uncertainties in the
            file.
          </p>
          <ol className="space-y-3">
            {interviewQuestions.map((q, i) => (
              <li
                key={q}
                className="flex gap-3 rounded-xl bg-card border border-cream-dark px-4 py-3 text-sm"
              >
                <span className="font-bold text-sage">{i + 1}.</span>
                {q}
              </li>
            ))}
          </ol>
        </>
      )}

      {sectionId === "rationale" && (
        <>
          <div
            className={`rounded-2xl p-6 ${
              positive
                ? "border border-sage/40 bg-sage-soft/40"
                : "border border-cream-dark bg-card"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              The recommendation
            </p>
            <p className="mt-2 text-2xl font-bold text-ink">{recommendation}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {result.justification}
            </p>
          </div>
          {positive && (
            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold text-ink">
                Next steps for the project
              </p>
              <SuggestedNextStep
                project={project}
                lens="for_project"
                positiveRecommendation={positive}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
