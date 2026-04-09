"use client";
import { useState } from "react";
import { isStripeUrl } from "@/lib/utils";

interface Props {
  creditsNeeded: number;
  onClose: () => void;
  scoreAvant?: number;
  scoreApres?: number;
  nbAccepted?: number;
  promoActive?: boolean;
  promoFormatted?: string | null;
}

export default function InsufficientCreditsModal({ creditsNeeded, onClose, scoreAvant, scoreApres, nbAccepted, promoActive, promoFormatted }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const hasScoreData = scoreAvant !== undefined && scoreApres !== undefined && scoreApres > scoreAvant;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-[740px] w-full shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 min-h-[44px] min-w-[44px] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        {/* Score showcase — if user has improved their CV */}
        {hasScoreData ? (
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 mb-3">
              <div className="text-center">
                <div className="text-[32px] font-extrabold text-red-400">{scoreAvant}</div>
                <div className="text-[11px] text-gray-400">Avant</div>
              </div>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
              <div className="text-center">
                <div className="text-[32px] font-extrabold text-green-500">{scoreApres}</div>
                <div className="text-[11px] text-gray-400">Apres</div>
              </div>
            </div>
            <h2 className="font-display text-[22px] font-bold text-gray-900 mb-1">
              Votre CV est pret — debloquez le PDF
            </h2>
            <p className="text-gray-500 text-[14px]">
              {nbAccepted && nbAccepted > 0
                ? `${nbAccepted} amelioration${nbAccepted > 1 ? "s" : ""} appliquee${nbAccepted > 1 ? "s" : ""}. Telechargez votre CV optimise.`
                : `Il vous faut ${creditsNeeded} credit${creditsNeeded > 1 ? "s" : ""} pour telecharger.`
              }
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl sm:rounded-full px-4 py-2 text-[12px] text-amber-600 font-medium text-center sm:text-left">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Vos modifications sont en memoire — elles disparaitront a la fermeture
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="font-display text-[22px] font-bold text-gray-900 mb-1">Debloquez cette fonctionnalite</h2>
            <p className="text-gray-500 text-[14px]">
              Il vous faut {creditsNeeded} credit{creditsNeeded > 1 ? "s" : ""} pour continuer. Rechargez ou passez en illimite.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          {/* Pack Starter */}
          <div className="border-2 border-green-200 rounded-xl p-6 relative">
            <div className="text-green-600 text-[12px] font-bold uppercase tracking-wider mb-4">Populaire</div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-[18px] font-bold text-gray-900">Coup de pouce</h3>
                <p className="text-gray-500 text-[13px]">+4 credits immediatement</p>
              </div>
              <div className="text-right">
                <div className="text-[24px] font-extrabold text-gray-900">2,90&euro;</div>
                <div className="text-[12px] text-gray-400">paiement unique</div>
              </div>
            </div>

            <ul className="space-y-2.5 my-5 text-[13.5px] text-gray-600">
              {["4 credits ajoutes a votre solde", "Sans expiration", "Rachetable plusieurs fois"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className="mt-0.5 flex-shrink-0 text-green-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy("starter")}
              disabled={loading === "starter"}
              className="w-full min-h-[48px] bg-green-500 text-white rounded-xl py-3 font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading === "starter" ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Redirection...</>) : "Debloquer pour 2,90\u20AC"}
            </button>
          </div>

          {/* Recherche Active — avec promo si active */}
          <div className={`border-2 rounded-xl p-6 relative ${promoActive ? "border-green-300 bg-green-50/30" : "border-blue-200 bg-blue-50/30"}`}>
            <div className={`text-[12px] font-bold uppercase tracking-wider mb-4 ${promoActive ? "text-green-600" : "text-blue-600"}`}>
              {promoActive ? "Offre limitee -15%" : "Meilleure valeur"}
            </div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-[18px] font-bold text-gray-900">Recherche Active</h3>
                <p className="text-gray-500 text-[13px]">Tout illimite pendant 30 jours</p>
              </div>
              <div className="text-right">
                {promoActive ? (
                  <>
                    <div className="text-[16px] font-bold text-gray-400 line-through">8,90&euro;</div>
                    <div className="text-[24px] font-extrabold text-green-600">7,57&euro;</div>
                  </>
                ) : (
                  <div className="text-[24px] font-extrabold text-gray-900">8,90&euro;</div>
                )}
                <div className="text-[12px] text-gray-400">par mois</div>
              </div>
            </div>
            {promoActive && promoFormatted && (
              <p className="text-[12px] text-amber-600 font-semibold mb-2">Expire dans {promoFormatted}</p>
            )}

            <ul className="space-y-2.5 my-5 text-[13.5px] text-gray-600">
              {["Analyses + PDF illimites", "Tous les templates premium", "Sans engagement"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className={`mt-0.5 flex-shrink-0 ${promoActive ? "text-green-500" : "text-blue-500"}`} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy("pro")}
              disabled={loading === "pro"}
              className={`w-full min-h-[48px] text-white rounded-xl py-3 font-semibold transition-all disabled:opacity-50 shadow-md flex items-center justify-center gap-2 ${
                promoActive
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-200"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-200"
              }`}
            >
              {loading === "pro" ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Redirection...</>) : promoActive ? "Passer en illimite a 7,57\u20AC" : "Passer en illimite"}
            </button>
          </div>
        </div>

        <p className="text-center text-[13px] text-gray-400 mt-5">
          Sans engagement &middot; Paiement securise Stripe &middot; Satisfait ou rembourse 7j
        </p>
      </div>
    </div>
  );
}
