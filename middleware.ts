import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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
]);

export default clerkMiddleware(async (auth, request) => {
  if (isPublicRoute(request)) return;

  // Protect route with Clerk (redirects to /login if unauthenticated)
  await auth.protect();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
