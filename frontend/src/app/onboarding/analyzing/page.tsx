import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { SignalAnalysisLoader } from "@/components/onboarding/SignalAnalysisLoader";

export default function AnalyzingPage() {
  return (
    <OnboardingShell
      step={4}
      title="Running signal analysis"
      subtitle="Building your dossier and opening the investigation."
    >
      <SignalAnalysisLoader />
    </OnboardingShell>
  );
}
