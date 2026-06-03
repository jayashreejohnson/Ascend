import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { OpportunityIntakeForm } from "@/components/onboarding/OpportunityIntakeForm";

export default function OpportunityIntakePage() {
  return (
    <OnboardingShell
      step={3}
      title="Describe the opportunity"
      subtitle="What does the lab or project need? We'll match it against your signals—not keywords alone."
    >
      <OpportunityIntakeForm />
    </OnboardingShell>
  );
}
