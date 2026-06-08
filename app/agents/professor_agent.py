"""Professor Agent — screens candidates on behalf of the lab/PI.

Receives the RISKS slice of the dossier — hard requirements and identified gaps.
"""
from __future__ import annotations

from app.agent_runtime import register_identity, trace_event
from app.llm_client import complete
from app.models import AgentMessage, AgentRole, Dossier, LabProject, MessageIntent, StudentProfile

SYSTEM_PROMPT = """You are the Professor Agent in a research-match negotiation system.

Your role: Screen candidates for the lab. Enforce the real requirements honestly.

How to screen:
- Identify the SINGLE most important gap or risk in the student's case and press on
  exactly that. One focused objection per turn, not a checklist.
- Demand evidence. If the student agent claims or implies something the profile does
  not actually support, call it out and ask for the proof. Never accept "they probably
  can" or "almost certainly" as an answer.
- Be fair, not dismissive. If the student answers your objection with specific, real
  evidence from the profile, acknowledge it plainly and let it stand.
- Do not re-ask about things already clearly stated in the profile.

Be concise. One message per turn.
"""


class ProfessorAgent:
    def __init__(self) -> None:
        self.agent_id = register_identity(AgentRole.PROFESSOR)

    def screen(
        self,
        student: StudentProfile,
        project: LabProject,
        conversation_history: list[AgentMessage],
        student_message: AgentMessage,
        turn: int,
        dossier: Dossier | None = None,
    ) -> AgentMessage:
        """Evaluate the student agent's message.
        Uses the dossier's RISKS slice — hard requirements and identified gaps.
        """
        history_text = _format_history(conversation_history)
        risks_block = ""
        if dossier and dossier.risks:
            risks_block = "\nDossier risks / requirement gaps (enforce these):\n" + \
                "\n".join(f"- {r}" for r in dossier.risks)
        uncertainties_block = ""
        if dossier and dossier.uncertainties:
            uncertainties_block = "\nOpen uncertainties (probe these):\n" + \
                "\n".join(f"- {u}" for u in dossier.uncertainties)

        prompt = f"""
Lab project:
Title: {project.project_title}
Description: {project.description}
Required skills: {", ".join(project.required_skills)}
Preferred background: {", ".join(project.preferred_background)}

Negotiation so far:
{history_text}

Student agent's latest message:
{student_message.payload}
{risks_block}
{uncertainties_block}

Respond as the professor agent. If the fit looks strong, say so and explain why.
If there are gaps, name the most important one and ask one focused question.
If the student is clearly not a fit, be direct but fair.
"""
        reply = complete(SYSTEM_PROMPT, [{"role": "user", "content": prompt}])
        intent = MessageIntent.CLARIFY if (dossier and dossier.uncertainties) else MessageIntent.SCREEN
        msg = AgentMessage(
            from_agent=AgentRole.PROFESSOR,
            to_agent=AgentRole.STUDENT,
            intent=intent,
            payload=reply,
            turn=turn,
        )
        trace_event(self.agent_id, msg)
        return msg


def _format_history(msgs: list[AgentMessage]) -> str:
    return "\n".join(f"[Turn {m.turn}] {m.from_agent.value}: {m.payload}" for m in msgs)
