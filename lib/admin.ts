import { clerkClient } from "@clerk/nextjs/server";

const DEFAULT_ADMIN_EMAILS = [
  "contact@cvpass.fr",
  "armagio13@gmail.com",
];

const ADMIN_EMAILS = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim())
  : DEFAULT_ADMIN_EMAILS;

export async function isAdmin(userId: string): Promise<boolean> {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  return !!email && ADMIN_EMAILS.includes(email);
}
