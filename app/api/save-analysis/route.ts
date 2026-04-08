import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: {
    score_avant?: number;
    score_apres?: number;
    nb_suggestions?: number;
    nb_acceptees?: number;
    job_title?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { score_avant, score_apres, nb_suggestions, nb_acceptees, job_title } = body;

  const { data, error } = await getSupabaseAdmin()
    .from("analyses")
    .insert({
      user_id: userId,
      score_avant,
      score_apres,
      nb_suggestions,
      nb_acceptees,
      job_title,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Erreur de sauvegarde (non bloquant)" },
      { status: 500 }
    );
  }

  // Mark user as having analyzed + send J+1 "CV expires" email
  const admin = getSupabaseAdmin();
  admin
    .from("subscriptions")
    .select("email, has_analyzed")
    .eq("user_id", userId)
    .maybeSingle()
    .then(({ data: sub }) => {
      if (!sub) return;
      // Update has_analyzed
      if (!sub.has_analyzed) {
        admin.from("subscriptions").update({ has_analyzed: true }).eq("user_id", userId).then(() => {});
      }
      // Send J+1 email (only if score improved and email exists)
      if (sub.email && score_apres && score_avant && score_apres > score_avant) {
        import("@/lib/brevo").then(({ sendCvExpiresEmail }) => {
          sendCvExpiresEmail(sub.email, "there", score_avant, score_apres).catch(console.error);
        });
      }
    });

  return NextResponse.json({ success: true, id: data?.id });
}
