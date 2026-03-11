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

// ─── CV content builder ───────────────────────────────────────────────────────

function sectionTitle(label: string): unknown[] {
  return [
    {
      text: label.toUpperCase(),
      font: "Helvetica",
      fontSize: 11,
      bold: true,
      color: "#16a34a",
      margin: [0, 14, 0, 3],
    },
    {
      canvas: [
        { type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 0.5, lineColor: "#d1d5db" },
      ],
      margin: [0, 0, 0, 5],
    },
  ];
}

export function buildContent(cv: CVData): unknown[] {
  const content: unknown[] = [];

  content.push({
    text: cv.nom || "CV",
    font: "Helvetica",
    fontSize: 22,
    bold: true,
    color: "#111827",
    margin: [0, 0, 0, 4],
  });

  if (cv.titre) {
    content.push({ text: cv.titre, font: "Helvetica", fontSize: 13, color: "#16a34a", margin: [0, 0, 0, 6] });
  }

  const contactParts: string[] = [];
  if (cv.contact?.email) contactParts.push(cv.contact.email);
  if (cv.contact?.telephone) contactParts.push(cv.contact.telephone);
  if (cv.contact?.ville) contactParts.push(cv.contact.ville);
  if (contactParts.length > 0) {
    content.push({ text: contactParts.join("  |  "), font: "Helvetica", fontSize: 10, color: "#6b7280", margin: [0, 0, 0, 6] });
  }

  content.push({ canvas: [{ type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 1.5, lineColor: "#16a34a" }], margin: [0, 0, 0, 0] });

  if (cv.profil) {
    content.push(...sectionTitle("Profil"));
    content.push({ text: cv.profil, font: "Helvetica", fontSize: 10, color: "#111827", lineHeight: 1.5, margin: [0, 0, 0, 2] });
  }

  if (cv.experiences?.length > 0) {
    content.push(...sectionTitle("Expériences professionnelles"));
    for (const exp of cv.experiences) {
      content.push({
        columns: [
          { text: exp.poste || "", font: "Helvetica", fontSize: 10, bold: true, color: "#111827" },
          { text: exp.periode || "", font: "Helvetica", fontSize: 9, color: "#6b7280", alignment: "right" },
        ],
        margin: [0, 4, 0, 1],
      });
      const subline = [exp.entreprise, exp.lieu].filter(Boolean).join(" — ");
      if (subline) {
        content.push({ text: subline, font: "Helvetica", fontSize: 9, color: "#6b7280", margin: [0, 0, 0, 2] });
      }
      for (const mission of exp.missions ?? []) {
        content.push({ text: `– ${mission}`, font: "Helvetica", fontSize: 10, color: "#111827", margin: [8, 0, 0, 1] });
      }
    }
  }

  if (cv.formation?.length > 0) {
    content.push(...sectionTitle("Formation"));
    for (const f of cv.formation) {
      content.push({
        columns: [
          { text: f.diplome || "", font: "Helvetica", fontSize: 10, bold: true, color: "#111827" },
          { text: f.periode || "", font: "Helvetica", fontSize: 9, color: "#6b7280", alignment: "right" },
        ],
        margin: [0, 4, 0, 1],
      });
      if (f.etablissement) {
        content.push({ text: f.etablissement, font: "Helvetica", fontSize: 9, color: "#6b7280", margin: [0, 0, 0, 2] });
      }
    }
  }

  if (cv.competences?.length > 0) {
    content.push(...sectionTitle("Compétences"));
    content.push({ text: cv.competences.join("  •  "), font: "Helvetica", fontSize: 10, color: "#111827", margin: [0, 0, 0, 2] });
  }

  if (cv.centres_interet?.length > 0) {
    content.push(...sectionTitle("Centres d'intérêt"));
    content.push({ text: cv.centres_interet.join("  •  "), font: "Helvetica", fontSize: 10, color: "#111827", margin: [0, 0, 0, 2] });
  }

  if (cv.informations?.length > 0) {
    content.push(...sectionTitle("Informations"));
    for (const info of cv.informations) {
      content.push({ text: info, font: "Helvetica", fontSize: 10, color: "#111827", margin: [0, 1, 0, 1] });
    }
  }

  return content;
}

export async function buildCvPdfBuffer(cv: CVData): Promise<Buffer> {
  const pdfmake = getPdfMake();
  return pdfmake.createPdf({
    pageSize: "A4" as const,
    pageMargins: [40, 40, 40, 40] as [number, number, number, number],
    defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
    content: buildContent(cv),
  }).getBuffer();
}

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

  // Strip trailing sender name to avoid duplicate signature
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
