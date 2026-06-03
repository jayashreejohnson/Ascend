import type { AgentMessage } from "@/lib/types";

export interface TrailStep {
  id: string;
  phase: "discovery" | "question" | "resolution";
  label: string;
  detail: string;
  confidence?: "high" | "medium" | "low";
}

const PHASE_META: Record<
  TrailStep["phase"],
  { label: string; confidence: TrailStep["confidence"] }
> = {
  discovery: { label: "Evidence surfaced", confidence: "high" },
  question: { label: "Open question raised", confidence: "medium" },
  resolution: { label: "Path forward", confidence: "high" },
};

function phaseForMessage(msg: AgentMessage, index: number, total: number): TrailStep["phase"] {
  if (msg.intent === "decide" || index === total - 1) return "resolution";
  if (msg.intent === "clarify" || msg.intent === "inquiry") return "question";
  return "discovery";
}

export function buildConversationTrail(messages: AgentMessage[]): TrailStep[] {
  return messages.map((msg, index) => {
    const phase = phaseForMessage(msg, index, messages.length);
    const meta = PHASE_META[phase];
    const detail = msg.payload.replace(/^DECISION:\s*\w+\s*—\s*/i, "").trim();

    return {
      id: msg.id,
      phase,
      label: meta.label,
      detail,
      confidence: meta.confidence,
    };
  });
}
