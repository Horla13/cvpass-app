"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { UploadZone } from "@/components/UploadZone";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AppHeader } from "@/components/AppHeader";

export default function DashboardPage() {
  const router = useRouter();
  const cvText = useStore((s) => s.cvText);
  const jobOffer = useStore((s) => s.jobOffer);
  const setJobOffer = useStore((s) => s.setJobOffer);
  const setAnalysis = useStore((s) => s.setAnalysis);
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!cvText || !jobOffer.trim()) return;
    setIsAnalyzing(true);
    setError("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobOffer }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'analyse");
      }

      const data = await res.json();
      setAnalysis(data);

      // Fire-and-forget: save analysis metadata including job_title
      fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score_avant: data.score_avant,
          score_apres: data.score_avant, // sera mis à jour au download
          nb_suggestions: data.gaps?.length ?? 0,
          nb_acceptees: 0,
          job_title: data.job_title ?? "",
        }),
      }).catch(() => {}); // fire-and-forget, non bloquant

      router.push("/results");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Une erreur est survenue.";
      setError(msg);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-6">
        {/* Étape 1 — Upload */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-full bg-brand-green text-white text-sm font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="font-semibold text-brand-black">
              Uploadez votre CV
            </h2>
          </div>
          <UploadZone onSuccess={() => setStep(2)} />
        </Card>

        {/* Étape 2 — Offre d'emploi */}
        <Card
          className={`p-6 transition-opacity ${
            step === 1 ? "opacity-40 pointer-events-none" : ""
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center ${
                step === 2
                  ? "bg-brand-green text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </span>
            <h2 className="font-semibold text-brand-black">
              Collez l&apos;offre d&apos;emploi
            </h2>
          </div>
          <textarea
            value={jobOffer}
            onChange={(e) => setJobOffer(e.target.value)}
            placeholder="Copiez-collez ici le texte complet de l&apos;offre d&apos;emploi..."
            className="w-full h-48 p-3 border border-gray-200 rounded-lg text-sm text-brand-black placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
          />
          <div className="mt-4 flex items-center justify-between gap-4">
            {error && <p className="text-red-500 text-sm flex-1">{error}</p>}
            <Button
              onClick={handleAnalyze}
              disabled={!cvText || !jobOffer.trim() || isAnalyzing}
              size="lg"
              className="ml-auto shrink-0"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyse en cours...
                </span>
              ) : (
                "Analyser mon CV"
              )}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
