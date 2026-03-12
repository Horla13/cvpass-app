"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Analyser" },
];

export function AppHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-white/[0.92] backdrop-blur-[16px] sticky top-0 z-40 border-b border-black/[0.04]">
      <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/dashboard" className="shrink-0 font-display text-[21px] font-extrabold tracking-[-0.8px]">
          <span className="text-brand-black">CV</span>
          <span className="text-brand-green">pass</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "text-brand-green underline underline-offset-4 decoration-brand-green font-display"
                    : "text-brand-gray hover:text-brand-black"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right — UserButton + mobile hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md text-brand-gray hover:text-brand-black hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          <UserButton />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-6 py-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "text-[#16a34a] bg-green-50"
                    : "text-brand-gray hover:text-brand-black hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
