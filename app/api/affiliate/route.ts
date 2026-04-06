import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/** GET — fetch affiliate profile + stats for current user */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const admin = getSupabaseAdmin();

  const { data: affiliate } = await admin
    .from("affiliates")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!affiliate) {
    return NextResponse.json({ affiliate: null });
  }

  // Fetch conversions
  const { data: conversions } = await admin
    .from("affiliate_conversions")
    .select("*")
    .eq("affiliate_id", affiliate.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const stats = {
    total_conversions: conversions?.length ?? 0,
    pending: conversions?.filter((c) => c.status === "pending").length ?? 0,
    approved: conversions?.filter((c) => c.status === "approved").length ?? 0,
    paid: conversions?.filter((c) => c.status === "paid").length ?? 0,
    total_earned: affiliate.total_earned ?? 0,
    total_paid: affiliate.total_paid ?? 0,
    balance: (affiliate.total_earned ?? 0) - (affiliate.total_paid ?? 0),
  };

  return NextResponse.json({ affiliate, conversions: conversions ?? [], stats });
}

/** POST — create affiliate account for current user */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: { code?: string; email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const code = (body.code ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!code || code.length < 3 || code.length > 20) {
    return NextResponse.json({ error: "Code invalide (3-20 caractères alphanumériques)" }, { status: 400 });
  }

  const email = body.email?.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  // Check if user already has an affiliate account
  const { data: existing } = await admin
    .from("affiliates")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "Vous avez déjà un compte affilié" }, { status: 409 });
  }

  // Check code uniqueness
  const { data: codeExists } = await admin
    .from("affiliates")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (codeExists) {
    return NextResponse.json({ error: "Ce code est déjà utilisé" }, { status: 409 });
  }

  const { data, error } = await admin
    .from("affiliates")
    .insert({ user_id: userId, email, code, commission_rate: 0.30 })
    .select("*")
    .single();

  if (error) {
    console.error("Affiliate creation error:", error);
    return NextResponse.json({ error: "Erreur création compte affilié" }, { status: 500 });
  }

  return NextResponse.json({ affiliate: data });
}
