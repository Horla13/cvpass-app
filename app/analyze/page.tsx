"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";
import { useStore } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";
import StepResumeSelect from "@/components/StepResumeSelect";
import StepAnalysisType from "@/components/StepAnalysisType";
import StepJobDescription from "@/components/StepJobDescription";
import AnalyzingModal from "@/components/AnalyzingModal";
import InsufficientCreditsModal from "@/components/InsufficientCreditsModal";

interface HistoryAnalysis {
  id: string;
  created_at: string;
  job_title: string | null;
  score_avant: number;
  score_apres: number;
  nb_suggestions: number;
  nb_acceptees: number;
}

type Step = "resume-selection" | "type" | "jd" | "analyzing";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR");
}

export default function AnalyzePageWrapper() {
  return (
    <Suspense>
      <AnalyzePage />
    </Suspense>
  );
}

function AnalyzePage() {
  const router = useRouter();
  useUser();
  const posthog = usePostHog();

  const setCvText = useStore((s) => s.setCvText);
  const cvText = useStore((s) => s.cvText);
  const setJobOffer = useStore((s) => s.setJobOffer);
  const setAnalysis = useStore((s) => s.setAnalysis);
  const setStoreAnalysisType = useStore((s) => s.setAnalysisType);

  const searchParams = useSearchParams();
  const initialStep = searchParams.get("step") as Step | null;
  const validSteps: Step[] = ["resume-selection", "type", "jd", "analyzing"];
  const [step, setStep] = useState<Step>(
    initialStep && validSteps.includes(initialStep) ? initialStep : "resume-selection"
  );
  const [analysisType, setAnalysisType] = useState<"ats" | "jd">("jd");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFilename, setSelectedFilename] = useState("");

  // Credits
  const [credits, setCredits] = useState(0);
  const [unlimited, setUnlimited] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [creditsNeeded, setCreditsNeeded] = useState(0);

  // History (for resume list)
  const [analyses, setAnalyses] = useState<HistoryAnalysis[]>([]);

  // If we arrive with step=type but have cvText, skip resume-selection
  useEffect(() => {
    if (initialStep === "type" && cvText) {
      setStep("type");
    }
  }, [initialStep, cvText]);

  // Load credits + history on mount
  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => {
        setCredits(d.credits ?? 0);
        setUnlimited(d.unlimited ?? false);
      })
      .catch(() => {});

    fetch("/api/history")
      .then((r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then((data) => {
        if (data?.analyses) setAnalyses(data.analyses);
      })
      .catch(() => {});
  }, []);

  // Build resume list from history
  const resumes = analyses.map((a) => ({
    id: a.id,
    filename: a.job_title ? `${a.job_title}` : "CV analysé",
    date: formatDate(a.created_at),
    analyzed: true,
  }));

  // Upload a new CV
  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Erreur upload");
      const data = await res.json();
      setCvText(data.text);
      setSelectedFilename(file.name);
      posthog?.capture("cv_uploaded");
      setStep("type");
    } catch {
      alert("Erreur lors de l'upload du CV. Vérifiez le format (PDF ou DOCX, max 5 Mo).");
    } finally {
      setIsUploading(false);
    }
  }, [setCvText, posthog]);

  // Select existing resume (re-analyze)
  const handleSelectResume = useCallback((id: string) => {
    const analysis = analyses.find((a) => a.id === id);
    if (analysis) {
      setSelectedFilename(analysis.job_title || "CV précédent");
      setStep("type");
    }
  }, [analyses]);

  // Choose analysis type
  const handleChooseType = (type: "ats" | "jd") => {
    setAnalysisType(type);
    setStoreAnalysisType(type);
    if (type === "jd") {
      setStep("jd");
    } else {
      runAnalysis("", type);
    }
  };

  // Submit JD and run analysis
  const handleSubmitJD = (jobOffer: string) => {
    setJobOffer(jobOffer);
    runAnalysis(jobOffer, "jd");
  };

  // Run the analysis
  const runAnalysis = async (jobOffer: string, type: "ats" | "jd") => {
    if (!cvText) {
      alert("Veuillez d'abord uploader un CV.");
      setStep("resume-selection");
      return;
    }

    setIsAnalyzing(true);
    setStep("analyzing");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          jobOffer: jobOffer || "Analyse ATS générale — vérifier la compatibilité avec les standards de recrutement.",
          analysisType: type,
        }),
      });

      if (res.status === 402) {
        const data = await res.json().catch(() => ({}));
        setCreditsNeeded(data.creditsNeeded ?? (type === "jd" ? 2 : 1));
        setShowCreditsModal(true);
        setIsAnalyzing(false);
        setStep("type");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = res.status === 504
          ? "L'analyse a pris trop de temps. Réessayez."
          : data.error ?? "Erreur lors de l'analyse. Réessayez.";
        alert(msg);
        setIsAnalyzing(false);
        setStep("type");
        return;
      }

      const data = await res.json();
      setAnalysis(data);
      posthog?.capture("analysis_completed", {
        score_avant: data.score_avant,
        nb_suggestions: data.gaps?.length ?? 0,
        job_title: data.job_title ?? "",
        analysis_type: type,
      });

      // Save analysis async
      fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score_avant: data.score_avant,
          score_apres: data.score_avant,
          nb_suggestions: data.gaps?.length ?? 0,
          nb_acceptees: 0,
          job_title: data.job_title ?? "",
        }),
      }).catch(() => {});

      router.push("/results");
    } catch {
      alert("Une erreur est survenue. Réessayez.");
      setIsAnalyzing(false);
      setStep("type");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#fafafa]">
        <AppHeader />

        <main className="max-w-5xl mx-auto px-6 py-12">
          {/* Step: Select Resume */}
          {step === "resume-selection" && (
            <StepResumeSelect
              resumes={resumes}
              onSelect={handleSelectResume}
              onUpload={handleUpload}
              isUploading={isUploading}
            />
          )}

          {/* Step: Choose Analysis Type */}
          {step === "type" && (
            <StepAnalysisType
              credits={credits}
              unlimited={unlimited}
              filename={selectedFilename}
              onChoose={handleChooseType}
              onBack={() => setStep("resume-selection")}
            />
          )}

          {/* Step: Job Description */}
          {step === "jd" && (
            <StepJobDescription
              onSubmit={handleSubmitJD}
              onBack={() => setStep("type")}
              isAnalyzing={isAnalyzing}
            />
          )}
        </main>

        {/* Analyzing modal overlay */}
        {step === "analyzing" && isAnalyzing && (
          <AnalyzingModal type={analysisType} />
        )}

        {/* Insufficient credits modal */}
        {showCreditsModal && (
          <InsufficientCreditsModal
            creditsNeeded={creditsNeeded}
            onClose={() => setShowCreditsModal(false)}
          />
        )}
      </div>
    </PageTransition>
  );
}
