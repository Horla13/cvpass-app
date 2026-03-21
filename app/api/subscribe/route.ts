import { NextRequest, NextResponse } from "next/server";
import { checkRateLimitWith } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Rate limit par IP pour cette route publique
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed: rateLimitOk } = await checkRateLimitWith(`subscribe:${ip}`, 5, "1 h");
  if (!rateLimitOk) {
    return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
  }

  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { email, source } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID ?? "3", 10);

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not set");
    return NextResponse.json({ error: "Configuration serveur manquante." }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
        attributes: {
          SOURCE: source ?? "Unknown",
          SIGNUP_DATE: new Date().toISOString().split("T")[0],
        },
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (response.ok || response.status === 201 || response.status === 204) {
      return NextResponse.json({ success: true, message: "Inscription réussie !" });
    }

    const data = await response.json().catch(() => ({}));
    if (data.code === "duplicate_parameter") {
      return NextResponse.json({ success: true, message: "Vous êtes déjà inscrit !" });
    }

    console.error("Brevo API error:", data);
    return NextResponse.json(
      { error: data.message ?? "Erreur lors de l'inscription." },
      { status: response.status }
    );
  } catch (err) {
    console.error("Network error:", err);
    return NextResponse.json({ error: "Erreur de connexion au service email." }, { status: 500 });
  }
}
