"use client";

import { useState } from "react";
import { useMovies } from "@/hooks/useMovies";
import { MOODS } from "@/lib/moods";
import { MovieCard } from "@/components/movies/MovieCard";
import { MovieDetailModal } from "@/components/movies/MovieDetailModal";
import { TmdbMovie } from "@/lib/types";

export default function BrowsePage() {
  const [selectedMoodId, setSelectedMoodId] = useState(MOODS[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedMood = MOODS.find((m) => m.id === selectedMoodId) ?? null;
  const { movies, isLoading, isLoadingMore, error, hasMore, loadMore } =
    useMovies(selectedMood, searchQuery);
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie | null>(null);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Mood Shelf</h1>
      <p className="mx-auto max-w-md">
        Pick movies by mood. Add to your favourites and you can also put movies
        into different shelf.
      </p>
      <div className="relative mb-4 mx-auto max-w-md">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded  w-full block outline-0 focus-within:outline-1 focus-within:outline-primary ring-0"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            ×
          </button>
        )}
      </div>

      <div className="relative">
        <div className="flex gap-2 mb-6 overflow-auto scrollbar-thin before:content-[''] before:absolute before:inset-y-0 before:left-0 before:bottom-6 before:w-6 before:bg-linear-to-r before:from-background before:to-transparent before:pointer-events-none before:z-10 after:content-[''] after:absolute after:inset-y-0 after:right-0 after:bottom-6 after:w-6 after:bg-linear-to-l after:from-background after:to-transparent after:pointer-events-none after:z-10 snap-x scroll-ps-6 scroll-pe-6 px-6 pb-6">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              disabled={searchQuery.trim().length > 0}
              onClick={() =>
                setSelectedMoodId(() => {
                  // clear text input
                  return mood.id;
                })
              }
              className={`snap-start px-3 py-1 rounded-full border whitespace-nowrap outline-0 focus-within:outline-1 focus-within:outline-primary cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 ${
                selectedMoodId === mood.id ? "bg-gray-800 text-white" : "bg-white"
              }`}
            >
              {mood.emoji} {mood.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {!isLoading && !error && movies.length === 0 && <p>No movies found.</p>}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => setSelectedMovie(movie)}
            className="cursor-pointer"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
      {hasMore && !isLoading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="px-4 py-2 border rounded text-sm disabled:opacity-50 outline-0 focus-within:outline-1 focus-within:outline-primary"
          >
            {isLoadingMore ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
