import type { SharedNotePayload } from "@/lib/types";
import type { SkillAlignmentData } from "@/lib/presentation/insights";

interface Props {
  note: SharedNotePayload;
  alignment: SkillAlignmentData;
}

export function PersonPanel({ note, alignment }: Props) {
  const { student } = note;

  return (
    <div className="panel-enter space-y-6">
      <div className="rounded-3xl border border-sage/25 bg-gradient-to-br from-sage-soft/50 to-card p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-sage">
          Person under review
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-ink">{student.name}</h2>
        <p className="mt-1 text-ink-muted">
          {student.year} · {student.field}
        </p>
        {student.intake_summary ? (
          <p className="mt-4 leading-relaxed text-ink-muted">{student.intake_summary}</p>
        ) : null}
      </div>

      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-muted">
          Brings to the table
        </p>
        <div className="flex flex-wrap gap-2">
          {alignment.studentBrings.map((s) => (
            <span
              key={s}
              className="rounded-full border border-sage/30 bg-sage-soft/60 px-3 py-1.5 text-sm font-medium text-ink transition hover:scale-105"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {student.publications.length > 0 ? (
        <div className="rounded-2xl bg-card p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
            Publications
          </p>
          <ul className="mt-2 space-y-1 text-sm text-ink">
            {student.publications.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-cream-dark px-4 py-3 text-sm text-ink-muted">
          No publications on file — investigation leaned on intake signals.
        </p>
      )}
    </div>
  );
}
