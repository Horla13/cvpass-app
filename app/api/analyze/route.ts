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

SCORING — calcule score_avant selon ces critères stricts :
- 0-30 : mots-clés critiques de l'offre quasi absents du CV
- 31-50 : quelques mots-clés présents mais compétences clés mal formulées
- 51-70 : bon fond mais formulations trop génériques, manque de chiffres et de verbes d'action
- 71-85 : CV solide avec quelques ajustements à faire
- 86-100 : excellent match, réserver à un CV quasi parfait pour ce poste

GAPS — identifie entre 4 et 8 gaps, classés du plus impactant au moins impactant.
Pour chaque gap tu DOIS :
- Intégrer les mots-clés exacts de l'offre dans texte_suggere
- Ajouter des verbes d'action forts (piloté, développé, optimisé, déployé...)
- Quantifier si le contexte le permet (%, €, nombre de personnes, délai)
- Enrichir avec des compétences implicites vraisemblables si le contexte du CV le justifie (ex: si le candidat a géré une équipe, on peut ajouter la méthodo Agile si l'offre la demande)

LANGUE — toutes les reformulations doivent être en français, y compris les termes techniques quand une traduction courante existe.

Retourne UNIQUEMENT un JSON valide, sans markdown, sans commentaires :
{
  "job_title": string (titre exact du poste extrait de l'offre),
  "score_avant": number (0-100, selon les critères ci-dessus),
  "resume": string (2 phrases max : 1 point fort du CV, 1 axe d'amélioration principal),
  "gaps": [
    {
      "id": string (ex: "g1", "g2" — classé par ordre d'impact décroissant),
      "section": string (ex: "Expérience", "Compétences", "Formation", "Profil"),
      "texte_original": string (phrase du CV à améliorer, ou "" si c'est une compétence absente à ajouter),
      "texte_suggere": string (reformulation complète avec mots-clés de l'offre et verbes d'action),
      "raison": string (1 phrase : pourquoi ce changement augmente le score ATS)
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
      max_tokens: 3500,
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
