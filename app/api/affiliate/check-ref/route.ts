import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/** GET /api/affiliate/check-ref?code=XXX — validate a referral code exists */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ valid: false });

  const { data } = await getSupabaseAdmin()
    .from("affiliates")
    .select("code")
    .eq("code", code)
    .eq("status", "active")
    .maybeSingle();

  return NextResponse.json({ valid: !!data });
}
