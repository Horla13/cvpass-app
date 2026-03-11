import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { canUsePremiumFeature } from "@/lib/billing";
import { Gap } from "@/lib/store";
import { restructureWithGPT, buildCvPdfBuffer, CVData } from "@/lib/pdf-builder";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  const allowed = await canUsePremiumFeature(userId, email);
  if (!allowed) {
    return NextResponse.json(
      { error: "quota_exceeded", upgradeUrl: "/pricing" },
      { status: 402 }
    );
  }

  let body: { cvText?: string; acceptedGaps?: Gap[]; cvJson?: CVData; analysisId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { cvText, acceptedGaps = [], cvJson, analysisId } = body;

  if (!cvText && !cvJson) {
    return NextResponse.json({ error: "Texte ou JSON du CV requis" }, { status: 400 });
  }

  try {
    // Use provided cvJson (from history) or restructure with GPT
    const cvData: CVData = cvJson ?? (await restructureWithGPT(cvText!, acceptedGaps));

    // Save cv_json to the analysis row if we have an id
    if (analysisId) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabaseAdmin
        .from("analyses")
        .update({ cv_json: cvData })
        .eq("id", analysisId)
        .eq("user_id", userId);
    }

    const buffer = await buildCvPdfBuffer(cvData);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="cv-optimise-cvpass.pdf"',
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur de génération PDF";
    console.error("PDF generation error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
