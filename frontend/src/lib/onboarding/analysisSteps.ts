export interface AnalysisStep {
  id: string;
  label: string;
  detail: string;
}

export const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: "surface",
    label: "Reading surface credentials",
    detail: "Skills, year, and field from your intake",
  },
  {
    id: "intake",
    label: "Parsing intake narrative",
    detail: "Looking for ownership language and build stories",
  },
  {
    id: "requirements",
    label: "Matching opportunity requirements",
    detail: "Required skills vs what you told us",
  },
  {
    id: "hidden",
    label: "Surfacing hidden signals",
    detail: "Evidence that usually lives below the résumé",
  },
  {
    id: "dossier",
    label: "Building fit dossier",
    detail: "Rules-only assessment — no black-box score",
  },
  {
    id: "route",
    label: "Routing investigation",
    detail: "Clear fit, clear mismatch, or worth a closer look",
  },
  {
    id: "open",
    label: "Opening shared investigation",
    detail: "Preparing your signal discovery experience",
  },
];
