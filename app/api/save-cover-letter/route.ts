import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: { content?: string; analyse_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { content, analyse_id } = body;

  if (!content || content.trim().length < 50) {
    return NextResponse.json({ error: "Contenu de lettre invalide" }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin
    .from("cover_letters")
    .insert({
      user_id: userId,
      analyse_id: analyse_id ?? null,
      content: content.trim(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Supabase insert cover letter error:", error);
    return NextResponse.json({ error: "Erreur de sauvegarde" }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
