<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# AGENTS.md

Instructions for AI coding agents (e.g. Claude Code) working in this repository.

## Project

Mood Shelf — a movie discovery app for the MPF front-end exercise. Users browse movies by curated "mood" (mapped to TMDB genres/filters), favourite them, and organize favourites into user-created "shelves." Everything persists to `localStorage`.

**Time constraint: this project is scoped to a 2-hour build.** Prefer simple, working solutions over ideal ones. If a choice would take meaningfully longer for marginal benefit, take the simpler path and note the trade-off in README.md rather than spending the time.

## Tech stack (do not substitute without asking)

- Next.js (App Router), TypeScript, Tailwind CSS
- Zustand for global state, using the `persist` middleware for localStorage — do not hand-roll localStorage read/write logic
- TMDB API v4 auth (Bearer token via `NEXT_PUBLIC_TMDB_ACCESS_TOKEN` in `.env.local`), not the v3 `api_key` query param
- No additional state libraries, no UI component libraries (build with Tailwind directly)
- Plain `<img>` for TMDB posters, not `next/image` (avoids `remotePatterns` config overhead — acceptable trade-off, note it in README if not already there)

## Folder structure

```
app/                    # routes only — pages compose components, no business logic here
  layout.tsx            # root layout, fonts, Header
  page.tsx              # "/" Browse page
  shelves/page.tsx       # "/shelves" page
components/
  layout/               # Header, NavBar — Server Components, no hooks
  movies/               # MovieCard, MovieGrid, MovieDetailModal
  moods/                # MoodPicker
  shelves/              # ShelfList, ShelfCard, ShelfPicker
  ui/                   # SearchBar, LoadingSpinner, ErrorMessage
lib/
  tmdb.ts               # the ONLY file that calls the TMDB API directly
  moods.ts              # static mood -> genre/filter config
  types.ts              # shared TypeScript types
store/
  useShelfStore.ts       # single Zustand store: favourites + shelves, persisted together
hooks/
  useMovies.ts           # wraps tmdb.ts calls with loading/error/pagination state
```

Keep this structure. Don't create a separate hook for localStorage — `useShelfStore.ts`'s `persist` wrapper already covers it.

## State boundaries (important — don't blur these)

- **Global state (Zustand, persisted):** favourites, shelves. Anything the user expects to still be there after closing and reopening the app.
- **Local state (component/hook-level, not persisted):** current mood selection, search query text, fetched movie results, loading/error flags, current page number. This is transient, request-scoped UI state — it does not belong in the Zustand store even though it changes often.

If a task seems to require adding fetched API data or loading flags to `useShelfStore`, stop and reconsider — that almost always means the state should stay local instead.

## Data model conventions

- `useShelfStore` never stores full TMDB API responses. It stores only the minimal `FavouriteMovie` shape (id, title, posterPath, voteAverage, releaseDate) needed to render a card offline.
- Deleting a favourite or un-favouriting a movie must cascade: remove that movie's ID from every shelf's `movieIds` array in the same state update. Never leave a shelf pointing at a favourite ID that no longer exists.

## Known gotchas

- **`react-hooks/set-state-in-effect` lint rule** may flag the standard data-fetching pattern in `useMovies.ts` (calling an async fetch function from inside `useEffect` that calls `setState`). This is a known false positive on a legitimate, documented React pattern. Fix with:

  ```ts
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetch-on-mount/dep-change pattern
    fetchMovies();
  }, [fetchMovies]);
  ```

  Do not attempt to "fix" this with `useEffectEvent` unless explicitly asked — it adds complexity without a real correctness benefit for this pattern, and isn't worth the time in a 2-hour budget.
- TMDB's Bearer token auth needs to be sent as a header (`Authorization: Bearer ${token}`), not a query param. All TMDB calls go through `lib/tmdb.ts` — never call `fetch` against TMDB directly from a component or hook.
- Interactive elements nested inside a clickable card (favourite star button, shelf-assign dropdown) must call `e.stopPropagation()` in their own `onClick`, or clicking them will also trigger the parent card's click handler (e.g. opening the detail modal).

## Accessibility baseline (don't skip these, they're cheap)

- Icon-only buttons (favourite star, delete shelf) need `aria-label`.
- Favourite toggle buttons need `aria-pressed`.
- Modals need `role="dialog"`, `aria-modal="true"`, and a labelled title.
- Keep the skip-to-content link in `layout.tsx` — and make sure it uses `focus:not-sr-only` (not just `sr-only`), or it will be invisible even when focused via keyboard, defeating its purpose.

## Definition of done for any feature task

Before considering a feature complete, verify (don't just assume):

1. `npm run dev` runs with no console errors
2. Cold reload test: refresh the browser and confirm persisted state (favourites, shelves) survives
3. Manually exercise the feature's happy path AND at least one edge case (empty state, API error, no results)
4. No `TODO`/commented-out dead code left behind (e.g. remove unused scaffold files like an empty `usePersistedStore.ts` rather than leaving them)

## Documentation requirements

Every feature or non-trivial fix should be reflected in `README.md`:

- Add to "Trade-offs" if a shortcut was taken due to the time budget
- Add to "What I'd do with more time" if something was deferred
- Keep the "AI usage" section current — note what was AI-generated vs. human-directed, and what was manually verified before being accepted

## When unsure

If a requirement is ambiguous or a decision isn't covered above, make the simplest reasonable choice that satisfies the stated requirement, implement it, and document the assumption in README.md rather than blocking on it — this project is time-boxed, not perfectionist.
