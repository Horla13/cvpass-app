"use client";

import { useState } from "react";
import Link from "next/link";

const SESSION_KEY = "promoModalShown";

export function PromoModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText("PREMIER20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="relative max-w-sm w-full mx-4 rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          &times;
        </button>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-1">
            -20% sur votre premier mois
          </h2>
          <p className="text-[13px] text-gray-500 mb-5">
            Offre exclusive pour les nouveaux membres. Accès illimité aux analyses, exports PDF et lettres de motivation.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-5">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Code promo</p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-2xl font-bold text-brand-green tracking-widest">PREMIER20</code>
              <button
                onClick={copyCode}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {copied ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                )}
              </button>
            </div>
          </div>

          <Link
            href="/pricing"
            onClick={onClose}
            className="block w-full py-3 bg-brand-green text-white text-[14px] font-bold rounded-xl hover:bg-green-600 transition-colors text-center"
          >
            Voir les offres &rarr;
          </Link>

          <p className="text-[11px] text-gray-400 mt-3">
            Appliquez le code au moment du paiement
          </p>
        </div>
      </div>
    </div>
  );
}

export function usePromoModal() {
  const [show, setShow] = useState(false);

  const trigger = () => {
    if (typeof window !== "undefined" && !sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setShow(true);
      return true;
    }
    return false;
  };

  return { show, trigger, close: () => setShow(false) };
}
