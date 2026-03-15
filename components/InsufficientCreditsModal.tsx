"use client";
import { useState } from "react";

interface Props {
  creditsNeeded: number;
  onClose: () => void;
}

const MONTHLY_PRICES = [
  { months: 1, price: 8.90, discount: 0 },
  { months: 2, price: 16.91, discount: 5 },
  { months: 3, price: 24.03, discount: 10 },
  { months: 4, price: 30.49, discount: 14 },
  { months: 5, price: 36.31, discount: 18 },
  { months: 6, price: 41.34, discount: 23 },
];

function formatPrice(n: number): string {
  return n.toFixed(2).replace(".", ",");
}

export default function InsufficientCreditsModal({ creditsNeeded, onClose }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedMonths, setSelectedMonths] = useState(1);

  const monthData = MONTHLY_PRICES[selectedMonths - 1];
  const fullPrice = selectedMonths * 8.90;

  const handleBuy = async (plan: string) => {
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, months: plan === "monthly" ? selectedMonths : undefined }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-8 max-w-[740px] w-full mx-4 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>

        <h2 className="font-display text-[24px] font-bold mb-1 dark:text-gray-100">Crédits insuffisants</h2>
        <p className="text-brand-gray dark:text-gray-400 text-[14px] mb-6">
          Il vous faut {creditsNeeded} crédit{creditsNeeded > 1 ? "s" : ""} pour cette action. Achetez des crédits ou passez en illimité.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Pack Coup de pouce */}
          <div className="border-2 border-green-200 dark:border-green-700 rounded-xl p-6 relative dark:bg-[#1e293b]">
            <div className="text-green-600 text-[12px] font-bold uppercase tracking-wider mb-4">Populaire</div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-[18px] font-bold text-gray-900 dark:text-gray-100">Coup de pouce</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[13px]">Idéal pour postuler à cette offre rêvée</p>
              </div>
              <div className="text-right">
                <div className="text-[24px] font-extrabold text-gray-900 dark:text-gray-100">2,90&euro;</div>
                <div className="text-[12px] text-gray-400 dark:text-gray-500">paiement unique</div>
              </div>
            </div>

            <ul className="space-y-2.5 my-5 text-[13.5px] text-gray-600 dark:text-gray-300">
              {["4 crédits à utiliser quand vous voulez", "Éditeur CV avec corrections IA", "Export PDF propre (sans filigrane)", "Crédits sans expiration"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className="mt-0.5 flex-shrink-0 text-green-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
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

          {/* Recherche Active */}
          <div className="border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 bg-blue-50/30 dark:bg-blue-900/20 relative">
            <div className="text-blue-600 text-[12px] font-bold uppercase tracking-wider mb-4">Meilleure valeur</div>
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="font-display text-[18px] font-bold text-gray-900 dark:text-gray-100">Recherche Active</h3>
                <p className="text-gray-500 dark:text-gray-400 text-[13px]">Scans illimités pendant {selectedMonths * 30} jours</p>
              </div>
              <div className="text-right">
                {monthData.discount > 0 && (
                  <>
                    <div className="text-[13px] text-gray-400 dark:text-gray-500 line-through">{formatPrice(fullPrice)}&euro;</div>
                    <div className="text-[24px] font-extrabold text-gray-900 dark:text-gray-100">{formatPrice(monthData.price)}&euro;</div>
                    <div className="text-[12px] text-green-600 font-semibold">
                      -{monthData.discount}% ({formatPrice(fullPrice - monthData.price)}&euro;)
                    </div>
                  </>
                )}
                {monthData.discount === 0 && (
                  <div className="text-[24px] font-extrabold text-gray-900 dark:text-gray-100">{formatPrice(monthData.price)}&euro;</div>
                )}
                <div className="text-[12px] text-gray-400 dark:text-gray-500">pour {selectedMonths} mois</div>
              </div>
            </div>

            {/* Month selector */}
            <div className="flex items-center justify-center gap-4 my-5">
              <button
                onClick={() => setSelectedMonths(Math.max(1, selectedMonths - 1))}
                disabled={selectedMonths <= 1}
                className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
              <span className="text-[16px] font-bold text-gray-900 dark:text-gray-100 min-w-[80px] text-center">
                {selectedMonths} mois
              </span>
              <button
                onClick={() => setSelectedMonths(Math.min(6, selectedMonths + 1))}
                disabled={selectedMonths >= 6}
                className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              </button>
            </div>

            <ul className="space-y-2.5 mb-5 text-[13.5px] text-gray-600 dark:text-gray-300">
              {["Scans illimités", "Éditeur CV avec corrections IA", "Export PDF propre illimité", "Crédits conservés après le plan"].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <svg className="mt-0.5 flex-shrink-0 text-blue-500" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleBuy("monthly")}
              disabled={loading === "monthly"}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl py-3 font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 shadow-md shadow-blue-200 dark:shadow-blue-900/30"
            >
              {loading === "monthly" ? "Redirection..." : "Passer en illimité"}
            </button>
          </div>
        </div>

        <p className="text-center text-[13px] text-gray-400 dark:text-gray-500 mt-5">
          Sans engagement &middot; Paiement sécurisé Stripe
        </p>
      </div>
    </div>
  );
}
