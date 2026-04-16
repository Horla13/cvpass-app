"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { cn } from "@/lib/utils";

interface Analysis {
  id: string;
  created_at: string;
  job_title: string | null;
  score_avant: number;
  score_apres: number;
}

interface DashboardData {
  credits: number;
  unlimited: boolean;
  plan: string;
  analyses: Analysis[];
  totalAnalyses: number;
  totalApplications: number;
  avgScore: number;
  hasAnalyzed: boolean;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/credits").then((r) => r.json()),
      fetch("/api/history?limit=5").then((r) => r.json()),
      fetch("/api/applications").then((r) => r.json()),
    ])
      .then(([creds, history, apps]) => {
        const analyses = history.analyses ?? [];
        const scores = analyses.filter((a: Analysis) => a.score_apres > 0).map((a: Analysis) => a.score_apres);
        setData({
          credits: creds.credits ?? 0,
          unlimited: creds.unlimited ?? false,
          plan: creds.plan ?? "free",
          analyses,
          totalAnalyses: history.total ?? analyses.length,
          totalApplications: (apps.applications ?? []).length,
          avgScore: scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0,
          hasAnalyzed: analyses.length > 0,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <AppHeader />
        <div className="flex items-center justify-center py-32">
          <span className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const d = data!;

  // First time user — show onboarding
  if (!d.hasAnalyzed) {
    return (
      <div className="min-h-screen bg-[#f8f9fb]">
        <AppHeader />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <h1 className="font-display text-[28px] md:text-[32px] font-extrabold tracking-[-1.5px] text-gray-900 mb-3">
              Bienvenue sur CVpass
            </h1>
            <p className="text-gray-500 text-[15px]">
              Optimisez votre CV pour les recruteurs en 3 étapes.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { step: "1", title: "Uploadez votre CV", desc: "PDF ou Word, on extrait le texte automatiquement.", icon: "📄", done: false },
              { step: "2", title: "Obtenez votre score ATS", desc: "L'IA analyse votre CV et détecte chaque point faible.", icon: "📊", done: false },
              { step: "3", title: "Acceptez les corrections", desc: "Un clic pour appliquer chaque suggestion. Téléchargez le PDF corrigé.", icon: "✅", done: false },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl border border-gray-200 p-6 flex items-start gap-4">
                <span className="shrink-0 w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[18px]">{s.icon}</span>
                <div>
                  <h3 className="text-[16px] font-bold text-gray-900">{s.title}</h3>
                  <p className="text-[14px] text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/analyze" className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 min-h-[52px] rounded-xl text-[16px] font-bold hover:bg-green-600 transition-colors">
              Analyser mon CV gratuitement
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 4l4 4-4 4" /></svg>
            </Link>
            <p className="text-[13px] text-gray-400 mt-3">1 analyse offerte, sans carte de crédit</p>
          </div>
        </main>
      </div>
    );
  }

  const scoreColor = (s: number) => s < 40 ? "text-red-500" : s < 60 ? "text-amber-500" : "text-green-600";

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <AppHeader />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-display text-[24px] sm:text-[28px] font-extrabold text-gray-900 mb-6">Tableau de bord</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-[24px] font-extrabold text-green-600">{d.unlimited ? "∞" : d.credits}</p>
            <p className="text-[12px] text-gray-400">Crédits</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-[24px] font-extrabold text-gray-700">{d.totalAnalyses}</p>
            <p className="text-[12px] text-gray-400">Analyses</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={cn("text-[24px] font-extrabold", scoreColor(d.avgScore))}>{d.avgScore || "—"}</p>
            <p className="text-[12px] text-gray-400">Score moyen</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-[24px] font-extrabold text-gray-700">{d.totalApplications}</p>
            <p className="text-[12px] text-gray-400">Candidatures</p>
          </div>
        </div>

        {/* Score history mini chart */}
        {d.analyses.length > 1 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <h2 className="text-[15px] font-bold text-gray-900 mb-3">Évolution de vos scores</h2>
            <div className="flex items-end gap-2 h-24">
              {d.analyses.slice().reverse().map((a) => {
                const height = Math.max(8, (a.score_apres / 100) * 96);
                return (
                  <div key={a.id} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-gray-500">{a.score_apres}</span>
                    <div
                      className={cn("w-full rounded-t-md transition-all", a.score_apres >= 70 ? "bg-green-400" : a.score_apres >= 50 ? "bg-amber-400" : "bg-red-400")}
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-[9px] text-gray-400">{new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <h2 className="text-[15px] font-bold text-gray-900 mb-3">Actions rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { href: "/analyze", label: "Analyser un CV", icon: "📄", color: "bg-green-50 border-green-200" },
            { href: "/analyze-job", label: "Analyser une offre", icon: "🔍", color: "bg-blue-50 border-blue-200" },
            { href: "/coach-entretien", label: "Préparer un entretien", icon: "🎯", color: "bg-purple-50 border-purple-200" },
            { href: "/tracker", label: "Mes candidatures", icon: "📋", color: "bg-amber-50 border-amber-200" },
          ].map((a) => (
            <Link key={a.href} href={a.href} className={cn("rounded-xl border p-4 text-center hover:shadow-sm transition-all min-h-[80px] flex flex-col items-center justify-center gap-1.5", a.color)}>
              <span className="text-[20px]">{a.icon}</span>
              <span className="text-[13px] font-semibold text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>

        {/* Recent analyses */}
        {d.analyses.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[15px] font-bold text-gray-900">Dernières analyses</h2>
              <Link href="/history" className="text-[13px] text-green-600 font-medium hover:text-green-700">Voir tout</Link>
            </div>
            <div className="space-y-2">
              {d.analyses.map((a) => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-gray-900 truncate">{a.job_title || "Analyse ATS générale"}</p>
                    <p className="text-[12px] text-gray-400">{new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-gray-400">{a.score_avant}</span>
                    <svg width="12" height="12" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M3 6h6m0 0L7 4m2 2L7 8" /></svg>
                    <span className={cn("text-[14px] font-bold", scoreColor(a.score_apres))}>{a.score_apres}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
