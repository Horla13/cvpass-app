import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { z } from "zod";

const BodySchema = z.object({
  content: z.string().min(50, "Contenu trop court").max(50000, "Contenu trop long"),
  analyse_id: z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    const raw = await req.json();
    body = BodySchema.parse(raw);
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide" }, { status: 400 });
  }

  const { content, analyse_id } = body;

  const { data, error } = await getSupabaseAdmin()
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
