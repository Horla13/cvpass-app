"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { PricingCard } from "@/components/PricingCard";
import { CTABanner } from "@/components/CTABanner";
import { KeywordGapTable } from "@/components/KeywordGapTable";
import { ScoreGauge } from "@/components/ScoreGauge";

export function LandingPage() {
  const [counterValue, setCounterValue] = useState("plus de 15");
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 70);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetch("/api/count")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.count > 0) setCounterValue(d.count.toLocaleString("fr-FR"));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white text-brand-black overflow-x-hidden">
      {/* ── 1. NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/92 backdrop-blur-[16px] border-b border-black/[0.04]">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between h-[60px] px-8">
          <div className="font-display text-[21px] font-extrabold tracking-[-0.8px]">
            <span className="text-brand-black">CV</span>
            <span className="text-brand-green">pass</span>
          </div>
          <div className="flex items-center gap-7">
            <a href="#features" className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors">Fonctionnalités</a>
            <a href="#pricing" className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors">Tarifs</a>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors">Connexion</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-brand-black text-white px-[18px] py-2 rounded-lg text-[13px] font-display font-semibold hover:bg-black hover:-translate-y-px transition-all">Analyser mon CV</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className="bg-brand-black text-white px-[18px] py-2 rounded-lg text-[13px] font-display font-semibold hover:bg-black hover:-translate-y-px transition-all">Mon espace &rarr;</Link>
            </Show>
          </div>
        </div>
      </nav>

      {/* ── 2. HERO ── */}
      <section className="py-24 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-8 text-center">
          {/* Badge */}
          <div className="fade-up inline-flex items-center gap-2.5 bg-green-50 border border-green-200 text-green-700 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-green"></span>
            </span>
            {counterValue} CVs analysés
          </div>

          {/* H1 */}
          <h1 className="fade-up font-display text-[32px] md:text-[42px] lg:text-[52px] font-extrabold tracking-[-2.5px] leading-[1.06] mb-6">
            Optimisez votre{" "}
            <span className="text-brand-green">score ATS</span>
            <br />
            et décrochez plus d&apos;entretiens
          </h1>

          {/* Subtitle */}
          <p className="fade-up text-brand-gray text-lg leading-relaxed max-w-[580px] mx-auto mb-10">
            Uploadez votre CV, obtenez un score ATS instant, des suggestions IA précises et un CV optimisé — prêt à télécharger.
          </p>

          {/* Actions */}
          <div className="fade-up flex items-center justify-center gap-4 mb-12">
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2 bg-brand-black text-white px-7 py-3.5 rounded-[10px] text-[15px] font-display font-bold hover:bg-black hover:-translate-y-px transition-all">
                  Analyser mon CV gratuitement
                  <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className="inline-flex items-center gap-2 bg-brand-black text-white px-7 py-3.5 rounded-[10px] text-[15px] font-display font-bold hover:bg-black hover:-translate-y-px transition-all">
                Analyser mon CV gratuitement
                <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </Show>
            <a href="#features" className="text-sm font-semibold text-brand-gray hover:text-brand-black transition-colors">
              Voir la démo &darr;
            </a>
          </div>

          {/* Proof stats */}
          <div className="fade-up flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px]">
                <span className="text-brand-green">{counterValue}</span>
              </div>
              <div className="text-xs text-brand-gray mt-0.5">CVs analysés</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px]">
                <span className="text-brand-green">4.8/5</span>
              </div>
              <div className="text-xs text-brand-gray mt-0.5">Note moyenne</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px]">
                <span className="text-brand-green">30s</span>
              </div>
              <div className="text-xs text-brand-gray mt-0.5">Pour optimiser</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. COMPATIBLE LOGOS ── */}
      <section className="py-6 border-y border-gray-100">
        <div className="max-w-[1100px] mx-auto px-8">
          <p className="text-center text-[11px] font-bold uppercase tracking-[1.5px] text-gray-400 mb-5">
            Collez une offre depuis vos sites préférés
          </p>
          <div className="relative overflow-hidden" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
            <div className="flex gap-10 w-max" style={{ animation: "scrollLogos 25s linear infinite" }}>
              {[...Array(2)].map((_, dup) => (
                <div key={dup} className="flex gap-10 shrink-0">
                  {[
                    { name: "LinkedIn", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> },
                    { name: "Indeed", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
                    { name: "WTTJ", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> },
                    { name: "HelloWork", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                    { name: "France Travail", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
                    { name: "Monster", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg> },
                    { name: "Glassdoor", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> },
                    { name: "Apec", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                  ].map((logo) => (
                    <div key={logo.name} className="flex items-center gap-2 text-gray-400 shrink-0">
                      {logo.icon}
                      <span className="text-[13px] font-semibold">{logo.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. BROWSER MOCKUP ── */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="fade-up rounded-2xl border border-gray-200 shadow-[0_4px_40px_rgba(0,0,0,0.08)] overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 bg-gray-50 border-b border-gray-200 px-5 py-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white border border-gray-200 rounded-md px-4 py-1 text-xs text-gray-400 text-center">
                cvpass.fr/results
              </div>
            </div>
            {/* Browser body */}
            <div className="p-8 flex flex-col md:flex-row gap-8 items-start">
              {/* Score Gauge */}
              <div className="flex-shrink-0">
                <ScoreGauge score={82} size={120} />
              </div>
              {/* Suggestion cards */}
              <div className="flex-1 flex flex-col gap-3">
                {/* Card 1 - accepted */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-brand-black mb-1">Ajouter des mots-clés techniques</div>
                      <div className="text-xs">
                        <span className="line-through text-red-400">Géré une équipe de 5 personnes</span>
                        <span className="mx-1.5 text-gray-300">&rarr;</span>
                        <span className="text-brand-green font-medium">Piloté une équipe de 5 en méthode Agile, +30% productivité</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 px-4 py-2 bg-green-50 border-t border-green-100">
                    <span className="text-xs font-semibold text-brand-green flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Accepté
                    </span>
                  </div>
                </div>
                {/* Card 2 - pending */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-brand-black mb-1">Quantifier les résultats</div>
                      <div className="text-xs">
                        <span className="line-through text-red-400">Responsable des ventes en région</span>
                        <span className="mx-1.5 text-gray-300">&rarr;</span>
                        <span className="text-brand-green font-medium">Développé un CA de 1,2M€, +18% vs objectifs</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <button className="text-xs font-semibold text-white bg-brand-black px-3 py-1 rounded-md">Accepter</button>
                    <button className="text-xs font-medium text-brand-gray px-3 py-1 rounded-md border border-gray-200">Ignorer</button>
                  </div>
                </div>
                {/* Card 3 - pending faded */}
                <div className="border border-gray-200 rounded-xl overflow-hidden opacity-50">
                  <div className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </span>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-brand-black mb-1">Renforcer le vocabulaire métier</div>
                      <div className="text-xs">
                        <span className="line-through text-red-400">Aidé à améliorer les processus</span>
                        <span className="mx-1.5 text-gray-300">&rarr;</span>
                        <span className="text-brand-green font-medium">Optimisé les processus internes, -40% temps de traitement</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 px-4 py-2 bg-gray-50 border-t border-gray-100">
                    <button className="text-xs font-semibold text-white bg-brand-black px-3 py-1 rounded-md">Accepter</button>
                    <button className="text-xs font-medium text-brand-gray px-3 py-1 rounded-md border border-gray-200">Ignorer</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. HOW IT WORKS ── */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-brand-green mb-3">Comment ça marche</p>
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight mb-3">
              4 étapes, 30 secondes
            </h2>
            <p className="text-brand-gray text-base max-w-[460px] mx-auto">
              Pas d&apos;inscription requise pour votre premier essai.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "1", title: "Uploadez votre CV", desc: "PDF ou Word, même créé avec Canva. Notre moteur extrait tout le contenu." },
              { n: "2", title: "Score ATS instantané", desc: "En quelques secondes, votre score s'affiche avec les points faibles identifiés." },
              { n: "3", title: "Acceptez les suggestions", desc: "L'IA propose des réécritures. Vous acceptez ou ignorez chaque suggestion." },
              { n: "4", title: "Téléchargez le PDF", desc: "Un PDF sobre, sans colonnes ni icônes. Conçu pour passer les logiciels RH." },
            ].map((step, i) => (
              <div key={step.n} className={`fade-up d${i + 1} bg-white border border-[#e5e7eb] rounded-[14px] p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-brand-green text-[13px] font-display font-bold mb-4">
                  {step.n}
                </div>
                <h3 className="font-display text-[15px] font-bold text-brand-black mb-2">{step.title}</h3>
                <p className="text-[13px] text-brand-gray leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. BEFORE / AFTER ── */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              Avant vs Après CVpass
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[700px] mx-auto mb-12">
            {/* Before */}
            <div className="fade-up d1 rounded-[14px] border border-red-200 bg-red-50 p-8 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-red-400 mb-3">Avant</div>
              <div className="font-display text-[48px] font-extrabold text-red-500 tracking-tighter leading-none mb-2">34</div>
              <div className="text-sm text-red-400">/100</div>
            </div>
            {/* After */}
            <div className="fade-up d2 rounded-[14px] border border-green-200 bg-green-50 p-8 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-green mb-3">Après</div>
              <div className="font-display text-[48px] font-extrabold text-brand-green tracking-tighter leading-none mb-2">87</div>
              <div className="text-sm text-green-500">/100</div>
            </div>
          </div>
          {/* Stats */}
          <div className="fade-up flex items-center justify-center gap-10">
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px] text-brand-green">+31 points</div>
              <div className="text-xs text-brand-gray mt-1">en moyenne</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px] text-brand-green">3x</div>
              <div className="text-xs text-brand-gray mt-1">entretiens</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px] text-brand-green">30s</div>
              <div className="text-xs text-brand-gray mt-1">pour optimiser</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. KEYWORD GAP ── */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              CVpass détecte ce qui manque
            </h2>
          </div>
          <div className="fade-up">
            <KeywordGapTable
              rows={[
                { skill: "Gestion de projet Agile", hasBefore: false, hasAfter: true },
                { skill: "Management d'équipe", hasBefore: true, hasAfter: true },
                { skill: "KPI & reporting", hasBefore: false, hasAfter: true },
                { skill: "Certification PMP", hasBefore: false, hasAfter: true },
                { skill: "Budgétisation", hasBefore: true, hasAfter: true },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── 8. FEATURES ── */}
      <section id="features" className="py-24">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              Tout ce qu&apos;il faut pour décrocher le poste
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                emoji: "\uD83D\uDCCA",
                color: "bg-blue-50",
                title: "Score ATS en temps réel",
                desc: "Votre score remonte à chaque suggestion acceptée. Mesurez l'impact immédiatement.",
              },
              {
                emoji: "\u2728",
                color: "bg-purple-50",
                title: "Suggestions IA",
                desc: "Pour chaque point faible, une réécriture complète avec les mots-clés de l'offre. Vous acceptez ou ignorez.",
              },
              {
                emoji: "\uD83D\uDCC4",
                color: "bg-green-50",
                title: "Export PDF optimisé",
                desc: "Un PDF sobre et propre, parfaitement lisible par les logiciels RH et ATS.",
              },
              {
                emoji: "\uD83D\uDCDD",
                color: "bg-orange-50",
                title: "Lettre de motivation IA",
                desc: "Générez une lettre de motivation calibrée sur l'offre en un clic.",
              },
            ].map((f, i) => (
              <div key={i} className={`fade-up d${i + 1} bg-white border border-[#e5e7eb] rounded-[14px] p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center text-xl mb-4`}>
                  {f.emoji}
                </div>
                <h3 className="font-display text-[16px] font-bold text-brand-black mb-2">{f.title}</h3>
                <p className="text-[13.5px] text-brand-gray leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. PRICING ── */}
      <section id="pricing" className="py-24 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight mb-3">
              Commencez gratuitement
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto">
            <div className="fade-up d1">
              <PricingCard
                name="Gratuit"
                description="Pour voir ce qui bloque votre CV."
                priceMain="0"
                priceSuffix="€"
                features={[
                  { text: "1 analyse de CV", included: true },
                  { text: "Score ATS détaillé", included: true },
                  { text: "3 problèmes identifiés", included: true },
                  { text: "Suggestions IA", included: false },
                  { text: "Export PDF", included: false },
                ]}
                cta="Commencer gratuitement"
                onCtaClick={() => router.push("/signup")}
              />
            </div>
            <div className="fade-up d2">
              <PricingCard
                name="Pass 48h"
                description="Pour optimiser 3-4 candidatures en urgence."
                priceMain="2"
                priceSuffix=",90€"
                highlighted={true}
                features={[
                  { text: "Scans illimités 48h", included: true },
                  { text: "Suggestions IA complètes", included: true, bold: true },
                  { text: "Réécriture des bullet points", included: true, bold: true },
                  { text: "Export PDF sans watermark", included: true },
                  { text: "Lettre de motivation IA", included: true },
                ]}
                cta="Choisir ce Pass"
                onCtaClick={() => router.push("/pricing")}
              />
            </div>
            <div className="fade-up d3">
              <PricingCard
                name="Recherche Active"
                description="Pour une recherche sur plusieurs semaines."
                priceMain="14"
                priceSuffix=",90€/mois"
                features={[
                  { text: "Tout du Pass 48h", included: true },
                  { text: "Historique illimité", included: true },
                  { text: "Suivi de candidatures", included: true },
                  { text: "Support prioritaire", included: true },
                  { text: "Sans engagement", included: true },
                ]}
                cta="Choisir ce Plan"
                onCtaClick={() => router.push("/pricing")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. TESTIMONIALS ── */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              Ils ont amélioré leur CV avec CVpass
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Marie L.", role: "Chef de projet, Paris", initials: "ML", before: 41, after: 89, text: "Ce qui m'a bluffé c'est que l'outil ne me dit pas juste \"verbe trop faible\" — il me réécrit la phrase entière avec les bons mots. J'ai eu 3 réponses en une semaine." },
              { name: "Thomas K.", role: "Développeur, Lyon", initials: "TK", before: 28, after: 84, text: "J'avais déjà essayé d'autres outils. Ça me donnait une liste de problèmes, je ne savais pas quoi faire. CVpass corrige lui-même — c'est une autre catégorie." },
              { name: "Sophie C.", role: "Marketing, Bordeaux", initials: "SC", before: 52, after: 91, text: "Le fait que ça intègre les mots-clés de l'offre dans la réécriture c'est génial. Mon CV collait enfin exactement au poste. Premier entretien 4 jours après." },
            ].map((t, i) => (
              <div key={i} className={`fade-up d${i + 1} bg-white border border-[#e5e7eb] rounded-[14px] p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                <div className="text-yellow-400 text-sm mb-3 tracking-wider">★★★★★</div>
                <p className="text-[14px] text-gray-600 leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center bg-red-50 text-red-400 text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {t.before}
                  </span>
                  <span className="text-gray-300 text-xs">&rarr;</span>
                  <span className="inline-flex items-center justify-center bg-green-50 text-brand-green text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {t.after}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-100 to-green-200 border border-green-300 flex items-center justify-center text-[11px] font-bold text-brand-green">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-brand-black">{t.name}</div>
                    <div className="text-[12px] text-brand-gray">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ── */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              FAQ
            </h2>
          </div>
          <div className="fade-up">
            <FAQAccordion
              items={[
                {
                  question: "Qu'est-ce qu'un score ATS ?",
                  answer: "Un score ATS mesure la compatibilité de votre CV avec les logiciels de tri automatique (Applicant Tracking Systems) utilisés par les recruteurs. Plus votre score est élevé, plus votre CV a de chances de passer les filtres automatiques et d'être lu par un humain.",
                },
                {
                  question: "Mes données sont-elles protégées ?",
                  answer: "Oui. Votre CV est traité en mémoire vive et n'est jamais stocké en base de données. Il disparaît automatiquement à la fermeture de votre onglet. Aucune donnée personnelle n'est conservée au-delà de votre session.",
                },
                {
                  question: "Est-ce que ça marche avec les CVs Canva ?",
                  answer: "Oui. CVpass détecte automatiquement si votre CV est au format image et vous guide pour l'exporter correctement. Les CVs créés avec Canva, Word ou tout autre outil sont pris en charge.",
                },
                {
                  question: "Je peux essayer gratuitement ?",
                  answer: "Oui, votre première analyse est gratuite, sans carte de crédit. Vous obtenez votre score ATS et les 3 premiers problèmes identifiés. Pour un accès complet aux suggestions IA et à l'export PDF, découvrez nos offres payantes.",
                },
                {
                  question: "Quelle est la différence avec les autres outils ?",
                  answer: "Les autres scanners ATS vous donnent un score et une liste de problèmes. CVpass va plus loin : pour chaque point faible, l'IA propose une réécriture complète intégrant les mots-clés de votre offre. Vous acceptez ou ignorez — c'est tout.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── 12. CTA BANNER ── */}
      <CTABanner />

      {/* ── 13. FOOTER ── */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-8">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-[16px] font-extrabold tracking-[-0.5px]">
              <span className="text-brand-black">CV</span>
              <span className="text-brand-green">pass</span>
            </span>
            <span className="text-[13px] text-gray-400 ml-2">© 2026 VertexLab SASU. Tous droits réservés.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/mentions-legales" className="text-[13px] text-gray-400 hover:text-brand-black transition-colors">Mentions légales</Link>
            <Link href="/privacy" className="text-[13px] text-gray-400 hover:text-brand-black transition-colors">Politique de confidentialité</Link>
            <a href="mailto:contact@cvpass.fr" className="text-[13px] text-gray-400 hover:text-brand-black transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
