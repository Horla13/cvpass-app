import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { sendAnalysisEmail } from "@/lib/brevo";

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
    job_title,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json(
      { error: "Erreur de sauvegarde (non bloquant)" },
      { status: 500 }
    );
  }

  // Email post-analyse — fire-and-forget
  if (score_avant !== undefined && score_apres !== undefined && job_title) {
    (async () => {
      try {
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        const email = user.emailAddresses[0]?.emailAddress;
        const firstName = user.firstName ?? "là";
        if (email) {
          await sendAnalysisEmail(email, firstName, score_avant, score_apres, job_title);
        }
      } catch (e) {
        console.error("Email post-analyse error:", e);
      }
    })();
  }

  return NextResponse.json({ success: true });
}
