## Design System
Always read DESIGN.md before making any visual or UI decisions.
All font choices, colors, spacing, and aesthetic direction are defined there.
Do not deviate without explicit user approval.
In QA mode, flag any code that doesn't match DESIGN.md.

Key rules derived from DESIGN.md:
- Fonts: Wix Madefor Text (display/hero), DM Sans (body/UI) — never Inter, Roboto, or system-ui as primary
- Accent: #C4622D burnt sienna — not indigo, not purple, no gradient CTAs
- Background: #F5F0E8 cream — not pure white (#FFFFFF) for app surfaces
- Sidebar: #4E2A14 leather brown — the Guitar Journey identity
- Border radius is hierarchical: cards 8px, buttons 6px, pills full — not uniform bubble-radius
- CSS custom properties: all color/font tokens use --gj-* variables for future theming

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec
