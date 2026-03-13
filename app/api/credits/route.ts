import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserCredits, hasUnlimitedAccess, CREDIT_COSTS } from "@/lib/billing";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [credits, unlimited] = await Promise.all([
    getUserCredits(userId),
    hasUnlimitedAccess(userId),
  ]);

  return NextResponse.json({
    credits,
    unlimited,
    costs: CREDIT_COSTS,
  });
}
