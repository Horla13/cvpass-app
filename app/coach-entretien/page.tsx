"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

interface Question {
  question: string;
  why: string;
  answer_tips: string;
  category: "motivation" | "technique" | "comportemental" | "situationnel";
}

interface CoachResult {
  questions: Question[];
  general_tips: string[];
  company_research: string;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  motivation: { label: "Motivation", color: "bg-green-100 text-green-700" },
  technique: { label: "Technique", color: "bg-blue-100 text-blue-700" },
  comportemental: { label: "Comportemental", color: "bg-purple-100 text-purple-700" },
  situationnel: { label: "Situationnel", color: "bg-amber-100 text-amber-700" },
};

export default function CoachEntretienPage() {
  const [jobText, setJobText] = useState("");
  const [cvSummary, setCvSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoachResult | null>(null);
  const [error, setError] = useState("");
  const [openQ, setOpenQ] = useState<number | null>(0);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/coach-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobText: jobText.trim(), cvSummary: cvSummary.trim() || undefined }),
      });
      if (res.status === 402) { setError("Crédits insuffisants."); return; }
      if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Erreur"); return; }
      setResult(await res.json());
    } catch { setError("Erreur réseau"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <span className="inline-block bg-green-50 text-green-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-4">Nouveau</span>
          <h1 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] text-gray-900 mb-3">Coach entretien IA</h1>
          <p className="text-gray-500 text-[15px] max-w-lg mx-auto">Collez l&apos;offre d&apos;emploi et obtenez les questions probables avec des pistes de réponses personnalisées.</p>
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto space-y-5">
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-2">Offre d&apos;emploi *</label>
              <textarea value={jobText} onChange={(e) => setJobText(e.target.value)} rows={8}
                placeholder="Collez ici le texte de l'offre d'emploi..."
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-2">Résumé de votre CV <span className="text-gray-400">(optionnel, pour personnaliser)</span></label>
              <textarea value={cvSummary} onChange={(e) => setCvSummary(e.target.value)} rows={4}
                placeholder="Collez les points clés de votre CV pour des réponses plus adaptées à votre profil..."
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            </div>

            {error && <p className="text-[14px] text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

            <button onClick={handleAnalyze}
              disabled={loading || jobText.trim().length < 30}
              className="w-full py-4 min-h-[52px] bg-green-500 text-white text-[16px] font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Préparation en cours...</>) : "Préparer mon entretien (1 crédit)"}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Questions */}
            <div className="space-y-3">
              {result.questions.map((q, i) => {
                const cat = CATEGORY_LABELS[q.category] ?? CATEGORY_LABELS.motivation;
                const isOpen = openQ === i;
                return (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <button onClick={() => setOpenQ(isOpen ? null : i)}
                      className="w-full flex items-start gap-3 p-5 text-left min-h-[60px]">
                      <span className="shrink-0 w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[14px] font-bold">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-gray-900 leading-snug">{q.question}</p>
                        <span className={cn("inline-block mt-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full", cat.color)}>{cat.label}</span>
                      </div>
                      <svg className={cn("shrink-0 mt-1 transition-transform", isOpen && "rotate-180")} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                        <div>
                          <p className="text-[12px] font-semibold text-gray-400 uppercase mb-1">Pourquoi cette question</p>
                          <p className="text-[14px] text-gray-600">{q.why}</p>
                        </div>
                        <div>
                          <p className="text-[12px] font-semibold text-green-600 uppercase mb-1">Piste de réponse</p>
                          <p className="text-[14px] text-gray-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3 leading-relaxed">{q.answer_tips}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 text-[16px] mb-4">Conseils pour cet entretien</h3>
              <ul className="space-y-2">
                {result.general_tips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-[14px] text-gray-600">
                    <svg className="mt-0.5 shrink-0 text-green-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Company research */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="font-bold text-amber-800 text-[15px] mb-2">Recherches à faire avant l&apos;entretien</h3>
              <p className="text-[14px] text-amber-700 leading-relaxed">{result.company_research}</p>
            </div>

            <div className="text-center">
              <button onClick={() => { setResult(null); setError(""); }} className="text-[14px] text-gray-500 hover:text-gray-700 font-medium min-h-[44px]">Préparer un autre entretien</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
