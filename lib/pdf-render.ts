import { CVData, Experience, Formation, LetterMeta } from "@/lib/pdf-restructure";
import { getTemplate, type CvTemplate } from "@/lib/cv-templates";
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

const PAGE_W = 595.28;
const M = 40; // margin
const PAGE_INNER = PAGE_W - 2 * M;

// ═══════════════════════════════════════════════════════════════
//  SHARED HELPERS
// ═══════════════════════════════════════════════════════════════

function contactLine(cv: CVData): string {
  const parts: string[] = [];
  if (cv.contact?.email) parts.push(cv.contact.email);
  if (cv.contact?.telephone) parts.push(cv.contact.telephone);
  if (cv.contact?.ville) parts.push(cv.contact.ville);
  if (cv.contact?.linkedin) parts.push(cv.contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""));
  return parts.join("  |  ");
}

function bullet(tpl: CvTemplate): string {
  switch (tpl.bulletStyle) {
    case "dot": return "\u2022 ";
    case "arrow": return "\u203A ";
    case "square": return "\u25AA ";
    case "none": return "";
    default: return "- ";
  }
}

function sectionTitle(label: string, tpl: CvTemplate, width = PAGE_INNER): unknown[] {
  const text = label.toUpperCase();
  switch (tpl.sectionStyle) {
    case "background":
      return [{
        table: { widths: [width], body: [[{ text, font: "Helvetica", fontSize: tpl.fontSize.section, bold: true, color: "#ffffff", margin: [6, 3, 6, 3] }]] },
        layout: { fillColor: () => tpl.colors.primary, hLineWidth: () => 0, vLineWidth: () => 0 },
        margin: [0, 14, 0, 6],
      }];
    case "leftBorder":
      return [{
        table: { widths: [3, "*"], body: [[{ text: "", fillColor: tpl.colors.primary }, { text, font: "Helvetica", fontSize: tpl.fontSize.section, bold: true, color: tpl.colors.primary, margin: [6, 0, 0, 0] }]] },
        layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0, paddingTop: () => 2, paddingBottom: () => 2 },
        margin: [0, 12, 0, 5],
      }];
    case "dotted":
      return [
        { text, font: "Helvetica", fontSize: tpl.fontSize.section, bold: true, color: tpl.colors.primary, characterSpacing: 2, margin: [0, 14, 0, 2] },
        { canvas: [{ type: "line", x1: 0, y1: 0, x2: width, y2: 0, lineWidth: 1, lineColor: tpl.colors.primary, dash: { length: 3, space: 3 } }], margin: [0, 0, 0, 6] },
      ];
    case "capsule":
      return [{
        table: { body: [[{ text, font: "Helvetica", fontSize: tpl.fontSize.section - 1, bold: true, color: tpl.colors.primary, margin: [10, 2, 10, 2] }]] },
        layout: { hLineWidth: () => 1.5, vLineWidth: () => 1.5, hLineColor: () => tpl.colors.primary, vLineColor: () => tpl.colors.primary, fillColor: () => null },
        margin: [0, 14, 0, 6],
      }];
    case "minimal":
      return [
        { text, font: "Helvetica", fontSize: tpl.fontSize.section, bold: true, color: tpl.colors.subtext, characterSpacing: 3, margin: [0, 16, 0, 6] },
      ];
    default: // underline
      return [
        { text, font: "Helvetica", fontSize: tpl.fontSize.section, bold: true, color: tpl.colors.primary, characterSpacing: 2.2, margin: [0, 14, 0, 3] },
        { canvas: [{ type: "line", x1: 0, y1: 0, x2: width, y2: 0, lineWidth: 1.5, lineColor: tpl.colors.primary }], margin: [0, 0, 0, 6] },
      ];
  }
}

function experienceBlock(exp: Experience, idx: number, tpl: CvTemplate): unknown[] {
  const items: unknown[] = [];
  items.push({
    columns: [
      { text: exp.poste || "", font: "Helvetica", fontSize: tpl.fontSize.section, bold: true, color: tpl.colors.text, width: "*" },
      { text: exp.periode || "", font: "Helvetica", fontSize: tpl.fontSize.small, italics: true, color: tpl.colors.subtext, alignment: "right", width: "auto" },
    ],
    margin: [0, idx > 0 ? 8 : 3, 0, 1],
  });
  const sub = [exp.entreprise, exp.lieu].filter(Boolean).join(" - ");
  if (sub) items.push({ text: sub, font: "Helvetica", fontSize: tpl.fontSize.small, italics: true, color: tpl.colors.subtext, margin: [0, 0, 0, 2] });
  for (const m of exp.missions ?? []) {
    items.push({ text: `${bullet(tpl)}${m}`, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [6, 0, 0, 1] });
  }
  return items;
}

function formationBlock(f: Formation, idx: number, tpl: CvTemplate): unknown[] {
  const items: unknown[] = [];
  items.push({
    columns: [
      { text: f.diplome || "", font: "Helvetica", fontSize: tpl.fontSize.section, bold: true, color: tpl.colors.text, width: "*" },
      { text: f.periode || "", font: "Helvetica", fontSize: tpl.fontSize.small, italics: true, color: tpl.colors.subtext, alignment: "right", width: "auto" },
    ],
    margin: [0, idx > 0 ? 6 : 3, 0, 1],
  });
  if (f.etablissement) items.push({ text: f.etablissement, font: "Helvetica", fontSize: tpl.fontSize.small, italics: true, color: tpl.colors.subtext, margin: [0, 0, 0, 2] });
  return items;
}

function competencesBlock(comps: string[], tpl: CvTemplate, width?: number): unknown {
  switch (tpl.competenceStyle) {
    case "tags":
      return {
        table: {
          widths: Array(3).fill("*"),
          body: [comps.reduce<unknown[][]>((rows, c, i) => {
            const ri = Math.floor(i / 3);
            if (!rows[ri]) rows[ri] = [];
            rows[ri].push({ text: c, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [4, 3, 4, 3], alignment: "center" });
            return rows;
          }, []).map(row => { while (row.length < 3) row.push({ text: "", margin: [0, 0, 0, 0] }); return row; })].flat(),
        },
        layout: {
          hLineWidth: () => 0.5, vLineWidth: () => 0.5,
          hLineColor: () => "#e5e7eb", vLineColor: () => "#e5e7eb",
          paddingLeft: () => 2, paddingRight: () => 2, paddingTop: () => 1, paddingBottom: () => 1,
        },
        margin: [0, 2, 0, 2],
      };
    case "grid": {
      const cols = width && width < 300 ? 2 : 3;
      const rows: unknown[][] = [];
      for (let i = 0; i < comps.length; i += cols) {
        const row: unknown[] = [];
        for (let j = 0; j < cols; j++) {
          const c = comps[i + j];
          row.push(c
            ? { text: `${bullet(tpl)}${c}`, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [0, 1, 0, 1] }
            : { text: "", margin: [0, 0, 0, 0] }
          );
        }
        rows.push(row);
      }
      return {
        table: { widths: Array(cols).fill("*"), body: rows },
        layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 2, paddingRight: () => 2, paddingTop: () => 0, paddingBottom: () => 0 },
        margin: [0, 2, 0, 2],
      };
    }
    case "comma":
      return { text: comps.join(", "), font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [0, 0, 0, 2] };
    default: // pipe
      return { text: comps.join("  |  "), font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [0, 0, 0, 2] };
  }
}

function listBlock(items: string[], tpl: CvTemplate): unknown {
  return { text: items.join("  |  "), font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [0, 0, 0, 2] };
}

// ═══════════════════════════════════════════════════════════════
//  LAYOUT: SINGLE COLUMN (Modern, Classic, Minimal, Tech, Compact)
// ═══════════════════════════════════════════════════════════════

function buildSingleColumn(cv: CVData, tpl: CvTemplate): unknown[] {
  const content: unknown[] = [];
  const isLight = tpl.colors.headerBg === "#ffffff" || tpl.colors.headerBg === "#faf5ff" || tpl.colors.headerBg === "#f0f9ff";

  // Header
  const nameColor = isLight ? tpl.colors.heading : (tpl.colors.heading === "#111827" ? "#ffffff" : tpl.colors.heading);
  const contactColor = isLight ? tpl.colors.subtext : "#d1d5db";
  const nameBlock = { text: cv.nom || "CV", font: "Helvetica", fontSize: tpl.fontSize.name, bold: true, color: nameColor };

  if (tpl.colors.headerBg !== "#ffffff") {
    // Colored header block
    const headerStack: unknown[] = [];
    if (cv.photo) {
      headerStack.push({
        columns: [
          { stack: [nameBlock, ...(cv.titre ? [{ text: cv.titre, font: "Helvetica", fontSize: tpl.fontSize.title, color: contactColor, margin: [0, 3, 0, 0] }] : [])], width: "*", margin: [0, 4, 0, 0] },
          { image: cv.photo, width: 52, height: 52, alignment: "right" },
        ],
        columnGap: 12,
      });
    } else {
      headerStack.push(nameBlock);
      if (cv.titre) headerStack.push({ text: cv.titre, font: "Helvetica", fontSize: tpl.fontSize.title, color: contactColor, margin: [0, 3, 0, 0] });
    }
    const cl = contactLine(cv);
    if (cl) headerStack.push({ text: cl, font: "Helvetica", fontSize: tpl.fontSize.small, color: contactColor, margin: [0, 6, 0, 0] });

    content.push({
      table: { widths: [PAGE_INNER], body: [[{ stack: headerStack, margin: [16, 14, 16, 14] }]] },
      layout: { fillColor: () => tpl.colors.headerBg, hLineWidth: () => 0, vLineWidth: () => 0 },
      margin: [-M, -M, -M, 8],
    });
  } else {
    // White header
    if (cv.photo) {
      content.push({
        columns: [
          { stack: [nameBlock, ...(cv.titre ? [{ text: cv.titre, font: "Helvetica", fontSize: tpl.fontSize.title, color: tpl.colors.text, margin: [0, 3, 0, 0] }] : [])], width: "*", margin: [0, 4, 0, 0] },
          { image: cv.photo, width: 52, height: 52, alignment: "right" },
        ],
        columnGap: 12,
        margin: [0, 0, 0, 4],
      });
    } else {
      content.push({ ...nameBlock, margin: [0, 0, 0, 4] });
      if (cv.titre) content.push({ text: cv.titre, font: "Helvetica", fontSize: tpl.fontSize.title, color: tpl.colors.text, margin: [0, 0, 0, 4] });
    }
    const cl = contactLine(cv);
    if (cl) content.push({ text: cl, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.subtext, margin: [0, 0, 0, 4] });
    content.push({ canvas: [{ type: "line", x1: 0, y1: 0, x2: PAGE_INNER, y2: 0, lineWidth: tpl.sectionStyle === "minimal" ? 0.5 : 1.5, lineColor: tpl.colors.primary }], margin: [0, 2, 0, 4] });
  }

  // Profil
  if (cv.profil) {
    content.push(...sectionTitle("Profil", tpl));
    content.push({ text: cv.profil, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, lineHeight: 1.5, margin: [0, 0, 0, 2] });
  }
  // Experiences
  if (cv.experiences?.length > 0) {
    content.push(...sectionTitle("Expériences professionnelles", tpl));
    cv.experiences.forEach((exp, i) => content.push(...experienceBlock(exp, i, tpl)));
  }
  // Formation
  if (cv.formation?.length > 0) {
    content.push(...sectionTitle("Formation", tpl));
    cv.formation.forEach((f, i) => content.push(...formationBlock(f, i, tpl)));
  }
  // Compétences
  if (cv.competences?.length > 0) {
    content.push(...sectionTitle("Compétences", tpl));
    content.push(competencesBlock(cv.competences, tpl));
  }
  // Centres d'intérêt
  if (cv.centres_interet?.length > 0) {
    content.push(...sectionTitle("Centres d\u2019intérêt", tpl));
    content.push(listBlock(cv.centres_interet, tpl));
  }
  // Informations
  if (cv.informations?.length > 0) {
    content.push(...sectionTitle("Informations", tpl));
    for (const info of cv.informations) content.push({ text: info, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [0, 1, 0, 1] });
  }

  return content;
}

// ═══════════════════════════════════════════════════════════════
//  LAYOUT: SIDEBAR (2-column with left sidebar)
// ═══════════════════════════════════════════════════════════════

function buildSidebar(cv: CVData, tpl: CvTemplate): unknown[] {
  const sideW = 160;
  const mainW = PAGE_INNER - sideW - 16;

  // --- Sidebar content ---
  const side: unknown[] = [];

  // Photo
  if (cv.photo) {
    side.push({ image: cv.photo, width: 70, height: 70, alignment: "center", margin: [0, 0, 0, 10] });
  }

  // Contact
  side.push({ text: "CONTACT", font: "Helvetica", fontSize: 8, bold: true, color: tpl.colors.primary, characterSpacing: 2, margin: [0, 6, 0, 4] });
  if (cv.contact?.email) side.push({ text: cv.contact.email, font: "Helvetica", fontSize: 8, color: tpl.colors.text, margin: [0, 0, 0, 2] });
  if (cv.contact?.telephone) side.push({ text: cv.contact.telephone, font: "Helvetica", fontSize: 8, color: tpl.colors.text, margin: [0, 0, 0, 2] });
  if (cv.contact?.ville) side.push({ text: cv.contact.ville, font: "Helvetica", fontSize: 8, color: tpl.colors.text, margin: [0, 0, 0, 2] });
  if (cv.contact?.linkedin) side.push({ text: cv.contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""), font: "Helvetica", fontSize: 7.5, color: tpl.colors.primary, margin: [0, 0, 0, 2] });

  // Compétences in sidebar
  if (cv.competences?.length > 0) {
    side.push({ text: "COMPÉTENCES", font: "Helvetica", fontSize: 8, bold: true, color: tpl.colors.primary, characterSpacing: 2, margin: [0, 12, 0, 4] });
    for (const c of cv.competences) {
      side.push({ text: `${bullet(tpl)}${c}`, font: "Helvetica", fontSize: 8.5, color: tpl.colors.text, margin: [0, 1, 0, 1] });
    }
  }

  // Centres d'intérêt in sidebar
  if (cv.centres_interet?.length > 0) {
    side.push({ text: "INTÉRÊTS", font: "Helvetica", fontSize: 8, bold: true, color: tpl.colors.primary, characterSpacing: 2, margin: [0, 12, 0, 4] });
    for (const c of cv.centres_interet) {
      side.push({ text: c, font: "Helvetica", fontSize: 8.5, color: tpl.colors.text, margin: [0, 1, 0, 1] });
    }
  }

  // Informations
  if (cv.informations?.length > 0) {
    side.push({ text: "INFORMATIONS", font: "Helvetica", fontSize: 8, bold: true, color: tpl.colors.primary, characterSpacing: 2, margin: [0, 12, 0, 4] });
    for (const info of cv.informations) {
      side.push({ text: info, font: "Helvetica", fontSize: 8.5, color: tpl.colors.text, margin: [0, 1, 0, 1] });
    }
  }

  // --- Main content ---
  const main: unknown[] = [];

  // Name + title
  main.push({ text: cv.nom || "CV", font: "Helvetica", fontSize: tpl.fontSize.name, bold: true, color: tpl.colors.primary, margin: [0, 0, 0, 2] });
  if (cv.titre) main.push({ text: cv.titre, font: "Helvetica", fontSize: tpl.fontSize.title, color: tpl.colors.text, margin: [0, 0, 0, 6] });

  // Profil
  if (cv.profil) {
    main.push(...sectionTitle("Profil", tpl, mainW));
    main.push({ text: cv.profil, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, lineHeight: 1.5, margin: [0, 0, 0, 2] });
  }
  // Experiences
  if (cv.experiences?.length > 0) {
    main.push(...sectionTitle("Expériences", tpl, mainW));
    cv.experiences.forEach((exp, i) => main.push(...experienceBlock(exp, i, tpl)));
  }
  // Formation
  if (cv.formation?.length > 0) {
    main.push(...sectionTitle("Formation", tpl, mainW));
    cv.formation.forEach((f, i) => main.push(...formationBlock(f, i, tpl)));
  }

  return [{
    columns: [
      {
        width: sideW,
        stack: side,
        margin: [0, 0, 0, 0],
      },
      {
        width: "*",
        stack: main,
      },
    ],
    columnGap: 16,
  }];
}

// ═══════════════════════════════════════════════════════════════
//  LAYOUT: BANNER (Full-width colored header)
// ═══════════════════════════════════════════════════════════════

function buildBanner(cv: CVData, tpl: CvTemplate): unknown[] {
  const content: unknown[] = [];

  // Big colored banner header
  const headerStack: unknown[] = [];
  const nameBlock = { text: cv.nom || "CV", font: "Helvetica", fontSize: tpl.fontSize.name, bold: true, color: "#ffffff" };

  if (cv.photo) {
    headerStack.push({
      columns: [
        { stack: [nameBlock, ...(cv.titre ? [{ text: cv.titre, font: "Helvetica", fontSize: tpl.fontSize.title, color: "#d1d5db", margin: [0, 4, 0, 0] }] : [])], width: "*", margin: [0, 8, 0, 0] },
        { image: cv.photo, width: 64, height: 64, alignment: "right" },
      ],
      columnGap: 16,
    });
  } else {
    headerStack.push(nameBlock);
    if (cv.titre) headerStack.push({ text: cv.titre, font: "Helvetica", fontSize: tpl.fontSize.title, color: "#d1d5db", margin: [0, 4, 0, 0] });
  }

  const cl = contactLine(cv);
  if (cl) headerStack.push({ text: cl, font: "Helvetica", fontSize: tpl.fontSize.small, color: "#94a3b8", margin: [0, 8, 0, 0] });

  content.push({
    table: { widths: [PAGE_INNER + 2 * M], body: [[{ stack: headerStack, margin: [M + 8, 20, M + 8, 20] }]] },
    layout: { fillColor: () => tpl.colors.headerBg, hLineWidth: () => 0, vLineWidth: () => 0 },
    margin: [-M, -M, -M, 10],
  });

  // Profil
  if (cv.profil) {
    content.push(...sectionTitle("Profil", tpl));
    content.push({ text: cv.profil, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, lineHeight: 1.5, margin: [0, 0, 0, 2] });
  }
  if (cv.experiences?.length > 0) {
    content.push(...sectionTitle("Expériences professionnelles", tpl));
    cv.experiences.forEach((exp, i) => content.push(...experienceBlock(exp, i, tpl)));
  }
  if (cv.formation?.length > 0) {
    content.push(...sectionTitle("Formation", tpl));
    cv.formation.forEach((f, i) => content.push(...formationBlock(f, i, tpl)));
  }
  if (cv.competences?.length > 0) {
    content.push(...sectionTitle("Compétences", tpl));
    content.push(competencesBlock(cv.competences, tpl));
  }
  if (cv.centres_interet?.length > 0) {
    content.push(...sectionTitle("Centres d\u2019intérêt", tpl));
    content.push(listBlock(cv.centres_interet, tpl));
  }
  if (cv.informations?.length > 0) {
    content.push(...sectionTitle("Informations", tpl));
    for (const info of cv.informations) content.push({ text: info, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [0, 1, 0, 1] });
  }

  return content;
}

// ═══════════════════════════════════════════════════════════════
//  LAYOUT: TIMELINE (Left accent bar with dots for experiences)
// ═══════════════════════════════════════════════════════════════

function buildTimeline(cv: CVData, tpl: CvTemplate): unknown[] {
  const content: unknown[] = [];

  // Header — name with left color bar
  content.push({
    table: { widths: [4, "*"], body: [[
      { text: "", fillColor: tpl.colors.primary },
      {
        stack: [
          { text: cv.nom || "CV", font: "Helvetica", fontSize: tpl.fontSize.name, bold: true, color: tpl.colors.heading, margin: [8, 0, 0, 0] },
          ...(cv.titre ? [{ text: cv.titre, font: "Helvetica", fontSize: tpl.fontSize.title, color: tpl.colors.subtext, margin: [8, 3, 0, 0] }] : []),
          ...(contactLine(cv) ? [{ text: contactLine(cv), font: "Helvetica", fontSize: tpl.fontSize.small, color: tpl.colors.subtext, margin: [8, 4, 0, 0] }] : []),
        ],
        margin: [0, 4, 0, 4],
      },
    ]] },
    layout: { hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0, paddingTop: () => 0, paddingBottom: () => 0 },
    margin: [0, 0, 0, 8],
  });

  // Photo centered below header
  if (cv.photo) {
    content.push({ image: cv.photo, width: 52, height: 52, alignment: "center", margin: [0, 0, 0, 8] });
  }

  // Profil
  if (cv.profil) {
    content.push(...sectionTitle("Profil", tpl));
    content.push({ text: cv.profil, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, lineHeight: 1.5, margin: [0, 0, 0, 2] });
  }

  // Experiences with timeline dots
  if (cv.experiences?.length > 0) {
    content.push(...sectionTitle("Expériences", tpl));
    for (let i = 0; i < cv.experiences.length; i++) {
      const exp = cv.experiences[i];
      const dot = { canvas: [{ type: "ellipse", x: 5, y: 5, r1: 4, r2: 4, color: tpl.colors.primary }], width: 12 };
      const line = i < cv.experiences.length - 1
        ? { canvas: [{ type: "line", x1: 5, y1: 0, x2: 5, y2: 60, lineWidth: 1.5, lineColor: tpl.colors.primary }], width: 12 }
        : { text: "", width: 12 };

      const expContent: unknown[] = [];
      expContent.push({
        columns: [
          { text: exp.poste || "", font: "Helvetica", fontSize: tpl.fontSize.section, bold: true, color: tpl.colors.text, width: "*" },
          { text: exp.periode || "", font: "Helvetica", fontSize: tpl.fontSize.small, italics: true, color: tpl.colors.subtext, alignment: "right", width: "auto" },
        ],
      });
      const sub = [exp.entreprise, exp.lieu].filter(Boolean).join(" - ");
      if (sub) expContent.push({ text: sub, font: "Helvetica", fontSize: tpl.fontSize.small, italics: true, color: tpl.colors.subtext, margin: [0, 0, 0, 2] });
      for (const m of exp.missions ?? []) {
        expContent.push({ text: `${bullet(tpl)}${m}`, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [0, 0, 0, 1] });
      }

      content.push({
        columns: [
          { stack: [dot, line], width: 16 },
          { stack: expContent, width: "*" },
        ],
        columnGap: 6,
        margin: [0, i > 0 ? 4 : 0, 0, 0],
      });
    }
  }

  if (cv.formation?.length > 0) {
    content.push(...sectionTitle("Formation", tpl));
    cv.formation.forEach((f, i) => content.push(...formationBlock(f, i, tpl)));
  }
  if (cv.competences?.length > 0) {
    content.push(...sectionTitle("Compétences", tpl));
    content.push(competencesBlock(cv.competences, tpl));
  }
  if (cv.centres_interet?.length > 0) {
    content.push(...sectionTitle("Centres d\u2019intérêt", tpl));
    content.push(listBlock(cv.centres_interet, tpl));
  }
  if (cv.informations?.length > 0) {
    content.push(...sectionTitle("Informations", tpl));
    for (const info of cv.informations) content.push({ text: info, font: "Helvetica", fontSize: tpl.fontSize.body, color: tpl.colors.text, margin: [0, 1, 0, 1] });
  }

  return content;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════════

export function buildContent(cv: CVData, templateId?: string): unknown[] {
  const tpl = getTemplate(templateId ?? "modern");
  switch (tpl.layout) {
    case "sidebar": return buildSidebar(cv, tpl);
    case "banner": return buildBanner(cv, tpl);
    case "timeline": return buildTimeline(cv, tpl);
    default: return buildSingleColumn(cv, tpl);
  }
}

// ─── CV PDF buffer generation ────────────────────────────────────────────────

export async function buildCvPdfBuffer(cv: CVData, options?: { watermark?: boolean; templateId?: string }): Promise<Buffer> {
  const tpl = getTemplate(options?.templateId ?? "modern");
  const pdfmake = getPdfMake();
  const sidebarMargins = tpl.layout === "sidebar" ? [M, M, M, options?.watermark ? 50 : M] : [M, M, M, options?.watermark ? 50 : M];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const docDef: any = {
    pageSize: "A4" as const,
    pageMargins: sidebarMargins as [number, number, number, number],
    defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
    info: {
      title: `${cv.nom || "CV"} - CV`,
      author: cv.nom || "CVpass",
      subject: "CV optimise ATS",
      keywords: "CV, ATS, optimise",
      creator: "CVpass",
      producer: "CVpass",
    },
    content: buildContent(cv, options?.templateId),
  };

  // Sidebar background
  if (tpl.layout === "sidebar" && tpl.colors.sidebarBg) {
    docDef.background = () => ({
      canvas: [{ type: "rect", x: 0, y: 0, w: 200, h: 842, color: tpl.colors.sidebarBg }],
    });
  }

  if (options?.watermark) {
    docDef.footer = () => ({
      text: "Généré avec CVpass.fr",
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
