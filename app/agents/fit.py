"""evaluate_fit — Jayashree's interface (she owns the body).

Tonight's plan (per OfficeHours Logic v0): rules-only, no LLM inside evaluate_fit.
The dossier is the inspectable layer judges trust; agents call the LLM separately.

OWNERSHIP: Jayashree implements the body to match the Dossier schema below.
Shageenth owns the schema (app/models.py), prompt slices, and API/log wiring.

OUTPUT CONTRACT (do not change the signature or return type):
  evaluate_fit(student_profile, project, conversation_history) -> Dossier

Dossier fields (see app/models.py for the source of truth):
  routing:            CLEAR_FIT | CLEAR_MISMATCH | AMBIGUOUS   (CLEAR_* skip agents)
  dimensions:         list[DossierDimension] — one per evaluated axis
  strengths:          student-advocate slice — evidence-backed signals to advocate with
  risks:              professor/gate slice — skill_gaps + preferred-background gap
  uncertainties:      mediator slice — open questions (max 2)
  skills_met:         e.g. "3/4" — required-skill coverage
  skill_gaps:         required skills not explicitly met
  routing_reason:     one-line why-this-routing
  overall_confidence: float [0,1]  (display only)
  summary:            human-readable one-paragraph overview

Routing rules (v0):
  - missing required skill with no evidence (skills + intake + extra_signals) -> CLEAR_MISMATCH
  - all required met + strong extra_signals (ownership) -> AMBIGUOUS (Aisha demo case)
  - all required met + no material gaps -> CLEAR_FIT
  - preferred-background gap is SOFT only — never CLEAR_MISMATCH on its own
  - conversation_history that surfaces a gapped skill -> drop it from open_questions

NOTE: A full working reference implementation of this body lives on the branch
`fit-reference-impl` if a baseline is useful. `main` is intentionally a stub so
Jayashree writes the body fresh.
"""
from __future__ import annotations

from app.models import Dossier, DossierDimension, DossierRouting, LabProject, StudentProfile


def evaluate_fit(
    student_profile: StudentProfile,
    project: LabProject,
    conversation_history: list[dict],
) -> Dossier:
    """Assess fit between a student and a project. Rules-only, no LLM (v0).

    Args:
        student_profile: Full student record (skills, intake_summary, extra_signals).
        project: Lab project with required_skills, preferred_background.
        conversation_history: Negotiation turns so far (empty on first call).

    Returns:
        Dossier — see contract in module docstring. Routing decides whether agents run:
          CLEAR_FIT / CLEAR_MISMATCH -> skip negotiation
          AMBIGUOUS -> run full 3-agent negotiation
    """
    # --- PLACEHOLDER — Jayashree implements the rules body here ---
    return Dossier(
        routing=DossierRouting.AMBIGUOUS,
        dimensions=[
            DossierDimension(
                name="skills_match",
                evidence=student_profile.skills,
                assessment="Placeholder: rules not yet implemented.",
                confidence=0.5,
                gap="evaluate_fit body pending (Jayashree)",
            )
        ],
        strengths=[f"Listed skills: {', '.join(student_profile.skills)}" if student_profile.skills else "Skills unknown"],
        risks=[f"Required not yet verified: {', '.join(project.required_skills)}"] if project.required_skills else [],
        uncertainties=["Fit rules not yet implemented — full negotiation triggered by default"],
        skills_met="?",
        skill_gaps=[],
        routing_reason="Placeholder stub always routes AMBIGUOUS so the loop runs end-to-end.",
        overall_confidence=0.5,
        summary=(
            f"Placeholder dossier for {student_profile.name} vs '{project.project_title}'. "
            "Rules body pending Jayashree's implementation."
        ),
    )
