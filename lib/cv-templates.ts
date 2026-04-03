export interface CvTemplate {
  id: string;
  name: string;
  description: string;
  atsScore: number;
  premium: boolean;
  colors: {
    primary: string;      // section titles, lines
    heading: string;      // name color
    text: string;         // body text
    subtext: string;      // dates, secondary info
  };
  fontSize: {
    name: number;
    title: number;
    section: number;
    body: number;
    small: number;
  };
  sectionStyle: "uppercase" | "capitalize";
  lineStyle: "full" | "short" | "none";
}

export const CV_TEMPLATES: CvTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Sobre et professionnel. Le choix sûr.",
    atsScore: 98,
    premium: false,
    colors: { primary: "#111827", heading: "#111827", text: "#111827", subtext: "#6b7280" },
    fontSize: { name: 22, title: 12, section: 11, body: 10, small: 9 },
    sectionStyle: "uppercase",
    lineStyle: "full",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Accent vert, design contemporain.",
    atsScore: 96,
    premium: false,
    colors: { primary: "#16a34a", heading: "#16a34a", text: "#111827", subtext: "#6b7280" },
    fontSize: { name: 22, title: 12, section: 11, body: 10, small: 9 },
    sectionStyle: "uppercase",
    lineStyle: "full",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Ultra épuré. Espace et clarté maximum.",
    atsScore: 97,
    premium: false,
    colors: { primary: "#9ca3af", heading: "#111827", text: "#374151", subtext: "#9ca3af" },
    fontSize: { name: 20, title: 11, section: 10, body: 10, small: 9 },
    sectionStyle: "uppercase",
    lineStyle: "short",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Impact visuel fort. Pour les profils senior.",
    atsScore: 95,
    premium: true,
    colors: { primary: "#1e3a5f", heading: "#1e3a5f", text: "#111827", subtext: "#6b7280" },
    fontSize: { name: 24, title: 13, section: 11, body: 10, small: 9 },
    sectionStyle: "uppercase",
    lineStyle: "full",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Optimisé pour les profils techniques.",
    atsScore: 94,
    premium: true,
    colors: { primary: "#7c3aed", heading: "#7c3aed", text: "#111827", subtext: "#6b7280" },
    fontSize: { name: 22, title: 12, section: 11, body: 10, small: 9 },
    sectionStyle: "uppercase",
    lineStyle: "full",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Touch de couleur pour les profils créatifs.",
    atsScore: 92,
    premium: true,
    colors: { primary: "#e11d48", heading: "#111827", text: "#111827", subtext: "#6b7280" },
    fontSize: { name: 22, title: 12, section: 11, body: 10, small: 9 },
    sectionStyle: "capitalize",
    lineStyle: "full",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Dense et structuré. Maximum d'info en 1 page.",
    atsScore: 96,
    premium: true,
    colors: { primary: "#0369a1", heading: "#0369a1", text: "#111827", subtext: "#6b7280" },
    fontSize: { name: 20, title: 11, section: 10, body: 9.5, small: 8.5 },
    sectionStyle: "uppercase",
    lineStyle: "full",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Formation en premier. Pour les jeunes diplômés.",
    atsScore: 95,
    premium: true,
    colors: { primary: "#92400e", heading: "#92400e", text: "#111827", subtext: "#6b7280" },
    fontSize: { name: 22, title: 12, section: 11, body: 10, small: 9 },
    sectionStyle: "uppercase",
    lineStyle: "full",
  },
];

export function getTemplate(id: string): CvTemplate {
  return CV_TEMPLATES.find((t) => t.id === id) ?? CV_TEMPLATES[1]; // default: modern
}

export function isFreeTemplate(id: string): boolean {
  const t = CV_TEMPLATES.find((tpl) => tpl.id === id);
  return t ? !t.premium : false;
}
