import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_EMAILS = ["giovannirusso2004@gmail.com"];

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

          <!-- Intro -->
          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 16px;">Bonjour,</p>
          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 16px;">
            Vous faites partie des <strong>premiers utilisateurs</strong> de CVpass, et je tenais à vous remercier personnellement pour votre confiance.
          </p>

          <!-- Beta closing banner -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr><td style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;text-align:center;">
              <span style="font-size:20px;">&#9888;&#65039;</span>
              <p style="margin:8px 0 0;font-size:14px;font-weight:700;color:#92400e;">La phase beta touche bientôt à sa fin.</p>
              <p style="margin:4px 0 0;font-size:13px;color:#a16207;">Avant de passer à la version publique, votre retour est essentiel.</p>
            </td></tr>
          </table>

          <!-- Improvements -->
          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 12px;">
            Depuis votre inscription, <strong>de très nombreuses améliorations</strong> ont été apportées :
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> Analyse CV + offre d'emploi (matching intelligent)
                </td></tr>
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> Scores ATS plus précis et cohérents
                </td></tr>
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> Suggestions de reformulation optimisées
                </td></tr>
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> Export PDF du CV amélioré
                </td></tr>
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> Génération de lettre de motivation
                </td></tr>
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> Mode sombre complet
                </td></tr>
                <tr><td style="padding:6px 0;font-size:14px;line-height:1.5;color:#166534;">
                  <span style="color:#16a34a;font-weight:bold;margin-right:8px;">&#10003;</span> Interface repensée et plus fluide
                </td></tr>
              </table>
            </td></tr>
          </table>

          <!-- Feedback questions -->
          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 12px;">
            <strong>Avant la fermeture de la beta</strong>, j'aimerais connaître votre avis :
          </p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
            <tr><td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:20px 24px;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
                <tr><td style="padding:8px 0;font-size:14px;color:#374151;">
                  <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:#16a34a;color:white;border-radius:50%;font-size:12px;font-weight:bold;margin-right:10px;">1</span>
                  Avez-vous trouvé CVpass utile ?
                </td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#374151;">
                  <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:#16a34a;color:white;border-radius:50%;font-size:12px;font-weight:bold;margin-right:10px;">2</span>
                  Qu'est-ce qui pourrait être amélioré ?
                </td></tr>
                <tr><td style="padding:8px 0;font-size:14px;color:#374151;">
                  <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;background:#16a34a;color:white;border-radius:50%;font-size:12px;font-weight:bold;margin-right:10px;">3</span>
                  Recommanderiez-vous CVpass à un ami ?
                </td></tr>
              </table>
            </td></tr>
          </table>

          <p style="font-size:15px;line-height:1.6;color:#111827;margin:0 0 24px;">
            Vous pouvez simplement <strong>répondre à cet email</strong> — je lis chaque retour personnellement.
          </p>

          <!-- CTA Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:8px 0 28px;">
              <a href="${appUrl}/analyze"
                 style="display:inline-block;background:#16a34a;color:#ffffff;font-weight:700;padding:16px 32px;border-radius:10px;text-decoration:none;font-size:15px;letter-spacing:-0.2px;">
                Profiter de la beta avant sa fermeture &#8594;
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
      subject: "La beta CVpass ferme bientôt — votre avis avant la suite ?",
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
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { clerkClient } = await import("@clerk/nextjs/server");
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // Check for dry-run mode (preview without sending)
  const body = await req.json().catch(() => ({}));
  const dryRun = body?.dryRun === true;

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "contact@cvpass.fr";

  if (!apiKey && !dryRun) {
    return NextResponse.json({ error: "BREVO_API_KEY manquante" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cvpass.fr";
  const html = buildHtml(appUrl);

  const admin = getSupabaseAdmin();
  const { data: whitelist, error: dbError } = await admin
    .from("early_access")
    .select("email");

  if (dbError || !whitelist) {
    return NextResponse.json({ error: "Erreur lecture whitelist" }, { status: 500 });
  }

  const emails = whitelist.map((r: { email: string }) => r.email);

  // Dry run: return preview without sending
  if (dryRun) {
    return NextResponse.json({
      mode: "dry_run",
      subject: "La beta CVpass ferme bientôt — votre avis avant la suite ?",
      recipients: emails,
      total: emails.length,
      htmlPreview: html,
    });
  }

  // Send to all recipients
  const results: { email: string; sent: boolean }[] = [];
  for (const e of emails) {
    const sent = await sendOne(e, apiKey!, senderEmail, html);
    results.push({ email: e, sent });
  }

  const sentCount = results.filter((r) => r.sent).length;
  return NextResponse.json({
    mode: "sent",
    total: emails.length,
    sent: sentCount,
    failed: emails.length - sentCount,
    details: results,
  });
}
