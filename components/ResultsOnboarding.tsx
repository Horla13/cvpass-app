"use client";

import { useState, useEffect } from "react";

const STEPS = [
  {
    title: "Votre score ATS",
    desc: "Ce score mesure la compatibilite de votre CV avec les logiciels de recrutement.",
    position: "top-left",
  },
  {
    title: "Acceptez ou rejetez",
    desc: "Pour chaque suggestion, cliquez Accepter pour l'appliquer ou Ignorer pour passer. Votre score remonte en temps reel.",
    position: "center",
  },
  {
    title: "Telechargez votre CV",
    desc: "Une fois les suggestions traitees, telechargez votre CV optimise au format PDF.",
    position: "bottom-right",
  },
];

export function ResultsOnboarding() {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("cvpass_onboarding_done")) return;
    // Delay slightly so the page renders first
    const t = setTimeout(() => setStep(0), 800);
    return () => clearTimeout(t);
  }, []);

  const handleNext = () => {
    if (step >= STEPS.length - 1) {
      setStep(-1);
      localStorage.setItem("cvpass_onboarding_done", "1");
    } else {
      setStep(step + 1);
    }
  };

  const handleSkip = () => {
    setStep(-1);
    localStorage.setItem("cvpass_onboarding_done", "1");
  };

  if (step < 0) return null;

  const current = STEPS[step];

  return (
    <div className="fixed inset-0 z-[60]" onClick={handleNext}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Tooltip */}
      <div
        className={`absolute z-10 bg-white rounded-2xl shadow-2xl p-6 max-w-[340px] w-[90vw] ${
          step === 0 ? "top-[140px] left-4 sm:left-[5%]" :
          step === 1 ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :
          "bottom-[120px] right-4 sm:right-[5%]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-7 h-7 rounded-full bg-green-500 text-white text-[13px] font-bold flex items-center justify-center">
            {step + 1}
          </span>
          <h3 className="font-bold text-gray-900 text-[16px]">{current.title}</h3>
        </div>
        <p className="text-[14px] text-gray-500 leading-relaxed mb-4">{current.desc}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-[14px] min-h-[44px] px-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            Passer
          </button>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === step ? "bg-green-500" : "bg-gray-200"}`} />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="px-5 py-2.5 min-h-[44px] bg-green-500 text-white text-[14px] font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              {step === STEPS.length - 1 ? "Compris !" : "Suivant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
