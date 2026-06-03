import type { NarrativeHero as HeroData } from "@/lib/presentation/lensExperience";
import type { ViewerLens } from "@/lib/types";

interface Props {
  hero: HeroData;
  lens: ViewerLens;
  subtitle: string;
  moment: string;
}

export function NarrativeHero({ hero, lens, subtitle, moment }: Props) {
  return (
    <header
      className={`relative overflow-hidden rounded-3xl border p-6 shadow-lg sm:p-10 ${
        lens === "for_me"
          ? "border-coral/30 bg-gradient-to-br from-coral/15 via-honey-soft/40 to-card"
          : "border-sage/30 bg-gradient-to-br from-sage/15 via-sage-soft/50 to-card"
      }`}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/40 blur-2xl"
        aria-hidden
      />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink-muted">
        Signal discovery
      </p>
      <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.15] text-ink sm:text-4xl md:text-[2.75rem]">
        {hero.hook}
      </h1>
      <div className="mt-6 space-y-2 border-l-4 border-ink/20 pl-4 sm:pl-6">
        <p className="text-lg text-ink-muted line-through decoration-coral/50 decoration-2">
          {hero.contrastA}
        </p>
        <p className="text-lg font-medium text-ink sm:text-xl">{hero.contrastB}</p>
      </div>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
        {hero.payoff}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            lens === "for_me" ? "bg-coral text-white" : "bg-sage text-white"
          }`}
        >
          {moment}
        </span>
        <span className="text-sm text-ink-muted">{subtitle}</span>
      </div>
    </header>
  );
}
