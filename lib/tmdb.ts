import type { TmdbMovie } from "./types";

type TmdbResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export async function discoverByMood(
  genreIds: number[],
  filters?: {
    voteAverageGte?: number;
    runtimeLte?: number;
    runtimeGte?: number;
  },
  page: number = 1,
  signal?: AbortSignal,
): Promise<TmdbResponse> {
  const params = new URLSearchParams({
    with_genres: genreIds.join(","),
    sort_by: "popularity.desc",
    page: String(page),
  });
  if (filters?.voteAverageGte)
    params.set("vote_average.gte", String(filters.voteAverageGte));
  if (filters?.runtimeLte)
    params.set("with_runtime.lte", String(filters.runtimeLte));
  if (filters?.runtimeGte)
    params.set("with_runtime.gte", String(filters.runtimeGte));

  const res = await fetch(`/api/tmdb/discover?${params.toString()}`, {
    signal,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function searchMovies(
  query: string,
  page: number = 1,
  signal?: AbortSignal,
): Promise<TmdbResponse> {
  const params = new URLSearchParams({ query, page: String(page) });
  const res = await fetch(`/api/tmdb/search?${params.toString()}`, { signal });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function getPosterUrl(
  posterPath: string | null,
  size: "w200" | "w342" | "w500" = "w342",
) {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
