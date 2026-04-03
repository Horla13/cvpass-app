export interface CvTemplate {
  id: string;
  name: string;
  description: string;
  atsScore: number;
  premium: boolean;
  /** Layout type determines the overall structure */
  layout: "single" | "sidebar" | "banner" | "timeline";
  colors: {
    primary: string;
    heading: string;
    text: string;
    subtext: string;
    headerBg: string;
    sidebarBg: string;
  };
  fontSize: {
    name: number;
    title: number;
    section: number;
    body: number;
    small: number;
  };
  sectionStyle: "underline" | "background" | "leftBorder" | "dotted" | "minimal" | "capsule";
  bulletStyle: "dash" | "dot" | "arrow" | "square" | "none";
  competenceStyle: "pipe" | "tags" | "grid" | "comma";
}

export const CV_TEMPLATES: CvTemplate[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Design contemporain avec accents verts.",
    atsScore: 96,
    premium: false,
    layout: "single",
    colors: { primary: "#16a34a", heading: "#16a34a", text: "#111827", subtext: "#6b7280", headerBg: "#111827", sidebarBg: "" },
    fontSize: { name: 22, title: 12, section: 11, body: 10, small: 9 },
    sectionStyle: "underline",
    bulletStyle: "dash",
    competenceStyle: "pipe",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Sobre et traditionnel. Le choix sûr.",
    atsScore: 98,
    premium: false,
    layout: "single",
    colors: { primary: "#111827", heading: "#111827", text: "#111827", subtext: "#6b7280", headerBg: "#ffffff", sidebarBg: "" },
    fontSize: { name: 24, title: 13, section: 11, body: 10, small: 9 },
    sectionStyle: "underline",
    bulletStyle: "dot",
    competenceStyle: "comma",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra épuré. Maximum de clarté.",
    atsScore: 97,
    premium: false,
    layout: "single",
    colors: { primary: "#d1d5db", heading: "#111827", text: "#374151", subtext: "#9ca3af", headerBg: "#ffffff", sidebarBg: "" },
    fontSize: { name: 20, title: 11, section: 9, body: 10, small: 9 },
    sectionStyle: "minimal",
    bulletStyle: "none",
    competenceStyle: "comma",
  },
  {
    id: "sidebar",
    name: "Sidebar",
    description: "2 colonnes avec sidebar. Moderne et structuré.",
    atsScore: 93,
    premium: true,
    layout: "sidebar",
    colors: { primary: "#1e3a5f", heading: "#ffffff", text: "#111827", subtext: "#6b7280", headerBg: "#1e3a5f", sidebarBg: "#f1f5f9" },
    fontSize: { name: 20, title: 11, section: 10, body: 9.5, small: 8.5 },
    sectionStyle: "leftBorder",
    bulletStyle: "arrow",
    competenceStyle: "tags",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Header imposant. Pour les profils senior.",
    atsScore: 95,
    premium: true,
    layout: "banner",
    colors: { primary: "#1e3a5f", heading: "#ffffff", text: "#111827", subtext: "#6b7280", headerBg: "#1e3a5f", sidebarBg: "" },
    fontSize: { name: 26, title: 14, section: 11, body: 10, small: 9 },
    sectionStyle: "background",
    bulletStyle: "square",
    competenceStyle: "grid",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Optimisé développeurs. Skills en grille.",
    atsScore: 94,
    premium: true,
    layout: "single",
    colors: { primary: "#7c3aed", heading: "#7c3aed", text: "#111827", subtext: "#6b7280", headerBg: "#faf5ff", sidebarBg: "" },
    fontSize: { name: 22, title: 12, section: 10, body: 10, small: 9 },
    sectionStyle: "capsule",
    bulletStyle: "arrow",
    competenceStyle: "grid",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Barre latérale colorée. Pour profils créatifs.",
    atsScore: 92,
    premium: true,
    layout: "timeline",
    colors: { primary: "#e11d48", heading: "#111827", text: "#111827", subtext: "#6b7280", headerBg: "#ffffff", sidebarBg: "" },
    fontSize: { name: 22, title: 12, section: 11, body: 10, small: 9 },
    sectionStyle: "dotted",
    bulletStyle: "dash",
    competenceStyle: "tags",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense et efficace. Max d'info en 1 page.",
    atsScore: 96,
    premium: true,
    layout: "single",
    colors: { primary: "#0369a1", heading: "#0369a1", text: "#111827", subtext: "#6b7280", headerBg: "#f0f9ff", sidebarBg: "" },
    fontSize: { name: 18, title: 10, section: 9, body: 9, small: 8 },
    sectionStyle: "underline",
    bulletStyle: "dot",
    competenceStyle: "pipe",
  },
];

export function getTemplate(id: string): CvTemplate {
  return CV_TEMPLATES.find((t) => t.id === id) ?? CV_TEMPLATES[0];
}

export function isFreeTemplate(id: string): boolean {
  const t = CV_TEMPLATES.find((tpl) => tpl.id === id);
  return t ? !t.premium : false;
}
