"""Mediator Agent — neutral, forces a terminal decision.

Receives the UNCERTAINTIES slice of the dossier — what's genuinely unclear —
plus the full negotiation transcript. Produces an auditable decision.
"""
from __future__ import annotations

from app.agent_runtime import log_decision, register_identity, trace_event
from app.llm_client import complete
from app.models import (
    AgentMessage,
    AgentRole,
    Dossier,
    LabProject,
    MessageIntent,
    NegotiationDecision,
    StudentProfile,
)

SYSTEM_PROMPT = """You are the Mediator Agent in a research-match negotiation system.

Your role: Neutral arbiter. You are loyal to neither the student nor the professor.
You observe the full negotiation and make a binding decision with an audit trail.

You MUST output your decision on the FIRST line in exactly one of these formats:
  DECISION: MATCH
  DECISION: NO_MATCH
  DECISION: NEEDS_INFO

Then provide a written justification of 2-5 sentences. Cite specific evidence from
the negotiation transcript — do not make generic statements. Name what resolved the
uncertainty (for MATCH/NO_MATCH) or what specific information is still needed (for NEEDS_INFO).

Rules:
- MATCH: the transcript contains real, stated evidence that the student meets the bar.
  Actual skills or experience in the profile, not speculation and not "probably."
- NEEDS_INFO: the student may well fit, but the profile does not contain enough evidence
  to confirm it. Name exactly what additional information would settle it. PREFER
  NEEDS_INFO over NO_MATCH whenever the problem is MISSING information rather than a
  proven mismatch. This is the honest outcome for a thin profile.
- NO_MATCH: the transcript shows a genuine, evidence-based mismatch — a real requirement
  the student demonstrably does not meet, with no compensating evidence.

Never credit a claim the professor showed was unsupported, and never reward "probably
has it" reasoning. If the student conceded a point, treat it as unproven. No fabricated
matches. Your justification must be inspectable.
"""


class MediatorAgent:
    def __init__(self) -> None:
        self.agent_id = register_identity(AgentRole.MEDIATOR)

    def decide(
        self,
        student: StudentProfile,
        project: LabProject,
        conversation_history: list[AgentMessage],
        turn: int,
        force_terminal: bool = False,
        dossier: Dossier | None = None,
    ) -> tuple[AgentMessage, NegotiationDecision]:
        """Review the negotiation transcript and dossier uncertainties, emit a decision."""
        history_text = _format_history(conversation_history)

        uncertainties_block = ""
        if dossier and dossier.uncertainties:
            uncertainties_block = "\nDossier uncertainties that triggered this negotiation:\n" + \
                "\n".join(f"- {u}" for u in dossier.uncertainties)

        summary_block = f"\nDossier summary: {dossier.summary}" if dossier and dossier.summary else ""

        prompt = f"""
Full negotiation transcript:
{history_text}
{uncertainties_block}
{summary_block}

{'IMPORTANT: This is the final turn. Give your terminal decision now. MATCH if the evidence confirms fit, NO_MATCH if there is a clear mismatch, or NEEDS_INFO if the case is simply unproven because key evidence is missing from the profile (name what is missing).' if force_terminal else ''}

Issue your decision now. Cite specific evidence from the transcript in your justification.
"""
        reply = complete(SYSTEM_PROMPT, [{"role": "user", "content": prompt}], max_tokens=512)
        decision = _parse_decision(reply)

        msg = AgentMessage(
            from_agent=AgentRole.MEDIATOR,
            to_agent=AgentRole.SYSTEM,
            intent=MessageIntent.DECIDE,
            payload=reply,
            turn=turn,
        )
        trace_event(self.agent_id, msg)
        log_decision(self.agent_id, decision, reply)
        return msg, decision


def _parse_decision(text: str) -> NegotiationDecision:
    """Parse the mediator's decision. NEEDS_INFO is a valid terminal outcome
    (thin-evidence case), so it is never force-converted to NO_MATCH."""
    upper = text.upper()
    # Check NO_MATCH before MATCH, since "DECISION: NO_MATCH" contains "MATCH".
    if "DECISION: NO_MATCH" in upper:
        return NegotiationDecision.NO_MATCH
    if "DECISION: NEEDS_INFO" in upper:
        return NegotiationDecision.NEEDS_INFO
    if "DECISION: MATCH" in upper:
        return NegotiationDecision.MATCH
    # Loose fallbacks if the model drifted from the format.
    if "NO_MATCH" in upper:
        return NegotiationDecision.NO_MATCH
    if "NEEDS_INFO" in upper:
        return NegotiationDecision.NEEDS_INFO
    if "MATCH" in upper:
        return NegotiationDecision.MATCH
    return NegotiationDecision.NEEDS_INFO  # safest honest default: inconclusive


def _format_history(msgs: list[AgentMessage]) -> str:
    return "\n".join(f"[Turn {m.turn}] {m.from_agent.value}: {m.payload}" for m in msgs)
