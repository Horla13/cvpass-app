"use client";
import { useState } from "react";
import { isStripeUrl } from "@/lib/utils";

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
      if (data.url && isStripeUrl(data.url)) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-[740px] w-full mx-4 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <h2 className="font-display text-[24px] font-bold mb-1">Crédits insuffisants</h2>
        <p className="text-brand-gray text-[14px] mb-6">
          Il vous faut {creditsNeeded} crédit{creditsNeeded > 1 ? "s" : ""} pour cette action. Rechargez ou passez en illimité.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Pack Starter */}
          <div className="border-2 border-green-200 rounded-xl p-6 relative">
            <div className="text-green-600 text-[12px] font-bold uppercase tracking-wider mb-4">Populaire</div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-[18px] font-bold text-gray-900">Coup de pouce</h3>
                <p className="text-gray-500 text-[13px]">+4 crédits immédiatement</p>
              </div>
              <div className="text-right">
                <div className="text-[24px] font-extrabold text-gray-900">2,90&euro;</div>
                <div className="text-[12px] text-gray-400">paiement unique</div>
              </div>
            </div>

            <ul className="space-y-2.5 my-5 text-[13.5px] text-gray-600">
              {["4 crédits ajoutés à votre solde", "Sans expiration", "Rachetable plusieurs fois"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className="mt-0.5 flex-shrink-0 text-green-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy("starter")}
              disabled={loading === "starter"}
              className="w-full bg-green-500 text-white rounded-xl py-3 font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading === "starter" ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Redirection...</>) : "Acheter le pack"}
            </button>
          </div>

          {/* Recherche Active */}
          <div className="border-2 border-blue-200 rounded-xl p-6 bg-blue-50/30 relative">
            <div className="text-blue-600 text-[12px] font-bold uppercase tracking-wider mb-4">Meilleure valeur</div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-[18px] font-bold text-gray-900">Recherche Active</h3>
                <p className="text-gray-500 text-[13px]">Analyses illimitées pendant 30 jours</p>
              </div>
              <div className="text-right">
                <div className="text-[24px] font-extrabold text-gray-900">8,90&euro;</div>
                <div className="text-[12px] text-gray-400">par mois</div>
              </div>
            </div>

            <ul className="space-y-2.5 my-5 text-[13.5px] text-gray-600">
              {["Analyses illimitées", "Export PDF illimité", "Sans engagement"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className="mt-0.5 flex-shrink-0 text-blue-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy("pro")}
              disabled={loading === "pro"}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-md shadow-blue-200 flex items-center justify-center gap-2"
            >
              {loading === "pro" ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Redirection...</>) : "Passer en illimité"}
            </button>
          </div>
        </div>

        <p className="text-center text-[13px] text-gray-400 mt-5">
          Sans engagement &middot; Paiement sécurisé Stripe
        </p>
      </div>
    </div>
  );
}
