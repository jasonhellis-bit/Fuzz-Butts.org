import { PawPrint, Cross, House, Users } from "lucide-react";
import IconRing from "@/components/ui/IconRing";

const pillars = [
  { icon: PawPrint, title: "Rescue", text: "Saving cats from unsafe situations." },
  { icon: Cross, title: "Rehabilitate", text: "Providing medical care, love and time." },
  { icon: House, title: "Rehome", text: "Finding forever homes for every cat." },
  { icon: Users, title: "Community", text: "Building a kinder world for cats." },
];

export default function Pillars() {
  return (
    <section className="border-y border-line bg-surface/70">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-6 py-12 sm:px-10 lg:grid-cols-4 lg:divide-x lg:divide-line">
        {pillars.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex flex-col items-center px-4 text-center">
            <IconRing size="lg">
              <Icon aria-hidden="true" />
            </IconRing>
            <h3 className="mt-4 text-2xl font-bold text-brand">{title}</h3>
            <p className="mt-1 max-w-[14rem] text-ink-muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
