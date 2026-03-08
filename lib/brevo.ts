const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

interface EmailPayload {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "contact@cvpass.fr";

  if (!apiKey) {
    console.warn("BREVO_API_KEY non configuré — email non envoyé");
    return;
  }

  const body = {
    sender: { name: "CVpass", email: senderEmail },
    ...payload,
  };

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

export async function sendWelcomeEmail(
  email: string,
  firstName: string
): Promise<void> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://cvpass.fr";
  await sendEmail({
    to: [{ email, name: firstName }],
    subject: "Bienvenue sur CVpass 🎉",
    htmlContent: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#111827;">
        <h1 style="color:#16a34a;">Bienvenue, ${firstName} !</h1>
        <p>Votre compte CVpass est prêt. Vous bénéficiez d'<strong>1 analyse CV gratuite</strong> pour commencer.</p>
        <p>CVpass analyse votre CV face à une offre d'emploi et réécrit chaque point faible pour passer les filtres ATS.</p>
        <a href="${appUrl}/dashboard"
           style="display:inline-block;background:#16a34a;color:white;font-weight:bold;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
          Analyser mon CV →
        </a>
        <p style="color:#6b7280;font-size:12px;margin-top:32px;">
          CVpass — VertexLab SASU ·
          <a href="${appUrl}/mentions-legales" style="color:#6b7280;">Mentions légales</a>
        </p>
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
