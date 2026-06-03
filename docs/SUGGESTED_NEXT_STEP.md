# Suggested Next Step — locked section spec

Part of the **Shared Note** scroll flow (final section only). Does not change Cover, About, What We Noticed, Conversation, or Recommendation.

## Emotional intent

This section should feel like a **gentle doorway**, not a task list or CRM panel. Copy tone: calm optimism, permission to move slowly. The user has already read the evidence and recommendation; here they choose **one small, reversible step** toward the real world (a link) or toward each other (coordination).

Avoid: urgency badges, “Complete your profile,” score language, or more than one loud primary button.

## Information hierarchy

1. **Section title** — “Suggested Next Step”
2. **One-line frame** — varies by recommendation + viewer lens (see copy table)
3. **Primary action** — exactly one emphasized CTA (coordination or best available link)
4. **Explore** — institutional links (secondary visual weight)
5. **Coordination pair** — when primary is a link, show Request Introduction / Invite to Chat as secondary cards; when primary is coordination, demote links to Explore only

```
┌─────────────────────────────────────────┐
│ Suggested Next Step                     │
│ <frame line>                            │
│ ┌─────────────────────────────────────┐ │
│ │ PRIMARY (filled button / hero card) │ │
│ └─────────────────────────────────────┘ │
│ Explore                                 │
│ · Lab website  · Faculty  · Project …   │
│ Connect                                 │
│ [ Request Introduction ] [ Invite … ]   │
└─────────────────────────────────────────┘
```

## Action model (future-proof)

All actions are registered entries — **never hard-coded page layout per type**.

```ts
type NextStepKind =
  | 'lab_website'
  | 'faculty_profile'
  | 'project_page'
  | 'office_hours'
  | 'application_form'
  | 'department_page'
  | 'request_introduction'
  | 'invite_to_chat';

type NextStepAction = {
  id: string;
  kind: NextStepKind;
  label: string;
  hint?: string;
  url?: string;              // external links only
  tier: 'primary' | 'secondary';
  status: 'ready' | 'missing' | 'disabled';
  handler?: 'external' | 'stub';  // coordination stubs for v1
};
```

**Adding a new action later:** register `kind`, label, icon, default tier rules in `buildNextStepActions()` — no section redesign.

### Data sources (priority)

| Kind | Source |
|------|--------|
| lab_website, faculty_profile, project_page, office_hours, application_form, department_page | `project.extra_requirements.links[kind]` |
| Fallback for lab/project | `project.source_url` when kind is `lab_website` or `project_page` |
| request_introduction, invite_to_chat | Always available as stubs (no email in v1) |

## Primary vs secondary rules

| Viewer | Recommendation | Primary |
|--------|----------------|---------|
| For me | Conversation makes sense / Ready to connect | Request Introduction |
| For me | Not the right moment | Best available Explore link (lab website → project → faculty) |
| For my project | Conversation makes sense / Ready | Invite to Chat |
| For my project | Not the right moment | Application form if present, else project page |

Secondary: all other `ready` links + non-primary coordination CTA.  
`missing` links appear in Explore as muted rows (label visible, no navigation).

## Empty and missing states

- **No links object / all missing:** Explore shows 2–3 placeholder rows (“Not shared yet”) + primary coordination still available when recommendation allows.
- **Recommendation = Not the right moment:** hide coordination primary; frame copy shifts to learning without pressure; links only.
- **No URL and no fallback:** `status: 'missing'` — never render `href="#"`.

## Mobile

- Primary: full-width, 48px min touch target, sticky optional only for primary on long notes (v2); v1 inline at section end.
- Explore: single-column list with chevron; max 6 visible, “Show all” if registry grows.
- Coordination: two stacked secondary buttons when not primary; side-by-side only ≥640px.

## Desktop

- Max width aligned with Shared Note column (~720px).
- Primary card full width; Explore two-column grid; coordination as equal-width secondary cards below Explore.

## Copy frames (examples)

| State | Frame |
|-------|-------|
| Positive fit | “A few ways to learn more—or take one small step toward connecting.” |
| Not the right moment | “No pressure. These links are here when you want to explore on your own.” |
| For my project + positive | “Ways to learn more about them—or open a light-touch conversation.” |

## Fit in Shared Note flow

Appears **after** Recommendation only. Scroll order unchanged. Section does not repeat dossier or agent content. Viewer lens toggles primary coordination CTA only; evidence sections stay identical.
