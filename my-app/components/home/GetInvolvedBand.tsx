import { Heart, HeartHandshake, Mail, PawPrint } from "lucide-react";
import Button from "@/components/ui/Button";
import HeartDoodle from "@/components/ui/HeartDoodle";

const actions = [
  {
    icon: Heart,
    title: "Donate",
    text: "Help fund medical care, food and shelter.",
    cta: "Donate Now",
    href: "/donate",
  },
  {
    icon: HeartHandshake,
    title: "Adopt",
    text: "See what to expect from application to move-in day.",
    cta: "How It Works",
    href: "/how-it-works",
  },
  {
    icon: Mail,
    title: "Contact",
    text: "Have a question? We'd love to hear from you.",
    cta: "Get in Touch",
    href: "/contact",
  },
];

export default function GetInvolvedBand() {
  return (
    <section className="bg-brand-dark text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="flex items-center justify-center gap-5 lg:justify-start">
          <PawPrint className="hidden h-16 w-16 shrink-0 rotate-[-15deg] fill-gold text-gold sm:block" aria-hidden="true" />
          <p className="font-script text-6xl leading-[0.9] sm:text-7xl">
            Small Butts.
            <br />
            <span className="inline-flex items-end gap-2 pl-10">
              Big Impact.
              <HeartDoodle className="h-14 w-14 text-gold" strokeWidth={1.5} />
            </span>
          </p>
        </div>

        <ul className="grid gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-gold/40">
          {actions.map(({ icon: Icon, title, text, cta, href }) => (
            <li key={title} className="flex flex-col items-center px-4 text-center">
              <Icon className="h-10 w-10 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="mt-3 text-2xl font-bold">{title}</h3>
              <p className="mt-1 mb-4 max-w-[15rem] text-sm leading-6 text-white/85">{text}</p>
              <Button href={href} variant="onDark" size="sm" chevron className="mt-auto">
                {cta}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
