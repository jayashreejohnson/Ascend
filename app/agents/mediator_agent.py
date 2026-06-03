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
- MATCH: The negotiation resolved enough uncertainty to confirm fit.
- NO_MATCH: The negotiation revealed a clear and unresolvable mismatch.
- NEEDS_INFO: A specific gap remains that, if clarified, could change the outcome.
  Only use NEEDS_INFO if genuinely undecidable. Do not use it to delay.
  NEEDS_INFO is not available once the turn cap is reached.

No fabricated matches. Your justification must be inspectable.
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

{'IMPORTANT: The turn cap has been reached. You MUST issue MATCH or NO_MATCH. NEEDS_INFO is not allowed.' if force_terminal else ''}

Issue your decision now. Cite specific evidence from the transcript in your justification.
"""
        reply = complete(SYSTEM_PROMPT, [{"role": "user", "content": prompt}], max_tokens=512)
        decision = _parse_decision(reply, force_terminal)

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


def _parse_decision(text: str, force_terminal: bool) -> NegotiationDecision:
    upper = text.upper()
    if "DECISION: MATCH" in upper and "NO_MATCH" not in upper:
        return NegotiationDecision.MATCH
    if "DECISION: NO_MATCH" in upper:
        return NegotiationDecision.NO_MATCH
    if "DECISION: NEEDS_INFO" in upper and not force_terminal:
        return NegotiationDecision.NEEDS_INFO
    if "NO_MATCH" in upper:
        return NegotiationDecision.NO_MATCH
    if force_terminal:
        return NegotiationDecision.NO_MATCH
    return NegotiationDecision.NEEDS_INFO


def _format_history(msgs: list[AgentMessage]) -> str:
    return "\n".join(f"[Turn {m.turn}] {m.from_agent.value}: {m.payload}" for m in msgs)
