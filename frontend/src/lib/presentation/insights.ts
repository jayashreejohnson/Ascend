import type { SharedNotePayload } from "@/lib/types";
import {
  decisionToRecommendation,
  heroSummary,
  showConversationSection,
} from "@/lib/viewModel";

export type CuriosityVariant =
  | "fun-fact"
  | "quick-insight"
  | "hidden-signal"
  | "why-interesting"
  | "learned";

export interface CuriosityCardData {
  id: string;
  variant: CuriosityVariant;
  title: string;
  body: string;
}

export interface InsightSnapshotData {
  signalsMatched: string;
  mainUncertainty: string;
  confidence: string;
  recommendation: string;
}

export interface SkillAlignmentData {
  studentBrings: string[];
  opportunityNeeds: string[];
  overlap: string[];
  gaps: string[];
}

const VARIANT_LABEL: Record<CuriosityVariant, string> = {
  "fun-fact": "Fun Fact",
  "quick-insight": "Quick Insight",
  "hidden-signal": "Hidden Signal",
  "why-interesting": "Why This Was Interesting",
  learned: "Things We Learned",
};

export function curiosityVariantLabel(v: CuriosityVariant): string {
  return VARIANT_LABEL[v];
}

export function confidenceLabel(score: number): string {
  if (score >= 0.75) return "High";
  if (score >= 0.5) return "Medium";
  return "Low";
}

export function buildInsightSnapshot(note: SharedNotePayload): InsightSnapshotData {
  const { dossier, result } = note;
  const recommendation = decisionToRecommendation(
    result.decision,
    dossier.routing
  );
  const shortRec =
    recommendation === "A Conversation Makes Sense"
      ? "Conversation"
      : recommendation === "Not the Right Fit Right Now"
        ? "Not now"
        : "More clarity";

  return {
    signalsMatched: dossier.skills_met || "—",
    mainUncertainty: dossier.uncertainties[0] || dossier.skill_gaps[0] || "None flagged",
    confidence: confidenceLabel(dossier.overall_confidence),
    recommendation: shortRec,
  };
}

export function buildSkillAlignment(note: SharedNotePayload): SkillAlignmentData {
  const { student, project, dossier } = note;
  const needs = project.required_skills;
  const gaps = dossier.skill_gaps.map((g) => g.toLowerCase());
  const brings = [
    ...student.skills,
    ...student.interests.filter(
      (i) => !student.skills.some((s) => s.toLowerCase() === i.toLowerCase())
    ),
  ];
  const overlap = needs.filter(
    (n) => !gaps.some((g) => n.toLowerCase().includes(g) || g.includes(n.toLowerCase()))
  );

  return {
    studentBrings: brings,
    opportunityNeeds: needs,
    overlap,
    gaps: dossier.skill_gaps.length > 0 ? dossier.skill_gaps : gaps,
  };
}

export function buildCuriosityCards(note: SharedNotePayload): CuriosityCardData[] {
  const { student, project, dossier, result } = note;
  const cards: CuriosityCardData[] = [];

  if (student.publications.length === 0 && student.intake_summary.includes("arm")) {
    cards.push({
      id: "ff-arm",
      variant: "fun-fact",
      title: "Fun Fact",
      body: "Built a robotic arm from scratch before publishing a paper.",
    });
  }

  const stars = student.extra_signals.github_stars;
  if (typeof stars === "number" && stars >= 100) {
    cards.push({
      id: "hs-ros",
      variant: "hidden-signal",
      title: "Hidden Signal",
      body: `${stars}-star ROS contribution surfaced during intake—not on the résumé.`,
    });
  }

  if (student.extra_signals.side_project) {
    cards.push({
      id: "hs-side",
      variant: "hidden-signal",
      title: "Hidden Signal",
      body: String(student.extra_signals.side_project),
    });
  }

  dossier.strengths.slice(0, 2).forEach((s, i) => {
    cards.push({
      id: `qi-${i}`,
      variant: "quick-insight",
      title: "Quick Insight",
      body: s,
    });
  });

  if (dossier.skill_gaps.length > 0) {
    cards.push({
      id: "qi-gap",
      variant: "quick-insight",
      title: "Quick Insight",
      body: `Opportunity requires ${dossier.skill_gaps.join(", ")} but evidence is incomplete.`,
    });
  }

  cards.push({
    id: "why",
    variant: "why-interesting",
    title: "Why This Was Interesting",
    body: dossier.routing_reason || heroSummary(dossier),
  });

  if (showConversationSection(dossier.routing, result)) {
    result.conversation.forEach((msg, i) => {
      if (msg.intent === "decide" || i === result.conversation.length - 1) {
        cards.push({
          id: `learn-${i}`,
          variant: "learned",
          title: "Things We Learned During Evaluation",
          body: msg.payload.replace(/^DECISION:\s*\w+\s*—\s*/i, ""),
        });
      }
    });
  } else if (dossier.dimensions.length > 0) {
    cards.push({
      id: "learn-dim",
      variant: "learned",
      title: "Things We Learned During Evaluation",
      body: dossier.dimensions[0].assessment,
    });
  }

  if (cards.length === 0) {
    cards.push({
      id: "why-fallback",
      variant: "why-interesting",
      title: "Why This Was Interesting",
      body: heroSummary(dossier),
    });
  }

  return cards;
}
