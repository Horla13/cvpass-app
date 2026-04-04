import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserPlanInfo, CREDIT_COSTS } from "@/lib/billing";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  const planInfo = await getUserPlanInfo(userId, email);

  return NextResponse.json({
    plan: planInfo.plan,
    credits: planInfo.credits,
    unlimited: planInfo.unlimited,
    expiresAt: planInfo.expiresAt,
    costs: CREDIT_COSTS,
    email,
  });
}
