"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

interface LinkedInResult {
  score: number;
  headline: string;
  summary: string;
  experience_tips: string[];
  skills: string[];
  issues: { problem: string; suggestion: string; impact: string }[];
}

const SECTORS = [
  "Marketing Digital", "D\u00e9veloppement Web", "Data / IA", "Finance / Comptabilit\u00e9",
  "Ressources Humaines", "Commercial / Vente", "Design / UX", "Ing\u00e9nierie",
  "Sant\u00e9", "Juridique", "Communication", "Logistique / Supply Chain",
  "\u00c9ducation / Formation", "Immobilier", "H\u00f4tellerie / Restauration",
];

export default function LinkedInPage() {
  const [profileText, setProfileText] = useState("");
  const [step, setStep] = useState<1 | 2>(1);
  const [targetMode, setTargetMode] = useState<"url" | "text" | "sector">("sector");
  const [jobUrl, setJobUrl] = useState("");
  const [jobOffer, setJobOffer] = useState("");
  const [sector, setSector] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInResult | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    const payload: Record<string, string> = { profileText };
    if (targetMode === "url" && jobUrl.trim()) payload.jobUrl = jobUrl.trim();
    if (targetMode === "text" && jobOffer.trim()) payload.jobOffer = jobOffer.trim();
    if (targetMode === "sector" && sector) payload.sector = sector;

    try {
      const res = await fetch("/api/analyze-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 402) {
        setError("Cr\u00e9dits insuffisants. Rechargez sur la page Tarifs.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Erreur d'analyse");
        return;
      }

      setResult(await res.json());
    } catch {
      setError("Erreur r\u00e9seau");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyAll = () => {
    if (!result) return;
    const all = `TITRE LINKEDIN\n${result.headline}\n\nR\u00c9SUM\u00c9 / \u00c0 PROPOS\n${result.summary}\n\nCOMP\u00c9TENCES\n${result.skills.join(", ")}`;
    copyToClipboard(all, "all");
  };

  const scoreColor = result ? (result.score < 40 ? "#ef4444" : result.score < 60 ? "#f59e0b" : "#16a34a") : "#6b7280";
  const canProceedStep1 = profileText.trim().length >= 50;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-50 text-blue-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-4">
            Optimiseur LinkedIn
          </span>
          <h1 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] text-gray-900 mb-3">
            Optimisez votre profil LinkedIn
          </h1>
          <p className="text-gray-500 text-[15px] max-w-lg mx-auto">
            Obtenez un score, un titre optimis\u00e9, un r\u00e9sum\u00e9 r\u00e9\u00e9crit et des comp\u00e9tences adapt\u00e9es aux recruteurs.
          </p>
        </div>

        {/* Stepper */}
        {!result && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors", step === 1 ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-600")}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
                Votre profil
              </div>
              <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg>
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-semibold transition-colors", step === 2 ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400")}>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
                Ciblage
              </div>
            </div>
          </div>
        )}

        {/* STEP 1 — Profil */}
        {!result && step === 1 && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Guide */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-[14px] font-semibold text-blue-800 mb-3">Comment r\u00e9cup\u00e9rer votre profil LinkedIn :</p>
              <div className="space-y-2">
                {[
                  { step: "1", text: "Ouvrez votre profil LinkedIn dans un navigateur" },
                  { step: "2", text: "S\u00e9lectionnez tout le contenu de la page (Ctrl+A ou Cmd+A)" },
                  { step: "3", text: "Collez-le ci-dessous (Ctrl+V ou Cmd+V)" },
                ].map((s) => (
                  <div key={s.step} className="flex items-start gap-3">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-[12px] font-bold flex items-center justify-center">{s.step}</span>
                    <p className="text-[14px] text-blue-700">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-2">
                Contenu de votre profil LinkedIn
              </label>
              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder={"Collez ici le contenu de votre profil LinkedIn.\n\nLe texte doit contenir au minimum votre titre, votre r\u00e9sum\u00e9 et vos exp\u00e9riences."}
                rows={10}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-[12px] text-gray-400 mt-1">{profileText.length} caract\u00e8res {profileText.length > 0 && profileText.length < 50 && <span className="text-amber-500">(minimum 50)</span>}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[14px] text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={() => { setError(""); setStep(2); }}
              disabled={!canProceedStep1}
              className="w-full py-4 min-h-[52px] bg-blue-500 text-white text-[16px] font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              Continuer
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg>
            </button>
          </div>
        )}

        {/* STEP 2 — Ciblage */}
        {!result && step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-[15px] text-gray-600 text-center">
              Adaptez l&apos;analyse \u00e0 votre objectif <span className="text-gray-400">(optionnel)</span>
            </p>

            {/* Mode tabs */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              {([
                { id: "sector" as const, label: "Secteur d'activit\u00e9" },
                { id: "url" as const, label: "Lien d'offre" },
                { id: "text" as const, label: "Texte d'offre" },
              ]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setTargetMode(m.id)}
                  className={cn(
                    "flex-1 py-2.5 min-h-[44px] rounded-lg text-[13px] font-semibold transition-colors",
                    targetMode === m.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Sector mode */}
            {targetMode === "sector" && (
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">Choisissez votre secteur</label>
                <div className="flex flex-wrap gap-2">
                  {SECTORS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSector(sector === s ? "" : s)}
                      className={cn(
                        "px-4 py-2 min-h-[40px] rounded-lg text-[13px] font-medium border transition-colors",
                        sector === s ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* URL mode */}
            {targetMode === "url" && (
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">Lien de l&apos;offre d&apos;emploi</label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://www.indeed.fr/... ou https://www.linkedin.com/jobs/..."
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[12px] text-gray-400 mt-1">Indeed, LinkedIn, WTTJ, Glassdoor, etc.</p>
              </div>
            )}

            {/* Text mode */}
            {targetMode === "text" && (
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">Collez le texte de l&apos;offre</label>
                <textarea
                  value={jobOffer}
                  onChange={(e) => setJobOffer(e.target.value)}
                  placeholder="Collez ici le texte de l'offre d'emploi pour adapter les recommandations aux mots-cl\u00e9s du poste..."
                  rows={5}
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[14px] text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-4 min-h-[52px] bg-gray-100 text-gray-600 text-[15px] font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex-1 py-4 min-h-[52px] bg-[#0077b5] text-white text-[16px] font-bold rounded-xl hover:bg-[#005f8d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    Analyser mon profil (1 cr\u00e9dit)
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="space-y-6">
            {/* Copy all button */}
            <div className="text-center">
              <button
                onClick={copyAll}
                className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] bg-blue-500 text-white text-[14px] font-bold rounded-xl hover:bg-blue-600 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                {copiedField === "all" ? "Tout copi\u00e9 !" : "Copier tout (titre + r\u00e9sum\u00e9 + comp\u00e9tences)"}
              </button>
            </div>

            {/* Score */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-[13px] text-gray-400 mb-2">Score LinkedIn</p>
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(result.score / 100) * 327} 327`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[32px] font-extrabold" style={{ color: scoreColor }}>{result.score}</span>
                </div>
              </div>
              <p className="text-[14px] text-gray-500">
                {result.score < 40 ? "Votre profil a besoin de travail" : result.score < 60 ? "Des am\u00e9liorations sont possibles" : result.score < 80 ? "Bon profil, quelques ajustements" : "Excellent profil"}
              </p>
            </div>

            {/* Headline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-[16px]">Titre LinkedIn optimis\u00e9</h3>
                <button
                  onClick={() => copyToClipboard(result.headline, "headline")}
                  className="text-[13px] text-blue-500 hover:text-blue-700 font-medium min-h-[44px] px-3"
                >
                  {copiedField === "headline" ? "Copi\u00e9 !" : "Copier"}
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
                <p className="text-[16px] text-blue-900 font-medium leading-relaxed">{result.headline}</p>
              </div>
              <p className="text-[12px] text-gray-400 mt-2">Collez ce titre dans la section &quot;Titre&quot; de votre profil LinkedIn</p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-[16px]">R\u00e9sum\u00e9 / \u00c0 propos optimis\u00e9</h3>
                <button
                  onClick={() => copyToClipboard(result.summary, "summary")}
                  className="text-[13px] text-blue-500 hover:text-blue-700 font-medium min-h-[44px] px-3"
                >
                  {copiedField === "summary" ? "Copi\u00e9 !" : "Copier"}
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
                <p className="text-[15px] text-blue-900 leading-relaxed whitespace-pre-line">{result.summary}</p>
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-[16px] mb-4">Probl\u00e8mes d\u00e9tect\u00e9s</h3>
                <div className="space-y-3">
                  {result.issues.map((issue, i) => (
                    <div key={i} className="flex gap-3">
                      <span className={cn("mt-1 shrink-0 w-2 h-2 rounded-full", issue.impact === "high" ? "bg-red-400" : issue.impact === "medium" ? "bg-amber-400" : "bg-gray-300")} />
                      <div>
                        <p className="text-[14px] text-gray-700">{issue.problem}</p>
                        <p className="text-[13px] text-green-600 mt-0.5">{issue.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience tips */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-[16px] mb-4">Am\u00e9liorations exp\u00e9riences</h3>
              <ul className="space-y-2">
                {result.experience_tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-[14px] text-gray-600">
                    <span className="text-blue-500 mt-0.5 shrink-0">&#10003;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-[16px]">Comp\u00e9tences recommand\u00e9es</h3>
                <button
                  onClick={() => copyToClipboard(result.skills.join(", "), "skills")}
                  className="text-[13px] text-blue-500 hover:text-blue-700 font-medium min-h-[44px] px-3"
                >
                  {copiedField === "skills" ? "Copi\u00e9 !" : "Copier tout"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.skills.map((skill, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-4 py-1.5 text-[13px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Retry */}
            <div className="text-center pt-4">
              <button
                onClick={() => { setResult(null); setError(""); setStep(1); }}
                className="text-[14px] text-gray-500 hover:text-gray-700 font-medium min-h-[44px]"
              >
                Relancer une analyse
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
