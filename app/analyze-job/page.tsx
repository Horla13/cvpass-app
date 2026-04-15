"use client";

import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

interface JobAnalysis {
  job_title: string;
  company: string;
  location: string;
  contract_type: string;
  experience_level: string;
  salary_range: string;
  quality_score: number;
  must_have_skills: string[];
  nice_to_have_skills: string[];
  red_flags: string[];
  green_flags: string[];
  keywords_for_cv: string[];
  summary: string;
}

export default function AnalyzeJobPage() {
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [mode, setMode] = useState<"text" | "url">("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobAnalysis | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = mode === "url" ? { jobUrl: jobUrl.trim() } : { jobText: jobText.trim() };
      const res = await fetch("/api/analyze-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 402) { setError("Crédits insuffisants."); return; }
      if (!res.ok) { const d = await res.json().catch(() => ({})); setError(d.error ?? "Erreur"); return; }
      setResult(await res.json());
    } catch { setError("Erreur réseau"); }
    finally { setLoading(false); }
  };

  const copyKeywords = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.keywords_for_cv.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = (s: number) => s < 40 ? "#ef4444" : s < 60 ? "#f59e0b" : "#16a34a";

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <span className="inline-block bg-green-50 text-green-600 text-[13px] font-semibold px-4 py-1.5 rounded-full mb-4">Nouveau</span>
          <h1 className="font-display text-[28px] md:text-[36px] font-extrabold tracking-[-1.5px] text-gray-900 mb-3">Analyseur d&apos;offre d&apos;emploi</h1>
          <p className="text-gray-500 text-[15px] max-w-lg mx-auto">Collez une offre et découvrez les mots-clés à mettre dans votre CV, la qualité de l&apos;offre et les signaux d&apos;alerte.</p>
        </div>

        {!result ? (
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setMode("text")} className={cn("flex-1 py-2.5 min-h-[44px] rounded-lg text-[13px] font-semibold transition-colors", mode === "text" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>Coller le texte</button>
              <button onClick={() => setMode("url")} className={cn("flex-1 py-2.5 min-h-[44px] rounded-lg text-[13px] font-semibold transition-colors", mode === "url" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500")}>Coller un lien</button>
            </div>

            {mode === "text" ? (
              <textarea value={jobText} onChange={(e) => setJobText(e.target.value)} rows={10}
                placeholder="Collez ici le texte de l'offre d'emploi..."
                className="w-full px-4 py-3 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
            ) : (
              <input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} type="url"
                placeholder="https://www.indeed.fr/..."
                className="w-full px-4 py-3 min-h-[44px] text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500" />
            )}

            {error && <p className="text-[14px] text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

            <button onClick={handleAnalyze}
              disabled={loading || (mode === "text" ? jobText.trim().length < 30 : !jobUrl.trim())}
              className="w-full py-4 min-h-[52px] bg-green-500 text-white text-[16px] font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (<><span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyse en cours...</>) : "Analyser l'offre (1 crédit)"}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-[20px] font-bold text-gray-900">{result.job_title}</h2>
                  <p className="text-[14px] text-gray-500">{result.company} · {result.location}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[12px] font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{result.contract_type}</span>
                    <span className="text-[12px] font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{result.experience_level}</span>
                    {result.salary_range !== "Non mentionné" && <span className="text-[12px] font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">{result.salary_range}</span>}
                  </div>
                </div>
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor(result.quality_score)} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(result.quality_score / 100) * 327} 327`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[22px] font-extrabold" style={{ color: scoreColor(result.quality_score) }}>{result.quality_score}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">Qualité offre</p>
                </div>
              </div>
              <p className="text-[14px] text-gray-600 mt-4 leading-relaxed">{result.summary}</p>
            </div>

            {/* Keywords for CV */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-[16px]">Mots-clés à mettre dans votre CV</h3>
                <button onClick={copyKeywords} className="text-[13px] text-green-500 hover:text-green-700 font-medium min-h-[44px] px-3">
                  {copied ? "Copié !" : "Copier"}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.keywords_for_cv.map((k, i) => (
                  <span key={i} className="bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1.5 text-[13px] font-medium">{k}</span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-[15px] mb-3">Compétences obligatoires</h3>
                <ul className="space-y-2">
                  {result.must_have_skills.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600">
                      <span className="text-red-400 mt-0.5 shrink-0">●</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-[15px] mb-3">Compétences souhaitées</h3>
                <ul className="space-y-2">
                  {result.nice_to_have_skills.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600">
                      <span className="text-amber-400 mt-0.5 shrink-0">●</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.green_flags.length > 0 && (
                <div className="bg-green-50 rounded-2xl border border-green-200 p-6">
                  <h3 className="font-bold text-green-800 text-[15px] mb-3">Points positifs</h3>
                  <ul className="space-y-2">
                    {result.green_flags.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-green-700">
                        <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.red_flags.length > 0 && (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                  <h3 className="font-bold text-red-800 text-[15px] mb-3">Signaux d&apos;alerte</h3>
                  <ul className="space-y-2">
                    {result.red_flags.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-red-700">
                        <svg className="mt-0.5 shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <p className="text-[15px] text-green-800 font-semibold mb-3">Optimisez votre CV pour cette offre</p>
              <a href="/analyze" className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 min-h-[48px] rounded-xl text-[14px] font-bold hover:bg-green-600 transition-colors">
                Scanner mon CV avec ces mots-clés
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg>
              </a>
            </div>

            <div className="text-center">
              <button onClick={() => { setResult(null); setError(""); }} className="text-[14px] text-gray-500 hover:text-gray-700 font-medium min-h-[44px]">Analyser une autre offre</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
