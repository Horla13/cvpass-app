import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

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

  if (id === "all") {
    const { data: userAnalyses, error: fetchErr } = await getSupabaseAdmin()
      .from("analyses")
      .select("id")
      .eq("user_id", userId);

    if (fetchErr) {
      console.error("History delete-all fetch error:", fetchErr);
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }

    const ids = (userAnalyses ?? []).map((a: { id: string }) => a.id);

    if (ids.length > 0) {
      const { error: clErr } = await getSupabaseAdmin()
        .from("cover_letters")
        .delete()
        .in("analyse_id", ids);

      if (clErr) {
        console.error("History delete-all cover_letters error:", clErr);
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
      }
    }

    const { error: anErr } = await getSupabaseAdmin()
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
  const { data: analysis, error: fetchErr } = await getSupabaseAdmin()
    .from("analyses")
    .select("id")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (fetchErr || !analysis) {
    return NextResponse.json({ error: "Analyse introuvable" }, { status: 404 });
  }

  const { error: clErr } = await getSupabaseAdmin()
    .from("cover_letters")
    .delete()
    .eq("analyse_id", id);

  if (clErr) {
    console.error("History delete cover_letters error:", clErr);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }

  const { error: anErr } = await getSupabaseAdmin()
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

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // Single analysis fetch (for CV preview modal)
  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    const { data, error } = await getSupabaseAdmin()
      .from("analyses")
      .select("id, cv_json")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Analyse introuvable" }, { status: 404 });
    }
    return NextResponse.json({ analysis: data });
  }

  // List with pagination
  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") ?? "20", 10) || 20));
  const offset = (page - 1) * limit;

  const { data: analyses, error } = await getSupabaseAdmin()
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
    .range(offset, offset + limit);

  if (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Erreur de chargement" }, { status: 500 });
  }

  const items = analyses ?? [];
  return NextResponse.json({
    analyses: items.slice(0, limit),
    hasMore: items.length > limit,
    page,
    limit,
  });
}
