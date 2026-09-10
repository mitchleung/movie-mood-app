"use client";

import { getPosterUrl } from "@/lib/tmdb";
import type { TmdbMovie } from "@/lib/types";
import MoviePoster from "./MoviePoster";

export function MovieDetailModal({
  movie,
  onClose,
}: {
  movie: TmdbMovie;
  onClose: () => void;
}) {
  const posterUrl = getPosterUrl(movie.poster_path, "w500");

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={movie.title}
    >
      <div
        className="bg-white rounded-lg max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4 border-b">
          <h2 className="text-xl font-bold">{movie.title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-2xl leading-none outline-0 focus-within:outline-1 focus-within:outline-primary"
          >
            &times;
          </button>
        </div>

        <div className="p-4 grid sm:flex gap-4">
          {posterUrl && (
            <div className="relative w-32 mx-auto sm:mx-0 rounded shrink-0 overflow-hidden aspect-2/3">
             <MoviePoster posterUrl={posterUrl} title={movie.title} />
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 mb-2">
              {movie.release_date?.slice(0, 4) || "—"} · ⭐{" "}
              {movie.vote_average.toFixed(1)}
            </p>
            <p className="text-sm">
              {movie.overview || "No description available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
