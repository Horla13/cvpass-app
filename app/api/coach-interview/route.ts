import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOpenAI } from "@/lib/openai";
import { hasUnlimitedAccess } from "@/lib/billing";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return NextResponse.json({ error: "Limite atteinte" }, { status: 429 });

  let body: { jobText?: string; cvSummary?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const jobText = body.jobText?.trim();
  if (!jobText || jobText.length < 30) {
    return NextResponse.json({ error: "Offre trop courte" }, { status: 400 });
  }

  const unlimited = await hasUnlimitedAccess(userId);
  if (!unlimited) {
    return NextResponse.json({ error: "pro_required", message: "Le coach entretien est réservé au plan Recherche Active." }, { status: 403 });
  }

  const cvContext = body.cvSummary ? `\n\nCV DU CANDIDAT (résumé) :\n${body.cvSummary.slice(0, 3000)}` : "";

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un coach en entretien d'embauche spécialisé dans le marché français.

À partir d'une offre d'emploi (et optionnellement du CV du candidat), génère les questions d'entretien les plus probables et des pistes de réponses personnalisées.

Retourne UNIQUEMENT un JSON valide :
{
  "questions": [
    {
      "question": string,
      "why": string (pourquoi le recruteur pose cette question),
      "answer_tips": string (piste de réponse personnalisée, 3-4 phrases),
      "category": "motivation" | "technique" | "comportemental" | "situationnel"
    }
  ],
  "general_tips": [string, ...] (3-4 conseils généraux pour cet entretien),
  "company_research": string (ce que le candidat devrait chercher sur l'entreprise avant l'entretien)
}

Génère exactement 6 questions, réparties entre les catégories.
Tout en français. Sois concret et adapté au poste.`,
        },
        { role: "user", content: `OFFRE D'EMPLOI :\n${jobText.slice(0, 5000)}${cvContext}` },
      ],
      temperature: 0.4,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (e) {
    console.error("Interview coach error:", e);
    return NextResponse.json({ error: "Erreur génération" }, { status: 500 });
  }
}
