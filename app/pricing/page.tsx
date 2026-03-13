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
    subtitle: "Pour découvrir",
    priceMain: "0",
    priceSuffix: "€",
    priceDetail: "",
    features: [
      { text: "2 crédits offerts", included: true, bold: true },
      { text: "Score ATS détaillé", included: true },
      { text: "Suggestions d'amélioration", included: true },
      { text: "Éditeur CV avec corrections IA", included: false },
      { text: "Export PDF sans filigrane", included: false },
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
    color: "gray",
    badge: null,
  },
  {
    id: "pass48h",
    name: "Coup de pouce",
    subtitle: "3-4 candidatures",
    priceMain: "2",
    priceSuffix: ",90€",
    priceDetail: "paiement unique",
    features: [
      { text: "4 crédits à utiliser quand vous voulez", included: true, bold: true },
      { text: "Éditeur CV avec corrections IA", included: true },
      { text: "Export PDF propre (sans filigrane)", included: true },
      { text: "Crédits sans expiration", included: true },
      { text: "Match offre d'emploi inclus", included: true },
    ],
    cta: "Acheter le pack",
    highlighted: true,
    color: "green",
    badge: "Le plus populaire",
  },
  {
    id: "monthly",
    name: "Recherche Active",
    subtitle: "Recherche intensive",
    priceMain: "8",
    priceSuffix: ",90€",
    priceDetail: "le 1er mois, puis -5% chaque mois",
    features: [
      { text: "Scans illimités", included: true, bold: true },
      { text: "Tout du Pack Coup de pouce", included: true },
      { text: "Export PDF illimité", included: true },
      { text: "Lettre de motivation IA", included: true },
      { text: "Historique complet", included: true },
      { text: "Crédits conservés après résiliation", included: true },
    ],
    cta: "Commencer à 8,90€/mois",
    highlighted: false,
    color: "blue",
    badge: "Meilleure valeur",
    loyaltyDiscount: true,
  },
];

const creditCosts = [
  { action: "Analyse ATS générale", credits: 1, icon: "📊" },
  { action: "Match offre d'emploi", credits: 2, icon: "🎯" },
  { action: "Export PDF optimisé", credits: 1, icon: "📄" },
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
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />

      {/* Hero */}
      <section className="py-16 px-8 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-gray-500 text-[16px] max-w-lg mx-auto mb-3">
          Commencez avec 2 crédits gratuits. Achetez uniquement ce dont vous avez besoin.
        </p>
        {credits !== null && (
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-[13px]">
            <span className="text-amber-500">&#9889;</span>
            <span className="font-semibold text-amber-700">
              {unlimited ? "Accès illimité" : `${credits} crédit${credits !== 1 ? "s" : ""} disponible${credits !== 1 ? "s" : ""}`}
            </span>
          </div>
        )}
      </section>

      {/* Credit costs explainer */}
      <section className="max-w-[700px] mx-auto px-8 pb-10">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-[13px] text-gray-400 font-medium uppercase tracking-wider mb-4 text-center">Coût par action</h3>
          <div className="grid grid-cols-3 gap-4">
            {creditCosts.map((item) => (
              <div key={item.action} className="text-center">
                <span className="text-[24px]">{item.icon}</span>
                <p className="text-[13px] text-gray-700 font-medium mt-1">{item.action}</p>
                <p className="text-[18px] font-bold text-amber-600 mt-0.5">
                  {item.credits} crédit{item.credits > 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="max-w-[1000px] mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const borderColor = plan.highlighted
              ? "border-green-300 shadow-[0_4px_20px_rgba(22,163,74,0.1)]"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm";
            const badgeColor = plan.color === "green"
              ? "bg-green-500"
              : plan.color === "blue"
              ? "bg-blue-500"
              : "bg-gray-400";
            const ctaStyle = plan.highlighted
              ? "bg-green-500 text-white hover:bg-green-600"
              : plan.color === "blue"
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white text-gray-800 border border-gray-200 hover:border-gray-400";
            const checkColor = plan.color === "green"
              ? "text-green-500"
              : plan.color === "blue"
              ? "text-blue-500"
              : "text-green-500";

            return (
              <div
                key={plan.id}
                className={cn(
                  "bg-white rounded-2xl border-2 p-7 relative transition-all",
                  borderColor
                )}
              >
                {plan.badge && (
                  <div className={cn(
                    "absolute -top-3 left-1/2 -translate-x-1/2 text-white px-3.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap",
                    badgeColor
                  )}>
                    {plan.badge}
                  </div>
                )}

                <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">{plan.subtitle}</p>
                <h3 className="font-display text-[20px] font-bold text-gray-900 mt-1 mb-1">{plan.name}</h3>

                <div className="flex items-baseline mt-3 mb-1">
                  <span className="font-display text-[40px] font-extrabold text-gray-900 tracking-tighter">{plan.priceMain}</span>
                  <span className="text-[16px] text-gray-500 font-medium">{plan.priceSuffix}</span>
                </div>
                {plan.priceDetail && (
                  <p className="text-[12px] text-gray-400 mb-5">{plan.priceDetail}</p>
                )}
                {!plan.priceDetail && <div className="mb-5" />}

                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <li key={f.text} className={cn(
                      "flex items-start gap-2 text-[13px]",
                      f.included ? "text-gray-600" : "text-gray-300"
                    )}>
                      <svg
                        className={cn("mt-0.5 flex-shrink-0", f.included ? checkColor : "text-gray-300")}
                        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      >
                        {f.included
                          ? <polyline points="20 6 9 17 4 12" />
                          : <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                        }
                      </svg>
                      <span className={f.bold ? "font-semibold text-gray-800" : ""}>{f.text}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick(plan.id)}
                  disabled={loading === plan.id}
                  className={cn(
                    "w-full py-3 rounded-xl text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                    ctaStyle
                  )}
                >
                  {loading === plan.id ? "Redirection..." : plan.cta}
                </button>

                {/* Loyalty discount visual for monthly plan */}
                {"loyaltyDiscount" in plan && plan.loyaltyDiscount && (
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-[11px] text-blue-500 font-semibold uppercase tracking-wider mb-2.5">
                      -5% chaque mois de fidélité
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { month: "Mois 1", price: "8,90", pct: 100 },
                        { month: "Mois 2", price: "8,46", pct: 95 },
                        { month: "Mois 3", price: "8,03", pct: 90 },
                        { month: "Mois 4", price: "7,63", pct: 86 },
                        { month: "Mois 5", price: "7,25", pct: 81 },
                        { month: "Mois 6+", price: "6,88", pct: 77 },
                      ].map((row) => (
                        <div key={row.month} className="flex items-center gap-2">
                          <span className="text-[11px] text-gray-400 w-14 shrink-0">{row.month}</span>
                          <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all"
                              style={{ width: `${row.pct}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-gray-700 w-10 text-right">{row.price}&euro;</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-white border-t border-b border-gray-100 py-20 px-8">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 text-center mb-10">
            Comparaison détaillée
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-display font-bold text-gray-900">Fonctionnalité</th>
                  <th className="text-center py-3 px-4 font-display font-bold text-gray-400">Gratuit</th>
                  <th className="text-center py-3 px-4 font-display font-bold text-green-600">Coup de pouce</th>
                  <th className="text-center py-3 px-4 font-display font-bold text-blue-600">Recherche Active <span className="text-[11px] font-normal text-gray-400">(dès 8,90&euro;)</span></th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Crédits inclus", "2", "4", "Illimité"],
                  ["Analyse ATS", "✓", "✓", "✓"],
                  ["Match offre d'emploi", "✓", "✓", "✓"],
                  ["Score détaillé par catégorie", "✓", "✓", "✓"],
                  ["Éditeur CV avec corrections IA", "✗", "✓", "✓"],
                  ["Export PDF sans filigrane", "✗", "✓", "✓"],
                  ["Expiration des crédits", "Jamais", "Jamais", "—"],
                  ["Lettre de motivation IA", "✗", "✗", "✓"],
                  ["Historique complet", "✗", "✗", "✓"],
                  ["Support prioritaire", "✗", "✗", "✓"],
                ].map(([feature, ...vals], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                    <td className="py-3 px-4 font-medium text-gray-800">{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} className="text-center py-3 px-4">
                        <span className={
                          v === "✓" ? "text-green-500 font-bold" :
                          v === "✗" ? "text-gray-300 font-bold" :
                          "text-gray-600 text-[13px]"
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
      <section className="py-10 px-8">
        <div className="max-w-[700px] mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: "🔒", text: "Paiement sécurisé Stripe" },
            { icon: "🇪🇺", text: "Conforme RGPD" },
            { icon: "🗑️", text: "CV jamais stocké" },
            { icon: "💳", text: "Sans engagement" },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-2 text-sm text-gray-500">
              <span className="text-lg">{s.icon}</span>
              <span className="font-medium">{s.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-gray-100 py-20 px-8">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 text-center mb-10">
            Questions fréquentes
          </h2>
          <FAQAccordion items={[
            { question: "Comment fonctionnent les crédits ?", answer: "Chaque action consomme des crédits : 1 pour une analyse ATS, 2 pour un match offre d'emploi, 1 pour un export PDF. Les crédits achetés n'expirent jamais." },
            { question: "Que comprend le Pack Coup de pouce ?", answer: "Le Pack Coup de pouce vous donne 4 crédits utilisables quand vous voulez. Idéal pour 3-4 candidatures urgentes. Pas de renouvellement automatique, les crédits sont à vous." },
            { question: "Puis-je me faire rembourser ?", answer: "Oui, tous nos plans payants sont couverts par une garantie satisfait ou remboursé de 7 jours. Contactez-nous simplement par email." },
            { question: "Mon CV est-il stocké ?", answer: "Non. Votre CV est traité en mémoire vive et n'est jamais stocké en base de données. Il disparaît automatiquement à la fermeture de votre session. Conforme RGPD." },
            { question: "Comment résilier Recherche Active ?", answer: "Vous pouvez résilier à tout moment depuis votre espace personnel. La résiliation est immédiate et sans condition. Vous conservez vos crédits et l'accès jusqu'à la fin de la période payée." },
            { question: "Quels moyens de paiement acceptez-vous ?", answer: "Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via notre partenaire Stripe. Le paiement est 100% sécurisé." },
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
