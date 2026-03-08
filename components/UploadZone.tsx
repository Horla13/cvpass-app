"use client";

import { useCallback, useState } from "react";
import { useStore } from "@/lib/store";

interface UploadZoneProps {
  onSuccess: () => void;
}

export function UploadZone({ onSuccess }: UploadZoneProps) {
  const setCvText = useStore((s) => s.setCvText);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
        status === "idle" || status === "loading"
          ? "cursor-pointer"
          : ""
      } ${
        isDragging
          ? "border-brand-green bg-green-50"
          : "border-gray-300 hover:border-brand-green"
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

      {status === "idle" && (
        <>
          <div className="text-4xl mb-3">📄</div>
          <p className="text-brand-black font-medium">Déposez votre CV ici</p>
          <p className="text-brand-gray text-sm mt-1">ou cliquez pour parcourir</p>
          <p className="text-brand-gray text-xs mt-3">PDF ou DOCX — Max 5 Mo</p>
        </>
      )}

      {status === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
          <p className="text-brand-gray text-sm">Analyse du CV en cours...</p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">✅</div>
          <p className="text-brand-black font-medium">CV reçu et analysé</p>
          <p className="text-brand-gray text-sm">
            Vous pouvez maintenant coller l&apos;offre d&apos;emploi
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="flex flex-col items-center gap-2">
          <div className="text-4xl">❌</div>
          <p className="text-red-600 font-medium">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="text-brand-green text-sm underline mt-1"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
