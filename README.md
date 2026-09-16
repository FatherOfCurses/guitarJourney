# Guitar Journey

Guitar Journey is a modern Angular 20 application for guitar practice management, built with:

## Core Tech Stack
* **Frontend**: Angular 20 (standalone components), TypeScript, RxJS, Signals
* **UI**: PrimeNG, Angular Material, Tailwind CSS
* **Backend**: Firebase (Firestore, Auth, Storage, Functions)
* **Testing**: Jest with Testing Library
* **AI Integration**: Google Cloud Genkit (sample implementation)

## Key Features
1. **Practice Sessions** - Create, track, and reflect on practice sessions
2. **Songs Catalog** - Music library with Apple Music/Spotify links
3. **Chord Notation** - SVG chord diagram visualization (svguitar)
4. **Metrics Dashboard** - Practice statistics and insights
5. **Carousels** - Image carousels with responsive variants and attribution
6. **Resource Library** (partial) - Attach songs to practice sessions with metadata (title, artist, album, streaming links); full resource browser at `/app/resources` coming in a future release

## Architecture Highlights
* Standalone component architecture (no NgModules)
* Firebase security rules with owner-based access control
* Strongly-typed Firestore converters
* Route guards for authentication
* Path aliases for clean imports
* Comprehensive test coverage with Jest

## Documentation

- [Design System](DESIGN.md) — fonts, colors, spacing, motion, and `--gj-*` CSS custom properties
- [Project Instructions](CLAUDE.md) — AI-assisted development rules and skill routing
- [Resource Library Plan](docs/designs/resource-library.md) — full implementation spec for T1–T16 + NE1–NE9
- [Open Tasks](TODOS.md) — prioritized backlog
- [Changelog](CHANGELOG.md) — version history
- [Compodoc Product Documentation](https://fatherofcurses.github.io/guitarJourney/index.html)

### Packages used
- PrimeNG - https://www.primefaces.org/primeng/
- Note Parser - https://github.com/danigb/note-parser
- Jest Schematic - https://github.com/briebug/jest-schematic
- Compodoc - https://compodoc.app/
- Metronome - https://github.com/scottwhudson/metronome


