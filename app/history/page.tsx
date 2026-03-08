"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/Card";
import { ScoreCircle } from "@/components/ScoreCircle";

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

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const selected = analyses.find((a) => a.id === selectedId);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-brand-black mb-6">
          Historique des candidatures
        </h1>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <Card className="p-6 text-center">
            <p className="text-red-500">{error}</p>
          </Card>
        )}

        {!loading && !error && analyses.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-brand-gray">
              Aucune analyse pour le moment.{" "}
              <a href="/dashboard" className="text-brand-green hover:underline">
                Analysez votre premier CV →
              </a>
            </p>
          </Card>
        )}

        {!loading && analyses.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Liste */}
            <div className="space-y-3">
              {analyses.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() =>
                    setSelectedId(
                      selectedId === analysis.id ? null : analysis.id
                    )
                  }
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedId === analysis.id
                      ? "border-brand-green bg-green-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-black truncate">
                        {analysis.job_title ?? "Poste non précisé"}
                      </p>
                      <p className="text-xs text-brand-gray mt-0.5">
                        {formatDate(analysis.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <div className="text-center">
                        <span className="text-xs text-brand-gray block">Avant</span>
                        <span className="text-sm font-semibold text-red-500">
                          {analysis.score_avant ?? "-"}
                        </span>
                      </div>
                      <span className="text-brand-gray text-xs">→</span>
                      <div className="text-center">
                        <span className="text-xs text-brand-gray block">Après</span>
                        <span
                          className={`text-sm font-semibold ${
                            (analysis.score_apres ?? 0) >= 70
                              ? "text-brand-green"
                              : (analysis.score_apres ?? 0) >= 40
                              ? "text-orange-500"
                              : "text-red-500"
                          }`}
                        >
                          {analysis.score_apres ?? "-"}
                        </span>
                      </div>
                      {analysis.cover_letters?.length > 0 && (
                        <span title="Lettre de motivation disponible">✉️</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-brand-gray">
                    {analysis.nb_acceptees ?? 0}/{analysis.nb_suggestions ?? 0}{" "}
                    suggestions acceptées
                  </div>
                </button>
              ))}
            </div>

            {/* Panneau détail */}
            {selected ? (
              <Card className="p-6 self-start sticky top-24 space-y-6">
                <div>
                  <h2 className="font-semibold text-brand-black text-lg">
                    {selected.job_title ?? "Poste non précisé"}
                  </h2>
                  <p className="text-brand-gray text-sm">
                    {formatDate(selected.created_at)}
                  </p>
                </div>

                <div className="flex justify-center gap-8">
                  <ScoreCircle
                    score={selected.score_avant ?? 0}
                    label="Avant"
                    size="sm"
                  />
                  <ScoreCircle
                    score={selected.score_apres ?? 0}
                    label="Après"
                    size="lg"
                  />
                </div>

                <p className="text-sm text-brand-gray text-center">
                  {selected.nb_acceptees ?? 0}/{selected.nb_suggestions ?? 0}{" "}
                  suggestions acceptées
                </p>

                {selected.cover_letters?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-brand-black mb-2">
                      Lettre de motivation
                    </p>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                      <pre className="text-xs text-brand-black whitespace-pre-wrap font-sans leading-relaxed">
                        {selected.cover_letters[0].content}
                      </pre>
                    </div>
                  </div>
                )}
              </Card>
            ) : (
              <div className="hidden lg:flex items-center justify-center text-brand-gray text-sm">
                Cliquez sur une candidature pour voir le détail
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
