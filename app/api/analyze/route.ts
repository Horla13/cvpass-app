import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { getOpenAI } from "@/lib/openai";
import { canAnalyze } from "@/lib/billing";
import { checkRateLimit } from "@/lib/rate-limit";

const BodySchema = z.object({
  cvText: z.string().min(1, "CV requis").max(50_000, "CV trop long (max 50 000 caractères)").trim(),
  jobOffer: z.string().min(1, "Offre d'emploi requise").max(10_000, "Offre trop longue (max 10 000 caractères)").trim(),
});

const SYSTEM_PROMPT = `Tu es un expert ATS et recruteur senior français avec 15 ans d'expérience.
Tu reçois un CV et une offre d'emploi. Ta mission : maximiser les chances que ce CV passe les filtres ATS et attire l'attention du recruteur.

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

GAPS — identifie entre 5 et 8 suggestions, triées par impact ATS décroissant.

PRIORITÉ DES SUGGESTIONS (respecte cet ordre) :
1. Titre de poste — si le titre CV ne correspond pas à l'offre, suggérer le titre exact. Les ATS matchent d'abord sur le titre. (impact: "high", category: "titre")
2. Accroche / Profil professionnel — si absente ou faible, proposer une accroche percutante de 2-3 lignes adaptée au poste. Format : profil + années d'expérience + valeur apportée. (impact: "high", category: "accroche")
3. Expériences professionnelles — enrichir les missions avec les mots-clés ATS sectoriels de l'offre. (impact: "high" ou "medium", category: "experience")
4. Compétences manquantes — ajouter les mots-clés ATS absents identifiés dans l'offre. Format : mots-clés séparés par des virgules, pas de phrases. (impact: "medium", category: "competence")
5. Formation et divers — ajustements mineurs. (impact: "low", category: "formation")

QUALITÉ DES SUGGESTIONS — chaque suggestion doit :
- Apporter une VRAIE valeur ajoutée, pas juste reformuler
- Intégrer les mots-clés ATS EXACTS de l'offre (les termes que l'ATS recherche)
- Quantifier quand c'est possible : si le CV contient des chiffres, les garder et les mettre en valeur ; sinon, en suggérer des plausibles
- Enrichir avec le vocabulaire métier spécifique au secteur de l'offre

Exemple de mots-clés ATS par secteur (adapte au poste réel) :
- BTP/VRD : terrassement, enrobé, assainissement, voirie, réseaux, DICT, plan d'exécution, PPSPS, EPI, signalisation
- Commercial : prospection, portefeuille clients, CRM, closing, KPI, CA, marge, fidélisation, upsell
- IT : CI/CD, Docker, Kubernetes, Agile, Scrum, API REST, microservices, tests unitaires
- Marketing : SEO, SEA, ROI, taux de conversion, automation, CRM, analytics, content marketing

❌ Suggestion vide : "Gestion d'une équipe"
✅ Suggestion enrichie : "Gestion et coordination d'une équipe de 5 personnes sur chantiers VRD — respect des délais et normes de sécurité PPSPS"

LANGUE — toutes les reformulations en français.

RÈGLE ABSOLUE SUR LA RÉDACTION DES MISSIONS CV :
Sur un CV français professionnel, les missions s'écrivent de deux façons uniquement :

OPTION A — Nom d'action (PRÉFÉRÉ) :
✅ "Gestion d'une équipe de 5 personnes"
✅ "Optimisation des procédures de sécurité"
✅ "Réalisation des travaux VRD"
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
      "section": string ("Expérience", "Compétences", "Formation", "Profil", "Titre"),
      "texte_original": string (phrase du CV à améliorer, ou "" si compétence absente à ajouter),
      "texte_suggere": string (reformulation enrichie avec mots-clés ATS, quantification, vocabulaire métier),
      "raison": string (1 phrase : pourquoi ce changement améliore le score ATS — cite le mot-clé ATS concerné),
      "impact": "high" | "medium" | "low",
      "category": "titre" | "accroche" | "experience" | "competence" | "formation"
    }
  ]
}`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  const billing = await canAnalyze(userId, email);
  if (!billing.allowed) {
    return NextResponse.json(
      { error: "quota_exceeded", code: "quota_exceeded", upgradeUrl: "/pricing" },
      { status: 402 }
    );
  }

  // Rate limiting: 5 req/hour pour tous les utilisateurs (anti-abus)
  const { allowed: rateLimitOk } = await checkRateLimit(`analyze:${userId}`);
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Limite atteinte. Réessaie dans 1 heure.", code: "rate_limit_exceeded" },
      { status: 429 }
    );
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
