import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/signup(.*)",
  "/acces-refuse",
  "/mentions-legales",
  "/api/stripe/webhook",
  "/api/clerk/webhook",
  "/api/subscribe",
]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return;

  // Protect route with Clerk (redirects to /login if unauthenticated)
  await auth.protect();

  // Get authenticated user's email
  const { userId } = await auth();
  if (!userId) return;

  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;

  if (!email) return;

  // Check beta whitelist
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data } = await supabase
    .from("beta_whitelist")
    .select("email")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (!data) {
    return NextResponse.redirect(new URL("/acces-refuse", request.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
