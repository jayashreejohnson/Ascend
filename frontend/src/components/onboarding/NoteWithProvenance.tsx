"use client";

import { useEffect, useState } from "react";
import type { SharedNotePayload } from "@/lib/types";
import { loadIntakeSession } from "@/lib/onboarding/session";
import { resolveDemoInvestigation } from "@/lib/onboarding/resolveDemo";
import type { IntakeSession } from "@/lib/onboarding/types";
import { InvestigationProvenance } from "./InvestigationProvenance";
import { SharedNoteView } from "../shared-note/SharedNoteView";

interface Props {
  note: SharedNotePayload;
  showCreatedBanner?: boolean;
}

export function NoteWithProvenance({ note, showCreatedBanner }: Props) {
  const [session, setSession] = useState<IntakeSession | null>(null);

  useEffect(() => {
    setSession(loadIntakeSession());
  }, []);

  const demoLabel = session
    ? resolveDemoInvestigation(session).label
    : "";

  return (
    <>
      {showCreatedBanner && session ? (
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
          <InvestigationProvenance session={session} demoLabel={demoLabel} />
        </div>
      ) : null}
      <SharedNoteView note={note} />
    </>
  );
}
