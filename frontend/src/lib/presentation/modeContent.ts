import type { SharedNotePayload, ViewerLens } from "@/lib/types";
import {
  decisionToRecommendation,
  heroSummary,
  isPositiveRecommendation,
} from "@/lib/viewModel";
import { confidenceLabel } from "./insights";

export interface SurfaceHiddenPair {
  id: string;
  surface: string;
  hidden: string;
}

export interface ReasoningStep {
  id: string;
  label: string;
  tone: "neutral" | "dip" | "discovery" | "upgrade" | "final";
}

export interface ModeCopy {
  roomTitle: string;
  roomDescription: string;
  voice: "you" | "reviewer";
}

export function modeCopy(lens: ViewerLens): ModeCopy {
  if (lens === "for_me") {
    return {
      roomTitle: "Your signal coach",
      roomDescription:
        "Personal mentor view — what makes you interesting, what to prepare, and what to do next.",
      voice: "you",
    };
  }
  return {
    roomTitle: "Reviewer workspace",
    roomDescription:
      "Evaluator view — evidence, risks, interview probes, and recommendation rationale.",
    voice: "reviewer",
  };
}

export function buildSurfaceHiddenPairs(
  note: SharedNotePayload
): SurfaceHiddenPair[] {
  const { student, dossier } = note;
  const pairs: SurfaceHiddenPair[] = [];

  if (student.publications.length === 0) {
    pairs.push({
      id: "pubs",
      surface: "No publications",
      hidden: student.intake_summary.includes("arm")
        ? "Built a robotic arm from scratch—including PCBs and control"
        : "Evidence may exist outside traditional outputs",
    });
  }

  if (student.year.toLowerCase().includes("year 1") || student.year.includes("Junior")) {
    const stars = student.extra_signals.github_stars;
    pairs.push({
      id: "stage",
      surface: `Early-stage (${student.year})`,
      hidden:
        typeof stars === "number" && stars >= 100
          ? `${stars}-star ROS contribution surfaced in intake`
          : "Non-obvious build signals in intake narrative",
    });
  }

  if (
    student.intake_summary.toLowerCase().includes("weak on paper") ||
    dossier.routing === "AMBIGUOUS"
  ) {
    pairs.push({
      id: "resume",
      surface: "Weak résumé on first pass",
      hidden: "Strong ownership evidence changed the read",
    });
  }

  if (dossier.skill_gaps.length > 0 && dossier.strengths.length > 0) {
    pairs.push({
      id: "gap",
      surface: `Missing ${dossier.skill_gaps.join(", ")} on file`,
      hidden: dossier.strengths[0],
    });
  }

  if (pairs.length === 0) {
    pairs.push({
      id: "default",
      surface: "Surface credentials",
      hidden: heroSummary(dossier),
    });
  }

  return pairs;
}

export function buildReasoningTimeline(
  note: SharedNotePayload,
  lens: ViewerLens
): ReasoningStep[] {
  const { student, dossier, result } = note;
  const positive = isPositiveRecommendation(dossier.routing, result.decision);
  const rec = decisionToRecommendation(result.decision, dossier.routing);

  if (dossier.routing === "CLEAR_MISMATCH") {
    return [
      { id: "1", label: "Resume Review", tone: "neutral" },
      { id: "2", label: "Credentials Look Strong (EE)", tone: "neutral" },
      { id: "3", label: "Required Skills Scan", tone: "dip" },
      { id: "4", label: "NLP / Deep Learning Not Evidenced", tone: "dip" },
      { id: "5", label: "No Compensating Ownership Signals", tone: "dip" },
      {
        id: "6",
        label: lens === "for_me" ? "Fit Not Supported — For Now" : "Recommendation: Not Now",
        tone: "final",
      },
    ];
  }

  const steps: ReasoningStep[] = [
    { id: "1", label: "Resume Review", tone: "neutral" },
    { id: "2", label: "Weak Initial Signal", tone: "dip" },
    { id: "3", label: "Intake Conversation", tone: "discovery" },
    { id: "4", label: "Unexpected Evidence Found", tone: "discovery" },
  ];

  if (student.extra_signals.github_stars) {
    steps.push({
      id: "5",
      label: "ROS Contribution Discovered",
      tone: "discovery",
    });
  }

  if (student.intake_summary.includes("arm") || student.extra_signals.side_project) {
    steps.push({
      id: "6",
      label: "Robotic Arm Build Revealed",
      tone: "upgrade",
    });
  }

  if (dossier.skill_gaps.length > 0) {
    steps.push({
      id: "7",
      label: `${dossier.skill_gaps.join(", ")} Gap Flagged`,
      tone: "dip",
    });
  }

  if (result.conversation.length > 0) {
    steps.push({
      id: "8",
      label: "Reviewer Hearing",
      tone: "discovery",
    });
  }

  steps.push({
    id: "9",
    label:
      lens === "for_me"
        ? positive
          ? "Your Case Upgraded — Conversation"
          : "Case Closed — Not This Role"
        : positive
          ? "Recommendation Upgraded — Conversation"
          : `Final: ${rec}`,
    tone: positive ? "upgrade" : "final",
  });

  return steps;
}

export function buildInterviewQuestions(note: SharedNotePayload): string[] {
  const { dossier } = note;
  const fromUncertainties = dossier.uncertainties.map((u) => {
    if (u.includes("CAD")) return "Which CAD tools were used on your builds?";
    if (u.includes("3D printing")) return "What fabrication methods did you use?";
    if (u.includes("commitment") || u.includes("UROP"))
      return "What time commitment are you seeking for this role?";
    return u.endsWith("?") ? u : `${u}?`;
  });

  const fromGaps = dossier.skill_gaps.flatMap((g) => {
    const lower = g.toLowerCase();
    if (lower.includes("cad"))
      return [
        "Which CAD tools were used?",
        "What fabrication methods were used on past projects?",
      ];
    if (lower.includes("nlp"))
      return ["What NLP projects have you shipped beyond coursework?"];
    if (lower.includes("deep learning"))
      return ["Describe a deep learning project you owned end-to-end."];
    return [`How have you demonstrated ${g} in practice?`];
  });

  const defaults = [
    "How much of the control stack was personally built?",
    "What would you redesign today if you started over?",
  ];

  const merged = [...fromUncertainties, ...fromGaps, ...defaults];
  return [...new Set(merged)].slice(0, 6);
}

export function buildImproveActions(note: SharedNotePayload): string[] {
  const { dossier, project } = note;
  const actions: string[] = [];

  dossier.skill_gaps.forEach((g) => {
    const lower = g.toLowerCase();
    if (lower.includes("cad")) {
      actions.push("Add CAD project examples to your portfolio");
      actions.push("Publish fabrication work (photos, CAD files, or write-up)");
    } else if (lower.includes("nlp") || lower.includes("deep learning")) {
      actions.push("Ship a small NLP/deep learning project and link it");
      actions.push("Document ML coursework with repos, not just grades");
    } else {
      actions.push(`Prepare concrete examples demonstrating ${g}`);
    }
  });

  dossier.uncertainties.forEach((u) => {
    if (u.toLowerCase().includes("cad"))
      actions.push("Create a one-page project breakdown of your arm build");
  });

  actions.push("Prepare talking points for technical conversations");
  actions.push(
    `Research ${project.lab_name} — lead with your strongest build story, not your transcript`
  );

  return [...new Set(actions)].slice(0, 6);
}

export function buildLikelyAskedYou(note: SharedNotePayload): string[] {
  return buildInterviewQuestions(note).map((q) => {
    const trimmed = q.replace(/\?$/, "");
    if (q.startsWith("Which") || q.startsWith("What") || q.startsWith("How"))
      return q.endsWith("?") ? q : `${q}?`;
    return `Be ready to explain: ${trimmed}`;
  });
}

export function buildStandOutBullets(note: SharedNotePayload): string[] {
  return note.dossier.strengths.length > 0
    ? note.dossier.strengths
    : [heroSummary(note.dossier)];
}

export function buildReviewerConcerns(note: SharedNotePayload): string[] {
  return [...note.dossier.risks, ...note.dossier.skill_gaps.map((g) => `Missing evidence for ${g}`)];
}

export function buildHiddenValuable(note: SharedNotePayload): string[] {
  const items: string[] = [];
  const { student, dossier } = note;

  if (student.extra_signals.side_project)
    items.push(`Your side project: ${student.extra_signals.side_project}`);
  if (typeof student.extra_signals.github_stars === "number")
    items.push(`Your ${student.extra_signals.github_stars}-star open-source signal`);
  dossier.strengths.forEach((s) => {
    if (
      s.toLowerCase().includes("intake") ||
      s.toLowerCase().includes("pcb") ||
      s.toLowerCase().includes("github") ||
      s.toLowerCase().includes("6-dof")
    ) {
      items.push(s);
    }
  });
  if (items.length === 0) items.push(...dossier.strengths.slice(0, 3));
  return items;
}

export function buildAssessmentSummary(note: SharedNotePayload): {
  headline: string;
  summary: string;
  confidence: string;
  skillsMet: string;
} {
  const { student, dossier } = note;
  const first = student.name.split(" ")[0];
  return {
    headline: `Should we consider ${first}?`,
    summary: heroSummary(dossier),
    confidence: confidenceLabel(dossier.overall_confidence),
    skillsMet: dossier.skills_met,
  };
}

export function buildEvidenceStrength(note: SharedNotePayload): {
  strong: string[];
  weak: string[];
} {
  const { dossier, project } = note;
  const weak = [
    ...dossier.skill_gaps.map((g) => `${g} — not evidenced`),
    ...dossier.risks,
  ];
  const strong = dossier.strengths.filter(
    (s) => !dossier.risks.some((r) => s.toLowerCase().includes(r.toLowerCase().slice(0, 12)))
  );
  if (strong.length === 0) {
    strong.push(
      ...project.required_skills.filter((s) => !dossier.skill_gaps.includes(s)).map((s) => `${s} — evidenced`)
    );
  }
  return { strong, weak };
}

export function buildOpenQuestions(note: SharedNotePayload): string[] {
  const { dossier } = note;
  return dossier.uncertainties.length > 0
    ? dossier.uncertainties
    : dossier.skill_gaps.map((g) => `The file does not verify ${g}.`);
}

export function buildAssumptions(note: SharedNotePayload): string[] {
  const { dossier } = note;
  const items = [
    "The candidate's listed skills reflect honest self-reporting.",
    "Intake narrative is accurate unless contradicted in conversation.",
  ];
  if (dossier.routing === "AMBIGUOUS") {
    items.push("Ownership signals may compensate for missing required skills.");
  }
  return items;
}
