import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOpenAI } from "@/lib/openai";
import { consumeCredit, hasUnlimitedAccess, CREDIT_COSTS } from "@/lib/billing";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60;

const LINKEDIN_PROMPT = `Tu es un expert en optimisation de profils LinkedIn pour le march\u00e9 fran\u00e7ais.
Tu re\u00e7ois le texte d'un profil LinkedIn et optionnellement une offre d'emploi cible ou un secteur d'activit\u00e9.

Ta mission : analyser le profil et proposer des am\u00e9liorations concr\u00e8tes pour maximiser la visibilit\u00e9 du candidat aupr\u00e8s des recruteurs sur LinkedIn.

ANALYSE — \u00e9value ces crit\u00e8res (score global 0-100) :
- Titre professionnel : contient-il le poste vis\u00e9 + mots-cl\u00e9s du secteur ? (25%)
- R\u00e9sum\u00e9/\u00c0 propos : est-il orient\u00e9 r\u00e9sultats avec des chiffres ? (25%)
- Exp\u00e9rience : les missions sont-elles bien formul\u00e9es avec des verbes d'action ? (20%)
- Comp\u00e9tences : sont-elles list\u00e9es et pertinentes pour le poste ? (15%)
- Compl\u00e9tude : photo mentionn\u00e9e, localisation, secteur, formation ? (15%)

P\u00c9NALIT\u00c9S :
- Titre g\u00e9n\u00e9rique ("En recherche d'opportunit\u00e9s", "Open to work") : -15 pts
- R\u00e9sum\u00e9 trop court (< 3 lignes) ou absent : -10 pts
- Pas de chiffres dans les exp\u00e9riences : -10 pts
- Clich\u00e9s ("passionn\u00e9", "dynamique", "force de proposition") : -3 pts chacun

CE QUE TU DOIS FOURNIR :
1. Un score global (0-100)
2. Un titre LinkedIn optimis\u00e9 (headline) — max 120 caract\u00e8res, int\u00e9grant le poste + 2-3 mots-cl\u00e9s du secteur
3. Un r\u00e9sum\u00e9 LinkedIn optimis\u00e9 (\u00e0 propos) — 3-5 lignes, orient\u00e9 r\u00e9sultats, avec chiffres si disponibles dans le profil original
4. 3-5 suggestions pour am\u00e9liorer les exp\u00e9riences
5. Une liste de 5-8 comp\u00e9tences \u00e0 ajouter/modifier

R\u00c8GLES :
- Rester fid\u00e8le au parcours r\u00e9el du candidat
- Ne pas inventer de comp\u00e9tences ou de chiffres
- Tout en fran\u00e7ais
- Si une offre d'emploi est fournie, adapter le titre et le r\u00e9sum\u00e9 aux mots-cl\u00e9s de l'offre
- Si un secteur d'activit\u00e9 est fourni (sans offre), adapter les recommandations aux mots-cl\u00e9s courants de ce secteur

Retourne UNIQUEMENT un JSON valide :
{
  "score": number (0-100),
  "headline": string (titre LinkedIn optimis\u00e9, max 120 caract\u00e8res),
  "summary": string (r\u00e9sum\u00e9/\u00e0 propos optimis\u00e9, 3-5 lignes),
  "experience_tips": [string, string, ...] (3-5 suggestions pour les exp\u00e9riences),
  "skills": [string, string, ...] (5-8 comp\u00e9tences recommand\u00e9es),
  "issues": [
    { "problem": string, "suggestion": string, "impact": "high" | "medium" | "low" }
  ]
}`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autoris\u00e9" }, { status: 401 });

  const { allowed } = await checkRateLimit(userId);
  if (!allowed) return NextResponse.json({ error: "Limite atteinte" }, { status: 429 });

  let body: { profileText?: string; jobOffer?: string; jobUrl?: string; sector?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const profileText = body.profileText?.trim();
  if (!profileText || profileText.length < 50) {
    return NextResponse.json({ error: "Profil LinkedIn trop court (min 50 caract\u00e8res)" }, { status: 400 });
  }
  if (profileText.length > 30000) {
    return NextResponse.json({ error: "Texte trop long (max 30 000 caract\u00e8res)" }, { status: 400 });
  }

  const unlimited = await hasUnlimitedAccess(userId);
  if (!unlimited) {
    const result = await consumeCredit(userId, CREDIT_COSTS.ats_analysis, "linkedin_analysis");
    if (!result.success) {
      return NextResponse.json({ error: "insufficient_credits", creditsNeeded: CREDIT_COSTS.ats_analysis }, { status: 402 });
    }
  }

  // Build context from targeting options
  let targetContext = "";

  if (body.jobOffer?.trim()) {
    targetContext = `\n\nOFFRE D'EMPLOI CIBLE :\n${body.jobOffer.trim()}`;
  } else if (body.jobUrl?.trim()) {
    try {
      const urlRes = await fetch(body.jobUrl.trim(), {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; CVpass/1.0)" },
        signal: AbortSignal.timeout(8000),
      });
      if (urlRes.ok) {
        const html = await urlRes.text();
        const text = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/&[a-z]+;/gi, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 5000);
        if (text.length > 100) {
          targetContext = `\n\nOFFRE D'EMPLOI CIBLE (extraite de ${body.jobUrl.trim()}) :\n${text}`;
        }
      }
    } catch {
      // URL fetch failed — continue without job context
    }
  } else if (body.sector?.trim()) {
    targetContext = `\n\nSECTEUR D'ACTIVIT\u00c9 CIBLE : ${body.sector.trim()}`;
  }

  const userMessage = `PROFIL LINKEDIN :\n${profileText}${targetContext}`;

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
