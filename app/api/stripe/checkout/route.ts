import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

let _stripe: Stripe | null = null;
function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      timeout: 25_000,
      maxNetworkRetries: 2,
    });
  }
  return _stripe;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: { plan?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { plan } = body;
  if (plan !== "starter" && plan !== "pro") {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  // Read affiliate ref cookie
  const refCode = req.cookies.get("cvpass_ref")?.value ?? "";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const commonConfig = {
    locale: "fr" as const,
    allow_promotion_codes: true,
    billing_address_collection: "auto" as const,
  };

  let sessionConfig: Stripe.Checkout.SessionCreateParams;

  if (plan === "starter") {
    sessionConfig = {
      ...commonConfig,
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID_STARTER!, quantity: 1 }],
      success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}&plan=starter`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId, plan: "starter", ...(refCode ? { ref: refCode } : {}) },
      custom_text: {
        submit: { message: "Paiement unique — +4 crédits ajoutés immédiatement" },
      },
    };
  } else {
    // Pro plan — monthly subscription
    sessionConfig = {
      ...commonConfig,
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }],
      success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}&plan=pro`,
      cancel_url: `${appUrl}/pricing`,
      metadata: { userId, plan: "pro", ...(refCode ? { ref: refCode } : {}) },
      custom_text: {
        submit: { message: "Analyses illimitées — résiliable à tout moment" },
      },
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
