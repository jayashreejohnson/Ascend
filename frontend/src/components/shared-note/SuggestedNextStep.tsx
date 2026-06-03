"use client";

import { useMemo } from "react";
import type { LabProject, ViewerLens } from "@/lib/types";
import {
  buildNextStepActions,
  handleStubAction,
} from "@/lib/nextSteps/buildActions";
import { nextStepFrameCopy } from "@/lib/viewModel";

interface Props {
  project: LabProject;
  lens: ViewerLens;
  positiveRecommendation: boolean;
}

function PrimaryButton({
  label,
  hint,
  onClick,
  href,
}: {
  label: string;
  hint?: string;
  onClick?: () => void;
  href?: string;
}) {
  const className =
    "flex w-full min-h-12 flex-col items-start justify-center rounded-2xl bg-coral px-5 py-4 text-left text-white shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        <span className="text-base font-semibold">{label}</span>
        {hint ? <span className="mt-0.5 text-sm text-white/85">{hint}</span> : null}
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      <span className="text-base font-semibold">{label}</span>
      {hint ? <span className="mt-0.5 text-sm text-white/85">{hint}</span> : null}
    </button>
  );
}

function ExploreRow({
  label,
  hint,
  href,
  missing,
}: {
  label: string;
  hint?: string;
  href?: string;
  missing?: boolean;
}) {
  const base =
    "flex min-h-11 items-center justify-between gap-3 rounded-xl border border-cream-dark bg-card px-4 py-3 text-left transition";

  if (missing || !href) {
    return (
      <div
        className={`${base} cursor-default opacity-60`}
        title="Not shared yet"
        aria-disabled
      >
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
        </div>
        <span className="shrink-0 text-xs text-ink-muted">Not shared yet</span>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} hover:border-sage/40 hover:bg-sage-soft/30`}
    >
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
      </div>
      <span className="shrink-0 text-sage" aria-hidden>
        →
      </span>
    </a>
  );
}

function ConnectButton({
  label,
  hint,
  primary,
  onClick,
}: {
  label: string;
  hint?: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 flex-1 flex-col items-start rounded-xl px-4 py-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${
        primary
          ? "border-2 border-coral bg-coral-soft/40 text-ink"
          : "border border-cream-dark bg-card text-ink hover:border-sage/50"
      }`}
    >
      <span className="text-sm font-semibold">{label}</span>
      {hint ? <span className="mt-0.5 text-xs text-ink-muted">{hint}</span> : null}
    </button>
  );
}

export function SuggestedNextStep({
  project,
  lens,
  positiveRecommendation,
}: Props) {
  const built = useMemo(
    () =>
      buildNextStepActions({
        project,
        lens,
        positiveRecommendation,
      }),
    [project, lens, positiveRecommendation]
  );

  const frame = nextStepFrameCopy(lens, positiveRecommendation);
  const { primary, explore, connect, showConnect } = built;

  return (
    <div className="rounded-3xl border border-cream-dark bg-card/80 p-5 shadow-sm sm:p-6">
      <div
        id="coordination-toast"
        role="status"
        className="mb-4 hidden rounded-xl border border-sage/40 bg-sage-soft/80 px-4 py-3 text-sm font-medium text-ink"
      />
      <p className="mb-5 text-sm leading-relaxed text-ink-muted">{frame}</p>

      {primary ? (
        <div className="mb-6">
          {primary.handler === "external" && primary.url ? (
            <PrimaryButton
              label={primary.label}
              hint={primary.hint}
              href={primary.url}
            />
          ) : (
            <PrimaryButton
              label={primary.label}
              hint={primary.hint}
              onClick={() => handleStubAction(primary.kind)}
            />
          )}
        </div>
      ) : (
        <p className="mb-6 rounded-xl bg-cream-dark/60 px-4 py-3 text-sm text-ink-muted">
          No links are available yet. Check back when the lab shares more details.
        </p>
      )}

      <div className="mb-6">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          Explore
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {explore.map((action) => (
            <ExploreRow
              key={action.id}
              label={action.label}
              hint={action.hint}
              href={action.status === "ready" ? action.url : undefined}
              missing={action.status === "missing"}
            />
          ))}
        </div>
      </div>

      {showConnect && connect.length > 0 ? (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Connect
          </h3>
          <div className="flex flex-col gap-2 sm:flex-row">
            {connect.map((action) => (
              <ConnectButton
                key={action.id}
                label={action.label}
                hint={action.hint}
                onClick={() => handleStubAction(action.kind)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
