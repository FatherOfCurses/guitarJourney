# TODOS

## Resource Library — follow-on work

Deferred out of the resource library plan and never transferred here. Rationale for each
is in [`docs/designs/resource-library.md`](docs/designs/resource-library.md) under
"Deferred to TODOS.md".

- [ ] **P2** — `display-session.component`: the session detail page never calls
  `getSessionResources()`, so resources pinned to a session are not shown when you open it.
  The most visible of these gaps — resources are saved but invisible after the fact.
- [ ] **P2** — Last-used quick-select: surface the top 3 most recently used resources at the
  top of the picker for one-click re-add. `useCount` and `lastUsedAt` are already written by
  `touchResource()`; only the UI is missing.
- [ ] **P3** — Post-session save prompt: after finishing a session, offer to save ad-hoc
  resources to the permanent library so they get a home beyond that session.
- [ ] **P3** — Resource loss on tab-close: if the tab closes between `create()` succeeding and
  `saveResources()` completing, pinned resources are lost with no recovery path. The sticky
  error toast (T16) covers the in-page failure; this covers the case where nobody is left to
  see it.
- [ ] **P3** — Retry creates duplicates: if `saveResources()` fails partway and the user
  retries, global library docs written by the first attempt can be created again. T6's URL
  dedup mitigates most of this; duplicates are harmless in v1.

## Design System

- [x] **P2** — Migrate `neutral-*` Tailwind classes to `--gj-*` CSS custom properties across session, songs, auth, welcome, and display-session views. **Completed:** v0.5.1.0 (2026-06-17)

## Completed

- [x] **DESIGN.md** — Design system established: Cabinet Grotesk + DM Sans + burnt sienna palette. **Completed:** v0.5.0.1 (2026-06-11)
- [x] **CLAUDE.md** — Project instructions with design enforcement + skill routing. **Completed:** v0.5.0.1 (2026-06-11)
- [x] **docs/designs/resource-library.md** — Resource library implementation plan, reviewed, spec gaps fixed. **Completed:** v0.5.0.1 (2026-06-11)
- [x] **Resource Library implementation (T1–T16 + NE1–NE9)** — Global resource library, session pinning, picker resource types, and the library browser at `/app/resources`. All 25 tasks complete. Task specs, verification steps, and the approved deviations (nav label, picker superset, as-built design patterns) live in [`docs/designs/resource-library.md`](docs/designs/resource-library.md) — tracked there rather than duplicated here. **Completed:** 2026-09-16 (branch `last_design_imps`)
