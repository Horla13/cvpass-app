/**
 * Script one-shot : synchronise tous les utilisateurs Clerk vers la table Supabase `users`.
 *
 * Usage :
 *   npx tsx scripts/sync-clerk-users.ts
 *
 * Nécessite les variables d'env :
 *   CLERK_SECRET_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { createClerkClient } from "@clerk/backend";
import { createClient } from "@supabase/supabase-js";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  let offset = 0;
  const limit = 100;
  let total = 0;

  console.log("Synchronisation Clerk → Supabase...\n");

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data: users } = await clerk.users.getUserList({ limit, offset });

    if (users.length === 0) break;

    const rows = users.map((u) => ({
      clerk_id: u.id,
      email: u.emailAddresses[0]?.emailAddress ?? "unknown",
      first_name: u.firstName || null,
      created_at: new Date(u.createdAt).toISOString(),
    }));

    const { error } = await supabase
      .from("users")
      .upsert(rows, { onConflict: "clerk_id" });

    if (error) {
      console.error("Erreur Supabase:", error.message);
      process.exit(1);
    }

    total += users.length;
    console.log(`  ✓ ${total} utilisateurs synchronisés`);

    if (users.length < limit) break;
    offset += limit;
  }

  console.log(`\nTerminé — ${total} utilisateurs insérés/mis à jour dans Supabase.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
