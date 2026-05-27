"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setFeatured, endFeatured } from "@/app/admin/manage/featured/actions";

export interface CurrentFeatured {
  id: string;
  start_date: string;
  end_date: string | null;
  pet_name: string;
  pet_breed: string | null;
  pet_image_url: string | null;
}

export interface SelectablePet {
  id: string;
  name: string;
  breed: string | null;
  pet_type: string;
}

function titleCase(s: string) {
  return s.split(/[\s_]/).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const inputCls = "border rounded p-2 w-full text-sm";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export default function FeaturedManager({ current, pets }: { current: CurrentFeatured | null; pets: SelectablePet[] }) {
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const today = new Date().toISOString().split("T")[0];

  async function handleEnd() {
    if (!current) return;
    setIsPending(true);
    const result = await endFeatured(current.id);
    setIsPending(false);
    if (result.error) setError(result.error);
    else { setConfirmEnd(false); router.refresh(); }
  }

  async function handleSet(e: { currentTarget: HTMLFormElement; preventDefault(): void }) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    const result = await setFeatured(new FormData(e.currentTarget));
    setIsPending(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">

      {/* Currently featured */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Currently Featured</h2>
        {current ? (
          <div className="flex items-center gap-4">
            {current.pet_image_url ? (
              <img src={current.pet_image_url} alt={current.pet_name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">🐾</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{current.pet_name}</p>
              {current.pet_breed && <p className="text-sm text-gray-500">{current.pet_breed}</p>}
              <p className="text-xs text-gray-400 mt-1">
                Since {formatDate(current.start_date)}
                {current.end_date ? ` · Until ${formatDate(current.end_date)}` : " · Open-ended"}
              </p>
            </div>
            {confirmEnd ? (
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={handleEnd} disabled={isPending}
                  className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 disabled:opacity-50">
                  {isPending ? "Ending…" : "Confirm"}
                </button>
                <button onClick={() => setConfirmEnd(false)}
                  className="border border-gray-300 px-3 py-1.5 rounded text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmEnd(true)}
                className="flex-shrink-0 border border-gray-300 px-3 py-1.5 rounded text-sm hover:bg-gray-50">
                End Feature
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No pet is currently featured.</p>
        )}
      </div>

      {/* Set new featured */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {current ? "Change Featured Pet" : "Set Featured Pet"}
        </h2>
        {pets.length === 0 ? (
          <p className="text-sm text-gray-500">
            No pets available to feature. Add pets with &quot;available&quot; or &quot;pending adoption&quot; status first.
          </p>
        ) : (
          <form onSubmit={handleSet} className="flex flex-col gap-4">
            <div>
              <label className={labelCls}>Pet *</label>
              <select name="pet_id" required className={inputCls}>
                <option value="">Select a pet…</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.breed ? ` · ${p.breed}` : ""} ({titleCase(p.pet_type)})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Start Date *</label>
                <input name="start_date" type="date" required defaultValue={today} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>End Date</label>
                <input name="end_date" type="date" className={inputCls} />
              </div>
            </div>
            {current && (
              <p className="text-xs text-gray-400">
                This will remove the current feature for {current.pet_name}.
              </p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={isPending}
              className="self-start bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600 disabled:opacity-50">
              {isPending ? "Saving…" : current ? "Change Featured Pet" : "Set Featured Pet"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
