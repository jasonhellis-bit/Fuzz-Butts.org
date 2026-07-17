import { Heart, Venus, Mars, Cat, CalendarDays } from "lucide-react";

export interface FeaturedPet {
  id: string;
  name: string;
  breed: string | null;
  sex: string;
  age: string | null;
  description: string | null;
  primary_image_url: string | null;
}

function titleCase(s: string) {
  return s.split(/[\s_]/).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default function FeaturedAdoption({ pet }: { pet: FeaturedPet | null }) {
  if (!pet) {
    return (
      <div className="w-full rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Featured Cat
        </p>
        <div className="mt-6 text-6xl">🐾</div>
        <p className="mt-4 text-slate-500">Check back soon for our next featured adoption.</p>
      </div>
    );
  }

  const isFemale = pet.sex.toLowerCase() === "female";
  const SexIcon = isFemale ? Venus : Mars;

  return (
    <div className="w-full rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-300/40">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
        <Cat size={14} /> Featured Cat
      </span>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">Meet {pet.name}</h2>

      <dl className="mt-4 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5 text-sm text-slate-700">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${isFemale ? "bg-pink-50 text-pink-500" : "bg-blue-50 text-blue-500"}`}>
            <SexIcon size={14} />
          </span>
          {titleCase(pet.sex)}
        </div>
        {pet.breed && (
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-purple-500">
              <Cat size={14} />
            </span>
            {pet.breed}
          </div>
        )}
        {pet.age && (
          <div className="flex items-center gap-2.5 text-sm text-slate-700">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CalendarDays size={14} />
            </span>
            {pet.age}
          </div>
        )}
      </dl>

      {pet.description && (
        <>
          <hr className="my-4 border-slate-100" />
          <p className="text-sm leading-6 text-slate-600 line-clamp-4">{pet.description}</p>
        </>
      )}

      <a
        href="/adopt/apply"
        className="mt-5 flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-500/30 transition-colors hover:bg-orange-600">
        <Heart size={16} className="fill-current" /> Adopt {pet.name}
      </a>
      <a
        href={`/adopt/${pet.id}`}
        className="mt-3 flex items-center justify-center gap-1 text-sm font-medium text-blue-600 hover:underline">
        View {pet.name}&apos;s Profile →
      </a>
    </div>
  );
}
