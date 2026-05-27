"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function createPet(formData: FormData): Promise<{ error?: string }> {
  const adminClient = createAdminClient();

  const name = formData.get("name") as string;
  const pet_type = formData.get("pet_type") as string;
  const sex = formData.get("sex") as string;
  const breed = (formData.get("breed") as string) || null;
  const description = (formData.get("description") as string) || null;
  const status = formData.get("status") as string;
  const intake_date = formData.get("intake_date") as string;
  const intake_reason = formData.get("intake_reason") as string;
  const spayed_neutered = formData.get("spayed_neutered") === "true";
  const spay_neuter_date = spayed_neutered ? (formData.get("spay_neuter_date") as string) || null : null;
  const disposition_date = (formData.get("disposition_date") as string) || null;
  const disposition_reason = disposition_date ? (formData.get("disposition_reason") as string) || null : null;
  const image = formData.get("image") as File | null;

  const { data: pet, error: petError } = await adminClient
    .from("pets")
    .insert({ name, pet_type, sex, breed, description, status, intake_date, intake_reason, spayed_neutered, spay_neuter_date, disposition_date, disposition_reason })
    .select("id")
    .single();

  if (petError) return { error: petError.message };

  if (image && image.size > 0) {
    const ext = image.name.split(".").pop() ?? "jpg";
    const path = `${pet.id}/primary.${ext}`;
    const { error: uploadError } = await adminClient.storage
      .from("pet-images")
      .upload(path, image, { contentType: image.type });
    if (uploadError) return { error: uploadError.message };
    await adminClient.from("pet_images").insert({ pet_id: pet.id, storage_path: path, is_primary: true, display_order: 0 });
  }

  await adminClient.from("pet_audit_log").insert({ pet_id: pet.id, description: `Pet created: ${name}` });

  revalidatePath("/admin/manage/cats");
  return {};
}

export async function updatePet(formData: FormData): Promise<{ error?: string }> {
  const adminClient = createAdminClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const pet_type = formData.get("pet_type") as string;
  const sex = formData.get("sex") as string;
  const breed = (formData.get("breed") as string) || null;
  const description = (formData.get("description") as string) || null;
  const status = formData.get("status") as string;
  const intake_date = formData.get("intake_date") as string;
  const intake_reason = formData.get("intake_reason") as string;
  const spayed_neutered = formData.get("spayed_neutered") === "true";
  const spay_neuter_date = spayed_neutered ? (formData.get("spay_neuter_date") as string) || null : null;
  const disposition_date = (formData.get("disposition_date") as string) || null;
  const disposition_reason = disposition_date ? (formData.get("disposition_reason") as string) || null : null;
  const image = formData.get("image") as File | null;

  const { error: petError } = await adminClient
    .from("pets")
    .update({ name, pet_type, sex, breed, description, status, intake_date, intake_reason, spayed_neutered, spay_neuter_date, disposition_date, disposition_reason })
    .eq("id", id);

  if (petError) return { error: petError.message };

  if (image && image.size > 0) {
    const { data: existing } = await adminClient
      .from("pet_images")
      .select("storage_path")
      .eq("pet_id", id)
      .eq("is_primary", true);

    if (existing && existing.length > 0) {
      await adminClient.storage.from("pet-images").remove(existing.map((i) => i.storage_path));
      await adminClient.from("pet_images").delete().eq("pet_id", id).eq("is_primary", true);
    }

    const ext = image.name.split(".").pop() ?? "jpg";
    const path = `${id}/primary.${ext}`;
    const { error: uploadError } = await adminClient.storage
      .from("pet-images")
      .upload(path, image, { contentType: image.type });
    if (uploadError) return { error: uploadError.message };
    await adminClient.from("pet_images").insert({ pet_id: id, storage_path: path, is_primary: true, display_order: 0 });
  }

  await adminClient.from("pet_audit_log").insert({ pet_id: id, description: `Pet updated: ${name}` });

  revalidatePath("/admin/manage/cats");
  return {};
}

export async function deletePhoto(petId: string): Promise<{ error?: string }> {
  const adminClient = createAdminClient();

  const { data: images } = await adminClient
    .from("pet_images")
    .select("storage_path")
    .eq("pet_id", petId)
    .eq("is_primary", true);

  if (images && images.length > 0) {
    await adminClient.storage.from("pet-images").remove(images.map((i) => i.storage_path));
    await adminClient.from("pet_images").delete().eq("pet_id", petId).eq("is_primary", true);
  }

  await adminClient.from("pet_audit_log").insert({ pet_id: petId, description: "Primary photo removed" });

  revalidatePath("/admin/manage/cats");
  return {};
}

export async function deletePet(id: string): Promise<{ error?: string }> {
  const adminClient = createAdminClient();

  const { data: images } = await adminClient
    .from("pet_images")
    .select("storage_path")
    .eq("pet_id", id);

  if (images && images.length > 0) {
    await adminClient.storage.from("pet-images").remove(images.map((i) => i.storage_path));
  }

  const { error } = await adminClient.from("pets").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/manage/cats");
  return {};
}
