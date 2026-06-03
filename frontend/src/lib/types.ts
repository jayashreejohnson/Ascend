/** Mirrors app/models.py — keep in sync when API ships. */

export type DossierRouting = "CLEAR_FIT" | "CLEAR_MISMATCH" | "AMBIGUOUS";

export type NegotiationDecision = "MATCH" | "NO_MATCH" | "NEEDS_INFO";

export type ViewerLens = "for_me" | "for_project";

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  year: string;
  field: string;
  interests: string[];
  skills: string[];
  publications: string[];
  extra_signals: Record<string, unknown>;
  intake_summary: string;
}

export interface LabProject {
  id: string;
  pi_name: string;
  lab_name: string;
  university: string;
  department: string;
  project_title: string;
  description: string;
  required_skills: string[];
  preferred_background: string[];
  openings: number;
  source_url: string;
  extra_requirements: Record<string, unknown>;
}

export interface DossierDimension {
  name: string;
  evidence: string[];
  assessment: string;
  confidence: number;
  gap: string;
}

export interface Dossier {
  routing: DossierRouting;
  dimensions: DossierDimension[];
  strengths: string[];
  risks: string[];
  uncertainties: string[];
  skills_met: string;
  skill_gaps: string[];
  routing_reason: string;
  overall_confidence: number;
  summary: string;
}

export interface AgentMessage {
  id: string;
  from_agent: string;
  to_agent: string;
  intent: string;
  payload: string;
  turn: number;
}

export interface NegotiationResult {
  decision: NegotiationDecision;
  justification: string;
  turns_used: number;
  conversation: AgentMessage[];
  student_id: string;
  project_id: string;
}

export interface SharedNotePayload {
  student: StudentProfile;
  project: LabProject;
  dossier: Dossier;
  result: NegotiationResult;
}

/** Institutional link keys stored under project.extra_requirements.links */
export type InstitutionalLinkKind =
  | "lab_website"
  | "faculty_profile"
  | "project_page"
  | "office_hours"
  | "application_form"
  | "department_page";

export type CoordinationKind = "request_introduction" | "invite_to_chat";

export type NextStepKind = InstitutionalLinkKind | CoordinationKind;

export type NextStepTier = "primary" | "secondary";

export type NextStepStatus = "ready" | "missing" | "disabled";

export interface NextStepAction {
  id: string;
  kind: NextStepKind;
  label: string;
  hint?: string;
  url?: string;
  tier: NextStepTier;
  status: NextStepStatus;
  handler: "external" | "stub";
}
