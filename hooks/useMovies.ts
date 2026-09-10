import { useState, useEffect, useCallback } from "react";
import { discoverByMood, searchMovies } from "@/lib/tmdb";
import type { TmdbMovie } from "@/lib/types";
import type { Mood } from "@/lib/moods";

type MoviesState = {
  movies: TmdbMovie[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
};

export function useMovies(mood: Mood | null, searchQuery: string) {
  const [state, setState] = useState<MoviesState>({
    movies: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    page: 1,
    hasMore: false,
  });

  useEffect(() => {
    const controller = new AbortController();

    async function fetchInitial() {
      setState((prev) => ({ ...prev, isLoading: true, error: null, page: 1 }));

      try {
        const response = searchQuery.trim()
          ? await searchMovies(searchQuery.trim(), 1, controller.signal)
          : mood
            ? await discoverByMood(
                mood.genreIds,
                mood.filters,
                1,
                controller.signal,
              )
            : { results: [], total_pages: 0, page: 1, total_results: 0 };

        setState({
          movies: response.results,
          isLoading: false,
          isLoadingMore: false,
          error: null,
          page: 1,
          hasMore: response.total_pages > 1,
        });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return; // cancelled — ignore
        setState({
          movies: [],
          isLoading: false,
          isLoadingMore: false,
          error: err instanceof Error ? err.message : "Something went wrong",
          page: 1,
          hasMore: false,
        });
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetch-on-mount/dep-change pattern
    fetchInitial();

    return () => controller.abort();
  }, [mood, searchQuery]);

  const loadMore = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    const nextPage = state.page + 1;
    try {
      const response = searchQuery.trim()
        ? await searchMovies(searchQuery.trim(), nextPage)
        : mood
          ? await discoverByMood(mood!.genreIds, mood!.filters, nextPage)
          : { results: [], total_pages: 0, page: nextPage, total_results: 0 };

      setState((prev) => ({
        movies: [...prev.movies, ...response.results],
        isLoading: false,
        isLoadingMore: false,
        error: null,
        page: nextPage,
        hasMore: nextPage < response.total_pages,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoadingMore: false,
        error: err instanceof Error ? err.message : "Failed to load more",
      }));
    }
  }, [mood, searchQuery, state.page]);

  return { ...state, loadMore };
}
