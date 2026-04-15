import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOpenAI } from "@/lib/openai";
import { consumeCredit, hasUnlimitedAccess, CREDIT_COSTS } from "@/lib/billing";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return NextResponse.json({ error: "Limite atteinte" }, { status: 429 });

  let body: { company?: string; job_title?: string; days_since?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const company = body.company?.trim();
  const job_title = body.job_title?.trim();
  if (!company || !job_title) {
    return NextResponse.json({ error: "Entreprise et poste requis" }, { status: 400 });
  }

  const unlimited = await hasUnlimitedAccess(userId);
  if (!unlimited) {
    const result = await consumeCredit(userId, CREDIT_COSTS.ats_analysis, "followup_email");
    if (!result.success) {
      return NextResponse.json({ error: "insufficient_credits", creditsNeeded: CREDIT_COSTS.ats_analysis }, { status: 402 });
    }
  }

  const daysSince = body.days_since ?? 7;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en recherche d'emploi en France. Rédige un email de relance professionnel et courtois en français.

RÈGLES :
- Ton professionnel mais pas robotique
- Court (5-8 lignes max)
- Rappeler le poste et la date de candidature
- Montrer de l'intérêt sans être insistant
- Proposer un échange ou un entretien
- Pas de formule trop formelle ("Je me permets de...")
- Pas de clichés ("passionné", "motivé")
- Retourner UNIQUEMENT le texte de l'email (pas d'objet, pas de signature)`,
        },
        {
          role: "user",
          content: `Rédige un email de relance pour une candidature au poste de "${job_title}" chez "${company}", envoyée il y a ${daysSince} jours.`,
        },
      ],
      temperature: 0.4,
      max_tokens: 500,
    });

    const email = completion.choices[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ email, subject: `Relance — Candidature ${job_title} chez ${company}` });
  } catch (e) {
    console.error("Followup generation error:", e);
    return NextResponse.json({ error: "Erreur génération" }, { status: 500 });
  }
}
