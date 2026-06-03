"""Professor Agent — screens candidates on behalf of the lab/PI.

Receives the RISKS slice of the dossier — hard requirements and identified gaps.
"""
from __future__ import annotations

from app.agent_runtime import register_identity, trace_event
from app.llm_client import complete
from app.models import AgentMessage, AgentRole, Dossier, LabProject, MessageIntent, StudentProfile

SYSTEM_PROMPT = """You are the Professor Agent in a research-match negotiation system.

Your role: Screen candidates on behalf of the PI and lab. You have hard constraints —
required skills, lab culture, project fit — and you enforce them honestly.

You are not dismissive. If the student agent surfaces a compelling signal you hadn't
accounted for, acknowledge it and adjust your assessment.

Ask clarifying questions when the student's case is incomplete. One focused question
per turn. Do not ask about things already stated in the profile.

Be concise. Each message is one negotiation turn.
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
