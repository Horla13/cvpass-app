import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e) {
    console.error("Stripe webhook signature error:", e);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const admin = getAdmin();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      return NextResponse.json({ error: "Métadonnées manquantes" }, { status: 400 });
    }

    if (plan === "pass48h") {
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      await admin.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          plan: "pass48h",
          pass_expires_at: expiresAt,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    if (plan === "monthly") {
      await admin.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plan: "monthly",
          pass_expires_at: null,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await admin
      .from("subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", sub.id);
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      invoice.parent?.type === "subscription_details"
        ? (invoice.parent.subscription_details?.subscription as string)
        : undefined;
    if (subscriptionId) {
      await admin
        .from("subscriptions")
        .update({ status: "past_due", updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subscriptionId);
    }
  }

  return NextResponse.json({ received: true });
}
