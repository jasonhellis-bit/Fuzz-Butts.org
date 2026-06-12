import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getApplications } from "@/actions/applicationActions";
import { ApplicationStatus } from "@/types/types";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<ApplicationStatus, { label: string; classes: string }> = {
  pending:      { label: "Pending",      classes: "bg-yellow-100 text-yellow-700" },
  under_review: { label: "Under Review", classes: "bg-blue-100 text-blue-700" },
  approved:     { label: "Approved",     classes: "bg-green-100 text-green-700" },
  denied:       { label: "Denied",       classes: "bg-red-100 text-red-700" },
  withdrawn:    { label: "Withdrawn",    classes: "bg-gray-100 text-gray-600" },
};

const ACTIVE_STATUSES: ApplicationStatus[]  = ["pending", "under_review"];
const CLOSED_STATUSES: ApplicationStatus[]  = ["approved", "denied", "withdrawn"];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const { view } = await searchParams;
  const showClosed = view === "closed";
  const statuses = showClosed ? CLOSED_STATUSES : ACTIVE_STATUSES;

  const applications = await getApplications(statuses);

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-4xl font-bold mb-3">Adoption Applications</h1>
      <p className="text-gray-500 mb-6 text-center max-w-xl">
        {showClosed
          ? "Closed applications (approved, denied, or withdrawn)."
          : "Active applications awaiting review. Click any row to open the full application."}
      </p>

      {/* Toggle */}
      <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-1 mb-8">
        <Link
          href="/admin/manage/applications"
          className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${
            !showClosed
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          Active
        </Link>
        <Link
          href="/admin/manage/applications?view=closed"
          className={`px-5 py-1.5 rounded-md text-sm font-medium transition-colors ${
            showClosed
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}>
          Closed
        </Link>
      </div>

      <div className="w-full max-w-5xl">
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-400">
              {showClosed ? "No closed applications." : "No active applications at this time."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-100">
            {applications.map((app) => {
              const d = app.application_data as Record<string, string>;
              const name = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim() || "Unknown Applicant";
              const badge = STATUS_BADGE[app.status as ApplicationStatus];
              return (
                <Link
                  key={app.id}
                  href={`/admin/manage/applications/${app.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{name}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {d.email}
                      {d.phone ? ` · ${d.phone}` : ""}
                    </p>
                  </div>
                  <p className="hidden sm:block text-sm text-gray-400 whitespace-nowrap">
                    {new Date(app.submitted_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${badge.classes}`}>
                    {badge.label}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
