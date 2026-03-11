import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { canUsePremiumFeature } from "@/lib/billing";
import React from "react";
import { Gap } from "@/lib/store";

export const dynamic = "force-dynamic";

function applyDOMMatrixPolyfill() {
  if (typeof globalThis.DOMMatrix === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).DOMMatrix = class DOMMatrix {
      a=1;b=0;c=0;d=1;e=0;f=0;
      m11=1;m12=0;m13=0;m14=0;m21=0;m22=1;m23=0;m24=0;
      m31=0;m32=0;m33=1;m34=0;m41=0;m42=0;m43=0;m44=1;
      is2D=true;isIdentity=true;
      constructor(_init?: string | number[]) {}
      static fromMatrix() { return new DOMMatrix(); }
      multiply() { return this; }
      translate() { return this; }
      scale() { return this; }
      rotate() { return this; }
      inverse() { return this; }
      flipX() { return this; }
      flipY() { return this; }
      toFloat32Array() { return new Float32Array(16); }
      toFloat64Array() { return new Float64Array(16); }
      toString() { return "matrix(1, 0, 0, 1, 0, 0)"; }
    };
  }
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
    // Polyfill must run BEFORE the dynamic import of @react-pdf/renderer
    applyDOMMatrixPolyfill();

    // Dynamic imports so the polyfill is applied before the module loads
    const [{ renderToBuffer }, { CVDocument }] = await Promise.all([
      import("@react-pdf/renderer"),
      import("@/components/pdf/CVDocument"),
    ]);

    const element = React.createElement(CVDocument, { cvText, acceptedGaps });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(element as any);

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
