import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Fuzz Butts Cat Rescue with a donation to help provide food, shelter, and medical care for cats in need.",
};

export default function DonatePage() {
  return (
    <div className="min-h-screen flex flex-col items-center mt-10 px-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8">
        Donate to the Shelter
      </h1>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Your donation helps us provide food, shelter, and medical care to our
        furry friends in need. Every contribution, big or small, makes a
        difference in the lives of these animals. Thank you for your generosity
        and support!
      </p>
      <div className="grid w-full max-w-3xl gap-6 grid-cols-1">
        <a
          href="https://www.paypal.com/donate/?hosted_button_id=P2HJJE69NEKRG"
          target="_blank"
          rel="noreferrer noopener"
          className="flex h-40 sm:h-56 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 px-8 text-white shadow-xl shadow-sky-200 transition hover:scale-[1.01] hover:shadow-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300">
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl sm:text-6xl font-black tracking-tight">
              PayPal
            </div>
            <div className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-lg font-semibold">
              Donate with PayPal
            </div>
          </div>
        </a>

        <a
          href="https://cash.app/$FuzzButtsInc"
          target="_blank"
          rel="noreferrer noopener"
          className="flex h-40 sm:h-56 items-center justify-center rounded-3xl bg-gradient-to-r from-green-700 via-emerald-600 to-lime-500 px-8 text-white shadow-xl shadow-emerald-200 transition hover:scale-[1.01] hover:shadow-emerald-300 focus:outline-none focus:ring-4 focus:ring-emerald-300">
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl sm:text-6xl font-black tracking-tight">
              Cash App
            </div>
            <div className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-lg font-semibold">
              Donate with Cash App
            </div>
          </div>
        </a>

        <a
          href="https://square.link/u/vfh7G103?src=sheet"
          target="_blank"
          rel="noreferrer noopener"
          className="flex h-40 sm:h-56 items-center justify-center rounded-3xl bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-500 px-8 text-white shadow-xl shadow-fuchsia-200 transition hover:scale-[1.01] hover:shadow-fuchsia-300 focus:outline-none focus:ring-4 focus:ring-fuchsia-300">
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl sm:text-6xl font-black tracking-tight">
              Square
            </div>
            <div className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-lg font-semibold">
              Donate with Square
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
