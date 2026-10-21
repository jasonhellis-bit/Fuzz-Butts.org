import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import HeartDoodle from "@/components/ui/HeartDoodle";
import SectionHeading from "@/components/ui/SectionHeading";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Support Fuzz Butts Cat Rescue with a donation to help provide food, shelter, and medical care for cats in need.",
};

const methods = [
  { name: "PayPal", href: "https://www.paypal.com/donate/?hosted_button_id=P2HJJE69NEKRG" },
  { name: "Cash App", href: "https://cash.app/$FuzzButtsInc" },
  { name: "Square", href: "https://square.link/u/vfh7G103?src=sheet" },
];

export default function DonatePage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-16">
      <SectionHeading as="h1" size="lg" className="mb-6 text-center">
        Donate to the Shelter
      </SectionHeading>
      <p className="text-lg leading-8 text-ink mb-4 max-w-2xl text-center">
        Your donation helps us provide food, shelter, and medical care to our
        furry friends in need. Every contribution, big or small, makes a
        difference in the lives of these animals. Thank you for your generosity
        and support!
      </p>
      <p className="font-script text-4xl text-gold-deep mb-10">Small Butts. Big Impact.</p>

      <div className="grid w-full max-w-4xl gap-6 grid-cols-1 sm:grid-cols-3">
        {methods.map((m) => (
          <a
            key={m.name}
            href={m.href}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative flex flex-col items-center gap-5 rounded-2xl border border-line bg-surface px-6 py-10 text-center shadow-sm shadow-ink/5 transition hover:-translate-y-1 hover:border-gold hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/50">
            <HeartDoodle className="absolute right-4 top-4 h-6 w-6 text-gold" />
            <span className="font-display text-4xl font-bold text-brand">{m.name}</span>
            <span className={`${buttonClasses("primary", "sm")} group-hover:bg-brand-dark`}>
              Donate with {m.name} <ChevronRight size={14} aria-hidden="true" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
