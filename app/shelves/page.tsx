import { ShelfList } from "@/components/shelves/ShelfList";

export default function ShelvesPage() {
  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="text-2xl font-bold mb-4 text-center">My Shelves</h1>
      <p className="mx-auto max-w-md mb-8">
        Add more shelves by typing in the text input below to `Create shelf`. Then you can put favourite movies into one of your shelves.
      </p>
      <ShelfList />
    </div>
  );
}