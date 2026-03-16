import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_EMAILS = ["giovannirusso2004@gmail.com"];

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

async function sendOne(email: string, apiKey: string, senderEmail: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cvpass.fr";

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      sender: { name: "Giovanni — CVpass", email: senderEmail },
      to: [{ email }],
      subject: "Votre avis compte — CVpass a beaucoup évolué !",
      htmlContent: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827;">
          <div style="background:#111827;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
            <span style="color:white;font-weight:bold;font-size:20px;">CV<span style="color:#16a34a;">pass</span></span>
          </div>
          <div style="padding:28px 24px;">
            <p>Bonjour,</p>
            <p>Vous faites partie des premiers utilisateurs de <strong>CVpass</strong>, et je tenais à vous remercier personnellement pour votre confiance.</p>

            <p>Depuis votre inscription, <strong>de très nombreuses améliorations</strong> ont été apportées à l'application :</p>

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin:20px 0;">
              <ul style="margin:0;padding-left:20px;color:#166534;line-height:1.8;">
                <li>Analyse CV + offre d'emploi (matching intelligent)</li>
                <li>Scores ATS plus précis et cohérents</li>
                <li>Suggestions de reformulation optimisées</li>
                <li>Export PDF du CV amélioré</li>
                <li>Génération de lettre de motivation</li>
                <li>Mode sombre complet</li>
                <li>Interface repensée et plus fluide</li>
              </ul>
            </div>

            <p>Votre retour est <strong>essentiel</strong> pour continuer à améliorer CVpass. J'aimerais beaucoup connaître votre avis :</p>

            <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:20px 0;border:1px solid #e5e7eb;">
              <p style="margin:0 0 8px;font-weight:600;">Quelques questions rapides :</p>
              <ol style="margin:0;padding-left:20px;line-height:2;color:#374151;">
                <li>Avez-vous trouvé CVpass utile ?</li>
                <li>Qu'est-ce qui pourrait être amélioré ?</li>
                <li>Recommanderiez-vous CVpass à un ami en recherche d'emploi ?</li>
              </ol>
            </div>

            <p>Vous pouvez simplement <strong>répondre à cet email</strong> — je lis chaque retour personnellement.</p>

            <div style="text-align:center;margin:28px 0;">
              <a href="${appUrl}/analyze"
                 style="display:inline-block;background:#16a34a;color:white;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">
                Ré-essayer CVpass maintenant →
              </a>
            </div>

            <p>Merci encore pour votre soutien,</p>
            <p style="margin:0;"><strong>Giovanni</strong><br/>
            <span style="color:#6b7280;font-size:13px;">Fondateur de CVpass</span></p>
          </div>
          <div style="color:#6b7280;font-size:12px;padding:16px 24px;border-top:1px solid #f3f4f6;">
            <a href="${appUrl}" style="color:#16a34a;">cvpass.fr</a> &middot;
            <a href="${appUrl}/mentions-legales" style="color:#6b7280;">Mentions légales</a>
          </div>
        </div>
      `,
    }),
  });

  return res.ok;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Admin check via Clerk email
  const { clerkClient } = await import("@clerk/nextjs/server");
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "contact@cvpass.fr";

  if (!apiKey) {
    return NextResponse.json({ error: "BREVO_API_KEY manquante" }, { status: 500 });
  }

  const admin = getSupabaseAdmin();
  const { data: whitelist, error } = await admin
    .from("beta_whitelist")
    .select("email");

  if (error || !whitelist) {
    return NextResponse.json({ error: "Erreur lecture whitelist" }, { status: 500 });
  }

  const emails = whitelist.map((r: { email: string }) => r.email);
  const results: { email: string; sent: boolean }[] = [];

  for (const e of emails) {
    const sent = await sendOne(e, apiKey, senderEmail);
    results.push({ email: e, sent });
  }

  const sentCount = results.filter((r) => r.sent).length;
  return NextResponse.json({
    total: emails.length,
    sent: sentCount,
    failed: emails.length - sentCount,
    details: results,
  });
}
