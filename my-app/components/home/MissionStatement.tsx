export default function MissionStatement() {
  return (
    <section className="flex flex-col gap-6 h-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-sm">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
        Our Mission
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Every cat deserves a safe, loving home.
      </h2>
      <p className="text-base leading-7 text-slate-600">
        When you open your heart and home to a cat, you gain far more than a pet
        — you gain a companion who will curl up beside you on hard days, greet
        you with quiet curiosity, and fill your space with warmth. Cats thrive
        when they feel secure, nurtured, and loved, and with the right care,
        they will return that love tenfold throughout their lives.
      </p>
      <p className="text-base leading-7 text-slate-600">
        Millions of cats wait in shelters each year, hoping for a family to call
        their own. By choosing to adopt, you're not just giving one cat a second
        chance — you're making room for another to be saved. Together, we can
        build a community where no cat is left without the comfort and care it
        deserves.
      </p>
      <a
        href="/adopt"
        className="inline-block self-start rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700 transition-colors">
        Meet our cats
      </a>
    </section>
  );
}
