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

/**
 * Loyalty discount: -5% per month, capped at month 6 (max -25%).
 * Month 1 = full price (no discount on first invoice).
 * Month 2 = 5%, Month 3 = 10%, ..., Month 6+ = 25%.
 */
function getLoyaltyDiscountPercent(subscriptionStartEpoch: number): number {
  const monthsActive = Math.floor(
    (Date.now() / 1000 - subscriptionStartEpoch) / (30.44 * 24 * 60 * 60)
  );
  // monthsActive = 0 for the first invoice, 1 after ~1 month, etc.
  if (monthsActive <= 0) return 0;
  return Math.min(monthsActive * 5, 25);
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

  const stripe = getStripe();
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
      await addCredits(userId, 4, "purchase_pack");
      if (customerEmail) {
        sendPaymentConfirmationEmail(customerEmail, "pass48h").catch(console.error);
      }
    }

    if (plan === "monthly") {
      const months = parseInt(session.metadata?.months ?? "1", 10);
      const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString();
      await admin.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: null,
          plan: "monthly",
          pass_expires_at: expiresAt,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (customerEmail) {
        sendPaymentConfirmationEmail(customerEmail, "monthly", months).catch(console.error);
      }
    }
  }

  // ── Invoice created (draft) — apply loyalty discount on renewals ──
  if (event.type === "invoice.created") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      invoice.parent?.type === "subscription_details"
        ? (invoice.parent.subscription_details?.subscription as string)
        : undefined;

    // Only apply to subscription renewal invoices (not the first one)
    if (subscriptionId && invoice.billing_reason === "subscription_cycle") {
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const startEpoch = subscription.start_date ?? subscription.created;
        const discountPercent = getLoyaltyDiscountPercent(startEpoch);

        if (discountPercent > 0 && invoice.subtotal > 0) {
          // Create a one-off coupon for this exact percentage
          const coupon = await stripe.coupons.create({
            percent_off: discountPercent,
            duration: "once",
            name: `Fidélité -${discountPercent}%`,
          });

          // Apply the coupon discount to this invoice
          await stripe.invoices.update(invoice.id, {
            discounts: [{ coupon: coupon.id }],
          });

          console.log(
            `Loyalty discount applied: -${discountPercent}% on invoice ${invoice.id} for sub ${subscriptionId}`
          );
        }
      } catch (e) {
        // Don't block the webhook if discount application fails
        console.error("Loyalty discount error:", e);
      }
    }
  }

  // ── Subscription deleted ──
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;
    await admin
      .from("subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", sub.id);
  }

  // ── Payment succeeded ──
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      invoice.parent?.type === "subscription_details"
        ? (invoice.parent.subscription_details?.subscription as string)
        : undefined;
    if (subscriptionId) {
      await admin
        .from("subscriptions")
        .update({ status: "active", updated_at: new Date().toISOString() })
        .eq("stripe_subscription_id", subscriptionId);
    }
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
