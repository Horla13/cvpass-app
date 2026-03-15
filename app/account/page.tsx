"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";

interface HistoryAnalysis {
  id: string;
  created_at: string;
  job_title: string | null;
  score_avant: number;
  score_apres: number;
  nb_suggestions: number;
  nb_acceptees: number;
}

interface CreditTransaction {
  id: string;
  created_at: string;
  amount: number;
  reason: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function reasonLabel(reason: string): string {
  const map: Record<string, string> = {
    initial_signup: "Inscription",
    jd_analysis: "Analyse match offre",
    ats_analysis: "Analyse ATS",
    pdf_export: "Export PDF",
    purchase_pack: "Achat pack",
    monthly_subscription: "Abonnement mensuel",
  };
  return map[reason] ?? reason;
}

export default function AccountPage() {
  const { user } = useUser();
  const [credits, setCredits] = useState(0);
  const [unlimited, setUnlimited] = useState(false);
  const [analyses, setAnalyses] = useState<HistoryAnalysis[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "profile">("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/credits").then((r) => r.json()).catch(() => ({} as Record<string, unknown>)),
      fetch("/api/history").then((r) => r.ok ? r.json() : ({} as Record<string, unknown>)).catch(() => ({} as Record<string, unknown>)),
      fetch("/api/credit-transactions").then((r) => r.ok ? r.json() : ({} as Record<string, unknown>)).catch(() => ({} as Record<string, unknown>)),
    ]).then(([creditsData, historyData, txData]) => {
      setCredits((creditsData as Record<string, number>).credits ?? 0);
      setUnlimited(!!(creditsData as Record<string, boolean>).unlimited);
      const hist = historyData as Record<string, HistoryAnalysis[]>;
      if (hist.analyses) setAnalyses(hist.analyses);
      const tx = txData as Record<string, CreditTransaction[]>;
      if (tx.transactions) setTransactions(tx.transactions);
      setLoading(false);
    });
  }, []);

  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.score_apres, 0) / totalAnalyses)
    : 0;
  const totalAccepted = analyses.reduce((sum, a) => sum + a.nb_acceptees, 0);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#0f172a]">
        <AppHeader />

        <main className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-[26px] font-bold text-gray-900 dark:text-gray-100">Mon compte</h1>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 mt-1">
                {user?.emailAddresses[0]?.emailAddress ?? ""}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-8 border-b border-gray-200 dark:border-gray-700">
            {([
              { key: "overview", label: "Vue d'ensemble" },
              { key: "history", label: "Historique" },
              { key: "profile", label: "Profil" },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-[14px] font-medium border-b-2 transition-colors -mb-px ${
                  activeTab === tab.key
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-3 border-gray-200 dark:border-gray-700 border-t-green-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ─── OVERVIEW TAB ─── */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Credit & Plan cards */}
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* Credits card */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[13px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Crédits disponibles</h3>
                        <span className="text-amber-500 text-lg">&#9889;</span>
                      </div>
                      {unlimited ? (
                        <div>
                          <p className="text-[32px] font-bold text-green-500 font-display">Illimité</p>
                          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">Abonnement Recherche Active</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[40px] font-bold text-gray-900 dark:text-gray-100 font-display">{credits}</p>
                          <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">
                            {credits === 0 ? "Achetez des crédits pour continuer" : `crédit${credits > 1 ? "s" : ""} restant${credits > 1 ? "s" : ""}`}
                          </p>
                        </div>
                      )}
                      <Link
                        href="/pricing"
                        className="mt-5 block text-center py-2.5 bg-green-500 text-white text-[13px] font-semibold rounded-xl hover:bg-green-600 transition-colors"
                      >
                        {unlimited ? "Gérer mon abonnement" : "Acheter des crédits"}
                      </Link>
                    </div>

                    {/* Costs card */}
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-[13px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-4">Coûts par action</h3>
                      <div className="space-y-3">
                        {[
                          { label: "Analyse ATS générale", cost: 1, icon: "📊" },
                          { label: "Match offre d'emploi", cost: 2, icon: "🎯" },
                          { label: "Export PDF", cost: 1, icon: "📄" },
                        ].map((item) => (
                          <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                            <div className="flex items-center gap-2.5">
                              <span className="text-[16px]">{item.icon}</span>
                              <span className="text-[14px] text-gray-700 dark:text-gray-200">{item.label}</span>
                            </div>
                            <span className="text-[14px] font-semibold text-amber-600">{item.cost} crédit{item.cost > 1 ? "s" : ""}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Analyses réalisées", value: totalAnalyses, icon: "📋" },
                      { label: "Score moyen", value: avgScore > 0 ? `${avgScore}/100` : "—", icon: "⭐" },
                      { label: "Suggestions acceptées", value: totalAccepted, icon: "✅" },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
                        <span className="text-[20px]">{stat.icon}</span>
                        <p className="text-[24px] font-bold text-gray-900 dark:text-gray-100 font-display mt-1">{stat.value}</p>
                        <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Recent transactions */}
                  {transactions.length > 0 && (
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-[13px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-4">Dernières transactions</h3>
                      <div className="space-y-2">
                        {transactions.slice(0, 5).map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700/50 last:border-0">
                            <div>
                              <p className="text-[14px] text-gray-700 dark:text-gray-200">{reasonLabel(tx.reason)}</p>
                              <p className="text-[12px] text-gray-400 dark:text-gray-500">{formatDate(tx.created_at)}</p>
                            </div>
                            <span className={`text-[14px] font-semibold ${tx.amount > 0 ? "text-green-500" : "text-red-400"}`}>
                              {tx.amount > 0 ? "+" : ""}{tx.amount} crédit{Math.abs(tx.amount) > 1 ? "s" : ""}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ─── HISTORY TAB ─── */}
              {activeTab === "history" && (
                <div>
                  {analyses.length === 0 ? (
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                      <p className="text-[16px] text-gray-400 dark:text-gray-500 mb-4">Aucune analyse pour le moment</p>
                      <Link
                        href="/analyze"
                        className="inline-flex px-5 py-2.5 bg-green-500 text-white text-[13px] font-semibold rounded-xl hover:bg-green-600 transition-colors"
                      >
                        Analyser mon CV
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {analyses.map((a) => (
                        <div key={a.id} className="bg-white dark:bg-[#1e293b] rounded-xl border border-gray-200 dark:border-gray-700 p-5 flex items-center justify-between hover:shadow-sm transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 font-bold text-[18px]">
                              {a.score_apres}
                            </div>
                            <div>
                              <p className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
                                {a.job_title || "Analyse CV"}
                              </p>
                              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">
                                {formatDate(a.created_at)} · {a.nb_suggestions} suggestion{a.nb_suggestions > 1 ? "s" : ""} · {a.nb_acceptees} acceptée{a.nb_acceptees > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-[12px] text-gray-400 dark:text-gray-500">Score</p>
                              <p className="text-[14px] font-semibold">
                                <span className="text-red-400">{a.score_avant}</span>
                                <span className="text-gray-300 dark:text-gray-600 mx-1">→</span>
                                <span className="text-green-500">{a.score_apres}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─── PROFILE TAB ─── */}
              {activeTab === "profile" && (
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                  <UserProfile
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        cardBox: "shadow-none border-0 w-full",
                        navbar: "hidden",
                      },
                    }}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
