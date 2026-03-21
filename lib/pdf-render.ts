import { CVData, Experience, Formation, LetterMeta } from "@/lib/pdf-restructure";
export type { CVData, Experience, Formation, LetterMeta };

function getPdfMake() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfmake = require("pdfmake");
  pdfmake.setFonts({
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  });
  pdfmake.setUrlAccessPolicy(() => false);
  return pdfmake;
}

// A4 inner width = 595.28 - 2×40 margins
const PAGE_INNER = 515;

// ─── Section title: UPPERCASE green, green underline, letter-spacing ─────────

function sectionTitle(label: string): unknown[] {
  return [
    {
      text: label.toUpperCase(),
      font: "Helvetica",
      fontSize: 11,
      bold: true,
      color: "#16a34a",
      characterSpacing: 2.2,
      margin: [0, 14, 0, 3],
    },
    {
      canvas: [
        { type: "line", x1: 0, y1: 0, x2: PAGE_INNER, y2: 0, lineWidth: 1.5, lineColor: "#16a34a" },
      ],
      margin: [0, 0, 0, 6],
    },
  ];
}

// ─── Header: fond blanc, nom vert, contact noir — 100% ATS-safe ─────────────

function buildHeader(cv: CVData): unknown[] {
  const items: unknown[] = [];

  // Nom + photo side by side
  const nameBlock: unknown = {
    text: cv.nom || "CV",
    font: "Helvetica",
    fontSize: 22,
    bold: true,
    color: "#16a34a",
  };

  if (cv.photo) {
    items.push({
      columns: [
        { ...(nameBlock as Record<string, unknown>), width: "*", margin: [0, 10, 0, 0] },
        {
          image: cv.photo,
          width: 60,
          height: 60,
          alignment: "right" as const,
        },
      ],
      columnGap: 16,
      margin: [0, 0, 0, 4],
    });
  } else {
    items.push({ ...(nameBlock as Record<string, unknown>), margin: [0, 0, 0, 4] });
  }

  // Titre du poste
  if (cv.titre) {
    items.push({
      text: cv.titre,
      font: "Helvetica",
      fontSize: 12,
      color: "#111827",
      margin: [0, 0, 0, 4],
    });
  }

  // Contact — texte noir lisible sur fond blanc
  const contactParts: string[] = [];
  if (cv.contact?.email) contactParts.push(cv.contact.email);
  if (cv.contact?.telephone) contactParts.push(cv.contact.telephone);
  if (cv.contact?.ville) contactParts.push(cv.contact.ville);
  if (cv.contact?.linkedin) contactParts.push(cv.contact.linkedin);
  if (contactParts.length > 0) {
    items.push({
      text: contactParts.join("  |  "),
      font: "Helvetica",
      fontSize: 10,
      color: "#6b7280",
      margin: [0, 0, 0, 4],
    });
  }

  // Ligne verte séparatrice
  items.push({
    canvas: [
      { type: "line", x1: 0, y1: 0, x2: PAGE_INNER, y2: 0, lineWidth: 2, lineColor: "#16a34a" },
    ],
    margin: [0, 4, 0, 0],
  });

  return items;
}

// ─── CV content builder ──────────────────────────────────────────────────────

export function buildContent(cv: CVData): unknown[] {
  const content: unknown[] = [];

  // ── Header ──
  content.push(...buildHeader(cv));

  // ── Profil ──
  if (cv.profil) {
    content.push(...sectionTitle("Profil"));
    content.push({
      text: cv.profil,
      font: "Helvetica",
      fontSize: 10,
      color: "#111827",
      lineHeight: 1.5,
      margin: [0, 0, 0, 2],
    });
  }

  // ── Expériences professionnelles ──
  if (cv.experiences?.length > 0) {
    content.push(...sectionTitle("Exp\u00e9riences professionnelles"));
    for (let i = 0; i < cv.experiences.length; i++) {
      const exp: Experience = cv.experiences[i];
      content.push({
        columns: [
          { text: exp.poste || "", font: "Helvetica", fontSize: 11, bold: true, color: "#111827", width: "*" },
          { text: exp.periode || "", font: "Helvetica", fontSize: 9, italics: true, color: "#6b7280", alignment: "right", width: "auto" },
        ],
        margin: [0, i > 0 ? 8 : 4, 0, 1],
      });
      const subline = [exp.entreprise, exp.lieu].filter(Boolean).join(" - ");
      if (subline) {
        content.push({
          text: subline,
          font: "Helvetica",
          fontSize: 9,
          italics: true,
          color: "#6b7280",
          margin: [0, 0, 0, 2],
        });
      }
      for (const mission of exp.missions ?? []) {
        content.push({
          text: `- ${mission}`,
          font: "Helvetica",
          fontSize: 10,
          color: "#111827",
          margin: [8, 0, 0, 1],
        });
      }
    }
  }

  // ── Formation ──
  if (cv.formation?.length > 0) {
    content.push(...sectionTitle("Formation"));
    for (let i = 0; i < cv.formation.length; i++) {
      const f: Formation = cv.formation[i];
      content.push({
        columns: [
          { text: f.diplome || "", font: "Helvetica", fontSize: 11, bold: true, color: "#111827", width: "*" },
          { text: f.periode || "", font: "Helvetica", fontSize: 9, italics: true, color: "#6b7280", alignment: "right", width: "auto" },
        ],
        margin: [0, i > 0 ? 6 : 4, 0, 1],
      });
      if (f.etablissement) {
        content.push({
          text: f.etablissement,
          font: "Helvetica",
          fontSize: 9,
          italics: true,
          color: "#6b7280",
          margin: [0, 0, 0, 2],
        });
      }
    }
  }

  // ── Compétences ──
  if (cv.competences?.length > 0) {
    content.push(...sectionTitle("Comp\u00e9tences"));
    content.push({
      text: cv.competences.join("  |  "),
      font: "Helvetica",
      fontSize: 10,
      color: "#111827",
      margin: [0, 0, 0, 2],
    });
  }

  // ── Centres d'intérêt ──
  if (cv.centres_interet?.length > 0) {
    content.push(...sectionTitle("Centres d\u2019int\u00e9r\u00eat"));
    content.push({
      text: cv.centres_interet.join("  |  "),
      font: "Helvetica",
      fontSize: 10,
      color: "#111827",
      margin: [0, 0, 0, 2],
    });
  }

  // ── Informations ──
  if (cv.informations?.length > 0) {
    content.push(...sectionTitle("Informations"));
    for (const info of cv.informations) {
      content.push({
        text: info,
        font: "Helvetica",
        fontSize: 10,
        color: "#111827",
        margin: [0, 1, 0, 1],
      });
    }
  }

  return content;
}

// ─── CV PDF buffer generation ────────────────────────────────────────────────

export async function buildCvPdfBuffer(cv: CVData, options?: { watermark?: boolean }): Promise<Buffer> {
  const pdfmake = getPdfMake();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docDef: any = {
    pageSize: "A4" as const,
    pageMargins: [40, 40, 40, options?.watermark ? 50 : 40] as [number, number, number, number],
    defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
    info: {
      title: `${cv.nom || "CV"} - CV`,
      author: cv.nom || "CVpass",
      subject: "CV optimise ATS",
      keywords: "CV, ATS, optimise",
      creator: "CVpass",
      producer: "CVpass",
    },
    content: buildContent(cv),
  };

  if (options?.watermark) {
    docDef.footer = () => ({
      text: "G\u00e9n\u00e9r\u00e9 avec CVpass.fr",
      font: "Helvetica",
      fontSize: 8,
      color: "#9CA3AF",
      alignment: "center" as const,
      margin: [0, 15, 0, 0],
    });
  }

  return pdfmake.createPdf(docDef).getBuffer();
}

// ─── Cover letter PDF ────────────────────────────────────────────────────────

export async function buildLetterPdfBuffer(
  content: string,
  meta: LetterMeta = {}
): Promise<Buffer> {
  const pdfmake = getPdfMake();
  const { senderName, senderEmail, senderCity, senderPhone, jobTitle } = meta;

  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const cityStr = senderCity ?? "";
  const dateLabel = cityStr ? `${cityStr}, le ${dateStr}` : `Le ${dateStr}`;

  const letterContent: unknown[] = [];

  if (senderName || senderEmail || senderCity || senderPhone) {
    const senderLines: string[] = [];
    if (senderName) senderLines.push(senderName);
    if (senderCity) senderLines.push(senderCity);
    if (senderEmail) senderLines.push(senderEmail);
    if (senderPhone) senderLines.push(senderPhone);
    letterContent.push({ text: senderLines.join("\n"), font: "Helvetica", fontSize: 11, color: "#111827", lineHeight: 1.6, margin: [0, 0, 0, 24] });
  }

  letterContent.push({ text: dateLabel, font: "Helvetica", fontSize: 11, color: "#111827", alignment: "right", margin: [0, 0, 0, 24] });

  if (jobTitle) {
    letterContent.push({ text: `Objet : Candidature au poste de ${jobTitle}`, font: "Helvetica", fontSize: 11, bold: true, color: "#111827", margin: [0, 0, 0, 24] });
  }

  const paragraphs = content.split("\n");
  if (senderName) {
    for (let i = paragraphs.length - 1; i >= 0; i--) {
      if (paragraphs[i].trim() === "") continue;
      if (paragraphs[i].trim() === senderName.trim()) paragraphs.splice(i, 1);
      break;
    }
  }

  for (const para of paragraphs) {
    const trimmed = para.trim();
    letterContent.push({ text: trimmed || " ", font: "Helvetica", fontSize: 11, color: "#111827", lineHeight: 1.6, margin: [0, trimmed ? 0 : 6, 0, 0] });
  }

  if (senderName) {
    letterContent.push({ text: senderName, font: "Helvetica", fontSize: 11, color: "#111827", margin: [0, 32, 0, 0] });
  }

  return pdfmake.createPdf({
    pageSize: "A4" as const,
    pageMargins: [60, 60, 60, 60] as [number, number, number, number],
    defaultStyle: { font: "Helvetica", fontSize: 11, lineHeight: 1.6 },
    content: letterContent,
  }).getBuffer();
}
