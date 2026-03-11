"use client";

import { Gap } from "@/lib/store";

interface CVPreviewProps {
  cvText: string;
  acceptedGaps: Gap[];
}

export function CVPreview({ cvText, acceptedGaps }: CVPreviewProps) {
  let displayText = cvText;
  for (const gap of acceptedGaps) {
    const orig = gap.texte_original?.trim();
    if (orig && displayText.includes(orig)) {
      displayText = displayText.replace(orig, gap.texte_suggere);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-brand-black">Aperçu CV</span>
        {acceptedGaps.length > 0 && (
          <span className="text-xs text-brand-green font-medium">
            {acceptedGaps.length} modification
            {acceptedGaps.length > 1 ? "s" : ""} appliquée
            {acceptedGaps.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <pre className="text-xs text-brand-black whitespace-pre-wrap font-sans leading-relaxed">
          {displayText || (
            <span className="text-brand-gray italic">
              Votre CV apparaîtra ici après upload
            </span>
          )}
        </pre>
      </div>
    </div>
  );
}
