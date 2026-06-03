import type { TrailStep } from "@/lib/presentation/conversationTrail";
import { ConversationTrail } from "../ConversationTrail";

interface Props {
  steps: TrailStep[];
}

export function ConversationPanel({ steps }: Props) {
  return (
    <div className="panel-enter space-y-4">
      <div className="rounded-2xl border border-cream-dark bg-card/80 p-4">
        <h3 className="text-lg font-semibold text-ink">Investigation trail</h3>
        <p className="mt-1 text-sm text-ink-muted">
          Reviewers followed the evidence—not a scripted debate. Each step marks
          what surfaced, what was questioned, and how the path forward emerged.
        </p>
      </div>
      <ConversationTrail steps={steps} />
    </div>
  );
}
