// Minimal shape we keep from a TMDB movie — enough to render a card offline.
// We deliberately do NOT store the full TMDB response in app state (see store notes).
export type FavouriteMovie = {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage: number;
  releaseDate: string;
};

// Full TMDB movie shape, as returned by discover/search endpoints.
// Only the fields we actually use are typed — extend as needed.
export type TmdbMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
};

export type Shelf = {
  id: string;
  name: string;
  movieIds: number[]; // references FavouriteMovie.id
  createdAt: number;
};
