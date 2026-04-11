import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addCredits } from "@/lib/billing";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/** POST — award 1 bonus credit for sharing score (max 1 per user) */
export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorise" }, { status: 401 });

  const admin = getSupabaseAdmin();

  // Check if user already claimed share bonus
  const { data: existing } = await admin
    .from("credit_transactions")
    .select("id")
    .eq("user_id", userId)
    .eq("reason", "share_bonus")
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ already_claimed: true });
  }

  // Add 1 credit
  await addCredits(userId, 1, "share_bonus");

  return NextResponse.json({ success: true, credits_added: 1 });
}
