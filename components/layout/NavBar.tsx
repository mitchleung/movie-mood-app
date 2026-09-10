import Link from "next/link";

const LINKS = [
  { href: "/", label: "Browse" },
  { href: "/shelves", label: "My Shelves" },
];

export function NavBar() {
  return (
    <nav className="flex gap-4" aria-label="Main navigation">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition-colors whitespace-nowrap"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}