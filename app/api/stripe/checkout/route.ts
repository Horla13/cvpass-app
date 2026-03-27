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

  let body: { plan?: string; promoCode?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { plan, promoCode } = body;
  if (plan !== "starter" && plan !== "pro") {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Resolve promo code to Stripe promotion_code ID if provided
  let promoDiscount: { promotion_code: string } | undefined;
  if (promoCode && /^[A-Z0-9]{3,20}$/i.test(promoCode)) {
    try {
      const promos = await getStripe().promotionCodes.list({ code: promoCode, active: true, limit: 1 });
      if (promos.data.length > 0) {
        promoDiscount = { promotion_code: promos.data[0].id };
      }
    } catch {
      // Ignore — fallback to manual entry
    }
  }

  const commonConfig: Partial<Stripe.Checkout.SessionCreateParams> = {
    locale: "fr" as const,
    ...(promoDiscount
      ? { discounts: [promoDiscount] }
      : { allow_promotion_codes: true }),
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
      metadata: { userId, plan: "starter" },
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
      metadata: { userId, plan: "pro" },
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
