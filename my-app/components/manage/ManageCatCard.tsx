"use client";

import { useState } from "react";
import { Pet, PetType, PetSex, PetStatus, IntakeReason, DispositionReason, AuditLogEntry } from "@/types/types";
import { updatePet, removePet, deletePhoto, getPetAuditLog } from "@/app/admin/manage/cats/actions";
import PetImageInput from "@/components/manage/PetImageInput";
import PetImageManager from "@/components/manage/PetImageManager";

const STATUS_COLORS: Record<PetStatus, string> = {
  "quarantined": "bg-orange-100 text-orange-700",
  "available for adoption": "bg-green-100 text-green-700",
  "pending adoption": "bg-blue-100 text-blue-700",
  "adopted": "bg-gray-100 text-gray-600",
  "deceased": "bg-red-100 text-red-700",
  "reclaimed by owner": "bg-gray-100 text-gray-600",
};

function titleCase(s: string) {
  return s.split(/[\s_]/).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const PET_TYPES: PetType[] = ["cat", "dog", "rabbit", "bird", "small_animal", "reptile", "other"];
const PET_SEXES: PetSex[] = ["male", "female", "unknown"];
const PET_STATUSES: PetStatus[] = ["quarantined", "available for adoption", "pending adoption", "adopted", "deceased", "reclaimed by owner"];
const INTAKE_REASONS: IntakeReason[] = ["stray", "owner_surrender", "transfer", "born_in_care", "other"];
const DISPOSITION_REASONS: DispositionReason[] = ["adopted", "transferred", "returned_to_owner", "deceased", "euthanized", "other"];

const inputCls = "border rounded p-2 w-full text-sm";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

function formatDateTime(dt: string) {
  return new Date(dt).toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

export default function ManageCatCard({ pet }: { pet: Pet }) {
  const [isEditing, setIsEditing] = useState(false);
  const [spayedNeutered, setSpayedNeutered] = useState(pet.spayed_neutered);
  const [hasDisposition, setHasDisposition] = useState(!!pet.disposition_date);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showRemoveForm, setShowRemoveForm] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[] | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);

  async function handleToggleAuditLog() {
    if (showAuditLog) {
      setShowAuditLog(false);
      return;
    }
    setShowAuditLog(true);
    if (auditLog === null) {
      setAuditLoading(true);
      const entries = await getPetAuditLog(pet.id);
      setAuditLog(entries);
      setAuditLoading(false);
    }
  }

  async function handleUpdate(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (imageFile) fd.set("image", imageFile);
    const result = await updatePet(fd);
    setIsPending(false);
    if (result.error) {
      setError(result.error);
    } else {
      setIsEditing(false);
      setImageFile(null);
    }
  }

  async function handleRemove(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = await removePet(fd);
    setIsPending(false);
    if (result.error) setError(result.error);
  }

  function cancelEdit() {
    setIsEditing(false);
    setError(null);
    setImageFile(null);
    setSpayedNeutered(pet.spayed_neutered);
    setHasDisposition(!!pet.disposition_date);
  }

  if (!isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        {pet.primary_image_url ? (
          <img src={pet.primary_image_url} alt={pet.name} className="w-full h-64 object-cover" />
        ) : (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-5xl text-gray-300">🐾</div>
        )}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h2 className="text-xl font-bold">{pet.name}</h2>
            <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_COLORS[pet.status]}`}>
              {titleCase(pet.status)}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">{titleCase(pet.pet_type)}{pet.breed ? ` · ${pet.breed}` : ""}</p>
          <p className="text-sm text-gray-500 mb-1">{titleCase(pet.sex)}{pet.age ? ` · ${pet.age}` : ""}</p>
          <p className="text-sm text-gray-500 mb-1">Intake: {formatDate(pet.intake_date)}</p>
          <p className="text-sm text-gray-500 mb-3">{pet.spayed_neutered ? "✓ Spayed/Neutered" : "Not spayed/neutered"}</p>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {showRemoveForm ? (
            <form onSubmit={handleRemove} className="mt-auto">
              <input type="hidden" name="id" value={pet.id} />
              <p className="text-sm font-medium text-gray-700 mb-2">Record disposition for {pet.name}</p>
              <div className="flex flex-col gap-2">
                <div>
                  <label className={labelCls}>Disposition Date *</label>
                  <input name="disposition_date" type="date" required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Disposition Reason *</label>
                  <select name="disposition_reason" required defaultValue="" className={inputCls}>
                    <option value="" disabled>Select reason</option>
                    {DISPOSITION_REASONS.map((r) => (
                      <option key={r} value={r}>{titleCase(r)}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 mt-1">
                  <button type="submit" disabled={isPending}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50">
                    {isPending ? "Saving…" : "Confirm Remove"}
                  </button>
                  <button type="button" onClick={() => { setShowRemoveForm(false); setError(null); }}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="mt-auto flex flex-col gap-2">
              {!(pet.disposition_date && pet.disposition_reason) && (
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600">
                    Edit
                  </button>
                  <button onClick={() => setShowRemoveForm(true)}
                    className="flex-1 border border-red-300 text-red-600 px-3 py-2 rounded text-sm hover:bg-red-50">
                    Remove
                  </button>
                </div>
              )}
              {!(pet.disposition_date && pet.disposition_reason) && (
                <PetImageManager petId={pet.id} />
              )}
              <button onClick={handleToggleAuditLog}
                className="w-full border border-gray-200 text-gray-500 px-3 py-2 rounded text-sm hover:bg-gray-50">
                {showAuditLog ? "Hide Audit Log" : "View Audit Log"}
              </button>
            </div>
          )}
          {showAuditLog && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              {auditLoading ? (
                <p className="text-xs text-gray-400 text-center py-2">Loading…</p>
              ) : auditLog && auditLog.length > 0 ? (
                <ul className="space-y-2 max-h-48 overflow-y-auto">
                  {auditLog.map((entry) => (
                    <li key={entry.id} className="text-xs text-gray-600 border-l-2 border-gray-200 pl-2">
                      <p className="font-medium text-gray-800">{entry.description}</p>
                      <p className="text-gray-400">
                        {formatDateTime(entry.date_time)}
                        {entry.user_name ? ` · ${entry.user_name}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 text-center py-2">No audit entries found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-full bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Editing: {pet.name}</h2>
      <form onSubmit={handleUpdate}>
        <input type="hidden" name="id" value={pet.id} />

        <div className="mb-4">
          <label className={labelCls}>Photo</label>
          <PetImageInput
            currentImageUrl={pet.primary_image_url}
            onChange={(f) => setImageFile(f)}
            onDelete={async () => {
              const result = await deletePhoto(pet.id);
              if (result.error) setError(result.error);
            }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input name="name" required defaultValue={pet.name} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Status *</label>
            <select name="status" defaultValue={pet.status} className={inputCls}>
              {PET_STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Type *</label>
            <select name="pet_type" defaultValue={pet.pet_type} className={inputCls}>
              {PET_TYPES.map((t) => <option key={t} value={t}>{titleCase(t)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sex *</label>
            <select name="sex" defaultValue={pet.sex} className={inputCls}>
              {PET_SEXES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Breed</label>
            <input name="breed" defaultValue={pet.breed ?? ""} className={inputCls} placeholder="e.g. Domestic Shorthair" />
          </div>
          <div>
            <label className={labelCls}>Age</label>
            <input name="age" defaultValue={pet.age ?? ""} className={inputCls} placeholder="e.g. About three months" />
          </div>
          <div>
            <label className={labelCls}>Intake Date *</label>
            <input name="intake_date" type="date" required defaultValue={pet.intake_date} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Intake Reason *</label>
            <select name="intake_reason" defaultValue={pet.intake_reason} className={inputCls}>
              {INTAKE_REASONS.map((r) => <option key={r} value={r}>{titleCase(r)}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer pt-5">
              <input type="checkbox" name="spayed_neutered" value="true"
                checked={spayedNeutered} onChange={(e) => setSpayedNeutered(e.target.checked)} />
              Spayed / Neutered
            </label>
            {spayedNeutered && (
              <div>
                <label className={labelCls}>Spay/Neuter Date</label>
                <input name="spay_neuter_date" type="date" defaultValue={pet.spay_neuter_date ?? ""} className={inputCls} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className={labelCls}>Description</label>
          <textarea name="description" defaultValue={pet.description ?? ""} rows={3} className={inputCls} />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Disposition Date</label>
            <input name="disposition_date" type="date" defaultValue={pet.disposition_date ?? ""}
              onChange={(e) => setHasDisposition(!!e.target.value)} className={inputCls} />
          </div>
          {hasDisposition && (
            <div>
              <label className={labelCls}>Disposition Reason *</label>
              <select name="disposition_reason" defaultValue={pet.disposition_reason ?? ""} className={inputCls}>
                <option value="">Select reason</option>
                {DISPOSITION_REASONS.map((r) => <option key={r} value={r}>{titleCase(r)}</option>)}
              </select>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={isPending}
            className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:opacity-50">
            {isPending ? "Saving…" : "Save Changes"}
          </button>
          <button type="button" onClick={cancelEdit}
            className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
