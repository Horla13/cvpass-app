import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserCredits, hasUnlimitedAccess, CREDIT_COSTS } from "@/lib/billing";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  const [credits, unlimited] = await Promise.all([
    getUserCredits(userId, email),
    hasUnlimitedAccess(userId, email),
  ]);

  return NextResponse.json({
    credits,
    unlimited,
    costs: CREDIT_COSTS,
  });
}
