# Changelog

All notable changes to this project will be documented in this file.

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

