import { Fragment } from "react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

export interface HomeStats {
  catsRescued: number;
  successfulAdoptions: number;
  availableNow: number;
}

export default function MissionCard({ stats }: { stats: HomeStats }) {
  const statItems = [
    { value: stats.catsRescued, label: "Cats Rescued" },
    ...(stats.successfulAdoptions > 0
      ? [{ value: stats.successfulAdoptions, label: "Adopted" }]
      : []),
    { value: stats.availableNow, label: "Available Now" },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-8 shadow-sm shadow-ink/5">
      <SectionHeading>Our Mission</SectionHeading>
      <p className="mt-4 leading-7 text-ink">
        To rescue, rehabilitate and rehome cats in need while building a more
        compassionate community through education, resources and support.
      </p>

      <dl className="my-8 flex justify-around gap-4 border-y border-line py-6">
        {statItems.map((item, i) => (
          <Fragment key={item.label}>
            {i > 0 && <div className="w-px self-stretch bg-gold/40" aria-hidden="true" />}
            <div className="flex flex-col-reverse items-center text-center">
              <dt className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                {item.label}
              </dt>
              <dd className="font-display text-3xl font-bold text-brand">{item.value}</dd>
            </div>
          </Fragment>
        ))}
      </dl>

      <Button href="/about" chevron className="mt-auto self-start">
        Learn More About Us
      </Button>
    </div>
  );
}
