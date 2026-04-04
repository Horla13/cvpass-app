import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

/** GET — all affiliates + their conversions (admin only) */
export async function GET() {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();

  const { data: affiliates } = await admin
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: conversions } = await admin
    .from("affiliate_conversions")
    .select("*")
    .order("created_at", { ascending: false });

  // Aggregate stats per affiliate
  const stats = (affiliates ?? []).map((aff) => {
    const affConversions = (conversions ?? []).filter((c) => c.affiliate_id === aff.id);
    return {
      ...aff,
      conversions: affConversions,
      total_conversions: affConversions.length,
      pending_count: affConversions.filter((c) => c.status === "pending").length,
      approved_count: affConversions.filter((c) => c.status === "approved").length,
      paid_count: affConversions.filter((c) => c.status === "paid").length,
      pending_amount: affConversions.filter((c) => c.status === "pending").reduce((s, c) => s + Number(c.commission), 0),
      approved_amount: affConversions.filter((c) => c.status === "approved").reduce((s, c) => s + Number(c.commission), 0),
    };
  });

  return NextResponse.json({ affiliates: stats });
}

/** PATCH — update conversion status or affiliate (admin only) */
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId || !(await isAdmin(userId))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  let body: { action: string; conversion_id?: string; affiliate_id?: string; amount?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  if (body.action === "approve" && body.conversion_id) {
    await admin
      .from("affiliate_conversions")
      .update({ status: "approved" })
      .eq("id", body.conversion_id);
    return NextResponse.json({ success: true });
  }

  if (body.action === "mark_paid" && body.affiliate_id) {
    // Mark all approved conversions as paid
    const { data: approved } = await admin
      .from("affiliate_conversions")
      .select("id, commission")
      .eq("affiliate_id", body.affiliate_id)
      .eq("status", "approved");

    if (approved && approved.length > 0) {
      const paidAmount = approved.reduce((s, c) => s + Number(c.commission), 0);
      const ids = approved.map((c) => c.id);

      for (const id of ids) {
        await admin
          .from("affiliate_conversions")
          .update({ status: "paid" })
          .eq("id", id);
      }

      // Update affiliate total_paid
      const { data: aff } = await admin
        .from("affiliates")
        .select("total_paid")
        .eq("id", body.affiliate_id)
        .single();

      await admin
        .from("affiliates")
        .update({ total_paid: (Number(aff?.total_paid) || 0) + paidAmount })
        .eq("id", body.affiliate_id);

      return NextResponse.json({ success: true, paid: paidAmount, count: ids.length });
    }
    return NextResponse.json({ success: true, paid: 0, count: 0 });
  }

  if (body.action === "approve_all" && body.affiliate_id) {
    // Approve all pending conversions older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: pending } = await admin
      .from("affiliate_conversions")
      .select("id, commission")
      .eq("affiliate_id", body.affiliate_id)
      .eq("status", "pending")
      .lt("created_at", thirtyDaysAgo);

    if (pending && pending.length > 0) {
      for (const c of pending) {
        await admin
          .from("affiliate_conversions")
          .update({ status: "approved" })
          .eq("id", c.id);
      }
      return NextResponse.json({ success: true, approved: pending.length });
    }
    return NextResponse.json({ success: true, approved: 0 });
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
}
