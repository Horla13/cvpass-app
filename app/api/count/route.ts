import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET() {
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = process.env.BREVO_LIST_ID ?? "3";

  let count = 0;
  try {
    if (BREVO_API_KEY) {
      const response = await fetch(
        `https://api.brevo.com/v3/contacts/lists/${BREVO_LIST_ID}`,
        {
          headers: { Accept: "application/json", "api-key": BREVO_API_KEY },
          next: { revalidate: 300 },
        }
      );
      if (response.ok) {
        const data = await response.json();
        count = data.totalSubscribers ?? 0;
      }
    }
  } catch { /* ignore */ }

  // Fetch recent analyses with score improvement (for social proof, anonymized)
  let recent: { score_avant: number; score_apres: number; minutes_ago: number }[] = [];
  try {
    const { data } = await getSupabaseAdmin()
      .from("analyses")
      .select("score_avant, score_apres, created_at")
      .gt("score_apres", 0)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) {
      recent = data
        .filter((a) => a.score_apres > a.score_avant)
        .slice(0, 10)
        .map((a) => ({
          score_avant: a.score_avant,
          score_apres: a.score_apres,
          minutes_ago: Math.floor((Date.now() - new Date(a.created_at).getTime()) / 60000),
        }));
    }
  } catch { /* ignore */ }

  return NextResponse.json(
    { count, recent },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
