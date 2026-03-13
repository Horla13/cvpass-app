"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTABanner } from "@/components/CTABanner";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "free",
    name: "Gratuit",
    subtitle: "Pour découvrir, sans engagement",
    priceLabel: "Gratuit",
    priceMain: null,
    priceDetail: "",
    features: [
      "2 analyses génériques (à vie)",
      "Vérification compatibilité ATS",
      "Suggestions en lecture seule",
      "Export PDF avec filigrane",
    ],
    cta: "Plan actuel",
    ctaDisabled: true,
    highlighted: false,
    badge: null,
    icon: "⚡",
  },
  {
    id: "pass48h",
    name: "Coup de pouce",
    subtitle: "Idéal pour postuler à cette offre rêvée",
    priceLabel: null,
    priceMain: "2,90€",
    priceDetail: "paiement unique",
    features: [
      "4 crédits",
      "Éditeur CV avec corrections IA",
      "Export PDF propre (sans filigrane)",
      "Crédits sans expiration",
    ],
    cta: "Acheter le pack",
    ctaDisabled: false,
    highlighted: true,
    badge: "Le plus populaire",
    icon: "🚀",
  },
  {
    id: "monthly",
    name: "Recherche Active",
    subtitle: "Scans illimités pendant 30 jours",
    priceLabel: null,
    priceMain: "8,90€",
    priceDetail: "par mois",
    features: [
      "Scans illimités",
      "Éditeur CV avec corrections IA",
      "Export PDF propre (sans filigrane)",
      "Crédits conservés après résiliation",
    ],
    cta: "Commencer",
    ctaDisabled: false,
    highlighted: false,
    badge: "Meilleure valeur",
    icon: "👑",
    loyaltyDiscount: true,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const [loading, setLoading] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [unlimited, setUnlimited] = useState(false);

  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => {
        setCredits(d.credits ?? null);
        setUnlimited(d.unlimited ?? false);
      })
      .catch(() => {});
  }, []);

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

      if (res.status === 401 || res.status === 403) {
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
    <div className="min-h-screen bg-white">
      <AppHeader />

      {/* Hero */}
      <section className="pt-20 pb-6 px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2 text-[13px] text-green-700 font-medium mb-6">
          <span>✨</span> Tarification simple et transparente
        </div>
        <h1 className="font-display text-[32px] md:text-[44px] font-extrabold tracking-[-1.5px] text-gray-900 mb-4 leading-tight">
          Investissez dans votre carrière,<br className="hidden md:block" /> pas dans la complexité
        </h1>
        <p className="text-brand-green font-semibold text-[15px] mb-3">
          1 crédit = Analyse générale &nbsp;|&nbsp; 2 crédits = Match offre d&apos;emploi
        </p>
        <p className="text-gray-500 text-[15px] max-w-xl mx-auto">
          Pas de frais cachés. Pas de surprises. Choisissez le plan qui correspond à votre rythme de recherche et payez uniquement pour ce dont vous avez besoin.
        </p>
      </section>

      {/* Credits badge */}
      {credits !== null && (
        <div className="text-center pb-10">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-[13px]">
            <span className="text-amber-500">&#9889;</span>
            <span className="font-semibold text-amber-700">
              Votre solde : {unlimited ? "Accès illimité" : `${credits} crédit${credits !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
      )}

      {/* Pricing cards */}
      <section className="max-w-[1060px] mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative bg-white rounded-2xl border-2 p-8 transition-all",
                plan.highlighted
                  ? "border-green-300 shadow-[0_4px_24px_rgba(22,163,74,0.12)]"
                  : plan.badge === "Meilleure valeur"
                  ? "border-blue-200 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
              )}
            >
              {plan.badge && (
                <div className={cn(
                  "absolute -top-3.5 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap",
                  plan.highlighted ? "bg-green-500" : "bg-blue-500"
                )}>
                  {plan.badge}
                </div>
              )}

              <div className="flex items-center gap-2 mb-1">
                <span className="text-[20px]">{plan.icon}</span>
                <h3 className="font-display text-[20px] font-bold text-gray-900">{plan.name}</h3>
              </div>
              <p className="text-[13px] text-gray-500 mb-5">{plan.subtitle}</p>

              {/* Price */}
              {plan.priceLabel ? (
                <div className="mb-1">
                  <span className="font-display text-[38px] font-extrabold text-gray-900 tracking-tighter">{plan.priceLabel}</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-display text-[38px] font-extrabold text-gray-900 tracking-tighter">{plan.priceMain}</span>
                </div>
              )}
              {plan.priceDetail && (
                <p className="text-[13px] text-gray-400 mb-6">{plan.priceDetail}</p>
              )}
              {!plan.priceDetail && <div className="mb-6" />}

              {/* Features */}
              <ul className="space-y-3 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-gray-600">
                    <svg className={cn("mt-0.5 flex-shrink-0", plan.highlighted ? "text-green-500" : plan.id === "monthly" ? "text-blue-500" : "text-green-500")} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handlePlanClick(plan.id)}
                disabled={plan.ctaDisabled || loading === plan.id}
                className={cn(
                  "w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all disabled:cursor-not-allowed",
                  plan.ctaDisabled
                    ? "bg-gray-100 text-gray-400 border border-gray-200"
                    : plan.highlighted
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md shadow-green-200"
                    : plan.id === "monthly"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-200"
                    : "bg-white text-gray-800 border border-gray-200 hover:border-gray-400"
                )}
              >
                {loading === plan.id ? "Redirection..." : plan.cta}
              </button>

              {/* Loyalty discount visual */}
              {"loyaltyDiscount" in plan && plan.loyaltyDiscount && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-[11px] text-blue-500 font-semibold uppercase tracking-wider mb-2.5">
                    -5% chaque mois de fidélité
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { month: "Mois 1", price: "8,90" },
                      { month: "Mois 2", price: "8,46" },
                      { month: "Mois 3", price: "8,03" },
                      { month: "Mois 6+", price: "6,88" },
                    ].map((row) => (
                      <div key={row.month} className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">{row.month}</span>
                        <span className="font-semibold text-gray-700">{row.price}&euro;</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-[#fafafa] border-t border-b border-gray-100 py-20 px-8">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-display text-[28px] md:text-[32px] font-extrabold tracking-tight text-gray-900 text-center mb-12">
            Comparer toutes les fonctionnalités
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl border border-gray-200 overflow-hidden">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-5 font-display font-bold text-gray-900">Fonctionnalité</th>
                  <th className="text-center py-4 px-5 font-display font-bold text-gray-500">Gratuit</th>
                  <th className="text-center py-4 px-5 font-display font-bold text-green-600">Coup de pouce</th>
                  <th className="text-center py-4 px-5 font-display font-bold text-blue-600">Recherche Active</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Prix", "0€", "2,90€", "8,90€/mois"],
                  ["Idéal pour", "Découvrir", "Postuler à une offre", "Recherche intensive"],
                  ["Scans", "2 (à vie)", "4 crédits", "Illimité"],
                ].map(([feature, ...vals], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="py-3.5 px-5 font-medium text-gray-800">{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} className="text-center py-3.5 px-5 text-[13px] text-gray-600 font-medium">{v}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="py-2 px-5 text-center text-[12px] text-gray-400 bg-gray-50 border-y border-gray-100">
                    Analyse générale : 1 crédit &middot; Match offre d&apos;emploi : 2 crédits
                  </td>
                </tr>
                {[
                  ["Édition", "Suggestions seules", "Éditeur IA", "Éditeur IA"],
                  ["Export PDF", "Avec filigrane", "PDF propre", "PDF illimités"],
                  ["Lettre de motivation IA", "—", "—", "✓"],
                  ["Validité", "À vie", "Sans expiration", "30 jours/mois"],
                ].map(([feature, ...vals], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="py-3.5 px-5 font-medium text-gray-800">{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} className="text-center py-3.5 px-5">
                        <span className={
                          v === "✓" ? "text-green-500 font-bold" :
                          v === "—" ? "text-gray-300" :
                          "text-[13px] text-gray-600 font-medium"
                        }>{v}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-8 px-8 text-center">
        <p className="text-[13px] text-gray-400 mb-4">
          Paiement sécurisé par Stripe · Résiliez à tout moment · Sans engagement
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <span className="inline-flex items-center gap-1.5 text-[13px] text-green-600 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Pas de renouvellement surprise
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-green-600 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Crédits sans expiration
          </span>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#fafafa] border-t border-gray-100 py-20 px-8">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 text-center mb-10">
            Questions fréquentes
          </h2>
          <FAQAccordion items={[
            { question: "Comment fonctionnent les crédits ?", answer: "Chaque action consomme des crédits : 1 pour une analyse ATS générale, 2 pour un match offre d'emploi. Les crédits achetés n'expirent jamais." },
            { question: "Que comprend le Pack Coup de pouce ?", answer: "Le Pack Coup de pouce vous donne 4 crédits utilisables quand vous voulez. Idéal pour 3-4 candidatures urgentes. Pas de renouvellement automatique, les crédits sont à vous." },
            { question: "Comment fonctionne la réduction fidélité ?", answer: "Avec le plan Recherche Active, vous bénéficiez de -5% chaque mois. Mois 1 : 8,90€, Mois 2 : 8,46€... jusqu'à 6,88€ au mois 6+. La réduction est appliquée automatiquement." },
            { question: "Puis-je me faire rembourser ?", answer: "Oui, tous nos plans payants sont couverts par une garantie satisfait ou remboursé de 7 jours. Contactez-nous simplement par email." },
            { question: "Mon CV est-il stocké ?", answer: "Non. Votre CV est traité en mémoire vive et n'est jamais stocké en base de données. Conforme RGPD." },
            { question: "Comment résilier Recherche Active ?", answer: "Vous pouvez résilier à tout moment depuis votre espace personnel. Résiliation immédiate, sans condition. Vous conservez vos crédits et l'accès jusqu'à la fin de la période payée." },
          ]} />
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-8">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-display text-[21px] font-extrabold tracking-[-0.8px] mb-2">
              <span className="text-gray-900">CV</span>
              <span className="text-green-500">pass</span>
            </div>
            <p className="text-[13px] text-gray-400">&copy; 2026 VertexLab SASU. Tous droits réservés.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/blog" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">Blog</Link>
            <Link href="/mentions-legales" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">Mentions légales</Link>
            <Link href="/mentions-legales" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">Confidentialité</Link>
            <a href="mailto:contact@cvpass.fr" className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
