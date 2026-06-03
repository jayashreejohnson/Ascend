import type { SharedNotePayload, ViewerLens } from "@/lib/types";
import { showConversationSection } from "@/lib/viewModel";
import { buildConversationTrail } from "./conversationTrail";

export type SignalCategory =
  | "obvious"
  | "hidden"
  | "surfaced-later"
  | "unanswered"
  | "reviewer";

export interface DiscoverySignal {
  id: string;
  category: SignalCategory;
  icon: string;
  label: string;
  headline: string;
  whyItMatters: string;
  confidence?: number;
}

export interface MindShift {
  id: string;
  before: string;
  after: string;
  trigger: string;
}

const CATEGORY_ZONE: Record<
  SignalCategory,
  { zone: string; description: string }
> = {
  obvious: {
    zone: "On the surface",
    description: "What anyone skimming would see first",
  },
  hidden: {
    zone: "Below the fold",
    description: "Buried in intake—not on the résumé",
  },
  "surfaced-later": {
    zone: "Surfaced during review",
    description: "Evidence that appeared as we dug deeper",
  },
  unanswered: {
    zone: "Still open",
    description: "Questions we couldn't resolve from files alone",
  },
  reviewer: {
    zone: "Reviewer read",
    description: "What the investigation team concluded",
  },
};

export function signalZoneMeta(category: SignalCategory) {
  return CATEGORY_ZONE[category];
}

export function buildDiscoverySignals(
  note: SharedNotePayload,
  lens: ViewerLens
): DiscoverySignal[] {
  const { student, project, dossier, result } = note;
  const signals: DiscoverySignal[] = [];
  const first = student.name.split(" ")[0];

  dossier.strengths.forEach((s, i) => {
    const isHidden =
      s.toLowerCase().includes("github") ||
      s.toLowerCase().includes("intake") ||
      s.toLowerCase().includes("pcb") ||
      s.toLowerCase().includes("6-dof");
    signals.push({
      id: `str-${i}`,
      category: isHidden ? "hidden" : "obvious",
      icon: isHidden ? "🔍" : "✓",
      label: isHidden ? "Hidden strength" : "Clear match",
      headline: s,
      whyItMatters:
        lens === "for_me"
          ? "This is a credible reason a PI should take your meeting."
          : `Supports why ${first} isn't just keyword-matching.`,
      confidence: isHidden ? 0.85 : 0.7,
    });
  });

  if (student.publications.length === 0 && student.intake_summary.includes("arm")) {
    signals.push({
      id: "unexpected-arm",
      category: "hidden",
      icon: "🚀",
      label: "Unexpected Signal",
      headline: `Before publishing a paper, ${first} had already designed and built a complete robotic arm from scratch.`,
      whyItMatters:
        lens === "for_me"
          ? "Your build story outweighs an empty publications line—for the right lab."
          : "This reframes 'weak on paper' into 'strong builder'—the core of the case.",
      confidence: 0.9,
    });
  }

  const stars = student.extra_signals.github_stars;
  if (typeof stars === "number" && stars >= 100) {
    signals.push({
      id: "ros-stars",
      category: "surfaced-later",
      icon: "⭐",
      label: "Surfaced in intake",
      headline: `${stars}-star ROS2 contribution—never made the CV headline.`,
      whyItMatters:
        lens === "for_me"
          ? "Open source at this scale signals you ship—and communities notice."
          : "Ownership signal that compensates for missing CAD on paper.",
      confidence: 0.88,
    });
  }

  if (student.extra_signals.side_project) {
    signals.push({
      id: "side-proj",
      category: "hidden",
      icon: "🔧",
      label: "Build signal",
      headline: String(student.extra_signals.side_project),
      whyItMatters:
        lens === "for_me"
          ? "Shows end-to-end ownership—not coursework alone."
          : "Evidence of fabrication and systems thinking beyond coursework.",
      confidence: 0.85,
    });
  }

  project.required_skills.forEach((skill) => {
    const gap = dossier.skill_gaps.some(
      (g) => g.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(g.toLowerCase())
    );
    if (!gap) {
      signals.push({
        id: `skill-${skill}`,
        category: "obvious",
        icon: "✓",
        label: "Required signal",
        headline: `${skill} — evidenced`,
        whyItMatters:
          lens === "for_me"
            ? `You cleared a stated requirement for ${project.project_title}.`
            : `Checks a box on ${project.project_title}'s requirements list.`,
        confidence: 0.75,
      });
    }
  });

  dossier.skill_gaps.forEach((g, i) => {
    signals.push({
      id: `gap-${i}`,
      category: "unanswered",
      icon: "⚠️",
      label: "Gap to probe",
      headline: `${g} — not yet evidenced`,
      whyItMatters:
        lens === "for_me"
          ? `Be ready to speak to ${g}—it's the main thing a PI may question.`
          : `${project.project_title} lists ${g}; we couldn't verify it in files.`,
      confidence: 0.4,
    });
  });

  dossier.uncertainties.forEach((u, i) => {
    signals.push({
      id: `unc-${i}`,
      category: "unanswered",
      icon: "❓",
      label: "Open question",
      headline: u,
      whyItMatters:
        lens === "for_me"
          ? "A good answer here could tip a conversation in your favor."
          : "Worth one focused question if you take the meeting.",
      confidence: 0.5,
    });
  });

  dossier.risks.forEach((r, i) => {
    signals.push({
      id: `risk-${i}`,
      category: "reviewer",
      icon: "👁",
      label: "Reviewer flag",
      headline: r,
      whyItMatters:
        lens === "for_me"
          ? "Don't ignore this—address it head-on if you reach out."
          : "A concern to weigh against ownership signals.",
      confidence: 0.55,
    });
  });

  if (dossier.routing_reason) {
    signals.push({
      id: "routing",
      category: "reviewer",
      icon: "🧠",
      label: "Investigation note",
      headline: dossier.routing_reason,
      whyItMatters:
        lens === "for_me"
          ? "This is why your file didn't get a simple yes/no."
          : "This is why the system routed to a full read.",
      confidence: dossier.overall_confidence,
    });
  }

  if (lens === "for_me" && project.pi_name) {
    signals.push({
      id: "who",
      category: "obvious",
      icon: "🤝",
      label: "Who you'd work with",
      headline: `${project.pi_name} · ${project.lab_name}`,
      whyItMatters: `${project.university} — ${project.description.slice(0, 120)}…`,
      confidence: 0.65,
    });
  }

  if (lens === "for_project" && student.field) {
    signals.push({
      id: "why-person",
      category: "obvious",
      icon: "👀",
      label: "Why they're interesting",
      headline: `${first} · ${student.year} · ${student.field}`,
      whyItMatters: student.intake_summary.slice(0, 160) + (student.intake_summary.length > 160 ? "…" : ""),
      confidence: 0.6,
    });
  }

  return signals;
}

export function signalsForSection(
  signals: DiscoverySignal[],
  section: "attention" | "missed" | "uncertainty"
): DiscoverySignal[] {
  switch (section) {
    case "attention":
      return signals.filter(
        (s) => s.category === "obvious" || (s.category === "reviewer" && s.id === "why-person")
      );
    case "missed":
      return signals.filter(
        (s) => s.category === "hidden" || s.category === "surfaced-later"
      );
    case "uncertainty":
      return signals.filter(
        (s) => s.category === "unanswered" || (s.category === "reviewer" && s.id.startsWith("risk"))
      );
    default:
      return signals;
  }
}

export function buildMindShifts(note: SharedNotePayload): MindShift[] {
  const { dossier, result } = note;
  const shifts: MindShift[] = [];

  if (dossier.routing === "CLEAR_MISMATCH") {
    shifts.push({
      id: "m1",
      before: "Looked like a pivoting EE with publications.",
      after: "NLP depth for this clinical role wasn't there.",
      trigger: "Skills scan across intake + listed skills",
    });
    return shifts;
  }

  shifts.push({
    id: "m1",
    before: "First pass: underwhelming academic record.",
    after: "Intake revealed a full hardware build story.",
    trigger: "Intake narrative + extra_signals",
  });

  if (dossier.skill_gaps.length > 0) {
    shifts.push({
      id: "m2",
      before: `Assumed strong fit on robotics + Python.`,
      after: `${dossier.skill_gaps.join(", ")} still unverified.`,
      trigger: "Required skills vs evidence map",
    });
  }

  if (showConversationSection(dossier.routing, result)) {
    const trail = buildConversationTrail(result.conversation);
    trail.forEach((step, i) => {
      if (step.phase === "resolution") {
        shifts.push({
          id: `t-${i}`,
          before: "CAD gap felt like a blocker.",
          after: step.detail,
          trigger: step.label,
        });
      } else if (step.phase === "discovery") {
        shifts.push({
          id: `t-d-${i}`,
          before: "Treated arm project as anecdote.",
          after: step.detail,
          trigger: "Evidence surfaced in review",
        });
      }
    });
  }

  return shifts;
}
