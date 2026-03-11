"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useStore } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { CoverLetterEditor } from "@/components/CoverLetterEditor";
import { Card } from "@/components/ui/Card";
import { PageTransition } from "@/components/PageTransition";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function CoverLetterPage() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress ?? "";
  const cvText = useStore((s) => s.cvText);
  const jobOffer = useStore((s) => s.jobOffer);
  const coverLetter = useStore((s) => s.coverLetter);
  const setCoverLetter = useStore((s) => s.setCoverLetter);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // No CV in state — ask user to analyze first
  if (!cvText) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50">
          <AppHeader />
          <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center text-center gap-6">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 7l-10 7L2 7" />
            </svg>
            <div>
              <h1 className="text-xl font-bold text-brand-black mb-2">Aucun CV analysé</h1>
              <p className="text-sm text-brand-gray max-w-xs mx-auto">
                Analysez d&apos;abord votre CV avec une offre d&apos;emploi pour générer une lettre de motivation personnalisée.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              Analyser mon CV
            </button>
          </main>
        </div>
      </PageTransition>
    );
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, jobOffer }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de la génération");
      }
      const { content } = await res.json();
      setCoverLetter(content);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async (content: string) => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch("/api/save-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Erreur de sauvegarde");
      const { id } = await res.json();
      setSavedId(id);
      setCoverLetter(content);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPdf = async (content: string) => {
    const res = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvText: content, acceptedGaps: [] }),
    });
    if (res.status === 402) {
      setError("L'export PDF est une fonctionnalité premium. Voir /pricing.");
      return;
    }
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erreur lors de la génération du PDF.");
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lettre-motivation-cvpass.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-brand-black">
              Lettre de motivation
            </h1>
            <p className="text-brand-gray text-sm mt-1">
              Générée à partir de votre CV et de l&apos;offre d&apos;emploi analysée.
            </p>
          </div>

          {isGenerating && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" message="Génération de votre lettre de motivation…" />
            </div>
          )}

          {!coverLetter ? (
            <Card className="p-12 text-center">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-70">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <h2 className="font-semibold text-brand-black mb-2">
                Prêt à générer votre lettre
              </h2>
              <p className="text-brand-gray text-sm mb-6 max-w-sm mx-auto">
                CVpass va rédiger une lettre de motivation personnalisée
                en français, adaptée au poste et à votre profil.
              </p>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 bg-brand-green text-white px-8 py-3 rounded-md font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Génération en cours..." : "Générer ma lettre de motivation"}
              </button>
            </Card>
          ) : (
            <Card className="p-6">
              {savedId && (
                <div className="mb-4 text-sm text-brand-green font-medium">
                  ✓ Lettre sauvegardée dans votre historique
                </div>
              )}
              {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
              <CoverLetterEditor
                initialContent={coverLetter}
                onSave={handleSave}
                onDownloadPdf={handleDownloadPdf}
                isSaving={isSaving}
                defaultEmail={userEmail}
              />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="text-sm text-brand-gray hover:text-brand-black underline disabled:opacity-50"
                >
                  {isGenerating ? "Régénération..." : "Régénérer une nouvelle version"}
                </button>
              </div>
            </Card>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
