"use client";

import { useState } from "react";
import { useShelfStore } from "@/store/useShelfStore";
import { ShelfCard } from "./ShelfCard";

export function ShelfList() {
  const [newShelfName, setNewShelfName] = useState("");
  const shelves = useShelfStore((state) => state.shelves);
  const createShelf = useShelfStore((state) => state.createShelf);

  const handleCreate = () => {
    const trimmed = newShelfName.trim();
    if (trimmed) {
      createShelf(trimmed);
      setNewShelfName("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-2 mb-6 mx-auto max-w-md">
        <input
          type="text"
          placeholder="New shelf name..."
          value={newShelfName}
          onChange={(e) => setNewShelfName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          aria-label="New shelf name"
          className="border px-3 py-2 rounded flex-1 max-w-sm"
        />
        <button
          onClick={handleCreate}
          className="cursor-pointer bg-black text-white px-4 py-2 rounded outline-0 focus-within:outline-1 focus-within:outline-primary"
        >
          Create shelf
        </button>
      </div>

      {shelves.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center">No shelves yet — create one above.</p>
      ) : (
        shelves.map((shelf) => <ShelfCard key={shelf.id} shelfId={shelf.id} />)
      )}
    </div>
  );
}