import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { canUsePremiumFeature } from "@/lib/billing";
import { Gap } from "@/lib/store";
import { restructureWithGPT, buildCvPdfBuffer, buildLetterPdfBuffer, CVData } from "@/lib/pdf-builder";
import { sendEmailWithAttachment } from "@/lib/brevo";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const userEmail = user.emailAddresses[0]?.emailAddress;
  const firstName = user.firstName ?? "là";

  const allowed = await canUsePremiumFeature(userId, userEmail);
  if (!allowed) {
    return NextResponse.json({ error: "quota_exceeded", upgradeUrl: "/pricing" }, { status: 402 });
  }

  let body: {
    type: "cv" | "letter";
    email: string;
    // CV fields
    cvText?: string;
    acceptedGaps?: Gap[];
    cvJson?: CVData;
    // Letter fields
    letterContent?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { type, email } = body;
  if (!email) {
    return NextResponse.json({ error: "Email destinataire requis" }, { status: 400 });
  }

  try {
    if (type === "cv") {
      const { cvText, acceptedGaps = [], cvJson } = body;
      if (!cvText && !cvJson) {
        return NextResponse.json({ error: "Texte ou JSON du CV requis" }, { status: 400 });
      }

      const cvData: CVData = cvJson ?? (await restructureWithGPT(cvText!, acceptedGaps));
      const buffer = await buildCvPdfBuffer(cvData);
      const base64 = buffer.toString("base64");

      const subject = "Ton CV optimisé par CVpass";
      const htmlContent = `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827;">
          <h2 style="color:#16a34a;">Ton CV optimisé est prêt !</h2>
          <p>Bonjour ${firstName},</p>
          <p>Retrouve ci-joint ton CV optimisé par CVpass.</p>
          <p>Bonne chance dans ta recherche d'emploi !</p>
          <p style="margin-top:32px;color:#6b7280;">L'équipe CVpass<br/>
            <a href="https://cvpass.fr" style="color:#16a34a;">cvpass.fr</a>
          </p>
        </div>
      `;

      await sendEmailWithAttachment(email, firstName, subject, htmlContent, {
        name: "cv-optimise-cvpass.pdf",
        content: base64,
      });

      return NextResponse.json({ success: true });
    }

    if (type === "letter") {
      const { letterContent } = body;
      if (!letterContent) {
        return NextResponse.json({ error: "Contenu de la lettre requis" }, { status: 400 });
      }

      const senderName = [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined;

      // Fetch city/phone from latest cv_json
      let senderCity: string | undefined;
      let senderPhone: string | undefined;
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      const { data: latestAnalysis } = await supabaseAdmin
        .from("analyses")
        .select("cv_json")
        .eq("user_id", userId)
        .not("cv_json", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (latestAnalysis?.cv_json) {
        const cvJson = latestAnalysis.cv_json as { contact?: { telephone?: string; ville?: string } };
        senderCity = cvJson.contact?.ville;
        senderPhone = cvJson.contact?.telephone;
      }

      const buffer = await buildLetterPdfBuffer(letterContent, { senderName, senderEmail: userEmail, senderCity, senderPhone });
      const base64 = buffer.toString("base64");

      const subject = "Ta lettre de motivation générée par CVpass";
      const htmlContent = `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827;">
          <h2 style="color:#16a34a;">Ta lettre de motivation est prête !</h2>
          <p>Bonjour ${firstName},</p>
          <p>Retrouve ci-joint ta lettre de motivation générée par CVpass.</p>
          <p>Bonne chance dans ta recherche d'emploi !</p>
          <p style="margin-top:32px;color:#6b7280;">L'équipe CVpass<br/>
            <a href="https://cvpass.fr" style="color:#16a34a;">cvpass.fr</a>
          </p>
        </div>
      `;

      await sendEmailWithAttachment(email, firstName, subject, htmlContent, {
        name: "lettre-motivation-cvpass.pdf",
        content: base64,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Type invalide (cv ou letter)" }, { status: 400 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur d'envoi";
    console.error("send-email error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
