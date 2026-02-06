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
5. **Carousels** (current work) - Image carousels with responsive variants and attribution

## Architecture Highlights
* Standalone component architecture (no NgModules)
* Firebase security rules with owner-based access control
* Strongly-typed Firestore converters
* Route guards for authentication
* Path aliases for clean imports
* Comprehensive test coverage with Jest

[Compodoc Product Documentation](https://fatherofcurses.github.io/guitarJourney/index.html)

### Packages used
- PrimeNG - https://www.primefaces.org/primeng/
- Note Parser - https://github.com/danigb/note-parser
- Jest Schematic - https://github.com/briebug/jest-schematic
- Compodoc - https://compodoc.app/
- Metronome - https://github.com/scottwhudson/metronome


