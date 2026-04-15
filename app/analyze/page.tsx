"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { usePostHog } from "posthog-js/react";
import { useStore } from "@/lib/store";
import { AppHeader } from "@/components/AppHeader";
import { PageTransition } from "@/components/PageTransition";
import StepAnalysisType from "@/components/StepAnalysisType";
import StepJobDescription from "@/components/StepJobDescription";
import AnalyzingModal from "@/components/AnalyzingModal";
import InsufficientCreditsModal from "@/components/InsufficientCreditsModal";
import { DiscoveryModal, useDiscoveryModal } from "@/components/DiscoveryModal";

type Step = "upload" | "type" | "jd" | "jd-letter" | "analyzing";

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
  const [step, setStep] = useState<Step>(
    initialStep === "type" && cvText ? "type" : "upload"
  );
  const [analysisType, setAnalysisType] = useState<"ats" | "jd">("jd");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFilename, setSelectedFilename] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Discovery modal
  const discovery = useDiscoveryModal();

  // Credits
  const [credits, setCredits] = useState(0);
  const [unlimited, setUnlimited] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [creditsNeeded, setCreditsNeeded] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  // Load credits on mount
  useEffect(() => {
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => {
        setCredits(d.credits ?? 0);
        setUnlimited(d.unlimited ?? false);
      })
      .catch(() => {});
  }, []);

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
      if (window.innerWidth < 768) {
        posthog?.capture("mobile_upload_started");
      }
      setStep("type");
    } catch {
      setErrorMsg("Erreur lors de l'upload du CV. Vérifiez le format (PDF ou DOCX, max 5 Mo).");
    } finally {
      setIsUploading(false);
    }
  }, [setCvText, posthog]);

  // Choose analysis type
  const handleChooseType = (type: "ats" | "jd" | "letter") => {
    if (type === "letter") {
      setStep("jd-letter");
      return;
    }
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

  // Submit JD for cover letter generation
  const handleSubmitJDForLetter = (jobOffer: string) => {
    setJobOffer(jobOffer);
    router.push("/cover-letter");
  };

  // Run the analysis
  const runAnalysis = async (jobOffer: string, type: "ats" | "jd") => {
    if (!cvText) {
      setErrorMsg("Veuillez d'abord uploader un CV.");
      setStep("upload");
      return;
    }

    if (cvText.length > 50_000) {
      setErrorMsg("CV trop long (max 50 000 caractères).");
      return;
    }
    if (jobOffer.length > 10_000) {
      setErrorMsg("Offre trop longue (max 10 000 caractères).");
      return;
    }

    setIsAnalyzing(true);
    setStep("analyzing");
    discovery.trigger();

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
        setErrorMsg(msg);
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
      }).catch((e: unknown) => console.error("save-analysis error:", e));

      localStorage.setItem("cvpass_analyzed", "1");
      router.push("/results");
    } catch {
      setErrorMsg("Une erreur est survenue. Réessayez.");
      setIsAnalyzing(false);
      setStep("type");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#fafafa]">
        <AppHeader />

        <main className="max-w-5xl mx-auto px-4 md:px-6 py-12">
          {errorMsg && (
            <div className="max-w-[600px] mx-auto mb-6 flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-[14px]">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg("")} className="text-red-400 hover:text-red-600 flex-shrink-0" aria-label="Fermer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          )}
          {/* Welcome banner — first visit only */}
          {step === "upload" && typeof window !== "undefined" && !localStorage.getItem("cvpass_analyzed") && (
            <div className="max-w-[600px] mx-auto mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 text-center">
              <p className="text-[15px] text-green-800 font-semibold">Bienvenue ! Uploadez votre CV et obtenez votre score en 30 secondes.</p>
              <p className="text-[13px] text-green-600 mt-1">C&apos;est gratuit, 1 analyse offerte, sans carte de cr&eacute;dit.</p>
            </div>
          )}

          {/* Step: Upload CV */}
          {step === "upload" && (
            <div className="max-w-[600px] mx-auto text-center">
              <h1 className="font-display text-[32px] font-extrabold tracking-[-1.5px] mb-2">
                Uploadez votre CV
              </h1>
              <p className="text-brand-gray mb-8">
                Choisissez votre CV au format PDF ou DOCX pour commencer l&apos;analyse.
              </p>

              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />

              <button
                onClick={() => fileRef.current?.click()}
                disabled={isUploading}
                className="w-full max-w-[400px] mx-auto border-2 border-dashed border-gray-300 rounded-xl p-10 min-h-[48px] text-center hover:border-brand-green/50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3">
                  {isUploading ? (
                    <>
                      <svg className="animate-spin h-8 w-8 text-brand-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      <span className="text-[15px] font-medium text-brand-gray">Upload en cours...</span>
                    </>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span className="text-[16px] font-semibold text-gray-700">Choisir mon CV (PDF ou DOCX)</span>
                      <span className="text-[13px] text-brand-gray">Taille max : 5 Mo</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Step: Choose Analysis Type */}
          {step === "type" && (
            <StepAnalysisType
              credits={credits}
              unlimited={unlimited}
              filename={selectedFilename}
              onChoose={handleChooseType}
              onBack={() => setStep("upload")}
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

          {/* Step: Job Description for Cover Letter */}
          {step === "jd-letter" && (
            <StepJobDescription
              onSubmit={handleSubmitJDForLetter}
              onBack={() => setStep("type")}
              isAnalyzing={false}
              title="Collez l&apos;offre d&apos;emploi"
              subtitle="Votre lettre de motivation sera personnalisée en fonction de cette offre."
              buttonLabel="Générer la lettre de motivation"
            />
          )}
        </main>

        {/* Analyzing modal overlay */}
        {step === "analyzing" && isAnalyzing && (
          <AnalyzingModal type={analysisType} />
        )}

        {/* Discovery modal */}
        {discovery.show && <DiscoveryModal onClose={discovery.close} />}

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
