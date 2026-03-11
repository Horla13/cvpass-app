"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { UploadZone } from "@/components/UploadZone";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function DashboardPage() {
  const router = useRouter();
  const cvText = useStore((s) => s.cvText);
  const jobOffer = useStore((s) => s.jobOffer);
  const setJobOffer = useStore((s) => s.setJobOffer);
  const setAnalysis = useStore((s) => s.setAnalysis);
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [errorInfo, setErrorInfo] = useState<{ message: string; upgradeUrl?: string } | null>(null);

  const handleAnalyze = async () => {
    if (!cvText || !jobOffer.trim()) return;
    setIsAnalyzing(true);
    setError("");
    setErrorInfo(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobOffer }),
      });

      if (res.status === 402) {
        setErrorInfo({
          message: "Vous avez utilisé votre analyse gratuite. Passez Pro pour continuer.",
          upgradeUrl: "/pricing",
        });
        setIsAnalyzing(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorInfo({ message: data.error ?? "Erreur lors de l'analyse. Réessayez." });
        setIsAnalyzing(false);
        return;
      }
      setErrorInfo(null);

      const data = await res.json();
      setAnalysis(data);

      fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score_avant: data.score_avant,
          score_apres: data.score_avant,
          nb_suggestions: data.gaps?.length ?? 0,
          nb_acceptees: 0,
          job_title: data.job_title ?? "",
        }),
      }).catch(() => {});

      router.push("/results");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Une erreur est survenue.";
      setError(msg);
      setIsAnalyzing(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc]">
        <AppHeader />

        {/* Hero header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-brand-green text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
              Nouvelle analyse
            </div>
            <h1 className="text-2xl font-bold text-brand-black leading-tight">
              Optimisez votre CV pour ce poste
            </h1>
            <p className="text-brand-gray text-sm mt-1.5">
              Uploadez votre CV, collez l&apos;offre — l&apos;IA identifie les gaps et réécrit chaque point faible.
            </p>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-6 py-8 space-y-4">

          {/* Étape 1 — Upload */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                step >= 1 ? "bg-brand-green text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {step > 1 ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : "1"}
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-black">Uploadez votre CV</p>
                <p className="text-xs text-brand-gray">PDF ou DOCX, jusqu&apos;à 5 Mo</p>
              </div>
            </div>
            <div className="p-6">
              <UploadZone onSuccess={() => setStep(2)} />
            </div>
          </div>

          {/* Étape 2 — Offre */}
          <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 ${
            step === 1 ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                step === 2 ? "bg-brand-green text-white" : "bg-gray-100 text-gray-400"
              }`}>
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-brand-black">Collez l&apos;offre d&apos;emploi</p>
                <p className="text-xs text-brand-gray">Welcome to the Jungle, LinkedIn, APEC, Indeed…</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={jobOffer}
                onChange={(e) => setJobOffer(e.target.value)}
                placeholder="Collez ici le texte complet de l'offre d'emploi…"
                className="w-full h-44 p-4 border border-gray-200 rounded-xl text-sm text-brand-black placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-shadow leading-relaxed"
              />

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleAnalyze}
                disabled={!cvText || !jobOffer.trim() || isAnalyzing}
                className="w-full py-3.5 rounded-xl bg-brand-green text-white font-semibold text-sm hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyse en cours…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                    Analyser mon CV
                  </>
                )}
              </button>
            </div>
          </div>

          {errorInfo && (
            <ErrorMessage message={errorInfo.message} upgradeUrl={errorInfo.upgradeUrl} />
          )}

          {/* Tips */}
          {step === 1 && (
            <div className="flex items-start gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
              <svg className="text-brand-green mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              <p className="text-xs text-green-800 leading-relaxed">
                <strong>Conseil :</strong> Utilisez un PDF exporté depuis Word ou Google Docs — les CVs Canva sont souvent illisibles par les ATS.
              </p>
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
