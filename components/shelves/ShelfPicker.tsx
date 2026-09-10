"use client";

import { useState } from "react";
import { useShelfStore } from "@/store/useShelfStore";

export function ShelfPicker({ movieId }: { movieId: number }) {
  const shelves = useShelfStore((state) => state.shelves);
  const addMovieToShelf = useShelfStore((state) => state.addMovieToShelf);
  const createShelf = useShelfStore((state) => state.createShelf);
  const [newShelfName, setNewShelfName] = useState("");
  const [showInput, setShowInput] = useState(false);

  if (shelves.length === 0 && !showInput) {
    return (
      <button
        onClick={() => setShowInput(true)}
        className="cursor-pointer text-xs text-primary dark:text-gray-600 hover:underline mt-1 outline-0 focus-within:outline-1 focus-within:outline-primary"
      >
        + Create a shelf
      </button>
    );
  }

  if (showInput) {
    return (
      <div className="flex gap-1 mt-1">
        <input
          type="text"
          autoFocus
          placeholder="Shelf name..."
          value={newShelfName}
          onChange={(e) => setNewShelfName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newShelfName.trim()) {
              createShelf(newShelfName.trim());
              setNewShelfName("");
              setShowInput(false);
            }
          }}
          className="text-xs border rounded px-1 py-0.5 flex-1 min-w-0"
        />
        <button
          onClick={() => {
            if (newShelfName.trim()) {
              createShelf(newShelfName.trim());
              setNewShelfName("");
              setShowInput(false);
            }
          }}
          className="cursor-pointer text-xs text-primary outline-0 focus-within:outline-1 focus-within:outline-primary"
        >
          Add
        </button>
      </div>
    );
  }

  return (
    <select
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) {
          addMovieToShelf(e.target.value, movieId);
          e.target.value = "";
        }
      }}
      aria-label="Add to shelf"
      className="text-xs border rounded mt-1 w-full py-1 text-gray-700"
    >
      <option value="" disabled>
        Add to shelf...
      </option>
      {shelves.map((shelf) => (
        <option key={shelf.id} value={shelf.id}>
          {shelf.name}
        </option>
      ))}
    </select>
  );
}