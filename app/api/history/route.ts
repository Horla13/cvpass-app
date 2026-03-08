import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: analyses, error } = await supabaseAdmin
    .from("analyses")
    .select(`
      id,
      created_at,
      job_title,
      score_avant,
      score_apres,
      nb_suggestions,
      nb_acceptees,
      cover_letters (
        id,
        content,
        created_at
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Erreur de chargement" }, { status: 500 });
  }

  return NextResponse.json({ analyses: analyses ?? [] });
}
