"""evaluate_fit — Jayashree's interface.

She implements the body of evaluate_fit(). The stub below returns a hardcoded
AMBIGUOUS dossier so the full negotiation loop runs end-to-end before her logic arrives.

OUTPUT CONTRACT (do not change the signature or return type):
  evaluate_fit(student_profile, project, conversation_history) -> Dossier

Dossier fields:
  routing:             CLEAR_FIT | CLEAR_MISMATCH | AMBIGUOUS
                       CLEAR_* paths skip agents entirely.
  dimensions:          List of DossierDimension — one per evaluated axis
                       (e.g. "required_skills", "trajectory", "ownership_signals")
  strengths:           Student agent slice — evidence-backed signals to advocate with
  risks:               Professor agent slice — hard requirement gaps to probe
  uncertainties:       Mediator slice — what's genuinely unclear, triggered the negotiation
  overall_confidence:  float [0,1]
  summary:             1-paragraph human-readable overview (shown in logs + UI)
"""
from __future__ import annotations

from app.models import Dossier, DossierDimension, DossierRouting, LabProject, StudentProfile


def evaluate_fit(
    student_profile: StudentProfile,
    project: LabProject,
    conversation_history: list[dict],
) -> Dossier:
    """Assess fit between a student and a project given the negotiation so far.

    Args:
        student_profile: Full student record including intake_summary and extra_signals.
        project: Lab project with requirements and extra_requirements.
        conversation_history: List of {"role": "...", "content": "..."} dicts
            representing negotiation turns so far (empty on first call).

    Returns:
        Dossier with routing, dimensions, strengths, risks, uncertainties, and summary.
        Routing determines whether agents are invoked:
          CLEAR_FIT / CLEAR_MISMATCH → skip negotiation
          AMBIGUOUS → run full 3-agent negotiation
    """
    # --- PLACEHOLDER — Jayashree replaces this body ---
    return Dossier(
        routing=DossierRouting.AMBIGUOUS,
        dimensions=[
            DossierDimension(
                name="skills_match",
                evidence=student_profile.skills,
                assessment="Placeholder: skill matching not yet implemented.",
                confidence=0.5,
                gap="Jayashree's evaluate_fit not yet wired in",
            )
        ],
        strengths=[
            f"Has skills: {', '.join(student_profile.skills[:3])}" if student_profile.skills else "Skills unknown",
            student_profile.intake_summary[:120] if student_profile.intake_summary else "Intake summary pending",
        ],
        risks=[
            f"Required skills not yet verified against: {', '.join(project.required_skills[:3])}",
        ],
        uncertainties=[
            "Fit scoring logic not yet implemented — full negotiation triggered by default",
        ],
        overall_confidence=0.5,
        summary=(
            f"Placeholder dossier for {student_profile.name} applying to "
            f"'{project.project_title}'. Real scoring logic pending Jayashree's implementation."
        ),
    )
