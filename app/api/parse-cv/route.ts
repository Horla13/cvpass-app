import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { extractTextFromBuffer } from "@/lib/parse-document";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Fichier trop lourd (max 5 Mo)" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const text = await extractTextFromBuffer(buffer, file.name);
    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "CV illisible ou trop court" },
        { status: 422 }
      );
    }
    return NextResponse.json({ text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur de parsing";
    return NextResponse.json({ error: msg }, { status: 422 });
  }
}
