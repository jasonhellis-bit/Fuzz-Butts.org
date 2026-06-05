/**
 * Deletes all pets and their related records from the database.
 *
 * What gets deleted:
 *   - All files in the `pet-images` Supabase Storage bucket
 *   - All rows in `pets` table (CASCADE removes pet_audit_log, pet_images, featured_adoptions)
 *
 * Run from the my-app directory:
 *   npx tsx --env-file=.env.local scripts/delete-all-pets.ts
 */

import { createClient } from "@supabase/supabase-js";
import readline from "readline";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "yes");
    });
  });
}

async function deleteStorageFiles(): Promise<number> {
  const { data: folders, error: listError } = await supabase.storage
    .from("pet-images")
    .list();

  if (listError) throw new Error(`Failed to list storage: ${listError.message}`);
  if (!folders || folders.length === 0) return 0;

  const allPaths: string[] = [];

  for (const folder of folders) {
    const { data: files, error: filesError } = await supabase.storage
      .from("pet-images")
      .list(folder.name);

    if (filesError) {
      console.warn(`  Warning: could not list files in ${folder.name}: ${filesError.message}`);
      continue;
    }

    for (const file of files ?? []) {
      allPaths.push(`${folder.name}/${file.name}`);
    }
  }

  if (allPaths.length === 0) return 0;

  // Remove in batches of 100 (Supabase limit)
  const BATCH = 100;
  for (let i = 0; i < allPaths.length; i += BATCH) {
    const { error } = await supabase.storage
      .from("pet-images")
      .remove(allPaths.slice(i, i + BATCH));
    if (error) throw new Error(`Failed to delete storage files: ${error.message}`);
  }

  return allPaths.length;
}

async function deletePetRecords(ids: string[]): Promise<void> {
  // Delete in batches of 100 to stay within query limits
  const BATCH = 100;
  for (let i = 0; i < ids.length; i += BATCH) {
    const { error } = await supabase
      .from("pets")
      .delete()
      .in("id", ids.slice(i, i + BATCH));
    if (error) throw new Error(`Failed to delete pets: ${error.message}`);
  }
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing required environment variables.");
    console.error("  NEXT_PUBLIC_SUPABASE_URL");
    console.error("  SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  console.log("Fetching pets...");
  const { data: pets, error } = await supabase.from("pets").select("id");
  if (error) {
    console.error("Error fetching pets:", error.message);
    process.exit(1);
  }

  if (!pets || pets.length === 0) {
    console.log("No pets found — nothing to delete.");
    return;
  }

  console.log(`Found ${pets.length} pet(s).`);
  console.log("\nThis will permanently delete:");
  console.log(`  - ${pets.length} pet record(s)`);
  console.log("  - All related audit log entries");
  console.log("  - All related image records");
  console.log("  - All featured adoption entries");
  console.log("  - All files in the pet-images storage bucket");

  const ok = await confirm("\nType 'yes' to confirm: ");
  if (!ok) {
    console.log("Aborted.");
    return;
  }

  console.log("\nDeleting storage files...");
  const fileCount = await deleteStorageFiles();
  console.log(`  Deleted ${fileCount} file(s).`);

  console.log("Deleting pet records (cascades to related tables)...");
  const petIds = pets.map((p) => p.id as string);
  await deletePetRecords(petIds);
  console.log(`  Deleted ${petIds.length} pet(s) and all related records.`);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
