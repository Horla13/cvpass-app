import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { restructureWithGPT } from "@/lib/pdf-restructure";
import { checkRateLimitWith } from "@/lib/rate-limit";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { allowed: rateLimitOk } = await checkRateLimitWith(`restructure-cv:${userId}`, 10, "1 h");
  if (!rateLimitOk) {
    return NextResponse.json(
      { error: "Limite atteinte. Réessaie dans 1 heure.", code: "rate_limit_exceeded" },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => null);
  const cvText = body?.cvText?.trim()?.slice(0, 50000);
  if (!cvText) {
    return NextResponse.json({ error: "CV requis" }, { status: 400 });
  }

  try {
    const cvJson = await restructureWithGPT(cvText, []);
    return NextResponse.json({ cv_json: cvJson });
  } catch (e) {
    console.error("Restructure CV error:", e);
    return NextResponse.json({ error: "Erreur de restructuration" }, { status: 500 });
  }
}
