import type { TmdbMovie } from "./types";

const BASE_URL = "https://api.themoviedb.org/3";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN;

type TmdbResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

/**
 * 
 * @param path 
 * @param params 
 * @returns 
 */
async function tmdbFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.set(key, value),
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status}`);
  }
  return res.json();
}
/**
 * 
 * @param genreIds 
 * @param filters 
 * @param page 
 * @returns 
 */
export async function discoverByMood(
  genreIds: number[],
  filters?: {
    voteAverageGte?: number;
    runtimeLte?: number;
    runtimeGte?: number;
  },
  page: number = 1,
): Promise<TmdbResponse> {
  return tmdbFetch("/discover/movie", {
    with_genres: genreIds.join(","),
    ...(filters?.voteAverageGte && {
      "vote_average.gte": String(filters.voteAverageGte),
    }),
    ...(filters?.runtimeLte && {
      "with_runtime.lte": String(filters.runtimeLte),
    }),
    ...(filters?.runtimeGte && {
      "with_runtime.gte": String(filters.runtimeGte),
    }),
    sort_by: "popularity.desc",
    page: String(page),
  });
}

/**
 * 
 * @param query 
 * @param page 
 * @returns 
 */
export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<TmdbResponse> {
  return tmdbFetch("/search/movie", { query, page: String(page) });
}

/**
 * 
 * @param posterPath 
 * @param size 
 * @returns 
 */
export function getPosterUrl(
  posterPath: string | null,
  size: "w200" | "w342" | "w500" = "w342",
) {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
