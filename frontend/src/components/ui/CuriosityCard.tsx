import type { CuriosityVariant } from "@/lib/presentation/insights";
import { curiosityVariantLabel } from "@/lib/presentation/insights";

const VARIANT_STYLES: Record<
  CuriosityVariant,
  { border: string; bg: string; accent: string }
> = {
  "fun-fact": {
    border: "border-honey/50",
    bg: "bg-honey-soft/60",
    accent: "text-honey",
  },
  "quick-insight": {
    border: "border-sage/40",
    bg: "bg-sage-soft/50",
    accent: "text-sage",
  },
  "hidden-signal": {
    border: "border-coral/40",
    bg: "bg-coral-soft/40",
    accent: "text-coral",
  },
  "why-interesting": {
    border: "border-ink/10",
    bg: "bg-card",
    accent: "text-ink",
  },
  learned: {
    border: "border-sage/30",
    bg: "bg-gradient-to-br from-sage-soft/80 to-card",
    accent: "text-sage",
  },
};

interface Props {
  variant: CuriosityVariant;
  title: string;
  body: string;
  defaultOpen?: boolean;
}

export function CuriosityCard({ variant, title, body, defaultOpen }: Props) {
  const style = VARIANT_STYLES[variant];
  const tag = curiosityVariantLabel(variant);

  return (
    <details
      className={`group curiosity-card rounded-2xl border ${style.border} ${style.bg} p-4 shadow-sm transition-shadow hover:shadow-md`}
      open={defaultOpen}
    >
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${style.accent}`}
            >
              {tag}
            </span>
            <p className="mt-1 text-sm font-semibold text-ink">{title}</p>
          </div>
          <span
            className="mt-1 shrink-0 text-ink-muted transition-transform group-open:rotate-180"
            aria-hidden
          >
            ▾
          </span>
        </div>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted animate-fade-in">
        {body}
      </p>
    </details>
  );
}
