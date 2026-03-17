import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { consumeCredit, hasUnlimitedAccess, CREDIT_COSTS } from "@/lib/billing";
import { checkRateLimitWith } from "@/lib/rate-limit";
import { buildLetterPdfBuffer, LetterMeta } from "@/lib/pdf-builder";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { allowed: rateLimitOk } = await checkRateLimitWith(`generate-letter-pdf:${userId}`, 10, "1 h");
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Limite atteinte. Réessaie dans 1 heure.", code: "rate_limit_exceeded" },
      { status: 429 }
    );
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const userEmail = user.emailAddresses[0]?.emailAddress;

  // Vérifier crédits ou accès illimité
  const unlimited = await hasUnlimitedAccess(userId, userEmail);
  if (!unlimited) {
    const deduction = await consumeCredit(userId, CREDIT_COSTS.pdf_export, "pdf_export");
    if (!deduction.success) {
      return NextResponse.json(
        { error: "insufficient_credits", creditsNeeded: CREDIT_COSTS.pdf_export },
        { status: 402 }
      );
    }
  }

  let body: { letterContent: string; jobTitle?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { letterContent, jobTitle } = body;
  if (!letterContent?.trim()) {
    return NextResponse.json({ error: "Contenu de la lettre requis" }, { status: 400 });
  }

  try {
    // Try to get sender contact info from the most recent cv_json
    let senderCity: string | undefined;
    let senderPhone: string | undefined;

    const { data: latestAnalysis } = await getSupabaseAdmin()
      .from("analyses")
      .select("cv_json")
      .eq("user_id", userId)
      .not("cv_json", "is", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (latestAnalysis?.cv_json) {
      const cvJson = latestAnalysis.cv_json as { contact?: { telephone?: string; ville?: string } };
      senderCity = cvJson.contact?.ville;
      senderPhone = cvJson.contact?.telephone;
    }

    const meta: LetterMeta = {
      senderName: [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined,
      senderEmail: userEmail,
      senderCity,
      senderPhone,
      jobTitle,
    };

    const buffer = await buildLetterPdfBuffer(letterContent, meta);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="lettre-motivation-cvpass.pdf"',
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur de génération PDF";
    console.error("Letter PDF generation error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
