"use client";

import { useState } from "react";
import { CV_TEMPLATES, type CvTemplate } from "@/lib/cv-templates";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  isPremiumUser: boolean;
}

export function TemplateSelector({ selectedId, onSelect, isPremiumUser }: TemplateSelectorProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <h3 className="font-display text-[15px] font-bold text-gray-800">Choisissez votre template</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CV_TEMPLATES.map((tpl) => (
          <TemplateCard
            key={tpl.id}
            template={tpl}
            selected={selectedId === tpl.id}
            hovered={hoveredId === tpl.id}
            locked={tpl.premium && !isPremiumUser}
            onSelect={() => {
              if (!tpl.premium || isPremiumUser) onSelect(tpl.id);
            }}
            onHover={() => setHoveredId(tpl.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template: tpl,
  selected,
  hovered,
  locked,
  onSelect,
  onHover,
  onLeave,
}: {
  template: CvTemplate;
  selected: boolean;
  hovered: boolean;
  locked: boolean;
  onSelect: () => void;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        "relative flex flex-col items-center p-3 rounded-xl border-2 transition-all text-left",
        selected
          ? "border-green-500 bg-green-50"
          : hovered && !locked
          ? "border-gray-300 bg-gray-50"
          : "border-gray-200 bg-white",
        locked && "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Mini preview */}
      <div className="w-full h-16 rounded-lg mb-2 border border-gray-100 flex flex-col items-start justify-center px-2 gap-0.5" style={{ background: "#fafafa" }}>
        <div className="h-2 rounded-full w-12" style={{ background: tpl.colors.heading }} />
        <div className="h-1 rounded-full w-16 bg-gray-200" />
        <div className="h-1.5 rounded-full w-full mt-1" style={{ background: tpl.colors.primary, opacity: 0.3 }} />
        <div className="h-1 rounded-full w-14 bg-gray-200" />
        <div className="h-1 rounded-full w-10 bg-gray-200" />
      </div>

      <p className="text-[12px] font-semibold text-gray-800">{tpl.name}</p>
      <p className="text-[10px] text-gray-400">{tpl.atsScore}% ATS</p>

      {locked && (
        <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
          PRO
        </span>
      )}

      {selected && (
        <span className="absolute top-1.5 left-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>
      )}
    </button>
  );
}
