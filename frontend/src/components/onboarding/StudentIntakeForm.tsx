"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { StudentIntake } from "@/lib/onboarding/types";
import { EMPTY_STUDENT_INTAKE } from "@/lib/onboarding/types";
import { saveStudentDraft } from "@/lib/onboarding/session";

interface Props {
  initial?: StudentIntake | null;
}

const DEMO_PREFILL: StudentIntake = {
  name: "Aisha Patel",
  email: "aisha@demo.edu",
  year: "PhD Year 1",
  field: "Computer Science",
  skills: "Python, PyTorch, ROS, C++, hardware",
  interests: "robotics, machine learning, hardware",
  intakeStory:
    "I'm early in my PhD with no publications yet. During intake I shared that I built a 6-DOF robotic arm from scratch—custom PCBs, PID control in C++—and contributed to a ROS2 package with 400 GitHub stars.",
  hiddenSignals: "Garage-built arm, open-source ROS2 work, not on my CV headline",
};

export function StudentIntakeForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<StudentIntake>(initial ?? EMPTY_STUDENT_INTAKE);

  function update<K extends keyof StudentIntake>(key: K, value: StudentIntake[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveStudentDraft(form);
    router.push("/onboarding/opportunity");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <button
        type="button"
        onClick={() => setForm(DEMO_PREFILL)}
        className="text-sm font-medium text-coral hover:underline"
      >
        Fill demo student (Aisha-style story)
      </button>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" required>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
            placeholder="Aisha Patel"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
            placeholder="you@university.edu"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Year / stage">
          <input
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
            className={inputClass}
            placeholder="PhD Year 1"
          />
        </Field>
        <Field label="Field">
          <input
            value={form.field}
            onChange={(e) => update("field", e.target.value)}
            className={inputClass}
            placeholder="Computer Science"
          />
        </Field>
      </div>

      <Field label="Skills (comma-separated)">
        <input
          value={form.skills}
          onChange={(e) => update("skills", e.target.value)}
          className={inputClass}
          placeholder="Python, ROS, hardware"
        />
      </Field>

      <Field label="Interests (comma-separated)">
        <input
          value={form.interests}
          onChange={(e) => update("interests", e.target.value)}
          className={inputClass}
          placeholder="robotics, ML"
        />
      </Field>

      <Field label="Your story (what's not obvious on paper?)" required>
        <textarea
          required
          rows={5}
          value={form.intakeStory}
          onChange={(e) => update("intakeStory", e.target.value)}
          className={inputClass}
          placeholder="Projects, builds, side work recruiters might miss..."
        />
      </Field>

      <Field label="Hidden signals (optional)">
        <textarea
          rows={3}
          value={form.hiddenSignals}
          onChange={(e) => update("hiddenSignals", e.target.value)}
          className={inputClass}
          placeholder="Anything you almost didn't mention..."
        />
      </Field>

      <p className="text-xs text-ink-muted">
        This intake becomes the first layer of your investigation. OfficeHours looks
        for signals—not just keywords.
      </p>

      <button type="submit" className={btnPrimary}>
        Continue to opportunity →
      </button>
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
  "w-full rounded-xl border border-cream-dark bg-card px-4 py-2.5 text-ink placeholder:text-ink-muted/60 focus:border-coral focus:outline-none focus:ring-2 focus:ring-coral/20";

const btnPrimary =
  "w-full rounded-2xl bg-coral px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2";
