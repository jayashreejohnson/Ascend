import type {
  Dossier,
  DossierRouting,
  NegotiationDecision,
  NegotiationResult,
  ViewerLens,
} from "./types";

export type MomentLabel =
  | "Ready to Connect"
  | "Not the Right Moment"
  | "Worth a Closer Look";

export type RecommendationLabel =
  | "A Conversation Makes Sense"
  | "Not the Right Fit Right Now"
  | "More Clarity Would Help";

export function routingToMoment(routing: DossierRouting): MomentLabel {
  switch (routing) {
    case "CLEAR_FIT":
      return "Ready to Connect";
    case "CLEAR_MISMATCH":
      return "Not the Right Moment";
    case "AMBIGUOUS":
      return "Worth a Closer Look";
  }
}

export function decisionToRecommendation(
  decision: NegotiationDecision,
  routing: DossierRouting
): RecommendationLabel {
  if (routing === "CLEAR_FIT") return "A Conversation Makes Sense";
  if (routing === "CLEAR_MISMATCH") return "Not the Right Fit Right Now";
  switch (decision) {
    case "MATCH":
      return "A Conversation Makes Sense";
    case "NO_MATCH":
      return "Not the Right Fit Right Now";
    case "NEEDS_INFO":
      return "More Clarity Would Help";
  }
}

export function showConversationSection(
  routing: DossierRouting,
  result: NegotiationResult
): boolean {
  return routing === "AMBIGUOUS" && result.conversation.length > 0;
}

export function isPositiveRecommendation(
  routing: DossierRouting,
  decision: NegotiationDecision
): boolean {
  if (routing === "CLEAR_FIT") return true;
  if (routing === "CLEAR_MISMATCH") return false;
  return decision === "MATCH";
}

export function nextStepFrameCopy(
  lens: ViewerLens,
  positive: boolean
): string {
  if (!positive) {
    return "No pressure. These links are here when you want to explore on your own.";
  }
  if (lens === "for_project") {
    return "Ways to learn more about them—or open a light-touch conversation.";
  }
  return "A few ways to learn more—or take one small step toward connecting.";
}

export function heroSummary(dossier: Dossier): string {
  return dossier.summary || dossier.routing_reason;
}
