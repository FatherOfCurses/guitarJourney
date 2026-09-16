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
- **Semantic CSS custom properties:**
  ```css
  --gj-success: #3D7A5C;  /* warm forest green */
  --gj-warning: #B8860B;  /* dark goldenrod */
  --gj-error:   #C0392B;  /* warm red */
  --gj-info:    #2C6E8A;  /* steel blue */
  ```
- **PrimeNG badge severity mapping (resource-library):**
  - youtube → `info` | pdf → `danger` | chord-sheet → `success` | custom → `secondary` | song → `secondary`
  - Any unmapped type falls back to `secondary`. `song` and `custom` deliberately share a
    severity: the badge text already distinguishes them, and inventing a fifth colour would
    spend the restrained palette on a distinction nobody is scanning for.
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
  ```css
  --gj-radius-card:   8px;    /* cards, panels, skeletons  — Tailwind rounded-lg */
  --gj-radius-button: 6px;    /* buttons, inputs           — Tailwind rounded-md */
  --gj-radius-badge:  4px;    /* small badges              — Tailwind rounded    */
  --gj-radius-pill:   9999px; /* pill tags                 — Tailwind rounded-full */
  ```
  In a Tailwind class, the utility is fine (`rounded-full`); in a CSS property or a PrimeNG
  `borderRadius` input, use the token.
  Never uniform bubble-radius on everything. The hierarchy signals which elements are containers vs. actions vs. labels.
  Use the token, not the literal. There is no `--border-radius` in this app — it exists only in
  `src/assets/theme.css`, which nothing loads, so `var(--border-radius)` silently resolves to nothing.

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
- **Timer idle pulse (session screen):** At ≥90s elapsed, the session timer container exhales a subtle sine-wave breath — box-shadow pulse in `--gj-accent` at 30% opacity, 14px spread, 3s ease-in-out infinite. Implemented as `.gj-timer-pulse` in `src/styles.scss`. Delight without distraction. Communicates "still running, everything's fine."
- **No motion for:** delete confirmations, error states, validation — those need to be immediate.

## Component Patterns

Patterns established by the resource library. Reuse them rather than inventing a second
spelling of the same idea.

### Skeleton loading

Show skeletons whenever a Firestore read is in flight — never an empty container, never a
spinner. The skeleton stands in for the shape that is coming, so the layout does not jump.

```html
<!-- Card list (resource library): 3 blocks -->
<p-skeleton height="80px" borderRadius="var(--gj-radius-card)" />

<!-- Single row / input (picker) -->
<p-skeleton height="40px" />
```

- Card-shaped lists: 3 blocks, full width, 80px tall, `var(--gj-radius-card)`.
- Row- or input-shaped: 40px tall.
- Three is deliberate — enough to read as "a list is coming", not so many it looks like content.
- Fade skeleton → content over 400–700ms (Motion > long).

### Resource card anatomy

One `p-card` per resource. Content left, actions right, both aligned to the top so a long
label does not drag the buttons down the card.

```
┌────────────────────────────────────────────────────────────┐
│ Barre Chord Basics  [youtube]                  [✎]  [🗑]   │
│ ⟨barre⟩ ⟨chords⟩                                           │
│ https://youtube.com/watch?v=…                              │
│ Used in 3 sessions                                         │
└────────────────────────────────────────────────────────────┘
```

Top to bottom:
1. **Label** — `font-medium`, `--gj-text`. Wraps; never truncated (it is the identifier).
2. **Type badge** — `p-tag`, severity per the mapping in Color.
3. **Tags** — pill spans, not `p-tag`: `rounded-full` (= `--gj-radius-pill`), `--gj-border`
   background, `--gj-muted` text, `text-xs font-medium`. `p-tag` severities are reserved for
   *type*, so tags use a flat neutral pill and the two never compete.
4. **URL** — `text-xs`, `--gj-accent`, underline on hover, `truncate`. Truncation is fine here:
   it is a destination, not an identifier. Always `target="_blank" rel="noopener noreferrer"`.
5. **useCount** — `text-xs`, `--gj-muted`, only when > 0. Singular/plural ("1 session" / "3 sessions").
6. **Icon buttons** — edit then delete, `p-button` `variant="text"`, 44×44 minimum
   (`!w-11 !h-11`). Never bare `<button>`. Each needs an `aria-label` naming the resource
   ("Edit Barre Chord Basics") since there is no visible text. Both disable together while
   that row's delete is in flight.

### Empty and near-empty states

Three distinct states — do not collapse them into one message.

| State | Treatment |
|---|---|
| **Empty collection** | `p-message severity="info"` + a `p-button` that takes the user to the action that fills it |
| **Filters match nothing** | `text-sm`, `--gj-muted`, centred, `py-8`, + a link-severity "Clear filters" button. Not a `p-message` — a filter miss is not news |
| **At the query cap** | `p-message severity="warn"` at the top of the list, stating the cap |

Empty-collection copy points forward, never states the obvious: *"Your resource library is
empty. Resources you attach to practice sessions will appear here."* paired with
**Start a session**. The user learns how the thing fills up, from the place they noticed it was empty.

### Section separator

Splits stacked sections inside one panel (for example a picker's "search existing" above
"add new"), where a card boundary would be too heavy.

```html
<div class="border-t border-[var(--gj-border)] pt-4">
  <p class="text-xs font-medium text-[var(--gj-muted)] uppercase tracking-[0.05em] mb-3">
    Practice Resources
  </p>
</div>
```

A 1px `--gj-border` rule, then an uppercase `--gj-muted` label in `text-xs font-medium`.

Letter-spacing is `tracking-[0.05em]`, not `tracking-wide`. Typography > UI/Labels specifies
0.05em; Tailwind's `tracking-wide` is 0.025em and is half the intended spacing.

Never numbered headers — "1. Choose a resource" reads as documentation, not as an app.

*Status: applied in `session.component.html` and `session-resource-picker.component.html`
("Your Library" / "Add New").*

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
| 2026-09-16 | Radius values tokenized as `--gj-radius-*` | Values were specified since 2026-06-11 but never bound to variables, so components hardcoded them. `var(--border-radius)` had been used in one place and silently resolved to nothing — it is defined only in the unloaded `src/assets/theme.css`. |
| 2026-09-16 | Tags render as neutral pills, not `p-tag` | `p-tag` severities encode resource *type*. Giving free-form tags their own severities would make two unrelated colour systems compete in one card. |
| 2026-09-16 | `song` badge severity: `secondary` (shares with `custom`) | The `song` type postdates the original mapping. Badge text already distinguishes it; a fifth colour would spend the restrained palette on a distinction nobody scans for. |
| 2026-06-11 | Approved mockup | remix-v1.png — A's main layout + B's leather sidebar | `~/.gstack/projects/FatherOfCurses-guitarJourney/designs/design-system-20260611/remix-v1.png` |
