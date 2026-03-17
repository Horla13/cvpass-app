"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

interface CoverLetterEditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onDownloadPdf: (content: string) => Promise<void>;
  isSaving: boolean;
  defaultEmail?: string;
}

export function CoverLetterEditor({
  initialContent,
  onSave,
  onDownloadPdf,
  isSaving,
  defaultEmail = "",
}: CoverLetterEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailAddr, setEmailAddr] = useState(defaultEmail);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [emailErr, setEmailErr] = useState("");

  useEffect(() => {
    setContent(initialContent);
    setIsDirty(false);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(e.target.value !== initialContent);
  };

  const handleSendEmail = async () => {
    setSending(true);
    setEmailErr("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "letter", email: emailAddr, letterContent: content }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "Erreur d'envoi");
      }
      setSent(true);
    } catch (e: unknown) {
      setEmailErr(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSending(false);
    }
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
        className="flex-1 w-full min-h-[500px] p-4 border border-gray-200 rounded-xl text-base text-brand-black bg-white font-mono leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-brand-green"
        placeholder="Votre lettre de motivation apparaîtra ici..."
        spellCheck={true}
        lang="fr"
      />

      {/* Barre d'actions */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <Button variant="secondary" size="sm" onClick={handleCopy} className="flex-1">
          {copied ? "✓ Copié !" : "Copier"}
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onDownloadPdf(content)} className="flex-1">
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
          ) : "Sauvegarder"}
        </Button>
      </div>

      {/* Email section */}
      <div className="mt-3">
        <button
          onClick={() => { setEmailOpen((v) => !v); setSent(false); setEmailErr(""); }}
          className="text-sm text-brand-gray hover:text-brand-black underline underline-offset-2 transition-colors"
        >
          Envoyer par email
        </button>
        {emailOpen && (
          <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            {sent ? (
              <p className="text-sm text-green-700 font-medium text-center">✅ Envoyé à {emailAddr}</p>
            ) : (
              <>
                <input
                  type="email"
                  value={emailAddr}
                  onChange={(e) => setEmailAddr(e.target.value)}
                  className="w-full px-3 py-2 text-base border border-gray-200 bg-white text-brand-black rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green"
                  placeholder="votre@email.com"
                />
                {emailErr && <p className="text-xs text-red-500">{emailErr}</p>}
                <button
                  onClick={handleSendEmail}
                  disabled={sending || !emailAddr}
                  className="w-full py-2 rounded-lg bg-brand-green text-white text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {sending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Envoyer"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
