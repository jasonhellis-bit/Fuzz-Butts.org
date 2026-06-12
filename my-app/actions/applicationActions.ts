"use server";

import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AdoptionApplication, ApplicationNote, ApplicationStatus } from "@/types/types";

async function sendNewApplicationEmail(
  applicationId: string,
  applicantName: string,
  applicantEmail: string,
  applicantPhone: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !from || !to) return;

  const resend = new Resend(apiKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const reviewUrl = `${siteUrl}/admin/manage/applications/${applicationId}`;

  await resend.emails.send({
    from,
    to,
    subject: `New Adoption Application — ${applicantName}`,
    html: `
      <p>A new adoption application was submitted on the Fuzz Butts website.</p>
      <table style="border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:4px 16px 4px 0;color:#6b7280;font-size:14px;">Name</td><td style="font-size:14px;">${applicantName}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#6b7280;font-size:14px;">Email</td><td style="font-size:14px;">${applicantEmail}</td></tr>
        <tr><td style="padding:4px 16px 4px 0;color:#6b7280;font-size:14px;">Phone</td><td style="font-size:14px;">${applicantPhone}</td></tr>
      </table>
      <p style="margin-top:24px;">
        <a href="${reviewUrl}" style="background:#2563eb;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">
          Review Application
        </a>
      </p>
      <p style="margin-top:24px;font-size:12px;color:#9ca3af;">
        Fuzz Butts Inc. · <a href="${siteUrl}" style="color:#9ca3af;">${siteUrl}</a>
      </p>
    `,
  });
}

async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function submitApplication(
  applicationData: Record<string, unknown>,
): Promise<{ id?: string; error?: string }> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("adoption_applications")
    .insert({ application_data: applicationData })
    .select("id")
    .single();

  if (error) return { error: error.message };

  const d = applicationData as Record<string, string>;
  const applicantName = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim() || "Unknown";
  // Fire-and-forget — email failure must not block the applicant's submission
  sendNewApplicationEmail(data.id, applicantName, d.email ?? "", d.phone ?? "").catch(
    (err) => console.error("Failed to send application notification email:", err),
  );

  return { id: data.id };
}

export async function addApplicationNote(
  applicationId: string,
  note: string,
): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const user = await getCurrentUser();

  let createdByName: string | null = null;
  if (user) {
    const { data: userData } = await adminClient
      .from("users")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();
    if (userData) {
      createdByName = `${userData.first_name} ${userData.last_name}`.trim();
    }
  }

  const { error } = await adminClient.from("adoption_application_notes").insert({
    application_id: applicationId,
    note,
    created_by_user_id: user?.id ?? null,
    created_by_name: createdByName,
  });

  if (error) return { error: error.message };
  return {};
}

export async function getApplications(
  statuses: ApplicationStatus[],
): Promise<AdoptionApplication[]> {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("adoption_applications")
    .select("id, submitted_at, status, application_data")
    .in("status", statuses)
    .order("submitted_at", { ascending: false });
  if (error || !data) return [];
  return data as AdoptionApplication[];
}

export async function getApplication(
  id: string,
): Promise<AdoptionApplication | null> {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("adoption_applications")
    .select("id, submitted_at, status, application_data")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as AdoptionApplication;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<{ error?: string }> {
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("adoption_applications")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/manage/applications");
  revalidatePath(`/admin/manage/applications/${id}`);
  return {};
}

export async function getApplicationNotes(
  applicationId: string,
): Promise<ApplicationNote[]> {
  const adminClient = createAdminClient();

  const { data, error } = await adminClient
    .from("adoption_application_notes")
    .select("id, application_id, note, created_at, created_by_user_id, created_by_name")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as ApplicationNote[];
}
