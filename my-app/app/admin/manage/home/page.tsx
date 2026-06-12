import { createAdminClient } from "@/lib/supabase/admin";
import { PetStatus, DispositionReason } from "@/types/types";

const ACTIVE_STATUS_ORDER: PetStatus[] = [
  "quarantined",
  "available for adoption",
  "pending adoption",
];

const ACTIVE_STATUS_LABELS: Record<string, string> = {
  "quarantined":            "Quarantined",
  "available for adoption": "Available for Adoption",
  "pending adoption":       "Pending Adoption",
};

const ACTIVE_STATUS_STYLES: Record<string, { border: string; count: string }> = {
  "quarantined":            { border: "border-l-4 border-orange-400", count: "text-orange-600" },
  "available for adoption": { border: "border-l-4 border-green-400",  count: "text-green-600"  },
  "pending adoption":       { border: "border-l-4 border-blue-400",   count: "text-blue-600"   },
};

const DISPOSITION_REASON_ORDER: DispositionReason[] = [
  "adopted",
  "transferred",
  "returned_to_owner",
  "deceased",
  "euthanized",
  "other",
];

const DISPOSITION_REASON_LABELS: Record<DispositionReason, string> = {
  "adopted":           "Adopted",
  "transferred":       "Transferred",
  "returned_to_owner": "Returned to Owner",
  "deceased":          "Deceased",
  "euthanized":        "Euthanized",
  "other":             "Other Disposition",
};

const DISPOSITION_REASON_STYLES: Record<DispositionReason, { border: string; count: string }> = {
  "adopted":           { border: "border-l-4 border-gray-300",  count: "text-gray-500" },
  "transferred":       { border: "border-l-4 border-gray-300",  count: "text-gray-500" },
  "returned_to_owner": { border: "border-l-4 border-gray-300",  count: "text-gray-500" },
  "deceased":          { border: "border-l-4 border-red-300",   count: "text-red-400"  },
  "euthanized":        { border: "border-l-4 border-red-300",   count: "text-red-400"  },
  "other":             { border: "border-l-4 border-gray-300",  count: "text-gray-500" },
};

export default async function AdminHome() {
  const adminClient = createAdminClient();

  const [
    { count: userCount },
    { data: pets },
    { count: pendingAppCount },
    { count: underReviewAppCount },
  ] = await Promise.all([
    adminClient.from("users").select("*", { count: "exact", head: true }),
    adminClient.from("pets").select("status, disposition_date, disposition_reason"),
    adminClient.from("adoption_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    adminClient.from("adoption_applications").select("*", { count: "exact", head: true }).eq("status", "under_review"),
  ]);

  const allPets = pets ?? [];
  const activePets = allPets.filter((p) => !p.disposition_date);
  const dispositionedPets = allPets.filter((p) => p.disposition_date);

  const activeStatusCounts = activePets.reduce<Partial<Record<string, number>>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  const dispositionReasonCounts = dispositionedPets.reduce<Partial<Record<string, number>>>((acc, p) => {
    const r = p.disposition_reason ?? "other";
    acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});

  const activeStatusesWithData = ACTIVE_STATUS_ORDER.filter((s) => (activeStatusCounts[s] ?? 0) > 0);
  const dispositionReasonsWithData = DISPOSITION_REASON_ORDER.filter((r) => (dispositionReasonCounts[r] ?? 0) > 0);

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Welcome to the admin dashboard. Here you can manage the shelter's
        operations, view reports, and oversee volunteer activities.
      </p>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Use the navigation menu to access different sections of the dashboard
        and stay updated on the latest shelter news and events.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-7xl mb-6">
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Total Users</h2>
          <p className="text-3xl font-bold text-gray-800">{userCount ?? 0}</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 border-l-4 border-yellow-400">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            <a href="/admin/manage/applications" className="hover:underline">New Applications</a>
          </h2>
          <p className="text-3xl font-bold text-yellow-600">{pendingAppCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Pending review</p>
        </div>
        <div className="bg-white shadow-md rounded p-4 border-l-4 border-blue-400">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            <a href="/admin/manage/applications" className="hover:underline">Under Review</a>
          </h2>
          <p className="text-3xl font-bold text-blue-600">{underReviewAppCount ?? 0}</p>
          <p className="text-xs text-gray-400 mt-1">Applications in progress</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-7xl">
        <div className="bg-white shadow-md rounded p-4 border-l-4 border-indigo-400">
          <h2 className="text-2xl font-bold mb-1">Active Animals</h2>
          <p className="text-3xl font-semibold text-indigo-600">{activePets.length}</p>
          <p className="text-xs text-gray-400 mt-1">Excludes dispositioned animals</p>
        </div>

        {activeStatusesWithData.map((status) => {
          const styles = ACTIVE_STATUS_STYLES[status];
          return (
            <div key={status} className={`bg-white shadow-md rounded p-4 ${styles.border}`}>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">{ACTIVE_STATUS_LABELS[status]}</h2>
              <p className={`text-3xl font-bold ${styles.count}`}>{activeStatusCounts[status]}</p>
            </div>
          );
        })}

        {dispositionReasonsWithData.length > 0 && (
          <div className="md:col-span-2 mt-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Dispositioned</h3>
          </div>
        )}

        {dispositionReasonsWithData.map((reason) => {
          const styles = DISPOSITION_REASON_STYLES[reason];
          return (
            <div key={reason} className={`bg-white shadow-md rounded p-4 ${styles.border}`}>
              <h2 className="text-lg font-semibold text-gray-700 mb-1">{DISPOSITION_REASON_LABELS[reason]}</h2>
              <p className={`text-3xl font-bold ${styles.count}`}>{dispositionReasonCounts[reason]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
