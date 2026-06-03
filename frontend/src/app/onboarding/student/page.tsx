import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { StudentIntakeClient } from "./StudentIntakeClient";

export default function StudentIntakePage() {
  return (
    <OnboardingShell
      step={2}
      title="Tell us about you"
      subtitle="Surface the signals that don't live on your résumé. This is where investigations begin."
    >
      <StudentIntakeClient />
    </OnboardingShell>
  );
}
