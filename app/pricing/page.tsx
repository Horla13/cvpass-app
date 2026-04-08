"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { isStripeUrl } from "@/lib/utils";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTABanner } from "@/components/CTABanner";

export default function PricingPage() {
  const router = useRouter();
  const posthog = usePostHog();
  const [loading, setLoading] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [unlimited, setUnlimited] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      if (!res.ok || !data.url) {
        setErrorMsg(data.error ?? "Impossible d'ouvrir le paiement. Réessayez.");
        return;
      }
      if (!isStripeUrl(data.url)) {
        setErrorMsg("URL de paiement invalide. Réessayez.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setErrorMsg("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(null);
    }
  }

  // SYNC with FAQAccordion items below (FAQ section)
  const pricingFaqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "Comment fonctionnent les crédits ?", acceptedAnswer: { "@type": "Answer", text: "Chaque action consomme des crédits : 1 pour une analyse ATS générale, 2 pour un match offre d'emploi. Les crédits achetés n'expirent jamais." } },
      { "@type": "Question", name: "Que comprend le Pack Coup de pouce ?", acceptedAnswer: { "@type": "Answer", text: "Le Pack Coup de pouce vous donne 4 crédits supplémentaires qui s'ajoutent à votre solde. Pas de renouvellement automatique, les crédits sont à vous et n'expirent jamais. Vous pouvez racheter le pack autant de fois que vous voulez." } },
      { "@type": "Question", name: "Que comprend Recherche Active ?", acceptedAnswer: { "@type": "Answer", text: "Le plan Recherche Active vous donne un accès illimité à toutes les fonctionnalités pendant 30 jours. C'est un abonnement mensuel résiliable à tout moment, sans engagement." } },
      { "@type": "Question", name: "Puis-je me faire rembourser ?", acceptedAnswer: { "@type": "Answer", text: "Oui, tous nos plans payants sont couverts par une garantie satisfait ou remboursé de 7 jours. Contactez-nous simplement par email." } },
      { "@type": "Question", name: "Mon CV est-il stocké ?", acceptedAnswer: { "@type": "Answer", text: "Non. Votre CV est traité en mémoire vive et n'est jamais stocké en base de données. Conforme RGPD." } },
      { "@type": "Question", name: "Comment résilier Recherche Active ?", acceptedAnswer: { "@type": "Answer", text: "Vous pouvez résilier à tout moment depuis votre espace personnel. Résiliation immédiate, sans condition. Vous conservez vos crédits et l'accès jusqu'à la fin de la période payée." } },
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqJsonLd) }}
      />
      <AppHeader />

      {errorMsg && (
        <div className="max-w-xl mx-auto mt-4 mb-0 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-[14px]">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-red-400 hover:text-red-600 flex-shrink-0" aria-label="Fermer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      )}

      {/* Hero */}
      <section className="pt-20 pb-6 px-4 md:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2 text-[13px] text-green-700 font-medium mb-6">
          <span>✨</span> Tarification simple et transparente
        </div>
        <h1 className="font-display text-[32px] md:text-[44px] font-extrabold tracking-[-1.5px] text-gray-900 mb-4 leading-tight">
          Optimisez votre CV pour les ATS<br className="hidden md:block" /> — Choisissez votre formule
        </h1>
        <p className="text-brand-green font-semibold text-[15px] mb-3">
          1 crédit = Analyse générale &nbsp;|&nbsp; 2 crédits = Match offre d&apos;emploi &nbsp;|&nbsp; 1 crédit = Téléchargement PDF &nbsp;|&nbsp; 1 crédit = Lettre de motivation
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
          {/* Free */}
          <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-gray-300 hover:shadow-sm transition-all">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[20px]">⚡</span>
              <h3 className="font-display text-[20px] font-bold text-gray-900">Gratuit</h3>
            </div>
            <p className="text-[13px] text-gray-500 mb-5">Pour découvrir, sans engagement</p>
            <div className="mb-1">
              <span className="font-display text-[38px] font-extrabold text-gray-900 tracking-tighter">Gratuit</span>
            </div>
            <div className="mb-6" />
            <ul className="space-y-3 mb-7">
              {["1 analyse offerte à l'inscription", "Toutes les fonctionnalités accessibles", "Export PDF (1 crédit)", "Crédits sans expiration"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-gray-600">
                  <svg className="mt-0.5 flex-shrink-0 text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button disabled className="w-full py-3.5 min-h-[48px] rounded-xl text-[14px] font-semibold bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
              Plan actuel
            </button>
          </div>

          {/* Coup de pouce */}
          <div className="relative bg-white rounded-2xl border-2 border-green-300 shadow-[0_4px_24px_rgba(22,163,74,0.12)] p-8 transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap">
              Le plus populaire
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[20px]">🚀</span>
              <h3 className="font-display text-[20px] font-bold text-gray-900">Coup de pouce</h3>
            </div>
            <p className="text-[13px] text-gray-500 mb-5">Idéal pour postuler à cette offre rêvée</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-[38px] font-extrabold text-gray-900 tracking-tighter">2,90&euro;</span>
            </div>
            <p className="text-[13px] text-gray-400 mb-6">paiement unique</p>
            <ul className="space-y-3 mb-7">
              {["4 crédits d'analyse", "+ votre crédit gratuit = 5 au total", "Sans expiration", "Rachetable plusieurs fois"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-gray-600">
                  <svg className="mt-0.5 flex-shrink-0 text-green-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick("starter")}
              disabled={loading === "starter"}
              className="w-full py-3.5 min-h-[48px] rounded-xl text-[14px] font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md shadow-green-200 transition-all disabled:opacity-50"
            >
              {loading === "starter" ? "Redirection..." : "Acheter le pack"}
            </button>
          </div>

          {/* Recherche Active — with month selector */}
          <div className="relative bg-white rounded-2xl border-2 border-blue-200 shadow-sm p-8 transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap">
              Meilleure valeur
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[20px]">👑</span>
              <h3 className="font-display text-[20px] font-bold text-gray-900">Recherche Active</h3>
            </div>
            <p className="text-[13px] text-gray-500 mb-5">Analyses illimitées pendant 30 jours</p>

            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display text-[38px] font-extrabold text-gray-900 tracking-tighter">8,90&euro;</span>
            </div>
            <p className="text-[13px] text-gray-400 mb-6">par mois</p>

            <ul className="space-y-3 mb-7">
              {["Analyses illimitées pendant 30 jours", "Renouvellement automatique", "Sans engagement", "Résiliable à tout moment"].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-gray-600">
                  <svg className="mt-0.5 flex-shrink-0 text-blue-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handlePlanClick("pro")}
              disabled={loading === "pro"}
              className="w-full py-3.5 min-h-[48px] rounded-xl text-[14px] font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md shadow-blue-200 transition-all disabled:opacity-50"
            >
              {loading === "pro" ? "Redirection..." : "Passer en illimité"}
            </button>
          </div>
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
                  ["Crédits", "2 (à vie)", "+4 par achat", "Illimité"],
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
                  ["Édition", "Éditeur IA", "Éditeur IA", "Éditeur IA"],
                  ["Export PDF", "1 crédit", "1 crédit", "Illimité"],
                  ["Lettre de motivation IA", "1 crédit", "1 crédit", "Illimité"],
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
            Résiliable en un clic
          </span>
          <span className="inline-flex items-center gap-1.5 text-[13px] text-green-600 font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Crédits Starter sans expiration
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
            { question: "Que comprend le Pack Coup de pouce ?", answer: "Le Pack Coup de pouce vous donne 4 crédits supplémentaires qui s'ajoutent à votre solde. Pas de renouvellement automatique, les crédits sont à vous et n'expirent jamais. Vous pouvez racheter le pack autant de fois que vous voulez." },
            { question: "Que comprend Recherche Active ?", answer: "Le plan Recherche Active vous donne un accès illimité à toutes les fonctionnalités pendant 30 jours. C'est un abonnement mensuel résiliable à tout moment, sans engagement." },
            { question: "Puis-je me faire rembourser ?", answer: "Oui, tous nos plans payants sont couverts par une garantie satisfait ou remboursé de 7 jours. Contactez-nous simplement par email." },
            { question: "Mon CV est-il stocké ?", answer: "Non. Votre CV est traité en mémoire vive et n'est jamais stocké en base de données. Conforme RGPD." },
            { question: "Comment résilier Recherche Active ?", answer: "Vous pouvez résilier à tout moment depuis votre espace personnel. Résiliation immédiate, sans condition. Vous conservez vos crédits et l'accès jusqu'à la fin de la période payée." },
          ]} />
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />

      {/* Footer is in the global layout */}
    </div>
  );
}
