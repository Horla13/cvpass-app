"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { AppHeader } from "@/components/AppHeader";

const plans = [
  {
    id: "free",
    tier: "Découverte",
    price: "0",
    priceSuffix: " €",
    description: "Analysez votre premier CV et découvrez votre score ATS — sans engagement, sans carte de crédit.",
    features: [
      { text: "1 analyse de CV complète", included: true },
      { text: "Score ATS détaillé", included: true },
      { text: "3 problèmes identifiés", included: true },
      { text: "Réécriture IA", included: false },
      { text: "Export PDF", included: false },
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    id: "pass48h",
    tier: "Candidature Express",
    price: "2",
    priceSuffix: ",90 €",
    description: "Décrochez cet entretien — analyses illimitées pendant 48h, réécriture IA complète, export PDF.",
    features: [
      { text: "Analyses illimitées pendant 48h", included: true },
      { text: "Réécriture IA des bullet points", included: true },
      { text: "Export PDF propre", included: true },
      { text: "Génération de lettres de motivation", included: true },
      { text: "Sans abonnement caché", included: true },
      { text: "Historique des CVs", included: false },
    ],
    cta: "Choisir ce Pass",
    highlighted: true,
  },
  {
    id: "monthly",
    tier: "Recherche Intensive",
    price: "14",
    priceSuffix: ",90 €/mois",
    description: "Postulez plus, décrochez plus — tout illimité, historique complet, lettres de motivation incluses.",
    features: [
      { text: "Tout de Candidature Express", included: true },
      { text: "Historique illimité des CVs", included: true },
      { text: "Lettres de motivation illimitées", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Résiliable à tout moment", included: true },
    ],
    cta: "Choisir ce Plan",
    highlighted: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const [loading, setLoading] = useState<string | null>(null);

  async function handlePlanClick(planId: string) {
    if (planId === "free") {
      router.push("/signup");
      return;
    }

    posthog?.capture("stripe_checkout_started", { plan: planId });
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });

      if (res.status === 401) {
        router.push("/login?redirect=/pricing");
        return;
      }

      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-brand-black mb-4">Choisissez votre plan</h1>
          <p className="text-brand-gray text-lg">
            Pas d&apos;abonnement forcé — payez uniquement quand vous en avez besoin.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl p-8 flex flex-col relative ${
                plan.highlighted
                  ? "ring-2 ring-brand-green shadow-lg"
                  : "border border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white bg-brand-green px-4 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
                  Le plus populaire
                </span>
              )}
              <div className="text-xs font-bold tracking-widest uppercase text-brand-gray mb-3">
                {plan.tier}
              </div>
              <div className="flex items-baseline mb-1">
                <span className="text-5xl font-black text-brand-black leading-none">
                  {plan.price}
                </span>
                <span className="text-brand-gray ml-0.5">{plan.priceSuffix}</span>
              </div>
              <p className="text-sm text-brand-gray leading-relaxed mt-2 mb-6 pb-6 border-b border-gray-100">
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f.text} className={`flex items-start gap-2 text-sm ${f.included ? "text-brand-gray" : "text-gray-300"}`}>
                    <span className={`font-bold mt-0.5 flex-shrink-0 ${f.included ? "text-brand-green" : "text-gray-300"}`}>
                      {f.included ? "✓" : "✕"}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanClick(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlighted
                    ? "bg-brand-green text-white hover:bg-green-700"
                    : "border-2 border-gray-200 text-brand-gray hover:border-brand-green hover:text-brand-green"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === plan.id ? "Chargement…" : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-brand-gray mt-10">
          Paiement sécurisé par Stripe · Résiliation à tout moment · TVA incluse
        </p>
      </main>
    </div>
  );
}
