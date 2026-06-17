# Design System — Guitar Journey

## Product Context
- **What this is:** A personal guitar practice tracking web app — set goals before sessions, reflect after, track progress over time
- **Who it's for:** Self-teaching guitarists who want structured, purposeful practice
- **Space/industry:** Personal productivity / creative practice tools
- **Project type:** Web app (Angular 20, Firebase, PrimeNG, Tailwind CSS)

## Aesthetic Direction
- **Direction:** Organic/Natural — warm, textured, personal
- **Decoration level:** Intentional — cream background, warm borders, leather sidebar; color and typography carry the texture; no noise or grain overlay
- **Mood:** A well-used practice journal left open on a workbench. Every mark is intentional. Nothing is decorative that isn't also useful. Easy to use, encouraging, and a little playful without being overly cute.
- **Future:** CSS custom properties throughout enable the "serious to whimsical" personalization dial planned for a later phase.

## Typography

- **Display/Hero:** Wix Madefor Text (600–800 weight) — clean grotesque with slightly wider spacing and strong legibility at all sizes. Use for: page titles, dashboard stats, the sidebar wordmark.
- **Body:** DM Sans (400, 500) — clean, humanist, high legibility at small sizes; warm without being soft. Use for: all body copy, form labels, session notes.
- **UI/Labels:** DM Sans 500, `text-transform: uppercase; letter-spacing: 0.05em` for section headers (e.g. "RECENT SESSIONS", "YOUR LIBRARY")
- **Data/Tables:** DM Sans with `font-variant-numeric: tabular-nums` for session durations, stats, time values
- **Code:** JetBrains Mono (if code display ever needed)
- **Loading:**
  - Wix Madefor Text: Google Fonts (`fonts.googleapis.com`) — weights 600, 700, 800
  - DM Sans: Google Fonts (`fonts.googleapis.com`) — weights 400, 500
  - Load: `font-display: swap` via Google Fonts stylesheet in `index.html`

- **Scale (8px base, 1.25 modular):**
  ```
  xs:    12px / 1.4  — captions, timestamps
  sm:    14px / 1.5  — body, labels
  base:  16px / 1.6  — default body
  lg:    20px / 1.4  — subheadings, card titles
  xl:    24px / 1.3  — section headings
  2xl:   32px / 1.2  — page titles (Wix Madefor Text)
  3xl:   48px / 1.1  — dashboard hero stats (Wix Madefor Text 800)
  ```

## Color

- **Approach:** Restrained — one warm accent + warm neutrals; color is rare and meaningful
- **CSS custom properties:**
  ```css
  --gj-background:  #F5F0E8;  /* aged cream — main layout surface */
  --gj-surface:     #FDFAF4;  /* lifted cream — cards, panels */
  --gj-sidebar:     #4E2A14;  /* warm leather — left nav background */
  --gj-text:        #1C1A16;  /* warm near-black — primary text */
  --gj-muted:       #7A7060;  /* warm stone — labels, captions, timestamps */
  --gj-accent:      #C4622D;  /* burnt sienna / rosewood — CTAs, badges, active states */
  --gj-accent-hover:#A34E22;  /* deeper ember — hover/pressed */
  --gj-accent-text: #FFFFFF;  /* text on accent surfaces */
  --gj-border:      #E8E0D0;  /* warm parchment — card borders, dividers */
  --gj-sidebar-text:#F5F0E8;  /* cream — text/icons on leather sidebar */
  --gj-sidebar-muted:#C4A882; /* warm tan — inactive nav labels on sidebar */
  ```
- **Semantic:**
  - success: `#3D7A5C` (warm forest green)
  - warning: `#B8860B` (dark goldenrod)
  - error: `#C0392B` (warm red)
  - info: `#2C6E8A` (steel blue)
- **PrimeNG badge severity mapping (resource-library):**
  - youtube → `info` | pdf → `danger` | chord-sheet → `success` | custom → `secondary`
- **Dark mode strategy:** Redesign surfaces — swap `--gj-background` to `#1C1A16`, `--gj-surface` to `#2A2520`, keep accent at 90% saturation, sidebar stays dark leather. Reduce all neutral colors 10–15% lightness.

## Spacing

- **Base unit:** 8px
- **Density:** Comfortable (not cramped; guitarists need to see their resources clearly)
- **Scale:**
  ```
  2xs:  2px   — fine dividers
  xs:   4px   — tight internal padding
  sm:   8px   — base
  md:   16px  — component padding, between list items
  lg:   24px  — between sections within a card
  xl:   32px  — between cards
  2xl:  48px  — section breaks
  3xl:  64px  — page-level vertical rhythm
  ```

## Layout

- **Approach:** Grid-disciplined — strict columns, predictable alignment
- **Sidebar:** Fixed left, 56px collapsed / 220px expanded. Background: `--gj-sidebar`. Wordmark: stacked "GUITAR / JOURNEY" in Wix Madefor Text 800, with a diamond separator, in `--gj-sidebar-text`.
- **Grid:** 12 columns in main content area
- **Max content width:** 1200px
- **Breakpoints:** sm 640px | md 768px | lg 1024px | xl 1280px
- **Border radius (hierarchical — not uniform):**
  ```
  cards / panels:   8px   (rounded-lg)
  buttons / inputs: 6px   (rounded-md)
  small badges:     4px
  pill tags:        9999px (rounded-full)
  ```
  Never uniform bubble-radius on everything. The hierarchy signals which elements are containers vs. actions vs. labels.

## Motion

- **Approach:** Intentional — only transitions that aid comprehension or add personality
- **Easing:** enter `ease-out` | exit `ease-in` | move `ease-in-out`
- **Duration:**
  ```
  micro:  50–100ms  — button hover state, badge color
  short:  150–250ms — panel entrance, modal open
  medium: 250–400ms — route transitions, sidebar expand
  long:   400–700ms — skeleton → content fade
  ```
- **Timer idle pulse (session screen):** At ~90s without interaction, the session timer ring exhales a subtle sine-wave breath — pulse in `--gj-accent` at 30% opacity. Delight without distraction. Communicates "still running, everything's fine."
- **No motion for:** delete confirmations, error states, validation — those need to be immediate.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-06-11 | Initial design system created via /design-consultation | Based on user brief: "easy to use, encouraging, a little playful without being overly cute; future personalization from serious to whimsical" |
| 2026-06-11 | Accent: burnt sienna #C4622D (not indigo) | Indigo was a codebase default, not a decision. Burnt sienna is rosewood — guitar-adjacent, warm, distinctive. |
| 2026-06-11 | Display font: Cabinet Grotesk (not Fraunces serif, not Inter/Roboto) | User chose sans-serif display. Cabinet Grotesk has variable weight and character at large sizes without tipping into cute. |
| 2026-06-12 | Display font revised: Plus Jakarta Sans (replacing Cabinet Grotesk) | remix-v1.png was rendered with Plus Jakarta Sans (double-story 'a', geometric grotesque). Cabinet Grotesk was correctly implemented but visually differed from the approved mockup. Plus Jakarta Sans matches the approved aesthetic and is not AI-slop (not Inter/Roboto). |
| 2026-06-12 | Display font revised: Wix Madefor Text (replacing Plus Jakarta Sans) | User preferred Wix Madefor Text's wider spacing over Plus Jakarta Sans. |
| 2026-06-11 | Body font: DM Sans | Humanist, warm, legible — never fights the content. Replaces Roboto (AI slop default). |
| 2026-06-11 | Sidebar: leather dark brown #4E2A14 | Approved in remix mockup. Stacked GUITAR/JOURNEY wordmark on leather sidebar gives personal/craftsman identity. |
| 2026-06-11 | Border radius: hierarchical (cards 8px, buttons 6px, pills full) | Not uniform bubble-radius. Hierarchy signals container vs. action vs. label. |
| 2026-06-11 | Approved mockup | remix-v1.png — A's main layout + B's leather sidebar | `~/.gstack/projects/FatherOfCurses-guitarJourney/designs/design-system-20260611/remix-v1.png` |
