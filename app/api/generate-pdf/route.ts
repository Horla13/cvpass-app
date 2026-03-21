import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { consumeCredit, addCredits, hasUnlimitedAccess, CREDIT_COSTS } from "@/lib/billing";
import { checkRateLimitWith } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { Gap } from "@/lib/store";
import { restructureWithGPT, buildCvPdfBuffer, CVData } from "@/lib/pdf-builder";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { allowed: rateLimitOk } = await checkRateLimitWith(`generate-pdf:${userId}`, 20, "1 h");
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Limite atteinte. Réessaie dans 1 heure.", code: "rate_limit_exceeded" },
      { status: 429 }
    );
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  // Optimistic debit — consommer AVANT la génération PDF
  const unlimited = await hasUnlimitedAccess(userId, email);
  let creditConsumed = false;
  if (!unlimited) {
    const result = await consumeCredit(userId, CREDIT_COSTS.pdf_export, "pdf_export");
    if (!result.success) {
      return NextResponse.json(
        { error: "insufficient_credits", creditsNeeded: CREDIT_COSTS.pdf_export },
        { status: 402 }
      );
    }
    creditConsumed = true;
  }

  let body: { cvText?: string; acceptedGaps?: Gap[]; cvJson?: CVData; analysisId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { cvText, acceptedGaps = [], cvJson, analysisId } = body;

  if (!cvText && !cvJson && !analysisId) {
    return NextResponse.json({ error: "Texte ou JSON du CV requis" }, { status: 400 });
  }

  try {
    let cvData: CVData | null = cvJson ?? null;

    // If analysisId provided, try to reuse stored cv_json (avoids a GPT call)
    if (!cvData && analysisId) {
      const { data } = await getSupabaseAdmin()
        .from("analyses")
        .select("cv_json")
        .eq("id", analysisId)
        .eq("user_id", userId)
        .single();
      if (
        data?.cv_json &&
        typeof data.cv_json === "object" &&
        (data.cv_json as Record<string, unknown>).contact
      ) {
        cvData = data.cv_json as CVData;
      }
    }

    // Fall back to GPT if we have no cv_json yet
    if (!cvData) {
      if (!cvText) {
        return NextResponse.json({ error: "Texte du CV requis" }, { status: 400 });
      }
      cvData = await restructureWithGPT(cvText, acceptedGaps);

      // Persist cv_json for future downloads
      if (analysisId) {
        await getSupabaseAdmin()
          .from("analyses")
          .update({ cv_json: cvData })
          .eq("id", analysisId)
          .eq("user_id", userId);
      }
    }

    const buffer = await buildCvPdfBuffer(cvData, { watermark: false });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cv-optimise-cvpass.pdf"',
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (e: unknown) {
    // Rembourser le crédit si la génération a échoué (optimistic debit rollback)
    if (creditConsumed) {
      try {
        await addCredits(userId, CREDIT_COSTS.pdf_export, "refund_pdf_export_error");
      } catch (refundErr) {
        console.error("CRITICAL: credit refund failed", { userId, cost: CREDIT_COSTS.pdf_export, error: refundErr });
      }
    }
    const msg = e instanceof Error ? e.message : "Erreur de génération PDF";
    console.error("PDF generation error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
