import type { SharedNotePayload } from "@/lib/types";
import type { SkillAlignmentData } from "@/lib/presentation/insights";

interface Props {
  note: SharedNotePayload;
  alignment: SkillAlignmentData;
}

export function OpportunityPanel({ note, alignment }: Props) {
  const { project } = note;

  return (
    <div className="panel-enter space-y-6">
      <div className="rounded-3xl border border-honey/30 bg-gradient-to-br from-honey-soft/50 to-card p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-honey">
          Opportunity
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">{project.project_title}</h2>
        <p className="mt-1 text-ink-muted">
          {project.pi_name} · {project.lab_name}
        </p>
        <p className="mt-4 leading-relaxed text-ink-muted">{project.description}</p>
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-muted">
          Needs from candidates
        </p>
        <div className="flex flex-wrap gap-2">
          {alignment.opportunityNeeds.map((s) => {
            const matched = alignment.overlap.some(
              (o) => o.toLowerCase() === s.toLowerCase()
            );
            return (
              <span
                key={s}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition hover:scale-105 ${
                  matched
                    ? "border-sage bg-sage text-white"
                    : "border-honey/40 bg-honey-soft/60 text-ink"
                }`}
              >
                {s}
              </span>
            );
          })}
        </div>
      </div>

      {project.preferred_background.length > 0 ? (
        <p className="text-sm text-ink-muted">
          Preferred background: {project.preferred_background.join(", ")}
        </p>
      ) : null}
    </div>
  );
}
