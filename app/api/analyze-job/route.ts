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

  let body: { jobText?: string; jobUrl?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  let jobText = body.jobText?.trim() ?? "";

  if (!jobText && body.jobUrl?.trim()) {
    try {
      const res = await fetch(body.jobUrl.trim(), {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CVpass/1.0)" },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const html = await res.text();
        jobText = html
          .replace(/<script[^>]*>[^<]*<\/script>/gi, "")
          .replace(/<style[^>]*>[^<]*<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&[a-z]+;/gi, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 8000);
      }
    } catch { /* continue */ }
  }

  if (!jobText || jobText.length < 30) {
    return NextResponse.json({ error: "Offre trop courte (min 30 caractères)" }, { status: 400 });
  }

  const unlimited = await hasUnlimitedAccess(userId);
  if (!unlimited) {
    const result = await consumeCredit(userId, CREDIT_COSTS.ats_analysis, "job_analysis");
    if (!result.success) {
      return NextResponse.json({ error: "insufficient_credits", creditsNeeded: CREDIT_COSTS.ats_analysis }, { status: 402 });
    }
  }

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en recrutement et en analyse d'offres d'emploi en France.

Tu reçois le texte d'une offre d'emploi. Analyse-la en profondeur pour aider le candidat à décider s'il postule et à préparer sa candidature.

Retourne UNIQUEMENT un JSON valide :
{
  "job_title": string,
  "company": string (ou "Non précisé"),
  "location": string (ou "Non précisé"),
  "contract_type": string ("CDI", "CDD", "Stage", "Alternance", "Freelance", "Non précisé"),
  "experience_level": string ("Junior (0-2 ans)", "Confirmé (3-5 ans)", "Senior (5-10 ans)", "Expert (10+ ans)"),
  "salary_range": string (ou "Non mentionné"),
  "quality_score": number (0-100, note de qualité de l'offre),
  "must_have_skills": [string, ...] (compétences obligatoires, max 8),
  "nice_to_have_skills": [string, ...] (compétences souhaitées, max 5),
  "red_flags": [string, ...] (signaux d'alerte : vague, trop d'exigences, pas de salaire, etc.),
  "green_flags": [string, ...] (points positifs : télétravail, formation, avantages),
  "keywords_for_cv": [string, ...] (les 10-15 mots-clés à mettre dans le CV pour matcher),
  "summary": string (résumé de l'offre en 2-3 phrases)
}

Pour le quality_score, évalue :
- Clarté de la description du poste (25%)
- Transparence salaire (20%)
- Réalisme des exigences vs le niveau demandé (25%)
- Avantages et conditions de travail mentionnés (15%)
- Qualité de rédaction (15%)

Pénalités :
- Pas de salaire mentionné : -15 pts
- Liste d'exigences irréaliste pour le niveau : -10 pts
- Offre très vague ("missions variées", "environnement stimulant") : -10 pts
- Clichés ("ninja", "rockstar", "passionné") : -5 pts`,
        },
        { role: "user", content: `OFFRE D'EMPLOI :\n${jobText.slice(0, 8000)}` },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return NextResponse.json(JSON.parse(cleaned));
  } catch (e) {
    console.error("Job analysis error:", e);
    return NextResponse.json({ error: "Erreur d'analyse" }, { status: 500 });
  }
}
