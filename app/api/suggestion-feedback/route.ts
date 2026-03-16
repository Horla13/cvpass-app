import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || !body.gap_id || !["up", "down"].includes(body.feedback)) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("suggestion_feedback").upsert(
    {
      user_id: userId,
      gap_id: body.gap_id,
      feedback: body.feedback,
      section: body.section ?? null,
      category: body.category ?? null,
    },
    { onConflict: "user_id,gap_id" }
  );

  return NextResponse.json({ ok: true });
}
