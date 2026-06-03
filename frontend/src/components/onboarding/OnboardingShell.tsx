import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  step: 1 | 2 | 3 | 4;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const STEPS = ["Start", "You", "Opportunity", "Analyze"];

export function OnboardingShell({ step, title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-cream-dark bg-card/80 px-4 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-ink hover:text-coral">
            OfficeHours
          </Link>
          <div className="flex gap-1">
            {STEPS.map((label, i) => {
              const n = i + 1;
              const done = n < step;
              const current = n === step;
              return (
                <span
                  key={label}
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    current
                      ? "bg-coral text-white"
                      : done
                        ? "bg-sage/20 text-sage"
                        : "bg-cream-dark text-ink-muted"
                  }`}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
        <h1 className="font-serif text-3xl font-semibold text-ink">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-ink-muted">{subtitle}</p>
        ) : null}
        <div className="mt-8">{children}</div>
      </main>
    </div>
  );
}
