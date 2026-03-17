import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { addCredits } from "@/lib/billing";
import { sendPaymentConfirmationEmail } from "@/lib/brevo";

export const dynamic = "force-dynamic";

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

  const admin = getSupabaseAdmin();

  // ── Checkout completed ──
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (!userId || !plan) {
      return NextResponse.json({ error: "Métadonnées manquantes" }, { status: 400 });
    }

    const customerEmail = session.customer_details?.email ?? session.customer_email;

    if (plan === "starter") {
      // Starter: +4 credits, stacks on existing
      const { data: existing } = await admin
        .from("subscriptions")
        .select("credits_remaining")
        .eq("user_id", userId)
        .maybeSingle();

      const currentCredits = existing?.credits_remaining ?? 0;

      await admin.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          plan: "starter",
          status: "active",
          credits_remaining: currentCredits + 4,
          subscription_expires_at: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      await addCredits(userId, 4, "purchase_starter");

      if (customerEmail) {
        sendPaymentConfirmationEmail(customerEmail, "starter").catch(console.error);
      }
    }

    if (plan === "pro") {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await admin.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: (session.subscription as string) ?? null,
          plan: "pro",
          status: "active",
          credits_remaining: 999999,
          subscription_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (customerEmail) {
        sendPaymentConfirmationEmail(customerEmail, "pro").catch(console.error);
      }
    }
  }

  // ── Invoice payment succeeded (renewal) ──
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      invoice.parent?.type === "subscription_details"
        ? (invoice.parent.subscription_details?.subscription as string)
        : undefined;

    if (subscriptionId && invoice.billing_reason === "subscription_cycle") {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await admin
        .from("subscriptions")
        .update({
          status: "active",
          credits_remaining: 999999,
          subscription_expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_subscription_id", subscriptionId);
    }
  }

  // ── Subscription deleted ──
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await admin
      .from("subscriptions")
      .update({
        plan: "free",
        status: "expired",
        credits_remaining: 0,
        subscription_expires_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", sub.id);
  }

  // ── Payment failed ──
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
