"use client";

import { useState, useEffect } from "react";

const PROMO_DURATION_MS = 48 * 60 * 60 * 1000; // 48h

function formatTime(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function usePromoTimer(createdAt: string | null) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!createdAt) return;
    const deadline = new Date(createdAt).getTime() + PROMO_DURATION_MS;
    const calc = () => Math.max(0, deadline - Date.now());
    setRemaining(calc());
    const interval = setInterval(() => {
      const r = calc();
      setRemaining(r);
      if (r <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  return {
    remaining,
    isActive: remaining !== null && remaining > 0,
    formatted: remaining !== null ? formatTime(remaining) : null,
  };
}

export function PromoTimerBadge({ remaining, formatted }: { remaining: number | null; formatted: string | null }) {
  if (!remaining || remaining <= 0 || !formatted) return null;

  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-[13px]">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="text-amber-700 font-semibold">Offre -15% expire dans {formatted}</span>
    </div>
  );
}
