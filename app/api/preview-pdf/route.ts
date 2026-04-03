import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimitWith } from "@/lib/rate-limit";
import { renderCvPdf } from "@/lib/pdf-templates";
import type { CVData } from "@/lib/pdf-restructure";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** Preview PDF — free, always watermarked, rate-limited */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { allowed } = await checkRateLimitWith(`preview-pdf:${userId}`, 30, "1 h");
  if (!allowed) {
    return NextResponse.json({ error: "Trop de prévisualisations. Réessayez dans 1h." }, { status: 429 });
  }

  let body: { cvJson?: CVData; templateId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (!body.cvJson) {
    return NextResponse.json({ error: "CV JSON requis" }, { status: 400 });
  }

  try {
    const buffer = await renderCvPdf(body.cvJson, {
      watermark: true,
      templateId: body.templateId ?? "modern",
    });

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=apercu-cvpass.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("Preview PDF error:", e);
    return NextResponse.json({ error: "Erreur génération aperçu" }, { status: 500 });
  }
}
