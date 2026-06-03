import type {
  IntakeSession,
  OpportunityIntake,
  StudentIntake,
} from "./types";

const KEY = "officehours-intake-session";
const STUDENT_DRAFT = "officehours-student-draft";
const OPPORTUNITY_DRAFT = "officehours-opportunity-draft";

export function saveStudentDraft(data: StudentIntake): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STUDENT_DRAFT, JSON.stringify(data));
}

export function loadStudentDraft(): StudentIntake | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(STUDENT_DRAFT);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentIntake;
  } catch {
    return null;
  }
}

export function saveOpportunityDraft(data: OpportunityIntake): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(OPPORTUNITY_DRAFT, JSON.stringify(data));
}

export function loadOpportunityDraft(): OpportunityIntake | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(OPPORTUNITY_DRAFT);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OpportunityIntake;
  } catch {
    return null;
  }
}

export function saveIntakeSession(session: IntakeSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(session));
  sessionStorage.removeItem(STUDENT_DRAFT);
  sessionStorage.removeItem(OPPORTUNITY_DRAFT);
}

export function loadIntakeSession(): IntakeSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IntakeSession;
  } catch {
    return null;
  }
}

export function clearIntakeSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
