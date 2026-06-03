interface SectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  variant?: "default" | "hero";
}

export function Section({
  id,
  title,
  subtitle,
  children,
  variant = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-6 ${variant === "hero" ? "mb-10" : "mb-8"}`}
    >
      <header className="mb-4">
        <h2
          className={`font-semibold tracking-tight text-ink ${
            variant === "hero" ? "text-2xl" : "text-xl"
          }`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-base text-ink-muted">{subtitle}</p>
        ) : null}
      </header>
      {children}
    </section>
  );
}
