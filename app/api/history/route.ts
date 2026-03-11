import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }

  const { id } = body;
  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (id === "all") {
    // Get all analysis ids for this user
    const { data: userAnalyses, error: fetchErr } = await supabaseAdmin
      .from("analyses")
      .select("id")
      .eq("user_id", userId);

    if (fetchErr) {
      console.error("History delete-all fetch error:", fetchErr);
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }

    const ids = (userAnalyses ?? []).map((a: { id: string }) => a.id);

    if (ids.length > 0) {
      const { error: clErr } = await supabaseAdmin
        .from("cover_letters")
        .delete()
        .in("analyse_id", ids);

      if (clErr) {
        console.error("History delete-all cover_letters error:", clErr);
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
      }
    }

    const { error: anErr } = await supabaseAdmin
      .from("analyses")
      .delete()
      .eq("user_id", userId);

    if (anErr) {
      console.error("History delete-all analyses error:", anErr);
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  // Single deletion — verify ownership first
  const { data: analysis, error: fetchErr } = await supabaseAdmin
    .from("analyses")
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (fetchErr || !analysis) {
    return NextResponse.json({ error: "Analyse introuvable" }, { status: 404 });
  }

  const { error: clErr } = await supabaseAdmin
    .from("cover_letters")
    .delete()
    .eq("analyse_id", id);

  if (clErr) {
    console.error("History delete cover_letters error:", clErr);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }

  const { error: anErr } = await supabaseAdmin
    .from("analyses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (anErr) {
    console.error("History delete analysis error:", anErr);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

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
