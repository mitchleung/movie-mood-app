import { ShelfList } from "@/components/shelves/ShelfList";

export default function ShelvesPage() {
  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">My Shelves</h1>
      <ShelfList />
    </div>
  );
}