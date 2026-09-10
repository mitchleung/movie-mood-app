import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FavouriteMovie, Shelf } from "@/lib/types";

type ShelfState = {
  favourites: FavouriteMovie[];
  shelves: Shelf[];

  // favourites
  isFavourite: (movieId: number) => boolean;
  toggleFavourite: (movie: FavouriteMovie) => void;
  removeFavourite: (movieId: number) => void;

  // shelves
  createShelf: (name: string) => void;
  deleteShelf: (shelfId: string) => void;
  addMovieToShelf: (shelfId: string, movieId: number) => void;
  removeMovieFromShelf: (shelfId: string, movieId: number) => void;
};

export const useShelfStore = create<ShelfState>()(
  persist(
    (set, get) => ({
      favourites: [],
      shelves: [],

      isFavourite: (movieId) => get().favourites.some((m) => m.id === movieId),

      toggleFavourite: (movie) => {
        const exists = get().favourites.some((m) => m.id === movie.id);
        set((state) => ({
          favourites: exists
            ? state.favourites.filter((m) => m.id !== movie.id)
            : [...state.favourites, movie],
          // if un-favouriting, also pull it out of every shelf so we don't
          // end up with orphaned movie IDs referencing a removed favourite
          shelves: exists
            ? state.shelves.map((shelf) => ({
                ...shelf,
                movieIds: shelf.movieIds.filter((id) => id !== movie.id),
              }))
            : state.shelves,
        }));
      },

      removeFavourite: (movieId) => {
        set((state) => ({
          favourites: state.favourites.filter((m) => m.id !== movieId),
          shelves: state.shelves.map((shelf) => ({
            ...shelf,
            movieIds: shelf.movieIds.filter((id) => id !== movieId),
          })),
        }));
      },

      createShelf: (name) => {
        const newShelf: Shelf = {
          id: crypto.randomUUID(),
          name,
          movieIds: [],
          createdAt: Date.now(),
        };
        set((state) => ({ shelves: [...state.shelves, newShelf] }));
      },

      deleteShelf: (shelfId) => {
        set((state) => ({
          shelves: state.shelves.filter((s) => s.id !== shelfId),
        }));
      },

      addMovieToShelf: (shelfId, movieId) => {
        set((state) => ({
          shelves: state.shelves.map((shelf) =>
            shelf.id === shelfId && !shelf.movieIds.includes(movieId)
              ? { ...shelf, movieIds: [...shelf.movieIds, movieId] }
              : shelf,
          ),
        }));
      },

      removeMovieFromShelf: (shelfId, movieId) => {
        set((state) => ({
          shelves: state.shelves.map((shelf) =>
            shelf.id === shelfId
              ? {
                  ...shelf,
                  movieIds: shelf.movieIds.filter((id) => id !== movieId),
                }
              : shelf,
          ),
        }));
      },
    }),
    {
      name: "mood-shelf-storage", // localStorage key
    },
  ),
);
