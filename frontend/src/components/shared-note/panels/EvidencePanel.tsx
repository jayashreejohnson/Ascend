import type { SharedNotePayload } from "@/lib/types";
import { heroSummary } from "@/lib/viewModel";
import type { CuriosityCardData, SkillAlignmentData } from "@/lib/presentation/insights";
import { CuriosityCard } from "@/components/ui/CuriosityCard";
import { SkillAlignment } from "../SkillAlignment";

interface Props {
  note: SharedNotePayload;
  alignment: SkillAlignmentData;
  curiosity: CuriosityCardData[];
}

export function EvidencePanel({ note, alignment, curiosity }: Props) {
  const { dossier } = note;

  return (
    <div className="panel-enter space-y-6">
      <SkillAlignment data={alignment} />

      <div className="rounded-2xl border border-honey/40 bg-honey-soft/30 p-5">
        <p className="text-sm leading-relaxed text-ink">{heroSummary(dossier)}</p>
      </div>

      {(dossier.strengths.length > 0 || dossier.risks.length > 0) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {dossier.strengths.length > 0 ? (
            <div className="rounded-2xl border border-sage/30 bg-sage-soft/30 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-sage">
                Strengths surfaced
              </p>
              <ul className="mt-2 space-y-2">
                {dossier.strengths.map((s) => (
                  <li key={s} className="text-sm text-ink">
                    + {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {dossier.risks.length > 0 ? (
            <div className="rounded-2xl border border-coral/25 bg-coral-soft/25 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-coral">
                Risks flagged
              </p>
              <ul className="mt-2 space-y-2">
                {dossier.risks.map((r) => (
                  <li key={r} className="text-sm text-ink-muted">
                    · {r}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      {dossier.dimensions.map((dim) => (
        <details
          key={dim.name}
          className="group rounded-2xl border border-cream-dark bg-card shadow-sm transition hover:shadow-md"
          open
        >
          <summary className="cursor-pointer list-none p-4 [&::-webkit-details-marker]:hidden">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{dim.name}</p>
                <p className="mt-1 text-sm text-ink-muted line-clamp-2">
                  {dim.assessment}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-sage/15 px-2.5 py-1 text-xs font-semibold text-sage">
                {Math.round(dim.confidence * 100)}% confidence
              </span>
            </div>
          </summary>
          <div className="border-t border-cream-dark px-4 pb-4 pt-2">
            {dim.evidence.length > 0 ? (
              <ul className="mb-2 space-y-1 text-sm text-ink-muted">
                {dim.evidence.map((e) => (
                  <li key={e}>· {e}</li>
                ))}
              </ul>
            ) : null}
            {dim.gap ? (
              <p className="text-sm text-coral">
                Gap: <span className="font-medium">{dim.gap}</span>
              </p>
            ) : null}
          </div>
        </details>
      ))}

      <div className="grid gap-3 sm:grid-cols-2">
        {curiosity.map((card) => (
          <CuriosityCard
            key={card.id}
            variant={card.variant}
            title={card.title}
            body={card.body}
          />
        ))}
      </div>
    </div>
  );
}
