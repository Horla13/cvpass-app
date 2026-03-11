"use client";

import { useRouter } from "next/navigation";

const MESSAGES: Record<"pdf" | "letter" | "history", string> = {
  pdf: "Exportez votre CV optimisé en PDF avec un pass CVpass.",
  letter: "Générez votre lettre de motivation avec un pass CVpass.",
  history: "Accédez à tout votre historique de candidatures.",
};

interface PremiumModalProps {
  feature: "pdf" | "letter" | "history";
  onClose: () => void;
}

export function PremiumModal({ feature, onClose }: PremiumModalProps) {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h2 className="text-lg font-bold text-brand-black mb-2">Fonctionnalité premium</h2>
        <p className="text-sm text-brand-gray mb-6 leading-relaxed">{MESSAGES[feature]}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/pricing")}
            className="w-full py-3 rounded-xl bg-brand-green text-white font-semibold text-sm hover:bg-green-700 transition-colors"
          >
            Voir les offres
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-gray-200 text-brand-gray font-medium text-sm hover:border-gray-300 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
