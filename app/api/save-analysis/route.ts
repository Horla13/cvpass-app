import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

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
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { score_avant, score_apres, nb_suggestions, nb_acceptees } = body;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("analyses").insert({
    user_id: userId,
    score_avant,
    score_apres,
    nb_suggestions,
    nb_acceptees,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    // Ne pas bloquer l'utilisateur pour une erreur de sauvegarde
    return NextResponse.json(
      { error: "Erreur de sauvegarde (non bloquant)" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
