import type { SharedNotePayload } from "@/lib/types";
import { heroSummary, routingToMoment } from "@/lib/viewModel";
import type { CuriosityCardData } from "@/lib/presentation/insights";
import { CuriosityCard } from "@/components/ui/CuriosityCard";

interface Props {
  note: SharedNotePayload;
  curiosity: CuriosityCardData[];
}

export function OverviewPanel({ note, curiosity }: Props) {
  const { student, project, dossier } = note;
  const moment = routingToMoment(dossier.routing);

  return (
    <div className="panel-enter space-y-6">
      <div className="rounded-3xl border border-cream-dark bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-coral">Investigation open</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink sm:text-3xl">
          {student.name}{" "}
          <span className="font-normal text-ink-muted">meets</span>{" "}
          {project.project_title}
        </h2>
        <p className="mt-3 max-w-xl text-ink-muted">
          {heroSummary(dossier)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-honey-soft px-3 py-1 text-sm font-medium text-ink">
            {moment}
          </span>
          <span className="rounded-full bg-cream-dark px-3 py-1 text-sm text-ink-muted">
            {project.university} · {project.lab_name}
          </span>
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          <span className="font-medium text-ink">Tip:</span> Use the tabs below to
          uncover evidence, compare signals, and follow the investigation trail.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {curiosity.slice(0, 4).map((card, i) => (
          <CuriosityCard
            key={card.id}
            variant={card.variant}
            title={card.title}
            body={card.body}
            defaultOpen={i === 0}
          />
        ))}
      </div>
    </div>
  );
}
