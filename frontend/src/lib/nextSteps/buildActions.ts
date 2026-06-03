import type {
  InstitutionalLinkKind,
  LabProject,
  NextStepAction,
  NextStepKind,
  ViewerLens,
} from "../types";
import { INSTITUTIONAL_KINDS, KIND_META } from "./registry";

function readLinks(project: LabProject): Partial<Record<InstitutionalLinkKind, string>> {
  const extra = project.extra_requirements ?? {};
  const links = extra.links;
  if (!links || typeof links !== "object") return {};
  return links as Partial<Record<InstitutionalLinkKind, string>>;
}

function resolveUrl(
  kind: InstitutionalLinkKind,
  project: LabProject,
  links: Partial<Record<InstitutionalLinkKind, string>>
): string | undefined {
  const direct = links[kind]?.trim();
  if (direct) return direct;
  if (
    project.source_url &&
    (kind === "lab_website" || kind === "project_page")
  ) {
    return project.source_url;
  }
  return undefined;
}

function institutionalAction(
  kind: InstitutionalLinkKind,
  project: LabProject,
  links: Partial<Record<InstitutionalLinkKind, string>>
): NextStepAction {
  const url = resolveUrl(kind, project, links);
  const meta = KIND_META[kind];
  return {
    id: kind,
    kind,
    label: meta.label,
    hint: meta.hint,
    url,
    tier: "secondary",
    status: url ? "ready" : "missing",
    handler: "external",
  };
}

function coordinationAction(kind: "request_introduction" | "invite_to_chat"): NextStepAction {
  const meta = KIND_META[kind];
  return {
    id: kind,
    kind,
    label: meta.label,
    hint: meta.hint,
    tier: "secondary",
    status: "ready",
    handler: "stub",
  };
}

function linkPriority(kind: InstitutionalLinkKind): number {
  return KIND_META[kind].exploreOrder;
}

function pickBestLink(actions: NextStepAction[]): NextStepAction | undefined {
  return [...actions]
    .filter((a) => a.status === "ready" && a.handler === "external")
    .sort((a, b) => linkPriority(a.kind as InstitutionalLinkKind) - linkPriority(b.kind as InstitutionalLinkKind))[0];
}

function pickLinkForProject(actions: NextStepAction[]): NextStepAction | undefined {
  const byKind = (k: InstitutionalLinkKind) =>
    actions.find((a) => a.kind === k && a.status === "ready");
  return (
    byKind("application_form") ??
    byKind("project_page") ??
    byKind("lab_website") ??
    pickBestLink(actions)
  );
}

export interface BuildNextStepInput {
  project: LabProject;
  lens: ViewerLens;
  positiveRecommendation: boolean;
}

export interface BuiltNextSteps {
  primary: NextStepAction | null;
  explore: NextStepAction[];
  connect: NextStepAction[];
  showConnect: boolean;
}

export function buildNextStepActions(input: BuildNextStepInput): BuiltNextSteps {
  const { project, lens, positiveRecommendation } = input;
  const links = readLinks(project);

  const institutional = INSTITUTIONAL_KINDS.map((k) =>
    institutionalAction(k, project, links)
  );
  const requestIntro = coordinationAction("request_introduction");
  const inviteChat = coordinationAction("invite_to_chat");

  let primary: NextStepAction | null = null;
  const connect: NextStepAction[] = [];
  let showConnect = false;

  if (positiveRecommendation) {
    showConnect = true;
    if (lens === "for_me") {
      primary = { ...requestIntro, tier: "primary" };
      connect.push({ ...inviteChat, tier: "secondary" });
    } else {
      primary = { ...inviteChat, tier: "primary" };
      connect.push({ ...requestIntro, tier: "secondary" });
    }
  } else {
    const fallback = lens === "for_project" ? pickLinkForProject(institutional) : pickBestLink(institutional);
    if (fallback) {
      primary = { ...fallback, tier: "primary" };
    }
  }

  const explore = institutional
    .filter((a) => a.id !== primary?.id)
    .sort((a, b) => linkPriority(a.kind as InstitutionalLinkKind) - linkPriority(b.kind as InstitutionalLinkKind));

  return {
    primary,
    explore,
    connect: showConnect ? connect : [],
    showConnect,
  };
}

export function handleStubAction(kind: NextStepKind): void {
  if (typeof window !== "undefined") {
    const label =
      kind === "request_introduction" ? "Request Introduction" : "Invite to Chat";
    const banner = document.getElementById("coordination-toast");
    if (banner) {
      banner.textContent = `${label} recorded (demo)—no email sent yet.`;
      banner.classList.remove("hidden");
      window.setTimeout(() => banner.classList.add("hidden"), 4000);
      return;
    }
    window.alert(
      `${label} will connect through OfficeHours when the backend is wired. No email is sent in this demo.`
    );
  }
}
