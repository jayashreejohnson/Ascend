"""Negotiation loop: Student -> Professor -> Mediator, multi-turn, hard turn cap.

Flow:
  1. Build dossier via evaluate_fit (deterministic pre-screen).
  2. CLEAR_FIT / CLEAR_MISMATCH → skip agents, return immediately.
  3. AMBIGUOUS → run full negotiation (agents resolve uncertainty using dossier slices).

`stream_negotiation` is the single source of truth: it yields events as they
happen ("dossier", "turn", "decision"). `run_negotiation` consumes it for the
non-streaming callers (demo.py, the /negotiate endpoint); the SSE endpoint
consumes it directly for the live modal.
"""
from __future__ import annotations

from typing import Iterator

from app.agents.fit import evaluate_fit
from app.agents.mediator_agent import MediatorAgent
from app.agents.professor_agent import ProfessorAgent
from app.agents.student_agent import StudentAgent
from app.config import settings
from app.models import (
    AgentMessage,
    Dossier,
    DossierRouting,
    LabProject,
    NegotiationDecision,
    NegotiationResult,
    StudentProfile,
)

# An event is ("dossier", Dossier) | ("turn", AgentMessage) | ("decision", NegotiationResult)
NegotiationEvent = tuple[str, object]


def stream_negotiation(
    student: StudentProfile, project: LabProject
) -> Iterator[NegotiationEvent]:
    """Run the dossier pre-screen then (if AMBIGUOUS) the negotiation, yielding events.

    Yields, in order:
        ("dossier", Dossier)              once, up front
        ("turn", AgentMessage)            one per agent turn (AMBIGUOUS only)
        ("decision", NegotiationResult)   once, terminal
    """
    # --- Step 1: dossier ---
    dossier: Dossier = evaluate_fit(student, project, [])
    yield ("dossier", dossier)

    # --- Step 2: short-circuit on CLEAR paths (no agents) ---
    if dossier.routing == DossierRouting.CLEAR_FIT:
        yield ("decision", NegotiationResult(
            decision=NegotiationDecision.MATCH,
            justification=f"[CLEAR_FIT — no negotiation needed]\n{dossier.summary}",
            turns_used=0, conversation=[],
            student_id=student.id, project_id=project.id,
        ))
        return

    if dossier.routing == DossierRouting.CLEAR_MISMATCH:
        yield ("decision", NegotiationResult(
            decision=NegotiationDecision.NO_MATCH,
            justification=f"[CLEAR_MISMATCH — no negotiation needed]\n{dossier.summary}",
            turns_used=0, conversation=[],
            student_id=student.id, project_id=project.id,
        ))
        return

    # --- Step 3: AMBIGUOUS → run the three agents ---
    student_agent = StudentAgent()
    professor_agent = ProfessorAgent()
    mediator_agent = MediatorAgent()

    history: list[AgentMessage] = []
    turn = 0

    turn += 1
    student_msg = student_agent.open_inquiry(student, project, turn, dossier=dossier)
    history.append(student_msg)
    yield ("turn", student_msg)

    while turn < settings.max_turns:
        turn += 1
        prof_msg = professor_agent.screen(student, project, history, history[-1], turn, dossier=dossier)
        history.append(prof_msg)
        yield ("turn", prof_msg)

        at_cap = turn >= settings.max_turns
        mediator_msg, decision = mediator_agent.decide(
            student, project, history, turn + 1, force_terminal=at_cap, dossier=dossier
        )
        history.append(mediator_msg)
        yield ("turn", mediator_msg)

        if decision != NegotiationDecision.NEEDS_INFO or at_cap:
            yield ("decision", NegotiationResult(
                decision=decision, justification=mediator_msg.payload, turns_used=turn,
                conversation=history, student_id=student.id, project_id=project.id,
            ))
            return

        turn += 1
        student_resp = student_agent.respond(student, project, history, prof_msg, turn, dossier=dossier)
        history.append(student_resp)
        yield ("turn", student_resp)

    # Safety net (loop exhausted without a terminal decision)
    mediator_msg, decision = mediator_agent.decide(
        student, project, history, turn + 1, force_terminal=True, dossier=dossier
    )
    history.append(mediator_msg)
    yield ("decision", NegotiationResult(
        decision=decision, justification=mediator_msg.payload, turns_used=turn,
        conversation=history, student_id=student.id, project_id=project.id,
    ))


def run_negotiation(
    student: StudentProfile, project: LabProject
) -> tuple[Dossier, NegotiationResult]:
    """Non-streaming wrapper: consume stream_negotiation, print, return (dossier, result).

    Used by demo.py and the existing /negotiate endpoint. Single source of truth
    is stream_negotiation, so behavior cannot drift between the two paths.
    """
    dossier: Dossier | None = None
    result: NegotiationResult | None = None
    for event_type, payload in stream_negotiation(student, project):
        if event_type == "dossier":
            dossier = payload  # type: ignore[assignment]
            _print_dossier(payload)  # type: ignore[arg-type]
        elif event_type == "turn":
            _print_turn(payload)  # type: ignore[arg-type]
        elif event_type == "decision":
            result = payload  # type: ignore[assignment]
    return dossier, result  # type: ignore[return-value]


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
