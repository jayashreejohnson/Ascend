"""Bridge between the deployed app (Supabase) and the agent engine.

The deployed Ascend app collects topics + a free-text bio, not an explicit skills
list or structured evidence. To make the dossier meaningful on that data we:
  - extract required skills from the opportunity description,
  - extract the student's skills from their bio + topics,
  - infer ownership/evidence signals from achievement language in the bio.

This keeps the agent engine untouched: we just feed it well-mapped inputs.
"""
from __future__ import annotations

from pydantic import BaseModel, ConfigDict

from app.agents.fit import SKILL_ALIASES
from app.models import LabProject, StudentProfile


# ---------------------------------------------------------------------------
# Incoming shapes (Supabase rows). extra="ignore" so the frontend can send the
# whole row without us listing every column.
# ---------------------------------------------------------------------------

class StudentIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str | None = None
    email: str | None = None
    major: str | None = None
    year: str | None = None
    topics: list[str] = []
    gpa_range: str | None = None
    hours_per_week: int | None = None
    bio: str | None = None
    university: str | None = None


class OpportunityIn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    title: str
    description: str = ""
    topics: list[str] = []
    opportunity_type: str | None = None
    gpa_min: float | None = None
    hours_per_week: int | None = None
    pi_name: str | None = None
    department: str | None = None
    university: str | None = None


class NegotiateStreamRequest(BaseModel):
    student: StudentIn
    opportunity: OpportunityIn


# ---------------------------------------------------------------------------
# Extraction helpers
# ---------------------------------------------------------------------------

# Achievement language → the ownership signal it implies. Detecting any of these
# in a bio gives the dossier the "this person builds things" evidence it needs,
# so a rich bio routes AMBIGUOUS (hearing) instead of CLEAR_MISMATCH.
_OWNERSHIP_MARKERS: dict[str, list[str]] = {
    "side_project": ["built", "designed", "created", "developed", "made", "prototyped", "from scratch"],
    "open_source": ["open source", "open-source", "github", "stars", "contributed", "maintainer"],
    "publication": ["published", "paper", "publication", "co-authored", "preprint"],
    "competition": ["hackathon", "competition", "won", "winner", "finalist", "award"],
    "startup": ["founded", "co-founded", "startup", "launched", "shipped to"],
    "independent_project": ["independent", "self-directed", "personal project", "capstone", "thesis"],
}


def extract_skills_from_text(*texts: str) -> list[str]:
    """Return canonical skills whose aliases appear in the given text(s)."""
    blob = " ".join(t for t in texts if t).lower()
    found: list[str] = []
    for canonical, aliases in SKILL_ALIASES.items():
        if any(alias in blob for alias in aliases):
            found.append(canonical)
    return found


def infer_ownership_signals(bio: str | None) -> dict:
    """Infer evidence/ownership signals from achievement language in the bio."""
    if not bio:
        return {}
    low = bio.lower()
    signals: dict[str, str] = {}
    for key, markers in _OWNERSHIP_MARKERS.items():
        for m in markers:
            if m in low:
                signals[key] = f"mentioned in profile: '{m}'"
                break
    return signals


# ---------------------------------------------------------------------------
# Mappers: Supabase shapes -> agent-engine models
# ---------------------------------------------------------------------------

def map_student(s: StudentIn) -> StudentProfile:
    topics = s.topics or []
    skills = sorted(set(topics) | set(extract_skills_from_text(s.bio or "", " ".join(topics))))
    extra: dict = infer_ownership_signals(s.bio)
    if s.gpa_range:
        extra["gpa_range"] = s.gpa_range
    if s.hours_per_week is not None:
        extra["hours_per_week"] = s.hours_per_week
    return StudentProfile(
        name=s.name or (s.email.split("@")[0] if s.email else "Student"),
        email=s.email or "student@unknown.edu",
        year=s.year or "Unknown",
        field=s.major or "Unknown",
        interests=topics,
        skills=skills,
        publications=[],
        extra_signals=extra,
        intake_summary=s.bio or "",
    )


def map_project(o: OpportunityIn) -> LabProject:
    # Required skills come from the description (real requirements), falling back
    # to topics if the description names none.
    required = extract_skills_from_text(o.description) or list(o.topics or [])
    return LabProject(
        pi_name=o.pi_name or "Principal Investigator",
        lab_name=f"{o.pi_name} Lab" if o.pi_name else "Lab",
        university=o.university or "University",
        department=o.department or "",
        project_title=o.title,
        description=o.description or "",
        required_skills=required,
        preferred_background=[],
    )
