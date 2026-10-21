import { PawPrint, Heart } from "lucide-react";
import Button from "@/components/ui/Button";

export interface FeaturedPet {
  id: string;
  name: string;
  breed: string | null;
  sex: string;
  age: string | null;
  description: string | null;
  primary_image_url: string | null;
}

function titleCase(s: string) {
  return s.split(/[\s_]/).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

// Compact card that sits over the hero photo, introducing the featured cat.
export default function FeaturedAdoption({ pet }: { pet: FeaturedPet | null }) {
  const cardClasses =
    "w-full rounded-2xl border border-line bg-surface/95 p-5 shadow-xl shadow-ink/10 backdrop-blur";

  if (!pet) {
    return (
      <div className={`${cardClasses} text-center`}>
        <Eyebrow />
        <p className="mt-3 text-sm text-ink-muted">Check back soon for our next featured cat.</p>
      </div>
    );
  }

  const details = [titleCase(pet.sex), pet.age, pet.breed].filter(Boolean);

  return (
    <div className={cardClasses}>
      <Eyebrow />
      <h2 className="mt-1 text-2xl font-bold text-brand">Meet {pet.name}</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {details.map((d, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-1.5 text-gold" aria-hidden="true">•</span>}
            {d}
          </span>
        ))}
      </p>

      {pet.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink">{pet.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button href="/adopt/apply" size="sm">
          <Heart size={14} className="fill-current" aria-hidden="true" /> Adopt {pet.name}
        </Button>
        <Button href={`/adopt/${pet.id}`} variant="outline" size="sm" chevron>
          View Profile
        </Button>
      </div>
    </div>
  );
}

function Eyebrow() {
  return (
    <p className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-deep sm:justify-start">
      <PawPrint size={14} aria-hidden="true" /> Featured Cat
    </p>
  );
}
