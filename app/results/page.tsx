"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useShallow } from "zustand/react/shallow";
import { usePostHog } from "posthog-js/react";
import { useStore, Gap } from "@/lib/store";
import { ScoreGauge } from "@/components/ScoreGauge";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";
import { cn } from "@/lib/utils";

/* ─── Category helpers ─── */
const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  experience: { label: "Expérience", color: "#3b82f6", icon: "💼" },
  competence: { label: "Compétences", color: "#8b5cf6", icon: "⚙️" },
  titre: { label: "Titre / Accroche", color: "#f59e0b", icon: "🎯" },
  accroche: { label: "Accroche", color: "#f59e0b", icon: "🎯" },
  formation: { label: "Formation", color: "#10b981", icon: "🎓" },
};

function getCategoryScore(gaps: Gap[], category: string): number {
  const catGaps = gaps.filter((g) => g.category === category);
  if (catGaps.length === 0) return 100;
  const accepted = catGaps.filter((g) => g.status === "accepted").length;
  const total = catGaps.length;
  // Base 40 + up to 60 based on ratio of fixed issues
  return Math.round(40 + (accepted / total) * 60);
}

/* ─── Small reusable components ─── */

function CategoryBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[13px]">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold" style={{ color }}>{score}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function StatBadge({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px]">
      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ backgroundColor: color }}>
        {count}
      </span>
      <span className="text-gray-600">{label}</span>
    </div>
  );
}

function KeywordTag({ text }: { text: string }) {
  return (
    <span className="inline-block px-2.5 py-1 bg-red-50 text-red-600 text-[12px] font-medium rounded-full border border-red-100">
      {text}
    </span>
  );
}

function ImpactBadge({ impact }: { impact?: string }) {
  const config = {
    high: { label: "Impact fort", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    medium: { label: "Impact moyen", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200" },
    low: { label: "Impact faible", bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" },
  };
  const c = config[(impact as keyof typeof config)] ?? config.medium;
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium border", c.bg, c.text, c.border)}>
      {c.label}
    </span>
  );
}

function SectionBadge({ section }: { section: string }) {
  const colors: Record<string, string> = {
    Expérience: "bg-blue-50 text-blue-600 border-blue-200",
    Compétences: "bg-purple-50 text-purple-600 border-purple-200",
    Formation: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Profil: "bg-amber-50 text-amber-600 border-amber-200",
    Titre: "bg-amber-50 text-amber-600 border-amber-200",
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[11px] font-medium border", colors[section] ?? "bg-gray-50 text-gray-600 border-gray-200")}>
      {section}
    </span>
  );
}

/* ─── Suggestion Row for Report tab ─── */
function SuggestionRow({ gap, onAccept, onIgnore }: { gap: Gap; onAccept: (id: string) => void; onIgnore: (id: string) => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <SectionBadge section={gap.section} />
        <ImpactBadge impact={gap.impact} />
      </div>

      {/* Original → Suggested */}
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <div className="bg-red-50/50 rounded-lg p-3 border border-red-100">
          <p className="text-[11px] text-red-400 font-medium mb-1">ACTUEL</p>
          <p className="text-[13px] text-gray-700 leading-relaxed">
            {gap.texte_original || <span className="italic text-gray-400">Absent du CV</span>}
          </p>
        </div>
        <div className="bg-green-50/50 rounded-lg p-3 border border-green-100">
          <p className="text-[11px] text-green-500 font-medium mb-1">SUGGÉRÉ</p>
          <p className="text-[13px] text-gray-700 leading-relaxed">{gap.texte_suggere}</p>
        </div>
      </div>

      {/* Reason */}
      <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">
        <span className="font-medium text-gray-600">Pourquoi :</span> {gap.raison}
      </p>

      {/* Actions */}
      {gap.status === "pending" && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAccept(gap.id)}
            className="px-4 py-2 bg-green-500 text-white text-[13px] font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1.5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            Accepter
          </button>
          <button
            onClick={() => onIgnore(gap.id)}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-[13px] font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Ignorer
          </button>
        </div>
      )}
      {gap.status === "accepted" && (
        <span className="inline-flex items-center gap-1.5 text-[13px] text-green-600 font-medium">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          Acceptée
        </span>
      )}
      {gap.status === "ignored" && (
        <span className="text-[13px] text-gray-400 font-medium">Ignorée</span>
      )}
    </div>
  );
}

/* ─── CV Editor Panel ─── */
function CVEditor({
  cvText,
  gaps,
  acceptedGaps,
  onAccept,
  onIgnore,
}: {
  cvText: string;
  gaps: Gap[];
  acceptedGaps: Gap[];
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
}) {
  const pendingGaps = gaps.filter((g) => g.status === "pending");
  const [selectedGap, setSelectedGap] = useState<string | null>(pendingGaps[0]?.id ?? null);

  // Build modified CV text with accepted suggestions
  let modifiedCvText = cvText;
  for (const gap of acceptedGaps) {
    const orig = gap.texte_original?.trim();
    if (!orig) continue;
    if (modifiedCvText.includes(orig)) {
      modifiedCvText = modifiedCvText.replace(orig, gap.texte_suggere);
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* CV Preview — 3 cols */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-gray-700">Aperçu du CV</h3>
            <span className="text-[12px] text-gray-400">
              {acceptedGaps.length} modification{acceptedGaps.length !== 1 ? "s" : ""} appliquée{acceptedGaps.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="p-6 max-h-[700px] overflow-y-auto">
            <pre className="text-[13px] leading-relaxed text-gray-700 whitespace-pre-wrap font-sans">
              {modifiedCvText}
            </pre>
          </div>
        </div>
      </div>

      {/* Suggestions Panel — 2 cols */}
      <div className="lg:col-span-2 space-y-3">
        <h3 className="text-[14px] font-semibold text-gray-700">
          Suggestions ({pendingGaps.length} en attente)
        </h3>

        {pendingGaps.length === 0 ? (
          <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
            <p className="text-[14px] text-green-700 font-medium">Toutes les suggestions ont été traitées !</p>
            <p className="text-[13px] text-green-600 mt-1">Téléchargez votre CV optimisé ci-dessous.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
            {pendingGaps.map((gap) => (
              <div
                key={gap.id}
                className={cn(
                  "bg-white rounded-xl border-2 p-4 cursor-pointer transition-all",
                  selectedGap === gap.id
                    ? "border-blue-400 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                )}
                onClick={() => setSelectedGap(gap.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <SectionBadge section={gap.section} />
                  <ImpactBadge impact={gap.impact} />
                </div>

                <div className="space-y-2 mb-3">
                  <div>
                    <p className="text-[11px] text-red-400 font-medium mb-0.5">ACTUEL</p>
                    <p className="text-[12px] text-gray-600 line-clamp-2">
                      {gap.texte_original || <span className="italic text-gray-400">Absent</span>}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-green-500 font-medium mb-0.5">SUGGÉRÉ</p>
                    <p className="text-[12px] text-gray-700 line-clamp-2">{gap.texte_suggere}</p>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 mb-3 line-clamp-2">{gap.raison}</p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); onAccept(gap.id); }}
                    className="flex-1 py-1.5 bg-green-500 text-white text-[12px] font-semibold rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onIgnore(gap.id); }}
                    className="flex-1 py-1.5 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Ignorer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Also show accepted/ignored */}
        {gaps.filter((g) => g.status !== "pending").length > 0 && (
          <details className="mt-2">
            <summary className="text-[13px] text-gray-400 cursor-pointer hover:text-gray-600">
              Suggestions traitées ({gaps.filter((g) => g.status !== "pending").length})
            </summary>
            <div className="space-y-2 mt-2">
              {gaps.filter((g) => g.status !== "pending").map((gap) => (
                <div key={gap.id} className="bg-gray-50 rounded-lg border border-gray-100 p-3 opacity-60">
                  <div className="flex items-center gap-2 mb-1">
                    <SectionBadge section={gap.section} />
                    <span className={cn("text-[11px] font-medium", gap.status === "accepted" ? "text-green-500" : "text-gray-400")}>
                      {gap.status === "accepted" ? "✓ Acceptée" : "— Ignorée"}
                    </span>
                  </div>
                  <p className="text-[12px] text-gray-500 line-clamp-1">{gap.texte_suggere}</p>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN RESULTS PAGE
   ═══════════════════════════════════════════════════════════ */
export default function ResultsPage() {
  const router = useRouter();
  useUser();
  const posthog = usePostHog();

  const { cvText, gaps, score_avant, scoreActuel, resume, jobTitle, acceptGap, ignoreGap } = useStore(
    useShallow((s) => ({
      cvText: s.cvText,
      gaps: s.gaps,
      score_avant: s.score_avant,
      scoreActuel: s.scoreActuel,
      resume: s.resume,
      jobTitle: s.jobTitle,
      acceptGap: s.acceptGap,
      ignoreGap: s.ignoreGap,
    }))
  );

  const [activeTab, setActiveTab] = useState<"report" | "editor">("report");
  const [isDownloading, setIsDownloading] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (!cvText) router.push("/dashboard");
  }, [cvText, router]);

  // Derived data
  const pendingGaps = useMemo(() => gaps.filter((g) => g.status === "pending"), [gaps]);
  const acceptedGaps = useMemo(() => gaps.filter((g) => g.status === "accepted"), [gaps]);
  const ignoredGaps = useMemo(() => gaps.filter((g) => g.status === "ignored"), [gaps]);

  // Category scores
  const categories = useMemo(() => {
    const cats = new Set(gaps.map((g) => g.category).filter(Boolean));
    return Array.from(cats).map((cat) => ({
      key: cat!,
      ...CATEGORY_CONFIG[cat!] ?? { label: cat!, color: "#6b7280", icon: "📋" },
      score: getCategoryScore(gaps, cat!),
    }));
  }, [gaps]);

  // Missing keywords (from gaps with no texte_original — meaning absent from CV)
  const missingKeywords = useMemo(() => {
    return gaps
      .filter((g) => !g.texte_original || g.texte_original.trim() === "")
      .map((g) => g.texte_suggere.split(" ").slice(0, 3).join(" "))
      .slice(0, 8);
  }, [gaps]);

  // Group gaps by impact for report
  const highImpactGaps = useMemo(() => gaps.filter((g) => g.impact === "high"), [gaps]);
  const mediumImpactGaps = useMemo(() => gaps.filter((g) => g.impact === "medium"), [gaps]);
  const lowImpactGaps = useMemo(() => gaps.filter((g) => g.impact === "low"), [gaps]);

  const handleAcceptGap = (id: string) => {
    acceptGap(id);
    setAnalysisId(null);
    posthog?.capture("suggestion_accepted");
  };

  const handleIgnoreGap = (id: string) => {
    ignoreGap(id);
    setAnalysisId(null);
    posthog?.capture("suggestion_ignored");
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadError(null);
    try {
      let savedId = analysisId;
      if (!savedId) {
        const saveRes = await fetch("/api/save-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            score_avant,
            score_apres: scoreActuel,
            nb_suggestions: gaps.length,
            nb_acceptees: acceptedGaps.length,
            job_title: jobTitle,
          }),
        }).catch(() => null);
        if (saveRes?.ok) {
          const saveData = await saveRes.json().catch(() => ({}));
          savedId = saveData.id ?? null;
          if (savedId) setAnalysisId(savedId);
        }
      }

      let finalCvText = cvText;
      for (const gap of acceptedGaps) {
        const orig = gap.texte_original?.trim();
        if (!orig) continue;
        if (finalCvText.includes(orig)) {
          finalCvText = finalCvText.replace(orig, gap.texte_suggere);
        } else {
          const origNorm = orig.replace(/\s+/g, " ");
          const cvNorm = finalCvText.replace(/\s+/g, " ");
          if (cvNorm.includes(origNorm)) {
            finalCvText = cvNorm.replace(origNorm, gap.texte_suggere);
          }
        }
      }

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText: finalCvText, acceptedGaps, analysisId: savedId }),
      });

      if (res.status === 402) {
        setDownloadError("Crédits insuffisants pour générer le PDF. Achetez des crédits.");
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
      posthog?.capture("pdf_downloaded", { score_avant, score_apres: scoreActuel, nb_accepted: acceptedGaps.length });
    } catch (e: unknown) {
      setDownloadError(e instanceof Error ? e.message : "Erreur inattendue.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!cvText) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8f9fb]">
        <AppHeader />

        {/* Top bar with tabs + progress */}
        <div className="sticky top-[60px] z-30 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-14">
              {/* Tabs */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab("report")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[13px] font-medium transition-colors",
                    activeTab === "report"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
                    Rapport
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("editor")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[13px] font-medium transition-colors",
                    activeTab === "editor"
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Éditeur CV
                  </span>
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-3 text-[13px]">
                  <span className="text-gray-400">{acceptedGaps.length}/{gaps.length} acceptées</span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${(acceptedGaps.length / Math.max(gaps.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-[13px] font-semibold">
                  <span className="text-red-400">{score_avant}</span>
                  <span className="text-gray-300 mx-1">→</span>
                  <span className="text-green-500">{scoreActuel}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* ─── REPORT TAB ─── */}
          {activeTab === "report" && (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* SIDEBAR — 4 cols */}
              <aside className="lg:col-span-4 space-y-5">
                {/* Score Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  {jobTitle && (
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-1">
                      Match pour
                    </p>
                  )}
                  {jobTitle && (
                    <h2 className="font-display text-[17px] font-bold text-gray-800 mb-5">{jobTitle}</h2>
                  )}

                  <div className="flex justify-center mb-5">
                    <ScoreGauge score={scoreActuel} size={160} strokeWidth={8} label="Score global" />
                  </div>

                  {/* Before score */}
                  <div className="flex items-center justify-center gap-3 mb-5">
                    <div className="text-center">
                      <p className="text-[11px] text-gray-400 mb-0.5">Avant</p>
                      <p className="text-[20px] font-bold text-red-400">{score_avant}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><path d="M5 12h14m-7-7l7 7-7 7" /></svg>
                    <div className="text-center">
                      <p className="text-[11px] text-gray-400 mb-0.5">Après</p>
                      <p className="text-[20px] font-bold text-green-500">{scoreActuel}</p>
                    </div>
                  </div>

                  {/* Category breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Par catégorie</p>
                    {categories.map((cat) => (
                      <CategoryBar key={cat.key} label={`${cat.icon} ${cat.label}`} score={cat.score} color={cat.color} />
                    ))}
                  </div>
                </div>

                {/* Stats Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
                  <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider">Suggestions</p>
                  <StatBadge count={pendingGaps.length} label="En attente" color="#f59e0b" />
                  <StatBadge count={acceptedGaps.length} label="Acceptées" color="#16a34a" />
                  <StatBadge count={ignoredGaps.length} label="Ignorées" color="#9ca3af" />
                </div>

                {/* Missing Keywords */}
                {missingKeywords.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-3">Mots-clés manquants</p>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.map((kw, i) => (
                        <KeywordTag key={i} text={kw} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {resume && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-5">
                    <p className="text-[12px] text-gray-400 font-medium uppercase tracking-wider mb-2">Résumé</p>
                    <p className="text-[13px] text-gray-600 leading-relaxed">{resume}</p>
                  </div>
                )}

                {/* Download CTA */}
                <div className="space-y-3">
                  <button
                    onClick={handleDownload}
                    disabled={acceptedGaps.length === 0 || isDownloading}
                    className="w-full py-3.5 bg-green-500 text-white text-[14px] font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isDownloading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        Télécharger mon CV optimisé
                      </>
                    )}
                  </button>
                  {acceptedGaps.length === 0 && (
                    <p className="text-[12px] text-gray-400 text-center">Acceptez au moins une suggestion pour télécharger</p>
                  )}
                  {downloadError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-600 text-center">
                      {downloadError}
                    </div>
                  )}

                  {pdfDownloaded && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-2">
                      <p className="text-[13px] text-green-700 font-medium">CV téléchargé avec succès !</p>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://cvpass.fr")}&summary=${encodeURIComponent(`Mon CV est passé de ${score_avant} à ${scoreActuel}/100 grâce à CVpass 🚀`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#0077b5] text-[#0077b5] text-[13px] font-semibold hover:bg-[#0077b5] hover:text-white transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        Partager sur LinkedIn
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => router.push("/dashboard")}
                    className="w-full text-[13px] text-gray-400 hover:text-gray-600 transition-colors py-2"
                  >
                    ← Nouvelle analyse
                  </button>
                </div>
              </aside>

              {/* MAIN CONTENT — 8 cols */}
              <div className="lg:col-span-8 space-y-6">
                {/* High impact */}
                {highImpactGaps.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <h3 className="font-display text-[16px] font-bold text-gray-800">Corrections prioritaires</h3>
                      <span className="text-[12px] text-gray-400">{highImpactGaps.length} suggestion{highImpactGaps.length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="space-y-3">
                      {highImpactGaps.map((gap) => (
                        <SuggestionRow key={gap.id} gap={gap} onAccept={handleAcceptGap} onIgnore={handleIgnoreGap} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Medium impact */}
                {mediumImpactGaps.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <h3 className="font-display text-[16px] font-bold text-gray-800">Améliorations recommandées</h3>
                      <span className="text-[12px] text-gray-400">{mediumImpactGaps.length} suggestion{mediumImpactGaps.length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="space-y-3">
                      {mediumImpactGaps.map((gap) => (
                        <SuggestionRow key={gap.id} gap={gap} onAccept={handleAcceptGap} onIgnore={handleIgnoreGap} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Low impact */}
                {lowImpactGaps.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <h3 className="font-display text-[16px] font-bold text-gray-800">Optimisations mineures</h3>
                      <span className="text-[12px] text-gray-400">{lowImpactGaps.length} suggestion{lowImpactGaps.length > 1 ? "s" : ""}</span>
                    </div>
                    <div className="space-y-3">
                      {lowImpactGaps.map((gap) => (
                        <SuggestionRow key={gap.id} gap={gap} onAccept={handleAcceptGap} onIgnore={handleIgnoreGap} />
                      ))}
                    </div>
                  </section>
                )}

                {/* No gaps */}
                {gaps.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-400 text-[15px]">Aucune suggestion générée pour cette analyse.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── EDITOR TAB ─── */}
          {activeTab === "editor" && (
            <div>
              {/* Quick actions bar */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-[18px] font-bold text-gray-800">Éditeur de CV</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDownload}
                    disabled={acceptedGaps.length === 0 || isDownloading}
                    className="px-5 py-2.5 bg-green-500 text-white text-[13px] font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isDownloading ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    )}
                    Télécharger PDF
                  </button>
                </div>
              </div>

              {downloadError && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-600 text-center mb-4">
                  {downloadError}
                </div>
              )}

              <CVEditor
                cvText={cvText}
                gaps={gaps}
                acceptedGaps={acceptedGaps}
                onAccept={handleAcceptGap}
                onIgnore={handleIgnoreGap}
              />
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
