import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { canUsePremiumFeature } from "@/lib/billing";
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer";
import { CVDocument } from "@/components/pdf/CVDocument";
import React from "react";
import { Gap } from "@/lib/store";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Vérifier accès premium (early access ou abonnement mensuel)
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
    const element = React.createElement(CVDocument, { cvText, acceptedGaps });
    const buffer = await renderToBuffer(
      element as React.ReactElement<DocumentProps>
    );

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
