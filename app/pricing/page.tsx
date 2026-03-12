"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { PricingCard } from "@/components/PricingCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CTABanner } from "@/components/CTABanner";

const plans = [
  {
    id: "free",
    name: "Gratuit",
    description: "Pour voir ce qui bloque votre CV et comprendre pourquoi vous n'avez pas de réponse.",
    priceMain: "0",
    priceSuffix: "€",
    features: [
      { text: "1 analyse complète", included: true },
      { text: "Score détaillé", included: true },
      { text: "3 problèmes identifiés", included: true },
      { text: "Éditeur 1-clic", included: false },
      { text: "Réécriture IA", included: false },
      { text: "Export PDF", included: false },
    ],
    cta: "Commencer gratuitement",
    highlighted: false,
  },
  {
    id: "pass48h",
    name: "Pass 48h",
    description: "Pour optimiser 3 ou 4 candidatures en urgence. Sans abonnement, sans renouvellement caché.",
    priceMain: "2",
    priceSuffix: ",90€",
    features: [
      { text: "Scans illimités 48h", included: true },
      { text: "Éditeur 1-clic complet", included: true, bold: true },
      { text: "Réécriture IA bullet points", included: true, bold: true },
      { text: "Match offres illimité", included: true },
      { text: "Export PDF sans watermark", included: true },
      { text: "Lettre de motivation IA", included: true },
      { text: "Historique des CVs", included: true },
    ],
    cta: "Choisir ce Pass",
    highlighted: true,
    guarantee: "Satisfait ou remboursé 7 jours",
  },
  {
    id: "monthly",
    name: "Recherche Active",
    description: "Pour une recherche sur plusieurs semaines. Résiliable à tout moment, sans condition.",
    priceMain: "14",
    priceSuffix: ",90€/mois",
    features: [
      { text: "Tout du Pass 48h", included: true },
      { text: "Historique illimité", included: true },
      { text: "Génération lettres motivation", included: true },
      { text: "Suivi de candidatures", included: true },
      { text: "Support prioritaire", included: true },
      { text: "Sans engagement", included: true },
    ],
    cta: "Choisir ce Plan",
    highlighted: false,
    guarantee: "Satisfait ou remboursé 7 jours",
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
    <div className="min-h-screen bg-white">
      <AppHeader />

      {/* Hero */}
      <section className="py-20 px-8 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-black mb-4">
          Choisissez votre plan
        </h1>
        <p className="text-brand-gray text-lg max-w-md mx-auto">
          Commencez gratuitement. Pas de carte bancaire requise.
        </p>
      </section>

      {/* Pricing cards */}
      <section className="max-w-[960px] mx-auto px-8 pb-20">
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              name={plan.name}
              description={plan.description}
              priceMain={plan.priceMain}
              priceSuffix={plan.priceSuffix}
              features={plan.features}
              cta={plan.cta}
              highlighted={plan.highlighted}
              guarantee={plan.guarantee}
              onCtaClick={() => handlePlanClick(plan.id)}
              loading={loading === plan.id}
            />
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-[#fafafa] border-t border-b border-gray-100 py-24 px-8">
        <div className="max-w-[960px] mx-auto">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-black text-center mb-12">
            Comparaison détaillée
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-display font-bold text-brand-black">Fonctionnalité</th>
                  <th className="text-center py-3 px-4 font-display font-bold text-brand-gray">Gratuit</th>
                  <th className="text-center py-3 px-4 font-display font-bold text-brand-green">Pass 48h</th>
                  <th className="text-center py-3 px-4 font-display font-bold text-brand-gray">Recherche Active</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Score détaillé", "✓", "✓", "✓"],
                  ["1 analyse complète", "✓", "—", "—"],
                  ["3 problèmes identifiés", "✓", "—", "—"],
                  ["Scans illimités", "✗", "48h", "✓"],
                  ["Éditeur 1-clic complet", "✗", "✓", "✓"],
                  ["Réécriture IA bullet points", "✗", "✓", "✓"],
                  ["Match offres illimité", "✗", "✓", "✓"],
                  ["Export PDF sans watermark", "✗", "✓", "✓"],
                  ["Lettre de motivation IA", "✗", "1 par analyse", "✓"],
                  ["Historique des CVs", "✗", "✓", "illimité"],
                  ["Génération lettres (multi-offres)", "✗", "✗", "✓"],
                  ["Suivi de candidatures", "✗", "✗", "✓"],
                  ["Support prioritaire", "✗", "✗", "✓"],
                ].map(([feature, ...vals], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa]"}>
                    <td className="py-3 px-4 font-medium text-brand-black">{feature}</td>
                    {vals.map((v, j) => (
                      <td key={j} className="text-center py-3 px-4">
                        <span className={
                          v === "✓" ? "text-brand-green font-bold" :
                          v === "✗" ? "text-gray-300 font-bold" :
                          "text-brand-gray text-xs"
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
      <section className="py-12 px-8">
        <div className="max-w-[700px] mx-auto flex flex-wrap items-center justify-center gap-8">
          {[
            { icon: "🔒", text: "Paiement sécurisé Stripe" },
            { icon: "🇪🇺", text: "Conforme RGPD" },
            { icon: "🗑️", text: "Données jamais stockées" },
          ].map((s) => (
            <div key={s.text} className="flex items-center gap-2 text-sm text-brand-gray">
              <span className="text-lg">{s.icon}</span>
              <span className="font-medium">{s.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#fafafa] border-t border-gray-100 py-24 px-8">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-brand-black text-center mb-12">
            Questions fréquentes
          </h2>
          <FAQAccordion items={[
            { question: "Comment fonctionne le Pass 48h ?", answer: "Le Pass 48h vous donne un accès complet pendant 48 heures à partir de l'achat. Scans illimités, éditeur 1-clic, réécriture IA, export PDF. Pas de renouvellement automatique." },
            { question: "Puis-je me faire rembourser ?", answer: "Oui, tous nos plans payants sont couverts par une garantie satisfait ou remboursé de 7 jours. Contactez-nous simplement par email." },
            { question: "Mon CV est-il stocké ?", answer: "Non. Votre CV est traité en mémoire vive et n'est jamais stocké en base de données. Il disparaît automatiquement à la fermeture de votre session. Conforme RGPD." },
            { question: "Comment résilier Recherche Active ?", answer: "Vous pouvez résilier à tout moment depuis votre espace personnel. La résiliation est immédiate et sans condition. Vous conservez l'accès jusqu'à la fin de la période payée." },
            { question: "Quels moyens de paiement acceptez-vous ?", answer: "Nous acceptons toutes les cartes bancaires (Visa, Mastercard, American Express) via notre partenaire Stripe. Le paiement est 100% sécurisé." },
          ]} />
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />

      {/* Footer */}
      <footer className="bg-[#fafafa] border-t border-gray-100 py-12 px-8">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-display text-[21px] font-extrabold tracking-[-0.8px] mb-2">
              <span className="text-brand-black">CV</span>
              <span className="text-brand-green">pass</span>
            </div>
            <p className="text-[13px] text-gray-400">© 2026 VertexLab SASU. Tous droits réservés.</p>
          </div>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="text-[13px] text-brand-gray hover:text-brand-black transition-colors">Mentions légales</Link>
            <a href="#" className="text-[13px] text-brand-gray hover:text-brand-black transition-colors">Politique de confidentialité</a>
            <a href="mailto:contact@cvpass.fr" className="text-[13px] text-brand-gray hover:text-brand-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
