import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { checkRateLimitWith } from "@/lib/rate-limit";
import { renderCvPdf } from "@/lib/pdf-templates";
import type { CVData } from "@/lib/pdf-restructure";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Preview PDF — free, always watermarked, rate-limited */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { allowed } = await checkRateLimitWith(`preview-pdf:${userId}`, 30, "1 h");
  if (!allowed) {
    return NextResponse.json({ error: "Trop de prévisualisations. Réessayez dans 1h." }, { status: 429 });
  }

  let body: { cvJson?: CVData; cvText?: string; templateId?: string; acceptedGaps?: { texte_original?: string; texte_suggere?: string; category?: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (!body.cvJson && !body.cvText) {
    return NextResponse.json({ error: "CV requis" }, { status: 400 });
  }

  try {
    // If no cvJson, restructure from cvText server-side
    let cvData: CVData;
    if (body.cvJson) {
      cvData = body.cvJson;
    } else {
      const { restructureWithGPT } = await import("@/lib/pdf-restructure");
      cvData = await restructureWithGPT(body.cvText!, []);
    }
    if (body.acceptedGaps && body.acceptedGaps.length > 0) {
      const { applyGapsToCvData } = await import("@/lib/apply-gaps");
      cvData = applyGapsToCvData(cvData, body.acceptedGaps);
    }

    // Pre-process photo to circular crop
    if (cvData.photo) {
      const { circularCrop } = await import("@/lib/photo-circle");
      cvData = { ...cvData, photo: await circularCrop(cvData.photo, 120) };
    }

    const buffer = await renderCvPdf(cvData, {
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
