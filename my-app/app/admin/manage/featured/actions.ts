"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function setFeatured(formData: FormData): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const petId = formData.get("pet_id") as string;
  const startDate = formData.get("start_date") as string;
  const endDate = (formData.get("end_date") as string) || null;

  // Remove any currently active feature
  const today = new Date().toISOString().split("T")[0];
  await adminClient
    .from("featured_adoptions")
    .delete()
    .lte("start_date", today)
    .or(`end_date.is.null,end_date.gte.${today}`);

  const { error } = await adminClient
    .from("featured_adoptions")
    .insert({ pet_id: petId, start_date: startDate, end_date: endDate });

  if (error) return { error: error.message };

  revalidatePath("/admin/manage/featured");
  revalidatePath("/");
  return {};
}

export async function endFeatured(id: string): Promise<{ error?: string }> {
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("featured_adoptions")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/manage/featured");
  revalidatePath("/");
  return {};
}
