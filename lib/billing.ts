import { getSupabaseAdmin } from "@/lib/supabase-admin";

// ── Types ──

export type PlanType = "free" | "starter" | "pro" | "early_access";

export interface Subscription {
  user_id: string;
  plan: PlanType;
  status: string;
  credits_remaining: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_expires_at: string | null;
}

export interface BillingResult {
  allowed: boolean;
  reason?: "NO_CREDITS";
  message?: string;
}

export const CREDIT_COSTS = {
  ats_analysis: 1,
  jd_analysis: 2,
  pdf_export: 1,
  cover_letter: 1,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

// ── Early Access (ex beta_whitelist → early_access) ──

export async function isEarlyAccess(email: string): Promise<boolean> {
  try {
    const { data } = await getSupabaseAdmin()
      .from("early_access")
      .select("email, expires_at")
      .eq("email", email.toLowerCase())
      .maybeSingle();
    if (!data) return false;
    // If expires_at is set, check if still valid
    if (data.expires_at && new Date(data.expires_at) < new Date()) return false;
    return true;
  } catch {
    return false;
  }
}

// ── Get or create subscription ──

export async function getSubscription(userId: string): Promise<Subscription> {
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("subscriptions")
    .select("user_id, plan, status, credits_remaining, stripe_customer_id, stripe_subscription_id, subscription_expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return data as Subscription;

  // Auto-create free subscription with 2 credits
  const newSub: Partial<Subscription> = {
    user_id: userId,
    plan: "free",
    status: "active",
    credits_remaining: 1,
  };

  await admin.from("subscriptions").upsert(newSub, { onConflict: "user_id" });

  return {
    user_id: userId,
    plan: "free",
    status: "active",
    credits_remaining: 1,
    stripe_customer_id: null,
    stripe_subscription_id: null,
    subscription_expires_at: null,
  };
}

// ── Has unlimited access ──

export async function hasUnlimitedAccess(userId: string, email?: string): Promise<boolean> {
  // 1. Early access = unlimited
  if (email && (await isEarlyAccess(email))) return true;

  // 2. Pro with active subscription
  const sub = await getSubscription(userId);
  if (sub.plan === "pro" && sub.status === "active" && sub.subscription_expires_at) {
    return new Date(sub.subscription_expires_at) > new Date();
  }

  return false;
}

// ── Can analyze (main billing gate) ──

export async function canAnalyze(userId: string, email?: string): Promise<BillingResult> {
  // 1. Early access
  if (email && (await isEarlyAccess(email))) {
    return { allowed: true };
  }

  // 2. Get subscription
  const sub = await getSubscription(userId);

  // 3. Pro active with valid expiration
  if (sub.plan === "pro" && sub.status === "active" && sub.subscription_expires_at) {
    if (new Date(sub.subscription_expires_at) > new Date()) {
      return { allowed: true };
    }
  }

  // 4. Has credits remaining
  if (sub.credits_remaining > 0) {
    return { allowed: true };
  }

  // 5. No credits
  return {
    allowed: false,
    reason: "NO_CREDITS",
    message: "Vous n'avez plus de crédits. Rechargez avec le Pack Starter (2,90\u20ac) ou passez en Recherche Active (8,90\u20ac/mois).",
  };
}

// ── Consume credit (called AFTER successful analysis) ──
// Uses optimistic concurrency: read balance, then UPDATE ... WHERE credits_remaining = old_balance
// If another request changed the balance between read and write, the WHERE won't match → retry

export async function consumeCredit(userId: string, amount: number, reason: string): Promise<{ success: boolean; newBalance?: number }> {
  const admin = getSupabaseAdmin();

  for (let attempt = 0; attempt < 3; attempt++) {
    const sub = await getSubscription(userId);

    if (sub.credits_remaining < amount) {
      return { success: false };
    }

    const newBalance = sub.credits_remaining - amount;
    const { data, error } = await admin
      .from("subscriptions")
      .update({ credits_remaining: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("credits_remaining", sub.credits_remaining) // optimistic lock
      .select("credits_remaining")
      .maybeSingle();

    if (error) return { success: false };

    if (!data) {
      // Another request changed credits_remaining — retry
      continue;
    }

    await admin.from("credit_transactions").insert({
      user_id: userId,
      amount: -amount,
      reason,
    });

    return { success: true, newBalance };
  }

  return { success: false };
}

// ── Add credits ──

export async function addCredits(userId: string, amount: number, reason: string): Promise<{ success: boolean; newBalance?: number }> {
  const admin = getSupabaseAdmin();

  for (let attempt = 0; attempt < 3; attempt++) {
    const sub = await getSubscription(userId);
    const newBalance = sub.credits_remaining + amount;

    const { data, error } = await admin
      .from("subscriptions")
      .update({ credits_remaining: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("credits_remaining", sub.credits_remaining) // optimistic lock
      .select("credits_remaining")
      .maybeSingle();

    if (error) return { success: false };

    if (!data) {
      // Another request changed credits_remaining — retry
      continue;
    }

    await admin.from("credit_transactions").insert({
      user_id: userId,
      amount,
      reason,
    });

    return { success: true, newBalance };
  }

  return { success: false };
}

// ── Get user credits (simple helper) ──

export async function getUserCredits(userId: string): Promise<number> {
  const sub = await getSubscription(userId);
  return sub.credits_remaining;
}

// ── Get user plan info (for dashboard display) ──

export async function getUserPlanInfo(userId: string, email?: string): Promise<{
  plan: PlanType;
  credits: number;
  unlimited: boolean;
  expiresAt: string | null;
}> {
  const earlyAccess = email ? await isEarlyAccess(email) : false;

  if (earlyAccess) {
    return { plan: "early_access", credits: 999999, unlimited: true, expiresAt: null };
  }

  const sub = await getSubscription(userId);
  const unlimited = sub.plan === "pro" && sub.status === "active" && sub.subscription_expires_at
    ? new Date(sub.subscription_expires_at) > new Date()
    : false;

  return {
    plan: sub.plan as PlanType,
    credits: sub.credits_remaining,
    unlimited,
    expiresAt: sub.subscription_expires_at,
  };
}
