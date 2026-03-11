"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { UploadZone } from "@/components/UploadZone";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface HistoryAnalysis {
  id: string;
  created_at: string;
  job_title: string | null;
  score_avant: number;
  score_apres: number;
  nb_suggestions: number;
  nb_acceptees: number;
}

interface Stats {
  total: number;
  bestScore: number;
  totalAccepted: number;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 animate-pulse">
      <div className="h-7 bg-gray-200 rounded w-12 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-20" />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const firstName = user?.firstName ?? "toi";
  const posthog = usePostHog();

  const cvText = useStore((s) => s.cvText);
  const jobOffer = useStore((s) => s.jobOffer);
  const setJobOffer = useStore((s) => s.setJobOffer);
  const setAnalysis = useStore((s) => s.setAnalysis);

  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [errorInfo, setErrorInfo] = useState<{ message: string; upgradeUrl?: string } | null>(null);

  const [analyses, setAnalyses] = useState<HistoryAnalysis[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        const list: HistoryAnalysis[] = data.analyses ?? [];
        setAnalyses(list);
        const total = list.length;
        const bestScore = list.length > 0 ? Math.max(...list.map((a) => a.score_apres)) : 0;
        const totalAccepted = list.reduce((sum, a) => sum + (a.nb_acceptees ?? 0), 0);
        setStats({ total, bestScore, totalAccepted });
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const lastAnalysis = analyses.length > 0 ? analyses[0] : null;

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
      posthog?.capture("analysis_completed", {
        score_avant: data.score_avant,
        nb_suggestions: data.gaps?.length ?? 0,
        job_title: data.job_title ?? "",
      });

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

        {/* Personalized header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-6 py-8">
            <h1 className="text-2xl font-bold text-brand-black leading-tight flex items-center gap-2">
              Bonjour {firstName}
              <svg width="24" height="24" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                <path d="M22 11c0-3.314 2.686-6 6-6 3.314 0 6 2.686 6 6v20c0 3.314-2.686 6-6 6-3.314 0-6-2.686-6-6V11z" fill="#FCEA2B"/>
                <path d="M10 22c0-3.314 2.686-6 6-6 3.314 0 6 2.686 6 6v9c0 3.314-2.686 6-6 6-3.314 0-6-2.686-6-6v-9z" fill="#FCEA2B"/>
                <path d="M34 22c0-3.314 2.686-6 6-6 3.314 0 6 2.686 6 6v9c0 3.314-2.686 6-6 6-3.314 0-6-2.686-6-6v-9z" fill="#FCEA2B"/>
                <path d="M46 31c0-3.314 2.686-6 6-6 3.314 0 6 2.686 6 6v9c0 3.314-2.686 6-6 6-3.314 0-6-2.686-6-6v-9z" fill="#FCEA2B"/>
                <path d="M10 40c0 14.36 11.64 26 26 26s26-11.64 26-26H10z" fill="#F4AA41"/>
                <ellipse cx="36" cy="40" rx="26" ry="8" fill="#FCEA2B"/>
                <path d="M22 31v-9c0-3.314-2.686-6-6-6-3.314 0-6 2.686-6 6v9c0 .356.031.705.09 1.044C11.378 33.597 13.544 35 16 35c3.314 0 6-2.686 6-6z" fill="#FCEA2B"/>
              </svg>
            </h1>
            <p className="text-brand-gray text-sm mt-1">Prêt à optimiser ton CV ?</p>
          </div>
        </div>

        <main className="max-w-2xl mx-auto px-6 py-8 space-y-4">

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3">
            {statsLoading ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-black">{stats?.total ?? 0}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                    </svg>
                  </div>
                  <span className="text-xs text-brand-gray">Analyses</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-black">{stats?.bestScore ?? 0}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
                      <circle cx="12" cy="8" r="6" />
                      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                    </svg>
                  </div>
                  <span className="text-xs text-brand-gray">Meilleur score</span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-black">{stats?.totalAccepted ?? 0}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-xs text-brand-gray">Suggestions acceptées</span>
                </div>
              </>
            )}
          </div>

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
              <UploadZone onSuccess={() => { setStep(2); posthog?.capture("cv_uploaded"); }} />
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

          {/* Dernière analyse */}
          {!statsLoading && lastAnalysis && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-brand-gray mb-0.5 font-medium uppercase tracking-wide">Dernière candidature</p>
                <p className="text-sm font-semibold text-brand-black truncate">
                  {lastAnalysis.job_title ?? "Poste non précisé"}
                </p>
                <p className="text-xs text-brand-gray mt-0.5">
                  Score {lastAnalysis.score_apres} · {formatDate(lastAnalysis.created_at)}
                </p>
              </div>
              <Link
                href="/history"
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-[#16a34a] hover:text-green-700 transition-colors min-h-[44px] px-2"
              >
                Voir l&apos;historique
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          )}

          {/* Tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-3">
              <svg className="shrink-0 mt-0.5 text-green-700" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 18h6M10 22h4M12 2a7 7 0 017 7c0 3.5-2 5.5-2.5 6.5h-9C7 14.5 5 12.5 5 9a7 7 0 017-7z" />
              </svg>
              <p className="text-xs text-green-800 leading-relaxed">
                <strong>Adapte ton CV</strong> à chaque offre
              </p>
            </div>
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-3">
              <svg className="shrink-0 mt-0.5 text-green-700" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p className="text-xs text-green-800 leading-relaxed">
                <strong>Évite les CV Canva</strong> pour les ATS
              </p>
            </div>
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-3">
              <svg className="shrink-0 mt-0.5 text-green-700" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <p className="text-xs text-green-800 leading-relaxed">
                <strong>Vise un score ATS</strong> supérieur à 75
              </p>
            </div>
          </div>

        </main>
      </div>
    </PageTransition>
  );
}
