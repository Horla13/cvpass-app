import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { canUsePremiumFeature } from "@/lib/billing";
import { Gap } from "@/lib/store";

export const dynamic = "force-dynamic";

/** Detect a section heading: ALL-CAPS, 3–50 chars, contains at least one letter */
function isHeadingLine(line: string): boolean {
  const t = line.trim();
  return (
    t.length >= 3 &&
    t.length <= 50 &&
    t === t.toUpperCase() &&
    /[A-ZÀÂÉÈÊËÏÎÔÙÛÜÇ]/.test(t)
  );
}

/** Build pdfmake content array from CV plain text */
function buildContent(text: string): unknown[] {
  const lines = text.split("\n");
  const content: unknown[] = [];

  // Locate first heading to isolate the header block
  let firstHeadingIdx = lines.findIndex((l) => isHeadingLine(l));
  if (firstHeadingIdx === -1) firstHeadingIdx = Math.min(4, lines.length);

  // ── Header block (name + contact) ────────────────────────────────────────
  const headerLines = lines.slice(0, firstHeadingIdx).filter((l) => l.trim());
  if (headerLines.length > 0) {
    // First non-empty line = full name
    content.push({
      text: headerLines[0].trim(),
      font: "Helvetica",
      fontSize: 18,
      bold: true,
      color: "#111827",
      margin: [0, 0, 0, 4],
    });
    // Remaining header lines = contact info
    for (const line of headerLines.slice(1)) {
      content.push({
        text: line.trim(),
        font: "Helvetica",
        fontSize: 9,
        color: "#6b7280",
        margin: [0, 0, 0, 2],
      });
    }
    // Thin separator below header
    content.push({
      canvas: [
        {
          type: "line",
          x1: 0, y1: 0,
          x2: 495, y2: 0,
          lineWidth: 1,
          lineColor: "#e5e7eb",
        },
      ],
      margin: [0, 8, 0, 0],
    });
  }

  // ── Body (sections + content) ─────────────────────────────────────────────
  for (let i = firstHeadingIdx; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      content.push({ text: " ", margin: [0, 2] });
      continue;
    }

    if (isHeadingLine(trimmed)) {
      // Section title: green, bold, with separator below
      content.push({
        text: trimmed,
        font: "Helvetica",
        fontSize: 11,
        bold: true,
        color: "#16a34a",
        margin: [0, 12, 0, 3],
      });
      content.push({
        canvas: [
          {
            type: "line",
            x1: 0, y1: 0,
            x2: 495, y2: 0,
            lineWidth: 0.5,
            lineColor: "#d1d5db",
          },
        ],
        margin: [0, 0, 0, 4],
      });
    } else {
      content.push({
        text: line,
        font: "Helvetica",
        fontSize: 10,
        color: "#111827",
        margin: [0, 1],
      });
    }
  }

  return content;
}

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
    // Apply accepted suggestions — guard against empty texte_original
    // (empty string replace would prepend text to the document)
    let finalText = cvText;
    for (const gap of acceptedGaps) {
      const orig = gap.texte_original?.trim();
      if (orig && finalText.includes(orig)) {
        finalText = finalText.replace(orig, gap.texte_suggere);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfmake = require("pdfmake");
    pdfmake.setFonts({
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    });
    pdfmake.setUrlAccessPolicy(() => false);

    const docDefinition = {
      pageSize: "A4" as const,
      pageMargins: [40, 40, 40, 50] as [number, number, number, number],
      defaultStyle: { font: "Helvetica", fontSize: 10, lineHeight: 1.4 },
      footer: (_currentPage: number, _pageCount: number) => ({
        text: "Optimisé par CVpass • cvpass.fr",
        font: "Helvetica",
        fontSize: 8,
        color: "#d1d5db",
        alignment: "center",
        margin: [0, 0, 0, 20],
      }),
      content: buildContent(finalText),
    };

    const buffer: Buffer = await pdfmake.createPdf(docDefinition).getBuffer();

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
