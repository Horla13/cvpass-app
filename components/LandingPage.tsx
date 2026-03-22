"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Show } from "@clerk/nextjs";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ScoreGauge } from "@/components/ScoreGauge";

import { useStore } from "@/lib/store";

export function LandingPage() {
  const router = useRouter();
  const setCvText = useStore((s) => s.setCvText);
  const [counterValue, setCounterValue] = useState("+1 200");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <nav className="sticky top-0 z-50 bg-white/[0.92] backdrop-blur-[16px] border-b border-black/[0.04]">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between h-[60px] px-8">
          <div className="font-display text-[21px] font-extrabold tracking-[-0.8px]">
            <span className="text-brand-black">CV</span>
            <span className="text-brand-green">pass</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-7">
            <a href="#how" className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors">Comment ça marche</a>
            <a href="#features" className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors">Fonctionnalités</a>
            <Link href="/pricing" className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors">Tarifs</Link>
            <Link href="/blog" className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors">Blog</Link>
            <Show when="signed-out">
              <Link href="/login" className="text-sm text-brand-gray font-medium hover:text-brand-black transition-colors">Connexion</Link>
              <Link href="/signup" className="bg-brand-black text-white px-[18px] py-2 rounded-lg text-[13px] font-display font-semibold hover:bg-black hover:-translate-y-px transition-all">Analyser mon CV</Link>
            </Show>
            <Show when="signed-in">
              <Link href="/analyze" className="bg-brand-black text-white px-[18px] py-2 rounded-lg text-[13px] font-display font-semibold hover:bg-black hover:-translate-y-px transition-all">Mon espace &rarr;</Link>
            </Show>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-md text-brand-gray hover:text-brand-black hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-8 py-4 space-y-3">
            <a href="#how" onClick={() => setMobileOpen(false)} className="block text-sm text-brand-gray font-medium hover:text-brand-black">Comment ça marche</a>
            <a href="#features" onClick={() => setMobileOpen(false)} className="block text-sm text-brand-gray font-medium hover:text-brand-black">Fonctionnalités</a>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block text-sm text-brand-gray font-medium hover:text-brand-black">Tarifs</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="block text-sm text-brand-gray font-medium hover:text-brand-black">Blog</Link>
            <Show when="signed-out">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block text-sm text-brand-gray font-medium hover:text-brand-black">Connexion</Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-brand-black text-white py-2.5 rounded-lg text-[13px] font-display font-semibold mt-2">Analyser mon CV</Link>
            </Show>
            <Show when="signed-in">
              <Link href="/analyze" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-brand-black text-white py-2.5 rounded-lg text-[13px] font-display font-semibold mt-2">Mon espace &rarr;</Link>
            </Show>
          </div>
        )}
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
            Scanner CV ATS gratuit —{" "}
            <span className="text-brand-green">Optimise ton CV</span>
            <br />
            pour les recruteurs avec l&apos;IA
          </h1>

          {/* Subtitle */}
          <p className="fade-up text-brand-gray text-lg leading-relaxed max-w-[580px] mx-auto mb-10">
            Uploadez votre CV, obtenez un score ATS instant, des suggestions IA précises et un CV optimisé — prêt à télécharger.
          </p>

          {/* Actions */}
          <div className="fade-up flex items-center justify-center gap-4 mb-12">
            <Show when="signed-out">
              <Link href="/signup" className="inline-flex items-center gap-2 bg-brand-black text-white px-7 py-3.5 min-h-[48px] rounded-[10px] text-[15px] font-display font-bold hover:bg-black hover:-translate-y-px transition-all">
                Analyser mon CV gratuitement
                <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </Show>
            <Show when="signed-in">
              {/* Upload button — like cvcomp */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setIsUploading(true);
                  try {
                    const formData = new FormData();
                    formData.append("file", f);
                    const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
                    if (!res.ok) throw new Error();
                    const data = await res.json();
                    setCvText(data.text);
                    router.push("/analyze?step=type");
                  } catch {
                    alert("Erreur lors de l'upload. Vérifiez le format (PDF ou DOCX, max 5 Mo).");
                  } finally {
                    setIsUploading(false);
                  }
                }}
              />
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2.5 bg-brand-green text-white px-8 py-4 min-h-[48px] rounded-[12px] text-[16px] font-display font-bold hover:bg-green-600 hover:-translate-y-px transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Chargement...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      Uploader votre CV
                      <svg width="16" height="16" fill="none"><path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </>
                  )}
                </button>
                <Link
                  href="/analyze?step=resume-selection"
                  className="inline-flex items-center gap-1.5 text-[14px] text-brand-gray hover:text-brand-black transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Ou sélectionner parmi vos CV uploadés
                </Link>
              </div>
            </Show>
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

      {/* ── 5. HOW IT WORKS (detailed timeline) ── */}
      <section id="how" className="py-24 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-16 fade-up">
            <p className="text-[11px] font-bold uppercase tracking-[2px] text-brand-green mb-3">Comment ça marche</p>
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight mb-3">
              Comment optimiser ton CV ATS en <span className="text-brand-green">3 étapes</span>
            </h2>
            <p className="text-brand-gray text-base max-w-[500px] mx-auto">
              De l&apos;upload à l&apos;entretien, suivez le processus complet pour maximiser vos chances.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line (desktop only) */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />

            {[
              {
                n: "1",
                label: "ÉTAPE 1",
                title: "Importez votre CV et l'offre d'emploi",
                desc: "Uploadez votre CV en PDF ou Word — même s'il a été créé avec Canva. Puis collez l'offre d'emploi ciblée. Notre IA a besoin des deux pour comparer précisément votre profil aux attentes du recruteur.",
                details: [
                  "Formats acceptés : PDF, DOCX",
                  "Détection automatique des CV Canva (image)",
                  "Extraction intelligente du texte",
                ],
                mockup: (
                  <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-lg overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f8f9fa] border-b border-[#e5e7eb]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="text-[13px] text-brand-black font-medium">CV uploadé : MonCV.pdf</span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[12px] font-display font-bold text-brand-black">Collez l&apos;offre d&apos;emploi</p>
                        <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg p-3 h-20">
                          <p className="text-[11px] text-brand-gray">Nous recherchons un chef de chantier VRD expérimenté pour piloter les travaux de voirie...</p>
                        </div>
                      </div>
                      <div className="bg-brand-black text-white text-center py-2.5 rounded-[10px] text-[13px] font-display font-bold">
                        Analyser mon CV →
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                n: "2",
                label: "ÉTAPE 2",
                title: "Recevez votre score ATS détaillé",
                desc: "En quelques secondes, notre IA analyse votre CV et attribue un score sur 100 basé sur les mots-clés, la mise en forme, les sections essentielles et la quantification de vos réalisations.",
                details: [
                  "Score pondéré : mots-clés (40%), mise en forme (20%), sections (20%), chiffres (20%)",
                  "Résumé des lacunes principales",
                  "Comparaison avec les exigences du poste",
                ],
                mockup: (
                  <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-lg overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f8f9fa] border-b border-[#e5e7eb]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-6 flex items-center gap-6">
                      <div className="shrink-0">
                        <ScoreGauge score={42} size={100} strokeWidth={6} animate={false} />
                      </div>
                      <div className="space-y-2 flex-1">
                        <p className="text-[13px] font-display font-bold text-brand-black">Score ATS : 42/100</p>
                        <p className="text-[11px] text-brand-gray leading-relaxed">Votre CV contient 35% des mots-clés du poste. Lacunes : titre imprécis, pas d&apos;accroche, compétences VRD absentes.</p>
                        <div className="flex gap-2 flex-wrap">
                          {["Titre", "Accroche", "Mots-clés VRD"].map((tag) => (
                            <span key={tag} className="text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                n: "3",
                label: "ÉTAPE 3",
                title: "Acceptez ou ignorez chaque suggestion",
                desc: "L'IA propose des reformulations fidèles à votre parcours. Pour chaque suggestion, vous voyez le texte original, la version améliorée, et l'explication de l'impact ATS. Vous gardez le contrôle total.",
                details: [
                  "Suggestions triées par impact ATS décroissant",
                  "Badge d'impact : fort, moyen, faible",
                  "Explication du mot-clé ATS ciblé",
                  "Aucune invention — fidélité au parcours réel",
                ],
                mockup: (
                  <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-lg overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f8f9fa] border-b border-[#e5e7eb]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-5 space-y-3">
                      {[
                        { label: "Impact fort", color: "red", orig: "Géré les chantiers", sugg: "Gestion des chantiers VRD — coordination équipe et sous-traitants" },
                        { label: "Impact moyen", color: "amber", orig: "Responsable sécurité", sugg: "Suivi et application des normes PPSPS et port des EPI" },
                      ].map((s, i) => (
                        <div key={i} className="border border-[#e5e7eb] rounded-[10px] p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color === "red" ? "bg-red-50 text-red-600 border border-red-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>{s.label}</span>
                            <span className="text-[11px] text-brand-gray">Expérience</span>
                          </div>
                          <p className="text-[12px] text-gray-400 line-through">{s.orig}</p>
                          <p className="text-[12px] text-brand-black font-medium">{s.sugg}</p>
                          <div className="flex gap-2">
                            <span className="text-[11px] font-display font-bold text-brand-green bg-green-50 border border-green-200 px-3 py-1 rounded-lg cursor-pointer hover:bg-green-100 transition-colors">✓ Accepter</span>
                            <span className="text-[11px] font-display font-bold text-brand-gray bg-gray-50 border border-gray-200 px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">Ignorer</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
              {
                n: "4",
                label: "ÉTAPE 4",
                title: "Téléchargez votre CV optimisé",
                desc: "Votre CV est régénéré en PDF propre, sans colonnes ni icônes — conçu spécifiquement pour être lu par les logiciels ATS des recruteurs. Votre score passe en vert.",
                details: [
                  "PDF sobre et ATS-compatible",
                  "Toutes les suggestions acceptées intégrées",
                  "Score final recalculé en temps réel",
                  "Prêt à envoyer aux recruteurs",
                ],
                mockup: (
                  <div className="bg-white rounded-[14px] border border-[#e5e7eb] shadow-lg overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#f8f9fa] border-b border-[#e5e7eb]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" /><span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" /><span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="p-6 text-center space-y-4">
                      <ScoreGauge score={87} size={90} strokeWidth={6} animate={false} />
                      <div>
                        <p className="font-display text-[15px] font-bold text-brand-black">CV optimisé — prêt !</p>
                        <p className="text-[11px] text-brand-gray mt-1">6/8 suggestions acceptées · Score : 42 → 87</p>
                      </div>
                      <div className="flex gap-2 justify-center">
                        <div className="flex items-center gap-1.5 bg-brand-green text-white px-4 py-2 rounded-[10px] text-[12px] font-display font-bold">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Télécharger PDF
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
            ].map((step, i) => (
              <div key={step.n} className={`fade-up relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${i > 0 ? "mt-16 lg:mt-24" : ""}`}>
                {/* Timeline node (desktop) */}
                <div className="hidden lg:flex absolute left-1/2 top-0 -translate-x-1/2 z-10">
                  <div className="w-10 h-10 rounded-full bg-brand-green text-white flex items-center justify-center font-display font-bold text-[14px] shadow-md">
                    {step.n}
                  </div>
                </div>

                {/* Text side */}
                <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <p className="text-[11px] font-bold uppercase tracking-[2px] text-brand-green mb-2">{step.label}</p>
                  <h3 className="font-display text-[22px] md:text-[26px] font-extrabold tracking-[-0.8px] text-brand-black mb-3 leading-tight">{step.title}</h3>
                  <p className="text-[14px] text-brand-gray leading-relaxed mb-4">{step.desc}</p>
                  <ul className="space-y-2">
                    {step.details.map((d, j) => (
                      <li key={j} className="flex items-start gap-2 text-[13px] text-brand-gray">
                        <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mockup side */}
                <div className={`${i % 2 === 1 ? "lg:order-1" : ""} max-w-[420px] ${i % 2 === 0 ? "lg:ml-auto" : ""}`}>
                  {step.mockup}
                </div>
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
              Transformez votre CV moyen en{" "}
              <span className="text-brand-green">aimant à entretiens</span>
            </h2>
            <p className="text-brand-gray text-base max-w-[560px] mx-auto mt-4">
              Découvrez comment CVpass transforme des bullet points faibles en phrases percutantes optimisées ATS
            </p>
          </div>

          <div className="fade-up grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 lg:gap-0 items-stretch max-w-[960px] mx-auto">
            {/* BEFORE card */}
            <div className="rounded-t-[14px] lg:rounded-l-[14px] lg:rounded-tr-none border border-red-200 bg-gradient-to-b from-red-50/80 to-red-50/30 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="font-display text-[15px] font-bold text-red-500">CV Original (Avant)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-[28px] font-extrabold text-red-500 leading-none">34</span>
                  <span className="text-[13px] text-red-400 font-medium">/100</span>
                </div>
              </div>
              {/* Bullet points */}
              <div className="px-5 pb-6 space-y-2.5">
                {[
                  { text: "Géré une équipe de 5 personnes", badge: "Verbe faible", color: "red" },
                  { text: "Responsable des ventes en région", badge: "Pas de chiffres", color: "red" },
                  { text: "Aidé à améliorer les processus", badge: "Impact vague", color: "red" },
                  { text: "Traitement des plaintes clients", badge: "Passif", color: "red" },
                  { text: "Travaillé sur divers projets", badge: "Trop générique", color: "red" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/70 border border-red-100 rounded-[10px] px-4 py-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-300 shrink-0"></span>
                    <span className="flex-1 text-[13.5px] text-gray-600">{item.text}</span>
                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow separator */}
            <div className="hidden lg:flex items-center justify-center z-10 -mx-5">
              <div className="w-10 h-10 rounded-full bg-brand-green shadow-lg flex items-center justify-center">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M5 12h14m0 0l-4-4m4 4l-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
            {/* Mobile arrow */}
            <div className="flex lg:hidden items-center justify-center py-3 -my-px z-10">
              <div className="w-10 h-10 rounded-full bg-brand-green shadow-lg flex items-center justify-center">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 5v14m0 0l-4-4m4 4l4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>

            {/* AFTER card */}
            <div className="rounded-b-[14px] lg:rounded-r-[14px] lg:rounded-bl-none border border-green-200 bg-gradient-to-b from-green-50/40 to-white overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-green"></span>
                  <span className="font-display text-[15px] font-bold text-brand-green">CVpass Optimisé (Après)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-[28px] font-extrabold text-brand-green leading-none">87</span>
                  <span className="text-[13px] text-green-500 font-medium">/100</span>
                </div>
              </div>
              {/* Bullet points */}
              <div className="px-5 pb-6 space-y-2.5">
                {[
                  { text: "Pilotage d'une équipe de 5 personnes en méthode Agile", highlight: "+30% productivité" },
                  { text: "Développement commercial en région, CA portefeuille", highlight: "1,2M€ (+18% vs objectifs)" },
                  { text: "Optimisation des processus internes", highlight: "−40% temps de traitement" },
                  { text: "Gestion des réclamations clients", highlight: "98% de satisfaction" },
                  { text: "Coordination de 3 projets logiciels majeurs", highlight: "livrés en avance" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-green-50/50 border border-green-100 rounded-[10px] px-4 py-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span className="flex-1 text-[13.5px] text-brand-black">
                      {item.text},{" "}
                      <span className="font-semibold text-brand-green bg-green-100/60 px-1 py-0.5 rounded">{item.highlight}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="fade-up flex items-center justify-center gap-10 mt-12">
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px] text-brand-green">+31 points</div>
              <div className="text-xs text-brand-gray mt-1">en moyenne</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px] text-brand-green">3x</div>
              <div className="text-xs text-brand-gray mt-1">plus d&apos;entretiens</div>
            </div>
            <div className="w-px h-8 bg-gray-200"></div>
            <div className="text-center">
              <div className="font-display font-extrabold text-[22px] tracking-[-0.8px] text-brand-green">30s</div>
              <div className="text-xs text-brand-gray mt-1">pour optimiser</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. COMPARISON TABLE ── */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              Pourquoi choisir CVpass plutôt qu&apos;un{" "}
              <span className="text-brand-green">scanner ATS classique</span> ?
            </h2>
            <p className="text-brand-gray text-base max-w-[520px] mx-auto mt-4">
              Comparez les fonctionnalités face aux alternatives du marché
            </p>
          </div>

          <div className="fade-up overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-[14px] border border-[#e5e7eb] overflow-hidden text-left">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="px-6 py-4 text-[13px] font-bold text-brand-black w-[180px]">Fonctionnalité</th>
                  <th className="px-6 py-4 bg-green-50/60 border-x border-green-100">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-[15px] font-bold text-brand-green">CVpass</span>
                      <span className="text-[10px] font-bold text-brand-green bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wide">Meilleur</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-400">Jobscan</th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-400">Enhancv</th>
                  <th className="px-6 py-4 text-[13px] font-bold text-gray-400">MyPerfectResume</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {[
                  {
                    feature: "Optimisation par offre",
                    cvpass: "IA avancée qui adapte chaque suggestion au poste ciblé",
                    jobscan: "Standard : focus sur la fréquence des mots-clés",
                    enhancv: "Feedback générique, matching offre peu ciblé",
                    myperfect: "Basique : templates génériques par secteur",
                  },
                  {
                    feature: "Workflow d'édition",
                    cvpass: "Accepter/Ignorer chaque suggestion directement dans le CV",
                    jobscan: "\"Power Edit\" séparé du rapport d'analyse",
                    enhancv: "Éditeur visuel où les suggestions ATS disparaissent souvent",
                    myperfect: "Wizard linéaire, difficile de revenir en arrière",
                  },
                  {
                    feature: "Expérience utilisateur",
                    cvpass: "100% focus sur votre CV — zéro distraction",
                    jobscan: "Distraction : job trackers, audits LinkedIn, upsells",
                    enhancv: "Pousse les templates visuels et options payantes",
                    myperfect: "Upselling agressif, paywalls multiples",
                  },
                  {
                    feature: "Export PDF",
                    cvpass: "PDF propre et ATS-friendly, toutes les modifications incluses",
                    jobscan: "Bon, mais le formatage peut casser via Power Edit",
                    enhancv: "PDF uniquement, les modifs de l'éditeur ne reflètent pas toujours le score",
                    myperfect: "Téléchargement bloqué derrière un abonnement",
                  },
                  {
                    feature: "Prix",
                    cvpass: "Gratuit pour commencer, puis dès 2,90€",
                    jobscan: "À partir de 49,95$/mois",
                    enhancv: "À partir de 19,99$/mois",
                    myperfect: "À partir de 24,95$/mois",
                  },
                ].map((row, i) => (
                  <tr key={i} className={i < 4 ? "border-b border-[#e5e7eb]" : ""}>
                    <td className="px-6 py-5 font-display font-bold text-brand-black text-[13.5px]">{row.feature}</td>
                    <td className="px-6 py-5 bg-green-50/40 border-x border-green-100">
                      <div className="flex items-start gap-2">
                        <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="text-brand-black font-medium">{row.cvpass}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-gray-500">{row.jobscan}</td>
                    <td className="px-6 py-5 text-gray-500">{row.enhancv}</td>
                    <td className="px-6 py-5 text-gray-500">{row.myperfect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 8. FEATURES (360° style) ── */}
      <section id="features" className="py-24">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-6 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              Analyse <span className="text-brand-green">360&deg;</span> : score ATS, mots-clés et compatibilité recruteur
            </h2>
            <p className="text-brand-gray text-base mt-3 max-w-[580px] mx-auto">
              CVpass identifie chaque mot-clé manquant, corrige les blocages de parsing et quantifie votre impact avec son IA avancée.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                ),
                title: "Impact & Quantification",
                subtitle: "Le pouvoir des chiffres",
                desc: "Notre IA identifie les bullet points sans métriques et suggère des façons concrètes de quantifier vos réalisations.",
                checks: [
                  "Détection des pourcentages, montants et indicateurs temporels",
                  "Identification des formulations vagues comme \"amélioré la performance\"",
                  "Suggestions de quantification : %, €, effectifs, délais",
                ],
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                ),
                title: "Matching ATS par mots-clés",
                subtitle: "Analyse NLP avancée",
                desc: "Nous extrayons les mots-clés prioritaires de l'offre d'emploi et les comparons à votre CV en temps réel.",
                checks: [
                  "Extraction des mots-clés critiques de l'offre",
                  "Comparaison croisée avec vos compétences",
                  "Optimisation de la densité sans keyword stuffing",
                ],
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
                  </svg>
                ),
                title: "Mise en forme & Lisibilité",
                subtitle: "Détection des blocages parseur",
                desc: "Nous détectons les erreurs de formatage qui causent le rejet de 70% des CV par les logiciels ATS.",
                checks: [
                  "Vérification de la structure des sections",
                  "Détection des éléments non lisibles par les ATS",
                  "Optimisation de la hiérarchie du contenu",
                ],
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
                title: "Verbes d'action & Leadership",
                subtitle: "Densité de verbes d'impact",
                desc: "Nous remplaçons le langage passif par des verbes d'autorité adaptés au niveau de séniorité du poste.",
                checks: [
                  "Remplacement des formulations passives",
                  "Adaptation au niveau de séniorité visé",
                  "Réécriture complète des bullet points faibles",
                ],
              },
            ].map((f, i) => (
              <div key={i} className={`fade-up d${i + 1} bg-white border border-[#e5e7eb] rounded-[18px] p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-[17px] font-bold text-brand-black">{f.title}</h3>
                    <p className="text-[13px] text-brand-green font-medium">{f.subtitle}</p>
                  </div>
                </div>
                <p className="text-[14px] text-brand-gray leading-relaxed mb-5">{f.desc}</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Vérifications techniques</p>
                  <ul className="space-y-2.5">
                    {f.checks.map((check, ci) => (
                      <li key={ci} className="flex items-start gap-2.5 text-[13px] text-gray-600">
                        <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                        {check}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── 10. TESTIMONIALS ── */}
      <section className="py-24">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-5 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              La confiance des <span className="text-brand-green">chercheurs d&apos;emploi</span>
            </h2>
            <p className="text-brand-gray text-base mt-3 max-w-[520px] mx-auto">
              Rejoignez ceux qui ont transformé leur recherche avec CVpass
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { name: "Marie L.", role: "Chef de projet IT", initials: "ML", color: "from-pink-400 to-rose-500", result: "Score : 41 → 89", text: "Mon score ATS est passé de 41 à 89 en 10 minutes. L'outil ne dit pas juste \"verbe trop faible\" — il réécrit la phrase entière avec les mots-clés de l'offre. J'ai eu 3 réponses en une semaine." },
              { name: "Thomas K.", role: "Développeur Full-Stack", initials: "TK", color: "from-blue-400 to-indigo-500", result: "Score : 38 → 92 · 3 entretiens", text: "Score passé de 38 à 92. Avant, zéro réponse en 2 mois. Après CVpass, 3 entretiens en 1 semaine. Les autres outils donnent une liste de problèmes sans solution — ici l'IA corrige elle-même." },
              { name: "Sophie C.", role: "Responsable Marketing Digital", initials: "SC", color: "from-amber-400 to-orange-500", result: "Score : 45 → 91 · Poste décroché", text: "De 45 à 91 en quelques clics. Le fait que ça intègre les mots-clés de l'offre dans la réécriture c'est génial. Mon CV collait enfin exactement au poste. J'ai décroché le job en 2 semaines." },
            ].map((t, i) => (
              <div key={i} className={`fade-up d${i + 1} bg-white border border-[#e5e7eb] rounded-[18px] p-7 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}>
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${t.color} mx-auto mb-4 flex items-center justify-center text-white text-[18px] font-bold shadow-md`}>
                  {t.initials}
                </div>
                {/* Name & role */}
                <div className="text-[15px] font-bold text-brand-black">{t.name}</div>
                <div className="text-[13px] text-brand-gray mb-3">{t.role}</div>
                {/* Verified badge */}
                <div className="inline-flex items-center gap-1.5 border border-green-200 bg-green-50 rounded-full px-3 py-1 text-[12px] text-green-600 font-medium mb-3">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Vérifié
                </div>
                {/* Result badge */}
                <div className="block">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1.5 text-[12px] text-blue-600 font-semibold mb-3">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 6l-9.5 9.5-5-5L1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                    {t.result}
                  </span>
                </div>
                {/* Stars */}
                <div className="text-yellow-400 text-[16px] mb-4 tracking-wider">★★★★★</div>
                {/* Quote */}
                <p className="text-[13.5px] text-gray-500 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANATOMY ── */}
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-8">
          <h2 className="fade-up font-display text-[24px] md:text-[30px] font-extrabold tracking-[-1.2px] text-center mb-12">
            L&apos;anatomie d&apos;un <span className="text-brand-green">CV parfait</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/></svg>,
                title: "Polices standards",
                desc: "Utilisez Arial, Calibri ou Times New Roman. Les polices décoratives ne sont pas lues correctement par les logiciels ATS.",
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>,
                title: "Ordre antéchronologique",
                desc: "Listez votre expérience la plus récente en premier. Les ATS et les recruteurs s'attendent à ce format.",
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
                title: "Coordonnées en haut",
                desc: "Nom, téléphone, email et LinkedIn en en-tête. Les ATS extraient ces informations en priorité.",
              },
            ].map((tip, i) => (
              <div key={i} className={`fade-up d${i + 1}`}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-brand-green mb-4">
                  {tip.icon}
                </div>
                <h3 className="font-display text-[15px] font-bold text-brand-black mb-2">{tip.title}</h3>
                <p className="text-[13px] text-brand-gray leading-relaxed max-w-[300px] mx-auto">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOTRE HISTOIRE ── */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-[720px] mx-auto px-8">
          <div className="text-center mb-10 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] leading-tight">
              Pourquoi nous avons créé <span className="text-brand-green">CVpass</span>
            </h2>
          </div>
          <div className="fade-up space-y-5 text-[15px] text-gray-600 leading-relaxed">
            <p>
              Tout a commencé par un constat frustrant : des candidats qualifiés qui n&apos;obtenaient aucune réponse. Pas parce qu&apos;ils manquaient de compétences, mais parce que leur CV était rejeté par des machines avant même d&apos;être lu par un humain.
            </p>
            <p>
              En France, <strong className="text-brand-black">plus de 75% des grandes entreprises</strong> utilisent un ATS pour trier les candidatures. Ces logiciels éliminent automatiquement les CV mal formatés, sans les bons mots-clés ou avec une structure incompatible. Des milliers de profils excellents passent à la trappe chaque jour.
            </p>
            <p>
              Les outils existants ? Ils donnent un score et une liste de problèmes — puis vous laissent vous débrouiller. Nous voulions aller plus loin : <strong className="text-brand-black">un outil qui ne se contente pas de diagnostiquer, mais qui corrige.</strong>
            </p>
            <p>
              CVpass analyse ton CV, identifie chaque point faible et propose une réécriture IA intégrant les mots-clés de l&apos;offre que tu vises. Tu acceptes ou tu ignores. Le score remonte en temps réel. Tu télécharges un PDF propre, optimisé, prêt à postuler.
            </p>
            <p className="text-brand-black font-semibold">
              Notre mission : que le meilleur candidat obtienne l&apos;entretien — pas le mieux formaté.
            </p>
          </div>
        </div>
      </section>

      {/* ── 11. FAQ ── */}
      <section className="py-24 bg-[#fafafa]">
        <div className="max-w-[1100px] mx-auto px-8">
          <div className="text-center mb-14 fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] lg:text-[40px] font-extrabold tracking-[-1.5px] leading-tight">
              Questions fréquentes sur le <span className="text-brand-green">score ATS</span> et l&apos;optimisation CV
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
                {
                  question: "Combien de temps prend l'analyse ?",
                  answer: "L'analyse complète prend environ 30 secondes. Vous obtenez votre score ATS, la liste des points faibles et les suggestions de réécriture IA en une seule opération. L'export PDF est instantané.",
                },
                {
                  question: "Quels formats de CV sont acceptés ?",
                  answer: "CVpass accepte les fichiers PDF et Word (.docx). Les PDF générés depuis Word, Google Docs ou LibreOffice fonctionnent parfaitement. Les PDF images (captures d'écran, exports Canva non-texte) sont détectés et vous êtes guidé pour les corriger.",
                },
                {
                  question: "Est-ce que CVpass fonctionne pour tous les secteurs ?",
                  answer: "Oui. L'IA analyse les mots-clés spécifiques à votre offre d'emploi, quel que soit le secteur : tech, commerce, finance, RH, marketing, industrie, santé. Les suggestions sont toujours adaptées au vocabulaire de votre domaine.",
                },
                {
                  question: "L'IA réécrit-elle tout mon CV ?",
                  answer: "Non. CVpass identifie uniquement les points faibles et propose des améliorations ciblées. Pour chaque suggestion, vous choisissez d'accepter ou d'ignorer. Votre CV reste le vôtre — l'IA l'optimise, elle ne le réinvente pas.",
                },
                {
                  question: "Les crédits expirent-ils ?",
                  answer: "Non. Les crédits achetés avec le Pack Coup de pouce n'expirent jamais. Vous pouvez les utiliser à votre rythme, sans pression. Les crédits gratuits (2 analyses) sont également sans limite de temps.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── 12. BLOG LINKS ── */}
      <section className="bg-white py-16 px-8 border-t border-gray-100">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 text-center mb-8">
            Guides pour améliorer ton CV ATS
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <Link href="/blog/score-ats-cv" className="group p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
              <h3 className="font-display text-[15px] font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">Score ATS : comment le calculer et l&apos;améliorer</h3>
              <p className="text-[13px] text-gray-500">Guide complet 2026</p>
            </Link>
            <Link href="/blog/cv-canva-ats" className="group p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
              <h3 className="font-display text-[15px] font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">CV Canva et ATS : le problème et la solution</h3>
              <p className="text-[13px] text-gray-500">Pourquoi ton CV est invisible</p>
            </Link>
            <Link href="/blog/erreurs-cv-ats" className="group p-6 rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
              <h3 className="font-display text-[15px] font-bold text-gray-900 group-hover:text-green-600 transition-colors mb-2">10 erreurs CV qui font planter les ATS</h3>
              <p className="text-[13px] text-gray-500">Et comment les corriger</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 13. FOOTER ── */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-8">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-[16px] font-extrabold tracking-[-0.5px]">
              <span className="text-brand-black">CV</span>
              <span className="text-brand-green">pass</span>
            </span>
            <span className="text-[14px] md:text-[13px] text-gray-400 ml-2">© 2026 VertexLab SASU. Tous droits réservés.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
            <Link href="/blog" className="text-[14px] md:text-[13px] text-gray-400 hover:text-brand-black transition-colors py-1">Blog</Link>
            <Link href="/mentions-legales" className="text-[14px] md:text-[13px] text-gray-400 hover:text-brand-black transition-colors py-1">Mentions légales</Link>
            <Link href="/politique-confidentialite" className="text-[14px] md:text-[13px] text-gray-400 hover:text-brand-black transition-colors py-1">Confidentialité</Link>
            <Link href="/conditions-generales" className="text-[14px] md:text-[13px] text-gray-400 hover:text-brand-black transition-colors py-1">CGU/CGV</Link>
            <Link href="/politique-cookies" className="text-[14px] md:text-[13px] text-gray-400 hover:text-brand-black transition-colors py-1">Cookies</Link>
            <a href="mailto:contact@cvpass.fr" className="text-[14px] md:text-[13px] text-gray-400 hover:text-brand-black transition-colors py-1">Contact</a>
          </div>
        </div>
      </footer>

      <ExitIntentModal />
    </div>
  );
}
