"""Negotiation loop: Student -> Professor -> Mediator, multi-turn, hard turn cap.

Flow:
  1. Build dossier via evaluate_fit (deterministic pre-screen).
  2. CLEAR_FIT / CLEAR_MISMATCH → skip agents, return immediately.
  3. AMBIGUOUS → run full negotiation (agents resolve uncertainty using dossier slices).
"""
from __future__ import annotations

from app.agents.fit import evaluate_fit
from app.agents.mediator_agent import MediatorAgent
from app.agents.professor_agent import ProfessorAgent
from app.agents.student_agent import StudentAgent
from app.config import settings
from app.models import (
    AgentMessage,
    AgentRole,
    Dossier,
    DossierRouting,
    LabProject,
    MessageIntent,
    NegotiationDecision,
    NegotiationResult,
    StudentProfile,
)


def run_negotiation(
    student: StudentProfile, project: LabProject
) -> tuple[Dossier, NegotiationResult]:
    """Run the dossier pre-screen then (if AMBIGUOUS) the 3-agent negotiation.

    Returns:
        (dossier, result) — the dossier is always returned so callers can build
        the SharedNotePayload { student, project, dossier, result } for the UI.
    """

    # --- Step 1: Build the dossier ---
    dossier: Dossier = evaluate_fit(student, project, [])
    _print_dossier(dossier)

    # --- Step 2: Short-circuit on CLEAR paths ---
    if dossier.routing == DossierRouting.CLEAR_FIT:
        return dossier, NegotiationResult(
            decision=NegotiationDecision.MATCH,
            justification=f"[CLEAR_FIT — no negotiation needed]\n{dossier.summary}",
            turns_used=0,
            conversation=[],
            student_id=student.id,
            project_id=project.id,
        )

    if dossier.routing == DossierRouting.CLEAR_MISMATCH:
        return dossier, NegotiationResult(
            decision=NegotiationDecision.NO_MATCH,
            justification=f"[CLEAR_MISMATCH — no negotiation needed]\n{dossier.summary}",
            turns_used=0,
            conversation=[],
            student_id=student.id,
            project_id=project.id,
        )

    # --- Step 3: AMBIGUOUS → run agents ---
    student_agent = StudentAgent()
    professor_agent = ProfessorAgent()
    mediator_agent = MediatorAgent()

    history: list[AgentMessage] = []
    turn = 0

    # Turn 1: Student opens, armed with dossier strengths slice
    turn += 1
    student_msg = student_agent.open_inquiry(student, project, turn, dossier=dossier)
    history.append(student_msg)
    _print_turn(student_msg)

    while turn < settings.max_turns:
        # Professor screens — gets risks slice
        turn += 1
        prof_msg = professor_agent.screen(student, project, history, history[-1], turn, dossier=dossier)
        history.append(prof_msg)
        _print_turn(prof_msg)

        # Mediator decides — gets uncertainties slice + full transcript
        at_cap = turn >= settings.max_turns
        mediator_msg, decision = mediator_agent.decide(
            student, project, history, turn + 1, force_terminal=at_cap, dossier=dossier
        )
        history.append(mediator_msg)
        _print_turn(mediator_msg)

        if decision != NegotiationDecision.NEEDS_INFO or at_cap:
            return dossier, NegotiationResult(
                decision=decision,
                justification=mediator_msg.payload,
                turns_used=turn,
                conversation=history,
                student_id=student.id,
                project_id=project.id,
            )

        # Student responds — gets strengths slice
        turn += 1
        student_resp = student_agent.respond(student, project, history, prof_msg, turn, dossier=dossier)
        history.append(student_resp)
        _print_turn(student_resp)

    # Safety net
    mediator_msg, decision = mediator_agent.decide(
        student, project, history, turn + 1, force_terminal=True, dossier=dossier
    )
    history.append(mediator_msg)
    return dossier, NegotiationResult(
        decision=decision,
        justification=mediator_msg.payload,
        turns_used=turn,
        conversation=history,
        student_id=student.id,
        project_id=project.id,
    )


def _print_dossier(dossier: Dossier) -> None:
    bar = "=" * 60
    print(f"\n{bar}")
    print(f"  DOSSIER  ->  routing: {dossier.routing.value}  |  confidence: {dossier.overall_confidence:.2f}")
    print(bar)
    if dossier.summary:
        print(dossier.summary)
    if dossier.strengths:
        print("\nStrengths:")
        for s in dossier.strengths:
            print(f"  + {s}")
    if dossier.risks:
        print("\nRisks:")
        for r in dossier.risks:
            print(f"  ! {r}")
    if dossier.uncertainties:
        print("\nUncertainties (why negotiation was triggered):")
        for u in dossier.uncertainties:
            print(f"  ? {u}")


def _print_turn(msg: AgentMessage) -> None:
    bar = "-" * 60
    print(f"\n{bar}")
    print(f"  Turn {msg.turn} | {msg.from_agent.value.upper()} -> {msg.to_agent.value.upper()} [{msg.intent.value}]")
    print(bar)
    print(msg.payload)
