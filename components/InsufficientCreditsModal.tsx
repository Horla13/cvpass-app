"use client";
import { useState } from "react";

interface Props {
  creditsNeeded: number;
  onClose: () => void;
}

export default function InsufficientCreditsModal({ creditsNeeded, onClose }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (plan: string) => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-[700px] w-full mx-4 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <h2 className="font-display text-[24px] font-bold mb-1">Crédits insuffisants</h2>
        <p className="text-brand-gray text-[14px] mb-2">
          Il vous faut {creditsNeeded} crédit{creditsNeeded > 1 ? "s" : ""} pour cette action.
        </p>
        <p className="text-brand-gray text-[14px] mb-6">Achetez des crédits ou passez en illimité</p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Pack */}
          <div className="border-2 border-green-200 rounded-xl p-6">
            <div className="text-green-600 text-[13px] font-bold mb-3">Populaire</div>
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-display text-[18px] font-bold">Coup de pouce</h3>
              <div className="text-[22px] font-bold">2,90&euro;</div>
            </div>
            <p className="text-brand-gray text-[13px] mb-4">Idéal pour 3-4 candidatures urgentes</p>
            <ul className="space-y-2 mb-6 text-[14px]">
              {["4 crédits à utiliser quand vous voulez", "Éditeur CV avec corrections IA", "Export PDF propre (sans filigrane)", "Crédits sans expiration"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleBuy("pass48h")}
              disabled={loading === "pass48h"}
              className="w-full bg-green-500 text-white rounded-xl py-3 font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading === "pass48h" ? "Redirection..." : "Acheter le pack"}
            </button>
          </div>

          {/* Monthly */}
          <div className="border-2 border-blue-200 rounded-xl p-6">
            <div className="text-blue-600 text-[13px] font-bold mb-3">Meilleure valeur</div>
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="font-display text-[18px] font-bold">Recherche Active</h3>
              <div className="text-[22px] font-bold">8,90&euro;<span className="text-[14px] font-normal text-brand-gray">/mois</span></div>
            </div>
            <p className="text-brand-gray text-[13px] mb-4">Scans illimités &middot; -5% chaque mois</p>
            <ul className="space-y-2 mb-6 text-[14px]">
              {["Scans illimités", "Éditeur CV avec corrections IA", "Export PDF propre illimité", "Crédits conservés après le plan"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleBuy("monthly")}
              disabled={loading === "monthly"}
              className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading === "monthly" ? "Redirection..." : "Passer en illimité"}
            </button>
          </div>
        </div>

        <p className="text-center text-[13px] text-brand-gray mt-4">
          Paiement sécurisé Stripe &middot; Sans engagement &middot; Satisfait ou remboursé 7 jours
        </p>
      </div>
    </div>
  );
}
