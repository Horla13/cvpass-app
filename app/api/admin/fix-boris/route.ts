import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_EMAILS = ["giovannirusso@cvpass.fr", "giovanni@vertexlab.fr", "giovannirusso.dev@gmail.com"];
const BORIS_EMAIL = "borisjuniorkoulevo@gmail.com";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const clerk = await clerkClient();
  const adminUser = await clerk.users.getUser(userId);
  const adminEmail = adminUser.emailAddresses[0]?.emailAddress;
  if (!adminEmail || !ADMIN_EMAILS.includes(adminEmail)) {
    return NextResponse.json({ error: "Admin uniquement" }, { status: 403 });
  }

  // Find Boris's Clerk user ID
  const users = await clerk.users.getUserList({ emailAddress: [BORIS_EMAIL] });
  const boris = users.data[0];
  if (!boris) {
    return NextResponse.json({ error: `Utilisateur ${BORIS_EMAIL} non trouvé dans Clerk` }, { status: 404 });
  }

  const borisUserId = boris.id;
  const admin = getSupabaseAdmin();

  // Upsert into subscriptions with new schema
  const { error } = await admin.from("subscriptions").upsert(
    {
      user_id: borisUserId,
      plan: "starter",
      status: "active",
      credits_remaining: 4,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log transaction
  await admin.from("credit_transactions").insert({
    user_id: borisUserId,
    amount: 4,
    reason: "admin_fix_boris",
  });

  return NextResponse.json({
    success: true,
    borisUserId,
    message: `Boris (${BORIS_EMAIL}) a maintenant 4 crédits, plan starter.`,
  });
}
