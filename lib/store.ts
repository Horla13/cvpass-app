import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CVData } from "@/lib/pdf-restructure";

export interface Gap {
  id: string;
  section: string;
  texte_original: string;
  texte_suggere: string;
  raison: string;
  impact?: "high" | "medium" | "low";
  category?: "titre" | "accroche" | "experience" | "competence" | "formation";
  status: "pending" | "accepted" | "ignored";
}

export interface MissingKeyword {
  keyword: string;
  in_resume: boolean;
  jd_mentions: number;
}

export interface KeywordFrequency {
  keyword: string;
  jd_count: number;
  resume_count: number;
  status: "matched" | "missing" | "partial";
}

export interface QualityCheck {
  title: string;
  description: string;
  status: "pass" | "warning" | "fail";
}

export interface QualitySection {
  title: string;
  description: string;
  impact_label: string;
  tip: string;
  checks: QualityCheck[];
}

export interface JdMatchData {
  missing_hard_skills: MissingKeyword[];
  keyword_frequency: KeywordFrequency[];
  missing_keywords_tags: string[];
  strengths: string[];
  areas_to_improve: string[];
  category_scores: {
    keyword_match: number;
    title_alignment: number;
    impact_density: number;
    seniority_fit: number;
    relevancy: number;
  };
  quality_sections: QualitySection[];
}

interface Analysis {
  score_avant: number;
  gaps: Omit<Gap, "status">[];
  resume: string;
  job_title?: string;
  jd_match?: JdMatchData;
  cv_json?: CVData | null;
}

export type AnalysisType = "ats" | "jd";

interface CVPassStore {
  cvText: string;
  jobOffer: string;
  gaps: Gap[];
  score_avant: number;
  scoreActuel: number;
  resume: string;
  jobTitle: string;
  coverLetter: string;
  analysisType: AnalysisType;
  jdMatch: JdMatchData | null;
  cvJson: CVData | null;
  setCvText: (text: string) => void;
  setJobOffer: (offer: string) => void;
  setAnalysisType: (type: AnalysisType) => void;
  setAnalysis: (analysis: Analysis) => void;
  setCvJson: (cvJson: CVData) => void;
  acceptGap: (id: string) => void;
  ignoreGap: (id: string) => void;
  setCoverLetter: (text: string) => void;
  reset: () => void;
}

function recalculateScore(score_avant: number, gaps: Gap[]): number {
  if (gaps.length === 0) return score_avant;
  // Weighted ratio: high-impact suggestions count more toward the bonus
  const weights = { high: 3, medium: 2, low: 1 };
  let weightedAccepted = 0;
  let weightedTotal = 0;
  for (const g of gaps) {
    const w = weights[g.impact ?? "medium"];
    weightedTotal += w;
    if (g.status === "accepted") weightedAccepted += w;
  }
  const ratio = weightedTotal > 0 ? weightedAccepted / weightedTotal : 0;
  // Fill up to 65% of the remaining gap — never claim 100%
  // Ex: score_avant=38, gap=62, max bonus=62×0.65=40 → max score ~78
  // Ex: score_avant=55, gap=45, max bonus=45×0.65=29 → max score ~84
  const maxBonus = (100 - score_avant) * 0.65;
  return Math.round(score_avant + maxBonus * ratio);
}

export const useStore = create<CVPassStore>()(
  persist(
    (set, get) => ({
  cvText: "",
  jobOffer: "",
  gaps: [],
  score_avant: 0,
  scoreActuel: 0,
  resume: "",
  jobTitle: "",
  coverLetter: "",
  analysisType: "ats" as AnalysisType,
  jdMatch: null,
  cvJson: null,

  setCvText: (text) => set({ cvText: text }),
  setJobOffer: (offer) => set({ jobOffer: offer }),
  setAnalysisType: (type) => set({ analysisType: type }),
  setCvJson: (cvJson) => set({ cvJson }),

  setAnalysis: (analysis) => {
    const gaps: Gap[] = analysis.gaps.map((g) => ({ ...g, status: "pending" }));
    set({
      score_avant: analysis.score_avant,
      scoreActuel: analysis.score_avant,
      gaps,
      resume: analysis.resume,
      jobTitle: analysis.job_title ?? "",
      jdMatch: analysis.jd_match ?? null,
      cvJson: analysis.cv_json ? {
        ...analysis.cv_json,
        experiences: Array.isArray(analysis.cv_json.experiences) ? analysis.cv_json.experiences : [],
        formation: Array.isArray(analysis.cv_json.formation) ? analysis.cv_json.formation : [],
        competences: Array.isArray(analysis.cv_json.competences) ? analysis.cv_json.competences : [],
        centres_interet: Array.isArray(analysis.cv_json.centres_interet) ? analysis.cv_json.centres_interet : [],
        informations: Array.isArray(analysis.cv_json.informations) ? analysis.cv_json.informations : [],
      } : null,
    });
  },

  acceptGap: (id) => {
    const gaps = get().gaps.map((g) =>
      g.id === id ? { ...g, status: "accepted" as const } : g
    );
    // Apply the suggestion text to cvJson so CV display updates immediately
    const gap = get().gaps.find((g) => g.id === id);
    let cvJson = get().cvJson;
    if (gap && cvJson) {
      const orig = gap.texte_original?.trim();
      const suggested = gap.texte_suggere?.trim();

      if (orig && suggested) {
        // CAS 1 — Remplacement : texte original non vide
        // Normalise les espaces et compare de manière souple
        const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
        const origNorm = normalize(orig);

        const sub = (text: string) => {
          // Match exact
          if (text.includes(orig)) return text.replace(orig, suggested);
          // Match normalisé (espaces, casse)
          if (normalize(text).includes(origNorm)) {
            // Trouver la position dans le texte original via la version normalisée
            const idx = normalize(text).indexOf(origNorm);
            // Reconstruire en comptant les caractères réels
            let realIdx = 0, normIdx = 0;
            const textChars = text.split("");
            while (normIdx < idx && realIdx < textChars.length) {
              if (!/\s/.test(textChars[realIdx]) || (normIdx > 0 && !/\s/.test(normalize(text)[normIdx - 1]))) normIdx++;
              realIdx++;
            }
            // Fallback simple : si la mission ENTIÈRE est similaire, remplacer tout
            if (normalize(text) === origNorm) return suggested;
            return text.replace(text.substring(realIdx, realIdx + orig.length), suggested);
          }
          // Dernier recours : si >50% des mots significatifs matchent, remplacer
          const origWords = origNorm.split(" ").filter(w => w.length > 2);
          const textNorm = normalize(text);
          const matchCount = origWords.filter(w => textNorm.includes(w)).length;
          if (origWords.length > 0 && matchCount / origWords.length > 0.5) return suggested;
          return text;
        };

        cvJson = {
          ...cvJson,
          profil: cvJson.profil ? sub(cvJson.profil) : cvJson.profil,
          titre: cvJson.titre ? sub(cvJson.titre) : cvJson.titre,
          experiences: cvJson.experiences.map((exp) => ({
            ...exp,
            poste: sub(exp.poste),
            missions: exp.missions.map(sub),
          })),
          competences: cvJson.competences.map(sub),
        };
      } else if (!orig && suggested) {
        // CAS 2 — Insertion : section vide, on insère le contenu suggéré
        const cat = gap.category;
        if (cat === "accroche") {
          cvJson = { ...cvJson, profil: cvJson.profil ? cvJson.profil + "\n" + suggested : suggested };
        } else if (cat === "titre") {
          cvJson = { ...cvJson, titre: suggested };
        } else if (cat === "competence") {
          // Peut contenir plusieurs compétences séparées par des virgules
          const newComps = suggested.split(/,\s*/).map((s) => s.trim()).filter(Boolean);
          cvJson = { ...cvJson, competences: [...cvJson.competences, ...newComps] };
        } else if (cat === "experience") {
          // Ajoute comme mission à la première expérience, ou crée une expérience
          if (cvJson.experiences.length > 0) {
            cvJson = {
              ...cvJson,
              experiences: cvJson.experiences.map((exp, i) =>
                i === 0 ? { ...exp, missions: [...exp.missions, suggested] } : exp
              ),
            };
          }
        }
      }
    }
    set({ gaps, cvJson, scoreActuel: recalculateScore(get().score_avant, gaps) });
  },

  ignoreGap: (id) => {
    const gaps = get().gaps.map((g) =>
      g.id === id ? { ...g, status: "ignored" as const } : g
    );
    set({ gaps });
  },

  setCoverLetter: (text) => set({ coverLetter: text }),

  reset: () =>
    set({
      cvText: "",
      jobOffer: "",
      gaps: [],
      score_avant: 0,
      scoreActuel: 0,
      resume: "",
      jobTitle: "",
      coverLetter: "",
      analysisType: "ats" as AnalysisType,
      jdMatch: null,
      cvJson: null,
    }),
}),
    {
      name: "cvpass-session",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        }
        // Use localStorage with 24h auto-expiry for analysis persistence
        return {
          getItem: (name) => {
            const item = localStorage.getItem(name);
            if (!item) return null;
            try {
              const parsed = JSON.parse(item);
              if (parsed._expiresAt && Date.now() > parsed._expiresAt) {
                localStorage.removeItem(name);
                return null;
              }
              return item;
            } catch {
              return item;
            }
          },
          setItem: (name, value) => {
            try {
              const parsed = JSON.parse(value);
              parsed._expiresAt = Date.now() + 24 * 60 * 60 * 1000;
              localStorage.setItem(name, JSON.stringify(parsed));
            } catch {
              localStorage.setItem(name, value);
            }
          },
          removeItem: (name) => localStorage.removeItem(name),
        };
      }),
      partialize: (state) => ({
        cvText: state.cvText,
        jobOffer: state.jobOffer,
        gaps: state.gaps,
        score_avant: state.score_avant,
        scoreActuel: state.scoreActuel,
        resume: state.resume,
        jobTitle: state.jobTitle,
        coverLetter: state.coverLetter,
        analysisType: state.analysisType,
        jdMatch: state.jdMatch,
        cvJson: state.cvJson,
      }),
    }
  )
);
