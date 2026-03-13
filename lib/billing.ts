import { getSupabaseAdmin } from "@/lib/supabase-admin";

export interface BillingResult {
  allowed: boolean;
  isPremium?: boolean; // true = pas de rate limiting applicable
  reason?: "quota_exceeded";
}

export async function isEarlyAccess(email: string): Promise<boolean> {
  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from("beta_whitelist")
      .select("email")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

export async function checkUserAccess(email: string): Promise<"premium" | "free"> {
  return (await isEarlyAccess(email)) ? "premium" : "free";
}

export async function canUsePremiumFeature(userId: string, email?: string): Promise<boolean> {
  try {
    if (email && (await isEarlyAccess(email))) return true;

    const admin = getSupabaseAdmin();
    const { data: sub } = await admin
      .from("subscriptions")
      .select("plan, status, pass_expires_at")
      .eq("user_id", userId)
      .single();

    if (!sub) return false;

    if (sub.plan === "monthly" && sub.status === "active") return true;

    if (sub.plan === "pass48h") {
      return !!(sub.pass_expires_at && new Date(sub.pass_expires_at) > new Date());
    }

    return false;
  } catch {
    return false; // Fail closed: if Supabase is down, block premium features
  }
}

export async function canAnalyze(userId: string, email?: string): Promise<BillingResult> {
  try {
    const admin = getSupabaseAdmin();

    if (email && (await isEarlyAccess(email))) {
      return { allowed: true, isPremium: true };
    }

    const { count } = await admin
      .from("analyses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if ((count ?? 0) < 1) return { allowed: true, isPremium: false };

    const { data: sub } = await admin
      .from("subscriptions")
      .select("plan, status, pass_expires_at")
      .eq("user_id", userId)
      .single();

    if (!sub) return { allowed: false, reason: "quota_exceeded" };

    if (sub.plan === "pass48h") {
      const expired = !sub.pass_expires_at || new Date(sub.pass_expires_at) <= new Date();
      return expired
        ? { allowed: false, reason: "quota_exceeded" }
        : { allowed: true, isPremium: true };
    }

    if (sub.plan === "monthly" && sub.status === "active") {
      return { allowed: true, isPremium: true };
    }

    return { allowed: false, reason: "quota_exceeded" };
  } catch {
    return { allowed: false, reason: "quota_exceeded" }; // Fail closed
  }
}

// ── Système de crédits ──

export const CREDIT_COSTS = {
  ats_analysis: 1,
  jd_analysis: 2,
  pdf_export: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

export async function getUserCredits(userId: string, email?: string): Promise<number> {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("user_credits")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return data.balance;

  // Early access (beta_whitelist) → 100 crédits, sinon 2
  const initialCredits = email && (await isEarlyAccess(email)) ? 100 : 2;
  const { data: inserted } = await admin
    .from("user_credits")
    .upsert({ user_id: userId, balance: initialCredits, lifetime_earned: initialCredits })
    .select("balance")
    .single();

  return inserted?.balance ?? initialCredits;
}

export async function deductCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; newBalance?: number; error?: string }> {
  const admin = getSupabaseAdmin();

  const balance = await getUserCredits(userId);
  if (balance < amount) {
    return { success: false, error: "insufficient_credits" };
  }

  const newBalance = balance - amount;
  const { error } = await admin
    .from("user_credits")
    .update({ balance: newBalance, updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) return { success: false, error: error.message };

  await admin.from("credit_transactions").insert({
    user_id: userId,
    amount: -amount,
    reason,
  });

  return { success: true, newBalance };
}

export async function addCredits(
  userId: string,
  amount: number,
  reason: string
): Promise<{ success: boolean; newBalance?: number }> {
  const admin = getSupabaseAdmin();

  const currentBalance = await getUserCredits(userId);
  const newBalance = currentBalance + amount;

  await admin
    .from("user_credits")
    .upsert({
      user_id: userId,
      balance: newBalance,
      lifetime_earned: currentBalance + amount,
      updated_at: new Date().toISOString(),
    });

  await admin.from("credit_transactions").insert({
    user_id: userId,
    amount,
    reason,
  });

  return { success: true, newBalance };
}

export async function hasUnlimitedAccess(userId: string, email?: string): Promise<boolean> {
  if (email && (await isEarlyAccess(email))) return true;

  const admin = getSupabaseAdmin();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan, status, pass_expires_at")
    .eq("user_id", userId)
    .single();

  if (!sub || sub.status !== "active") return false;

  if (sub.plan === "monthly") {
    // Prepaid plans have an expiration date
    if (sub.pass_expires_at) {
      return new Date(sub.pass_expires_at) > new Date();
    }
    return true; // Legacy subscriptions without expiration
  }

  return false;
}
