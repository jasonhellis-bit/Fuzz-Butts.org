"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PawPrint, Venus, Mars, Heart } from "lucide-react";

export interface RotatorPet {
  id: string;
  name: string;
  sex: string;
  age: string | null;
  breed: string | null;
  primary_image_url: string | null;
  isNew: boolean;
}

export default function CatsRotator({ pets }: { pets: RotatorPet[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState, pets.length]);

  function scrollByCards(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: "smooth" });
  }

  if (pets.length === 0) return null;

  return (
    <section className="w-full bg-[var(--background)] py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 sm:px-10 lg:flex-row lg:items-center">
        <div className="lg:w-60 lg:flex-shrink-0">
          <div className="flex items-center gap-2 text-blue-600">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <PawPrint size={16} />
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Cats Looking for{" "}
              <span className="relative inline-block">
                Homes
                <svg
                  className="absolute -bottom-1.5 left-0 w-full text-orange-500"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  aria-hidden="true">
                  <path d="M2 8c20-6 78-6 96 0" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">Swipe to meet more of our adorable cats!</p>
        </div>

        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            aria-label="Scroll left"
            disabled={!canScrollLeft}
            onClick={() => scrollByCards(-1)}
            className="absolute -left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition-opacity disabled:opacity-30 sm:flex">
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            disabled={!canScrollRight}
            onClick={() => scrollByCards(1)}
            className="absolute -right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-slate-600 shadow-md transition-opacity disabled:opacity-30 sm:flex">
            <ChevronRight size={20} />
          </button>

          <div
            ref={scrollerRef}
            onScroll={updateScrollState}
            className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth px-1 py-2 sm:px-10">
            {pets.map((pet) => (
              <Link
                key={pet.id}
                href={`/adopt/${pet.id}`}
                className="w-44 flex-shrink-0 overflow-hidden rounded-2xl bg-white transition-all duration-200 ease-out hover:shadow-xl hover:[transform:perspective(800px)_rotateX(4deg)_translateY(-6px)_scale(1.04)] sm:w-52">
                <div className="relative h-32 w-full bg-slate-100 sm:h-40">
                  {pet.primary_image_url ? (
                    <img
                      src={pet.primary_image_url}
                      alt={pet.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-slate-300">🐾</div>
                  )}
                  {pet.isNew && (
                    <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      New
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                    {pet.name}
                    {pet.sex.toLowerCase() === "female" ? (
                      <Venus size={13} className="text-pink-500" />
                    ) : (
                      <Mars size={13} className="text-blue-500" />
                    )}
                    {pet.age && <span className="font-normal text-slate-400">· {pet.age}</span>}
                  </div>
                  {pet.breed && <p className="mt-0.5 truncate text-xs text-slate-500">{pet.breed}</p>}
                  <span className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-full border border-blue-200 px-3 py-1 text-xs font-medium text-blue-600">
                    View Profile <Heart size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/adopt"
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:bg-blue-50">
          <PawPrint size={16} /> View All Cats
        </Link>
      </div>
    </section>
  );
}
