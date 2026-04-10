"use client";

const GRADIENTS: Record<string, string> = {
  "Score ATS": "linear-gradient(135deg, #065f46, #16a34a, #4ade80)",
  "CV Canva": "linear-gradient(135deg, #7c3aed, #a78bfa, #c4b5fd)",
  "Guide ATS": "linear-gradient(135deg, #0369a1, #0ea5e9, #7dd3fc)",
  "Mots-clés": "linear-gradient(135deg, #b45309, #f59e0b, #fcd34d)",
  "Format CV": "linear-gradient(135deg, #374151, #6b7280, #9ca3af)",
  "Outils": "linear-gradient(135deg, #dc2626, #f87171, #fca5a5)",
  "Lettre de motivation": "linear-gradient(135deg, #9333ea, #c084fc, #e9d5ff)",
  "CV par secteur": "linear-gradient(135deg, #0d9488, #2dd4bf, #99f6e4)",
  "Erreurs CV": "linear-gradient(135deg, #dc2626, #ef4444, #f87171)",
  "CV par métier": "linear-gradient(135deg, #1d4ed8, #3b82f6, #93c5fd)",
  "ATS France": "linear-gradient(135deg, #1e3a5f, #2563eb, #60a5fa)",
};

export function BlogCardGradient({ category }: { category: string }) {
  const bg = GRADIENTS[category] || "linear-gradient(135deg, #111827, #374151, #6b7280)";

  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle grid pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id={`g-${category.replace(/\s/g, "")}`} width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#g-${category.replace(/\s/g, "")})`} />
        </svg>
      </div>

      {/* Category text */}
      <span style={{
        fontSize: 14,
        fontWeight: 800,
        color: "rgba(255,255,255,0.25)",
        textTransform: "uppercase",
        letterSpacing: 4,
      }}>
        {category}
      </span>
    </div>
  );
}
