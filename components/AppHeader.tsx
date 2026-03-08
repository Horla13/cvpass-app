"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Analyser" },
  { href: "/history", label: "Historique" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="font-bold text-brand-black text-lg hover:text-brand-green transition-colors"
        >
          CVpass
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-brand-green"
                  : "text-brand-gray hover:text-brand-black"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side : mobile nav + UserButton */}
        <div className="flex items-center gap-4">
          {/* Navigation mobile */}
          <nav className="flex sm:hidden items-center gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-brand-green"
                    : "text-brand-gray hover:text-brand-black"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
