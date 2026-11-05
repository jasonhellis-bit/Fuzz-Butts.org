import Image from "next/image";
import { Heart, PawPrint } from "lucide-react";
import Button from "@/components/ui/Button";
import HeartDoodle from "@/components/ui/HeartDoodle";
import FeaturedAdoption, {
  type FeaturedPet,
} from "@/components/home/FeaturedAdoption";

export default function Hero({ pet }: { pet: FeaturedPet | null }) {
  return (
    <section className="relative grid w-full lg:min-h-[clamp(540px,74vh,820px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Copy column — left padding lines up with the nav's max-w-7xl container on wide screens */}
      <div className="relative z-10 flex flex-col items-start justify-center gap-5 px-6 py-12 sm:px-10 lg:py-16 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+1.5rem))] lg:pr-4">
        <Image
          src="/fuzz_butts_logo_transparent.png"
          alt="Fuzz Butts Cat Rescue"
          width={530}
          height={327}
          priority
          className="h-auto w-[220px] sm:w-[260px] xl:w-[300px]"
        />

        <h1 className="leading-[0.95]">
          <span className="block text-5xl font-bold tracking-tight text-brand sm:text-6xl xl:text-7xl">
            Second Chances.
          </span>
          <span className="mt-1 block font-script text-6xl font-normal text-gold sm:text-7xl xl:text-[5.5rem]">
            Brighter Tomorrows.
          </span>
        </h1>

        <p className="flex items-center gap-2 font-display text-2xl font-semibold text-brand sm:text-[1.7rem]">
          Small Butts. Big Impact.
          <HeartDoodle className="h-8 w-8 -translate-y-1 text-gold" />
        </p>

        <p className="max-w-md text-lg leading-8 text-ink">
          Fuzz Butts Cat Rescue is a 501(c)(3) nonprofit saving the lives of
          cats in the West Valley through rescue, medical care, and adoption.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Button href="/adopt" chevron>
            View Adoptable Cats
          </Button>
          <Button href="/donate" variant="outline">
            Donate Now <Heart size={18} aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Featured cat photo, fading into the cream background toward the copy */}
      <div className="relative px-6 pb-10 sm:px-10 lg:p-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-line/50 lg:absolute lg:inset-0 lg:aspect-auto lg:rounded-none">
          {pet?.primary_image_url ? (
            <img
              src={pet.primary_image_url}
              alt={pet.name}
              className="h-full w-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PawPrint className="h-24 w-24 text-gold/50" aria-hidden="true" />
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-2/5 bg-gradient-to-r from-cream via-cream/60 to-transparent lg:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-24 bg-gradient-to-t from-cream/70 to-transparent lg:block"
            aria-hidden="true"
          />
        </div>

        <div className="mt-6 sm:mx-auto sm:max-w-sm lg:absolute lg:bottom-8 lg:right-8 lg:mt-0 lg:w-80 xl:right-12">
          <FeaturedAdoption pet={pet} />
        </div>
      </div>
    </section>
  );
}
