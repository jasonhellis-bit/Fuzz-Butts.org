export default function MissionStatement() {
  return (
    <section className="flex flex-col gap-6 h-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Our Mission</p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Every cat deserves a safe, loving home.
      </h2>
      <p className="text-base leading-7 text-slate-600">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
        ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <p className="text-base leading-7 text-slate-600">
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
        nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
        deserunt mollit anim id est laborum.
      </p>
      <a
        href="/adopt"
        className="inline-block self-start rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
      >
        Meet our cats
      </a>
    </section>
  );
}
