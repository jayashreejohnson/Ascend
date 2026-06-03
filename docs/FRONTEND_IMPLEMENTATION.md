# Frontend implementation plan

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS**
- Location: `frontend/`
- Data: mocked JSON in `frontend/src/lib/mock/` shaped like `app/models.py` until `/negotiate` returns `dossier`.

## Phases

| Phase | Deliverable | Status |
|-------|-------------|--------|
| 1 | Types + mock fixtures (Aisha/AMBIGUOUS, Marcus/CLEAR_MISMATCH) | Done |
| 2 | View-model mappers (routing → UI labels, no enums in copy) | Done |
| 3 | Routes: `/` Home moment cards, `/note/[studentId]/[projectId]` | Done |
| 4 | Shared Note shell + sections (reuse spec order) | Done |
| 5 | **Suggested Next Step** — `buildNextStepActions()` registry | Done |
| 6 | Wire to API (`GET` profiles + negotiate with dossier) | Later |

## File map

```
frontend/src/
  lib/types.ts              # mirrors Pydantic models
  lib/viewModel.ts          # dossier routing → moment / recommendation copy
  lib/nextSteps/registry.ts # kind metadata (labels, icons)
  lib/nextSteps/buildActions.ts
  lib/mock/notes.ts
  components/shared-note/
  app/page.tsx
  app/note/[studentId]/[projectId]/page.tsx
```

## Backend follow-up (not blocking UI)

- Extend `POST /negotiate` response: `{ student, project, dossier, result }`
- Seed `extra_requirements.links` on demo Soft Robotics project

## Run locally

```bash
cd frontend && npm install && npm run dev
```

Open http://localhost:3000 — demo cards link to fixed UUID note URLs.
