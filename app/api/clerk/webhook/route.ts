import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { sendWelcomeEmail, sendRetentionEmailJ3, syncBrevoContact } from "@/lib/brevo";
import { captureServerEvent } from "@/lib/posthog-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

interface ClerkUserCreatedEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
    last_name: string | null;
  };
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET non configuré");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  const body = await req.text();
  const svixId = req.headers.get("svix-id") ?? "";
  const svixTimestamp = req.headers.get("svix-timestamp") ?? "";
  const svixSignature = req.headers.get("svix-signature") ?? "";

  let event: ClerkUserCreatedEvent;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkUserCreatedEvent;
  } catch (e) {
    console.error("Clerk webhook signature error:", e);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const userId = event.data.id;
    const email = event.data.email_addresses[0]?.email_address;
    const firstName = event.data.first_name ?? "là";
    const lastName = event.data.last_name ?? "";
    const admin = getSupabaseAdmin();

    if (email) {
      // Tenter l'insert. Si la ligne existe déjà (auto-créée par getSubscription),
      // mettre à jour uniquement l'email sans toucher aux crédits ni au plan.
      const { error: insertError } = await admin
        .from("subscriptions")
        .insert({
          user_id: userId,
          plan: "free",
          status: "active",
          credits_remaining: 2,
          email,
        });

      if (insertError) {
        if (insertError.message.includes("duplicate") || insertError.code === "23505") {
          // Ligne déjà existante : on patch juste l'email
          await admin
            .from("subscriptions")
            .update({ email, updated_at: new Date().toISOString() })
            .eq("user_id", userId)
            .is("email", null);
        } else {
          console.error("Subscription insert error:", insertError);
          return NextResponse.json({ error: "Erreur création subscription" }, { status: 500 });
        }
      }

      // Log la transaction initiale
      const { error: txError } = await admin
        .from("credit_transactions")
        .insert({ user_id: userId, amount: 2, reason: "initial_signup" });

      if (txError) console.error("Credit transaction error:", txError);

      // Sync contact Brevo (liste "Utilisateurs CVpass")
      syncBrevoContact(email, {
        PRENOM: firstName === "là" ? undefined : firstName,
        NOM: lastName || undefined,
        PLAN: "free",
        SIGNUP_DATE: new Date().toISOString().split("T")[0],
      }).catch(console.error);

      sendWelcomeEmail(email, firstName).catch(console.error);
      sendRetentionEmailJ3(email, firstName).catch(console.error);
      // J+7 email: handled via Brevo automation (API limit: max 3 days scheduledAt)

      captureServerEvent(userId, "signup_completed", { email }).catch(console.error);
    }
  }

  return NextResponse.json({ received: true });
}
