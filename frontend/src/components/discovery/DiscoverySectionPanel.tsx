"use client";

import type { SharedNotePayload, ViewerLens } from "@/lib/types";
import type { DiscoverySection } from "@/lib/presentation/discoverySections";
import type { DiscoverySignal, MindShift } from "@/lib/presentation/discoverySignals";
import type { SkillAlignmentData } from "@/lib/presentation/insights";
import type { RecommendationLabel } from "@/lib/viewModel";
import type { TrailStep } from "@/lib/presentation/conversationTrail";
import { SignalRevealStack } from "./SignalRevealStack";
import { MindChangeTimeline } from "./MindChangeTimeline";
import { EvidenceMap } from "./EvidenceMap";
import { ConversationTrail } from "../shared-note/ConversationTrail";
import { SuggestedNextStep } from "../shared-note/SuggestedNextStep";

interface Props {
  section: DiscoverySection;
  intro: string;
  lens: ViewerLens;
  note: SharedNotePayload;
  signals: DiscoverySignal[];
  mindShifts: MindShift[];
  alignment: SkillAlignmentData;
  trail: TrailStep[];
  recommendation: RecommendationLabel;
  positive: boolean;
  hasConversation: boolean;
  questions: string[];
}

export function DiscoverySectionPanel({
  section,
  intro,
  lens,
  note,
  signals,
  mindShifts,
  alignment,
  trail,
  recommendation,
  positive,
  hasConversation,
  questions,
}: Props) {
  const { result } = note;

  return (
    <div className="panel-enter min-h-[280px]">
      <div className="mb-6 flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          {section.emoji}
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink sm:text-2xl">{section.title}</h2>
          <p className="mt-1 text-sm text-ink-muted">{section.tagline}</p>
        </div>
      </div>

      {section.id === "attention" && (
        <>
          <ul className="mb-6 flex flex-wrap gap-2">
            {questions.slice(0, lens === "for_me" ? 3 : 2).map((q) => (
              <li
                key={q}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  lens === "for_me"
                    ? "bg-coral-soft text-ink"
                    : "bg-sage-soft text-ink"
                }`}
              >
                {q}
              </li>
            ))}
          </ul>
          <EvidenceMap alignment={alignment} lens={lens} />
          <div className="mt-6">
            <SignalRevealStack signals={signals} intro={intro} autoRevealFirst />
          </div>
        </>
      )}

      {section.id === "missed" && (
        <SignalRevealStack signals={signals} intro={intro} autoRevealFirst={false} />
      )}

      {section.id === "uncertainty" && (
        <>
          <div
            className={`mb-6 rounded-2xl border-l-4 p-4 ${
              lens === "for_me"
                ? "border-coral bg-coral-soft/30"
                : "border-honey bg-honey-soft/50"
            }`}
          >
            <p className="text-sm font-semibold text-ink">
              {lens === "for_me"
                ? "What might hold you back"
                : "Concerns before you invest a meeting"}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {note.dossier.uncertainties[0] ||
                note.dossier.skill_gaps[0] ||
                "No major uncertainty flagged."}
            </p>
          </div>
          <SignalRevealStack signals={signals} intro={intro} autoRevealFirst />
        </>
      )}

      {section.id === "decision" && (
        <>
          <div
            className={`rounded-2xl p-6 ${
              positive
                ? "bg-gradient-to-br from-sage-soft to-card border border-sage/30"
                : "bg-card border border-cream-dark"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              {lens === "for_me" ? "Where you landed" : "Verdict"}
            </p>
            <p className="mt-2 text-2xl font-bold text-ink">{recommendation}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {result.justification}
            </p>
          </div>
          <MindChangeTimeline shifts={mindShifts} />
          {hasConversation ? (
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink-muted">
                Investigation trail
              </h3>
              <ConversationTrail steps={trail} />
            </div>
          ) : (
            <p className="mt-6 rounded-xl border border-dashed border-cream-dark px-4 py-6 text-center text-sm text-ink-muted">
              Clear enough that reviewers didn&apos;t need a hearing—rules decided
              early.
            </p>
          )}
        </>
      )}

      {section.id === "next" && (
        <>
          <p className="mb-4 text-sm text-ink-muted">{intro}</p>
          {lens === "for_me" && positive && (
            <p className="mb-4 rounded-xl bg-sage-soft/50 px-4 py-3 text-sm text-ink">
              <span className="font-semibold">Who you&apos;d work with:</span>{" "}
              {note.project.pi_name} · {note.project.lab_name} ·{" "}
              {note.project.university}
            </p>
          )}
          <SuggestedNextStep
            project={note.project}
            lens={lens}
            positiveRecommendation={positive}
          />
        </>
      )}
    </div>
  );
}
