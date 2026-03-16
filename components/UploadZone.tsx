"use client";

import { useCallback, useState } from "react";
import { useStore } from "@/lib/store";

interface UploadZoneProps {
  onSuccess: () => void;
}

export function UploadZone({ onSuccess }: UploadZoneProps) {
  const setCvText = useStore((s) => s.setCvText);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "image_pdf">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [showLinkedInGuide, setShowLinkedInGuide] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.match(/\.(pdf|docx)$/i)) {
        setErrorMsg("Format non supporté. Utilisez PDF ou DOCX.");
        setStatus("error");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Fichier trop lourd (max 5 Mo).");
        setStatus("error");
        return;
      }

      setStatus("loading");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erreur lors de l'analyse");
        }
        const { text } = await res.json();

        if (text.trim().length < 100 && file.size > 50 * 1024) {
          setExtractedText(text);
          setStatus("image_pdf");
          return;
        }

        setCvText(text);
        setStatus("success");
        onSuccess();
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Une erreur est survenue.";
        setErrorMsg(msg);
        setStatus("error");
      }
    },
    [setCvText, onSuccess]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-xl border-2 border-dashed transition-all duration-200 ${
        status === "idle" || status === "loading" ? "cursor-pointer" : ""
      } ${
        isDragging
          ? "border-brand-green bg-green-50 scale-[1.01]"
          : status === "success"
          ? "border-brand-green bg-green-50"
          : status === "error"
          ? "border-red-300 bg-red-50"
          : status === "image_pdf"
          ? "border-orange-300 bg-orange-50"
          : "border-gray-200 hover:border-brand-green hover:bg-gray-50"
      }`}
    >
      {(status === "idle" || status === "loading") && (
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      )}

      <div className="flex flex-col items-center justify-center py-10 px-6 text-center gap-3">

        {/* IDLE */}
        {status === "idle" && (
          <>
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-black">
                Déposez votre CV ici
              </p>
              <p className="text-xs text-brand-gray mt-1">
                ou <span className="text-brand-green font-medium">cliquez pour parcourir</span>
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs text-brand-gray font-medium">PDF</span>
              <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs text-brand-gray font-medium">DOCX</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-brand-gray">Max 5 Mo</span>
            </div>

            {/* LinkedIn import hint */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowLinkedInGuide(v => !v); }}
              className="mt-2 flex items-center gap-1.5 text-[12px] text-[#0077b5] hover:underline font-medium cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              Importer depuis LinkedIn
            </button>
            {showLinkedInGuide && (
              <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-left text-[12px] text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs" onClick={(e) => e.stopPropagation()}>
                <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1.5">Exporter votre profil LinkedIn en PDF :</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Ouvrez votre profil LinkedIn</li>
                  <li>Cliquez sur <strong>Plus</strong> (sous la photo)</li>
                  <li>Sélectionnez <strong>Enregistrer au format PDF</strong></li>
                  <li>Uploadez le PDF ici</li>
                </ol>
              </div>
            )}
          </>
        )}

        {/* LOADING */}
        {status === "loading" && (
          <>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-black">Lecture du CV…</p>
              <p className="text-xs text-brand-gray mt-1">Extraction du contenu en cours</p>
            </div>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-black">CV chargé avec succès</p>
              <p className="text-xs text-brand-gray mt-1">Collez maintenant l&apos;offre d&apos;emploi ci-dessous</p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-brand-gray hover:text-brand-green underline underline-offset-2 transition-colors cursor-pointer"
            >
              Changer de fichier
            </button>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-600">{errorMsg}</p>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-brand-green font-medium hover:underline cursor-pointer"
            >
              Réessayer
            </button>
          </>
        )}

        {/* IMAGE PDF */}
        {status === "image_pdf" && (
          <>
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="max-w-xs">
              <p className="text-sm font-semibold text-orange-700">CV au format image détecté</p>
              <p className="text-xs text-brand-gray mt-1.5 leading-relaxed">
                Les ATS ne peuvent pas lire ce fichier. Exportez votre CV en PDF texte depuis Word, LibreOffice ou Google Docs.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 mt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStatus("idle");
                  setErrorMsg("");
                }}
                className="text-sm text-brand-green font-medium hover:underline cursor-pointer"
              >
                Choisir un autre fichier
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCvText(extractedText);
                  setStatus("success");
                  onSuccess();
                }}
                className="text-xs text-brand-gray hover:text-brand-black underline underline-offset-2 cursor-pointer"
              >
                Continuer quand même
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
