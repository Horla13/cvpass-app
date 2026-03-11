import { getOpenAI } from "@/lib/openai";
import { Gap } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Experience {
  poste: string;
  entreprise?: string;
  lieu?: string;
  periode?: string;
  missions: string[];
}

export interface Formation {
  diplome: string;
  etablissement?: string;
  periode?: string;
}

export interface CVData {
  nom: string;
  titre?: string;
  contact?: { email?: string; telephone?: string; ville?: string };
  profil?: string;
  experiences: Experience[];
  formation: Formation[];
  competences: string[];
  centres_interet: string[];
  informations: string[];
}

// ─── GPT restructuring ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Tu es un expert en rédaction de CV ATS.
À partir du texte brut d'un CV et d'une liste de modifications acceptées, restructure et retourne un objet JSON strict avec cette structure exacte :

{
  "nom": "string",
  "titre": "string",
  "contact": { "email": "string", "telephone": "string", "ville": "string" },
  "profil": "string",
  "experiences": [
    { "poste": "string", "entreprise": "string", "lieu": "string", "periode": "string", "missions": ["string"] }
  ],
  "formation": [
    { "diplome": "string", "etablissement": "string", "periode": "string" }
  ],
  "competences": ["string"],
  "centres_interet": ["string"],
  "informations": ["string"]
}

Règles :
- Intègre les modifications acceptées dans les bonnes sections en remplaçant les phrases originales correspondantes.
- Omets les champs vides (string vide) sauf nom.
- missions doit être un tableau de strings (une mission par élément).
- Si un champ est absent du CV, laisse le tableau vide ou omets la clé.
- Les missions et compétences ne doivent JAMAIS commencer par "Je" ou "J'ai". Utilise toujours un verbe d'action à l'infinitif ou au participe passé. Exemple : "Géré" au lieu de "J'ai géré", "Assurer" au lieu de "J'assure", "Développer" au lieu de "Je développe".
- La date de naissance ne doit PAS apparaître dans les informations : elle n'est pas obligatoire sur un CV français moderne. Place uniquement dans informations les éléments pratiques comme le permis de conduire, la mobilité géographique, le statut (travailleur handicapé, etc.).
- Retourne UNIQUEMENT le JSON brut, sans markdown, sans \`\`\`json, sans texte avant ou après.`;

export async function restructureWithGPT(cvText: string, acceptedGaps: Gap[]): Promise<CVData> {
  const openai = getOpenAI();

  const userMessage = `CV BRUT :\n${cvText}\n\nMODIFICATIONS ACCEPTÉES :\n${
    acceptedGaps.length > 0
      ? acceptedGaps
          .map((g) => `• Remplacer : "${g.texte_original}"\n  Par : "${g.texte_suggere}"`)
          .join("\n")
      : "Aucune"
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    max_tokens: 2000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(raw) as CVData;
}

// ─── pdfmake content builder ─────────────────────────────────────────────────

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
    content.push({
      text: cv.titre,
      font: "Helvetica",
      fontSize: 13,
      color: "#16a34a",
      margin: [0, 0, 0, 6],
    });
  }

  const contactParts: string[] = [];
  if (cv.contact?.email) contactParts.push(cv.contact.email);
  if (cv.contact?.telephone) contactParts.push(cv.contact.telephone);
  if (cv.contact?.ville) contactParts.push(cv.contact.ville);
  if (contactParts.length > 0) {
    content.push({
      text: contactParts.join("  |  "),
      font: "Helvetica",
      fontSize: 10,
      color: "#6b7280",
      margin: [0, 0, 0, 6],
    });
  }

  content.push({
    canvas: [
      { type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 1.5, lineColor: "#16a34a" },
    ],
    margin: [0, 0, 0, 0],
  });

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

// ─── PDF buffer generator ─────────────────────────────────────────────────────

export async function buildCvPdfBuffer(cv: CVData): Promise<Buffer> {
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

  const docDefinition = {
    pageSize: "A4" as const,
    pageMargins: [40, 40, 40, 40] as [number, number, number, number],
    defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
    content: buildContent(cv),
  };

  return pdfmake.createPdf(docDefinition).getBuffer();
}

export interface LetterMeta {
  senderName?: string;
  senderEmail?: string;
  senderCity?: string;
  senderPhone?: string;
  jobTitle?: string;
}

export async function buildLetterPdfBuffer(
  content: string,
  meta: LetterMeta = {}
): Promise<Buffer> {
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

  const { senderName, senderEmail, senderCity, senderPhone, jobTitle } = meta;

  // Format date in French
  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const cityStr = senderCity ?? "";
  const dateLabel = cityStr ? `${cityStr}, le ${dateStr}` : `Le ${dateStr}`;

  const letterContent: unknown[] = [];

  // ── Sender block (top-left) ───────────────────────────────────────────────
  if (senderName || senderEmail || senderCity || senderPhone) {
    const senderLines: string[] = [];
    if (senderName) senderLines.push(senderName);
    if (senderCity) senderLines.push(senderCity);
    if (senderEmail) senderLines.push(senderEmail);
    if (senderPhone) senderLines.push(senderPhone);

    letterContent.push({
      text: senderLines.join("\n"),
      font: "Helvetica",
      fontSize: 11,
      color: "#111827",
      lineHeight: 1.6,
      margin: [0, 0, 0, 24],
    });
  }

  // ── Date (right-aligned) ──────────────────────────────────────────────────
  letterContent.push({
    text: dateLabel,
    font: "Helvetica",
    fontSize: 11,
    color: "#111827",
    alignment: "right",
    margin: [0, 0, 0, 24],
  });

  // ── Subject ───────────────────────────────────────────────────────────────
  if (jobTitle) {
    letterContent.push({
      text: `Objet : Candidature au poste de ${jobTitle}`,
      font: "Helvetica",
      fontSize: 11,
      bold: true,
      color: "#111827",
      margin: [0, 0, 0, 24],
    });
  }

  // ── Letter body ───────────────────────────────────────────────────────────
  const paragraphs = content.split("\n");
  for (const para of paragraphs) {
    const trimmed = para.trim();
    letterContent.push({
      text: trimmed || " ",
      font: "Helvetica",
      fontSize: 11,
      color: "#111827",
      lineHeight: 1.6,
      margin: [0, trimmed ? 0 : 6, 0, 0],
    });
  }

  // ── Signature ─────────────────────────────────────────────────────────────
  if (senderName) {
    letterContent.push({
      text: senderName,
      font: "Helvetica",
      fontSize: 11,
      color: "#111827",
      margin: [0, 32, 0, 0],
    });
  }

  const docDefinition = {
    pageSize: "A4" as const,
    pageMargins: [60, 60, 60, 60] as [number, number, number, number],
    defaultStyle: { font: "Helvetica", fontSize: 11, lineHeight: 1.6 },
    footer: () => ({
      text: "Généré par CVpass • cvpass.fr",
      font: "Helvetica",
      fontSize: 8,
      color: "#d1d5db",
      alignment: "center",
      margin: [0, 10, 0, 0],
    }),
    content: letterContent,
  };

  return pdfmake.createPdf(docDefinition).getBuffer();
}
