import {
  DEMO_PROJECT_NLP,
  DEMO_PROJECT_SOFT_ROBOTICS,
  DEMO_STUDENT_AISHA,
  DEMO_STUDENT_MARCUS,
} from "@/lib/mock/notes";
import type { IntakeSession } from "./types";

/** Maps intake to closest demo investigation (mock enrichment). */
export function resolveDemoInvestigation(session: IntakeSession): {
  studentId: string;
  projectId: string;
  label: string;
} {
  const blob = [
    session.student.intakeStory,
    session.student.hiddenSignals,
    session.student.skills,
    session.opportunity.description,
    session.opportunity.requiredSkills,
  ]
    .join(" ")
    .toLowerCase();

  const nlp =
    blob.includes("nlp") ||
    blob.includes("clinical") ||
    blob.includes("deep learning");
  const robotics =
    blob.includes("robot") ||
    blob.includes("hardware") ||
    blob.includes("cad") ||
    blob.includes("soft");

  if (nlp && !robotics) {
    return {
      studentId: DEMO_STUDENT_MARCUS,
      projectId: DEMO_PROJECT_NLP,
      label: "Marcus × Clinical NLP (demo enrichment)",
    };
  }

  return {
    studentId: DEMO_STUDENT_AISHA,
    projectId: DEMO_PROJECT_SOFT_ROBOTICS,
    label: "Aisha × Soft Robotics (demo enrichment)",
  };
}
