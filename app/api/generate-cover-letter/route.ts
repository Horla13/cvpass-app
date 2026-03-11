import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getOpenAI } from "@/lib/openai";
import { canUsePremiumFeature } from "@/lib/billing";
import { checkRateLimitWith } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `Tu es un expert en rédaction de lettres de motivation françaises.
À partir du CV et de l'offre d'emploi fournis, rédige une lettre de motivation professionnelle en français.

Format obligatoire :
- En-tête : Prénom Nom (extrait du CV si trouvé, sinon "Le/La candidat(e)") — Ville (extraite du CV si trouvée, sinon ""), le [date du jour au format "jour mois année"]
- Ligne vide
- Objet : Candidature au poste de [titre exact extrait de l'offre]
- Ligne vide
- Madame, Monsieur,
- Ligne vide
- Paragraphe 1 (4-5 lignes) : accroche — pourquoi ce poste vous intéresse et ce qui vous a attiré
- Ligne vide
- Paragraphe 2 (4-5 lignes) : adéquation profil/poste — 2-3 compétences clés en lien direct avec l'offre, illustrées par une expérience concrète
- Ligne vide
- Paragraphe 3 (3-4 lignes) : motivation pour l'entreprise et disponibilité pour un entretien
- Ligne vide
- Dans l'attente de vous rencontrer, je reste à votre disposition pour tout entretien.
- Veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
- Ligne vide
- [Prénom Nom]

Longueur totale : 250-350 mots.
Retourne UNIQUEMENT le texte de la lettre, sans JSON, sans markdown, sans balises HTML.`;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { allowed: rateLimitOk } = await checkRateLimitWith(`generate-cover-letter:${userId}`, 10, "1 h");
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Limite atteinte. Réessaie dans 1 heure.", code: "rate_limit_exceeded" },
      { status: 429 }
    );
  }

  // Vérifier accès premium (early access, pass48h valide, ou abonnement mensuel)
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  const allowed = await canUsePremiumFeature(userId, email);
  if (!allowed) {
    return NextResponse.json(
      { error: "PREMIUM_REQUIRED", message: "Générez votre lettre de motivation avec un pass CVpass." },
      { status: 403 }
    );
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

  const today = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const userMessage = `CV :\n${cvText}\n\n---\nOffre d'emploi :\n${jobOffer}\n\n---\nDate du jour : ${today}`;

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("Réponse vide de l'IA");

    return NextResponse.json({ content });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur lors de la génération";
    console.error("Cover letter generation error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
