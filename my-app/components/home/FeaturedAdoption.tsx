export interface FeaturedPet {
  name: string;
  breed: string | null;
  sex: string;
  description: string | null;
  primary_image_url: string | null;
}

function titleCase(s: string) {
  return s.split(/[\s_]/).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default function FeaturedAdoption({ pet }: { pet: FeaturedPet | null }) {
  if (!pet) {
    return (
      <section className="w-full max-w-5xl h-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Featured Adoption</p>
          <div className="mt-6 text-6xl">🐾</div>
          <p className="mt-4 text-lg text-slate-500">Check back soon for our next featured adoption.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-5xl h-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Featured Adoption
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Meet {pet.name}
        </h1>
        {pet.primary_image_url ? (
          <img
            src={pet.primary_image_url}
            alt={pet.name}
            className="mx-auto mt-6 w-48 h-48 sm:w-72 sm:h-72 rounded-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="mx-auto mt-6 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-slate-100 flex items-center justify-center text-6xl">
            🐾
          </div>
        )}
        {pet.description && (
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg line-clamp-4">
            {pet.description}
          </p>
        )}
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-center">
        <div className="rounded-2xl bg-slate-100 p-4 text-left sm:w-1/2">
          <p className="text-sm font-semibold text-slate-700">Breed</p>
          <p className="mt-2 text-lg text-slate-900">{pet.breed ?? "Unknown"}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-4 text-left sm:w-1/2">
          <p className="text-sm font-semibold text-slate-700">Sex</p>
          <p className="mt-2 text-lg text-slate-900">{titleCase(pet.sex)}</p>
        </div>
      </div>
    </section>
  );
}
