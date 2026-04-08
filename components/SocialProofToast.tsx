"use client";

import { useState, useEffect, useCallback } from "react";

interface ProofItem {
  job_title: string;
  score_avant: number;
  score_apres: number;
  created_at: string;
}

const FIRST_NAMES = [
  "Marie", "Thomas", "Sophie", "Lucas", "Camille", "Hugo", "Emma", "Louis",
  "Lea", "Jules", "Chloe", "Nathan", "Manon", "Theo", "Sarah", "Maxime",
  "Laura", "Antoine", "Julie", "Alexandre", "Ines", "Romain", "Clara", "Mehdi",
];

function timeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 2) return "a l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `il y a ${hrs}h`;
  return "hier";
}

export function SocialProofToast() {
  const [items, setItems] = useState<ProofItem[]>([]);
  const [current, setCurrent] = useState<ProofItem | null>(null);
  const [visible, setVisible] = useState(false);
  const indexRef = { current: 0 };

  // Fetch recent analyses on mount
  useEffect(() => {
    fetch("/api/count")
      .then((r) => r.json())
      .then((d) => {
        if (d.recent && Array.isArray(d.recent)) {
          setItems(d.recent);
        }
      })
      .catch(() => {});
  }, []);

  const showNext = useCallback(() => {
    if (items.length === 0) return;
    const item = items[indexRef.current % items.length];
    indexRef.current++;
    setCurrent(item);
    setVisible(true);
    setTimeout(() => setVisible(false), 4000);
  }, [items]);

  // Show first toast after 8s, then every 15s
  useEffect(() => {
    if (items.length === 0) return;
    const first = setTimeout(showNext, 8000);
    const interval = setInterval(showNext, 15000);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [items, showNext]);

  if (!current) return null;

  const name = FIRST_NAMES[Math.abs(current.job_title.charCodeAt(0)) % FIRST_NAMES.length];
  const initial = name[0];

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 max-w-[340px]">
        <div className="w-9 h-9 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-[14px] shrink-0">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] text-gray-900 font-medium truncate">
            {name} a optimise son CV
          </p>
          <p className="text-[12px] text-gray-400">
            {current.job_title} &middot; {current.score_avant} → <span className="text-green-600 font-semibold">{current.score_apres}</span> &middot; {timeAgo(current.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}
