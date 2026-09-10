import Link from "next/link";
import { NavBar } from "@/components/layout/NavBar";

export function Header() {
  return (
    <header className="border-b bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        <Link href="/" className="font-bold text-base sm:text-lg whitespace-nowrap">
          🎬 Mood Shelf
        </Link>
        <NavBar />
      </div>
    </header>
  );
}