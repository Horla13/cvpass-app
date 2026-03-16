import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

function generateCode(userId: string): string {
  // Deterministic 6-char code from userId
  const hash = userId.split("").reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);
  return Math.abs(hash).toString(36).toUpperCase().slice(0, 6).padEnd(6, "A");
}

// GET — Get user's referral code + stats
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const supabase = getSupabase();
  const code = generateCode(userId);

  // Ensure referral row exists
  await supabase.from("referrals").upsert(
    { user_id: userId, code, referral_count: 0, credits_earned: 0 },
    { onConflict: "user_id", ignoreDuplicates: true }
  );

  const { data } = await supabase
    .from("referrals")
    .select("code, referral_count, credits_earned")
    .eq("user_id", userId)
    .single();

  return NextResponse.json(data ?? { code, referral_count: 0, credits_earned: 0 });
}

// POST — Apply referral code (called during signup or manually)
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const code = body?.code?.trim()?.toUpperCase();
  if (!code || code.length < 4) {
    return NextResponse.json({ error: "Code invalide" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Find referrer
  const { data: referrer } = await supabase
    .from("referrals")
    .select("user_id, referral_count, credits_earned")
    .eq("code", code)
    .single();

  if (!referrer) {
    return NextResponse.json({ error: "Code de parrainage introuvable" }, { status: 404 });
  }

  // Can't refer yourself
  if (referrer.user_id === userId) {
    return NextResponse.json({ error: "Vous ne pouvez pas utiliser votre propre code" }, { status: 400 });
  }

  // Check max 10 referrals
  if (referrer.referral_count >= 10) {
    return NextResponse.json({ error: "Ce parrain a atteint le maximum de parrainages" }, { status: 400 });
  }

  // Check if already referred
  const { data: existing } = await supabase
    .from("referral_uses")
    .select("id")
    .eq("referred_user_id", userId)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Vous avez déjà utilisé un code de parrainage" }, { status: 400 });
  }

  // Record the referral
  await supabase.from("referral_uses").insert({
    referrer_user_id: referrer.user_id,
    referred_user_id: userId,
    code,
  });

  // Update referrer stats
  await supabase
    .from("referrals")
    .update({
      referral_count: referrer.referral_count + 1,
      credits_earned: referrer.credits_earned + 2,
    })
    .eq("user_id", referrer.user_id);

  // Grant 2 credits to referrer
  const { data: referrerCredits } = await supabase
    .from("users")
    .select("credits")
    .eq("clerk_id", referrer.user_id)
    .single();

  if (referrerCredits) {
    await supabase
      .from("users")
      .update({ credits: referrerCredits.credits + 2 })
      .eq("clerk_id", referrer.user_id);

    // Log transaction
    await supabase.from("credit_transactions").insert({
      user_id: referrer.user_id,
      amount: 2,
      reason: "referral_bonus",
    });
  }

  // Grant 1 credit to referred user
  const { data: referredCredits } = await supabase
    .from("users")
    .select("credits")
    .eq("clerk_id", userId)
    .single();

  if (referredCredits) {
    await supabase
      .from("users")
      .update({ credits: referredCredits.credits + 1 })
      .eq("clerk_id", userId);

    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: 1,
      reason: "referral_welcome",
    });
  }

  return NextResponse.json({ ok: true, message: "Code appliqué ! +1 crédit offert." });
}
