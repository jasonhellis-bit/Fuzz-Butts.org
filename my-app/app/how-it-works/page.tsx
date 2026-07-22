import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, ShieldCheck, Home as HomeIcon, Heart, PawPrint } from "lucide-react";

export const metadata: Metadata = {
  title: "How Adoption Works",
  description:
    "Here's what to expect when you adopt a cat from Fuzz Butts, from application to move-in day.",
};

const steps = [
  {
    icon: ClipboardList,
    title: "Fill Out an Application",
    description:
      "Tell us about your home and lifestyle on our online adoption application. It only takes a few minutes.",
  },
  {
    icon: ShieldCheck,
    title: "We Check References",
    description:
      "Our team reaches out to your references and, if needed, confirms with your landlord that pets are allowed in your home.",
  },
  {
    icon: HomeIcon,
    title: "Meet & Greet at Home",
    description:
      "We bring the cat to you for a meet and greet, so everyone — including any current pets — can get acquainted in a comfortable, familiar space.",
  },
  {
    icon: Heart,
    title: "It's a Match",
    description:
      "If everything goes well, the adoption is finalized and the cat stays with you. If it's not quite the right fit, we take the cat back — no pressure, no penalty.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 text-lg font-bold text-blue-600 sm:text-xl">
          <PawPrint size={20} className="shrink-0 fill-orange-500 text-orange-500" /> How It Works
        </span>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          From Application to Adoption
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-slate-600">
          Adopting a cat from Fuzz Butts is simple and personal. Here&apos;s exactly what happens
          from the moment you apply to the day your new best friend comes home.
        </p>
      </div>

      <ol className="mt-14 flex flex-col gap-6">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="flex flex-col items-start gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <step.icon size={26} />
              </span>
              <span className="text-sm font-semibold text-slate-400">Step {i + 1}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{step.title}</h2>
              <p className="mt-1.5 leading-7 text-slate-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-xl shadow-slate-200/50">
        <h2 className="text-2xl font-bold text-slate-900">Ready to meet your new best friend?</h2>
        <p className="max-w-md text-slate-600">
          Browse our adoptable cats and start your application today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/adopt"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600">
            <PawPrint size={18} /> Browse Adoptable Cats
          </Link>
          <Link
            href="/adopt/apply"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50">
            <ClipboardList size={18} /> Start an Application
          </Link>
        </div>
      </div>
    </div>
  );
}
