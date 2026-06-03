import type { SharedNotePayload, ViewerLens } from "@/lib/types";
import {
  decisionToRecommendation,
  heroSummary,
  isPositiveRecommendation,
  routingToMoment,
} from "@/lib/viewModel";
import { confidenceLabel } from "./insights";

export interface NarrativeHero {
  hook: string;
  contrastA: string;
  contrastB: string;
  payoff: string;
}

export interface LensFrame {
  hero: NarrativeHero;
  /** Shown under lens switcher */
  lensSubtitle: string;
  /** Section-specific intros */
  sectionIntros: Record<string, string>;
  /** Floating questions for this lens */
  questions: string[];
}

function aishaStyleHero(note: SharedNotePayload, lens: ViewerLens): NarrativeHero {
  const { student, dossier } = note;
  const name = student.name.split(" ")[0];

  if (lens === "for_me") {
    return {
      hook: "We almost overlooked you.",
      contrastA: "On paper: early PhD, no publications.",
      contrastB: `In reality: ${name} built a complete robotic arm—PCBs, control stack, and all—before the transcript caught up.`,
      payoff:
        "This investigation exists because your best evidence wasn't where recruiters usually look.",
    };
  }

  return {
    hook: "We almost overlooked this candidate.",
    contrastA: "On paper: average.",
    contrastB: "In reality: built a robotic arm from scratch—and shipped a 400-star ROS contribution.",
    payoff:
      "The résumé said one thing. The evidence said another. That's why we opened this file.",
  };
}

function marcusStyleHero(note: SharedNotePayload, lens: ViewerLens): NarrativeHero {
  const { student, project } = note;
  const name = student.name.split(" ")[0];

  if (lens === "for_me") {
    return {
      hook: "Your EE story is strong—but this opportunity speaks a different language.",
      contrastA: "On paper: IEEE publication, solid fundamentals.",
      contrastB: "For this lab: NLP and deep learning never surfaced in your evidence.",
      payoff:
        "This isn't a judgment on your potential—it's an honest read of fit for this specific role.",
    };
  }

  return {
    hook: `${name} looked credible in EE—not in clinical NLP.`,
    contrastA: `What ${project.lab_name} needs: NLP + deep learning.`,
    contrastB: "What we found: Python and signal processing—without ML depth.",
    payoff: "Sometimes the investigation closes early. This is one of those cases.",
  };
}

function genericHero(note: SharedNotePayload, lens: ViewerLens): NarrativeHero {
  const summary = heroSummary(note.dossier);
  if (lens === "for_me") {
    return {
      hook: "Here's what the evidence says about you—for this opportunity.",
      contrastA: routingToMoment(note.dossier.routing),
      contrastB: summary,
      payoff: "Dig in below to see what stood out, what we almost missed, and what happens next.",
    };
  }
  return {
    hook: "Here's what the evidence says about this person—for your project.",
    contrastA: routingToMoment(note.dossier.routing),
    contrastB: summary,
    payoff: "Follow the discovery path to see how we reached the recommendation.",
  };
}

export function buildNarrativeHero(
  note: SharedNotePayload,
  lens: ViewerLens
): NarrativeHero {
  const { student } = note;
  if (student.intake_summary.includes("arm") || student.extra_signals.side_project) {
    return aishaStyleHero(note, lens);
  }
  if (note.dossier.routing === "CLEAR_MISMATCH") {
    return marcusStyleHero(note, lens);
  }
  return genericHero(note, lens);
}

export function buildLensFrame(
  note: SharedNotePayload,
  lens: ViewerLens
): LensFrame {
  const { student, project, dossier, result } = note;
  const first = student.name.split(" ")[0];
  const hero = buildNarrativeHero(note, lens);
  const rec = decisionToRecommendation(result.decision, dossier.routing);
  const positive = isPositiveRecommendation(dossier.routing, result.decision);

  if (lens === "for_me") {
    return {
      hero,
      lensSubtitle: `Your signal story · ${project.project_title}`,
      questions: [
        "Why am I interesting for this role?",
        "What makes me stand out?",
        "What might hold me back?",
        "What should I explore next?",
        "Who would I work with?",
        "Why is this opportunity worth my time?",
      ],
      sectionIntros: {
        attention: `Here's why ${project.lab_name} should notice you—not just your transcript.`,
        missed: "These signals weren't obvious until intake. They're why this file stayed open.",
        uncertainty: "Be honest about these gaps—they're what a conversation would test.",
        decision: `Where you landed: ${rec}. Confidence: ${confidenceLabel(dossier.overall_confidence)}.`,
        next: positive
          ? `Worth your time: ${project.pi_name} at ${project.university}. Here's how to explore.`
          : "No pressure—explore the lab on your own timeline.",
      },
    };
  }

  return {
    hero,
    lensSubtitle: `Candidate investigation · ${first} for ${project.project_title}`,
    questions: [
      "Why is this person interesting?",
      "What evidence supports the fit?",
      "What concerns exist?",
      "What questions remain unanswered?",
      "Is this worth a conversation?",
    ],
    sectionIntros: {
      attention: `Why ${first} caught our attention for ${project.project_title}.`,
      missed: "Evidence that almost didn't make it into the first pass.",
      uncertainty: "Concerns and open questions before you'd invest a meeting.",
      decision: `Verdict: ${rec}. ${result.justification}`,
      next: positive
        ? "Ways to learn more—or open a light-touch conversation."
        : "Links only—fit wasn't strong enough to recommend outreach.",
    },
  };
}
