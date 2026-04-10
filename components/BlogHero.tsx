"use client";

const CATEGORY_STYLES: Record<string, { gradient: string; icon: JSX.Element }> = {
  "Score ATS": {
    gradient: "linear-gradient(135deg, #065f46 0%, #16a34a 50%, #4ade80 100%)",
    icon: <><circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" /><path d="M24 12v12l8 4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></>,
  },
  "CV Canva": {
    gradient: "linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #c4b5fd 100%)",
    icon: <><rect x="10" y="8" width="28" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" /><line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2" /><line x1="16" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="2" /><line x1="16" y1="28" x2="24" y2="28" stroke="currentColor" strokeWidth="2" /></>,
  },
  "Guide ATS": {
    gradient: "linear-gradient(135deg, #0369a1 0%, #0ea5e9 50%, #7dd3fc 100%)",
    icon: <><path d="M12 14l8 8 16-16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></>,
  },
  "Mots-clés": {
    gradient: "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #fcd34d 100%)",
    icon: <><circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" /><line x1="27" y1="27" x2="36" y2="36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></>,
  },
  "Format CV": {
    gradient: "linear-gradient(135deg, #374151 0%, #6b7280 50%, #9ca3af 100%)",
    icon: <><rect x="8" y="8" width="32" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" /><line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="2" /><line x1="22" y1="18" x2="22" y2="40" stroke="currentColor" strokeWidth="2" /></>,
  },
  "Outils": {
    gradient: "linear-gradient(135deg, #dc2626 0%, #f87171 50%, #fca5a5 100%)",
    icon: <><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.7a6 6 0 017.7 7.7l-3.7 3.7a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.8-3.7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><path d="M8 24l8 8M12 28l4-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></>,
  },
  "Lettre de motivation": {
    gradient: "linear-gradient(135deg, #9333ea 0%, #c084fc 50%, #e9d5ff 100%)",
    icon: <><rect x="8" y="12" width="32" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" /><polyline points="8 16 24 28 40 16" fill="none" stroke="currentColor" strokeWidth="2.5" /></>,
  },
  "CV par secteur": {
    gradient: "linear-gradient(135deg, #0d9488 0%, #2dd4bf 50%, #99f6e4 100%)",
    icon: <><rect x="6" y="6" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" /><rect x="28" y="6" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" /><rect x="6" y="28" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" /><rect x="28" y="28" width="14" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="2.5" /></>,
  },
  "Erreurs CV": {
    gradient: "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)",
    icon: <><circle cx="24" cy="24" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" /><line x1="24" y1="16" x2="24" y2="26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><circle cx="24" cy="32" r="1.5" fill="currentColor" /></>,
  },
  "CV par métier": {
    gradient: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #93c5fd 100%)",
    icon: <><path d="M20 8h8v4H20z" fill="none" stroke="currentColor" strokeWidth="2.5" /><rect x="10" y="12" width="28" height="24" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" /><line x1="18" y1="20" x2="30" y2="20" stroke="currentColor" strokeWidth="2" /><line x1="18" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="2" /></>,
  },
  "ATS France": {
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)",
    icon: <><path d="M24 6L6 18v20h14V28h8v10h14V18L24 6z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /></>,
  },
};

const DEFAULT_STYLE = {
  gradient: "linear-gradient(135deg, #111827 0%, #374151 50%, #6b7280 100%)",
  icon: <><rect x="10" y="8" width="28" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" /><line x1="16" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="2" /><line x1="16" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="2" /></>,
};

export function BlogHero({ category, title }: { category: string; title: string }) {
  const style = CATEGORY_STYLES[category] || DEFAULT_STYLE;

  return (
    <div
      style={{
        background: style.gradient,
        borderRadius: 16,
        aspectRatio: "1200/630",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 48px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Icon */}
      <div style={{ marginBottom: 20, opacity: 0.9 }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ color: "rgba(255,255,255,0.9)" }}>
          {style.icon}
        </svg>
      </div>

      {/* Category badge */}
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        color: "rgba(255,255,255,0.7)",
        textTransform: "uppercase",
        letterSpacing: 2,
        marginBottom: 12,
      }}>
        {category}
      </span>

      {/* Title */}
      <h2 style={{
        fontSize: 22,
        fontWeight: 800,
        color: "#ffffff",
        textAlign: "center",
        lineHeight: 1.3,
        maxWidth: 500,
        letterSpacing: "-0.5px",
        margin: 0,
      }}>
        {title}
      </h2>

      {/* CVpass watermark */}
      <span style={{
        position: "absolute",
        bottom: 16,
        right: 24,
        fontSize: 14,
        fontWeight: 800,
        color: "rgba(255,255,255,0.15)",
        letterSpacing: -0.5,
      }}>
        CVpass
      </span>
    </div>
  );
}
