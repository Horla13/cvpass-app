import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { restructureWithGPT } from "@/lib/pdf-restructure";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const cvText = body?.cvText?.trim();
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
