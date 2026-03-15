import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { sendWelcomeEmail, sendRetentionEmailJ3, sendRetentionEmailJ7 } from "@/lib/brevo";
import { captureServerEvent } from "@/lib/posthog-server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

interface ClerkUserCreatedEvent {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name: string | null;
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
    const email = event.data.email_addresses[0]?.email_address;
    const firstName = event.data.first_name ?? "là";
    if (email) {
      // Enregistrer l'utilisateur dans Supabase
      const admin = getSupabaseAdmin();
      admin
        .from("users")
        .upsert(
          { clerk_id: event.data.id, email, first_name: firstName === "là" ? null : firstName },
          { onConflict: "clerk_id" }
        )
        .then(({ error }) => { if (error) console.error("Supabase users insert error:", error); });

      sendWelcomeEmail(email, firstName).catch(console.error);
      sendRetentionEmailJ3(email, firstName).catch(console.error);
      sendRetentionEmailJ7(email, firstName).catch(console.error);

      captureServerEvent(event.data.id, "signup_completed", { email }).catch(console.error);
      captureServerEvent(event.data.id, "email_j3_sent", { email, scheduled_days: 3 }).catch(console.error);
      captureServerEvent(event.data.id, "email_j7_sent", { email, scheduled_days: 7 }).catch(console.error);
    }
  }

  return NextResponse.json({ received: true });
}
