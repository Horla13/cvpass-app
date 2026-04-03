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
      <h3 className="font-display text-[15px] font-bold text-gray-800">Template du CV</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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

/** Mini layout preview matching real PDF structure */
function LayoutPreview({ tpl }: { tpl: CvTemplate }) {
  const p = tpl.colors.primary;
  const h = tpl.colors.headerBg;
  const isLight = h === "#ffffff" || h === "#faf5ff" || h === "#f0f9ff";

  if (tpl.layout === "sidebar") {
    return (
      <div className="w-full h-20 rounded-md border border-gray-100 flex overflow-hidden" style={{ background: "#fff" }}>
        {/* Sidebar */}
        <div className="w-[30%] h-full flex flex-col items-center gap-1 py-2" style={{ background: tpl.colors.sidebarBg || "#f1f5f9" }}>
          <div className="w-5 h-5 rounded-full" style={{ background: p, opacity: 0.3 }} />
          <div className="w-6 h-0.5 rounded-full" style={{ background: p, opacity: 0.5 }} />
          <div className="w-8 h-0.5 rounded-full bg-gray-300" />
          <div className="w-7 h-0.5 rounded-full bg-gray-300" />
          <div className="w-6 h-0.5 rounded-full bg-gray-300" />
        </div>
        {/* Main */}
        <div className="flex-1 flex flex-col gap-1 py-2 px-2">
          <div className="h-2 rounded-full w-14" style={{ background: p }} />
          <div className="h-1 rounded-full w-10 bg-gray-200" />
          <div className="h-0.5 mt-1 rounded-full w-full" style={{ background: p, opacity: 0.3 }} />
          <div className="h-1 rounded-full w-12 bg-gray-200" />
          <div className="h-1 rounded-full w-10 bg-gray-200" />
        </div>
      </div>
    );
  }

  if (tpl.layout === "banner") {
    return (
      <div className="w-full h-20 rounded-md border border-gray-100 flex flex-col overflow-hidden" style={{ background: "#fff" }}>
        <div className="w-full h-7 flex items-center px-2 gap-2" style={{ background: h }}>
          <div className="h-2 rounded-full w-12 bg-white/80" />
          <div className="h-1 rounded-full w-8 bg-white/40 ml-auto" />
        </div>
        <div className="flex-1 flex flex-col gap-1 py-1.5 px-2">
          <div className="h-1.5 rounded-full w-10" style={{ background: p }} />
          <div className="h-1 rounded-full w-full bg-gray-200" />
          <div className="h-1 rounded-full w-14 bg-gray-200" />
          <div className="h-1 rounded-full w-11 bg-gray-200" />
        </div>
      </div>
    );
  }

  if (tpl.layout === "timeline") {
    return (
      <div className="w-full h-20 rounded-md border border-gray-100 flex flex-col overflow-hidden" style={{ background: "#fff" }}>
        <div className="flex items-center gap-1 px-2 py-1.5">
          <div className="w-0.5 h-6 rounded-full" style={{ background: p }} />
          <div className="flex flex-col gap-0.5 ml-1">
            <div className="h-2 rounded-full w-14" style={{ background: tpl.colors.heading }} />
            <div className="h-1 rounded-full w-10 bg-gray-300" />
          </div>
        </div>
        <div className="flex-1 flex gap-1 px-2 pb-1.5">
          <div className="flex flex-col items-center gap-1 w-3">
            <div className="w-2 h-2 rounded-full" style={{ background: p }} />
            <div className="w-0.5 flex-1" style={{ background: p, opacity: 0.4 }} />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-1 rounded-full w-12 bg-gray-300" />
            <div className="h-1 rounded-full w-full bg-gray-200" />
            <div className="h-1 rounded-full w-10 bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  // Single column
  return (
    <div className="w-full h-20 rounded-md border border-gray-100 flex flex-col overflow-hidden" style={{ background: "#fff" }}>
      {!isLight ? (
        <div className="w-full h-5 flex items-center px-2" style={{ background: h }}>
          <div className="h-1.5 rounded-full w-10" style={{ background: tpl.colors.heading === "#111827" ? "#fff" : tpl.colors.heading }} />
        </div>
      ) : (
        <div className="px-2 pt-1.5">
          <div className="h-2 rounded-full w-12" style={{ background: tpl.colors.heading }} />
        </div>
      )}
      <div className="flex-1 flex flex-col gap-1 py-1 px-2">
        <div className="h-1 rounded-full w-full" style={{ background: p, opacity: 0.3 }} />
        <div className="h-1 rounded-full w-14 bg-gray-200" />
        <div className="h-1 rounded-full w-12 bg-gray-200" />
        {tpl.competenceStyle === "grid" && (
          <div className="flex gap-1 mt-0.5">
            <div className="h-2 rounded border border-gray-200 flex-1" />
            <div className="h-2 rounded border border-gray-200 flex-1" />
            <div className="h-2 rounded border border-gray-200 flex-1" />
          </div>
        )}
        {tpl.competenceStyle === "tags" && (
          <div className="flex gap-0.5 mt-0.5">
            <div className="h-2 rounded border border-gray-200 w-5" />
            <div className="h-2 rounded border border-gray-200 w-6" />
            <div className="h-2 rounded border border-gray-200 w-4" />
          </div>
        )}
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
        "relative flex flex-col items-center p-2 rounded-xl border-2 transition-all text-left",
        selected
          ? "border-green-500 bg-green-50/50"
          : hovered && !locked
          ? "border-gray-300 bg-gray-50"
          : "border-gray-200 bg-white",
        locked && "opacity-60 cursor-not-allowed"
      )}
    >
      <LayoutPreview tpl={tpl} />
      <p className="text-[11px] font-semibold text-gray-800 mt-1.5">{tpl.name}</p>
      <p className="text-[9px] text-gray-400">{tpl.atsScore}% ATS</p>

      {locked && (
        <span className="absolute top-1 right-1 text-[8px] font-bold bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full">
          PRO
        </span>
      )}
      {selected && (
        <span className="absolute top-1 left-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
        </span>
      )}
    </button>
  );
}
