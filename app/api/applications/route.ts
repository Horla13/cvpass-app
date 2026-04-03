import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["wishlist", "applied", "interview", "offer", "rejected"];

/** GET — list all applications for current user */
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data, error } = await getSupabaseAdmin()
    .from("applications")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Applications fetch error:", error);
    return NextResponse.json({ error: "Erreur chargement" }, { status: 500 });
  }

  return NextResponse.json({ applications: data ?? [] });
}

/** POST — create a new application */
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: { company?: string; job_title?: string; url?: string; status?: string; notes?: string; analysis_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const company = body.company?.trim();
  const job_title = body.job_title?.trim();
  if (!company || !job_title) {
    return NextResponse.json({ error: "Entreprise et poste requis" }, { status: 400 });
  }

  const status = VALID_STATUSES.includes(body.status ?? "") ? body.status : "wishlist";

  const { data, error } = await getSupabaseAdmin()
    .from("applications")
    .insert({
      user_id: userId,
      company,
      job_title,
      url: body.url?.trim() || null,
      status,
      notes: body.notes?.trim() || null,
      analysis_id: body.analysis_id || null,
      applied_at: status === "applied" ? new Date().toISOString() : null,
    })
    .select("*")
    .single();

  if (error) {
    console.error("Application create error:", error);
    return NextResponse.json({ error: "Erreur création" }, { status: 500 });
  }

  return NextResponse.json({ application: data });
}

/** PATCH — update an application */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  let body: { id?: string; company?: string; job_title?: string; url?: string; status?: string; notes?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "ID requis" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (body.company !== undefined) updates.company = body.company.trim();
  if (body.job_title !== undefined) updates.job_title = body.job_title.trim();
  if (body.url !== undefined) updates.url = body.url.trim() || null;
  if (body.notes !== undefined) updates.notes = body.notes.trim() || null;
  if (body.status && VALID_STATUSES.includes(body.status)) {
    updates.status = body.status;
    if (body.status === "applied" && !updates.applied_at) {
      updates.applied_at = new Date().toISOString();
    }
  }

  const { data, error } = await getSupabaseAdmin()
    .from("applications")
    .update(updates)
    .eq("id", body.id)
    .eq("user_id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("Application update error:", error);
    return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  }

  return NextResponse.json({ application: data });
}

/** DELETE — remove an application */
export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const { error } = await getSupabaseAdmin()
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    console.error("Application delete error:", error);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
