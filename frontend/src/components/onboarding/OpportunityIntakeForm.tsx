"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OpportunityIntake } from "@/lib/onboarding/types";
import { EMPTY_OPPORTUNITY_INTAKE } from "@/lib/onboarding/types";
import {
  loadStudentDraft,
  saveOpportunityDraft,
} from "@/lib/onboarding/session";

interface Props {
  initial?: OpportunityIntake | null;
}

const DEMO_PREFILL: OpportunityIntake = {
  projectTitle: "Soft Robotics for Minimally Invasive Surgery",
  piName: "Daniela Rus",
  labName: "CSAIL Distributed Robotics Lab",
  university: "MIT",
  description:
    "Develop soft robotic systems for medical applications. Students design, fabricate, and test actuators. CAD, 3D printing, and Python control experience preferred.",
  requiredSkills: "Python, CAD, hardware, robotics",
  preferredBackground: "Mechanical Engineering, Biomedical Engineering",
};

export function OpportunityIntakeForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<OpportunityIntake>(
    initial ?? EMPTY_OPPORTUNITY_INTAKE
  );

  function update<K extends keyof OpportunityIntake>(
    key: K,
    value: OpportunityIntake[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!loadStudentDraft()) {
      router.push("/onboarding/student");
      return;
    }
    saveOpportunityDraft(form);
    router.push("/onboarding/analyzing");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="button"
        onClick={() => setForm(DEMO_PREFILL)}
        className="text-sm font-medium text-sage hover:underline"
      >
        Fill demo opportunity (MIT soft robotics)
      </button>

      <Field label="Project title" required>
        <input
          required
          value={form.projectTitle}
          onChange={(e) => update("projectTitle", e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="PI name">
          <input
            value={form.piName}
            onChange={(e) => update("piName", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Lab name">
          <input
            value={form.labName}
            onChange={(e) => update("labName", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="University">
        <input
          value={form.university}
          onChange={(e) => update("university", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Description" required>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Required skills (comma-separated)" required>
        <input
          required
          value={form.requiredSkills}
          onChange={(e) => update("requiredSkills", e.target.value)}
          className={inputClass}
          placeholder="Python, CAD, robotics"
        />
      </Field>

      <Field label="Preferred background (optional)">
        <input
          value={form.preferredBackground}
          onChange={(e) => update("preferredBackground", e.target.value)}
          className={inputClass}
        />
      </Field>

      <p className="text-xs text-ink-muted">
        Next: OfficeHours runs a signal analysis pass, then opens your shared
        investigation.
      </p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => router.push("/onboarding/student")}
          className="rounded-2xl border border-cream-dark bg-card px-6 py-3 text-sm font-medium text-ink"
        >
          ← Back
        </button>
        <button type="submit" className={`${btnPrimary} flex-1`}>
          Run signal analysis →
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">
        {label}
        {required ? <span className="text-coral"> *</span> : null}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-cream-dark bg-card px-4 py-2.5 text-ink focus:border-sage focus:outline-none focus:ring-2 focus:ring-sage/20";

const btnPrimary =
  "rounded-2xl bg-sage px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-105";
