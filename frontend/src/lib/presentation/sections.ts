export type ExploreSectionId =
  | "overview"
  | "evidence"
  | "person"
  | "opportunity"
  | "conversation"
  | "recommendation"
  | "next-step";

export interface ExploreSection {
  id: ExploreSectionId;
  label: string;
  shortLabel: string;
  description: string;
}

export const EXPLORE_SECTIONS: ExploreSection[] = [
  {
    id: "overview",
    label: "Hero Overview",
    shortLabel: "Overview",
    description: "The story at a glance",
  },
  {
    id: "evidence",
    label: "Evidence",
    shortLabel: "Evidence",
    description: "Signals, overlap, and what we found",
  },
  {
    id: "person",
    label: "Person",
    shortLabel: "Person",
    description: "Who is being evaluated",
  },
  {
    id: "opportunity",
    label: "Opportunity",
    shortLabel: "Opportunity",
    description: "What the role needs",
  },
  {
    id: "conversation",
    label: "Conversation",
    shortLabel: "Trail",
    description: "How reviewers resolved ambiguity",
  },
  {
    id: "recommendation",
    label: "Recommendation",
    shortLabel: "Verdict",
    description: "Where coordination stands now",
  },
  {
    id: "next-step",
    label: "Next Step",
    shortLabel: "Action",
    description: "Ways to explore or connect",
  },
];
