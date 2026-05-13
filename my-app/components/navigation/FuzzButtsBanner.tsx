"use client";

export default function FuzzButtsBanner() {
  return (
    <div className="bg-white/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-6">
          <div className="flex-1 text-left">
            <h1 className="block text-5xl md:text-7xl font-black uppercase tracking-tight leading-tight text-transparent bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 bg-clip-text drop-shadow-[0_12px_30px_rgba(124,58,237,0.18)]">
              Fuzz Butts
            </h1>
            <p className="mt-2 text-sm md:text-base font-semibold text-slate-600">
              Cute cats, playful vibes, and a whole lot of fluff.
            </p>
          </div>
          <div className="flex-shrink-0 max-w-xs md:max-w-sm lg:max-w-md ml-auto translate-x-4">
            <img
              src="/fuzz_butts_banner.jpeg"
              alt="Fuzz Butts Banner"
              className="w-full rounded-xl object-cover shadow-lg"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
