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
};

interface SuggestionCardProps {
  gap: Gap;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
}

export function SuggestionCard({ gap, onAccept, onIgnore }: SuggestionCardProps) {
  const color: BadgeColor = SECTION_COLORS[gap.section] ?? "gray";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Badge color={color}>{gap.section}</Badge>
      </div>

      <div>
        <p className="text-xs text-brand-gray mb-1 uppercase tracking-wide font-medium">
          Texte actuel
        </p>
        <p className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-brand-black border border-gray-100">
          {gap.texte_original}
        </p>
      </div>

      <div>
        <p className="text-xs text-brand-gray mb-1 uppercase tracking-wide font-medium">
          Suggestion
        </p>
        <p className="bg-green-50 rounded-lg px-3 py-2 text-sm text-green-900 border border-green-100">
          {gap.texte_suggere}
        </p>
      </div>

      <p className="text-xs text-brand-gray italic">{gap.raison}</p>

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
