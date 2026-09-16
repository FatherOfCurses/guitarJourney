# Changelog

All notable changes to this project will be documented in this file.

## [0.5.2.0] - 2026-09-16

### Added

- **Resource library** — A new Resources page at `/app/resources` collects every resource
  you've attached to a session in one place, laid out like the Songs page. Filter by name
  or tag, rename a resource, retag it, or delete it. Deleting removes it from the library
  only — the copy saved with each session is left untouched, so your practice history isn't
  rewritten. "Add Resource" goes to the song form for now.
- **More than songs** — The session picker now takes YouTube videos, PDFs, chord sheets
  and plain links alongside songs. Pick a type, paste a URL, and add optional tags.
  Songs work exactly as before and remain the default.
- **YouTube titles fill themselves in** — Paste a watch, share, shorts or embed link and
  the title and thumbnail load automatically. Type your own label and it won't be
  overwritten.
- **Tag filtering in the picker** — Filter your library by tag as well as by text. Select
  several tags to narrow to resources carrying all of them.
- **You'll know when a save fails** — A failed session save now raises an error notice
  that stays on screen until dismissed. Previously it only reached the browser console,
  so a lost session looked like nothing had happened.

### Changed

- **Navigation** — The "Library" item, which went to Songs, is now labelled "Songs", and
  "Resources" opens the new library. Both labels now match the page they open.
- **Picker library results** — Results are a scrollable list showing each resource's type
  badge, and show up to 50 matches instead of 20.
- **Fonts and corner radii are themeable** — Both now use `--gj-*` custom properties like
  the colours already did, ahead of the planned personalization settings.

### Fixed

- **Square loading placeholders** — Loading placeholders in the library referenced a
  stylesheet variable that isn't loaded by the app, so they rendered with square corners.
- **Session detail assertions** — Six tests on the session detail page were missing their
  call parentheses and silently asserted nothing.

### Internal

- **`npm run lint` works again** — It had been failing on two counts: type errors in a test
  fixture, and ESLint 9 no longer reading the old `.eslintrc.json` (which also named a
  plugin that was never installed). Migrated to `eslint.config.js`. Prettier enforcement
  is deliberately still off — with no `.prettierrc` it would rewrite every quote in the
  codebase.
- **Design system documentation** — `DESIGN.md` now documents the skeleton, card, empty
  state and section separator patterns, recorded as built rather than as originally
  drafted.
- **Task tracking** — `TODOS.md` no longer duplicates the resource library task list, and
  now carries five follow-on items that had been deferred into a gap and tracked nowhere.

## [0.5.1.0] - 2026-06-17

### Added

- **Song resource picker** — When practicing, you can now attach songs to a session
  by title and artist. The "Add New Song" dialog accepts Title (required), Artist
  (required), Album, Genre, and links for Video, Audio, Apple Music, Spotify, and
  sheet-music/notation. The label auto-generates as "Title — Artist" for easy search.
- **Autocomplete suggestions** — Title, artist, and album fields offer autocomplete
  hints sourced from existing library resources and MusicBrainz.

### Changed

- **Design token compliance** — All hardcoded Tailwind neutral shades (`text-neutral-*`,
  `bg-neutral-*`, `border-neutral-*`) replaced with `--gj-*` CSS custom properties
  across the session, display-session, songs, auth, and welcome views. The app now
  respects the design system in every component.
- **Session resource picker** — Renamed "Search Existing" → "Search Existing Song"
  and "Add New Resource" → "Add New Song". The add dialog was redesigned to
  collect song metadata instead of a raw URL/type/label form.
- **Session resource display** — Songs render as structured text (title + artist,
  optional album, streaming/notation links) rather than a generic URL link.
- **Timer display** — Numbers use `tabular-nums` so the timer doesn't jitter
  as digits change width. Timer pulses visually after 90 seconds of elapsed time.

### Fixed

- **Song dedup and remove** — Adding two different songs without any link filled in
  no longer silently drops the second one. Identity is now based on URL when
  present, falling back to label — so URL-less songs coexist and each remove
  button targets the correct item.
- **Autocomplete subscription leak** — Title/artist/album autocomplete handlers now
  unsubscribe on component destroy, preventing in-flight callbacks from writing
  to a torn-down component.
- **YouTube embed URL** — `safeEmbedUrl` no longer passes a non-null assertion
  through `bypassSecurityTrustResourceUrl` when the resource URL is absent.

## [0.5.0.1] - 2026-06-11

### Added

- **Design system** — `DESIGN.md` establishes the full Guitar Journey visual identity:
  Cabinet Grotesk (display/hero) + DM Sans (body), burnt sienna accent (`#C4622D`),
  aged cream background (`#F5F0E8`), leather sidebar (`#4E2A14`), hierarchical border-radius,
  and timer idle pulse. All tokens exposed as `--gj-*` CSS custom properties for future theming.
- **Project instructions** — `CLAUDE.md` enforces the design system for all future AI-assisted
  code changes and adds skill routing rules so the right tool is invoked automatically.
- **Resource library plan** — `docs/designs/resource-library.md` is the complete
  implementation spec for attaching and managing practice resources (YouTube tutorials,
  PDFs, chord sheets, and custom links) within sessions and a dedicated `/app/resources`
  library browser. Covers T1–T16 + NE1–NE9 tasks, architecture, data model,
  Firestore rules, error registry, and verification steps.

## Early history (pre-0.5.0.1)

Merged from a separate `CHANGELOG.MD` that predated this file. Informal notes,
kept verbatim and in their original oldest-first order.

### 0.0.0

- initializing this Changelog
- Angular currently at v 14
- Jest currently at v 28
- Using PrimeNG as pattern library
- Project structure is core, features, models, services, utilities
- Have a very basic unit test shell, not full coverage

### 0.5.0

- Angular now at v 20
- Employing Firebase for hosting, GitHub actions for CI/CD
- We have a public/private setup in the app, with a welcome page for unauthenticated users
- Login set up with auth guards. Currently using email/password and Google Account authentication

### 0.5.1

- Add Firestore integration and seed file for test environment
