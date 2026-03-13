"use client";
import { useRef } from "react";

interface ResumeItem {
  id: string;
  filename: string;
  date: string;
  analyzed: boolean;
}

interface Props {
  resumes: ResumeItem[];
  onSelect: (id: string) => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export default function StepResumeSelect({ resumes, onSelect, onUpload, isUploading }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-[700px] mx-auto">
      <h1 className="font-display text-[32px] font-extrabold tracking-[-1.5px] text-center mb-2">
        Sélectionnez un CV
      </h1>
      <p className="text-brand-gray text-center mb-8">
        Choisissez parmi vos CVs précédents
      </p>

      {/* Liste des CVs existants */}
      {resumes.length > 0 && (
        <div className="space-y-3 mb-6">
          {resumes.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-brand-green/50 hover:shadow-sm transition-all text-left"
            >
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[15px] truncate">{r.filename}</div>
                <div className="flex items-center gap-2 text-[13px] text-brand-gray">
                  <span>{r.date}</span>
                  {r.analyzed && (
                    <span className="text-brand-green flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      Déjà analysé
                    </span>
                  )}
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          ))}
        </div>
      )}

      {/* Séparateur */}
      {resumes.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[13px] text-brand-gray">ou</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      )}

      {/* Upload */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={isUploading}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-green/50 transition-colors disabled:opacity-50"
      >
        <div className="flex items-center justify-center gap-2 text-[15px] font-medium text-brand-gray">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          {isUploading ? "Upload en cours..." : "Uploader un nouveau CV"}
        </div>
      </button>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
    </div>
  );
}
