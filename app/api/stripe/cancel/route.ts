import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!sub?.stripe_subscription_id) {
    return NextResponse.json({ error: "Aucun abonnement actif" }, { status: 400 });
  }

  try {
    // Cancel at end of current period (user keeps access until expiration)
    await getStripe().subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({ cancelled: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur Stripe";
    console.error("Stripe cancel error:", e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
