import type { InstitutionalLinkKind, NextStepKind } from "../types";

export interface KindMeta {
  label: string;
  hint: string;
  exploreOrder: number;
}

export const INSTITUTIONAL_KINDS: InstitutionalLinkKind[] = [
  "lab_website",
  "faculty_profile",
  "project_page",
  "office_hours",
  "application_form",
  "department_page",
];

export const KIND_META: Record<NextStepKind, KindMeta> = {
  lab_website: {
    label: "Lab website",
    hint: "See how the group presents its work",
    exploreOrder: 1,
  },
  faculty_profile: {
    label: "Faculty profile",
    hint: "Learn about the PI’s background",
    exploreOrder: 2,
  },
  project_page: {
    label: "Project page",
    hint: "Read more about this opportunity",
    exploreOrder: 3,
  },
  office_hours: {
    label: "Office hours",
    hint: "Drop-in times, if published",
    exploreOrder: 4,
  },
  application_form: {
    label: "Application form",
    hint: "Official way to express interest",
    exploreOrder: 5,
  },
  department_page: {
    label: "Department page",
    hint: "Broader context at the university",
    exploreOrder: 6,
  },
  request_introduction: {
    label: "Request Introduction",
    hint: "Ask for a warm handoff when you’re ready",
    exploreOrder: 100,
  },
  invite_to_chat: {
    label: "Invite to Chat",
    hint: "Open a light-touch conversation",
    exploreOrder: 101,
  },
};
