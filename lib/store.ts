import { create } from "zustand";

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

interface Analysis {
  score_avant: number;
  gaps: Omit<Gap, "status">[];
  resume: string;
  job_title?: string;
}

interface CVPassStore {
  cvText: string;
  jobOffer: string;
  gaps: Gap[];
  score_avant: number;
  scoreActuel: number;
  resume: string;
  jobTitle: string;
  coverLetter: string;
  setCvText: (text: string) => void;
  setJobOffer: (offer: string) => void;
  setAnalysis: (analysis: Analysis) => void;
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

  setCvText: (text) => set({ cvText: text }),
  setJobOffer: (offer) => set({ jobOffer: offer }),

  setAnalysis: (analysis) => {
    const gaps: Gap[] = analysis.gaps.map((g) => ({ ...g, status: "pending" }));
    set({
      score_avant: analysis.score_avant,
      scoreActuel: analysis.score_avant,
      gaps,
      resume: analysis.resume,
      jobTitle: analysis.job_title ?? "",
    });
  },

  acceptGap: (id) => {
    const gaps = get().gaps.map((g) =>
      g.id === id ? { ...g, status: "accepted" as const } : g
    );
    set({ gaps, scoreActuel: recalculateScore(get().score_avant, gaps) });
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
    }),
}));
