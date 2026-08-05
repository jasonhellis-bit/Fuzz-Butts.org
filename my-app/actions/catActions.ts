"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AuditLogEntry, PetImageData } from "@/types/types";

async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  pet_type: "Type",
  sex: "Sex",
  breed: "Breed",
  age: "Age",
  weight: "Weight",
  status: "Status",
  intake_date: "Intake date",
  intake_reason: "Intake reason",
  spayed_neutered: "Spayed/neutered",
  spay_neuter_date: "Spay/neuter date",
  disposition_date: "Disposition date",
  disposition_reason: "Disposition reason",
  description: "Description",
  notes: "Notes",
  adoption_fee: "Adoption fee",
};

function parseAdoptionFee(formData: FormData): number | null {
  const raw = formData.get("adoption_fee") as string;
  if (raw === null) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits === "") return null;
  return parseInt(digits, 10);
}

function buildUpdateDescription(
  old: Record<string, unknown>,
  updated: Record<string, unknown>,
): string {
  const changes: string[] = [];
  for (const key of Object.keys(FIELD_LABELS)) {
    const oldVal = old[key] ?? null;
    const newVal = updated[key] ?? null;
    const oldStr = oldVal === null ? "(none)" : String(oldVal);
    const newStr = newVal === null ? "(none)" : String(newVal);
    if (oldStr === newStr) continue;
    if (key === "description") {
      changes.push("Description changed");
    } else {
      changes.push(`${FIELD_LABELS[key]}: '${oldStr}' → '${newStr}'`);
    }
  }
  return changes.length > 0
    ? `Updated: ${changes.join("; ")}`
    : "Updated (no changes)";
}

export async function createPet(
  formData: FormData,
): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const userId = await getCurrentUserId();

  const name = formData.get("name") as string;
  const pet_type = formData.get("pet_type") as string;
  const sex = formData.get("sex") as string;
  const breed = (formData.get("breed") as string) || null;
  const age = (formData.get("age") as string) || null;
  const weight = (formData.get("weight") as string) || null;
  const description = (formData.get("description") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const adoption_fee = parseAdoptionFee(formData);
  const status = formData.get("status") as string;
  const intake_date = formData.get("intake_date") as string;
  const intake_reason = formData.get("intake_reason") as string;
  const spayed_neutered = formData.get("spayed_neutered") === "true";
  const spay_neuter_date = spayed_neutered
    ? (formData.get("spay_neuter_date") as string) || null
    : null;
  const disposition_date = (formData.get("disposition_date") as string) || null;
  const disposition_reason = disposition_date
    ? (formData.get("disposition_reason") as string) || null
    : null;
  const image = formData.get("image") as File | null;

  const { data: pet, error: petError } = await adminClient
    .from("pets")
    .insert({
      name,
      pet_type,
      sex,
      breed,
      age,
      weight,
      description,
      notes,
      adoption_fee,
      status,
      intake_date,
      intake_reason,
      spayed_neutered,
      spay_neuter_date,
      disposition_date,
      disposition_reason,
    })
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
    await adminClient
      .from("pet_images")
      .insert({
        pet_id: pet.id,
        storage_path: path,
        is_primary: true,
        display_order: 0,
      });
  }

  await adminClient.from("pet_audit_log").insert({
    pet_id: pet.id,
    user_id: userId,
    description: `Created: ${name} (${pet_type}, ${sex})`,
  });

  revalidatePath("/admin/manage/cats");
  revalidatePath("/admin/manage/featured");
  return {};
}

export async function updatePet(
  formData: FormData,
): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const userId = await getCurrentUserId();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const pet_type = formData.get("pet_type") as string;
  const sex = formData.get("sex") as string;
  const breed = (formData.get("breed") as string) || null;
  const age = (formData.get("age") as string) || null;
  const weight = (formData.get("weight") as string) || null;
  const description = (formData.get("description") as string) || null;
  const notes = (formData.get("notes") as string) || null;
  const adoption_fee = parseAdoptionFee(formData);
  const status = formData.get("status") as string;
  const intake_date = formData.get("intake_date") as string;
  const intake_reason = formData.get("intake_reason") as string;
  const spayed_neutered = formData.get("spayed_neutered") === "true";
  const spay_neuter_date = spayed_neutered
    ? (formData.get("spay_neuter_date") as string) || null
    : null;
  const disposition_date = (formData.get("disposition_date") as string) || null;
  const disposition_reason = disposition_date
    ? (formData.get("disposition_reason") as string) || null
    : null;
  const image = formData.get("image") as File | null;

  const { data: existing, error: fetchError } = await adminClient
    .from("pets")
    .select(
      "name, pet_type, sex, breed, age, weight, description, notes, adoption_fee, status, intake_date, intake_reason, spayed_neutered, spay_neuter_date, disposition_date, disposition_reason",
    )
    .eq("id", id)
    .single();

  if (fetchError) return { error: fetchError.message };

  const { error: petError } = await adminClient
    .from("pets")
    .update({
      name,
      pet_type,
      sex,
      breed,
      age,
      weight,
      description,
      notes,
      adoption_fee,
      status,
      intake_date,
      intake_reason,
      spayed_neutered,
      spay_neuter_date,
      disposition_date,
      disposition_reason,
    })
    .eq("id", id);

  if (petError) return { error: petError.message };

  if (image && image.size > 0) {
    const { data: existingImages } = await adminClient
      .from("pet_images")
      .select("storage_path")
      .eq("pet_id", id)
      .eq("is_primary", true);

    if (existingImages && existingImages.length > 0) {
      await adminClient.storage
        .from("pet-images")
        .remove(existingImages.map((i) => i.storage_path));
      await adminClient
        .from("pet_images")
        .delete()
        .eq("pet_id", id)
        .eq("is_primary", true);
    }

    const ext = image.name.split(".").pop() ?? "jpg";
    const path = `${id}/primary.${ext}`;
    const { error: uploadError } = await adminClient.storage
      .from("pet-images")
      .upload(path, image, { contentType: image.type });
    if (uploadError) return { error: uploadError.message };
    await adminClient
      .from("pet_images")
      .insert({
        pet_id: id,
        storage_path: path,
        is_primary: true,
        display_order: 0,
      });
  }

  const auditDescription = buildUpdateDescription(
    existing as Record<string, unknown>,
    {
      name,
      pet_type,
      sex,
      breed,
      age,
      weight,
      description,
      notes,
      adoption_fee,
      status,
      intake_date,
      intake_reason,
      spayed_neutered,
      spay_neuter_date,
      disposition_date,
      disposition_reason,
    },
  );

  await adminClient.from("pet_audit_log").insert({
    pet_id: id,
    user_id: userId,
    description: auditDescription,
  });

  revalidatePath("/admin/manage/cats");
  revalidatePath("/admin/manage/featured");
  return {};
}

export async function deletePhoto(petId: string): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const userId = await getCurrentUserId();

  const { data: images } = await adminClient
    .from("pet_images")
    .select("storage_path")
    .eq("pet_id", petId)
    .eq("is_primary", true);

  if (images && images.length > 0) {
    await adminClient.storage
      .from("pet-images")
      .remove(images.map((i) => i.storage_path));
    await adminClient
      .from("pet_images")
      .delete()
      .eq("pet_id", petId)
      .eq("is_primary", true);
  }

  await adminClient.from("pet_audit_log").insert({
    pet_id: petId,
    user_id: userId,
    description: "Primary photo removed",
  });

  revalidatePath("/admin/manage/cats");
  return {};
}

export async function getPetAuditLog(petId: string): Promise<AuditLogEntry[]> {
  const adminClient = createAdminClient();

  const { data: logs } = await adminClient
    .from("pet_audit_log")
    .select("id, date_time, description, user_id")
    .eq("pet_id", petId)
    .order("date_time", { ascending: false });

  if (!logs || logs.length === 0) return [];

  const userIds = [
    ...new Set(logs.map((l) => l.user_id).filter(Boolean) as string[]),
  ];

  let userMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: users } = await adminClient
      .from("users")
      .select("id, first_name, last_name")
      .in("id", userIds);
    userMap = Object.fromEntries(
      (users ?? []).map((u) => [u.id, `${u.first_name} ${u.last_name}`.trim()]),
    );
  }

  return logs.map((l) => ({
    id: l.id,
    date_time: l.date_time,
    description: l.description,
    user_name: l.user_id ? (userMap[l.user_id] ?? null) : null,
  }));
}

const DISPOSITION_STATUS_MAP: Record<string, string> = {
  adopted: "adopted",
  transferred: "adopted",
  returned_to_owner: "reclaimed by owner",
  deceased: "deceased",
  euthanized: "deceased",
  other: "adopted",
};

export async function removePet(
  formData: FormData,
): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const userId = await getCurrentUserId();

  const id = formData.get("id") as string;
  const disposition_date = formData.get("disposition_date") as string;
  const disposition_reason = formData.get("disposition_reason") as string;
  const status = DISPOSITION_STATUS_MAP[disposition_reason] ?? "adopted";

  const { error } = await adminClient
    .from("pets")
    .update({ disposition_date, disposition_reason, status })
    .eq("id", id);

  if (error) return { error: error.message };

  await adminClient.from("pet_audit_log").insert({
    pet_id: id,
    user_id: userId,
    description: `Removed: ${titleCase(disposition_reason)} on ${disposition_date}`,
  });

  revalidatePath("/admin/manage/cats");
  revalidatePath("/admin/manage/featured");
  return {};
}

function titleCase(s: string) {
  return s
    .split(/[\s_]/)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export async function getPetImages(petId: string): Promise<PetImageData[]> {
  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("pet_images")
    .select("id, storage_path, is_primary, display_order")
    .eq("pet_id", petId)
    .order("display_order", { ascending: true });
  return (data ?? []).map((img) => ({
    ...img,
    url: adminClient.storage.from("pet-images").getPublicUrl(img.storage_path)
      .data.publicUrl,
  }));
}

export async function uploadPetImage(
  petId: string,
  imageFile: File,
): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const userId = await getCurrentUserId();

  const ext = imageFile.name.split(".").pop() ?? "jpg";
  const path = `${petId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await adminClient.storage
    .from("pet-images")
    .upload(path, imageFile, { contentType: imageFile.type });
  if (uploadError) return { error: uploadError.message };

  const { data: existing } = await adminClient
    .from("pet_images")
    .select("display_order")
    .eq("pet_id", petId)
    .order("display_order", { ascending: false })
    .limit(1);
  const isFirst = !existing || existing.length === 0;
  const nextOrder = isFirst ? 0 : existing[0].display_order + 1;

  await adminClient.from("pet_images").insert({
    pet_id: petId,
    storage_path: path,
    is_primary: isFirst,
    display_order: nextOrder,
  });

  await adminClient.from("pet_audit_log").insert({
    pet_id: petId,
    user_id: userId,
    description: "Additional photo added",
  });

  revalidatePath("/admin/manage/cats");
  return {};
}

export async function setPrimaryImage(
  petId: string,
  imageId: string,
): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const userId = await getCurrentUserId();

  await adminClient
    .from("pet_images")
    .update({ is_primary: false })
    .eq("pet_id", petId)
    .eq("is_primary", true);

  const { error } = await adminClient
    .from("pet_images")
    .update({ is_primary: true })
    .eq("id", imageId);
  if (error) return { error: error.message };

  await adminClient.from("pet_audit_log").insert({
    pet_id: petId,
    user_id: userId,
    description: "Primary photo changed",
  });

  revalidatePath("/admin/manage/cats");
  return {};
}

export async function deleteImageById(
  petId: string,
  imageId: string,
  storagePath: string,
): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const userId = await getCurrentUserId();

  await adminClient.storage.from("pet-images").remove([storagePath]);

  const { error } = await adminClient
    .from("pet_images")
    .delete()
    .eq("id", imageId);
  if (error) return { error: error.message };

  await adminClient.from("pet_audit_log").insert({
    pet_id: petId,
    user_id: userId,
    description: "Photo removed",
  });

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
    await adminClient.storage
      .from("pet-images")
      .remove(images.map((i) => i.storage_path));
  }

  const { error } = await adminClient.from("pets").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/manage/cats");
  return {};
}
