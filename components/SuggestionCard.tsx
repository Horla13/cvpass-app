"use client";

import { Gap } from "@/lib/store";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

type BadgeColor = "green" | "blue" | "orange" | "purple" | "gray";

const SECTION_COLORS: Record<string, BadgeColor> = {
  Expérience: "blue",
  Compétences: "green",
  Formation: "orange",
  Profil: "purple",
  Titre: "purple",
};

const IMPACT_CONFIG = {
  high: { label: "Impact fort", className: "bg-red-100 text-red-700 border-red-200" },
  medium: { label: "Impact moyen", className: "bg-amber-100 text-amber-700 border-amber-200" },
  low: { label: "Impact faible", className: "bg-green-100 text-green-700 border-green-200" },
} as const;

interface SuggestionCardProps {
  gap: Gap;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
}

export function SuggestionCard({ gap, onAccept, onIgnore }: SuggestionCardProps) {
  const color: BadgeColor = SECTION_COLORS[gap.section] ?? "gray";
  const impact = gap.impact && IMPACT_CONFIG[gap.impact];

  return (
    <div className="bg-white rounded-[14px] border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Badge color={color}>{gap.section}</Badge>
        {impact && (
          <span className={`inline-flex items-center text-[11px] font-semibold px-2 py-0.5 rounded-full border ${impact.className}`}>
            {impact.label}
          </span>
        )}
      </div>

      {gap.texte_original ? (
        <div>
          <p className="text-xs text-brand-gray mb-1 uppercase tracking-wide font-medium">
            Texte actuel
          </p>
          <p className="bg-red-50 rounded-lg px-3 py-2 text-sm text-red-800 border border-red-100 line-through decoration-red-300">
            {gap.texte_original}
          </p>
        </div>
      ) : (
        <p className="text-xs text-brand-gray italic">Élément absent du CV, à ajouter</p>
      )}

      <div>
        <p className="text-xs text-brand-gray mb-1 uppercase tracking-wide font-medium">
          Suggestion
        </p>
        <p className="bg-green-50 rounded-lg px-3 py-2 text-sm text-green-900 border border-green-100 font-medium">
          {gap.texte_suggere}
        </p>
      </div>

      <p className="text-xs text-brand-gray leading-relaxed">
        <span className="font-semibold">Pourquoi :</span> {gap.raison}
      </p>

      <div className="flex gap-2 pt-1">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAccept(gap.id)}
          className="flex-1"
        >
          ✓ Accepter
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onIgnore(gap.id)}
          className="flex-1"
        >
          ✗ Ignorer
        </Button>
      </div>
    </div>
  );
}
