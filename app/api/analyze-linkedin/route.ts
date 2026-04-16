import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOpenAI } from "@/lib/openai";
import { hasUnlimitedAccess } from "@/lib/billing";
import { checkRateLimit } from "@/lib/rate-limit";
import { isSafeUrl } from "@/lib/utils";

export const maxDuration = 60;

const LINKEDIN_PROMPT = `Tu es un expert en optimisation de profils LinkedIn pour le marché français.
Tu reçois le texte d'un profil LinkedIn et optionnellement une offre d'emploi cible ou un secteur d'activité.

Ta mission : analyser le profil et proposer des améliorations concrètes pour maximiser la visibilité du candidat auprès des recruteurs sur LinkedIn.

ANALYSE — évalue ces critères (score global 0-100) :
- Titre professionnel : contient-il le poste visé + mots-clés du secteur ? (25%)
- Résumé/À propos : est-il orienté résultats avec des chiffres ? (25%)
- Expérience : les missions sont-elles bien formulées avec des verbes d'action ? (20%)
- Compétences : sont-elles listées et pertinentes pour le poste ? (15%)
- Complétude : photo mentionnée, localisation, secteur, formation ? (15%)

PÉNALITÉS :
- Titre générique ("En recherche d'opportunités", "Open to work") : -15 pts
- Résumé trop court (< 3 lignes) ou absent : -10 pts
- Pas de chiffres dans les expériences : -10 pts
- Clichés ("passionné", "dynamique", "force de proposition") : -3 pts chacun

CE QUE TU DOIS FOURNIR :
1. Un score_avant (0-100) : le score du profil LinkedIn ACTUEL tel que collé par l'utilisateur
2. Un score_apres (0-100) : le score ESTIMÉ si l'utilisateur applique toutes tes suggestions (titre, résumé, compétences)
3. Un titre LinkedIn optimisé (headline) — max 120 caractères, intégrant le poste + 2-3 mots-clés du secteur
3. Un résumé LinkedIn optimisé (à propos) — 3-5 lignes, orienté résultats, avec chiffres si disponibles dans le profil original
4. 3-5 suggestions pour améliorer les expériences
5. Une liste de 5-8 compétences à ajouter/modifier

RÈGLES :
- Rester fidèle au parcours réel du candidat
- Ne pas inventer de compétences ou de chiffres
- Tout en français
- Si une offre d'emploi est fournie, adapter le titre et le résumé aux mots-clés de l'offre
- Si un secteur d'activité est fourni (sans offre), adapter les recommandations aux mots-clés courants de ce secteur

Retourne UNIQUEMENT un JSON valide :
{
  "score_avant": number (0-100),
  "score_apres": number (0-100),
  "headline": string (titre LinkedIn optimisé, max 120 caractères),
  "summary": string (résumé/à propos optimisé, 3-5 lignes),
  "experience_tips": [string, string, ...] (3-5 suggestions pour les expériences),
  "skills": [string, string, ...] (5-8 compétences recommandées),
  "issues": [
    { "problem": string, "suggestion": string, "impact": "high" | "medium" | "low" }
  ]
}`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

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
    return NextResponse.json({ error: "Profil LinkedIn trop court (min 50 caractères)" }, { status: 400 });
  }
  if (profileText.length > 30000) {
    return NextResponse.json({ error: "Texte trop long (max 30 000 caractères)" }, { status: 400 });
  }

  const unlimited = await hasUnlimitedAccess(userId);
  if (!unlimited) {
    return NextResponse.json({ error: "pro_required", message: "L'optimiseur LinkedIn est réservé au plan Recherche Active." }, { status: 403 });
  }

  // Build context from targeting options
  let targetContext = "";

  if (body.jobOffer?.trim()) {
    targetContext = `\n\nOFFRE D'EMPLOI CIBLE :\n${body.jobOffer.trim()}`;
  } else if (body.jobUrl?.trim() && isSafeUrl(body.jobUrl.trim())) {
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
    targetContext = `\n\nSECTEUR D'ACTIVITÉ CIBLE : ${body.sector.trim()}`;
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
