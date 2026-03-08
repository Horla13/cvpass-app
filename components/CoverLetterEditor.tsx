"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface CoverLetterEditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onDownloadPdf: (content: string) => Promise<void>;
  isSaving: boolean;
}

export function CoverLetterEditor({
  initialContent,
  onSave,
  onDownloadPdf,
  isSaving,
}: CoverLetterEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setContent(initialContent);
    setIsDirty(false);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(e.target.value !== initialContent);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barre d'état */}
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-sm text-brand-gray">
          {content.length} caractères
        </span>
        {isDirty && (
          <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">
            Modifié
          </span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        value={content}
        onChange={handleChange}
        className="flex-1 w-full min-h-[500px] p-4 border border-gray-200 rounded-xl text-sm text-brand-black font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
        placeholder="Votre lettre de motivation apparaîtra ici..."
        spellCheck={true}
        lang="fr"
      />

      {/* Barre d'actions */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
        >
          {copied ? "✓ Copié !" : "Copier"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onDownloadPdf(content)}
          className="flex-1"
        >
          Télécharger PDF
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onSave(content)}
          disabled={isSaving || content.trim().length < 50}
          className="flex-1"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sauvegarde...
            </span>
          ) : (
            "Sauvegarder"
          )}
        </Button>
      </div>
    </div>
  );
}
