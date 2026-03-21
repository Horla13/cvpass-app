/**
 * @jest-environment jsdom
 */
import { act } from "@testing-library/react";
import { useStore } from "./store";

// Reset store before each test
beforeEach(() => {
  useStore.getState().reset();
});

describe("CVpass store — score recalculation", () => {
  test("score stays at score_avant when no gap accepted", () => {
    act(() => {
      useStore.getState().setAnalysis({
        score_avant: 40,
        gaps: [
          { id: "1", section: "Expérience", texte_original: "a", texte_suggere: "b", raison: "r" },
          { id: "2", section: "Compétences", texte_original: "c", texte_suggere: "d", raison: "r" },
        ],
        resume: "Test résumé",
      });
    });

    expect(useStore.getState().scoreActuel).toBe(40);
  });

  test("score increases when 1 of 2 gaps accepted", () => {
    act(() => {
      useStore.getState().setAnalysis({
        score_avant: 40,
        gaps: [
          { id: "1", section: "Expérience", texte_original: "a", texte_suggere: "b", raison: "r" },
          { id: "2", section: "Compétences", texte_original: "c", texte_suggere: "d", raison: "r" },
        ],
        resume: "Test",
      });
    });

    act(() => {
      useStore.getState().acceptGap("1");
    });

    // New formula: 65% of gap, weighted by impact (default medium=2)
    // weightedAccepted=2, weightedTotal=4, ratio=0.5, maxBonus=60*0.65=39, score=40+39*0.5=60
    expect(useStore.getState().scoreActuel).toBe(60);
  });

  test("score reaches max when all gaps accepted", () => {
    act(() => {
      useStore.getState().setAnalysis({
        score_avant: 50,
        gaps: [
          { id: "1", section: "Expérience", texte_original: "a", texte_suggere: "b", raison: "r" },
        ],
        resume: "Test",
      });
    });

    act(() => {
      useStore.getState().acceptGap("1");
    });

    // New formula: 65% of gap, weighted by impact (default medium=2)
    // ratio=1, maxBonus=50*0.65=32.5, score=50+33=83
    expect(useStore.getState().scoreActuel).toBe(83);
  });
});

describe("CVpass store — gap status management", () => {
  test("ignored gap has status 'ignored'", () => {
    act(() => {
      useStore.getState().setAnalysis({
        score_avant: 50,
        gaps: [{ id: "1", section: "Exp", texte_original: "a", texte_suggere: "b", raison: "r" }],
        resume: "Test",
      });
    });

    act(() => {
      useStore.getState().ignoreGap("1");
    });

    const gap = useStore.getState().gaps.find((g) => g.id === "1");
    expect(gap?.status).toBe("ignored");
  });

  test("ignored gaps are NOT counted in score formula", () => {
    act(() => {
      useStore.getState().setAnalysis({
        score_avant: 40,
        gaps: [
          { id: "1", section: "Exp", texte_original: "a", texte_suggere: "b", raison: "r" },
          { id: "2", section: "Exp", texte_original: "c", texte_suggere: "d", raison: "r" },
        ],
        resume: "Test",
      });
    });

    act(() => {
      useStore.getState().ignoreGap("1");
    });

    // Score should not change on ignore
    expect(useStore.getState().scoreActuel).toBe(40);
  });

  test("reset clears all state", () => {
    act(() => {
      useStore.getState().setCvText("mon CV");
      useStore.getState().setJobOffer("une offre");
    });

    act(() => {
      useStore.getState().reset();
    });

    const state = useStore.getState();
    expect(state.cvText).toBe("");
    expect(state.jobOffer).toBe("");
    expect(state.gaps).toHaveLength(0);
    expect(state.scoreActuel).toBe(0);
  });
});

describe("CVpass store — cover letter", () => {
  test("coverLetter is empty string by default", () => {
    act(() => {
      useStore.getState().reset();
    });
    expect(useStore.getState().coverLetter).toBe("");
  });

  test("setCoverLetter updates the store", () => {
    act(() => {
      useStore.getState().setCoverLetter("Ma lettre de motivation...");
    });
    expect(useStore.getState().coverLetter).toBe("Ma lettre de motivation...");
  });

  test("reset clears coverLetter", () => {
    act(() => {
      useStore.getState().setCoverLetter("Une lettre");
    });
    act(() => {
      useStore.getState().reset();
    });
    expect(useStore.getState().coverLetter).toBe("");
  });
});
