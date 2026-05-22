"use client";

export default function FuzzButtsBanner() {
  return (
    <div className="bg-white/90 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center gap-6">
          <div className="flex-shrink-0 max-w-xs md:max-w-sm lg:max-w-md">
            <img
              src="/fuzz_butts_banner_large.jpeg"
              alt="Fuzz Butts Banner"
              className="w-full rounded-xl object-cover"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
