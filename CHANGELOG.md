# Changelog

All notable changes to this project will be documented in this file.

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

