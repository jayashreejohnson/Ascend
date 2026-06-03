import type { SharedNotePayload } from "../types";

/** Stable demo IDs — match README demo pair. */
export const DEMO_STUDENT_AISHA = "11111111-1111-1111-1111-111111111111";
export const DEMO_PROJECT_SOFT_ROBOTICS =
  "22222222-2222-2222-2222-222222222222";
export const DEMO_STUDENT_MARCUS = "33333333-3333-3333-3333-333333333333";
export const DEMO_PROJECT_NLP = "44444444-4444-4444-4444-444444444444";

const aishaNote: SharedNotePayload = {
  student: {
    id: DEMO_STUDENT_AISHA,
    name: "Aisha Patel",
    email: "aisha@demo.edu",
    year: "PhD Year 1",
    field: "Computer Science",
    interests: ["robotics", "machine learning", "hardware"],
    skills: ["Python", "PyTorch", "ROS", "C++", "hardware"],
    publications: [],
    intake_summary:
      "Aisha looks weak on paper — no publications, just started PhD — but during intake she revealed she built a custom 6-DOF robotic arm from scratch, including custom PCBs and a PID controller in C++. She contributed to an open-source ROS2 package with 400 GitHub stars.",
    extra_signals: {
      github_stars: 400,
      side_project: "6-DOF robotic arm with custom PCBs",
    },
  },
  project: {
    id: DEMO_PROJECT_SOFT_ROBOTICS,
    pi_name: "Daniela Rus",
    lab_name: "CSAIL Distributed Robotics Lab",
    university: "MIT",
    department: "EECS",
    project_title: "Soft Robotics for Minimally Invasive Surgery",
    description:
      "We are developing soft robotic systems for medical applications. Students will design, fabricate, and test soft actuators and integrate sensor feedback. Experience with CAD, 3D printing, and Python control scripts preferred.",
    required_skills: ["Python", "CAD", "hardware", "robotics"],
    preferred_background: ["Mechanical Engineering", "Biomedical Engineering"],
    openings: 1,
    source_url: "https://www.csail.mit.edu/",
    extra_requirements: {
      links: {
        lab_website: "https://www.csail.mit.edu/",
        faculty_profile: "https://danielarus.csail.mit.edu/",
        project_page: "https://www.csail.mit.edu/research/robotics",
        application_form: "https://urop.mit.edu/",
      },
    },
  },
  dossier: {
    routing: "AMBIGUOUS",
    dimensions: [
      {
        name: "Skills",
        evidence: ["Python", "ROS", "hardware in skills + intake"],
        assessment:
          "Strong robotics and hardware signals; CAD not evidenced in intake or skills.",
        confidence: 0.72,
        gap: "CAD",
      },
      {
        name: "Ownership",
        evidence: ["6-DOF arm", "github_stars: 400"],
        assessment: "Clear build-and-ship evidence beyond the transcript.",
        confidence: 0.85,
        gap: "",
      },
    ],
    strengths: [
      "Built a complete 6-DOF arm with custom PCBs and control stack",
      "400-star ROS2 open-source contribution",
      "Required skills met on paper for Python, hardware, and robotics",
    ],
    risks: [
      "CAD is a stated requirement without direct evidence in intake",
      "Preferred mechanical/biomedical background not explicit",
    ],
    uncertainties: [
      "Has she used CAD or 3D printing on the arm build?",
      "Is she seeking UROP-scale commitment or a longer lab role?",
    ],
    skills_met: "3/4",
    skill_gaps: ["CAD"],
    routing_reason:
      "Required skills largely evidenced, but CAD gap plus strong ownership signals warrant a closer look.",
    overall_confidence: 0.68,
    summary:
      "Aisha brings unusual hands-on robotics evidence for a first-year PhD student. The main open question is fabrication/CAD depth relative to this soft-robotics role—not whether she can build.",
  },
  result: {
    decision: "MATCH",
    justification:
      "The ownership signals and robotics depth outweigh the CAD gap for an initial conversation, with room to clarify fabrication experience.",
    turns_used: 3,
    student_id: DEMO_STUDENT_AISHA,
    project_id: DEMO_PROJECT_SOFT_ROBOTICS,
    conversation: [
      {
        id: "c1",
        from_agent: "student",
        to_agent: "professor",
        intent: "respond",
        payload:
          "Aisha built the full arm stack herself—mechanical, electrical, and control—not a kit assembly.",
        turn: 1,
      },
      {
        id: "c2",
        from_agent: "professor",
        to_agent: "student",
        intent: "clarify",
        payload:
          "CAD for soft actuator molds matters here—what fabrication tools did she use on the arm?",
        turn: 2,
      },
      {
        id: "c3",
        from_agent: "mediator",
        to_agent: "student",
        intent: "decide",
        payload:
          "DECISION: MATCH — Evidence supports a conversation; CAD can be probed live.",
        turn: 3,
      },
    ],
  },
};

const marcusNote: SharedNotePayload = {
  student: {
    id: DEMO_STUDENT_MARCUS,
    name: "Marcus Chen",
    email: "marcus@demo.edu",
    year: "Undergrad Senior",
    field: "Electrical Engineering",
    interests: ["NLP", "signal processing"],
    skills: ["Python", "MATLAB", "signal processing"],
    publications: ["IEEE student paper on antenna design"],
    intake_summary:
      "Marcus is strong on paper in EE but pivoting to ML/NLP. ML experience is mostly coursework.",
    extra_signals: {},
  },
  project: {
    id: DEMO_PROJECT_NLP,
    pi_name: "Regina Barzilay",
    lab_name: "Clinical NLP Group",
    university: "MIT",
    department: "EECS",
    project_title: "Clinical NLP for Patient Records",
    description:
      "Develop NLP models for structured extraction from clinical notes. Strong Python and deep learning required.",
    required_skills: ["Python", "deep learning", "NLP"],
    preferred_background: ["Computer Science"],
    openings: 2,
    source_url: "https://www.csail.mit.edu/",
    extra_requirements: {
      links: {
        lab_website: "https://www.csail.mit.edu/",
        faculty_profile: "https://people.csail.mit.edu/regina/",
      },
    },
  },
  dossier: {
    routing: "CLEAR_MISMATCH",
    dimensions: [
      {
        name: "Skills",
        evidence: ["Python", "signal processing"],
        assessment: "NLP and deep learning not evidenced across intake or skills.",
        confidence: 0.8,
        gap: "NLP, deep learning",
      },
    ],
    strengths: ["Solid EE fundamentals and one publication"],
    risks: ["Missing NLP and deep learning requirements"],
    uncertainties: [],
    skills_met: "1/3",
    skill_gaps: ["deep learning", "NLP"],
    routing_reason:
      "Required NLP and deep learning skills are not evidenced; no ownership signals compensate.",
    overall_confidence: 0.82,
    summary:
      "Marcus’s EE strengths don’t yet surface the NLP depth this clinical project needs.",
  },
  result: {
    decision: "NO_MATCH",
    justification:
      "Routing is clear mismatch—agents were not run. Explore links only if curiosity remains.",
    turns_used: 0,
    student_id: DEMO_STUDENT_MARCUS,
    project_id: DEMO_PROJECT_NLP,
    conversation: [],
  },
};

const NOTES: Record<string, SharedNotePayload> = {
  [`${DEMO_STUDENT_AISHA}:${DEMO_PROJECT_SOFT_ROBOTICS}`]: aishaNote,
  [`${DEMO_STUDENT_MARCUS}:${DEMO_PROJECT_NLP}`]: marcusNote,
};

export function getMockNote(
  studentId: string,
  projectId: string
): SharedNotePayload | null {
  return NOTES[`${studentId}:${projectId}`] ?? null;
}

export const MOMENT_CARDS = [
  {
    studentId: DEMO_STUDENT_AISHA,
    projectId: DEMO_PROJECT_SOFT_ROBOTICS,
    title: "Aisha × Soft Robotics",
    subtitle: "Worth a Closer Look",
    tone: "honey" as const,
  },
  {
    studentId: DEMO_STUDENT_MARCUS,
    projectId: DEMO_PROJECT_NLP,
    title: "Marcus × Clinical NLP",
    subtitle: "Not the Right Moment",
    tone: "sage" as const,
  },
];
