import type { ViewerLens } from "@/lib/types";

export type ForMeSectionId =
  | "stand-out"
  | "surface-hidden"
  | "hidden-valuable"
  | "reviewer-questions"
  | "likely-asked"
  | "mind-changed"
  | "strengthen"
  | "next-move";

export type ForProjectSectionId =
  | "assessment"
  | "evidence-strength"
  | "mind-changed"
  | "open-questions"
  | "risks"
  | "interview-questions"
  | "rationale";

export type ModeSectionId = ForMeSectionId | ForProjectSectionId;

export interface ModeSection {
  id: ModeSectionId;
  title: string;
  tagline: string;
}

export const FOR_ME_SECTIONS: ModeSection[] = [
  {
    id: "stand-out",
    title: "Why You Stand Out",
    tagline: "Your strongest signals for this opportunity",
  },
  {
    id: "surface-hidden",
    title: "Surface vs Hidden",
    tagline: "What the résumé said vs what we found",
  },
  {
    id: "hidden-valuable",
    title: "Signals You Didn't Realize Were Valuable",
    tagline: "Evidence worth leading with",
  },
  {
    id: "reviewer-questions",
    title: "What Reviewers Might Question",
    tagline: "Concerns to take seriously",
  },
  {
    id: "likely-asked",
    title: "Questions You'll Likely Be Asked",
    tagline: "Prepare before you reach out",
  },
  {
    id: "mind-changed",
    title: "What Changed Our Mind",
    tagline: "How your story upgraded during review",
  },
  {
    id: "strengthen",
    title: "How To Strengthen This Fit",
    tagline: "Practical moves tied to your gaps",
  },
  {
    id: "next-move",
    title: "Your Next Best Move",
    tagline: "Explore or connect with intention",
  },
];

export const FOR_PROJECT_SECTIONS: ModeSection[] = [
  {
    id: "assessment",
    title: "Candidate Assessment",
    tagline: "Should we consider this person?",
  },
  {
    id: "evidence-strength",
    title: "Evidence Strength",
    tagline: "What supports or weakens the fit",
  },
  {
    id: "mind-changed",
    title: "What Changed Our Mind",
    tagline: "How the recommendation evolved",
  },
  {
    id: "open-questions",
    title: "Open Questions",
    tagline: "What remains unanswered in the file",
  },
  {
    id: "risks",
    title: "Risk Areas",
    tagline: "Concerns before investing a meeting",
  },
  {
    id: "interview-questions",
    title: "Suggested Interview Questions",
    tagline: "Probe missing evidence directly",
  },
  {
    id: "rationale",
    title: "Recommendation Rationale",
    tagline: "The fit decision and confidence",
  },
];

export function sectionsForLens(lens: ViewerLens): ModeSection[] {
  return lens === "for_me" ? FOR_ME_SECTIONS : FOR_PROJECT_SECTIONS;
}

export function defaultSectionForLens(lens: ViewerLens): ModeSectionId {
  return lens === "for_me" ? "stand-out" : "assessment";
}

export function isSectionValidForLens(
  id: ModeSectionId,
  lens: ViewerLens
): boolean {
  const sections = sectionsForLens(lens);
  return sections.some((s) => s.id === id);
}
