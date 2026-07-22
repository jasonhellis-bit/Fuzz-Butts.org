"use client";

import { useState } from "react";
import Link from "next/link";
import { submitApplication } from "@/actions/applicationActions";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const inputClass =
  "border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors w-full";
const textareaClass = `${inputClass} resize-none`;
const selectClass = `${inputClass} bg-white`;

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-2">
      <span className="text-2xl">{icon}</span>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
  );
}

function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <p className="text-xs text-gray-400 -mt-0.5">{hint}</p>}
      {children}
    </div>
  );
}

function CheckField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600"
      />
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-snug">
        {label}
      </span>
    </label>
  );
}

export default function AdoptionApplicationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Applicant info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  // Household
  const [adultsInHome, setAdultsInHome] = useState("");
  const [childrenInHome, setChildrenInHome] = useState("none");
  const [childrenAges, setChildrenAges] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentPetCount, setCurrentPetCount] = useState("0");
  const [currentPetsDetails, setCurrentPetsDetails] = useState("");

  // Housing
  const [ownOrRent, setOwnOrRent] = useState("");
  const [homeType, setHomeType] = useState("");
  const [hasYard, setHasYard] = useState("");
  const [fencingDetails, setFencingDetails] = useState("");
  const [landlordPermission, setLandlordPermission] = useState(false);

  // Pet care experience
  const [previousPets, setPreviousPets] = useState("");
  const [petExperience, setPetExperience] = useState("");
  const [surrenderHistory, setSurrenderHistory] = useState("");

  // Lifestyle
  const [workSchedule, setWorkSchedule] = useState("");
  const [hoursAlone, setHoursAlone] = useState("");
  const [typicalDay, setTypicalDay] = useState("");
  const [sleepLocation, setSleepLocation] = useState("");
  const [vacationCare, setVacationCare] = useState("");

  // Vet reference
  const [vetName, setVetName] = useState("");
  const [vetClinic, setVetClinic] = useState("");
  const [vetPhone, setVetPhone] = useState("");
  const [vetContactOk, setVetContactOk] = useState(false);

  // Agreement
  const [infoAccurate, setInfoAccurate] = useState(false);
  const [refConsent, setRefConsent] = useState(false);
  const [signature, setSignature] = useState("");

  function validate() {
    const errs: string[] = [];
    if (!firstName.trim()) errs.push("First name is required.");
    if (!lastName.trim()) errs.push("Last name is required.");
    if (!email.trim()) errs.push("Email address is required.");
    if (!phone.trim()) errs.push("Phone number is required.");
    if (!ageConfirmed) errs.push("You must confirm you are 18 years of age or older.");
    if (!ownOrRent) errs.push("Please indicate whether you own or rent your home.");
    if (!infoAccurate) errs.push("You must certify that the information provided is accurate.");
    if (!refConsent) errs.push("You must consent to reference and background checks.");
    if (!signature.trim()) errs.push("Please provide your electronic signature.");
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors([]);
    setSubmitting(true);

    const payload: Record<string, unknown> = {
      firstName, lastName, address, city, state: stateName, zip,
      phone, email, ageConfirmed,
      adultsInHome, childrenInHome, childrenAges, allergies,
      currentPetCount, currentPetsDetails,
      ownOrRent, homeType, hasYard, fencingDetails, landlordPermission,
      previousPets, petExperience, surrenderHistory,
      workSchedule, hoursAlone, typicalDay, sleepLocation, vacationCare,
      vetName, vetClinic, vetPhone, vetContactOk,
      signature,
    };

    const result = await submitApplication(payload);
    setSubmitting(false);

    if (result.error) {
      setErrors(["We were unable to submit your application. Please try again or contact us directly."]);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-start justify-center px-4 pt-16 pb-16">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-10 text-center">
          <div className="text-5xl mb-4">🐾</div>
          <h1 className="text-2xl font-bold mb-3">Application Received!</h1>
          <p className="text-gray-500 mb-2">
            Thank you for applying to adopt, {firstName}!
          </p>
          <p className="text-gray-500 mb-6">
            We&apos;ll review your application and reach out to{" "}
            <span className="font-medium text-gray-700">{email}</span> within a
            few business days.
          </p>
          <Link
            href="/adopt"
            className="inline-block bg-blue-600 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors">
            Back to Adoptable Cats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Page header */}
      <div className="bg-blue-600 text-white px-4 py-10 text-center">
        <div className="text-4xl mb-3">🐾</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Adoption Application</h1>
        <p className="text-blue-100 max-w-xl mx-auto text-sm md:text-base">
          We want to make sure every cat finds a safe, loving forever home. Please fill out this
          form completely and honestly — there are no wrong answers!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="max-w-3xl mx-auto px-4 mt-8 flex flex-col gap-6">

        {/* Error summary */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 mb-2">
              Please fix the following before submitting:
            </p>
            <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 1: Applicant Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <SectionHeader icon="👤" title="Applicant Information" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="First Name" required>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
                placeholder="Jane"
              />
            </Field>
            <Field label="Last Name" required>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
                placeholder="Smith"
              />
            </Field>
          </div>

          <Field label="Street Address">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
              placeholder="123 Main St"
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="City">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
                placeholder="Springfield"
              />
            </Field>
            <Field label="State">
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                className={inputClass}
                placeholder="IL"
                maxLength={2}
              />
            </Field>
            <Field label="ZIP Code">
              <input
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className={inputClass}
                placeholder="62701"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Phone" required>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className={inputClass}
                placeholder="(555) 555-5555"
              />
            </Field>
            <Field label="Email" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="jane@example.com"
              />
            </Field>
          </div>

          <CheckField
            id="ageConfirmed"
            label="I confirm that I am 18 years of age or older."
            checked={ageConfirmed}
            onChange={setAgeConfirmed}
          />
        </div>

        {/* Section 2: Household Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <SectionHeader icon="🏠" title="Household Details" />

          <Field label="Number of adults living in the home" required>
            <select
              value={adultsInHome}
              onChange={(e) => setAdultsInHome(e.target.value)}
              className={selectClass}>
              <option value="">Select…</option>
              {["1", "2", "3", "4", "5+"].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>

          <Field label="Are there children in the home?">
            <select
              value={childrenInHome}
              onChange={(e) => setChildrenInHome(e.target.value)}
              className={selectClass}>
              <option value="none">No children</option>
              <option value="yes">Yes</option>
            </select>
          </Field>

          {childrenInHome === "yes" && (
            <Field label="Ages of children in the home">
              <input
                type="text"
                value={childrenAges}
                onChange={(e) => setChildrenAges(e.target.value)}
                className={inputClass}
                placeholder="e.g. 4, 7, 12"
              />
            </Field>
          )}

          <Field
            label="Does anyone in the home have pet allergies?"
            hint="If yes, please explain how you plan to manage this.">
            <textarea
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className={textareaClass}
              rows={2}
              placeholder="No allergies in our home."
            />
          </Field>

          <Field label="How many pets do you currently have?">
            <select
              value={currentPetCount}
              onChange={(e) => setCurrentPetCount(e.target.value)}
              className={selectClass}>
              {["0", "1", "2", "3", "4", "5+"].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>

          {currentPetCount !== "0" && (
            <Field
              label="Tell us about your current pets"
              hint="Species, age, spayed/neutered status, etc.">
              <textarea
                value={currentPetsDetails}
                onChange={(e) => setCurrentPetsDetails(e.target.value)}
                className={textareaClass}
                rows={3}
                placeholder="Two cats, ages 3 and 5, both spayed/neutered."
              />
            </Field>
          )}
        </div>

        {/* Section 3: Housing Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <SectionHeader icon="🏡" title="Housing Information" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Do you own or rent?" required>
              <select
                value={ownOrRent}
                onChange={(e) => setOwnOrRent(e.target.value)}
                className={selectClass}>
                <option value="">Select…</option>
                <option value="own">Own</option>
                <option value="rent">Rent</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="Type of home">
              <select
                value={homeType}
                onChange={(e) => setHomeType(e.target.value)}
                className={selectClass}>
                <option value="">Select…</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo / Townhouse</option>
                <option value="mobile_home">Mobile Home</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          {ownOrRent === "rent" && (
            <CheckField
              id="landlordPermission"
              label="My landlord permits cats in the home."
              checked={landlordPermission}
              onChange={setLandlordPermission}
            />
          )}

          <Field label="Do you have a yard?">
            <select
              value={hasYard}
              onChange={(e) => setHasYard(e.target.value)}
              className={selectClass}>
              <option value="">Select…</option>
              <option value="no">No yard</option>
              <option value="yes_unfenced">Yes, unfenced</option>
              <option value="yes_fenced">Yes, fully fenced</option>
              <option value="yes_partial">Yes, partially fenced</option>
            </select>
          </Field>

          {hasYard && hasYard !== "no" && (
            <Field
              label="Fencing details"
              hint="Type of fencing, height, any gaps or concerns.">
              <textarea
                value={fencingDetails}
                onChange={(e) => setFencingDetails(e.target.value)}
                className={textareaClass}
                rows={2}
                placeholder="6-foot privacy fence, no gaps."
              />
            </Field>
          )}
        </div>

        {/* Section 4: Pet Care Experience */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <SectionHeader icon="🐾" title="Pet Care Experience" />

          <Field
            label="Tell us about pets you've owned in the past"
            hint="Species, how long you had them, and what happened to them.">
            <textarea
              value={previousPets}
              onChange={(e) => setPreviousPets(e.target.value)}
              className={textareaClass}
              rows={3}
              placeholder="We had a tabby cat named Felix for 15 years. He passed away from old age in 2022."
            />
          </Field>

          <Field
            label="Do you have experience with cats specifically?"
            hint="Indoor only, outdoor, special needs, kittens, seniors, etc.">
            <textarea
              value={petExperience}
              onChange={(e) => setPetExperience(e.target.value)}
              className={textareaClass}
              rows={3}
              placeholder="I've had cats my whole life and am comfortable with their care, including administering medication."
            />
          </Field>

          <Field
            label="Have you ever had to surrender or rehome a pet?"
            hint="If yes, please explain the circumstances.">
            <textarea
              value={surrenderHistory}
              onChange={(e) => setSurrenderHistory(e.target.value)}
              className={textareaClass}
              rows={2}
              placeholder="No, I've never had to surrender a pet."
            />
          </Field>
        </div>

        {/* Section 5: Lifestyle */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <SectionHeader icon="☀️" title="Lifestyle Questions" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Work schedule">
              <select
                value={workSchedule}
                onChange={(e) => setWorkSchedule(e.target.value)}
                className={selectClass}>
                <option value="">Select…</option>
                <option value="work_from_home">Work from home</option>
                <option value="office_full_time">Office full-time</option>
                <option value="hybrid">Hybrid schedule</option>
                <option value="part_time">Part-time / flexible</option>
                <option value="retired">Retired / stay at home</option>
                <option value="other">Other</option>
              </select>
            </Field>

            <Field label="How long will the cat be home alone on a typical day?">
              <select
                value={hoursAlone}
                onChange={(e) => setHoursAlone(e.target.value)}
                className={selectClass}>
                <option value="">Select…</option>
                <option value="0-2">0–2 hours</option>
                <option value="2-4">2–4 hours</option>
                <option value="4-6">4–6 hours</option>
                <option value="6-8">6–8 hours</option>
                <option value="8+">8+ hours</option>
              </select>
            </Field>
          </div>

          <Field
            label="What does a typical day look like for the cat?"
            hint="Feeding schedule, enrichment, playtime, etc.">
            <textarea
              value={typicalDay}
              onChange={(e) => setTypicalDay(e.target.value)}
              className={textareaClass}
              rows={3}
              placeholder="Morning play session, feedings twice a day, evening cuddle time on the couch."
            />
          </Field>

          <Field label="Where will the cat sleep?">
            <select
              value={sleepLocation}
              onChange={(e) => setSleepLocation(e.target.value)}
              className={selectClass}>
              <option value="">Select…</option>
              <option value="anywhere">Anywhere they choose</option>
              <option value="bedroom">In the bedroom</option>
              <option value="own_bed">Their own bed / cat furniture</option>
              <option value="restricted">Restricted to certain rooms</option>
            </select>
          </Field>

          <Field label="What happens to the cat when you travel or go on vacation?">
            <textarea
              value={vacationCare}
              onChange={(e) => setVacationCare(e.target.value)}
              className={textareaClass}
              rows={2}
              placeholder="A trusted friend cat-sits, or we use a professional pet sitter."
            />
          </Field>
        </div>

        {/* Section 6: Veterinary Reference */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <SectionHeader icon="🩺" title="Veterinary Reference" />
          <p className="text-sm text-gray-400 -mt-2">
            If you&apos;ve never owned a pet, leave this section blank.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Veterinarian Name">
              <input
                type="text"
                value={vetName}
                onChange={(e) => setVetName(e.target.value)}
                className={inputClass}
                placeholder="Dr. Sarah Johnson"
              />
            </Field>
            <Field label="Clinic / Practice Name">
              <input
                type="text"
                value={vetClinic}
                onChange={(e) => setVetClinic(e.target.value)}
                className={inputClass}
                placeholder="Springfield Animal Hospital"
              />
            </Field>
          </div>

          <Field label="Veterinarian Phone">
            <input
              type="tel"
              value={vetPhone}
              onChange={(e) => setVetPhone(formatPhone(e.target.value))}
              className={inputClass}
              placeholder="(555) 555-5555"
            />
          </Field>

          <CheckField
            id="vetContactOk"
            label="I give Fuzz Butts permission to contact my veterinarian as part of the adoption process."
            checked={vetContactOk}
            onChange={setVetContactOk}
          />
        </div>

        {/* Section 7: Agreement & Consent */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <SectionHeader icon="✍️" title="Agreement & Consent" />

          <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 leading-relaxed">
            <p className="font-semibold mb-1">Adoption Agreement</p>
            <p>
              By submitting this application, you agree to provide a safe, loving, and permanent
              home for the adopted animal. You understand that Fuzz Butts Inc. reserves the right
              to deny any application and may conduct home visits or reference checks as part of
              the review process. Misrepresentation of any information may result in the immediate
              return of the adopted animal.
            </p>
          </div>

          <CheckField
            id="infoAccurate"
            label="I certify that all information provided in this application is true and accurate to the best of my knowledge."
            checked={infoAccurate}
            onChange={setInfoAccurate}
          />

          <CheckField
            id="refConsent"
            label="I consent to Fuzz Butts Inc. contacting my references and conducting checks as part of this application."
            checked={refConsent}
            onChange={setRefConsent}
          />

          <Field
            label="Electronic Signature"
            hint="Type your full legal name to serve as your electronic signature."
            required>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className={inputClass}
              placeholder="Jane Smith"
            />
          </Field>

          <div className="pt-2 border-t border-gray-100 mt-2">
            <p className="text-xs text-gray-400 mb-4">
              Date:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white rounded-lg py-3 text-base font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Questions?{" "}
              <a href="mailto:fuzzbuttinc@gmail.com" className="text-blue-500 hover:underline">
                fuzzbuttinc@gmail.com
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
