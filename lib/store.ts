import { create } from "zustand";
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
  const total = gaps.length;
  if (total === 0) return score_avant;
  const accepted = gaps.filter((g) => g.status === "accepted").length;
  return Math.round(score_avant + (accepted / total) * (100 - score_avant));
}

export const useStore = create<CVPassStore>((set, get) => ({
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
        // CAS 1 — Remplacement : texte original non vide → str.replace()
        const sub = (text: string) => (text.includes(orig) ? text.replace(orig, suggested) : text);
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
}));
