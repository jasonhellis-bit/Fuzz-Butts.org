"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { UserStatus } from "@/types/types";
import { SupabaseClient } from "@supabase/supabase-js";

async function insertAuditLog(
  adminClient: SupabaseClient,
  userId: string,
  description: string
) {
  await adminClient.from("user_audit_log").insert({ user_id: userId, description });
}

export async function updateUser(formData: FormData): Promise<{ error?: string }> {
  const id = formData.get("id") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const title = (formData.get("title") as string) || null;
  const email = formData.get("email") as string;
  const rawPhone = formData.get("phone") as string;
  const digits = rawPhone ? rawPhone.replace(/\D/g, "") : "";
  const phone = digits ? `+1${digits.startsWith("1") && digits.length === 11 ? digits.slice(1) : digits}` : "";
  const roles = formData.get("roles") as string;
  const status = formData.get("status") as UserStatus;

  const adminClient = createAdminClient();

  const [{ data: existing }, { data: existingAuth }] = await Promise.all([
    adminClient.from("users").select("first_name, last_name, title, roles, status").eq("id", id).single(),
    adminClient.auth.admin.getUserById(id),
  ]);

  const { error: profileError } = await adminClient
    .from("users")
    .update({ first_name, last_name, title, roles, status })
    .eq("id", id);

  if (profileError) return { error: profileError.message };

  const authUpdate: { email?: string; phone?: string } = {};
  if (email) authUpdate.email = email;
  if (phone) authUpdate.phone = phone;

  if (Object.keys(authUpdate).length > 0) {
    const { error: authError } = await adminClient.auth.admin.updateUserById(id, authUpdate);
    if (authError) return { error: authError.message };
  }

  const changes: string[] = [];
  if (existing?.first_name !== first_name || existing?.last_name !== last_name)
    changes.push("name updated");
  if (existing?.title !== title)
    changes.push("title updated");
  if (existing?.roles !== roles)
    changes.push(`roles changed to: ${roles || "none"}`);
  if (existing?.status !== status)
    changes.push(`status changed to: ${status}`);
  if (existingAuth.user?.email !== email)
    changes.push("email updated");
  if (existingAuth.user?.phone !== phone)
    changes.push("phone updated");

  const description = changes.length > 0
    ? `Profile updated: ${changes.join(", ")}`
    : "Profile updated";

  await insertAuditLog(adminClient, id, description);

  revalidatePath("/admin/manage/users");
  return {};
}

export async function changePassword(userId: string, newPassword: string): Promise<{ error?: string }> {
  if (!newPassword || newPassword.length < 8) return { error: "Password must be at least 8 characters." };

  const adminClient = createAdminClient();

  const { error } = await adminClient.auth.admin.updateUserById(userId, { password: newPassword });
  if (error) return { error: error.message };

  await insertAuditLog(adminClient, userId, "Password changed by admin");

  return {};
}

export async function createUser(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const title = (formData.get("title") as string) || null;
  const roles = formData.get("roles") as string;
  const status = (formData.get("status") as UserStatus) ?? "pending";

  const adminClient = createAdminClient();

  const { data, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name, last_name },
  });

  if (authError) return { error: authError.message };

  const { error: profileError } = await adminClient
    .from("users")
    .update({ title, roles, status })
    .eq("id", data.user.id);

  if (profileError) return { error: profileError.message };

  await insertAuditLog(adminClient, data.user.id, "User account created");

  revalidatePath("/admin/manage/users");
  return {};
}
