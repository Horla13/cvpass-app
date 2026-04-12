import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOpenAI } from "@/lib/openai";
import { consumeCredit, hasUnlimitedAccess, CREDIT_COSTS } from "@/lib/billing";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

const LINKEDIN_PROMPT = `Tu es un expert en optimisation de profils LinkedIn pour le marche francais.
Tu recois le texte d'un profil LinkedIn et optionnellement une offre d'emploi cible.

Ta mission : analyser le profil et proposer des ameliorations concretes pour maximiser la visibilite du candidat aupres des recruteurs sur LinkedIn.

ANALYSE — evalue ces criteres (score global 0-100) :
- Titre professionnel : contient-il le poste vise + mots-cles du secteur ? (25%)
- Resume/A propos : est-il oriente resultats avec des chiffres ? (25%)  
- Experience : les missions sont-elles bien formulees avec des verbes d'action ? (20%)
- Competences : sont-elles listees et pertinentes pour le poste ? (15%)
- Completude : photo mentionnee, localisation, secteur, formation ? (15%)

PENALITES :
- Titre generique ("En recherche d'opportunites", "Open to work") : -15 pts
- Resume trop court (< 3 lignes) ou absent : -10 pts
- Pas de chiffres dans les experiences : -10 pts
- Cliches ("passionné", "dynamique", "force de proposition") : -3 pts chacun

CE QUE TU DOIS FOURNIR :
1. Un score global (0-100)
2. Un titre LinkedIn optimise (headline) — max 120 caracteres, integrant le poste + 2-3 mots-cles du secteur
3. Un resume LinkedIn optimise (a propos) — 3-5 lignes, oriente resultats, avec chiffres si disponibles dans le profil original
4. 3-5 suggestions pour ameliorer les experiences
5. Une liste de 5-8 competences a ajouter/modifier

REGLES :
- Rester fidele au parcours reel du candidat
- Ne pas inventer de competences ou de chiffres
- Tout en francais
- Si une offre d'emploi est fournie, adapter le titre et le resume aux mots-cles de l'offre

Retourne UNIQUEMENT un JSON valide :
{
  "score": number (0-100),
  "headline": string (titre LinkedIn optimise, max 120 caracteres),
  "summary": string (resume/a propos optimise, 3-5 lignes),
  "experience_tips": [string, string, ...] (3-5 suggestions pour les experiences),
  "skills": [string, string, ...] (5-8 competences recommandees),
  "issues": [
    { "problem": string, "suggestion": string, "impact": "high" | "medium" | "low" }
  ]
}`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return NextResponse.json({ error: "Limite atteinte" }, { status: 429 });

  let body: { profileText?: string; jobOffer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const profileText = body.profileText?.trim();
  if (!profileText || profileText.length < 50) {
    return NextResponse.json({ error: "Profil LinkedIn trop court (min 50 caracteres)" }, { status: 400 });
  }
  if (profileText.length > 30000) {
    return NextResponse.json({ error: "Texte trop long (max 30 000 caracteres)" }, { status: 400 });
  }

  const unlimited = await hasUnlimitedAccess(userId);
  if (!unlimited) {
    const result = await consumeCredit(userId, CREDIT_COSTS.ats_analysis, "linkedin_analysis");
    if (!result.success) {
      return NextResponse.json({ error: "insufficient_credits", creditsNeeded: CREDIT_COSTS.ats_analysis }, { status: 402 });
    }
  }

  const userMessage = body.jobOffer
    ? `PROFIL LINKEDIN :\n${profileText}\n\nOFFRE D'EMPLOI CIBLE :\n${body.jobOffer}`
    : `PROFIL LINKEDIN :\n${profileText}`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: LINKEDIN_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content ?? "";
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (e) {
    console.error("LinkedIn analysis error:", e);
    return NextResponse.json({ error: "Erreur d'analyse" }, { status: 500 });
  }
}
