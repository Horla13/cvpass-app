"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useStore } from "@/lib/store";
import { ScoreCircle } from "@/components/ScoreCircle";
import { SuggestionCard } from "@/components/SuggestionCard";
import { CVPreview } from "@/components/CVPreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";

function EmailSender({
  type,
  cvText,
  acceptedGaps,
  defaultEmail,
}: {
  type: "cv" | "letter";
  cvText?: string;
  acceptedGaps?: { texte_original: string; texte_suggere: string; id: string; section: string; raison: string; status: "accepted" | "pending" | "ignored" }[];
  defaultEmail: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const handleSend = async () => {
    setSending(true);
    setErr("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, email, cvText, acceptedGaps: acceptedGaps ?? [] }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Erreur d'envoi");
      }
      setSent(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => { setOpen((v) => !v); setSent(false); setErr(""); }}
        className="w-full text-sm text-brand-gray hover:text-brand-black underline underline-offset-2 transition-colors"
      >
        Envoyer par email
      </button>

      {open && (
        <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
          {sent ? (
            <p className="text-sm text-green-700 font-medium text-center">✅ Envoyé à {email}</p>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                placeholder="votre@email.com"
              />
              {err && <p className="text-xs text-red-500">{err}</p>}
              <button
                onClick={handleSend}
                disabled={sending || !email}
                className="w-full py-2 rounded-lg bg-brand-green text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {sending ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : "Envoyer"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const { user } = useUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress ?? "";

  const cvText = useStore((s) => s.cvText);
  const gaps = useStore((s) => s.gaps);
  const score_avant = useStore((s) => s.score_avant);
  const scoreActuel = useStore((s) => s.scoreActuel);
  const resume = useStore((s) => s.resume);
  const acceptGap = useStore((s) => s.acceptGap);
  const ignoreGap = useStore((s) => s.ignoreGap);
  const [isDownloading, setIsDownloading] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  useEffect(() => {
    if (!cvText) router.push("/dashboard");
  }, [cvText, router]);

  const pendingGaps = gaps.filter((g) => g.status === "pending");
  const acceptedGaps = gaps.filter((g) => g.status === "accepted");

  const [downloadError, setDownloadError] = useState<{ message: string; upgradeUrl?: string } | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      // Save analysis and capture id
      const saveRes = await fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score_avant,
          score_apres: scoreActuel,
          nb_suggestions: gaps.length,
          nb_acceptees: acceptedGaps.length,
        }),
      }).catch(() => null);

      let savedId: string | null = null;
      if (saveRes?.ok) {
        const saveData = await saveRes.json().catch(() => ({}));
        savedId = saveData.id ?? null;
        if (savedId) setAnalysisId(savedId);
      }

      // Build final CV text client-side
      let finalCvText = cvText;
      for (const gap of acceptedGaps) {
        const orig = gap.texte_original?.trim();
        if (orig && finalCvText.includes(orig)) {
          finalCvText = finalCvText.replace(orig, gap.texte_suggere);
        }
      }

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: finalCvText,
          acceptedGaps: [],
          analysisId: savedId,
        }),
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

  // Build final CV text for email (same logic as download)
  let finalCvTextForEmail = cvText;
  for (const gap of acceptedGaps) {
    const orig = gap.texte_original?.trim();
    if (orig && finalCvTextForEmail.includes(orig)) {
      finalCvTextForEmail = finalCvTextForEmail.replace(orig, gap.texte_suggere);
    }
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <AppHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* COLONNE GAUCHE — Score et résumé */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="p-6">
                <h2 className="font-semibold text-brand-black mb-6 text-center">Visibilité ATS</h2>
                <div className="flex justify-center items-end gap-8 mb-4">
                  <ScoreCircle score={score_avant} label="Avant" size="sm" />
                  <ScoreCircle score={scoreActuel} label="Maintenant" size="lg" />
                </div>
                <p className="text-xs text-brand-gray italic text-center mt-2">
                  Votre CV est{" "}
                  {scoreActuel < 40 ? "peu visible" : scoreActuel < 70 ? "moyennement visible" : "bien visible"}{" "}
                  pour ce poste
                </p>
              </Card>

              <Card className="p-4">
                <p className="text-sm font-medium text-brand-black mb-2">
                  {pendingGaps.length > 0
                    ? `${pendingGaps.length} suggestion${pendingGaps.length > 1 ? "s" : ""} en attente`
                    : "Toutes les suggestions ont été traitées"}
                </p>
                {resume && <p className="text-sm text-brand-gray leading-relaxed">{resume}</p>}
              </Card>

              {/* Download CV */}
              <div className="space-y-2">
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
                  <p className="text-xs text-brand-gray text-center">Acceptez au moins une suggestion pour télécharger</p>
                )}
                {acceptedGaps.length > 0 && (
                  <EmailSender
                    type="cv"
                    cvText={finalCvTextForEmail}
                    acceptedGaps={[]}
                    defaultEmail={userEmail}
                  />
                )}
              </div>

              {downloadError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
                  {downloadError.message}
                  {downloadError.upgradeUrl && (
                    <a href={downloadError.upgradeUrl} className="ml-2 underline font-medium">Voir les offres →</a>
                  )}
                </div>
              )}

              {/* Cover letter */}
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

              {/* Suppress unused var warning */}
              {analysisId && <span className="hidden">{analysisId}</span>}
            </div>

            {/* COLONNE CENTRE — Suggestions */}
            <div className="lg:col-span-1 space-y-4">
              <h2 className="font-semibold text-brand-black">Suggestions d&apos;amélioration</h2>
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
                  <SuggestionCard key={gap.id} gap={gap} onAccept={acceptGap} onIgnore={ignoreGap} />
                ))
              )}
            </div>

            {/* COLONNE DROITE — Aperçu CV */}
            <div className="lg:col-span-1">
              <h2 className="font-semibold text-brand-black mb-4">Aperçu de votre CV</h2>
              <CVPreview cvText={cvText} acceptedGaps={acceptedGaps} />
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
