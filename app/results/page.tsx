"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useShallow } from "zustand/react/shallow";
import { usePostHog } from "posthog-js/react";
import { useStore, Gap, JdMatchData, QualitySection } from "@/lib/store";
import type { CVData } from "@/lib/pdf-restructure";
import { ScoreGauge } from "@/components/ScoreGauge";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";
import { PromoModal, usePromoModal } from "@/components/PromoModal";
import InsufficientCreditsModal from "@/components/InsufficientCreditsModal";
import { ResultsOnboarding } from "@/components/ResultsOnboarding";
import { BlurredSuggestion } from "@/components/BlurredSuggestion";
import { cn } from "@/lib/utils";
import { TemplateSelector } from "@/components/TemplateSelector";
import { getTemplate } from "@/lib/cv-templates";

/* ─── Category config matching cvcomp ─── */
const CATEGORY_MAP: Record<string, { label: string; color: string }> = {
  experience: { label: "Impact & Résultats", color: "#f59e0b" },
  competence: { label: "Compétences & Mots-clés", color: "#8b5cf6" },
  titre: { label: "Mise en forme", color: "#3b82f6" },
  accroche: { label: "Clarté & Concision", color: "#10b981" },
  formation: { label: "Formation", color: "#06b6d4" },
};

function getCategoryScore(gaps: Gap[], category: string): number {
  const catGaps = gaps.filter((g) => g.category === category);
  if (catGaps.length === 0) return 85;
  const accepted = catGaps.filter((g) => g.status === "accepted").length;
  const total = catGaps.length;
  return Math.round(40 + (accepted / total) * 60);
}

function getScoreLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: "Excellent", color: "text-green-500" };
  if (score >= 60) return { text: "Bon", color: "text-amber-500" };
  if (score >= 40) return { text: "À améliorer", color: "text-orange-500" };
  return { text: "Critique", color: "text-red-500" };
}

/* ─── Score status badge ─── */
function ScoreStatusBadge({ score }: { score: number }) {
  const { text, color } = getScoreLabel(score);
  return <span className={cn("text-[13px] font-semibold", color)}>{text}</span>;
}

/* ─── Category row with bar + badge ─── */
function CategoryRow({ label, score }: { label: string; score: number }) {
  const { text } = getScoreLabel(score);
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] text-gray-700 flex-shrink-0 min-w-[120px]">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 mx-2">
        <div
          className={cn("h-2 rounded-full transition-all duration-500",
            score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap",
        score >= 80 ? "bg-green-50 text-green-600 border-green-200" :
        score >= 60 ? "bg-amber-50 text-amber-600 border-amber-200" :
        "bg-red-50 text-red-500 border-red-200"
      )}>{text}</span>
      <span className="text-[13px] font-bold text-gray-700 w-[36px] text-right">{score}%</span>
    </div>
  );
}

/* ─── JD Match category config ─── */
const JD_CATEGORY_MAP: Record<string, { label: string }> = {
  keyword_match: { label: "Mots-clés" },
  title_alignment: { label: "Alignement du titre" },
  impact_density: { label: "Densité d'impact" },
  seniority_fit: { label: "Niveau d'expérience" },
  relevancy: { label: "Pertinence" },
};

function getJdScoreLabel(score: number): { text: string; badgeClass: string } {
  if (score >= 75) return { text: "Bon", badgeClass: "bg-green-50 text-green-600 border-green-200" };
  if (score >= 55) return { text: "À améliorer", badgeClass: "bg-amber-50 text-amber-600 border-amber-200" };
  return { text: "Critique", badgeClass: "bg-red-50 text-red-500 border-red-200" };
}

function JdCategoryRow({ label, score }: { label: string; score: number }) {
  const { text, badgeClass } = getJdScoreLabel(score);
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[13px] text-gray-700 flex-shrink-0 min-w-[120px]">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full h-2 mx-2">
        <div
          className={cn("h-2 rounded-full transition-all",
            score >= 75 ? "bg-green-500" : score >= 55 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap", badgeClass)}>
        {text}
      </span>
      <span className="text-[13px] font-bold text-gray-700 w-[36px] text-right">{score}%</span>
    </div>
  );
}

/* ─── JD Match Report Content ─── */
function JdMatchReport({ jdMatch, gaps, onAccept, onIgnore, onApplyInEditor }: {
  jdMatch: JdMatchData;
  gaps: Gap[];
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onApplyInEditor: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Part A: Keyword Gap */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-display text-[18px] font-bold text-gray-900">Partie A : Correspondance (Mots-clés)</h2>
          <p className="text-[13px] text-gray-400 mt-1">Analyse de l&apos;alignement des mots-clés entre votre CV et l&apos;offre d&apos;emploi</p>
        </div>

        {/* Missing Hard Skills Table */}
        {jdMatch.missing_hard_skills.length > 0 && (
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-display text-[15px] font-bold text-gray-800 mb-4">Compétences manquantes</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 text-gray-400 font-semibold uppercase text-[11px] tracking-wider">Compétence</th>
                    <th className="text-center py-2.5 px-3 text-gray-400 font-semibold uppercase text-[11px] tracking-wider">Dans le CV</th>
                    <th className="text-center py-2.5 px-3 text-gray-400 font-semibold uppercase text-[11px] tracking-wider">Mentions offre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jdMatch.missing_hard_skills.map((skill, i) => (
                    <tr key={i}>
                      <td className="py-3 px-3 font-medium text-gray-800">{skill.keyword}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-red-500">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="inline"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-blue-50 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-full">{skill.jd_mentions}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Keyword Frequency Table */}
        {jdMatch.keyword_frequency.length > 0 && (
          <div className="px-6 py-5">
            <h3 className="font-display text-[15px] font-bold text-gray-800 mb-4">Fréquence des mots-clés</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2.5 px-3 text-gray-400 font-semibold uppercase text-[11px] tracking-wider">Mot-clé</th>
                    <th className="text-center py-2.5 px-3 text-gray-400 font-semibold uppercase text-[11px] tracking-wider">Offre</th>
                    <th className="text-center py-2.5 px-3 text-gray-400 font-semibold uppercase text-[11px] tracking-wider">CV</th>
                    <th className="text-center py-2.5 px-3 text-gray-400 font-semibold uppercase text-[11px] tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jdMatch.keyword_frequency.map((kw, i) => (
                    <tr key={i}>
                      <td className="py-3 px-3 font-medium text-gray-800">{kw.keyword}</td>
                      <td className="py-3 px-3 text-center text-gray-600">{kw.jd_count}</td>
                      <td className="py-3 px-3 text-center text-gray-600">{kw.resume_count}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={cn("text-[11px] font-bold px-2.5 py-0.5 rounded-full",
                          kw.status === "matched" ? "bg-green-50 text-green-600" :
                          kw.status === "partial" ? "bg-amber-50 text-amber-600" :
                          "bg-red-50 text-red-500"
                        )}>
                          {kw.status === "matched" ? "Présent" : kw.status === "partial" ? "Partiel" : "Absent"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Part B: Suggestions */}
      <div>
        <h2 className="font-display text-[18px] font-bold text-gray-900 mb-4">Partie B : Suggestions</h2>
        <div className="space-y-4">
          {gaps.map((gap) => (
            <div key={gap.id} className="bg-white rounded-xl border border-gray-200 px-5 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                  gap.impact === "high" ? "bg-red-100 text-red-600" :
                  gap.impact === "medium" ? "bg-amber-100 text-amber-600" :
                  "bg-green-100 text-green-600"
                )}>
                  {gap.impact ?? "info"}
                </span>
                <span className="text-[12px] text-gray-500 font-medium">{gap.section}</span>
              </div>

              {/* Original */}
              <div className="mb-3">
                <p className="text-[11px] text-gray-400 font-medium mb-1">Actuel :</p>
                <div className="bg-red-50 border-l-3 border-red-300 rounded-r-lg px-4 py-2.5">
                  <p className="text-[13px] text-red-700 leading-relaxed">
                    {gap.texte_original || <span className="italic text-red-400">Absent du CV</span>}
                  </p>
                </div>
              </div>

              {/* Suggested */}
              <div className="mb-3">
                <p className="text-[11px] text-gray-400 font-medium mb-1">Suggéré :</p>
                <div className="bg-green-50 border-l-3 border-green-300 rounded-r-lg px-4 py-2.5">
                  <p className="text-[13px] text-green-800 leading-relaxed">
                    <BlurredSuggestion text={gap.texte_suggere} status={gap.status} />
                  </p>
                </div>
              </div>

              <p className="text-[13px] text-gray-500 leading-relaxed mb-3">{gap.raison}</p>

              {gap.status === "pending" && (
                <div className="flex items-center gap-3">
                  <button onClick={() => onApplyInEditor(gap.id)} className="inline-flex items-center gap-1.5 min-h-[48px] px-3 text-[13px] text-blue-500 font-semibold hover:text-blue-600 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Appliquer dans l&apos;éditeur
                  </button>
                  <button onClick={() => onAccept(gap.id)} className="inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2 text-[14px] text-green-600 font-semibold bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Accepter
                  </button>
                  <button onClick={() => onIgnore(gap.id)} className="min-h-[48px] px-4 py-2 text-[14px] text-gray-500 font-medium bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    Ignorer
                  </button>
                </div>
              )}
              {gap.status === "accepted" && (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-green-500 font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Appliqué
                </span>
              )}
              {gap.status === "ignored" && (
                <span className="text-[13px] text-gray-400 font-medium">Ignoré</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Quality Section (collapsible) ─── */
function QualitySectionCard({ section, defaultOpen = false }: { section: QualitySection; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const passCount = section.checks.filter((c) => c.status === "pass").length;
  const warnCount = section.checks.filter((c) => c.status === "warning").length;
  const failCount = section.checks.filter((c) => c.status === "fail").length;

  const impactBadgeClass =
    section.impact_label === "HIGH SCORE IMPACT" ? "bg-red-50 text-red-500 border-red-200" :
    section.impact_label === "IMPORTANT" ? "bg-red-50 text-red-500 border-red-200" :
    section.impact_label === "WARNING CHECK" ? "bg-amber-50 text-amber-600 border-amber-200" :
    "bg-blue-50 text-blue-500 border-blue-200";

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? `Masquer ${section.title}` : `Voir ${section.title}`}
        className="w-full text-left px-6 py-5 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-display text-[15px] font-bold text-gray-800">{section.title}</h3>
            <span className={cn("text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wide", impactBadgeClass)}>
              {section.impact_label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {passCount > 0 && (
              <span className="flex items-center gap-1 text-[12px] text-green-500 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                {passCount}
              </span>
            )}
            {failCount > 0 && (
              <span className="flex items-center gap-1 text-[12px] text-red-500 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                {failCount}
              </span>
            )}
            {warnCount > 0 && (
              <span className="flex items-center gap-1 text-[12px] text-amber-500 font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                {warnCount}
              </span>
            )}
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={cn("text-gray-400 transition-transform", open && "rotate-180")}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <p className="text-[13px] text-gray-500 mt-1">{section.description}</p>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          {/* Tip banner */}
          {section.tip && (
            <div className="mx-6 mt-4 mb-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <p className="text-[13px] text-blue-700 leading-relaxed">Conseil : {section.tip}</p>
            </div>
          )}

          {/* Checks */}
          <div className="divide-y divide-gray-100 px-6 pb-4">
            {section.checks.map((check, i) => (
              <div key={i} className="py-4 flex items-start gap-3">
                {check.status === "pass" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
                ) : check.status === "fail" ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="flex-shrink-0 mt-0.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" className="flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                )}
                <div>
                  <p className="text-[14px] font-semibold text-gray-800">{check.title}</p>
                  <p className="text-[13px] text-gray-500 leading-relaxed mt-0.5">{check.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── JD Quality Report ─── */
function JdQualityReport({ qualitySections }: { qualitySections: QualitySection[] }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>
          <div>
            <h2 className="font-display text-[18px] font-bold text-gray-900">
              Partie B : Qualité contextuelle
              <span className="ml-2 text-[11px] font-bold bg-purple-100 text-purple-600 rounded-full px-2.5 py-0.5 uppercase">Premium</span>
            </h2>
            <p className="text-[13px] text-gray-400 mt-0.5">Vérifications avancées analysant la correspondance contextuelle de votre CV avec le poste.</p>
          </div>
        </div>
      </div>

      {qualitySections.map((section, i) => (
        <QualitySectionCard key={i} section={section} defaultOpen={i === 0} />
      ))}
    </div>
  );
}

/* ─── Collapsible category section ─── */
function CategorySection({
  label,
  impactLabel,
  gaps,
  onAccept,
  onIgnore,
  onApplyInEditor,
  defaultOpen = false,
}: {
  label: string;
  impactLabel: string;
  gaps: Gap[];
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onApplyInEditor: (id: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const okCount = gaps.filter((g) => g.status === "accepted").length;
  const warnCount = gaps.filter((g) => g.status !== "accepted").length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? `Masquer ${label}` : `Voir ${label}`}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-display text-[15px] font-bold text-gray-800">{label}</h3>
          <span className={cn("text-[11px] font-semibold px-2.5 py-0.5 rounded-full border uppercase tracking-wide",
            impactLabel === "IMPORTANT" ? "bg-red-50 text-red-500 border-red-200" :
            "bg-amber-50 text-amber-600 border-amber-200"
          )}>{impactLabel}</span>
        </div>
        <div className="flex items-center gap-3">
          {okCount > 0 && (
            <span className="flex items-center gap-1 text-[12px] text-green-500 font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
              {okCount}
            </span>
          )}
          {warnCount > 0 && (
            <span className="flex items-center gap-1 text-[12px] text-amber-500 font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              {warnCount}
            </span>
          )}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={cn("text-gray-400 transition-transform", open && "rotate-180")}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 divide-y divide-gray-100">
          {gaps.map((gap) => (
            <div key={gap.id} className="px-5 py-5">
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-amber-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </span>
                <span className="text-[12px] text-gray-500 font-medium">{gap.section}</span>
              </div>

              {/* Original */}
              <div className="mb-3">
                <p className="text-[11px] text-gray-400 font-medium mb-1">Actuel :</p>
                <div className="bg-red-50 border-l-3 border-red-300 rounded-r-lg px-4 py-2.5">
                  <p className="text-[13px] text-red-700 leading-relaxed">
                    {gap.texte_original || <span className="italic text-red-400">Absent du CV</span>}
                  </p>
                </div>
              </div>

              {/* Suggested */}
              <div className="mb-3">
                <p className="text-[11px] text-gray-400 font-medium mb-1">Suggéré :</p>
                <div className="bg-green-50 border-l-3 border-green-300 rounded-r-lg px-4 py-2.5">
                  <p className="text-[13px] text-green-800 leading-relaxed">
                    <BlurredSuggestion text={gap.texte_suggere} status={gap.status} />
                  </p>
                </div>
              </div>

              {/* Reason */}
              <p className="text-[13px] text-gray-500 leading-relaxed mb-3">{gap.raison}</p>

              {/* Actions */}
              {gap.status === "pending" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onApplyInEditor(gap.id)}
                    className="inline-flex items-center gap-1.5 min-h-[48px] px-3 text-[13px] text-blue-500 font-semibold hover:text-blue-600 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Appliquer dans l&apos;éditeur
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                  <button
                    onClick={() => onAccept(gap.id)}
                    className="inline-flex items-center gap-1.5 min-h-[48px] px-4 py-2 text-[14px] text-green-600 font-semibold bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Accepter
                  </button>
                  <button
                    onClick={() => onIgnore(gap.id)}
                    className="min-h-[48px] px-4 py-2 text-[14px] text-gray-500 font-medium bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Ignorer
                  </button>
                </div>
              )}
              {gap.status === "accepted" && (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-green-500 font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Appliqué
                </span>
              )}
              {gap.status === "ignored" && (
                <span className="text-[13px] text-gray-400 font-medium">Ignoré</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Inline Editable Field ─── */
function InlineField({
  value,
  onSave,
  className,
  placeholder,
  multiline = false,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && ref.current) ref.current.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim() !== value) onSave(draft.trim());
  };

  if (editing) {
    const cls = "w-full bg-white border border-blue-300 rounded px-2 py-1 text-base focus:outline-none focus:ring-2 focus:ring-blue-400";
    return multiline ? (
      <textarea ref={ref as React.RefObject<HTMLTextAreaElement>} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit(); } }} rows={3} className={cn(cls, "resize-none", className)} />
    ) : (
      <input ref={ref as React.RefObject<HTMLInputElement>} value={draft} onChange={(e) => setDraft(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") commit(); }} className={cn(cls, className)} placeholder={placeholder} />
    );
  }

  return (
    <span onClick={() => setEditing(true)} className={cn("cursor-text rounded-sm transition-all group relative inline border border-transparent hover:border-dashed hover:border-gray-300", className)}>
      {value || <span className="text-gray-300 italic">{placeholder ?? "Cliquez pour éditer"}</span>}
      <span className="opacity-0 group-hover:opacity-60 ml-1 text-gray-400 text-[11px] inline-block align-middle">&#9998;</span>
    </span>
  );
}

/* ─── Add Button ─── */
function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 min-h-[48px] text-[14px] text-green-600 hover:text-green-700 font-medium mt-2 transition-colors">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      {label}
    </button>
  );
}

/* ─── Delete Button ─── */
function DeleteBtn({ onClick, size = "sm" }: { onClick: () => void; size?: "sm" | "md" }) {
  return (
    <button onClick={onClick} className={cn("text-gray-300 hover:text-red-500 transition-colors flex-shrink-0", size === "md" ? "p-1" : "")}>
      <svg width={size === "md" ? 16 : 12} height={size === "md" ? 16 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </button>
  );
}

/* ─── Section title ─── */
function SectionTitle({ title, color = "#16a34a" }: { title: string; color?: string }) {
  return (
    <div className="mt-6 mb-2 first:mt-0">
      <h2 className="text-[12px] font-bold uppercase tracking-[0.2em] pb-1.5 inline-block" style={{ color, borderBottom: `2px solid ${color}` }}>{title}</h2>
    </div>
  );
}

/* ─── Photo Upload ─── */
const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB
function PhotoUpload({ photo, onUpdate }: { photo?: string; onUpdate: (photo: string | null) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format accepté : JPG, PNG ou WebP");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setError("Image trop lourde (max 2MB)");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => onUpdate(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (photo) {
    return (
      <div className="relative group/photo flex-shrink-0">
        <div className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-white/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="Photo" className="w-full h-full object-cover" />
        </div>
        {/* Hover overlay */}
        <div
          className="absolute inset-0 w-[72px] h-[72px] rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
        </div>
        {/* Delete button */}
        <button
          onClick={() => onUpdate(null)}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] opacity-0 group-hover/photo:opacity-100 transition-opacity hover:bg-red-600"
        >
          &times;
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
      </div>
    );
  }

  return (
    <div className="flex-shrink-0 relative">
      <div
        className="w-[72px] h-[72px] rounded-full border-2 border-dashed border-gray-500 flex flex-col items-center justify-center cursor-pointer hover:border-gray-300 transition-colors"
        onClick={() => fileRef.current?.click()}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        <span className="text-[8px] text-gray-500 mt-0.5">Photo</span>
      </div>
      {showTooltip && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[200px] bg-gray-800 text-[10px] text-gray-300 rounded-lg px-3 py-2 shadow-lg z-10 leading-relaxed">
          La photo n&apos;est pas obligatoire en France et peut cr&eacute;er des biais de recrutement. Elle est stock&eacute;e uniquement en m&eacute;moire locale.
        </div>
      )}
      {error && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-red-600 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-10">
          {error}
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
    </div>
  );
}

/* ─── Suggestion Feedback (thumbs up/down) ─── */
function SuggestionFeedback({ gapId, section, category }: { gapId: string; section?: string; category?: string }) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const send = (type: "up" | "down") => {
    if (feedback === type) return;
    setFeedback(type);
    fetch("/api/suggestion-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gap_id: gapId, feedback: type, section, category }),
    }).catch(() => {});
  };

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <button
        onClick={() => send("up")}
        className={cn("p-1.5 rounded-lg transition-colors", feedback === "up" ? "bg-green-100 text-green-600" : "text-gray-300 hover:text-green-500 hover:bg-green-50")}
        title="Bonne suggestion"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
      </button>
      <button
        onClick={() => send("down")}
        className={cn("p-1.5 rounded-lg transition-colors", feedback === "down" ? "bg-red-100 text-red-500" : "text-gray-300 hover:text-red-500 hover:bg-red-50")}
        title="Mauvaise suggestion"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" /></svg>
      </button>
    </div>
  );
}

/* ─── Suggestion Panel (right side, like cvcomp) ─── */
function SuggestionPanel({
  gaps,
  currentIndex,
  onNavigate,
  onAccept,
  onIgnore,
  onAcceptAll,
}: {
  gaps: Gap[];
  currentIndex: number;
  onNavigate: (idx: number) => void;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onAcceptAll: () => void;
}) {
  const pendingGaps = gaps.filter((g) => g.status === "pending");
  const current = pendingGaps[currentIndex];

  if (pendingGaps.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p className="text-[15px] font-semibold text-gray-800">Toutes les suggestions ont été traitées</p>
        <p className="text-[13px] text-gray-400 mt-1">Vous pouvez continuer à éditer votre CV manuellement.</p>
      </div>
    );
  }

  if (!current) return null;

  const sectionLabel = current.section || CATEGORY_MAP[current.category ?? ""]?.label || "Suggestion";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Quick Fix — Accept All */}
      <div className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 border-b border-green-600">
        <button onClick={onAcceptAll} className="w-full flex items-center justify-center gap-2 py-2.5 min-h-[48px] bg-white/20 hover:bg-white/30 rounded-xl text-white text-[14px] font-bold transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          Tout accepter ({pendingGaps.length} suggestions)
        </button>
      </div>

      {/* Header with counter */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-gray-700">{currentIndex + 1} sur {pendingGaps.length}</span>
        <div className="flex items-center gap-1">
          <button onClick={() => onNavigate(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15" /></svg>
          </button>
          <button onClick={() => onNavigate(Math.min(pendingGaps.length - 1, currentIndex + 1))} disabled={currentIndex === pendingGaps.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
          </button>
        </div>
      </div>

      {/* Section label */}
      <div className="px-5 pt-4">
        <span className={cn("text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
          current.impact === "high" ? "bg-red-50 text-red-500" : current.impact === "medium" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-500"
        )}>{sectionLabel}</span>
      </div>

      {/* Current text */}
      <div className="px-5 pt-3">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Actuel</p>
        <p className="text-[13px] text-red-600 line-through leading-relaxed bg-red-50 rounded px-3 py-2">
          {current.texte_original || <span className="italic no-underline text-gray-400">Absent du CV</span>}
        </p>
      </div>

      {/* Suggested text */}
      <div className="px-5 pt-3">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Suggéré</p>
        <p className="text-[13px] text-green-700 leading-relaxed bg-green-50 rounded px-3 py-2">
          <BlurredSuggestion text={current.texte_suggere} status={current.status} />
        </p>
      </div>

      {/* Reason + Feedback */}
      <div className="px-5 pt-2 pb-4 flex items-start justify-between gap-3">
        <p className="text-[12px] text-gray-400 italic leading-relaxed flex-1">{current.raison}</p>
        <SuggestionFeedback gapId={current.id} section={current.section} category={current.category} />
      </div>

      {/* Actions */}
      <div className="flex border-t border-gray-100">
        <button onClick={() => onIgnore(current.id)} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 min-h-[48px] text-[14px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors border-r border-gray-100">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          Rejeter
        </button>
        <button onClick={() => onAccept(current.id)} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3 min-h-[48px] text-[14px] font-semibold text-green-600 hover:bg-green-50 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
          Accepter
        </button>
      </div>

      {/* Keyboard hint */}
      <div className="px-5 py-2 bg-gray-50 border-t border-gray-100 text-center">
        <span className="text-[11px] text-gray-400"><kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">Tab</kbd> Accepter &middot; <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">Esc</kbd> Rejeter</span>
      </div>
    </div>
  );
}

/* ─── Editable CV Document (full inline editing) ─── */
function CVDocumentEditable({
  cvJson,
  gaps,
  onUpdate,
  templateId = "modern",
}: {
  cvJson: CVData;
  gaps: Gap[];
  onUpdate: (updated: CVData) => void;
  templateId?: string;
}) {
  const tpl = getTemplate(templateId);
  const isLightHeader = ["#ffffff", "#faf5ff", "#f0f9ff", "#f1f5f9"].includes(tpl.colors.headerBg);
  const pendingGaps = useMemo(() => gaps.filter((g) => g.status === "pending"), [gaps]);
  const acceptedGaps = useMemo(() => gaps.filter((g) => g.status === "accepted"), [gaps]);

  const hasGap = (text: string) =>
    pendingGaps.some((g) => {
      const orig = g.texte_original?.trim();
      return orig && text.includes(orig);
    });

  const wasAccepted = (text: string) =>
    acceptedGaps.some((g) => {
      const sugg = g.texte_suggere?.trim();
      return sugg && text.includes(sugg);
    });

  const cv = cvJson;

  const updateField = (field: string, value: string) => onUpdate({ ...cv, [field]: value });
  const updateContact = (field: string, value: string) =>
    onUpdate({ ...cv, contact: { ...cv.contact, [field]: value } });

  const updateExperience = (idx: number, field: string, value: string) => {
    const exps = cv.experiences.map((e, i) => (i === idx ? { ...e, [field]: value } : e));
    onUpdate({ ...cv, experiences: exps });
  };
  const updateMission = (ei: number, mi: number, value: string) => {
    const exps = cv.experiences.map((e, i) => {
      if (i !== ei) return e;
      const missions = e.missions.map((m, j) => (j === mi ? value : m));
      return { ...e, missions };
    });
    onUpdate({ ...cv, experiences: exps });
  };
  const addMission = (ei: number) => {
    const exps = cv.experiences.map((e, i) =>
      i === ei ? { ...e, missions: [...e.missions, "Nouvelle mission"] } : e
    );
    onUpdate({ ...cv, experiences: exps });
  };
  const removeMission = (ei: number, mi: number) => {
    const exps = cv.experiences.map((e, i) => {
      if (i !== ei) return e;
      return { ...e, missions: e.missions.filter((_, j) => j !== mi) };
    });
    onUpdate({ ...cv, experiences: exps });
  };
  const addExperience = () =>
    onUpdate({ ...cv, experiences: [...cv.experiences, { poste: "Nouveau poste", missions: [] }] });
  const removeExperience = (idx: number) =>
    onUpdate({ ...cv, experiences: cv.experiences.filter((_, i) => i !== idx) });

  const updateFormation = (idx: number, field: string, value: string) => {
    const fms = cv.formation.map((f, i) => (i === idx ? { ...f, [field]: value } : f));
    onUpdate({ ...cv, formation: fms });
  };
  const addFormation = () =>
    onUpdate({ ...cv, formation: [...cv.formation, { diplome: "Nouveau diplôme" }] });
  const removeFormation = (idx: number) =>
    onUpdate({ ...cv, formation: cv.formation.filter((_, i) => i !== idx) });

  const updateCompetence = (idx: number, value: string) => {
    const comps = cv.competences.map((c, i) => (i === idx ? value : c));
    onUpdate({ ...cv, competences: comps });
  };
  const addCompetence = () =>
    onUpdate({ ...cv, competences: [...cv.competences, "Nouvelle compétence"] });
  const removeCompetence = (idx: number) =>
    onUpdate({ ...cv, competences: cv.competences.filter((_, i) => i !== idx) });

  const updateCentreInteret = (idx: number, value: string) => {
    const ci = cv.centres_interet.map((c, i) => (i === idx ? value : c));
    onUpdate({ ...cv, centres_interet: ci });
  };
  const addCentreInteret = () =>
    onUpdate({ ...cv, centres_interet: [...cv.centres_interet, "Nouveau centre d'intérêt"] });
  const removeCentreInteret = (idx: number) =>
    onUpdate({ ...cv, centres_interet: cv.centres_interet.filter((_, i) => i !== idx) });

  const updateInformation = (idx: number, value: string) => {
    const infos = cv.informations.map((inf, i) => (i === idx ? value : inf));
    onUpdate({ ...cv, informations: infos });
  };
  const addInformation = () =>
    onUpdate({ ...cv, informations: [...cv.informations, "Nouvelle information"] });
  const removeInformation = (idx: number) =>
    onUpdate({ ...cv, informations: cv.informations.filter((_, i) => i !== idx) });

  const GapField = ({
    value,
    onSave,
    className,
    placeholder,
    multiline,
  }: {
    value: string;
    onSave: (v: string) => void;
    className?: string;
    placeholder?: string;
    multiline?: boolean;
  }) => (
    <span className={hasGap(value) ? "bg-amber-100/60 rounded" : wasAccepted(value) ? "bg-green-100/60 rounded" : ""}>
      <InlineField
        value={value}
        onSave={onSave}
        className={className}
        placeholder={placeholder}
        multiline={multiline}
      />
    </span>
  );

  return (
    <div
      className="w-full max-w-[794px] mx-auto bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] border border-gray-200 overflow-hidden"
      style={{ minHeight: 600 }}
    >
      {/* Header — styled by template */}
      <div className="px-10 py-7" style={{ backgroundColor: tpl.colors.headerBg }}>
        <div className="flex items-start gap-6">
          {/* Left: name + contact */}
          <div className="flex-1 min-w-0" style={{ color: tpl.colors.headerBg === "#ffffff" || tpl.colors.headerBg === "#faf5ff" || tpl.colors.headerBg === "#f0f9ff" ? tpl.colors.heading : tpl.colors.heading === "#111827" ? "#ffffff" : tpl.colors.heading }}>
            <GapField
              value={cv.nom}
              onSave={(v) => updateField("nom", v)}
              className="text-[24px] font-bold tracking-tight leading-tight"
            />
          </div>
          {/* Right: photo */}
          <PhotoUpload
            photo={cv.photo}
            onUpdate={(photo) => onUpdate({ ...cv, photo: photo ?? undefined })}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3">
          <span className={`flex items-center gap-1.5 text-[12px] ${isLightHeader ? "text-gray-500" : "text-gray-400"}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <InlineField
              value={cv.contact?.email ?? ""}
              onSave={(v) => updateContact("email", v)}
              className="text-[12px] text-gray-400"
              placeholder="Email"
            />
          </span>
          <span className={`flex items-center gap-1.5 text-[12px] ${isLightHeader ? "text-gray-500" : "text-gray-400"}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.64.32 1.26.56 1.85l.04.1c.16.39.08.84-.2 1.16L8.09 9.91a16 16 0 006 6l1.27-1.27c.32-.28.77-.36 1.16-.2l.1.04c.59.24 1.21.43 1.85.56A2 2 0 0120 16.92v3z" />
            </svg>
            <InlineField
              value={cv.contact?.telephone ?? ""}
              onSave={(v) => updateContact("telephone", v)}
              className="text-[12px] text-gray-400"
              placeholder="Téléphone"
            />
          </span>
          <span className={`flex items-center gap-1.5 text-[12px] ${isLightHeader ? "text-gray-500" : "text-gray-400"}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <InlineField
              value={cv.contact?.ville ?? ""}
              onSave={(v) => updateContact("ville", v)}
              className="text-[12px] text-gray-400"
              placeholder="Ville"
            />
          </span>
          <span className={`flex items-center gap-1.5 text-[12px] ${isLightHeader ? "text-gray-500" : "text-gray-400"}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <InlineField
              value={cv.contact?.linkedin ?? ""}
              onSave={(v) => updateContact("linkedin", v)}
              className="text-[12px] text-gray-400"
              placeholder="Ajouter LinkedIn"
            />
          </span>
        </div>
      </div>

      {/* CV Body */}
      <div className="px-10 py-8">
        {/* Profil */}
        <SectionTitle title="Profil" color={tpl.colors.primary} />
        <GapField
          value={cv.profil ?? ""}
          onSave={(v) => updateField("profil", v)}
          multiline
          className="text-[13px] text-[#111827] leading-[1.7]"
          placeholder="Résumé professionnel"
        />

        {/* Expériences */}
        {cv.experiences.length > 0 && <SectionTitle title="Expérience professionnelle" color={tpl.colors.primary} />}
        {cv.experiences.map((exp, ei) => (
          <div key={ei} className="mb-4 group/exp relative">
            <div className="absolute -left-6 top-3 opacity-0 group-hover/exp:opacity-100 transition-opacity">
              <DeleteBtn onClick={() => removeExperience(ei)} size="md" />
            </div>
            <div className="flex items-baseline justify-between mt-3 mb-0.5">
              <GapField
                value={exp.poste}
                onSave={(v) => updateExperience(ei, "poste", v)}
                className="text-[14px] font-bold text-[#111827]"
              />
              <InlineField
                value={exp.periode ?? ""}
                onSave={(v) => updateExperience(ei, "periode", v)}
                className="text-[12px] text-gray-500 flex-shrink-0 ml-4 italic"
                placeholder="Période"
              />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <InlineField
                value={exp.entreprise ?? ""}
                onSave={(v) => updateExperience(ei, "entreprise", v)}
                className="text-[13px] text-gray-500 italic"
                placeholder="Entreprise"
              />
              {(exp.entreprise || exp.lieu) && <span className="text-gray-400">&mdash;</span>}
              <InlineField
                value={exp.lieu ?? ""}
                onSave={(v) => updateExperience(ei, "lieu", v)}
                className="text-[13px] text-gray-500 italic"
                placeholder="Lieu"
              />
            </div>
            {exp.missions.map((mission, mi) => (
              <div key={mi} className="flex items-start gap-2 pl-2 mb-1 group/mission">
                <span className="mt-[7px] text-[5px] flex-shrink-0" style={{ color: tpl.colors.primary }}>&#9679;</span>
                <GapField
                  value={mission}
                  onSave={(v) => updateMission(ei, mi, v)}
                  className="text-[13px] text-[#111827] leading-[1.7] flex-1"
                />
                <span className="opacity-0 group-hover/mission:opacity-100 transition-opacity mt-1">
                  <DeleteBtn onClick={() => removeMission(ei, mi)} />
                </span>
              </div>
            ))}
            <AddButton label="Ajouter une mission" onClick={() => addMission(ei)} />
          </div>
        ))}
        <AddButton label="Ajouter une expérience" onClick={addExperience} />

        {/* Formation */}
        {cv.formation.length > 0 && <SectionTitle title="Formation" color={tpl.colors.primary} />}
        {cv.formation.map((f, fi) => (
          <div key={fi} className="mb-2 group/form relative">
            <div className="absolute -left-6 top-3 opacity-0 group-hover/form:opacity-100 transition-opacity">
              <DeleteBtn onClick={() => removeFormation(fi)} size="md" />
            </div>
            <div className="flex items-baseline justify-between mt-3 mb-0.5">
              <InlineField
                value={f.diplome}
                onSave={(v) => updateFormation(fi, "diplome", v)}
                className="text-[14px] font-bold text-[#111827]"
              />
              <InlineField
                value={f.periode ?? ""}
                onSave={(v) => updateFormation(fi, "periode", v)}
                className="text-[12px] text-gray-500 flex-shrink-0 ml-4 italic"
                placeholder="Période"
              />
            </div>
            <InlineField
              value={f.etablissement ?? ""}
              onSave={(v) => updateFormation(fi, "etablissement", v)}
              className="text-[13px] text-gray-500 italic"
              placeholder="Établissement"
            />
          </div>
        ))}
        <AddButton label="Ajouter une formation" onClick={addFormation} />

        {/* Compétences */}
        <SectionTitle title="Compétences" color={tpl.colors.primary} />
        <div className="flex flex-wrap gap-2 mt-1">
          {cv.competences.map((c, ci) => (
            <span key={ci} className="flex items-center gap-1 bg-gray-100 rounded px-2.5 py-1 group/comp">
              <GapField
                value={c}
                onSave={(v) => updateCompetence(ci, v)}
                className="text-[13px] text-[#111827]"
              />
              <span className="opacity-0 group-hover/comp:opacity-100 transition-opacity">
                <DeleteBtn onClick={() => removeCompetence(ci)} />
              </span>
            </span>
          ))}
        </div>
        <AddButton label="Ajouter une compétence" onClick={addCompetence} />

        {/* Centres d'intérêt */}
        {cv.centres_interet.length > 0 && (
          <>
            <SectionTitle title="Centres d&apos;intérêt" color={tpl.colors.primary} />
            <div className="flex flex-wrap gap-2 mt-1">
              {cv.centres_interet.map((c, ci) => (
                <span key={ci} className="flex items-center gap-1 group/ci">
                  <InlineField
                    value={c}
                    onSave={(v) => updateCentreInteret(ci, v)}
                    className="text-[13px] text-[#111827]"
                  />
                  <span className="opacity-0 group-hover/ci:opacity-100 transition-opacity">
                    <DeleteBtn onClick={() => removeCentreInteret(ci)} />
                  </span>
                  {ci < cv.centres_interet.length - 1 && <span className="text-gray-400 mx-1">&middot;</span>}
                </span>
              ))}
            </div>
            <AddButton label="Ajouter un centre d&apos;intérêt" onClick={addCentreInteret} />
          </>
        )}

        {/* Informations */}
        {cv.informations.length > 0 && (
          <>
            <SectionTitle title="Informations" color={tpl.colors.primary} />
            {cv.informations.map((info, ii) => (
              <div key={ii} className="flex items-start gap-2 mb-0.5 group/info">
                <InlineField
                  value={info}
                  onSave={(v) => updateInformation(ii, v)}
                  className="text-[13px] text-[#111827] leading-[1.7]"
                />
                <span className="opacity-0 group-hover/info:opacity-100 transition-opacity mt-1">
                  <DeleteBtn onClick={() => removeInformation(ii)} />
                </span>
              </div>
            ))}
            <AddButton label="Ajouter une information" onClick={addInformation} />
          </>
        )}
      </div>
    </div>
  );
}

/* ─── CV Editor With Suggestion Panel ─── */
function CVEditorWithPanel({
  cvJson,
  gaps,
  onUpdate,
  onAccept,
  onIgnore,
  onAcceptAll,
  onDownload,
  isDownloading,
  downloadError,
  templateId,
}: {
  cvJson: CVData;
  gaps: Gap[];
  onUpdate: (updated: CVData) => void;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onAcceptAll: () => void;
  onDownload: () => void;
  isDownloading: boolean;
  downloadError: string | null;
  templateId?: string;
}) {
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const pendingGaps = useMemo(() => gaps.filter((g) => g.status === "pending"), [gaps]);

  // acceptGap in store now applies text changes to cvJson automatically
  const handleAccept = (id: string) => {
    onAccept(id);
  };

  const handleAcceptAll = () => {
    onAcceptAll();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const current = pendingGaps[suggestionIdx];
      if (!current) return;
      if (e.key === "Tab") {
        e.preventDefault();
        handleAccept(current.id);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onIgnore(current.id);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div>
      {/* Download bar */}
      <div className="flex items-center justify-end mb-4">
        <button
          onClick={onDownload}
          disabled={isDownloading}
          className="px-5 py-2.5 min-h-[48px] bg-gray-900 text-white text-[13px] font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isDownloading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          Télécharger PDF
        </button>
      </div>

      {downloadError && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-[13px] text-red-600 text-center mb-4">
          {downloadError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 max-h-[85vh] overflow-y-auto pb-4">
          <CVDocumentEditable cvJson={cvJson} gaps={gaps} onUpdate={onUpdate} templateId={templateId} />
        </div>
        <div className="md:col-span-5 md:sticky md:top-0 md:self-start">
          <SuggestionPanel
            gaps={gaps}
            currentIndex={suggestionIdx}
            onNavigate={setSuggestionIdx}
            onAccept={handleAccept}
            onIgnore={onIgnore}
            onAcceptAll={handleAcceptAll}
          />
        </div>
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

  const { cvText, gaps, score_avant, scoreActuel, resume, jobTitle, acceptGap, ignoreGap, analysisType, jdMatch, cvJson, setCvJson } = useStore(
    useShallow((s) => ({
      cvText: s.cvText,
      gaps: s.gaps,
      score_avant: s.score_avant,
      scoreActuel: s.scoreActuel,
      resume: s.resume,
      jobTitle: s.jobTitle,
      acceptGap: s.acceptGap,
      ignoreGap: s.ignoreGap,
      analysisType: s.analysisType,
      jdMatch: s.jdMatch,
      cvJson: s.cvJson,
      setCvJson: s.setCvJson,
    }))
  );
  const isJdMatch = analysisType === "jd" && jdMatch !== null;

  const [activeTab, setActiveTab] = useState<"report" | "editor">("report");
  const [reportSubTab, setReportSubTab] = useState<"match" | "quality">("match");
  const [isDownloading, setIsDownloading] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState("modern");
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const promo = usePromoModal();

  // Check if user has premium access (for template lock)
  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => setIsPremiumUser(d.unlimited === true || d.plan === "starter" || d.plan === "pro"))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (gaps.length === 0 && score_avant === 0) router.push("/analyze");
  }, [gaps.length, score_avant, router]);

  // Warn user before closing/refreshing tab if they have pending work
  useEffect(() => {
    const hasWork = gaps.length > 0;
    if (!hasWork) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [gaps.length]);

  // Lazy-load CV JSON structure if not available yet
  useEffect(() => {
    if (!cvJson && cvText) {
      fetch("/api/restructure-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText }),
      })
        .then((r) => r.json())
        .then((d) => { if (d.cv_json) setCvJson(d.cv_json); })
        .catch(() => {});
    }
  }, [cvJson, cvText, setCvJson]);

  const pendingGaps = useMemo(() => gaps.filter((g) => g.status === "pending"), [gaps]);
  const acceptedGaps = useMemo(() => gaps.filter((g) => g.status === "accepted"), [gaps]);
  const ignoredGaps = useMemo(() => gaps.filter((g) => g.status === "ignored"), [gaps]);

  // Category scores
  const categories = useMemo(() => {
    const cats = new Set(gaps.map((g) => g.category).filter(Boolean));
    return Array.from(cats).map((cat) => ({
      key: cat!,
      ...(CATEGORY_MAP[cat!] ?? { label: cat!, color: "#6b7280" }),
      score: getCategoryScore(gaps, cat!),
    }));
  }, [gaps]);

  // Group gaps by category for report sections
  const gapsByCategory = useMemo(() => {
    const map = new Map<string, Gap[]>();
    for (const gap of gaps) {
      const cat = gap.category ?? "other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(gap);
    }
    return map;
  }, [gaps]);

  // Quick summary: split resume into critical fixes and quick wins
  const { criticalFixes, quickWins } = useMemo(() => {
    if (!resume) return { criticalFixes: [], quickWins: [] };
    const lines = resume.split("\n").map((l) => l.replace(/^[-•]\s*/, "").trim()).filter(Boolean);
    const mid = Math.ceil(lines.length / 2);
    return {
      criticalFixes: lines.slice(0, mid),
      quickWins: lines.slice(mid),
    };
  }, [resume]);

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

  const handleAcceptAll = () => {
    for (const gap of pendingGaps) {
      acceptGap(gap.id);
    }
    posthog?.capture("suggestions_accept_all", { count: pendingGaps.length });
  };

  const handleApplyInEditor = (id: string) => {
    handleAcceptGap(id);
    setActiveTab("editor");
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

      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvJson, cvText, analysisId: savedId, templateId }),
      });

      if (res.status === 402) {
        setShowCreditsModal(true);
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

  const handlePreview = async () => {
    setIsPreviewing(true);
    setDownloadError(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    try {
      // If cvJson not ready yet, restructure on the fly
      let jsonData = cvJson;
      if (!jsonData && cvText) {
        const restructRes = await fetch("/api/restructure-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cvText }),
        });
        if (restructRes.ok) {
          const d = await restructRes.json();
          if (d.cv_json) {
            jsonData = d.cv_json;
            setCvJson(d.cv_json);
          }
        }
      }

      if (!jsonData) {
        setDownloadError("Le CV n'a pas pu être structuré. Réessayez dans quelques secondes.");
        return;
      }

      const res = await fetch("/api/preview-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvJson: jsonData, templateId }),
      });
      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("json")) {
          const err = await res.json().catch(() => ({ error: "Erreur aperçu" }));
          setDownloadError(err.error ?? "Erreur lors de la génération de l'aperçu");
        } else {
          setDownloadError(`Erreur serveur (${res.status})`);
        }
        return;
      }
      const blob = await res.blob();
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setIsPreviewing(false);
    }
  };

  if (!cvText) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#f8f9fb]">
        <AppHeader />

        {/* ─── Top tab bar ─── */}
        <div className="bg-white border-b border-gray-200 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => router.push("/analyze")}
              className="flex items-center gap-1.5 min-h-[44px] px-2 text-[14px] text-gray-400 hover:text-gray-600 mr-2 sm:mr-4 transition-colors shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              <span className="hidden sm:inline">Retour</span>
            </button>

            <button
              onClick={() => setActiveTab("report")}
              className={cn(
                "flex items-center gap-1 px-5 py-2.5 min-h-[48px] rounded-xl text-[14px] font-semibold transition-all border-2 cursor-pointer",
                activeTab === "report"
                  ? "bg-white border-gray-300 shadow-sm text-gray-900"
                  : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"
              )}
            >
              <span className="flex flex-col">
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
                  Rapport CV
                </span>
                <span className="text-[11px] text-gray-400 font-normal block">Score & Analyse</span>
              </span>
            </button>
            {/* Match/Quality sub-tabs for JD mode */}
            {isJdMatch && activeTab === "report" && (
              <div className="flex items-center gap-1 ml-1">
                <button
                  onClick={() => { setActiveTab("report"); setReportSubTab("match"); }}
                  className={cn("px-3 py-1.5 min-h-[36px] rounded-lg text-[12px] font-semibold transition-all",
                    reportSubTab === "match"
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Correspondance
                </button>
                <button
                  onClick={() => { setActiveTab("report"); setReportSubTab("quality"); }}
                  className={cn("px-3 py-1.5 min-h-[36px] rounded-lg text-[12px] font-semibold transition-all",
                    reportSubTab === "quality"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  Qualité
                </button>
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setActiveTab("editor")}
                className={cn(
                  "px-5 py-2.5 min-h-[48px] rounded-xl text-[14px] font-semibold transition-all border-2 cursor-pointer",
                  activeTab === "editor"
                    ? "bg-white border-gray-300 shadow-sm text-gray-900"
                    : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"
                )}
              >
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Éditeur CV
                </span>
                <span className="text-[11px] text-gray-400 font-normal block">Modifier & Corriger</span>
              </button>
              {pendingGaps.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingGaps.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ─── Gamified progress bar ─── */}
        {(() => {
          const total = gaps.length || 1;
          const treated = acceptedGaps.length + ignoredGaps.length;
          const pct = Math.round((treated / total) * 100);
          const allDone = pendingGaps.length === 0 && gaps.length > 0;
          return (
            <div className="bg-white border-b border-gray-100 py-3">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3 text-[13px]">
                    <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      Analyse
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    <span className={cn("font-semibold", allDone ? "text-green-600" : "text-amber-500")}>
                      {allDone ? "Suggestions ✓" : `${treated}/${total} traitées`}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    <span className={cn("font-semibold", allDone && acceptedGaps.length > 0 ? "text-gray-900" : "text-gray-300")}>
                      Télécharger
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-[13px]">
                    <span className="font-bold text-gray-900">{scoreActuel}/100</span>
                    {scoreActuel > score_avant && (
                      <span className="text-green-600 font-semibold text-[12px]">+{scoreActuel - score_avant} pts</span>
                    )}
                  </div>
                </div>
                {/* Animated progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500 ease-out",
                      allDone ? "bg-green-500" : "bg-amber-400"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─── Sticky mobile score counter (below header at 60px) ─── */}
        <div className="sm:hidden sticky top-[60px] z-30 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
          <span className="text-[14px] font-bold text-gray-900">Score : {scoreActuel}/100</span>
          <div className="flex items-center gap-3 text-[13px]">
            <span className="text-green-600 font-semibold">{acceptedGaps.length} acceptées</span>
            <span className="text-amber-500 font-semibold">{pendingGaps.length} restantes</span>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* ─── REPORT TAB ─── */}
          {activeTab === "report" && (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* SIDEBAR — 4 cols */}
              <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-6 lg:self-start">
                {/* Score Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="flex justify-center mb-4">
                    <ScoreGauge score={scoreActuel} size={160} strokeWidth={8} />
                  </div>
                  <div className="text-center mb-5">
                    <p className="text-[13px] text-gray-400">{isJdMatch ? "Taux de correspondance" : "Score CV"}</p>
                    <ScoreStatusBadge score={scoreActuel} />
                    {scoreActuel > score_avant && (
                      <p className="text-[11px] text-gray-400 mt-1">Score estimé après optimisations (+{scoreActuel - score_avant} pts)</p>
                    )}
                  </div>

                  {/* Category breakdown — hidden on mobile, visible on desktop */}
                  <div className="hidden lg:block space-y-3 pt-4 border-t border-gray-100">
                    {isJdMatch && jdMatch ? (
                      <>
                        {Object.entries(jdMatch.category_scores).map(([key, score]) => (
                          <JdCategoryRow
                            key={key}
                            label={JD_CATEGORY_MAP[key]?.label ?? key}
                            score={score}
                          />
                        ))}
                      </>
                    ) : (
                      categories.map((cat) => (
                        <CategoryRow key={cat.key} label={cat.label} score={cat.score} />
                      ))
                    )}
                  </div>
                </div>

                {/* JD Match details — hidden on mobile (visible in main content) */}
                <div className="hidden lg:block">
                {isJdMatch && jdMatch ? (
                  <>
                    {/* Missing Keywords Tags */}
                    {jdMatch.missing_keywords_tags.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <h3 className="font-display text-[16px] font-bold text-gray-800 mb-3">Mots-clés manquants</h3>
                        <div className="flex flex-wrap gap-2">
                          {jdMatch.missing_keywords_tags.map((kw, i) => (
                            <span key={i} className="bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 text-[12px] font-medium">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Strengths */}
                    {jdMatch.strengths.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <h3 className="font-display text-[16px] font-bold text-gray-800 mb-3">
                          <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                            Points forts
                          </span>
                        </h3>
                        <ul className="space-y-2">
                          {jdMatch.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600 leading-relaxed">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Areas to Improve */}
                    {jdMatch.areas_to_improve.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-200 p-5">
                        <h3 className="font-display text-[16px] font-bold text-gray-800 mb-3">
                          <span className="flex items-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            Axes d&apos;amélioration
                          </span>
                        </h3>
                        <ul className="space-y-2">
                          {jdMatch.areas_to_improve.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600 leading-relaxed">
                              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  /* ATS: Quick Summary */
                  resume && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-5">
                      <h3 className="font-display text-[16px] font-bold text-gray-800 mb-4">Résumé rapide</h3>

                      {criticalFixes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[12px] font-bold text-red-500 uppercase tracking-wider mb-2">Corrections critiques</p>
                          <ul className="space-y-1.5">
                            {criticalFixes.map((fix, i) => (
                              <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600 leading-relaxed">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                {fix}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {quickWins.length > 0 && (
                        <div>
                          <p className="text-[12px] font-bold text-green-500 uppercase tracking-wider mb-2">Gains rapides</p>
                          <ul className="space-y-1.5">
                            {quickWins.map((win, i) => (
                              <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600 leading-relaxed">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                                {win}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )
                )}
                </div>

                {/* Counters */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-[22px] font-bold text-amber-500">{pendingGaps.length}</p>
                      <p className="text-[11px] text-gray-400 font-medium">En attente</p>
                    </div>
                    <div>
                      <p className="text-[22px] font-bold text-green-500">{acceptedGaps.length}</p>
                      <p className="text-[11px] text-gray-400 font-medium">Acceptées</p>
                    </div>
                    <div>
                      <p className="text-[22px] font-bold text-gray-400">{ignoredGaps.length}</p>
                      <p className="text-[11px] text-gray-400 font-medium">Rejetées</p>
                    </div>
                  </div>
                </div>

                {/* Template Selector — hidden on mobile (shown in preview modal instead) */}
                <div className="hidden lg:block">
                  <TemplateSelector
                    selectedId={templateId}
                    onSelect={setTemplateId}
                    isPremiumUser={isPremiumUser}
                  />
                </div>

                {/* Preview + Download CTA */}
                <div className="space-y-3">
                  {/* Preview button */}
                  <button
                    onClick={handlePreview}
                    disabled={isPreviewing}
                    className="w-full py-3 border-2 border-gray-200 text-gray-700 text-[14px] font-semibold rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isPreviewing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        Génération aperçu...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        Prévisualiser le PDF
                      </>
                    )}
                  </button>

                  {/* Download button */}
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
                        Télécharger le CV optimisé
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
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-3">
                      <p className="text-[13px] text-green-700 font-medium">CV téléchargé !</p>
                      <p className="text-[11px] text-gray-500">Partagez votre score</p>
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://cvpass.fr")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0077b5] text-white text-[13px] font-semibold hover:bg-[#005f8d] transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                          LinkedIn
                        </a>
                        <a
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Mon CV est passé de ${score_avant} à ${scoreActuel}/100 grâce à @CVpass_fr 🚀 Testez le vôtre gratuitement :`)}&url=${encodeURIComponent("https://cvpass.fr")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-[13px] font-semibold hover:bg-gray-800 transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                          Twitter
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* MAIN CONTENT — 8 cols */}
              <div className="lg:col-span-8 space-y-4">
                {/* Accept All banner — visible when pending suggestions exist */}
                {pendingGaps.length > 0 && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-white text-center sm:text-left">
                      <p className="text-[16px] font-bold">{pendingGaps.length} suggestion{pendingGaps.length > 1 ? "s" : ""} disponible{pendingGaps.length > 1 ? "s" : ""}</p>
                      <p className="text-[13px] text-green-100">Acceptez-les pour améliorer votre score — estimation +{Math.round(pendingGaps.length * 4)} pts</p>
                    </div>
                    <button
                      onClick={handleAcceptAll}
                      className="px-6 py-3 min-h-[48px] bg-white text-green-600 text-[15px] font-bold rounded-xl hover:bg-green-50 transition-colors flex items-center gap-2 shrink-0"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      Tout accepter (+{Math.round(pendingGaps.length * 4)} pts)
                    </button>
                  </div>
                )}

                {isJdMatch && jdMatch ? (
                  reportSubTab === "quality" && jdMatch.quality_sections?.length > 0 ? (
                    <JdQualityReport qualitySections={jdMatch.quality_sections} />
                  ) : (
                    <JdMatchReport
                      jdMatch={jdMatch}
                      gaps={gaps}
                      onAccept={handleAcceptGap}
                      onIgnore={handleIgnoreGap}
                      onApplyInEditor={handleApplyInEditor}
                    />
                  )
                ) : (
                  <>
                    {Array.from(gapsByCategory.entries()).map(([cat, catGaps], idx) => {
                      const config = CATEGORY_MAP[cat] ?? { label: cat, color: "#6b7280" };
                      const hasHigh = catGaps.some((g) => g.impact === "high");
                      return (
                        <CategorySection
                          key={cat}
                          label={config.label}
                          impactLabel={hasHigh ? "IMPORTANT" : "MEDIUM SCORE IMPACT"}
                          gaps={catGaps}
                          onAccept={handleAcceptGap}
                          onIgnore={handleIgnoreGap}
                          onApplyInEditor={handleApplyInEditor}
                          defaultOpen={idx === 0}
                        />
                      );
                    })}
                  </>
                )}

                {gaps.length === 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-400 text-[15px]">Aucune suggestion générée pour cette analyse.</p>
                  </div>
                )}

                {gaps.length > 0 && pendingGaps.length === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="text-[18px] font-bold text-gray-900 mb-2">Toutes les suggestions sont traitées !</p>
                    <p className="text-[14px] text-gray-500 mb-5">
                      {acceptedGaps.length > 0
                        ? `Vous avez accepté ${acceptedGaps.length} suggestion${acceptedGaps.length > 1 ? "s" : ""}. Prévisualisez et téléchargez votre CV optimisé.`
                        : "Vous pouvez prévisualiser votre CV ou relancer une analyse."
                      }
                    </p>
                    {acceptedGaps.length > 0 && (
                      <button
                        onClick={handlePreview}
                        disabled={isPreviewing}
                        className="inline-flex items-center gap-2 px-6 py-3 min-h-[48px] bg-green-500 text-white text-[15px] font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                        Prévisualiser le PDF
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── EDITOR TAB ─── */}
          {activeTab === "editor" && (
            <div>
              {cvJson ? (
                <CVEditorWithPanel
                  cvJson={cvJson}
                  gaps={gaps}
                  onUpdate={setCvJson}
                  onAccept={handleAcceptGap}
                  onIgnore={handleIgnoreGap}
                  onAcceptAll={handleAcceptAll}
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                  downloadError={downloadError}
                  templateId={templateId}
                />
              ) : (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-400 text-[15px]">Le CV n&apos;a pas pu être structuré. Relancez l&apos;analyse.</p>
                </div>
              )}
            </div>
          )}
        </main>

        {promo.show && <PromoModal onClose={promo.close} />}
        <ResultsOnboarding />

        {showCreditsModal && (
          <InsufficientCreditsModal
            creditsNeeded={1}
            onClose={() => setShowCreditsModal(false)}
            scoreAvant={score_avant}
            scoreApres={scoreActuel}
            nbAccepted={acceptedGaps.length}
          />
        )}

        {/* PDF Preview Modal */}
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-200 gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="font-bold text-gray-900 text-[16px]">Aperçu du CV</h2>
                    <p className="text-[12px] text-gray-400">Le filigrane sera retiré au téléchargement</p>
                  </div>
                  {scoreActuel > score_avant && (
                    <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-1.5">
                      <span className="text-[14px] font-bold text-red-400">{score_avant}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                      <span className="text-[14px] font-bold text-green-600">{scoreActuel}</span>
                      <span className="text-[11px] text-green-600 font-semibold">+{scoreActuel - score_avant} pts</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { handleDownload(); setPreviewUrl(null); }}
                    disabled={acceptedGaps.length === 0 || isDownloading}
                    className="px-5 py-2.5 min-h-[44px] bg-green-500 text-white text-[13px] font-semibold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    Télécharger sans filigrane
                  </button>
                  <button
                    onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              </div>
              {/* Template selector inside modal for mobile */}
              <div className="lg:hidden px-6 py-3 border-b border-gray-100 overflow-x-auto">
                <TemplateSelector
                  selectedId={templateId}
                  onSelect={(id) => { setTemplateId(id); handlePreview(); }}
                  isPremiumUser={isPremiumUser}
                />
              </div>
              <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
                <iframe
                  src={previewUrl}
                  className="w-full h-full rounded-lg border border-gray-200 bg-white"
                  title="Aperçu PDF"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
