import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { canUsePremiumFeature } from "@/lib/billing";
import { Gap } from "@/lib/store";

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

  let body: { cvText?: string; acceptedGaps?: Gap[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { cvText, acceptedGaps = [] } = body;
  if (!cvText) {
    return NextResponse.json({ error: "Texte du CV requis" }, { status: 400 });
  }

  try {
    // Appliquer les suggestions acceptées
    let finalText = cvText;
    for (const gap of acceptedGaps) {
      if (gap.texte_original) {
        finalText = finalText.replaceAll(gap.texte_original, gap.texte_suggere);
      }
    }

    // Générer le PDF avec pdfmake (100% Node.js, sans DOMMatrix)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PdfPrinter = require("pdfmake/build/pdfmake.js");
    const fonts = {
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);

    const lines = finalText.split("\n");
    const content = lines.map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return { text: " ", margin: [0, 2] };
      // Détecter les titres de section (ligne courte en majuscules)
      const isHeading = trimmed === trimmed.toUpperCase() && trimmed.length < 40 && trimmed.length > 2;
      return {
        text: line,
        font: "Helvetica",
        fontSize: isHeading ? 11 : 10,
        bold: isHeading,
        margin: isHeading ? [0, 8, 0, 2] : [0, 1],
        color: "#111827",
      };
    });

    const docDefinition = {
      pageSize: "A4" as const,
      pageMargins: [50, 50, 50, 50] as [number, number, number, number],
      defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
      content,
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      pdfDoc.on("data", (chunk: Buffer) => chunks.push(chunk));
      pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
      pdfDoc.on("error", reject);
      pdfDoc.end();
    });

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
