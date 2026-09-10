"use client";

import { useShelfStore } from "@/store/useShelfStore";
import { getPosterUrl } from "@/lib/tmdb";
import MoviePoster from "../movies/MoviePoster";

export function ShelfCard({ shelfId }: { shelfId: string }) {
  const shelf = useShelfStore((state) =>
    state.shelves.find((s) => s.id === shelfId),
  );
  const favourites = useShelfStore((state) => state.favourites);
  const deleteShelf = useShelfStore((state) => state.deleteShelf);
  const removeMovieFromShelf = useShelfStore(
    (state) => state.removeMovieFromShelf,
  );

  if (!shelf) return null;

  const shelfMovies = favourites.filter((m) => shelf.movieIds.includes(m.id));

  return (
    <div className="border rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg">{shelf.name}</h2>
        <button
          onClick={() => deleteShelf(shelf.id)}
          aria-label={`Delete shelf ${shelf.name}`}
          className="cursor-pointer text-sm text-danger hover:underline outline-0 focus-within:outline-1 focus-within:outline-primary"
        >
          Delete shelf
        </button>
      </div>

      {shelfMovies.length === 0 ? (
        <p className="text-sm text-gray-600">No movies on this shelf yet.</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {shelfMovies.map((movie) => {
            const posterUrl = getPosterUrl(movie.posterPath, "w200");
            return (
              <div key={movie.id} className="text-center">
                <div className="relative aspect-2/3 bg-gray-100 rounded overflow-hidden mb-1 w-full h-full ">
                  <MoviePoster posterUrl={posterUrl} title={movie.title} />
                </div>
                <p className="text-xs truncate">{movie.title}</p>
                <button
                  onClick={() => removeMovieFromShelf(shelf.id, movie.id)}
                  className="cursor-pointer text-xs text-gray-500 hover:underline outline-0 focus-within:outline-1 focus-within:outline-primary"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
