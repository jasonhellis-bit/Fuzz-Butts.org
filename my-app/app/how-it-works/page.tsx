import type { Metadata } from "next";
import { ClipboardList, ShieldCheck, Home as HomeIcon, Heart, PawPrint } from "lucide-react";
import Button from "@/components/ui/Button";
import HeartDoodle from "@/components/ui/HeartDoodle";
import IconRing from "@/components/ui/IconRing";

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
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-deep">
          <PawPrint size={16} className="shrink-0" aria-hidden="true" /> How It Works
        </span>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-brand sm:text-5xl">
          From Application to Adoption
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-ink">
          Adopting a cat from Fuzz Butts is simple and personal. Here&apos;s exactly what happens
          from the moment you apply to the day your new best friend comes home.
        </p>
      </div>

      <ol className="mt-14 flex flex-col gap-6">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="flex flex-col items-start gap-5 rounded-2xl border border-line bg-surface p-6 shadow-sm shadow-ink/5 sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:gap-2">
              <IconRing>
                <step.icon aria-hidden="true" />
              </IconRing>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-deep">Step {i + 1}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand">{step.title}</h2>
              <p className="mt-1.5 leading-7 text-ink">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 flex flex-col items-center gap-4 rounded-2xl bg-brand-dark p-10 text-center text-white shadow-lg">
        <h2 className="flex items-center gap-2 text-3xl font-bold">
          Ready to meet your new best friend?
          <HeartDoodle className="h-8 w-8 shrink-0 text-gold" />
        </h2>
        <p className="max-w-md text-white/85">
          Browse our adoptable cats and start your application today.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Button href="/adopt" className="bg-white text-brand hover:bg-cream">
            <PawPrint size={18} aria-hidden="true" /> Browse Adoptable Cats
          </Button>
          <Button href="/adopt/apply" variant="onDark">
            <ClipboardList size={18} aria-hidden="true" /> Start an Application
          </Button>
        </div>
      </div>
    </div>
  );
}
