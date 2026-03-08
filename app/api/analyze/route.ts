import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";

const SYSTEM_PROMPT = `Tu es un expert en recrutement français.
Tu reçois un CV et une offre d'emploi.
Tu dois identifier exactement les mots-clés et compétences présents dans l'offre mais absents ou mal formulés dans le CV.
Pour chaque gap identifié, propose une reformulation concrète et précise de la phrase du CV concernée.
Retourne UNIQUEMENT un JSON valide, sans markdown, sans commentaires, structuré ainsi :
{
  "score_avant": number (0-100),
  "resume": string (2 phrases max résumant les axes d'amélioration principaux),
  "gaps": [
    {
      "id": string (identifiant court unique, ex: "g1", "g2"),
      "section": string (ex: "Expérience", "Compétences", "Formation", "Profil"),
      "texte_original": string (phrase exacte du CV à améliorer),
      "texte_suggere": string (reformulation avec mots-clés de l'offre intégrés),
      "raison": string (max 1 phrase expliquant pourquoi cette reformulation)
    }
  ]
}
Identifie entre 3 et 8 gaps pertinents. Ne pas inventer de contenu, reformuler uniquement ce qui existe dans le CV.`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: { cvText?: string; jobOffer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { cvText, jobOffer } = body;

  if (!cvText || !jobOffer) {
    return NextResponse.json({ error: "CV et offre requis" }, { status: 400 });
  }

  const userMessage = `CV :\n${cvText}\n\n---\nOffre d'emploi :\n${jobOffer}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Réponse vide de l'IA");

    const analysis = JSON.parse(content);

    if (
      typeof analysis.score_avant !== "number" ||
      !Array.isArray(analysis.gaps) ||
      typeof analysis.resume !== "string"
    ) {
      throw new Error("Format de réponse IA invalide");
    }

    return NextResponse.json(analysis);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur lors de l'analyse IA";
    console.error("Analyze error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
