import { Fragment } from "react";
import { Heart, HeartHandshake, Cat, PawPrint } from "lucide-react";
import FeaturedAdoption, {
  type FeaturedPet,
} from "@/components/home/FeaturedAdoption";

interface HeroStats {
  catsRescued: number;
  successfulAdoptions: number;
  availableNow: number;
}

export default function Hero({
  pet,
  stats,
}: {
  pet: FeaturedPet | null;
  stats: HeroStats;
}) {
  const statItems = [
    {
      icon: <Cat size={22} />,
      value: stats.catsRescued,
      label: "Cats Rescued",
    },
    ...(stats.successfulAdoptions > 0
      ? [
          {
            icon: <HeartHandshake size={22} />,
            value: stats.successfulAdoptions,
            label: "Successful Adoptions",
          },
        ]
      : []),
    {
      icon: <PawPrint size={22} />,
      value: stats.availableNow,
      label: "Available Now",
    },
  ];

  return (
    <section className="relative flex w-full flex-col lg:h-[clamp(480px,68vh,1024px)] lg:flex-row lg:items-stretch">
      <div className="flex flex-col items-start justify-center gap-5 px-6 py-10 sm:px-10 lg:w-[40%] lg:py-8 lg:pl-12 lg:pr-8 xl:pl-20">
        <span className="inline-flex items-center gap-2 text-lg font-bold text-blue-600 sm:text-xl">
          <Heart
            size={20}
            className="shrink-0 fill-orange-500 text-orange-500"
          />{" "}
          Saving lives. One cat at a time.
        </span>

        <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
          Find Your New{" "}
          <span className="relative inline-block">
            Best Friend
            <svg
              className="absolute -bottom-2 left-0 w-full text-blue-500"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              aria-hidden="true">
              <path
                d="M2 8c40-6 156-6 196 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className="max-w-md text-lg leading-7 text-slate-600">
          Every cat deserves a safe, loving home. Browse our adoptable cats and
          give a furry friend their second chance.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/adopt"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600">
            <PawPrint size={18} /> Adopt a Cat Today
          </a>
          <a
            href="/how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50">
            <HeartHandshake size={18} /> How Adoption Works
          </a>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-6">
          {statItems.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 && (
                <div className="hidden h-16 w-px self-center bg-slate-300 sm:block" />
              )}
              <Stat icon={item.icon} value={item.value} label={item.label} />
            </Fragment>
          ))}
        </div>
      </div>

      <div className="static px-6 sm:px-10 lg:relative lg:h-full lg:w-[60%] lg:px-0">
        <div className="aspect-[4/5] w-full overflow-hidden bg-slate-100 shadow-2xl shadow-slate-300/50 lg:aspect-auto lg:h-full">
          {pet?.primary_image_url ? (
            <img
              src={pet.primary_image_url}
              alt={pet.name}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-8xl text-slate-300">
              🐾
            </div>
          )}
        </div>

        <div className="mt-6 lg:absolute lg:bottom-8 lg:right-8 lg:mt-0 lg:w-64 xl:right-12 xl:w-72">
          <FeaturedAdoption pet={pet} />
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        {icon}
      </span>
      <p className="text-3xl font-extrabold text-blue-600">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
