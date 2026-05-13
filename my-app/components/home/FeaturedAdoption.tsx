"use client";

export default function FeaturedAdoption() {
  return (
    <section className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
      <div className="text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Featured Adoption
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Meet Luna, the playful cat ready for her forever home.
        </h1>
        <img
          src="/cats/luna-1.jpg"
          alt="Luna the cat"
          className="mx-auto mt-6 h-90 w-90 rounded-full object-cover"
          loading="eager"
        />
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          Luna loves walks, cuddles, and making new friends. She&apos;s fully
          vaccinated, litter-trained, and excited to join a loving family.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
        <div className="rounded-2xl bg-slate-100 p-4 text-left sm:w-1/2">
          <p className="text-sm font-semibold text-slate-700">Age</p>
          <p className="mt-2 text-lg text-slate-900">6 months</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-4 text-left sm:w-1/2">
          <p className="text-sm font-semibold text-slate-700">Personality</p>
          <p className="mt-2 text-lg text-slate-900">
            Friendly, energetic, affectionate
          </p>
        </div>
      </div>
    </section>
  );
}
