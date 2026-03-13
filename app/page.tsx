import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { LandingPage } from "@/components/LandingPage";

export default async function HomePage() {
  const { userId } = await auth();
  // Logged-in users stay on landing page to upload CV
  return <LandingPage />;
}
