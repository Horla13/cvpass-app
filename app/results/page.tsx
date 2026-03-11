"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { ScoreCircle } from "@/components/ScoreCircle";
import { SuggestionCard } from "@/components/SuggestionCard";
import { CVPreview } from "@/components/CVPreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";

export default function ResultsPage() {
  const router = useRouter();
  const cvText = useStore((s) => s.cvText);
  const gaps = useStore((s) => s.gaps);
  const score_avant = useStore((s) => s.score_avant);
  const scoreActuel = useStore((s) => s.scoreActuel);
  const resume = useStore((s) => s.resume);
  const acceptGap = useStore((s) => s.acceptGap);
  const ignoreGap = useStore((s) => s.ignoreGap);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!cvText) {
      router.push("/dashboard");
    }
  }, [cvText, router]);

  const pendingGaps = gaps.filter((g) => g.status === "pending");
  const acceptedGaps = gaps.filter((g) => g.status === "accepted");

  const [downloadError, setDownloadError] = useState<{ message: string; upgradeUrl?: string } | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      await fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score_avant,
          score_apres: scoreActuel,
          nb_suggestions: gaps.length,
          nb_acceptees: acceptedGaps.length,
        }),
      }).catch(() => {});

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, acceptedGaps }),
      });

      if (res.status === 402) {
        setDownloadError({ message: "L'export PDF est une fonctionnalité premium.", upgradeUrl: "/pricing" });
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDownloadError({ message: data.error ?? "Erreur lors de la génération du PDF." });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv-optimise-cvpass.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setDownloadError({ message: e instanceof Error ? e.message : "Erreur inattendue." });
    } finally {
      setIsDownloading(false);
    }
  };

  if (!cvText) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <AppHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLONNE GAUCHE — Score et résumé */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6">
              <h2 className="font-semibold text-brand-black mb-6 text-center">
                Visibilité ATS
              </h2>
              <div className="flex justify-center items-end gap-8 mb-4">
                <div className="flex flex-col items-center gap-1">
                  <ScoreCircle score={score_avant} label="Avant" size="sm" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ScoreCircle score={scoreActuel} label="Maintenant" size="lg" />
                </div>
              </div>
              <p className="text-xs text-brand-gray italic text-center mt-2">
                Votre CV est{" "}
                {scoreActuel < 40
                  ? "peu visible"
                  : scoreActuel < 70
                  ? "moyennement visible"
                  : "bien visible"}{" "}
                pour ce poste
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-sm font-medium text-brand-black mb-2">
                {pendingGaps.length > 0
                  ? `${pendingGaps.length} suggestion${pendingGaps.length > 1 ? "s" : ""} en attente`
                  : "Toutes les suggestions ont été traitées"}
              </p>
              {resume && (
                <p className="text-sm text-brand-gray leading-relaxed">
                  {resume}
                </p>
              )}
            </Card>

            <Button
              onClick={handleDownload}
              size="lg"
              className="w-full"
              disabled={acceptedGaps.length === 0 || isDownloading}
            >
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Génération...
                </span>
              ) : (
                "Télécharger mon CV optimisé"
              )}
            </Button>
            {acceptedGaps.length === 0 && (
              <p className="text-xs text-brand-gray text-center">
                Acceptez au moins une suggestion pour télécharger
              </p>
            )}
            {downloadError && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
                {downloadError.message}
                {downloadError.upgradeUrl && (
                  <a href={downloadError.upgradeUrl} className="ml-2 underline font-medium">Voir les offres →</a>
                )}
              </div>
            )}
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => router.push("/cover-letter")}
            >
              ✉ Générer ma lettre de motivation
            </Button>
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-brand-gray hover:text-brand-black underline w-full text-center"
            >
              ← Nouvelle analyse
            </button>
          </div>

          {/* COLONNE CENTRE — Suggestions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-semibold text-brand-black">
              Suggestions d&apos;amélioration
            </h2>
            {pendingGaps.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-brand-gray text-sm">
                  {gaps.length === 0
                    ? "Aucune suggestion générée."
                    : "Toutes les suggestions ont été traitées. Téléchargez votre CV optimisé !"}
                </p>
              </Card>
            ) : (
              pendingGaps.map((gap) => (
                <SuggestionCard
                  key={gap.id}
                  gap={gap}
                  onAccept={acceptGap}
                  onIgnore={ignoreGap}
                />
              ))
            )}
          </div>

          {/* COLONNE DROITE — Aperçu CV */}
          <div className="lg:col-span-1">
            <h2 className="font-semibold text-brand-black mb-4">
              Aperçu de votre CV
            </h2>
            <CVPreview cvText={cvText} acceptedGaps={acceptedGaps} />
          </div>
        </div>
        </main>
      </div>
    </PageTransition>
  );
}
