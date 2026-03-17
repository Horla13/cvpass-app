import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const source = body?.source?.trim();
  if (!source) {
    return NextResponse.json({ error: "Source manquante" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  await supabase.from("discovery_sources").upsert(
    { user_id: userId, source },
    { onConflict: "user_id" }
  );

  return NextResponse.json({ ok: true });
}
