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

  // fetch page 1 fresh whenever mood or search changes
  const fetchInitial = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, page: 1 }));

    try {
      const response = searchQuery.trim()
        ? await searchMovies(searchQuery.trim(), 1)
        : mood
          ? await discoverByMood(mood.genreIds, mood.filters, 1)
          : { results: [], total_pages: 0 };

      setState({
        movies: response.results,
        isLoading: false,
        isLoadingMore: false,
        error: null,
        page: 1,
        hasMore: response.total_pages > 1,
      });
    } catch (err) {
      setState({
        movies: [],
        isLoading: false,
        isLoadingMore: false,
        error: err instanceof Error ? err.message : "Something went wrong",
        page: 1,
        hasMore: false,
      });
    }
  }, [mood, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetch-on-mount/dep-change pattern
    fetchInitial();
  }, [fetchInitial]);

  const loadMore = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoadingMore: true }));

    const nextPage = state.page + 1;
    try {
      const response = searchQuery.trim()
        ? await searchMovies(searchQuery.trim(), nextPage)
        : mood
          ? await discoverByMood(mood!.genreIds, mood!.filters, nextPage)
          : { results: [], total_pages: 0 };

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
