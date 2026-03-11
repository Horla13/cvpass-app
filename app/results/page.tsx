"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useShallow } from "zustand/react/shallow";
import { usePostHog } from "posthog-js/react";
import { useStore } from "@/lib/store";
import { ScoreCircle } from "@/components/ScoreCircle";
import { SuggestionCard } from "@/components/SuggestionCard";
import { CVPreview } from "@/components/CVPreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";
import { PremiumModal } from "@/components/PremiumModal";

function ScoreContext({ score }: { score: number }) {
  let icon: string;
  let text: string;
  let colorClass: string;

  if (score < 50) {
    icon = "⛔";
    text = "Score critique — la majorité des ATS rejettent les CVs en dessous de 60/100";
    colorClass = "text-red-600 bg-red-50 border-red-200";
  } else if (score < 70) {
    icon = "⚠️";
    text = "Score moyen — encore des efforts pour passer les filtres ATS";
    colorClass = "text-orange-600 bg-orange-50 border-orange-200";
  } else if (score <= 85) {
    icon = "✅";
    text = "Bon score — votre CV passe la plupart des ATS";
    colorClass = "text-green-700 bg-green-50 border-green-200";
  } else {
    icon = "🏆";
    text = "Excellent score — votre CV est optimisé pour les ATS";
    colorClass = "text-green-700 bg-green-50 border-green-200";
  }

  return (
    <p className={`text-xs px-3 py-2 rounded-lg border ${colorClass} leading-snug mt-2`}>
      {icon} {text}
    </p>
  );
}

function LinkedInShare({ scoreAvant, scoreApres }: { scoreAvant: number; scoreApres: number }) {
  const text = `Mon CV est passé de ${scoreAvant} à ${scoreApres}/100 grâce à CVpass 🚀\nOptimisez votre CV pour les ATS en moins de 5 minutes : https://cvpass.fr`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://cvpass.fr")}&summary=${encodeURIComponent(text)}`;

  return (
    <a
      href={linkedInUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 justify-center w-full py-2.5 rounded-xl border border-[#0077b5] text-[#0077b5] text-sm font-semibold hover:bg-[#0077b5] hover:text-white transition-colors"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      Partager sur LinkedIn
    </a>
  );
}

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
  const posthog = usePostHog();

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
      posthog?.capture("email_sent", { type });
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
  const posthog = usePostHog();

  const { cvText, gaps, score_avant, scoreActuel, resume, acceptGap, ignoreGap } = useStore(
    useShallow((s) => ({
      cvText: s.cvText,
      gaps: s.gaps,
      score_avant: s.score_avant,
      scoreActuel: s.scoreActuel,
      resume: s.resume,
      acceptGap: s.acceptGap,
      ignoreGap: s.ignoreGap,
    }))
  );

  const [isDownloading, setIsDownloading] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(true);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [premiumModal, setPremiumModal] = useState<"pdf" | "letter" | null>(null);

  useEffect(() => {
    if (!cvText) router.push("/dashboard");
  }, [cvText, router]);

  const pendingGaps = gaps.filter((g) => g.status === "pending");
  const acceptedGaps = gaps.filter((g) => g.status === "accepted");

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      let savedId = analysisId;

      // Save analysis only once (first download)
      if (!savedId) {
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

        if (saveRes?.ok) {
          const saveData = await saveRes.json().catch(() => ({}));
          savedId = saveData.id ?? null;
          if (savedId) setAnalysisId(savedId);
        }
      }

      // Build final CV text client-side
      let finalCvText = cvText;
      for (const gap of acceptedGaps) {
        const orig = gap.texte_original?.trim();
        if (orig && finalCvText.includes(orig)) {
          finalCvText = finalCvText.replace(orig, gap.texte_suggere);
        }
      }

      // Pass analysisId so server can reuse stored cv_json on subsequent downloads
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText: finalCvText,
          acceptedGaps: [],
          analysisId: savedId,
        }),
      });

      if (res.status === 403) {
        setPremiumModal("pdf");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDownloadError(data.error ?? "Erreur lors de la génération du PDF.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv-optimise-cvpass.pdf";
      a.click();
      URL.revokeObjectURL(url);

      setPdfDownloaded(true);
      setShowUnsavedWarning(false);
      posthog?.capture("pdf_downloaded", { score_avant, score_apres: scoreActuel, nb_accepted: acceptedGaps.length });
    } catch (e: unknown) {
      setDownloadError(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleAcceptGap = (id: string) => {
    acceptGap(id);
    posthog?.capture("suggestion_accepted");
  };

  const handleIgnoreGap = (id: string) => {
    ignoreGap(id);
    posthog?.capture("suggestion_ignored");
  };

  if (!cvText) return null;

  // Build final CV text for email
  let finalCvTextForEmail = cvText;
  for (const gap of acceptedGaps) {
    const orig = gap.texte_original?.trim();
    if (orig && finalCvTextForEmail.includes(orig)) {
      finalCvTextForEmail = finalCvTextForEmail.replace(orig, gap.texte_suggere);
    }
  }

  return (
    <PageTransition>
      {premiumModal && (
        <PremiumModal feature={premiumModal} onClose={() => setPremiumModal(null)} />
      )}
      <div className="min-h-screen bg-gray-50">
        <AppHeader />

        {/* Unsaved warning banner — hidden after PDF download */}
        {showUnsavedWarning && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
            <p className="text-xs text-amber-700">
              ⚠️ Ne fermez pas cette page — vos modifications ne sont pas sauvegardées
            </p>
          </div>
        )}

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
                <ScoreContext score={scoreActuel} />
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

              {/* LinkedIn share — shown after first download */}
              {pdfDownloaded && (
                <Card className="p-4 space-y-2">
                  <p className="text-xs text-brand-gray text-center leading-relaxed">
                    Mon CV est passé de <strong>{score_avant}</strong> à <strong>{scoreActuel}/100</strong> grâce à CVpass 🚀
                  </p>
                  <LinkedInShare scoreAvant={score_avant} scoreApres={scoreActuel} />
                </Card>
              )}

              {downloadError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 text-center">
                  {downloadError}
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
                  <SuggestionCard key={gap.id} gap={gap} onAccept={handleAcceptGap} onIgnore={handleIgnoreGap} />
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
