"use client";

import { getPosterUrl } from "@/lib/tmdb";
import { useShelfStore } from "@/store/useShelfStore";
import type { TmdbMovie } from "@/lib/types";
import { ShelfPicker } from "../shelves/ShelfPicker";
import MoviePoster from "./MoviePoster";

export function MovieCard({
  movie,
  onOpenDetail,
}: {
  movie: TmdbMovie;
  onOpenDetail: (movie: TmdbMovie) => void;
}) {
  const isFavourite = useShelfStore((state) => state.isFavourite(movie.id));
  const toggleFavourite = useShelfStore((state) => state.toggleFavourite);

  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col bg-background">
      <div className="relative aspect-2/3 bg-gray-100 dark:bg-gray-700">
        <button
          onClick={() => onOpenDetail(movie)}
          aria-label={`View details of ${movie.title}`}
          className="absolute inset-0 w-full h-full cursor-pointer"
        >
          <MoviePoster posterUrl={posterUrl} title={movie.title} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite({
              id: movie.id,
              title: movie.title,
              posterPath: movie.poster_path,
              voteAverage: movie.vote_average,
              releaseDate: movie.release_date,
            });
          }}
          aria-label={
            isFavourite ? "Remove from favourites" : "Add to favourites"
          }
          aria-pressed={isFavourite}
          className="cursor-pointer absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-lg text-gray-700 shadow outline-0 focus-within:outline-1 focus-within:outline-primary"
        >
          {isFavourite ? "★" : "☆"}
        </button>
      </div>

      <div className="p-2">
        <p className="font-medium text-gray-700 dark:text-gray-200 text-sm truncate">
          {movie.title}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-300">
          {movie.release_date?.slice(0, 4) || "—"} · ⭐{" "}
          {movie.vote_average.toFixed(1)}
        </p>

        {isFavourite && (
          <div onClick={(e) => e.stopPropagation()}>
            <ShelfPicker movieId={movie.id} />
          </div>
        )}
      </div>
    </div>
  );
}
