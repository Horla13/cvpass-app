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

export default function LinkedInPage() {
  const [profileText, setProfileText] = useState("");
  const [jobOffer, setJobOffer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInResult | null>(null);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (profileText.trim().length < 50) {
      setError("Collez au moins votre titre + resume + experiences LinkedIn.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze-linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileText, jobOffer: jobOffer.trim() || undefined }),
      });

      if (res.status === 402) {
        setError("Credits insuffisants. Rechargez sur la page Tarifs.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Erreur d'analyse");
        return;
      }

      setResult(await res.json());
    } catch {
      setError("Erreur reseau");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const scoreColor = result ? (result.score < 40 ? "#ef4444" : result.score < 60 ? "#f59e0b" : "#16a34a") : "#6b7280";

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <span className="inline-block bg-blue-50 text-blue-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-4">
            Nouveau
          </span>
          <h1 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] text-gray-900 mb-3">
            Optimiseur LinkedIn
          </h1>
          <p className="text-gray-500 text-[15px] max-w-lg mx-auto">
            Collez votre profil LinkedIn. L&apos;IA analyse et propose un titre, un resume et des competences optimisés pour les recruteurs.
          </p>
        </div>

        {!result ? (
          /* Input form */
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-2">
                Votre profil LinkedIn (copier-coller le texte)
              </label>
              <textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder={"Collez ici le contenu de votre profil LinkedIn :\n- Titre (headline)\n- A propos (resume)\n- Experiences\n- Compétences\n\nAstuce : allez sur votre profil LinkedIn, sélectionnez tout (Ctrl+A) et collez ici."}
                rows={10}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-[12px] text-gray-400 mt-1">{profileText.length} caractères</p>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-2">
                Offre d&apos;emploi cible (optionnel)
              </label>
              <textarea
                value={jobOffer}
                onChange={(e) => setJobOffer(e.target.value)}
                placeholder="Collez une offre pour adapter votre profil aux mots-clés du poste..."
                rows={4}
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[14px] text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || profileText.trim().length < 50}
              className="w-full py-4 min-h-[52px] bg-[#0077b5] text-white text-[16px] font-bold rounded-xl hover:bg-[#005f8d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  Analyser mon profil LinkedIn (1 credit)
                </>
              )}
            </button>
          </div>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Score */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <p className="text-[13px] text-gray-400 mb-2">Score LinkedIn</p>
              <div className="text-[56px] font-extrabold" style={{ color: scoreColor }}>{result.score}<span className="text-[20px] text-gray-400">/100</span></div>
              <p className="text-[14px] text-gray-500 mt-2">
                {result.score < 40 ? "Votre profil a besoin de travail" : result.score < 60 ? "Des ameliorations sont possibles" : result.score < 80 ? "Bon profil, quelques ajustements" : "Excellent profil"}
              </p>
            </div>

            {/* Headline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-[16px]">Titre LinkedIn optimise</h3>
                <button
                  onClick={() => copyToClipboard(result.headline, "headline")}
                  className="text-[13px] text-blue-500 hover:text-blue-700 font-medium min-h-[44px] px-3"
                >
                  {copiedField === "headline" ? "Copie !" : "Copier"}
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
                <h3 className="font-bold text-gray-900 text-[16px]">Résumé / A propos optimise</h3>
                <button
                  onClick={() => copyToClipboard(result.summary, "summary")}
                  className="text-[13px] text-blue-500 hover:text-blue-700 font-medium min-h-[44px] px-3"
                >
                  {copiedField === "summary" ? "Copie !" : "Copier"}
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
                <p className="text-[15px] text-blue-900 leading-relaxed whitespace-pre-line">{result.summary}</p>
              </div>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-[16px] mb-4">Problemes détectés</h3>
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
              <h3 className="font-bold text-gray-900 text-[16px] mb-4">Améliorations experiences</h3>
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
                <h3 className="font-bold text-gray-900 text-[16px]">Compétences recommandées</h3>
                <button
                  onClick={() => copyToClipboard(result.skills.join(", "), "skills")}
                  className="text-[13px] text-blue-500 hover:text-blue-700 font-medium min-h-[44px] px-3"
                >
                  {copiedField === "skills" ? "Copie !" : "Copier tout"}
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
                onClick={() => { setResult(null); setError(""); }}
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
