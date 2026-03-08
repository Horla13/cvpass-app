import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { sendWelcomeEmail } from "@/lib/brevo";

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
      sendWelcomeEmail(email, firstName).catch(console.error);
    }
  }

  return NextResponse.json({ received: true });
}
