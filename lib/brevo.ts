const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface EmailPayload {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  attachment?: { name: string; content: string }[];
  scheduledAt?: string;
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "contact@cvpass.fr";

  if (!apiKey) {
    console.warn("BREVO_API_KEY non configuré — email non envoyé");
    return;
  }

  const body: Record<string, unknown> = {
    sender: { name: "CVpass", email: senderEmail },
    to: payload.to,
    subject: payload.subject,
    htmlContent: payload.htmlContent,
  };

  if (payload.attachment) {
    body.attachment = payload.attachment;
  }

  if (payload.scheduledAt) {
    body.scheduledAt = payload.scheduledAt;
  }

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Brevo email error:", err);
  }
}

export async function sendEmailWithAttachment(
  to: string,
  firstName: string,
  subject: string,
  htmlContent: string,
  attachment: { name: string; content: string }
): Promise<void> {
  await sendEmail({
    to: [{ email: to, name: firstName }],
    subject,
    htmlContent,
    attachment: [attachment],
  });
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cvpass.fr";
  await sendEmail({
    to: [{ email, name: firstName }],
    subject: "Bienvenue sur CVpass 🎉 — analysez votre premier CV maintenant",
    htmlContent: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827;">
        <h2 style="color:#16a34a;margin-bottom:8px;">Bienvenue, ${firstName} !</h2>
        <p style="margin-top:0;">Votre compte CVpass est prêt.</p>
        <p>En 2 minutes, découvrez votre score ATS et obtenez des suggestions précises pour décrocher plus d'entretiens.</p>
        <div style="margin:28px 0;">
          <a href="${appUrl}/analyze"
             style="display:inline-block;background:#16a34a;color:white;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">
            Analyser mon CV maintenant →
          </a>
        </div>
        <p style="color:#6b7280;font-size:12px;margin-top:40px;border-top:1px solid #f3f4f6;padding-top:16px;">
          L'équipe CVpass<br/>
          <a href="${appUrl}" style="color:#16a34a;">cvpass.fr</a> ·
          <a href="${appUrl}/mentions-legales" style="color:#6b7280;">Mentions légales</a>
        </p>
      </div>
    `,
  });
}

export async function sendRetentionEmailJ3(
  email: string,
  firstName: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cvpass.fr";
  const scheduledAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  await sendEmail({
    to: [{ email, name: firstName }],
    subject: `Avez-vous testé CVpass, ${firstName} ?`,
    scheduledAt,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#111827;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
          <span style="color:white;font-weight:bold;font-size:20px;">CVpass</span>
        </div>
        <div style="padding:28px 24px;color:#111827;">
          <p>Bonjour ${firstName},</p>
          <p>Vous vous êtes inscrit il y a 3 jours.</p>
          <p>Des milliers de CVs sont analysés chaque semaine avec CVpass.</p>
          <p><strong>Le vôtre aussi mérite une analyse.</strong></p>
          <div style="background:#f9fafb;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
            <span style="font-size:36px;font-weight:bold;color:#ef4444;">42</span>
            <span style="font-size:24px;color:#6b7280;margin:0 12px;">&rarr;</span>
            <span style="font-size:36px;font-weight:bold;color:#16a34a;">87</span>
          </div>
          <div style="text-align:center;margin:28px 0;">
            <a href="${appUrl}/dashboard"
               style="display:inline-block;background:#16a34a;color:white;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">
              Analyser mon CV maintenant &rarr;
            </a>
          </div>
        </div>
        <div style="color:#6b7280;font-size:12px;padding:16px 24px;border-top:1px solid #f3f4f6;">
          <p>L'équipe CVpass</p>
          <a href="${appUrl}" style="color:#16a34a;">cvpass.fr</a> &middot;
          <a href="${appUrl}/mentions-legales" style="color:#6b7280;">Mentions légales</a>
        </div>
      </div>
    `,
  });
}

export async function sendRetentionEmailJ7(
  email: string,
  firstName: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cvpass.fr";
  const scheduledAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  await sendEmail({
    to: [{ email, name: firstName }],
    subject: `Résultats CVpass cette semaine : +31 points en moyenne 📈`,
    scheduledAt,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <div style="background:#111827;padding:20px;text-align:center;border-radius:8px 8px 0 0;">
          <span style="color:white;font-weight:bold;font-size:20px;">CVpass</span>
        </div>
        <div style="padding:28px 24px;color:#111827;">
          <p>Bonjour ${firstName},</p>
          <div style="text-align:center;margin:24px 0;">
            <span style="font-size:48px;font-weight:900;color:#16a34a;">+31 points</span>
            <p style="color:#6b7280;font-size:16px;margin-top:4px;">de score ATS en moyenne cette semaine</p>
          </div>
          <div style="border-left:4px solid #16a34a;background:#f9fafb;padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
            <p style="font-style:italic;color:#374151;margin:0;">
              &laquo; Mon CV est passé de 38 à 84. J'ai eu un entretien la semaine suivante. &raquo;
            </p>
            <p style="color:#6b7280;font-size:13px;margin:8px 0 0 0;">&mdash; Marie, beta-testeuse</p>
          </div>
          <p>Il n'est pas trop tard pour optimiser votre CV avant votre prochaine candidature.</p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${appUrl}/dashboard"
               style="display:inline-block;background:#16a34a;color:white;font-weight:bold;padding:14px 28px;border-radius:10px;text-decoration:none;font-size:15px;">
              Voir mon score ATS &rarr;
            </a>
          </div>
        </div>
        <div style="color:#6b7280;font-size:12px;padding:16px 24px;border-top:1px solid #f3f4f6;">
          <p>L'équipe CVpass</p>
          <a href="${appUrl}" style="color:#16a34a;">cvpass.fr</a> &middot;
          <a href="${appUrl}/mentions-legales" style="color:#6b7280;">Mentions légales</a>
          <br/><br/>
          <a href="${appUrl}/unsubscribe?email=${email}" style="color:#9ca3af;font-size:11px;">Se désabonner</a>
        </div>
      </div>
    `,
  });
}

export async function sendAnalysisEmail(
  email: string,
  firstName: string,
  scoreAvant: number,
  scoreApres: number,
  jobTitle: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cvpass.fr";
  const gain = scoreApres - scoreAvant;
  await sendEmail({
    to: [{ email, name: firstName }],
    subject: `Votre CV optimisé pour "${jobTitle}" — Score +${gain} pts`,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827;">
        <h1 style="color:#16a34a;">Votre analyse est terminée !</h1>
        <p>Résumé pour le poste <strong>${jobTitle}</strong> :</p>
        <div style="background:#f9fafb;border-radius:12px;padding:16px;margin:16px 0;text-align:center;">
          <span style="font-size:14px;color:#6b7280;">Score ATS</span><br/>
          <span style="font-size:32px;font-weight:bold;color:#111827;">${scoreAvant}</span>
          <span style="font-size:24px;color:#16a34a;margin:0 12px;">→</span>
          <span style="font-size:32px;font-weight:bold;color:#16a34a;">${scoreApres}</span>
          <br/><span style="color:#16a34a;font-size:14px;">+${gain} points</span>
        </div>
        <a href="${appUrl}/history"
           style="display:inline-block;background:#16a34a;color:white;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
          Voir mon historique →
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:32px;">CVpass — VertexLab SASU</p>
      </div>
    `,
  });
}
