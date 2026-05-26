import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ManageUserCard from "@/components/manage/ManageUserCard";
import AddUserForm from "@/components/manage/AddUserForm";
import { User } from "@/types/types";

export default async function ManageUsersPage() {
  const supabase = await createClient();

  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/admin");

  const { data: currentProfile } = await supabase
    .from("users")
    .select("roles")
    .eq("id", authUser.id)
    .single();

  const roles = (currentProfile?.roles ?? "")
    .split(",")
    .map((r: string) => r.trim())
    .filter(Boolean);

  if (!roles.includes("admin")) redirect("/admin/manage/home");

  const adminClient = createAdminClient();

  const [{ data: profileData, error: profileError }, { data: authData, error: authError }] =
    await Promise.all([
      adminClient
        .from("users")
        .select(
          `id, first_name, last_name, title, status, roles, created_at, updated_at,
           audit:user_audit_log(id, description, event_date_time)`
        )
        .order("last_name", { ascending: true }),
      adminClient.auth.admin.listUsers({ perPage: 1000 }),
    ]);

  const authMap = new Map(
    (authData?.users ?? []).map((u) => [u.id, { email: u.email, phone: u.phone }])
  );

  const users: User[] = (profileData ?? []).map((profile) => ({
    ...profile,
    ...authMap.get(profile.id),
  }));

  const error = profileError ?? authError;

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-4xl font-bold mb-8">User Management</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Here you can manage user accounts, view user details, and update user
        information.
      </p>
      <AddUserForm />
      {error && (
        <p className="text-red-500 mb-4">Failed to load users: {error.message}</p>
      )}
      {users.map((user) => (
        <ManageUserCard key={user.id} user={user} />
      ))}
      {!error && users.length === 0 && (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
