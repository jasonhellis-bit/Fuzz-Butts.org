"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { PetType, PetSex, PetStatus, IntakeReason, DispositionReason } from "@/types/types";
import { createPet } from "@/app/admin/manage/cats/actions";
import PetImageInput from "@/components/manage/PetImageInput";

const PET_TYPES: PetType[] = ["cat", "dog", "rabbit", "bird", "small_animal", "reptile", "other"];
const PET_SEXES: PetSex[] = ["male", "female", "unknown"];
const PET_STATUSES: PetStatus[] = ["quarantined", "available for adoption", "pending adoption", "adopted", "deceased", "reclaimed by owner"];
const INTAKE_REASONS: IntakeReason[] = ["stray", "owner_surrender", "transfer", "born_in_care", "other"];
const DISPOSITION_REASONS: DispositionReason[] = ["adopted", "transferred", "returned_to_owner", "deceased", "euthanized", "other"];

function titleCase(s: string) {
  return s.split(/[\s_]/).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

const inputCls = "border rounded p-2 w-full text-sm";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

const defaultFields = { name: "", breed: "", age: "", weight: "", description: "" };

export default function AddCatCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [spayedNeutered, setSpayedNeutered] = useState(false);
  const [hasDisposition, setHasDisposition] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState(defaultFields);

  function setField(key: keyof typeof defaultFields, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function reset() {
    setIsOpen(false);
    setSpayedNeutered(false);
    setHasDisposition(false);
    setImageFile(null);
    setError(null);
    setFields(defaultFields);
  }

  async function handleAutofill() {
    if (!imageFile) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.set("image", imageFile);
      const res = await fetch("/api/analyze-pet", { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) {
        setError(`AI autofill failed: ${data.error}`);
      } else {
        setFields({
          name: data.name ?? "",
          breed: data.breed ?? "",
          age: data.age ?? "",
          weight: data.weight ?? "",
          description: data.description ?? "",
        });
      }
    } catch {
      setError("AI autofill failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleSubmit(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (imageFile) fd.set("image", imageFile);
    const result = await createPet(fd);
    setIsPending(false);
    if (result.error) {
      setError(result.error);
    } else {
      reset();
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="min-h-[200px] w-full rounded-lg border border-dashed border-gray-300 bg-white p-4 transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Add a pet">
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-6xl font-bold text-blue-600">
            +
          </div>
          <span className="text-lg font-semibold text-gray-700">Add a pet</span>
        </div>
      </button>
    );
  }

  return (
    <div className="col-span-full bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4">Add New Pet</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className={labelCls}>Photo</label>
          <PetImageInput onChange={(f) => setImageFile(f)} />
        </div>

        {imageFile && (
          <div className="mb-4">
            <button
              type="button"
              onClick={handleAutofill}
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700 disabled:opacity-50 transition-colors">
              {isAnalyzing
                ? <Loader2 size={15} className="animate-spin" />
                : <Sparkles size={15} />}
              {isAnalyzing ? "Analyzing photo…" : "Auto-fill with AI"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Name *</label>
            <input
              name="name"
              required
              className={inputCls}
              value={fields.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Status *</label>
            <select name="status" defaultValue="available for adoption" className={inputCls}>
              {PET_STATUSES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Type *</label>
            <select name="pet_type" defaultValue="cat" className={inputCls}>
              {PET_TYPES.map((t) => <option key={t} value={t}>{titleCase(t)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sex *</label>
            <select name="sex" defaultValue="unknown" className={inputCls}>
              {PET_SEXES.map((s) => <option key={s} value={s}>{titleCase(s)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Breed</label>
            <input
              name="breed"
              className={inputCls}
              placeholder="e.g. Domestic Shorthair"
              value={fields.breed}
              onChange={(e) => setField("breed", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Age</label>
            <input
              name="age"
              className={inputCls}
              placeholder="e.g. About three months"
              value={fields.age}
              onChange={(e) => setField("age", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Weight</label>
            <input
              name="weight"
              className={inputCls}
              placeholder="e.g. About 5 lbs"
              value={fields.weight}
              onChange={(e) => setField("weight", e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Intake Date *</label>
            <input name="intake_date" type="date" required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Intake Reason *</label>
            <select name="intake_reason" defaultValue="stray" className={inputCls}>
              {INTAKE_REASONS.map((r) => <option key={r} value={r}>{titleCase(r)}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer pt-5">
              <input
                type="checkbox"
                name="spayed_neutered"
                value="true"
                checked={spayedNeutered}
                onChange={(e) => setSpayedNeutered(e.target.checked)}
              />
              Spayed / Neutered
            </label>
            {spayedNeutered && (
              <div>
                <label className={labelCls}>Spay/Neuter Date</label>
                <input name="spay_neuter_date" type="date" className={inputCls} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            rows={3}
            className={inputCls}
            value={fields.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Disposition Date</label>
            <input
              name="disposition_date"
              type="date"
              onChange={(e) => setHasDisposition(!!e.target.value)}
              className={inputCls}
            />
          </div>
          {hasDisposition && (
            <div>
              <label className={labelCls}>Disposition Reason *</label>
              <select name="disposition_reason" className={inputCls}>
                <option value="">Select reason</option>
                {DISPOSITION_REASONS.map((r) => <option key={r} value={r}>{titleCase(r)}</option>)}
              </select>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50">
            {isPending ? "Adding…" : "Add Pet"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
