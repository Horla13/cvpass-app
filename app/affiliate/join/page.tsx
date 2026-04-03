"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";

const FAQ_TABS = [
  {
    label: "Paiements",
    items: [
      { q: "Quel est le paiement minimum ?", a: "Le seuil minimum est de 20\u20AC. Vous devez avoir gagn\u00E9 au moins 20\u20AC de commissions avant qu\u2019un paiement ne soit trait\u00E9." },
      { q: "Quand sont les paiements ?", a: "Les paiements sont trait\u00E9s le 1er lundi de chaque mois. Les commissions doivent avoir \u00E9t\u00E9 gagn\u00E9es au moins 30 jours avant (p\u00E9riode de remboursement)." },
      { q: "Comment recevoir mon paiement ?", a: "Par virement bancaire ou PayPal. Vous configurez votre m\u00E9thode de paiement depuis votre dashboard affili\u00E9." },
    ],
  },
  {
    label: "Conditions",
    items: [
      { q: "Quelle est la dur\u00E9e du cookie ?", a: "Le cookie de tracking dure 30 jours. Si un visiteur clique sur votre lien et ach\u00E8te dans les 30 jours, la commission vous est attribu\u00E9e." },
      { q: "Sur quels achats je gagne ?", a: "Vous gagnez 50% de commission sur le premier achat de chaque utilisateur parrainé (Pack Coup de pouce ou abonnement Pro)." },
      { q: "Puis-je parrainer quelqu'un que je connais ?", a: "Oui, mais vous ne pouvez pas vous parrainer vous-m\u00EAme. Les auto-parrainages sont automatiquement rejet\u00E9s." },
    ],
  },
  {
    label: "Autres",
    items: [
      { q: "Ai-je besoin d'un site web ?", a: "Non. Vous pouvez partager votre lien sur les r\u00E9seaux sociaux, par email, dans votre bio, dans des groupes ou dans du contenu en ligne." },
      { q: "Combien d'affili\u00E9s acceptez-vous ?", a: "Le programme est ouvert \u00E0 tous. Pas de limite de places, pas de condition de nombre de followers." },
      { q: "Puis-je voir mes stats en temps r\u00E9el ?", a: "Oui. Votre dashboard affili\u00E9 affiche vos clics, conversions, commissions et paiements en temps r\u00E9el." },
    ],
  },
];

export default function AffiliateJoinPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [visitors, setVisitors] = useState(500);
  const [faqTab, setFaqTab] = useState(0);

  const estimatedEarnings = Math.round(visitors * 0.05 * 0.5 * 5.9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      router.push("/login?redirect_url=/affiliate/join");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/affiliate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erreur lors de la cr\u00E9ation");
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/affiliate"), 2000);
    } catch {
      setError("Erreur r\u00E9seau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      {/* ── HERO ── */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-green-500/20 text-green-400 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-6 border border-green-500/30">
            Programme Affili\u00E9
          </span>
          <h1 className="font-display text-[36px] md:text-[52px] font-extrabold tracking-[-2px] leading-[1.08] mb-5">
            Gagnez <span className="text-green-400">50%</span> de commission<br className="hidden md:block" /> en recommandant CVpass
          </h1>
          <p className="text-gray-400 text-[17px] max-w-xl mx-auto mb-10 leading-relaxed">
            Rejoignez notre programme d&apos;affiliation et gagnez 50% de commission sur chaque premier achat. Fen\u00EAtre d&apos;attribution de 30 jours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a href="#signup" className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 min-h-[52px] rounded-xl text-[16px] font-bold hover:bg-green-600 transition-colors">
              S&apos;inscrire maintenant
              <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <Link href="/affiliate" className="text-[14px] text-gray-400 hover:text-white transition-colors underline underline-offset-4">
              D\u00E9j\u00E0 affili\u00E9 ? Voir le dashboard
            </Link>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              { value: "50%", label: "Commission" },
              { value: "~5%", label: "Taux de conversion" },
              { value: "~3\u20AC", label: "Payout moyen" },
              { value: "30j", label: "Fen\u00EAtre attribution" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-display font-extrabold text-[28px] text-green-400">{s.value}</div>
                <div className="text-[12px] text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 STEPS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] text-center mb-4">
            Comment \u00E7a marche ?
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-lg mx-auto">
            Trois \u00E9tapes simples pour commencer \u00E0 gagner des commissions.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>
                ),
                title: "Inscrivez-vous",
                desc: "Cr\u00E9ez votre compte affili\u00E9 gratuit et acc\u00E9dez instantan\u00E9ment \u00E0 votre dashboard, outils de suivi et lien personnalis\u00E9.",
              },
              {
                step: "02",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                ),
                title: "Faites passer le mot",
                desc: "Partagez votre lien dans un post, une story, une newsletter, votre bio ou int\u00E9grez-le dans votre contenu.",
              },
              {
                step: "03",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                ),
                title: "Gagnez des commissions",
                desc: "50% de commission sur chaque premier achat effectu\u00E9 via votre lien. Plus vous partagez, plus vous gagnez.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-5">
                  {item.icon}
                </div>
                <div className="text-[11px] font-bold text-green-500 uppercase tracking-widest mb-2">\u00C9tape {item.step}</div>
                <h3 className="font-display text-[18px] font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARNINGS CALCULATOR ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] text-center mb-4">
            Estimez vos gains
          </h2>
          <p className="text-gray-500 text-center mb-10">
            D\u00E9placez le curseur pour estimer vos revenus mensuels.
          </p>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <label className="block text-[14px] font-medium text-gray-700 mb-3">
              Visiteurs mensuels via votre lien
            </label>
            <input
              type="range"
              min={50}
              max={5000}
              step={50}
              value={visitors}
              onChange={(e) => setVisitors(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-500 mb-2"
            />
            <div className="flex justify-between text-[13px] text-gray-400 mb-8">
              <span>50</span>
              <span className="font-semibold text-gray-900 text-[16px]">{visitors} visiteurs/mois</span>
              <span>5 000</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-[12px] text-gray-400 mb-1">Conversions (~5%)</div>
                <div className="font-display font-bold text-[22px] text-gray-900">{Math.round(visitors * 0.05)}</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-[12px] text-gray-400 mb-1">Commission (50%)</div>
                <div className="font-display font-bold text-[22px] text-gray-900">~2,95\u20AC</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-[12px] text-green-600 font-medium mb-1">Gains estim\u00E9s</div>
                <div className="font-display font-extrabold text-[26px] text-green-600">{estimatedEarnings}\u20AC</div>
                <div className="text-[11px] text-green-500">/mois</div>
              </div>
            </div>

            <p className="text-[12px] text-gray-400 text-center">
              Bas\u00E9 sur un prix moyen de 5,90\u20AC et un taux de conversion de 5%.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY JOIN ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] text-center mb-12">
            Pourquoi rejoindre CVpass ?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "50% de commission", desc: "Le taux le plus g\u00E9n\u00E9reux du march\u00E9. Vous gagnez la moiti\u00E9 de chaque vente.", icon: "\uD83D\uDCB0" },
              { title: "Paiement mensuel", desc: "Vos gains sont vers\u00E9s chaque mois, d\u00E8s 20\u20AC de solde.", icon: "\uD83D\uDCC5" },
              { title: "Produit qui convertit", desc: "+1 200 CVs analys\u00E9s. Un produit \u00E9prouv\u00E9 avec une vraie traction.", icon: "\uD83D\uDE80" },
              { title: "Dashboard en temps r\u00E9el", desc: "Suivez vos clics, conversions et commissions en direct.", icon: "\uD83D\uDCCA" },
              { title: "Tunnel optimis\u00E9", desc: "Un parcours utilisateur qui convertit les visiteurs en clients.", icon: "\u26A1" },
              { title: "Inscription gratuite", desc: "Aucun frais, aucune condition. Ouvert \u00E0 tous.", icon: "\u2705" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-green-200 transition-colors">
                <span className="text-[24px]">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-[14px] text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[28px] font-extrabold tracking-[-1.5px] text-center mb-10">
            Questions fr\u00E9quentes
          </h2>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {FAQ_TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setFaqTab(i)}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-colors ${
                  faqTab === i
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FAQ items */}
          <div className="space-y-4">
            {FAQ_TABS[faqTab].items.map((item) => (
              <div key={item.q} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 text-[15px] mb-2">{item.q}</h3>
                <p className="text-[14px] text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIGNUP FORM ── */}
      <section id="signup" className="py-20 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-[28px] font-extrabold tracking-[-1.5px] text-center mb-3">
            Commencez \u00E0 gagner
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Cr\u00E9ez votre compte affili\u00E9 en 30 secondes.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-green-700 font-semibold text-[18px]">Compte affili\u00E9 cr\u00E9\u00E9 !</p>
              <p className="text-gray-500 text-[14px] mt-2">Redirection vers votre dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-5">
              {!isSignedIn && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-center">
                  <p className="text-[14px] text-amber-700">
                    Vous devez \u00EAtre connect\u00E9 pour devenir affili\u00E9.
                  </p>
                  <Link href="/login?redirect_url=/affiliate/join" className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 bg-amber-500 text-white text-[14px] font-semibold rounded-xl hover:bg-amber-600 transition-colors">
                    Se connecter
                  </Link>
                </div>
              )}

              <div>
                <label htmlFor="affiliate-code" className="block text-[14px] font-medium text-gray-700 mb-1.5">
                  Votre code affili\u00E9
                </label>
                <input
                  id="affiliate-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  placeholder="ex: GIOVANNI50"
                  maxLength={20}
                  className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <p className="text-[12px] text-gray-400 mt-1">C&apos;est le code que vos filleuls utiliseront. 3-20 caract\u00E8res.</p>
              </div>

              <div>
                <label htmlFor="affiliate-email" className="block text-[14px] font-medium text-gray-700 mb-1.5">
                  Email de paiement
                </label>
                <input
                  id="affiliate-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3.5 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
                <p className="text-[12px] text-gray-400 mt-1">Pour recevoir vos paiements de commission.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[13px] text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !isSignedIn}
                className="w-full py-4 min-h-[52px] bg-green-500 text-white text-[16px] font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Cr\u00E9ation...
                  </>
                ) : (
                  "Devenir affili\u00E9 gratuitement"
                )}
              </button>

              <p className="text-[12px] text-gray-400 text-center">
                Gratuit \u2022 Sans engagement \u2022 Inscription en 30 secondes
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-gray-900 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-[24px] md:text-[32px] font-extrabold text-white mb-4">
            Pr\u00EAt \u00E0 gagner avec CVpass ?
          </h2>
          <p className="text-gray-400 text-[16px] mb-8">
            Rejoignez notre programme d&apos;affiliation et commencez \u00E0 g\u00E9n\u00E9rer des revenus d\u00E8s aujourd&apos;hui.
          </p>
          <a href="#signup" className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 min-h-[52px] rounded-xl text-[16px] font-bold hover:bg-green-600 transition-colors">
            S&apos;inscrire maintenant
            <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>
      </section>
    </div>
  );
}
