import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { getOpenAI } from "@/lib/openai";
import { deductCredits, hasUnlimitedAccess, CREDIT_COSTS } from "@/lib/billing";
import { checkRateLimit } from "@/lib/rate-limit";

const BodySchema = z.object({
  cvText: z.string().min(1, "CV requis").max(50_000, "CV trop long (max 50 000 caractères)").trim(),
  jobOffer: z.string().min(1, "Offre d'emploi requise").max(10_000, "Offre trop longue (max 10 000 caractères)").trim(),
});

const SYSTEM_PROMPT = `Tu es un assistant de reformulation CV, pas un rédacteur. Tu améliores ce qui existe déjà — tu n'inventes rien.
Tu reçois un CV et une offre d'emploi. Ta mission : améliorer les formulations existantes pour maximiser le score ATS, tout en restant 100% fidèle au parcours réel du candidat.

RÈGLE D'OR : si l'utilisateur accepte toutes tes suggestions, son CV doit rester entièrement fidèle à son parcours réel, juste mieux formulé et mieux optimisé pour les ATS. Chaque suggestion doit partir du texte original et l'améliorer, pas le remplacer par quelque chose de complètement différent.

SCORING — calcule score_avant selon ces critères pondérés :
- Mots-clés du poste présents dans le CV (40% du score)
- Qualité de la mise en forme ATS : sections claires, pas de colonnes, pas d'images (20%)
- Présence des sections essentielles : titre, accroche, expériences, compétences, formation (20%)
- Quantification des réalisations : chiffres, %, durées, tailles d'équipe (20%)

Barème résultant :
- 0-30 : mots-clés critiques quasi absents, sections manquantes
- 31-50 : quelques mots-clés, compétences clés mal formulées, pas de chiffres
- 51-70 : bon fond mais formulations génériques, manque de quantification
- 71-85 : CV solide, quelques ajustements
- 86-100 : excellent match, réserver aux CV quasi parfaits pour ce poste

CE QUE TU DOIS FAIRE :
✅ Améliorer la formulation des phrases existantes pour les rendre plus percutantes et ATS-friendly
✅ Ajouter des mots-clés ATS manquants EN RESTANT FIDÈLE au vécu réel décrit dans le CV
✅ Enrichir le vocabulaire avec les termes métier du secteur de l'offre, seulement si cohérent avec le contenu existant
✅ Reformuler avec nom d'action ou infinitif (voir règle de rédaction)
✅ Garder et mettre en valeur les chiffres déjà présents dans le CV

CE QUE TU NE DOIS JAMAIS FAIRE :
❌ Inventer des compétences, outils ou méthodes que le candidat n'a pas mentionnés
❌ Inventer des chiffres ou résultats absents du CV original
❌ Remplacer une phrase du CV par une phrase copiée/collée de l'annonce
❌ Réécrire complètement une section — améliorer phrase par phrase seulement
❌ Supprimer des informations existantes du CV

SECTIONS AUTORISÉES À AMÉLIORER :
✅ Titre du poste (reformulation pour matcher l'offre) — impact: "high", category: "titre"
✅ Accroche / profil (enrichissement à partir du contenu existant) — impact: "high", category: "accroche"
✅ Missions dans les expériences (reformulation + mots-clés ATS du même domaine) — impact: "high" ou "medium", category: "experience"
✅ Compétences (reformulation + ajout de mots-clés du même domaine que ceux déjà listés) — impact: "medium", category: "competence"

SECTIONS INTERDITES — ne JAMAIS toucher :
❌ Formation : diplôme, établissement, dates → jamais de suggestion sur cette section
❌ Informations personnelles : nom, email, téléphone, adresse, permis → jamais
❌ Centres d'intérêt → jamais

GAPS — identifie entre 5 et 8 suggestions, triées par impact ATS décroissant.

LANGUE — toutes les reformulations en français.

RÈGLE ABSOLUE SUR LA RÉDACTION DES MISSIONS CV :
Sur un CV français professionnel, les missions s'écrivent de deux façons uniquement :

OPTION A — Nom d'action (PRÉFÉRÉ) :
✅ "Gestion d'une équipe de 5 personnes"
✅ "Optimisation des procédures de sécurité"
✅ "Suivi et respect des délais de chantier"

OPTION B — Infinitif (acceptable) :
✅ "Gérer une équipe de 5 personnes"
✅ "Assurer le respect des consignes"

INTERDIT :
❌ Participe passé en début : "Géré une équipe", "Optimisé les délais"
❌ Verbe conjugué : "Gérait", "A géré", "Gère"
❌ Première personne : "Je", "J'ai", "J'"

Retourne UNIQUEMENT un JSON valide, sans markdown :
{
  "job_title": string (titre exact du poste extrait de l'offre),
  "score_avant": number (0-100),
  "resume": string (2 phrases : "Votre CV contient X% des mots-clés du poste. Les principales lacunes sont : [liste courte]."),
  "gaps": [
    {
      "id": string ("g1", "g2"... — trié par impact décroissant),
      "section": string ("Expérience", "Compétences", "Profil", "Titre"),
      "texte_original": string (phrase EXACTE du CV à améliorer, ou "" si compétence absente à ajouter),
      "texte_suggere": string (amélioration fidèle de la phrase originale avec mots-clés ATS pertinents),
      "raison": string (1 phrase : pourquoi ce changement améliore le score ATS — cite le mot-clé ATS concerné),
      "impact": "high" | "medium" | "low",
      "category": "titre" | "accroche" | "experience" | "competence"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Rate limiting FIRST — before credit deduction to avoid losing credits on 429
  const { allowed: rateLimitOk } = await checkRateLimit(`analyze:${userId}`);
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Limite atteinte. Réessaie dans 1 heure.", code: "rate_limit_exceeded" },
      { status: 429 }
    );
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  // Vérifier crédits ou accès illimité
  const unlimited = await hasUnlimitedAccess(userId, email);
  if (!unlimited) {
    const cost = CREDIT_COSTS.jd_analysis;
    const deduction = await deductCredits(userId, cost, "jd_analysis");
    if (!deduction.success) {
      return NextResponse.json(
        { error: "insufficient_credits", code: "insufficient_credits", creditsNeeded: cost },
        { status: 402 }
      );
    }
  }

  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide", code: "invalid_body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(rawBody);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Données invalides";
    return NextResponse.json({ error: message, code: "validation_error" }, { status: 400 });
  }

  const { cvText, jobOffer } = parsed.data;
  const userMessage = `CV :\n${cvText}\n\n---\nOffre d'emploi :\n${jobOffer}`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 4500,
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

    const jobTitle = typeof analysis.job_title === "string" ? analysis.job_title : "";

    return NextResponse.json({ ...analysis, job_title: jobTitle });
  } catch (e: unknown) {
    const isTimeout = e instanceof Error && e.message.toLowerCase().includes("timed out");
    if (isTimeout) {
      return NextResponse.json(
        { error: "L'analyse prend trop de temps. Réessaie dans quelques instants.", code: "timeout" },
        { status: 504 }
      );
    }
    const msg = e instanceof Error ? e.message : "Erreur lors de l'analyse IA";
    console.error("Analyze error:", e);
    return NextResponse.json({ error: msg, code: "internal_error" }, { status: 500 });
  }
}
