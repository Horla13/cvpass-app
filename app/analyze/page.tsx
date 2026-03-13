"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";

const STEPS = [
  "Extraction du texte du CV...",
  "Analyse de l'expérience professionnelle...",
  "Vérification de la compatibilité ATS...",
];

export default function AnalyzePage() {
  const router = useRouter();
  const cvText = useStore((s) => s.cvText);
  const [currentStep, setCurrentStep] = useState(0);
  const redirected = useRef(false);

  // Animate steps then redirect to dashboard type selection
  useEffect(() => {
    if (!cvText) {
      router.replace("/dashboard");
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          if (!redirected.current) {
            redirected.current = true;
            router.replace("/dashboard?step=type");
          }
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [cvText, router]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <AppHeader />

      <main className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-5 py-2 text-[13px] text-green-700 font-semibold mb-8">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          Analyse IA en cours
        </div>

        {/* Animated icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center animate-pulse">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-green">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
          </div>
          {/* Spinning ring */}
          <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-transparent border-t-brand-green animate-spin" />
        </div>

        <h1 className="font-display text-[24px] md:text-[28px] font-extrabold tracking-tight text-gray-900 mb-3">
          Traitement de votre CV
        </h1>

        <p className="text-brand-gray text-[15px] mb-8">{STEPS[currentStep]}</p>

        {/* Step dots */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-brand-green scale-110" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
