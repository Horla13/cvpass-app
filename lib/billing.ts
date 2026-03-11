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
