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

// ─── Section title: green underline under text only (matches editor) ─────────

function sectionTitle(label: string): unknown[] {
  return [
    {
      // Single-cell table so the green border only spans the text width (inline-block effect)
      table: {
        body: [
          [
            {
              text: label.toUpperCase(),
              font: "Helvetica",
              fontSize: 11,
              bold: true,
              color: "#16a34a",
              characterSpacing: 2.2, // ~0.2em at 11px
              border: [false, false, false, true],
              borderColor: [null, null, null, "#16a34a"],
              margin: [0, 0, 0, 4],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: (_i: number, _node: unknown) => 2,
        vLineWidth: () => 0,
        hLineColor: () => "#16a34a",
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
      margin: [0, 16, 0, 6],
    },
  ];
}

// ─── Dark header block (matches editor bg-[#111827] px-10 py-7) ─────────────

function buildHeader(cv: CVData): unknown {
  const nameText: unknown = {
    text: cv.nom || "CV",
    font: "Helvetica",
    fontSize: 22,
    bold: true,
    color: "#FFFFFF",
  };

  // Contact parts — each separated by spaces
  const contactParts: string[] = [];
  if (cv.contact?.email) contactParts.push(cv.contact.email);
  if (cv.contact?.telephone) contactParts.push(cv.contact.telephone);
  if (cv.contact?.ville) contactParts.push(cv.contact.ville);
  if (cv.contact?.linkedin) contactParts.push(`[in] ${cv.contact.linkedin}`);

  const contactText: unknown = contactParts.length > 0
    ? {
        text: contactParts.join("   |   "),
        font: "Helvetica",
        fontSize: 10,
        color: "#9CA3AF",
        margin: [0, 6, 0, 0],
      }
    : null;

  const leftStack: unknown[] = [nameText];
  if (contactText) leftStack.push(contactText);

  let headerBody: unknown;

  if (cv.photo) {
    headerBody = {
      columns: [
        { stack: leftStack, width: "*" },
        {
          image: cv.photo,
          width: 60,
          height: 60,
          alignment: "right" as const,
        },
      ],
      columnGap: 16,
    };
  } else {
    headerBody = { stack: leftStack };
  }

  // Full-bleed dark header using a single-cell table with fillColor
  return {
    table: {
      widths: ["*"],
      body: [
        [
          {
            ...headerBody as Record<string, unknown>,
            fillColor: "#111827",
            margin: [20, 16, 20, 16],
          },
        ],
      ],
    },
    layout: {
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingLeft: () => 0,
      paddingRight: () => 0,
      paddingTop: () => 0,
      paddingBottom: () => 0,
    },
    margin: [-40, -40, -40, 10] as [number, number, number, number],
  };
}

// ─── CV content builder ──────────────────────────────────────────────────────

export function buildContent(cv: CVData): unknown[] {
  const content: unknown[] = [];

  // ── Header ──
  content.push(buildHeader(cv));

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
    content.push(...sectionTitle("Exp\u00e9rience professionnelle"));
    for (let i = 0; i < cv.experiences.length; i++) {
      const exp: Experience = cv.experiences[i];
      // Poste (left) + Période (right, italic)
      content.push({
        columns: [
          { text: exp.poste || "", font: "Helvetica", fontSize: 11, bold: true, color: "#111827", width: "*" },
          { text: exp.periode || "", font: "Helvetica", fontSize: 9, italics: true, color: "#6b7280", alignment: "right", width: "auto" },
        ],
        margin: [0, i > 0 ? 8 : 4, 0, 1],
      });
      // Entreprise — Lieu
      const subline = [exp.entreprise, exp.lieu].filter(Boolean).join(" \u2014 ");
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
      // Missions — green dot bullet like editor
      for (const mission of exp.missions ?? []) {
        content.push({
          columns: [
            { text: "\u2022", font: "Helvetica", fontSize: 6, color: "#16a34a", width: 10, margin: [4, 2, 0, 0] },
            { text: mission, font: "Helvetica", fontSize: 10, color: "#111827", lineHeight: 1.5, width: "*" },
          ],
          margin: [0, 0, 0, 1],
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
        margin: [0, i > 0 ? 8 : 4, 0, 1],
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
      text: cv.competences.join("  \u2022  "),
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
      text: cv.centres_interet.join("  \u00b7  "),
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

export async function buildCvPdfBuffer(cv: CVData): Promise<Buffer> {
  const pdfmake = getPdfMake();
  return pdfmake.createPdf({
    pageSize: "A4" as const,
    pageMargins: [40, 40, 40, 40] as [number, number, number, number],
    defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
    info: {
      title: `${cv.nom || "CV"} \u2014 CV`,
      author: cv.nom || "CVpass",
      subject: "CV optimis\u00e9 ATS",
      keywords: "CV, ATS, optimis\u00e9",
      creator: "CVpass",
    },
    content: buildContent(cv),
  }).getBuffer();
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
