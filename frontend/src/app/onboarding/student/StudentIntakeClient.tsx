"use client";

import { useEffect, useState } from "react";
import { StudentIntakeForm } from "@/components/onboarding/StudentIntakeForm";
import { loadStudentDraft } from "@/lib/onboarding/session";
import type { StudentIntake } from "@/lib/onboarding/types";

export function StudentIntakeClient() {
  const [initial, setInitial] = useState<StudentIntake | null | undefined>(
    undefined
  );

  useEffect(() => {
    setInitial(loadStudentDraft());
  }, []);

  if (initial === undefined) {
    return <p className="text-sm text-ink-muted">Loading…</p>;
  }

  return <StudentIntakeForm initial={initial} />;
}
