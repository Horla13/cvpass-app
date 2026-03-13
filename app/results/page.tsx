"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useShallow } from "zustand/react/shallow";
import { usePostHog } from "posthog-js/react";
import { useStore, Gap, JdMatchData, QualitySection } from "@/lib/store";
import { ScoreGauge } from "@/components/ScoreGauge";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";
import { cn } from "@/lib/utils";

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
  if (score >= 80) return { text: "Bon", color: "text-green-500" };
  if (score >= 60) return { text: "À améliorer", color: "text-amber-500" };
  return { text: "À améliorer", color: "text-red-500" };
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
      <span className="text-[13px] text-gray-700 flex-shrink-0 min-w-[140px]">{label}</span>
      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap",
        score >= 80 ? "bg-green-50 text-green-600 border-green-200" :
        score >= 60 ? "bg-blue-50 text-blue-600 border-blue-200" :
        "bg-amber-50 text-amber-600 border-amber-200"
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
                    <tr key={i} className="hover:bg-gray-50/50">
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
                    <tr key={i} className="hover:bg-gray-50/50">
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
                  <p className="text-[13px] text-green-800 leading-relaxed">{gap.texte_suggere}</p>
                </div>
              </div>

              <p className="text-[13px] text-gray-500 leading-relaxed mb-3">{gap.raison}</p>

              {gap.status === "pending" && (
                <div className="flex items-center gap-3">
                  <button onClick={() => onApplyInEditor(gap.id)} className="inline-flex items-center gap-1.5 text-[13px] text-blue-500 font-semibold hover:text-blue-600 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Appliquer dans l&apos;éditeur
                  </button>
                  <button onClick={() => onAccept(gap.id)} className="inline-flex items-center gap-1 text-[12px] text-green-500 font-medium hover:text-green-600 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Accepter
                  </button>
                  <button onClick={() => onIgnore(gap.id)} className="text-[12px] text-gray-400 font-medium hover:text-gray-600 transition-colors">
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
                  <p className="text-[13px] text-green-800 leading-relaxed">{gap.texte_suggere}</p>
                </div>
              </div>

              {/* Reason */}
              <p className="text-[13px] text-gray-500 leading-relaxed mb-3">{gap.raison}</p>

              {/* Actions */}
              {gap.status === "pending" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onApplyInEditor(gap.id)}
                    className="inline-flex items-center gap-1.5 text-[13px] text-blue-500 font-semibold hover:text-blue-600 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    Appliquer dans l&apos;éditeur
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                  <button
                    onClick={() => onAccept(gap.id)}
                    className="inline-flex items-center gap-1 text-[12px] text-green-500 font-medium hover:text-green-600 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    Accept
                  </button>
                  <button
                    onClick={() => onIgnore(gap.id)}
                    className="text-[12px] text-gray-400 font-medium hover:text-gray-600 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
              {gap.status === "accepted" && (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-green-500 font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Applied
                </span>
              )}
              {gap.status === "ignored" && (
                <span className="text-[13px] text-gray-400 font-medium">Dismissed</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── CV Section Parser ─── */
interface CVSection {
  type: "header" | "section-title" | "entry-title" | "sub-entry" | "bullet" | "text" | "blank" | "contact-line";
  text: string;
  rightText?: string; // for dates
}

interface CVContactInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  title?: string;
}

function extractContactInfo(text: string): CVContactInfo {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const info: CVContactInfo = { name: lines[0] || "Candidat" };

  // Scan first 8 lines for contact details
  const headerLines = lines.slice(0, 8);
  for (const line of headerLines) {
    if (!info.email) {
      const emailMatch = line.match(/[\w.+-]+@[\w.-]+\.\w{2,}/);
      if (emailMatch) info.email = emailMatch[0];
    }
    if (!info.phone) {
      const phoneMatch = line.match(/(?:\+?\d[\d\s.()-]{7,})/);
      if (phoneMatch) info.phone = phoneMatch[0].trim();
    }
    if (!info.linkedin) {
      const liMatch = line.match(/linkedin\.com\/in\/[\w-]+/i);
      if (liMatch) info.linkedin = liMatch[0];
    }
    if (!info.location) {
      // Common French city/address patterns
      const locMatch = line.match(/(?:\d{5}\s+\w+|\b(?:Paris|Lyon|Marseille|Toulouse|Nice|Nantes|Strasbourg|Montpellier|Bordeaux|Lille|Rennes|Reims|Le Havre|Saint-Étienne|Toulon)\b.*)/i);
      if (locMatch && !line.includes("@") && !/linkedin/i.test(line)) info.location = locMatch[0].trim();
    }
  }

  // Second line might be a title if it doesn't contain contact info
  if (lines[1] && !lines[1].includes("@") && !/\d{5}/.test(lines[1]) && !/linkedin/i.test(lines[1]) && !/^\+?\d/.test(lines[1]) && lines[1].length < 80) {
    info.title = lines[1];
  }

  return info;
}

function parseCVSections(text: string): CVSection[] {
  const lines = text.split("\n");
  const sections: CVSection[] = [];
  const sectionKeywords = [
    "EXPÉRIENCE", "EXPERIENCE", "EXPÉRIENCES", "FORMATION", "EDUCATION", "COMPÉTENCES", "COMPETENCES",
    "SKILLS", "CENTRES D'INTÉRÊT", "CENTRES D'INTERET", "PROFIL", "PROFESSIONAL SUMMARY",
    "RÉSUMÉ", "SUMMARY", "LANGUES", "LANGUAGES", "CERTIFICATIONS", "PROJETS", "PROJECTS",
    "BÉNÉVOLAT", "VOLUNTEER", "RÉFÉRENCES", "REFERENCES", "OBJECTIF", "OBJECTIVE",
    "INFORMATIONS", "CONTACT", "À PROPOS", "ABOUT",
  ];

  let isFirstNonBlank = true;
  let headerLineCount = 0;
  const maxHeaderLines = 6; // Skip contact info lines at top

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      if (headerLineCount > 0 && headerLineCount < maxHeaderLines) {
        headerLineCount++;
        continue; // Skip blank lines in header area
      }
      sections.push({ type: "blank", text: "" });
      continue;
    }

    // Detect section headings
    const upper = trimmed.toUpperCase();
    const isSection = sectionKeywords.some((kw) => upper === kw || upper.startsWith(kw + " ") || upper.startsWith(kw + ":"));
    if (isSection || (trimmed === trimmed.toUpperCase() && trimmed.length > 2 && trimmed.length < 50 && !/^\d/.test(trimmed) && !trimmed.startsWith("·") && !trimmed.startsWith("-") && !trimmed.startsWith("•") && !/[@.]/.test(trimmed))) {
      if (headerLineCount > 0 && headerLineCount < maxHeaderLines) {
        // This is a section heading — end of header area
      }
      headerLineCount = maxHeaderLines; // Done with header
      sections.push({ type: "section-title", text: trimmed });
      isFirstNonBlank = false;
      continue;
    }

    // First non-blank = name (header)
    if (isFirstNonBlank) {
      sections.push({ type: "header", text: trimmed });
      isFirstNonBlank = false;
      headerLineCount = 1;
      continue;
    }

    // Skip contact info lines near top (they go in the dark header)
    if (headerLineCount > 0 && headerLineCount < maxHeaderLines) {
      const isContact = /[@+]/.test(trimmed) || /linkedin/i.test(trimmed) || /\d{5}/.test(trimmed) || /^\+?\d[\d\s.()-]{7,}$/.test(trimmed);
      if (isContact || trimmed.length < 60) {
        sections.push({ type: "contact-line", text: trimmed });
        headerLineCount++;
        continue;
      }
    }

    // Bullet points
    if (/^[·•\-–]\s/.test(trimmed)) {
      sections.push({ type: "bullet", text: trimmed.replace(/^[·•\-–]\s*/, "") });
      continue;
    }

    // Lines with dates on the right
    const dateMatch = trimmed.match(/^(.+?)\s{2,}((?:Depuis|De|Du|Jan|Fév|Mar|Avr|Mai|Juin|Juil|Aoû|Sep|Oct|Nov|Déc|Janvier|Février|Mars|Avril|Mai|Juin|Juillet|Août|Septembre|Octobre|Novembre|Décembre|\d{4}|\d{2}\/\d{2}\/\d{4}).+)$/i);
    if (dateMatch) {
      sections.push({ type: "entry-title", text: dateMatch[1].trim(), rightText: dateMatch[2].trim() });
      continue;
    }

    // Check for standalone date line
    const isDateLine = /^(?:Depuis|De|Du|Jan|Fév|Mar|Avr|Mai|Juin|Juil|Aoû|Sep|Oct|Nov|Déc|Janvier|Février|Mars|Avril|Juin|Juillet|Août|Septembre|Octobre|Novembre|Décembre|\d{4})/i.test(trimmed) && trimmed.length < 60;
    if (isDateLine) {
      const prevSection = sections[sections.length - 1];
      if (prevSection && (prevSection.type === "entry-title" || prevSection.type === "sub-entry")) {
        prevSection.rightText = trimmed;
        continue;
      }
    }

    // Entry title after a section heading or blank
    const prevSection = sections[sections.length - 1];
    if (prevSection?.type === "section-title" || prevSection?.type === "blank") {
      if (trimmed.length < 80 && !trimmed.endsWith(".") && !trimmed.endsWith(",")) {
        sections.push({ type: "entry-title", text: trimmed });
        continue;
      }
    }

    // Sub-entry (company name, location after entry-title)
    if (prevSection?.type === "entry-title" && trimmed.length < 80 && !trimmed.endsWith(".")) {
      sections.push({ type: "sub-entry", text: trimmed });
      continue;
    }

    sections.push({ type: "text", text: trimmed });
    isFirstNonBlank = false;
  }

  return sections;
}

/* ─── Structured CV Renderer with dark header ─── */
function StructuredCV({
  cvText,
  gaps,
  selectedGapId,
  onSelectGap,
  headerPhoto,
  headerPhotoPosition,
  headerPhotoSize,
}: {
  cvText: string;
  gaps: Gap[];
  selectedGapId: string | null;
  onSelectGap: (id: string) => void;
  headerPhoto?: string | null;
  headerPhotoPosition?: "left" | "right";
  headerPhotoSize?: "S" | "M" | "L";
}) {
  const contactInfo = useMemo(() => extractContactInfo(cvText), [cvText]);

  // Apply accepted gap substitutions
  const workingText = useMemo(() => {
    let text = cvText;
    const accepted = gaps.filter((g) => g.status === "accepted" && g.texte_original?.trim());
    for (const gap of accepted) {
      const orig = gap.texte_original!.trim();
      if (text.includes(orig)) text = text.replace(orig, gap.texte_suggere);
    }
    return text;
  }, [cvText, gaps]);

  // Build matchable gaps index
  const matchableGaps = useMemo(() =>
    gaps
      .filter((g) => g.status === "pending" && g.texte_original?.trim())
      .filter((g) => workingText.includes(g.texte_original!.trim())),
    [gaps, workingText]
  );

  // Highlight a text string with gaps
  const highlightText = (text: string) => {
    if (matchableGaps.length === 0) return <>{text}</>;

    const fragments: { text: string; gapId?: string }[] = [];
    let remaining = text;

    for (const gap of matchableGaps) {
      const orig = gap.texte_original!.trim();
      const idx = remaining.indexOf(orig);
      if (idx < 0) continue;
      if (idx > 0) fragments.push({ text: remaining.slice(0, idx) });
      fragments.push({ text: orig, gapId: gap.id });
      remaining = remaining.slice(idx + orig.length);
    }
    if (remaining) fragments.push({ text: remaining });

    if (fragments.length <= 1 && !fragments[0]?.gapId) return <>{text}</>;

    return (
      <>
        {fragments.map((f, i) =>
          f.gapId ? (
            <span
              key={i}
              onClick={() => onSelectGap(f.gapId!)}
              className={cn(
                "cursor-pointer rounded-sm px-0.5 transition-all",
                selectedGapId === f.gapId
                  ? "bg-yellow-300/80 ring-2 ring-yellow-400"
                  : "bg-yellow-200/60 hover:bg-yellow-300/70"
              )}
            >
              {f.text}
            </span>
          ) : (
            <span key={i}>{f.text}</span>
          )
        )}
      </>
    );
  };

  // Render using working text sections
  const workingSections = useMemo(() => parseCVSections(workingText), [workingText]);

  const photoSizeClass = headerPhotoSize === "L" ? "w-20 h-20" : headerPhotoSize === "S" ? "w-12 h-12" : "w-16 h-16";

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      {/* ─── Dark Header ─── */}
      <div className="bg-[#1e293b] px-8 py-6">
        <div className={cn("flex items-center gap-6", headerPhotoPosition === "left" ? "flex-row" : "flex-row-reverse")}>
          {/* Photo */}
          {headerPhoto && (
            <div className={cn("rounded-full overflow-hidden flex-shrink-0 border-2 border-white/20", photoSizeClass)}>
              <img src={headerPhoto} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Name + Contact */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">{contactInfo.name}</h1>
            {contactInfo.title && (
              <p className="text-[15px] text-slate-300 mt-0.5">{contactInfo.title}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3">
              {contactInfo.email && (
                <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  {contactInfo.email}
                </span>
              )}
              {contactInfo.phone && (
                <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                  {contactInfo.phone}
                </span>
              )}
              {contactInfo.location && (
                <span className="flex items-center gap-1.5 text-[12px] text-slate-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  {contactInfo.location}
                </span>
              )}
              {contactInfo.linkedin && (
                <span className="flex items-center gap-1.5 text-[12px] text-blue-400">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  {contactInfo.linkedin}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── CV Body ─── */}
      <div className="px-8 py-6 space-y-0">
        {workingSections.map((section, i) => {
          // Skip header and contact lines (rendered in dark header)
          if (section.type === "header" || section.type === "contact-line") return null;

          switch (section.type) {
            case "section-title":
              return (
                <div key={i} className="mt-5 mb-3 first:mt-0">
                  <h2 className="text-[13px] font-bold text-[#1e293b] uppercase tracking-[0.15em] border-b-2 border-[#1e293b] pb-1.5">{section.text}</h2>
                </div>
              );
            case "entry-title":
              return (
                <div key={i} className="flex items-baseline justify-between mt-3 mb-0.5">
                  <p className="text-[14px] font-bold text-gray-900">{highlightText(section.text)}</p>
                  {section.rightText && <p className="text-[12px] text-gray-500 flex-shrink-0 ml-4 font-medium">{section.rightText}</p>}
                </div>
              );
            case "sub-entry":
              return (
                <div key={i} className="flex items-baseline justify-between mb-1">
                  <p className="text-[13px] text-gray-600 italic">{highlightText(section.text)}</p>
                  {section.rightText && <p className="text-[12px] text-gray-500 flex-shrink-0 ml-4">{section.rightText}</p>}
                </div>
              );
            case "bullet":
              return (
                <div key={i} className="flex items-start gap-2.5 pl-3 mb-1">
                  <span className="text-[#1e293b] mt-[7px] text-[5px]">&#9679;</span>
                  <p className="text-[13px] text-gray-700 leading-[1.6]">{highlightText(section.text)}</p>
                </div>
              );
            case "text":
              return (
                <p key={i} className="text-[13px] text-gray-700 leading-[1.6] mb-0.5">{highlightText(section.text)}</p>
              );
            case "blank":
              return <div key={i} className="h-2" />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

/* ─── CV Editor Panel ─── */
function CVEditor({
  cvText,
  gaps,
  onAccept,
  onIgnore,
}: {
  cvText: string;
  gaps: Gap[];
  acceptedGaps: Gap[];
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onAcceptAll: () => void;
}) {
  const pendingGaps = gaps.filter((g) => g.status === "pending");
  const unmatchableGaps = pendingGaps.filter((g) => !g.texte_original?.trim() || !cvText.includes(g.texte_original.trim()));
  const [selectedGapId, setSelectedGapId] = useState<string | null>(null);
  const selectedGap = gaps.find((g) => g.id === selectedGapId);

  // Header customization state
  const [headerPhoto, setHeaderPhoto] = useState<string | null>(null);
  const [headerPhotoPosition, setHeaderPhotoPosition] = useState<"left" | "right">("right");
  const [headerPhotoSize, setHeaderPhotoSize] = useState<"S" | "M" | "L">("M");
  const [showHeaderPanel, setShowHeaderPanel] = useState(true);

  // Navigation through pending gaps
  const navigableGaps = pendingGaps.filter((g) => g.texte_original?.trim());
  const currentNavIndex = selectedGapId ? navigableGaps.findIndex((g) => g.id === selectedGapId) : -1;

  const navigateGap = (dir: 1 | -1) => {
    if (navigableGaps.length === 0) return;
    const next = currentNavIndex + dir;
    if (next >= 0 && next < navigableGaps.length) {
      setSelectedGapId(navigableGaps[next].id);
    }
  };

  // Auto-select first gap
  useEffect(() => {
    if (!selectedGapId && navigableGaps.length > 0) {
      setSelectedGapId(navigableGaps[0].id);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard shortcuts: Tab = accept, Esc = reject
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!selectedGap || selectedGap.status !== "pending") return;
      if (e.key === "Tab") {
        e.preventDefault();
        onAccept(selectedGap.id);
        navigateGap(1);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onIgnore(selectedGap.id);
        navigateGap(1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  // Photo upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setHeaderPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Keyboard shortcut hint */}
      <div className="flex items-center justify-center gap-4 text-[12px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-mono">Tab</kbd>
          Accepter
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[11px] font-mono">Esc</kbd>
          Rejeter
        </span>
        <span>
          Cliquez sur le texte surligné en jaune pour naviguer
        </span>
      </div>

      {/* Main layout: CV doc + sidebar */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* CV Document — left side */}
        <div className="lg:col-span-7 max-h-[85vh] overflow-y-auto pr-1">
          <StructuredCV
            cvText={cvText}
            gaps={gaps}
            selectedGapId={selectedGapId}
            onSelectGap={setSelectedGapId}
            headerPhoto={headerPhoto}
            headerPhotoPosition={headerPhotoPosition}
            headerPhotoSize={headerPhotoSize}
          />
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active suggestion card */}
          {selectedGap && selectedGap.status === "pending" && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-[76px]">
              {/* Header with navigation */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  <span className="text-[13px] text-blue-600 font-semibold">Suggestion</span>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                    selectedGap.impact === "high" ? "bg-red-100 text-red-600" :
                    selectedGap.impact === "medium" ? "bg-amber-100 text-amber-600" :
                    "bg-green-100 text-green-600"
                  )}>
                    {selectedGap.impact === "high" ? "Important" : selectedGap.impact === "medium" ? "Moyen" : "Faible"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-gray-400 font-medium">
                    {currentNavIndex + 1}/{navigableGaps.length}
                  </span>
                  <button
                    onClick={() => navigateGap(-1)}
                    disabled={currentNavIndex <= 0}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>
                  </button>
                  <button
                    onClick={() => navigateGap(1)}
                    disabled={currentNavIndex >= navigableGaps.length - 1}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </button>
                </div>
              </div>

              {/* Section label */}
              <div className="px-5 py-2 border-b border-gray-50 bg-gray-50/50">
                <span className="text-[12px] text-gray-400">Section : <span className="font-medium text-gray-600">{selectedGap.section}</span></span>
              </div>

              {/* Current */}
              <div className="px-5 pt-4">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Actuel</p>
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-[13px] text-red-700 leading-relaxed">
                    {selectedGap.texte_original || <span className="italic">Absent du CV</span>}
                  </p>
                </div>
              </div>

              {/* Suggested */}
              <div className="px-5 pt-4">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Suggéré</p>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <p className="text-[13px] text-green-800 leading-relaxed">{selectedGap.texte_suggere}</p>
                </div>
              </div>

              {/* Why */}
              <div className="px-5 pt-4 pb-4">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Pourquoi ?</p>
                <p className="text-[13px] text-gray-500 leading-relaxed italic">{selectedGap.raison}</p>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 flex items-center gap-3">
                <button
                  onClick={() => { onIgnore(selectedGap.id); navigateGap(1); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  Rejeter
                  <kbd className="ml-1 px-1 py-0.5 bg-gray-100 border border-gray-200 rounded text-[9px] font-mono text-gray-400">Esc</kbd>
                </button>
                <button
                  onClick={() => { onAccept(selectedGap.id); navigateGap(1); }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-[13px] font-semibold hover:bg-green-600 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Accepter
                  <kbd className="ml-1 px-1 py-0.5 bg-green-600 border border-green-400 rounded text-[9px] font-mono text-green-200">Tab</kbd>
                </button>
              </div>
            </div>
          )}

          {/* No selection state */}
          {(!selectedGap || selectedGap.status !== "pending") && pendingGaps.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <p className="text-[13px] text-gray-400">Cliquez sur le texte surligné pour examiner les suggestions</p>
              <button
                onClick={() => navigableGaps.length > 0 && setSelectedGapId(navigableGaps[0].id)}
                className="mt-3 text-[13px] text-blue-500 font-semibold hover:text-blue-600"
              >
                Commencer la révision ({pendingGaps.length} suggestions)
              </button>
            </div>
          )}

          {/* All done */}
          {pendingGaps.length === 0 && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="mx-auto mb-2"><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>
              <p className="text-[14px] text-green-700 font-semibold">Toutes les suggestions ont été traitées !</p>
              <p className="text-[12px] text-green-600 mt-1">Téléchargez votre CV optimisé ci-dessous.</p>
            </div>
          )}

          {/* Customize Header Panel */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setShowHeaderPanel(!showHeaderPanel)}
              className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-[14px] font-bold text-gray-800">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /></svg>
                Personnaliser l&apos;en-tête
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={cn("text-gray-400 transition-transform", showHeaderPanel && "rotate-180")}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showHeaderPanel && (
              <div className="px-5 pb-5 border-t border-gray-100 pt-4 space-y-4">
                {/* Photo upload */}
                <div>
                  <p className="text-[12px] text-gray-500 font-semibold mb-2">Photo de profil</p>
                  <div className="flex items-center gap-3">
                    {headerPhoto ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                        <img src={headerPhoto} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[12px] font-medium text-gray-700 transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                        {headerPhoto ? "Changer" : "Ajouter"}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                      {headerPhoto && (
                        <button
                          onClick={() => setHeaderPhoto(null)}
                          className="ml-2 text-[11px] text-red-400 hover:text-red-500"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Position */}
                {headerPhoto && (
                  <div>
                    <p className="text-[12px] text-gray-500 font-semibold mb-2">Position</p>
                    <div className="flex gap-2">
                      {(["left", "right"] as const).map((pos) => (
                        <button
                          key={pos}
                          onClick={() => setHeaderPhotoPosition(pos)}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-[12px] font-medium border transition-colors",
                            headerPhotoPosition === pos
                              ? "bg-[#1e293b] text-white border-[#1e293b]"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          {pos === "left" ? "Gauche" : "Droite"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size */}
                {headerPhoto && (
                  <div>
                    <p className="text-[12px] text-gray-500 font-semibold mb-2">Taille</p>
                    <div className="flex gap-2">
                      {(["S", "M", "L"] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setHeaderPhotoSize(size)}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-[12px] font-bold border transition-colors",
                            headerPhotoSize === size
                              ? "bg-[#1e293b] text-white border-[#1e293b]"
                              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                  <p className="text-[11px] text-blue-600 leading-relaxed">
                    <span className="font-semibold">Conseil :</span> utilisez une photo professionnelle sur fond neutre. Format carré recommandé.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Additional Suggestions — unmatchable */}
          {unmatchableGaps.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="font-display text-[14px] font-bold text-gray-800">
                  Suggestions supplémentaires ({unmatchableGaps.length})
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {unmatchableGaps.map((gap) => (
                  <div key={gap.id} className="px-5 py-3">
                    <p className="text-[13px] text-gray-700 font-medium mb-1">{gap.texte_suggere}</p>
                    <p className="text-[12px] text-gray-400 italic mb-2">{gap.raison}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onIgnore(gap.id)} className="text-[11px] text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-2.5 py-1">
                        Ignorer
                      </button>
                      <button onClick={() => onAccept(gap.id)} className="text-[11px] text-green-500 hover:text-green-600 border border-green-200 rounded-lg px-2.5 py-1">
                        Accepter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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

  const { cvText, gaps, score_avant, scoreActuel, resume, jobTitle, acceptGap, ignoreGap, analysisType, jdMatch } = useStore(
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
    }))
  );
  const isJdMatch = analysisType === "jd" && jdMatch !== null;

  const [activeTab, setActiveTab] = useState<"report" | "editor">("report");
  const [reportSubTab, setReportSubTab] = useState<"match" | "quality">("match");
  const [isDownloading, setIsDownloading] = useState(false);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    if (gaps.length === 0 && score_avant === 0) router.push("/analyze");
  }, [gaps.length, score_avant, router]);

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
        setDownloadError("Crédits insuffisants pour générer le PDF.");
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

        {/* ─── Top tab bar ─── */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-2">
            <button
              onClick={() => router.push("/analyze")}
              className="flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-gray-600 mr-4 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              Retour
            </button>

            <div className={cn(
              "flex items-center gap-1 px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all border-2",
              activeTab === "report"
                ? "bg-white border-gray-300 shadow-sm text-gray-900"
                : "bg-transparent border-transparent text-gray-400 hover:text-gray-600"
            )}>
              <button onClick={() => setActiveTab("report")} className="flex flex-col">
                <span className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></svg>
                  Rapport CV
                </span>
                <span className="text-[11px] text-gray-400 font-normal block">Score & Analyse</span>
              </button>
              {/* Match/Quality sub-tabs for JD mode */}
              {isJdMatch && activeTab === "report" && (
                <div className="flex items-center gap-1 ml-3">
                  <button
                    onClick={() => { setActiveTab("report"); setReportSubTab("match"); }}
                    className={cn("px-3 py-1 rounded-lg text-[12px] font-semibold transition-all",
                      reportSubTab === "match"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Correspondance
                  </button>
                  <button
                    onClick={() => { setActiveTab("report"); setReportSubTab("quality"); }}
                    className={cn("px-3 py-1 rounded-lg text-[12px] font-semibold transition-all",
                      reportSubTab === "quality"
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    Qualité
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveTab("editor")}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all border-2",
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
              <div className="absolute -top-2 -right-2 flex items-center gap-1">
                <span className="bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  À essayer
                </span>
                {pendingGaps.length > 0 && (
                  <span className="bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingGaps.length}
                  </span>
                )}
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
                  <div className="flex justify-center mb-4">
                    <ScoreGauge score={scoreActuel} size={160} strokeWidth={8} />
                  </div>
                  <div className="text-center mb-5">
                    <p className="text-[13px] text-gray-400">{isJdMatch ? "Taux de correspondance" : "Score CV"}</p>
                    <ScoreStatusBadge score={scoreActuel} />
                  </div>

                  {/* Category breakdown */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
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

                {/* JD Match: Missing Keywords + Strengths + Areas to Improve */}
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
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center space-y-2">
                      <p className="text-[13px] text-green-700 font-medium">CV téléchargé !</p>
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
                </div>
              </aside>

              {/* MAIN CONTENT — 8 cols */}
              <div className="lg:col-span-8 space-y-4">
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
              </div>
            </div>
          )}

          {/* ─── EDITOR TAB ─── */}
          {activeTab === "editor" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div />
                <div className="flex items-center gap-3">
                  {pendingGaps.length > 0 && (
                    <button
                      onClick={handleAcceptAll}
                      className="px-5 py-2.5 bg-green-500 text-white text-[13px] font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      Tout accepter ({pendingGaps.length})
                    </button>
                  )}
                  <button
                    onClick={handleDownload}
                    disabled={acceptedGaps.length === 0 || isDownloading}
                    className="px-5 py-2.5 bg-gray-900 text-white text-[13px] font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
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
                onAcceptAll={handleAcceptAll}
              />
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
}
