/**
 * Script de rattrapage : synchronise les utilisateurs Supabase sans email
 * en récupérant leurs données depuis Clerk, puis les sync vers Brevo.
 *
 * Usage: npx tsx scripts/sync-missing-users.ts
 *
 * Requires .env.local with:
 *   CLERK_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *   BREVO_API_KEY, BREVO_LIST_ID
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const CLERK_SECRET = process.env.CLERK_SECRET_KEY!;
const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID ?? "6");

interface ClerkUser {
  id: string;
  email_addresses: { email_address: string }[];
  first_name: string | null;
  last_name: string | null;
  created_at: number;
}

async function getSupabaseUsersWithoutEmail(): Promise<{ user_id: string }[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/subscriptions?select=user_id&email=is.null&limit=200`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    }
  );
  return res.json();
}

async function getClerkUser(userId: string): Promise<ClerkUser | null> {
  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: { Authorization: `Bearer ${CLERK_SECRET}` },
  });
  if (!res.ok) {
    console.error(`  Clerk 404 for ${userId}`);
    return null;
  }
  return res.json();
}

async function updateSupabaseEmail(userId: string, email: string): Promise<boolean> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/subscriptions?user_id=eq.${userId}`,
    {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email }),
    }
  );
  return res.ok;
}

async function syncBrevoContact(
  email: string,
  firstName?: string,
  lastName?: string,
  signupDate?: string
): Promise<boolean> {
  const attributes: Record<string, string> = {};
  if (firstName) attributes.PRENOM = firstName;
  if (lastName) attributes.NOM = lastName;
  if (signupDate) attributes.SIGNUP_DATE = signupDate;
  attributes.PLAN = "free";

  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      email,
      attributes,
      listIds: [BREVO_LIST_ID],
      updateEnabled: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`  Brevo error for ${email}: ${err}`);
    return false;
  }
  return true;
}

async function main() {
  console.log("Récupération des utilisateurs sans email...");
  const users = await getSupabaseUsersWithoutEmail();
  console.log(`${users.length} utilisateurs à synchroniser\n`);

  let supabaseOk = 0;
  let brevoOk = 0;
  let skipped = 0;

  for (const { user_id } of users) {
    const clerk = await getClerkUser(user_id);
    if (!clerk || !clerk.email_addresses.length) {
      console.log(`SKIP ${user_id} — pas trouvé ou pas d'email dans Clerk`);
      skipped++;
      continue;
    }

    const email = clerk.email_addresses[0].email_address;
    const firstName = clerk.first_name ?? undefined;
    const lastName = clerk.last_name ?? undefined;
    const signupDate = new Date(clerk.created_at).toISOString().split("T")[0];

    // 1. Update Supabase
    const dbOk = await updateSupabaseEmail(user_id, email);
    if (dbOk) supabaseOk++;

    // 2. Sync Brevo
    const bOk = await syncBrevoContact(email, firstName, lastName, signupDate);
    if (bOk) brevoOk++;

    console.log(`OK ${email} (supabase=${dbOk}, brevo=${bOk})`);

    // Rate limit: 10 req/s Clerk, 10 req/s Brevo
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\nTerminé:`);
  console.log(`  Supabase mis à jour: ${supabaseOk}/${users.length}`);
  console.log(`  Brevo synchronisés: ${brevoOk}/${users.length}`);
  console.log(`  Skippés: ${skipped}`);
}

main().catch(console.error);
