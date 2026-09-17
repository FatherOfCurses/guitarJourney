# TODOS

## Resource Library — follow-on work

Items the resource library plan deferred here but never transferred, plus gaps raised in
review after it shipped. Rationale for the plan-deferred ones is in
[`docs/designs/resource-library.md`](docs/designs/resource-library.md) under
"Deferred to TODOS.md".

- [x] **P2** — `display-session.component`: the session detail page never called
  `getSessionResources()`, so resources pinned to a session were not shown when you opened it.
  Now reads the session's denormalized resource subcollection and renders each through the
  existing `app-session-resource` component, read-only. **Completed:** 2026-09-17
- [x] **P2** — Dedicated Add Resource form at `/app/newResource`: "Add Resource" previously
  routed to `/app/newSong`, so adding a PDF or chord sheet asked for Title and Artist. Now a
  purpose-built form (type, URL, label, tags, YouTube oEmbed) writing through the new
  `ResourceService.createResource()`. URL validation and tag normalization were extracted to
  `utils/resource-url.ts` and are shared with the session picker so the rules cannot drift.
  **Completed:** 2026-09-17
- [x] **P2** — Browser QA of the resource flows: done against a real dev server with seeded
  email/password users (the `AuthGuard` blocker cleared once the CSP fix restored Google
  sign-in, and the seed fix produced working credentials). Full loop verified: library
  search → add via listbox → YouTube oEmbed against the live API → start/end/finish a
  session → session detail page shows the pinned resource → recently-used quick-select
  picks it up on the next session. Found and fixed three real bugs along the way:
  - Tag inputs across the app (picker, new-resource form, library edit dialog — 4 instances)
    never committed a typed tag. PrimeNG `AutoComplete` defaults `typeahead: true`, which
    disables the free-text Enter-to-commit path regardless of `[dropdown]="false"`. Unit
    tests never caught it — they call `onTagsChange()` directly, bypassing the widget's real
    keydown handling. Fixed with `[typeahead]="false"` on all four.
  - Icon-only buttons (Edit/Delete/Remove, 5 instances) had no accessible name in the real
    DOM. `[attr.aria-label]` was bound to the `<p-button>` host element; PrimeNG's Button
    only forwards its own `[ariaLabel]` input to the real inner `<button>`, never reads a
    raw host attribute. One of the five predates the resource library (the song picker's
    notation-link remove button) — fixed alongside the rest since it's the same defect.
  - **`SessionService.create()` could not save a session at all** in the real dev server —
    unrelated to resources, but only surfaced by actually submitting one. It called a bare
    `getFirestore()` instead of the injected `this.fs`; under Vite's dev-server dependency
    pre-bundling that resolves a second, uninitialized copy of the Firestore SDK, throwing
    "No Firebase App '[DEFAULT]' has been created". Fixing that surfaced a second error —
    "different Firestore SDK" — because `addDoc`/`Timestamp` were still bare-imported from
    `firebase/firestore` while `collection()` came through `@angular/fire/firestore`, and
    Firestore's internal `instanceof` checks reject refs built from different SDK copies.
    Moved everything to import from `@angular/fire/firestore` (which re-exports the full
    `firebase/firestore` surface), eliminating the mixed-import pattern the resource-library
    plan had already flagged as tech debt in T6 — this is the real-world consequence of that
    debt. Jest never caught it: the spec mocked `getFirestore()`'s return value and asserted
    it was used, validating the buggy pattern as correct rather than testing real behavior.
  **Completed:** 2026-09-17
- [x] **P2** — Last-used quick-select: the picker now shows the three most recently used
  resources as one-click add buttons above the library search. Sorted client-side from the
  already-loaded library, so no second query or Firestore index is needed. Resources never
  pinned to a session are excluded. **Completed:** 2026-09-17
- [ ] **P3** — Post-session save prompt: after finishing a session, offer to save ad-hoc
  resources to the permanent library so they get a home beyond that session.
- [ ] **P3** — Resource loss on tab-close: if the tab closes between `create()` succeeding and
  `saveResources()` completing, pinned resources are lost with no recovery path. The sticky
  error toast (T16) covers the in-page failure; this covers the case where nobody is left to
  see it.
- [x] **P3** — Retry creates duplicates: resolved by the URL dedup in
  `findOrCreateGlobalResource()` — a retry finds the first attempt's doc by URL and touches
  it instead of creating a second. Investigating this surfaced a worse bug, now fixed: a song
  with no links has `url: undefined`, which made the dedup query and the write both throw, so
  saving that session failed outright. **Completed:** 2026-09-17

  Residual, not worth tracking separately: a partial failure can leave duplicate *session
  pins* for the same resource, which is cosmetic within one session's list.

## Design System

- [x] **P2** — Migrate `neutral-*` Tailwind classes to `--gj-*` CSS custom properties across session, songs, auth, welcome, and display-session views. **Completed:** v0.5.1.0 (2026-06-17)
- [x] **P2** — Placeholder text: replaced the 25 remaining `placeholder:text-neutral-400`
  classes with `--gj-muted`, and overrode Tailwind Preflight's `input::placeholder` base
  (gray-400) in `styles.scss` so inputs with no placeholder class are covered too. This
  finishes the migration above, which had missed placeholders entirely. Contrast on the
  cream input surface goes from 2.42:1 (fails WCAG AA) to 4.67:1 (passes).
  **Completed:** 2026-09-16

## Completed

- [x] **DESIGN.md** — Design system established: Cabinet Grotesk + DM Sans + burnt sienna palette. **Completed:** v0.5.0.1 (2026-06-11)
- [x] **CLAUDE.md** — Project instructions with design enforcement + skill routing. **Completed:** v0.5.0.1 (2026-06-11)
- [x] **docs/designs/resource-library.md** — Resource library implementation plan, reviewed, spec gaps fixed. **Completed:** v0.5.0.1 (2026-06-11)
- [x] **Resource Library implementation (T1–T16 + NE1–NE9)** — Global resource library, session pinning, picker resource types, and the library browser at `/app/resources`. All 25 tasks complete. Task specs, verification steps, and the approved deviations (nav label, picker superset, as-built design patterns) live in [`docs/designs/resource-library.md`](docs/designs/resource-library.md) — tracked there rather than duplicated here. **Completed:** 2026-09-16 (branch `last_design_imps`)
