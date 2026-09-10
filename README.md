
A small app for browsing movies by *mood* instead of genre, and building personal "shelves" to collect favourites. Built for the MPF front-end exercise, using [TMDB](https://www.themoviedb.org/) as the data source.

> Time-boxed to 2 hours, start to finish. Scope decisions below reflect that constraint.

---

## What it does

- Browse movies grouped into a handful of curated **moods** (e.g. "Cozy Sunday," "Popcorn Chaos," "Existential Dread") — each mood maps to a combination of TMDB genres/keywords rather than a raw genre list.
- Search for movies by title.
- Favourite any movie, and assign it to one or more **shelves** (user-created groups, e.g. "Rewatch this winter").
- Remove favourites and delete shelves.
- Favourites and shelves persist across reloads via `localStorage`.

---

## Folder structure

mood-shelf/
├── app/
│   ├── layout.tsx                 # Root layout, fonts, global nav
│   ├── page.tsx                   # "/" — Browse page (mood picker + search + grid)
│   ├── shelves/
│   │   └── page.tsx                # "/shelves" — My Shelves page
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   └── NavBar.tsx
│   ├── movies/
│   │   ├── MovieCard.tsx           # poster, title, favourite button
│   │   ├── MovieGrid.tsx           # renders list of MovieCards, handles empty state
│   │   └── MovieDetailModal.tsx    # slide-over/modal for movie details
│   ├── moods/
│   │   └── MoodPicker.tsx          # chips/tabs for selecting a mood
│   ├── shelves/
│   │   ├── ShelfList.tsx           # renders all shelves on /shelves
│   │   ├── ShelfCard.tsx           # one shelf + its movies
│   │   └── ShelfPicker.tsx         # dropdown to assign a favourite to a shelf
│   └── ui/
│       ├── SearchBar.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
│
├── lib/
│   ├── tmdb.ts                     # all TMDB API calls live here (fetchDiscover, searchMovies, etc.)
│   ├── moods.ts                    # your mood config (already drafted)
│   └── types.ts                    # Movie, Shelf, Mood TypeScript types
│
├── store/
│   └── useShelfStore.ts            # Zustand store: favourites + shelves + actions
│
├── hooks/
│   ├── useMovies.ts                # wraps tmdb.ts calls + loading/error state (or use SWR/React Query directly here)
│   └── usePersistedStore.ts        # localStorage sync wrapper, if not handled via Zustand's persist middleware
│
├── .env.local
├── README.md
└── package.json

---

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | Clean route separation for 2 pages, familiar conventions, fast setup |
| Language | TypeScript | Type safety across API responses and app state |
| Styling | Tailwind CSS | Fast, consistent styling within a tight time budget |
| Data fetching | TMDB REST API via a thin `lib/tmdb.ts` client | Keeps API calls out of components |
| State management | Zustand | Minimal boilerplate, easy to persist, clear separation from fetched data |
| Animation | Framer Motion (2–3 spots only) | Favourite toggle, shelf add/remove — not spread everywhere |
| Persistence | `localStorage`, wrapped in a small hook | Meets the storage requirement without extra infra |

---

## Pages

1. **`/` — Browse**
   Mood picker (tabs or chips) + search bar. Grid of movie cards pulled from TMDB `discover` (per mood) or `search/movie` (when searching). Each card can be favourited and assigned to a shelf inline.

2. **`/shelves` — My Shelves**
   List of user-created shelves, each showing the movies assigned to it. Options to remove a movie from a shelf, delete a shelf entirely, or create a new shelf.

Movie detail (poster, overview, rating) is shown in a modal/slide-over rather than a third route, to keep navigation simple within scope.

---

## How to run locally

```bash
git clone <repo-url>
cd mood-shelf
npm install
```

Create a `.env.local` file with a TMDB API key & access token:

```
TMDB_API_KEY=your_key_here
TMDB_ACCESS_TOKEN=your_access_token
```

Then:

```bash
npm run dev
```

Requires Node 18+.

---

## Architecture decisions

- **Moods as a config, not a feature.** Moods are defined as a static mapping (mood name → genre IDs / keywords) in `lib/moods.ts`. This keeps the "personality" of the app in one editable place, and avoids building a whole taxonomy system for a 2-hour scope.
- **Favourites/shelves state is fully decoupled from API data.** The Zustand store only ever holds movie IDs plus the minimal metadata needed to render a card offline (title, poster path). It never stores full API responses, so shelf data stays small and doesn't go stale if TMDB details change.
- **Persistence via a single `usePersistedStore` wrapper**, rather than manually reading/writing `localStorage` in components, to keep storage logic in one testable place.
- **No backend.** Everything is client-side by design — the exercise asks for storage the user can return to, and `localStorage` satisfies that without adding infrastructure that wouldn't survive a 2-hour budget anyway.

---

## Trade-offs made due to the 2-hour limit

- **No pagination beyond a single "load more" button** — infinite scroll was cut to save time.
- **A fixed, small set of moods** (4–5) rather than a configurable mood builder.
- **Shelf assignment is single-select-at-a-time** (add to one shelf via a dropdown) rather than full drag-and-drop, which would have been nicer UX but too time-expensive to get right.
- **No automated tests.** Given the time budget, manual verification was prioritised over writing test scaffolding (see AI Usage below for what was manually checked).
- **No CI/CD pipeline** — deployed directly via [Vercel/Netlify] for the exercise; would add GitHub Actions for lint/build checks with more time.
- **Minimal accessibility pass** — semantic HTML and basic labelling were included, but a full keyboard-navigation and ARIA audit was out of scope.

---

## What I'd do with more time

- Replace the static mood-to-genre mapping with a lightweight scoring system (e.g. weighting keywords + vote average) so moods feel less hand-picked.
- Drag-and-drop shelf assignment.
- Proper pagination/infinite scroll on the browse page.
- Unit tests for the store logic (favourite/unfavourite, shelf CRUD) and a couple of E2E smoke tests (search → favourite → appears on shelf).
- A GitHub Actions pipeline running lint + build on push, with auto-deploy to Vercel.
- A fuller accessibility pass (focus management in the modal, ARIA labels on icon-only buttons, keyboard support for shelf assignment).
- Mobile-specific interaction tweaks (touch-friendly shelf assignment instead of a hover/dropdown pattern).

---

## AI usage

This project was built with AI assistance. Summary of approach:

- Used AI to scaffold the initial Next.js + TypeScript + Tailwind setup and the TMDB API client.
- Directed feature-by-feature: browse/search UI, mood mapping config, Zustand store, shelf CRUD, persistence hook, then polish (animations, empty/error states).
- Reviewed and edited generated code for: correct separation of API logic from components, consistent typing (no `any` on API response shapes), and removing unused boilerplate.
- Manually verified: favourites persist across reload, shelf deletion doesn't orphan favourite state, search handles empty results and API errors without crashing, mood filters correctly narrow the discover query.
- Where AI suggestions added complexity beyond the 2-hour scope (e.g. drag-and-drop, pagination libraries), those were deferred and noted above under trade-offs rather than implemented.
