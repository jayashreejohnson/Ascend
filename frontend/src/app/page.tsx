import Link from "next/link";
import { MOMENT_CARDS } from "@/lib/mock/notes";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="relative px-4 py-16 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-honey-soft)_0%,_transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral-soft/50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-coral">
            <span aria-hidden>📡</span> Signal discovery
          </p>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl md:text-6xl">
            OfficeHours uncovers what filters miss
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-muted">
            Start with your story and an opportunity. We surface hidden signals,
            build a fit dossier, and open a shared investigation—not a résumé dump.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-4 pb-8">
        <div className="rounded-3xl border-2 border-coral/40 bg-card p-8 shadow-lg">
          <h2 className="text-xl font-bold text-ink">Create an investigation</h2>
          <p className="mt-2 text-sm text-ink-muted">
            ~2 minutes: tell us about you, describe the opportunity, watch signal
            analysis run, then explore the full investigation.
          </p>
          <ol className="mt-6 space-y-3 text-left text-sm text-ink-muted">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral-soft text-xs font-bold text-coral">
                1
              </span>
              Student intake — your skills and hidden story
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-honey-soft text-xs font-bold text-ink">
                2
              </span>
              Opportunity intake — what the role needs
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-soft text-xs font-bold text-sage">
                3
              </span>
              Signal analysis → open investigation
            </li>
          </ol>
          <Link
            href="/onboarding/student"
            className="mt-8 block w-full rounded-2xl bg-coral py-3.5 text-center text-base font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            Start investigation →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-md px-4 pb-20 pt-4">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-ink-muted">
          Or skip to a sample
        </p>
        <ul className="mt-4 space-y-3">
          {MOMENT_CARDS.map((card, i) => (
            <li key={`${card.studentId}-${card.projectId}`}>
              <Link
                href={`/note/${card.studentId}/${card.projectId}`}
                className={`block rounded-xl border bg-card p-4 text-sm transition hover:shadow-md ${
                  i === 0 ? "border-coral/40" : "border-cream-dark"
                }`}
              >
                <span className="font-semibold text-ink">{card.title}</span>
                <span className="mt-1 block text-ink-muted">{card.subtitle}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
