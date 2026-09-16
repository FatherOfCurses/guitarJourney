# TODOS

## Accessibility & Design Tokens

- [ ] **P2** — Replace `placeholder:text-neutral-400` with `placeholder:text-[var(--gj-muted)]`
  (25 occurrences, one identical string, no other hardcoded `neutral-*` remains):
  - `src/app/features/session/session-resource-picker/session-resource-picker.component.html` — 11
  - `src/app/features/songs/new-song/new-song.component.html` — 9
  - `src/app/features/session/session.component.html` — 5

  Two problems in one string. It is a hardcoded Tailwind neutral, which `CLAUDE.md` and
  `DESIGN.md` prohibit for colour; and it is a cool grey (`#A3A3A3`) on the warm cream input
  surface (`#FDFAF4`), which measures **2.42:1 — below the WCAG AA minimum of 4.5:1**.
  `--gj-muted` (`#7A7060`) measures **4.67:1** and passes, so the token fix resolves the
  contrast failure at the same time.

  Context: PR #22's original v0.5.1.0 description claimed all hardcoded neutrals had been
  migrated to `--gj-*`, and its review flagged 3 instances as a known P4. The real count was
  23 across three files — the sweep missed placeholders entirely. Two more arrived later in
  the same PR, copied in with an existing input class string when the picker gained its URL
  and Label fields.

## Resource Library — follow-on work

Items the resource library plan deferred here but never transferred, plus gaps raised in
review after it shipped. Rationale for the plan-deferred ones is in
[`docs/designs/resource-library.md`](docs/designs/resource-library.md) under
"Deferred to TODOS.md".

- [ ] **P2** — `display-session.component`: the session detail page never calls
  `getSessionResources()`, so resources pinned to a session are not shown when you open it.
  The most visible of these gaps — resources are saved but invisible after the fact.
- [ ] **P2** — Dedicated Add Resource form at `/app/newResource`: the "Add Resource" button on
  `/app/resources` routes to `/app/newSong` as an interim measure, so adding a PDF or chord
  sheet asks for Title and Artist — fields that do not apply. Reuse the type selector and
  URL/label/tags form already built in `session-resource-picker`, then repoint the button
  (`ResourceLibraryComponent.addResource()`).
- [ ] **P2** — Browser QA of the resource flows: the picker, YouTube oEmbed auto-fill and the
  sticky save-error toast have unit and DOM coverage but have never been exercised in a real
  browser or against live YouTube, because the session and library pages sit behind
  `AuthGuard`. Worth one manual pass before this merges.
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
