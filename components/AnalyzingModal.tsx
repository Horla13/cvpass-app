"use client";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Extraction du contenu...",
  "Analyse des mots-clés...",
  "Comparaison avec l'offre...",
  "Évaluation des compétences...",
  "Génération des suggestions...",
  "Finalisation du rapport...",
];

export default function AnalyzingModal({ type }: { type: "ats" | "jd" }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-8 max-w-[400px] w-full mx-4 text-center shadow-xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full px-4 py-1.5 text-[13px] font-medium mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /></svg>
          Analyse IA Premium
        </div>

        {/* Spinner */}
        <div className="w-16 h-16 mx-auto mb-6 relative">
          <div className="w-full h-full rounded-full border-4 border-blue-100 dark:border-blue-900" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" strokeDasharray="4 4" /></svg>
          </div>
        </div>

        <h2 className="font-display text-[22px] font-bold mb-2 dark:text-gray-100">
          {type === "jd" ? "Analyse du match en cours" : "Analyse ATS en cours"}
        </h2>
        <p className="text-brand-gray dark:text-gray-400 text-[14px] mb-3">
          {MESSAGES[msgIndex]}
        </p>
        <p className="text-brand-gray dark:text-gray-400 text-[13px]">
          Analyse approfondie &mdash; nous vérifions 50+ facteurs
        </p>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4 mb-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i <= msgIndex ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>

        <p className="text-[12px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          Powered by advanced AI models for accurate results
        </p>
      </div>
    </div>
  );
}
