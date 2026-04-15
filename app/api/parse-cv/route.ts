import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { extractTextFromBuffer } from "@/lib/parse-document";
import { checkRateLimitWith } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { allowed } = await checkRateLimitWith(`parse-cv:${userId}`, 20, "1 h");
  if (!allowed) {
    return NextResponse.json({ error: "Trop d'uploads. Réessayez dans 1 heure." }, { status: 429 });
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

  // MIME type validation
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const fileName = file.name.toLowerCase();
  const isValidExt = fileName.endsWith(".pdf") || fileName.endsWith(".docx");
  const isValidMime = allowedTypes.includes(file.type) || file.type === "application/octet-stream";
  if (!isValidExt || !isValidMime) {
    return NextResponse.json({ error: "Format invalide (PDF ou DOCX uniquement)" }, { status: 400 });
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
