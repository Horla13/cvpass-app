import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isAdmin } from "@/lib/admin";
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

function buildHtml(appUrl: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- HEADER -->
        <tr><td style="background:#111827;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center;">
          <span style="font-size:26px;font-weight:800;letter-spacing:-0.5px;color:#ffffff;">CV</span><span style="font-size:26px;font-weight:800;letter-spacing:-0.5px;color:#16a34a;">pass</span>
        </td></tr>

        <!-- BODY -->
        <tr><td style="background:#ffffff;padding:36px 32px 28px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">

          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 16px;">Bonjour,</p>
          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 16px;">
            Merci infiniment d'avoir fait partie des <strong>premiers utilisateurs de CVpass</strong>. Votre participation à la bêta nous a été précieuse pour améliorer l'outil.
          </p>

          <!-- Beta closed banner -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr><td style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:20px 24px;text-align:center;">
              <p style="margin:0;font-size:16px;font-weight:800;color:#92400e;">La phase bêta est officiellement terminée.</p>
              <p style="margin:8px 0 0;font-size:14px;color:#a16207;">CVpass est maintenant ouvert au grand public.</p>
            </td></tr>
          </table>

          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 16px;">
            Votre accès Early Access prend fin aujourd'hui. Votre compte repart à <strong>0 crédit</strong>.
          </p>

          <!-- What's available -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;">
              <p style="margin:0 0 14px;font-size:14px;font-weight:700;color:#166534;">Pour continuer à utiliser CVpass :</p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> <strong>Pack Starter — 2,90€</strong> : 4 crédits d'analyse (paiement unique)
                </td></tr>
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> <strong>Recherche Active — 8,90€/mois</strong> : analyses illimitées pendant 30 jours
                </td></tr>
              </table>
            </td></tr>
          </table>

          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 24px;">
            Encore merci pour votre confiance et vos retours qui ont contribué à façonner CVpass. 🙏
          </p>

          <!-- CTA Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:8px 0 28px;">
              <a href="${appUrl}/pricing"
                 style="display:inline-block;background:#16a34a;color:#ffffff;font-weight:700;padding:16px 32px;border-radius:10px;text-decoration:none;font-size:15px;letter-spacing:-0.2px;">
                Voir les offres &#8594;
              </a>
            </td></tr>
          </table>

          <!-- Signature -->
          <table role="presentation" cellpadding="0" cellspacing="0" style="border-top:1px solid #f3f4f6;padding-top:20px;width:100%;">
            <tr><td style="padding-top:20px;">
              <p style="margin:0 0 4px;font-size:14px;color:#111827;">Merci encore pour votre soutien,</p>
              <p style="margin:12px 0 0;font-size:15px;font-weight:700;color:#111827;">Giovanni</p>
              <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">Fondateur de CVpass</p>
            </td></tr>
          </table>

        </td></tr>

        <!-- FOOTER -->
        <tr><td style="background:#f9fafb;padding:20px 32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;text-align:center;">
          <a href="${appUrl}" style="color:#16a34a;font-size:12px;text-decoration:none;font-weight:600;">cvpass.fr</a>
          <span style="color:#d1d5db;margin:0 8px;">&middot;</span>
          <a href="${appUrl}/mentions-legales" style="color:#9ca3af;font-size:12px;text-decoration:none;">Mentions légales</a>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendOne(email: string, apiKey: string, senderEmail: string, html: string) {
  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "api-key": apiKey },
    body: JSON.stringify({
      sender: { name: "Giovanni — CVpass", email: senderEmail },
      replyTo: { email: senderEmail, name: "Giovanni — CVpass" },
      to: [{ email }],
      subject: "La bêta CVpass est terminée — merci pour votre soutien ❤️",
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Brevo error for ${email}:`, err);
  }

  return res.ok;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun = body?.dryRun === true;

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "contact@cvpass.fr";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cvpass.fr";

  if (!apiKey && !dryRun) {
    return NextResponse.json({ error: "BREVO_API_KEY manquante" }, { status: 500 });
  }

  const admin = getSupabaseAdmin();

  // Fetch all early_access emails
  const { data: whitelist, error: dbError } = await admin
    .from("early_access")
    .select("email");

  if (dbError || !whitelist) {
    return NextResponse.json({ error: "Erreur lecture early_access" }, { status: 500 });
  }

  const emails = whitelist.map((r: { email: string }) => r.email);

  if (dryRun) {
    return NextResponse.json({
      mode: "dry_run",
      subject: "La bêta CVpass est terminée — merci pour votre soutien ❤️",
      recipients: emails,
      total: emails.length,
    });
  }

  // 1. Send emails
  const results: { email: string; sent: boolean }[] = [];
  for (const e of emails) {
    const html = buildHtml(appUrl);
    const sent = await sendOne(e, apiKey!, senderEmail, html);
    results.push({ email: e, sent });
  }

  // 2. Reset subscriptions of early_access users to free + 0 credits
  // We match by email in subscriptions table
  const { error: subError } = await admin
    .from("subscriptions")
    .update({
      plan: "free",
      credits_remaining: 0,
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .in("email", emails);

  if (subError) {
    console.error("Error resetting subscriptions:", subError);
  }

  // 3. Clear early_access table
  const { error: clearError } = await admin
    .from("early_access")
    .delete()
    .in("email", emails);

  if (clearError) {
    console.error("Error clearing early_access:", clearError);
  }

  const sentCount = results.filter((r) => r.sent).length;
  return NextResponse.json({
    mode: "executed",
    total: emails.length,
    emailsSent: sentCount,
    emailsFailed: emails.length - sentCount,
    subscriptionsReset: !subError,
    earlyAccessCleared: !clearError,
    details: results,
  });
}
