import { createClient } from "@supabase/supabase-js";

export interface BillingResult {
  allowed: boolean;
  reason?: "quota_exceeded";
}

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function isEarlyAccess(email: string): Promise<boolean> {
  const admin = getAdmin();
  const { data } = await admin
    .from("beta_whitelist")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  return !!data;
}

export async function checkUserAccess(email: string): Promise<"premium" | "free"> {
  return (await isEarlyAccess(email)) ? "premium" : "free";
}

export async function canUsePremiumFeature(userId: string, email?: string): Promise<boolean> {
  if (email && (await isEarlyAccess(email))) return true;

  const admin = getAdmin();
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", userId)
    .single();

  return !!(sub && sub.plan === "monthly" && sub.status === "active");
}

export async function canAnalyze(userId: string, email?: string): Promise<BillingResult> {
  const admin = getAdmin();

  // Early access users get unlimited analyses
  if (email && (await isEarlyAccess(email))) {
    return { allowed: true };
  }

  // 1. Compter les analyses existantes
  const { count } = await admin
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  // Quota gratuit : 1 analyse
  if ((count ?? 0) < 1) return { allowed: true };

  // 2. Vérifier la subscription
  const { data: sub } = await admin
    .from("subscriptions")
    .select("plan, status, pass_expires_at")
    .eq("user_id", userId)
    .single();

  if (!sub) return { allowed: false, reason: "quota_exceeded" };

  // Pass 48h : vérifier l'expiration
  if (sub.plan === "pass48h") {
    const expired = !sub.pass_expires_at || new Date(sub.pass_expires_at) <= new Date();
    return expired
      ? { allowed: false, reason: "quota_exceeded" }
      : { allowed: true };
  }

  // Abonnement mensuel actif
  if (sub.plan === "monthly" && sub.status === "active") {
    return { allowed: true };
  }

  return { allowed: false, reason: "quota_exceeded" };
}
