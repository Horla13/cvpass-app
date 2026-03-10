import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const BREVO_API_KEY = process.env.BREVO_API_KEY!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!BREVO_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ Variables d'environnement manquantes");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function fetchAllBrevoContacts(): Promise<string[]> {
  const emails: string[] = [];
  const limit = 500;
  let offset = 0;

  while (true) {
    const url = `https://api.brevo.com/v3/contacts?limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Brevo API error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      contacts: Array<{ email: string }>;
      count: number;
    };

    if (!data.contacts || data.contacts.length === 0) break;

    for (const contact of data.contacts) {
      if (contact.email) emails.push(contact.email);
    }

    console.log(`  Récupérés : ${emails.length} / ${data.count}`);

    if (data.contacts.length < limit) break;
    offset += limit;
  }

  return emails;
}

async function syncToSupabase(emails: string[]): Promise<number> {
  if (emails.length === 0) return 0;

  let inserted = 0;

  // Insert in batches of 100 to avoid request size limits
  const batchSize = 100;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize).map((email) => ({ email }));

    const { error, data: upserted } = await supabase
      .from("beta_whitelist")
      .upsert(batch, { onConflict: "email", ignoreDuplicates: true })
      .select("email");

    if (error) {
      console.error(`❌ Erreur Supabase (batch ${i / batchSize + 1}):`, error.message);
    } else {
      inserted += upserted?.length ?? 0;
    }
  }

  return inserted;
}

async function main() {
  console.log("=== Sync Brevo → Supabase beta_whitelist ===\n");

  console.log("📡 Récupération des contacts Brevo...");
  const emails = await fetchAllBrevoContacts();
  console.log(`\n✅ Total récupérés depuis Brevo : ${emails.length}\n`);

  if (emails.length === 0) {
    console.log("Aucun contact trouvé dans Brevo.");
    return;
  }

  console.log("💾 Insertion dans Supabase...");
  const inserted = await syncToSupabase(emails);
  console.log(`✅ Insertions dans beta_whitelist : ${inserted}\n`);

  console.log("📋 Liste complète des emails :");
  emails.forEach((email, i) => console.log(`  ${i + 1}. ${email}`));

  console.log(`\n=== Résumé ===`);
  console.log(`  Emails récupérés  : ${emails.length}`);
  console.log(`  Emails insérés    : ${inserted}`);
  console.log(`  Nouveaux/doublons : ${emails.length - inserted} ignorés`);
}

main().catch((err) => {
  console.error("❌ Erreur fatale:", err);
  process.exit(1);
});
