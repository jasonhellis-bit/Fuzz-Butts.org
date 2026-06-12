import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getApplication, getApplicationNotes } from "@/actions/applicationActions";
import ApplicationStatusAndNotes from "@/components/manage/ApplicationStatusAndNotes";
import { ApplicationStatus } from "@/types/types";

export const dynamic = "force-dynamic";

const HOME_TYPE_LABELS: Record<string, string> = {
  house:       "House",
  apartment:   "Apartment",
  condo:       "Condo / Townhouse",
  mobile_home: "Mobile Home",
  other:       "Other",
};

const YARD_LABELS: Record<string, string> = {
  no:           "No yard",
  yes_unfenced: "Yes, unfenced",
  yes_fenced:   "Yes, fully fenced",
  yes_partial:  "Yes, partially fenced",
};

const WORK_LABELS: Record<string, string> = {
  work_from_home:  "Work from home",
  office_full_time:"Office full-time",
  hybrid:          "Hybrid",
  part_time:       "Part-time / flexible",
  retired:         "Retired / stay at home",
  other:           "Other",
};

const SLEEP_LABELS: Record<string, string> = {
  anywhere:   "Anywhere they choose",
  bedroom:    "In the bedroom",
  own_bed:    "Their own bed / cat furniture",
  restricted: "Restricted to certain rooms",
};

function Field({ label, value, wide }: { label: string; value?: string | null; wide?: boolean }) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</dt>
      <dd className="text-sm text-gray-800 mt-0.5 whitespace-pre-wrap">
        {value?.trim() || <span className="text-gray-300 italic">Not provided</span>}
      </dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">{title}</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">{children}</dl>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin");

  const [application, notes] = await Promise.all([
    getApplication(id),
    getApplicationNotes(id),
  ]);

  if (!application) notFound();

  const isReadOnly = !["pending", "under_review"].includes(application.status);
  const d = application.application_data as Record<string, string>;
  const name = `${d.firstName ?? ""} ${d.lastName ?? ""}`.trim() || "Unknown Applicant";

  const address = [d.address, d.city, d.state, d.zip].filter(Boolean).join(", ");

  const childrenDisplay =
    d.childrenInHome === "none"
      ? "No children"
      : d.childrenAges
      ? `Yes — ages: ${d.childrenAges}`
      : "Yes";

  const currentPetsDisplay =
    d.currentPetCount === "0"
      ? "None"
      : d.currentPetsDetails
      ? `${d.currentPetCount} — ${d.currentPetsDetails}`
      : d.currentPetCount;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-5">
        <Link
          href="/admin/manage/applications"
          className="text-sm text-blue-600 hover:underline">
          ← All Applications
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Status + notes — first on mobile (top), right sidebar on desktop */}
        <div className="w-full md:w-72 flex-shrink-0 md:order-last">
          <div className="md:sticky md:top-6">
            <ApplicationStatusAndNotes
              applicationId={application.id}
              currentStatus={application.status as ApplicationStatus}
              notes={notes}
              isReadOnly={isReadOnly}
            />
          </div>
        </div>

        {/* Application data */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">{name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Submitted{" "}
              {new Date(application.submitted_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <Section title="Applicant Information">
            <Field label="Full Name" value={name} />
            <Field label="Email" value={d.email} />
            <Field label="Phone" value={d.phone} />
            <Field label="Address" value={address} wide />
          </Section>

          <Section title="Household Details">
            <Field label="Adults in home" value={d.adultsInHome} />
            <Field label="Children" value={childrenDisplay} />
            <Field label="Pet allergies" value={d.allergies} wide />
            <Field label="Current pets" value={currentPetsDisplay} wide />
          </Section>

          <Section title="Housing Information">
            <Field label="Own or rent" value={d.ownOrRent ? d.ownOrRent.charAt(0).toUpperCase() + d.ownOrRent.slice(1) : null} />
            <Field label="Home type" value={d.homeType ? (HOME_TYPE_LABELS[d.homeType] ?? d.homeType) : null} />
            {d.ownOrRent === "rent" && (
              <Field label="Landlord permits cats" value={d.landlordPermission === "true" ? "Yes" : "No"} />
            )}
            <Field label="Yard" value={d.hasYard ? (YARD_LABELS[d.hasYard] ?? d.hasYard) : null} />
            {d.hasYard && d.hasYard !== "no" && (
              <Field label="Fencing details" value={d.fencingDetails} wide />
            )}
          </Section>

          <Section title="Pet Care Experience">
            <Field label="Previous pets" value={d.previousPets} wide />
            <Field label="Cat experience" value={d.petExperience} wide />
            <Field label="Surrender history" value={d.surrenderHistory} wide />
          </Section>

          <Section title="Lifestyle">
            <Field label="Work schedule" value={d.workSchedule ? (WORK_LABELS[d.workSchedule] ?? d.workSchedule) : null} />
            <Field label="Hours alone per day" value={d.hoursAlone} />
            <Field label="Typical day" value={d.typicalDay} wide />
            <Field label="Sleep location" value={d.sleepLocation ? (SLEEP_LABELS[d.sleepLocation] ?? d.sleepLocation) : null} />
            <Field label="Vacation care" value={d.vacationCare} wide />
          </Section>

          <Section title="Veterinary Reference">
            <Field label="Veterinarian" value={d.vetName} />
            <Field label="Clinic" value={d.vetClinic} />
            <Field label="Vet phone" value={d.vetPhone} />
            <Field label="May contact vet" value={d.vetContactOk === "true" ? "Yes" : "No"} />
          </Section>

          <Section title="Agreement">
            <Field label="Electronic signature" value={d.signature} wide />
          </Section>
        </div>

      </div>
    </div>
  );
}
