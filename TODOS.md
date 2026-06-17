# TODOS

## Resource Library (T1–T16 + NE1–NE9)

See `docs/designs/resource-library.md` for full task specs.

- **Priority:** P1 — all implementation tasks are gated on this docs branch landing first

- [x] **T1** — Create `Resource` + `SessionResource` model interfaces (`src/app/models/`) **Completed:** v0.5.1.0 (2026-06-17)
- [x] **T2** — YouTube utils: `extractYouTubeEmbedUrl()`, `fetchYouTubeOEmbed()`, spec (`src/app/utils/youtube.ts`) **Completed:** v0.5.1.0 (2026-06-17)
- [ ] **T3** — Firestore converters: `resourceConverter`, `sessionResourceConverter` (`src/app/storage/converters.ts`)
- [ ] **T4** — ResourceService (all methods) + spec (`src/app/services/resource.service.ts`)
- [x] **T5** — Migrate `session-resource` stub: `standalone: true`, remove missing `styleUrls` **Completed:** v0.5.1.0 (2026-06-17)
- [x] **T6** — Migrate `session-resource-picker` stub: `standalone: true`, remove missing `styleUrls` **Completed:** v0.5.1.0 (2026-06-17)
- [x] **T7** — `session-resource` component: display by type, `[showRemove]` input, spec **Completed:** v0.5.1.0 (2026-06-17)
- [x] **T8** — `session-resource-picker` component: library search, add form, spec (note: redesigned as song-centric form rather than URL/type form; oEmbed removed in favour of song metadata fields) **Completed:** v0.5.1.0 (2026-06-17)
- [x] **T9** — `session.component.ts`: `_pendingResources` signal, async/await `onSubmit()`, spec fixes **Completed:** v0.5.1.0 (2026-06-17)
- [x] **T10** — `session.component.html`: wire picker (Before), read-only list (During + After), remove gate **Completed:** v0.5.1.0 (2026-06-17)
- [ ] **T11** — `ResourceLibraryComponent`: browser, filter, cards, delete/edit, 200-item cap notice, spec
- [ ] **T12** — `routes.ts`: add `resources` route BEFORE `path: '**'` wildcard at line 93
- [ ] **T13** — `index.html`: CSP meta tag for YouTube + swap Roboto → Cabinet Grotesk + DM Sans (NE9)
- [ ] **T14** — `app-shell.component.ts`: add Library nav item
- [ ] **T15** — `DESIGN.md`: document 5 new design patterns from resource library *(ships with docs branch)*
- [ ] **T16** — `session.component`: wire `MessageService` toast for save errors + add to `app.config.ts`

### Eng Review additions (tracked in plan)
- [ ] **NE1** — `app.config.ts`: add `MessageService` to providers → incorporated into T16
- [ ] **NE2** — session-resource-picker: `_oEmbedLoading` + Add disabled during fetch → incorporated into T8 (resolved differently: spinner not needed for song form)
- [ ] **NE3** — ResourceLibraryComponent: 200-item `p-message warn` → incorporated into T11
- [ ] **NE4** — session.component.spec.ts: fix `createSpy` mock return type → incorporated into T9
- [ ] **NE5** — resource.service.spec.ts: create spec → incorporated into T4
- [ ] **NE6** — session-resource.component.spec.ts: coverage → incorporated into T7
- [x] **NE7** — session-resource-picker.component.spec.ts: coverage — 41-test suite written **Completed:** v0.5.1.0 (2026-06-17)
- [ ] **NE8** — youtube.spec.ts: 4 URL formats + oEmbed coverage → incorporated into T2
- [ ] **NE9** — `index.html`: swap Roboto → Cabinet Grotesk + DM Sans → incorporated into T13

## Design System

- [x] **P2** — Migrate `neutral-*` Tailwind classes to `--gj-*` CSS custom properties across session, songs, auth, welcome, and display-session views. **Completed:** v0.5.1.0 (2026-06-17)

## Completed

- [x] **DESIGN.md** — Design system established: Cabinet Grotesk + DM Sans + burnt sienna palette. **Completed:** v0.5.0.1 (2026-06-11)
- [x] **CLAUDE.md** — Project instructions with design enforcement + skill routing. **Completed:** v0.5.0.1 (2026-06-11)
- [x] **docs/designs/resource-library.md** — Resource library implementation plan, reviewed, spec gaps fixed. **Completed:** v0.5.0.1 (2026-06-11)
