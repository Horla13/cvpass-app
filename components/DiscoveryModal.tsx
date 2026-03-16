"use client";

import { useState } from "react";

const SESSION_KEY = "discoveryModalShown";

const SOURCES = [
  { id: "whatsapp", label: "WhatsApp", icon: "💬" },
  { id: "reddit", label: "Reddit", icon: "#" },
  { id: "instagram", label: "Instagram", icon: "📷" },
  { id: "facebook", label: "Facebook", icon: "📘" },
  { id: "youtube", label: "YouTube", icon: "▶️" },
  { id: "friend", label: "Un ami", icon: "👤" },
  { id: "google", label: "Google", icon: "🔍" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "twitter", label: "Twitter/X", icon: "𝕏" },
  { id: "chatgpt", label: "ChatGPT", icon: "#" },
  { id: "other", label: "Autre...", icon: "…" },
];

export function DiscoveryModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (sourceId: string) => {
    setSelected(sourceId);
    // Fire and forget
    fetch("/api/discovery-source", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: sourceId }),
    }).catch(() => {});
    setTimeout(onClose, 600);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pointer-events-none">
      <div
        className="pointer-events-auto w-full max-w-[420px] mx-4 mb-4 sm:mb-0 bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-700 transition-colors z-10"
        >
          ×
        </button>

        <div className="px-6 pt-6 pb-2">
          <p className="text-[11px] font-bold text-green-400 uppercase tracking-widest mb-1">Question rapide</p>
          <p className="text-[15px] font-semibold text-white">Comment avez-vous découvert CVpass ?</p>
        </div>

        <div className="px-4 pb-5 grid grid-cols-3 gap-2">
          {SOURCES.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              disabled={!!selected}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all border ${
                selected === s.id
                  ? "bg-green-500/20 border-green-500 text-green-400"
                  : "bg-[#0f172a] border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-[#1a2744]"
              } disabled:cursor-default`}
            >
              <span className="text-[14px] flex-shrink-0">{s.icon}</span>
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function useDiscoveryModal() {
  const [show, setShow] = useState(false);

  const trigger = () => {
    if (typeof window !== "undefined" && !sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, "1");
      // Show after a short delay to not be intrusive
      setTimeout(() => setShow(true), 2000);
      return true;
    }
    return false;
  };

  return { show, trigger, close: () => setShow(false) };
}
