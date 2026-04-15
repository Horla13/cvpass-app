import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Cron endpoint — sends retention emails J5, J7, J10.
 * Called daily by Vercel Cron or manually.
 * Protected by CRON_SECRET env var.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) return NextResponse.json({ error: "No Brevo key" }, { status: 500 });

  const now = Date.now();
  const sent = { j5: 0, j7: 0, j10: 0 };

  // Get all subscriptions with email and created_at
  const { data: subs } = await admin
    .from("subscriptions")
    .select("user_id, email, created_at, plan")
    .not("email", "is", null)
    .eq("plan", "free");

  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent, message: "No free users" });
  }

  for (const sub of subs) {
    if (!sub.email || !sub.created_at) continue;
    const ageMs = now - new Date(sub.created_at).getTime();
    const ageDays = Math.floor(ageMs / 86400000);

    // Check which email to send based on age
    let emailType: "j5" | "j7" | "j10" | null = null;
    if (ageDays === 5) emailType = "j5";
    else if (ageDays === 7) emailType = "j7";
    else if (ageDays === 10) emailType = "j10";

    if (!emailType) continue;

    // Check if already sent (use credit_transactions as log with reason = retention_j5/j7/j10)
    const reason = `retention_${emailType}`;
    const { data: existing } = await admin
      .from("credit_transactions")
      .select("id")
      .eq("user_id", sub.user_id)
      .eq("reason", reason)
      .maybeSingle();

    if (existing) continue; // Already sent

    // Send the email via Brevo transactional API
    const emailConfig = getEmailConfig(emailType, sub.email);
    if (!emailConfig) continue;

    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
        body: JSON.stringify(emailConfig),
      });

      if (res.ok) {
        // Log that we sent this email
        await admin.from("credit_transactions").insert({
          user_id: sub.user_id,
          amount: 0,
          reason,
        });
        sent[emailType]++;
      }
    } catch { /* ignore individual failures */ }
  }

  return NextResponse.json({ sent, total: subs.length });
}

function getEmailConfig(type: "j5" | "j7" | "j10", email: string) {
  const sender = { name: "Giovanni de CVpass", email: "contact@cvpass.fr" };

  if (type === "j5") {
    return {
      sender,
      to: [{ email }],
      subject: "Les 3 erreurs qui font filtrer votre CV",
      htmlContent: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#111827;padding:20px;text-align:center;border-radius:8px 8px 0 0">
          <span style="color:#fff;font-weight:800;font-size:20px">CV<span style="color:#16a34a">pass</span></span>
        </div>
        <div style="padding:28px 24px;color:#111827">
          <p>Bonjour,</p>
          <p style="line-height:1.6">Vous vous etes inscrit il y a quelques jours. Voici les 3 erreurs les plus courantes que nous detectons :</p>
          <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:12px 16px;border-radius:0 8px 8px 0;margin:12px 0"><strong style="color:#991b1b">1.</strong> <span style="color:#991b1b">Pas de section Competences identifiable</span></div>
          <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:12px 16px;border-radius:0 8px 8px 0;margin:12px 0"><strong style="color:#991b1b">2.</strong> <span style="color:#991b1b">Mots-cles du secteur absents</span></div>
          <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:12px 16px;border-radius:0 8px 8px 0;margin:12px 0"><strong style="color:#991b1b">3.</strong> <span style="color:#991b1b">Format PDF image illisible pour les ATS</span></div>
          <p style="line-height:1.6;margin-top:16px">Le seul moyen de verifier : tester votre CV.</p>
          <div style="text-align:center;margin:24px 0"><a href="https://cvpass.fr/analyze" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none">Tester mon CV gratuitement</a></div>
        </div>
        <div style="color:#9ca3af;font-size:12px;padding:16px 24px;border-top:1px solid #f3f4f6">Giovanni Russo - <a href="https://cvpass.fr" style="color:#16a34a">cvpass.fr</a></div>
      </div>`,
    };
  }

  if (type === "j7") {
    return {
      sender,
      to: [{ email }],
      subject: "De 42 a 87 en 30 secondes",
      htmlContent: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#111827;padding:20px;text-align:center;border-radius:8px 8px 0 0">
          <span style="color:#fff;font-weight:800;font-size:20px">CV<span style="color:#16a34a">pass</span></span>
        </div>
        <div style="padding:28px 24px;color:#111827">
          <p>Bonjour,</p>
          <p style="line-height:1.6">Cette semaine, nos utilisateurs Pro ont ameliore leur score de <strong style="color:#16a34a">+30 points en moyenne</strong>.</p>
          <div style="text-align:center;margin:24px 0;background:#f9fafb;padding:24px;border-radius:12px">
            <span style="font-size:36px;font-weight:800;color:#ef4444">42</span>
            <span style="font-size:24px;color:#16a34a;margin:0 16px">&rarr;</span>
            <span style="font-size:36px;font-weight:800;color:#16a34a">87</span>
          </div>
          <div style="border-left:4px solid #16a34a;background:#f0fdf4;padding:16px;border-radius:0 8px 8px 0;margin:16px 0">
            <p style="font-style:italic;color:#374151;margin:0;font-size:14px">Mon CV etait invisible. Apres CVpass, 3 entretiens en 1 semaine.</p>
            <p style="color:#6b7280;font-size:13px;margin:8px 0 0">- Utilisateur Pro</p>
          </div>
          <p style="line-height:1.6">Analyses illimitees, tous les templates, sans engagement. 8,90 euros par mois.</p>
          <div style="text-align:center;margin:24px 0"><a href="https://cvpass.fr/pricing" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none">Voir les plans Pro</a></div>
        </div>
        <div style="color:#9ca3af;font-size:12px;padding:16px 24px;border-top:1px solid #f3f4f6">Giovanni Russo - <a href="https://cvpass.fr" style="color:#16a34a">cvpass.fr</a></div>
      </div>`,
    };
  }

  if (type === "j10") {
    return {
      sender,
      to: [{ email }],
      subject: "Derniere chance : -15% sur le Pro CVpass",
      htmlContent: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#111827;padding:20px;text-align:center;border-radius:8px 8px 0 0">
          <span style="color:#fff;font-weight:800;font-size:20px">CV<span style="color:#16a34a">pass</span></span>
        </div>
        <div style="padding:28px 24px;color:#111827">
          <p>Bonjour,</p>
          <p style="line-height:1.6">Votre CV merite une derniere verification avant votre prochaine candidature.</p>
          <div style="text-align:center;background:#f9fafb;border:2px solid #16a34a;border-radius:12px;padding:28px;margin:20px 0">
            <p style="font-size:14px;color:#6b7280;text-decoration:line-through;margin:0 0 4px">8,90 euros/mois</p>
            <p style="font-size:38px;font-weight:800;color:#16a34a;margin:0;line-height:1">7,57 euros</p>
            <p style="font-size:14px;color:#16a34a;font-weight:600;margin:4px 0 12px">le premier mois avec le code PRO15</p>
            <p style="font-size:13px;color:#6b7280;margin:0">Analyses illimitees. Sans engagement.</p>
          </div>
          <div style="text-align:center;margin:24px 0"><a href="https://cvpass.fr/pricing" style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none">Passer au Pro a -15%</a></div>
          <p style="font-size:13px;color:#9ca3af;text-align:center">Code PRO15 - valable une seule fois</p>
        </div>
        <div style="color:#9ca3af;font-size:12px;padding:16px 24px;border-top:1px solid #f3f4f6">Giovanni Russo - <a href="https://cvpass.fr" style="color:#16a34a">cvpass.fr</a></div>
      </div>`,
    };
  }

  return null;
}
