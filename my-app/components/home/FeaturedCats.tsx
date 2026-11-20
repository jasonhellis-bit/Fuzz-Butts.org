import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import HeartDoodle from "@/components/ui/HeartDoodle";
import SectionHeading from "@/components/ui/SectionHeading";

export interface AdoptableCat {
  id: string;
  name: string;
  sex: string;
  age: string | null;
  primary_image_url: string | null;
  isNew: boolean;
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function FeaturedCats({ cats }: { cats: AdoptableCat[] }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <SectionHeading>Featured Adoptable Cats</SectionHeading>
        <Link
          href="/adopt"
          className="inline-flex items-center gap-1 font-semibold text-brand hover:underline">
          View All Cats <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>

      {cats.length === 0 ? (
        <p className="mt-6 rounded-xl border border-line bg-surface p-8 text-center text-ink-muted">
          Every one of our cats has found a home for now. Check back soon!
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {cats.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/adopt/${cat.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm shadow-ink/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                <div className="relative aspect-[4/5] w-full bg-line/50">
                  {cat.primary_image_url ? (
                    <img
                      src={cat.primary_image_url}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-gold/50">🐾</div>
                  )}
                  <HeartDoodle
                    className="absolute right-2 top-2 h-7 w-7 text-gold-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
                    strokeWidth={2}
                  />
                  {cat.isNew && (
                    <span className="absolute left-2 top-2 rounded-full bg-gold-deep px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      New
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-xl font-bold text-brand">{cat.name}</h3>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {cat.age && (
                      <>
                        {cat.age}
                        <span className="mx-1.5 text-gold" aria-hidden="true">•</span>
                      </>
                    )}
                    {titleCase(cat.sex)}
                  </p>
                  <div className="mt-auto pt-3">
                    <span className={`${buttonClasses("primary", "sm")} w-full group-hover:bg-brand-dark`}>
                      View Profile <ChevronRight size={14} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
