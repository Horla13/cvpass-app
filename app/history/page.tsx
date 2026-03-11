"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";

interface CoverLetter {
  id: string;
  content: string;
  created_at: string;
}

interface Analysis {
  id: string;
  created_at: string;
  job_title: string | null;
  score_avant: number;
  score_apres: number;
  nb_suggestions: number;
  nb_acceptees: number;
  cover_letters: CoverLetter[];
}

function scoreBadgeClass(score: number): string {
  if (score >= 75) return "bg-green-100 text-green-700";
  if (score >= 50) return "bg-orange-100 text-orange-700";
  return "bg-red-100 text-red-700";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-48 mb-4" />
      <div className="flex items-center gap-2 mb-3">
        <div className="h-6 bg-gray-200 rounded w-12" />
        <div className="h-2 bg-gray-200 rounded flex-1" />
        <div className="h-6 bg-gray-200 rounded w-12" />
      </div>
      <div className="h-3 bg-gray-200 rounded w-40" />
    </div>
  );
}

interface AnalysisCardProps {
  analysis: Analysis;
  onDelete: (id: string) => void;
}

function AnalysisCard({ analysis, onDelete }: AnalysisCardProps) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const progressWidth = Math.max(0, Math.min(100, analysis.score_apres));
  const progressStart = Math.max(0, Math.min(100, analysis.score_avant));

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: analysis.id }),
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      onDelete(analysis.id);
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 relative transition-shadow hover:shadow-md">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          {analysis.job_title ? (
            <p className="font-semibold text-brand-black truncate">{analysis.job_title}</p>
          ) : (
            <p className="font-semibold text-brand-gray italic text-sm">Poste non précisé</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-brand-gray">{formatDate(analysis.created_at)}</span>
          <button
            aria-label="Supprimer"
            onClick={() => setConfirming(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scores */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreBadgeClass(analysis.score_avant)}`}>
          {analysis.score_avant}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${scoreBadgeClass(analysis.score_apres)}`}>
          {analysis.score_apres}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="absolute top-0 h-full bg-gray-200 rounded-full"
          style={{ width: `${progressStart}%` }}
        />
        <div
          className="absolute top-0 h-full bg-[#16a34a] rounded-full transition-all duration-500"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-brand-gray">
          {analysis.nb_acceptees} / {analysis.nb_suggestions} suggestions acceptées
        </span>
        {analysis.cover_letters?.length > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
            Lettre incluse
          </span>
        )}
      </div>

      {/* Inline confirmation */}
      {confirming && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-brand-black mb-3">
            Supprimer cette candidature ? Cette action est irréversible.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="flex-1 py-2 px-4 rounded-xl border border-gray-200 text-sm text-brand-gray hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2 px-4 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors min-h-[44px] flex items-center justify-center gap-2"
            >
              {deleting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : "Supprimer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteAllState, setDeleteAllState] = useState<"idle" | "confirm" | "deleting">("idle");

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAnalyses(data.analyses);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Erreur de chargement");
      })
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id: string) {
    setAnalyses((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleDeleteAll() {
    if (deleteAllState === "idle") {
      setDeleteAllState("confirm");
      return;
    }
    if (deleteAllState === "confirm") {
      setDeleteAllState("deleting");
      try {
        const res = await fetch("/api/history", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: "all" }),
        });
        if (!res.ok) throw new Error("Erreur lors de la suppression");
        setAnalyses([]);
        setDeleteAllState("idle");
      } catch {
        setDeleteAllState("idle");
      }
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8fafc]">
        <AppHeader />

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-brand-black">Mes candidatures</h1>
              {!loading && (
                <p className="text-sm text-brand-gray mt-1">
                  {analyses.length} analyse{analyses.length !== 1 ? "s" : ""} effectuée{analyses.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-brand-gray hover:text-brand-black transition-colors min-h-[44px] px-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Nouvelle analyse
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}

          {/* Loading skeletons */}
          {loading && (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && analyses.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center gap-4">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b7280"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50"
              >
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <div>
                <p className="font-semibold text-brand-black mb-1">Aucune candidature pour le moment.</p>
                <p className="text-sm text-brand-gray">Lance ta première analyse !</p>
              </div>
              <Link
                href="/dashboard"
                className="mt-2 inline-flex items-center gap-2 px-5 py-3 bg-[#16a34a] text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors min-h-[44px]"
              >
                Analyser mon CV
              </Link>
            </div>
          )}

          {/* List */}
          {!loading && !error && analyses.length > 0 && (
            <>
              <div className="space-y-3">
                {analyses.map((analysis) => (
                  <AnalysisCard
                    key={analysis.id}
                    analysis={analysis}
                    onDelete={handleDelete}
                  />
                ))}
              </div>

              {/* Delete all button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleDeleteAll}
                  disabled={deleteAllState === "deleting"}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] ${
                    deleteAllState === "confirm" || deleteAllState === "deleting"
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white border border-gray-200 text-brand-gray hover:border-red-300 hover:text-red-500"
                  }`}
                >
                  {deleteAllState === "deleting" ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Suppression…
                    </>
                  ) : deleteAllState === "confirm" ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Confirmer la suppression totale
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                      </svg>
                      Tout supprimer
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
