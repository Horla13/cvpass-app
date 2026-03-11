import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { canUsePremiumFeature } from "@/lib/billing";
import { getOpenAI } from "@/lib/openai";
import { Gap } from "@/lib/store";

export const dynamic = "force-dynamic";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Experience {
  poste: string;
  entreprise: string;
  lieu?: string;
  periode?: string;
  missions: string[];
}

interface Formation {
  diplome: string;
  etablissement?: string;
  periode?: string;
}

interface CVData {
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

// ─── GPT restructuring ───────────────────────────────────────────────────────

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
- Retourne UNIQUEMENT le JSON brut, sans markdown, sans \`\`\`json, sans texte avant ou après.`;

async function restructureWithGPT(cvText: string, acceptedGaps: Gap[]): Promise<CVData> {
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

// ─── pdfmake content builders ─────────────────────────────────────────────────

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

function buildContent(cv: CVData): unknown[] {
  const content: unknown[] = [];

  // ── En-tête ──────────────────────────────────────────────────────────────
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

  // Contact line
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

  // Header separator
  content.push({
    canvas: [
      { type: "line", x1: 0, y1: 0, x2: 495, y2: 0, lineWidth: 1.5, lineColor: "#16a34a" },
    ],
    margin: [0, 0, 0, 0],
  });

  // ── Profil ────────────────────────────────────────────────────────────────
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

  // ── Expériences ───────────────────────────────────────────────────────────
  if (cv.experiences?.length > 0) {
    content.push(...sectionTitle("Expériences professionnelles"));
    for (const exp of cv.experiences) {
      // Row: poste (bold) + periode (right-aligned)
      content.push({
        columns: [
          {
            text: exp.poste || "",
            font: "Helvetica",
            fontSize: 10,
            bold: true,
            color: "#111827",
          },
          {
            text: exp.periode || "",
            font: "Helvetica",
            fontSize: 9,
            color: "#6b7280",
            alignment: "right",
          },
        ],
        margin: [0, 4, 0, 1],
      });
      // Entreprise + lieu
      const subline = [exp.entreprise, exp.lieu].filter(Boolean).join(" — ");
      if (subline) {
        content.push({
          text: subline,
          font: "Helvetica",
          fontSize: 9,
          color: "#6b7280",
          margin: [0, 0, 0, 2],
        });
      }
      // Missions
      for (const mission of exp.missions ?? []) {
        content.push({
          text: `– ${mission}`,
          font: "Helvetica",
          fontSize: 10,
          color: "#111827",
          margin: [8, 0, 0, 1],
        });
      }
    }
  }

  // ── Formation ─────────────────────────────────────────────────────────────
  if (cv.formation?.length > 0) {
    content.push(...sectionTitle("Formation"));
    for (const f of cv.formation) {
      content.push({
        columns: [
          {
            text: f.diplome || "",
            font: "Helvetica",
            fontSize: 10,
            bold: true,
            color: "#111827",
          },
          {
            text: f.periode || "",
            font: "Helvetica",
            fontSize: 9,
            color: "#6b7280",
            alignment: "right",
          },
        ],
        margin: [0, 4, 0, 1],
      });
      if (f.etablissement) {
        content.push({
          text: f.etablissement,
          font: "Helvetica",
          fontSize: 9,
          color: "#6b7280",
          margin: [0, 0, 0, 2],
        });
      }
    }
  }

  // ── Compétences ───────────────────────────────────────────────────────────
  if (cv.competences?.length > 0) {
    content.push(...sectionTitle("Compétences"));
    content.push({
      text: cv.competences.join("  •  "),
      font: "Helvetica",
      fontSize: 10,
      color: "#111827",
      margin: [0, 0, 0, 2],
    });
  }

  // ── Centres d'intérêt ─────────────────────────────────────────────────────
  if (cv.centres_interet?.length > 0) {
    content.push(...sectionTitle("Centres d'intérêt"));
    content.push({
      text: cv.centres_interet.join("  •  "),
      font: "Helvetica",
      fontSize: 10,
      color: "#111827",
      margin: [0, 0, 0, 2],
    });
  }

  // ── Informations supplémentaires ──────────────────────────────────────────
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

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  const allowed = await canUsePremiumFeature(userId, email);
  if (!allowed) {
    return NextResponse.json(
      { error: "quota_exceeded", upgradeUrl: "/pricing" },
      { status: 402 }
    );
  }

  let body: { cvText?: string; acceptedGaps?: Gap[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { cvText, acceptedGaps = [] } = body;
  if (!cvText) {
    return NextResponse.json({ error: "Texte du CV requis" }, { status: 400 });
  }

  try {
    // Step 1 — GPT restructures CV into clean JSON
    const cvData = await restructureWithGPT(cvText, acceptedGaps);

    // Step 2 — Generate PDF with pdfmake
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
      pageMargins: [40, 40, 40, 50] as [number, number, number, number],
      defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
      content: buildContent(cvData),
    };

    const buffer: Buffer = await pdfmake.createPdf(docDefinition).getBuffer();

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cv-optimise-cvpass.pdf"',
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur de génération PDF";
    console.error("PDF generation error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
