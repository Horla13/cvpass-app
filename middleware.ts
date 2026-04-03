import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/login(.*)",
  "/signup(.*)",
  "/acces-refuse",
  "/mentions-legales",
  "/politique-confidentialite",
  "/conditions-generales",
  "/politique-cookies",
  "/blog(.*)",
  "/demo",
  "/pricing/success",
  "/api/stripe/checkout",
  "/api/stripe/webhook",
  "/api/clerk/webhook",
  "/api/subscribe",
  "/api/count",
  "/api/affiliate/check-ref",
  "/affiliate/join",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
]);

export default clerkMiddleware(async (auth, request) => {
  // Capture ?ref=CODE into a 30-day cookie for affiliate tracking
  const refCode = request.nextUrl.searchParams.get("ref");
  let response: NextResponse | undefined;

  if (refCode && /^[A-Z0-9]{3,20}$/i.test(refCode)) {
    response = NextResponse.next();
    response.cookies.set("cvpass_ref", refCode.toUpperCase(), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  if (isPublicRoute(request)) return response;

  // Protect route with Clerk (redirects to /login if unauthenticated)
  await auth.protect();
  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
