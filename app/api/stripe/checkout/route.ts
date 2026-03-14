import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

// Singleton — reuse across warm invocations on Vercel
let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      timeout: 15_000, // 15s timeout for serverless
      maxNetworkRetries: 1,
    });
  }
  return _stripe;
}

const MONTHLY_PRICES = [
  { months: 1, price: 8.90, discount: 0 },
  { months: 2, price: 16.91, discount: 5 },
  { months: 3, price: 24.03, discount: 10 },
  { months: 4, price: 30.49, discount: 14 },
  { months: 5, price: 36.31, discount: 18 },
  { months: 6, price: 41.34, discount: 23 },
];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: { plan?: string; months?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { plan, months } = body;
  if (plan !== "monthly" && plan !== "pass48h") {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  let sessionConfig: Stripe.Checkout.SessionCreateParams;

  if (plan === "pass48h") {
    sessionConfig = {
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PASS48H!, quantity: 1 }],
      success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId, plan: "pass48h" },
    };
  } else {
    // Monthly plan — 1-6 months prepaid
    const selectedMonths = Math.min(6, Math.max(1, months ?? 1));
    const monthData = MONTHLY_PRICES[selectedMonths - 1];
    const priceInCents = Math.round(monthData.price * 100);

    sessionConfig = {
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `CVpass Recherche Active — ${selectedMonths} mois`,
              description: `Accès illimité pendant ${selectedMonths * 30} jours${monthData.discount > 0 ? ` (-${monthData.discount}%)` : ""}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId, plan: "monthly", months: String(selectedMonths) },
    };
  }

  try {
    const session = await getStripe().checkout.sessions.create(sessionConfig);

    if (!session.url) {
      console.error("Stripe session created but no URL returned:", session.id);
      return NextResponse.json({ error: "Impossible de créer la session de paiement" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur Stripe inconnue";
    console.error("Stripe checkout error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
