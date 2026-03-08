import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
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
  if (plan !== "monthly" && plan !== "pass48h") {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const sessionConfig: Stripe.Checkout.SessionCreateParams =
    plan === "monthly"
      ? {
          mode: "subscription",
          line_items: [{ price: process.env.STRIPE_PRICE_ID_MONTHLY!, quantity: 1 }],
          success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appUrl}/pricing`,
          metadata: { userId, plan: "monthly" },
        }
      : {
          mode: "payment",
          line_items: [{ price: process.env.STRIPE_PRICE_ID_PASS48H!, quantity: 1 }],
          success_url: `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${appUrl}/pricing`,
          metadata: { userId, plan: "pass48h" },
        };

  const session = await getStripe().checkout.sessions.create(sessionConfig);

  return NextResponse.json({ url: session.url });
}
