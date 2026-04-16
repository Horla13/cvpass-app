"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";


const NAV_LINKS_AUTH = [
  { href: "/analyze", label: "Analyser" },
  { href: "/tracker", label: "Candidatures" },
  { href: "/pricing", label: "Tarifs" },
];

const TOOLS_DROPDOWN = [
  { href: "/analyze-job", label: "Analyseur d'offre", tag: "1 crédit" },
  { href: "/coach-entretien", label: "Coach entretien", tag: "Pro" },
  { href: "/linkedin", label: "Optimiseur LinkedIn", tag: "Pro" },
  { href: "/salaires", label: "Simulateur salaire", tag: "Gratuit" },
  { href: "/affiliate", label: "Programme affiliation" },
];

const NAV_LINKS_PUBLIC = [
  { href: "/pricing", label: "Tarifs" },
  { href: "/blog", label: "Blog" },
];

export function AppHeader() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/credits").then((r) => r.json()).then((d) => {
        setCredits(d.credits ?? null);
        // Check admin status from email
        if (d.email && ["armagio13@gmail.com", "contact@cvpass.fr"].includes(d.email)) {
          setIsAdmin(true);
        }
      }).catch(() => {});
    }
  }, [isSignedIn]);

  return (
    <header className="bg-white/[0.92] backdrop-blur-[16px] sticky top-0 z-40 border-b border-black/[0.04]">
      <div className="max-w-7xl mx-auto px-6 h-[60px] flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="shrink-0 font-display text-[21px] font-extrabold tracking-[-0.8px]">
          <span className="text-brand-black">CV</span>
          <span className="text-brand-green">pass</span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
          {(isSignedIn ? NAV_LINKS_AUTH : NAV_LINKS_PUBLIC).map((link) => {
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
          {isSignedIn && (
            <div className="relative">
              <button
                onClick={() => setToolsOpen((v) => !v)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
                  TOOLS_DROPDOWN.some((t) => pathname === t.href)
                    ? "text-brand-green font-display"
                    : "text-brand-gray hover:text-brand-black"
                )}
              >
                Outils
                <svg className={cn("transition-transform", toolsOpen && "rotate-180")} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
              </button>
              {toolsOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setToolsOpen(false)} />
                  <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-56">
                    {TOOLS_DROPDOWN.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-2.5 text-[14px] transition-colors",
                          pathname === tool.href ? "text-brand-green font-semibold bg-green-50" : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {tool.label}
                        {tool.tag && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{tool.tag}</span>}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {isAdmin && (
            <Link
              href="/admin/affiliates"
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname === "/admin/affiliates"
                  ? "text-brand-green underline underline-offset-4 decoration-brand-green font-display"
                  : "text-amber-600 hover:text-amber-700"
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right — CTA / Credits + UserButton + mobile hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Non-connected: CTA button */}
          {!isSignedIn && (
            <Link
              href="/signup"
              className="hidden sm:inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2 rounded-lg text-[14px] font-semibold hover:bg-green-600 transition-colors"
            >
              Analyser mon CV
              <svg width="14" height="14" fill="none"><path d="M3 7h8m0 0L8 4m3 3L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          )}
          {/* Credit badge */}
          {isSignedIn && credits !== null && (
            <Link
              href="/pricing"
              className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1 text-[13px] hover:bg-amber-100 transition-colors"
            >
              <span className="text-amber-500">&#9889;</span>
              <span className="font-semibold text-amber-700">{credits}</span>
            </Link>
          )}
          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-md text-brand-gray hover:text-brand-black hover:bg-gray-100 transition-colors"
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
          {(isSignedIn ? NAV_LINKS_AUTH : NAV_LINKS_PUBLIC).map((link) => {
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
          {isSignedIn && (
            <>
              <div className="border-t border-gray-100 my-2" />
              <p className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Outils</p>
              {TOOLS_DROPDOWN.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    pathname === tool.href ? "text-brand-green bg-green-50" : "text-brand-gray hover:text-brand-black hover:bg-gray-50"
                  )}
                >
                  {tool.label}
                  {tool.tag && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{tool.tag}</span>}
                </Link>
              ))}
            </>
          )}
          {!isSignedIn && (
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-md text-sm font-semibold text-brand-green"
            >
              Analyser mon CV →
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin/affiliates"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-md text-sm font-semibold text-amber-600"
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
