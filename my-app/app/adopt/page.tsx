import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { PawPrint } from "lucide-react";
import CatCard from "@/components/adopt/CatCard";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { Pet } from "@/types/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Adopt a Cat",
  description:
    "Browse cats currently available for adoption at Fuzz Butts Cat Rescue and start your adoption application today.",
};

export default async function AdoptPage() {
  const adminClient = createAdminClient();

  const { data: pets } = await adminClient
    .from("pets")
    .select("*, pet_images(storage_path, is_primary, display_order)")
    .in("status", ["available for adoption", "pending adoption"])
    .order("created_at", { ascending: false });

  const petsWithImages: Pet[] = (pets ?? []).map((pet: any) => {
    const images = (pet.pet_images as any[]) ?? [];
    const sorted = [...images].sort((a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return a.display_order - b.display_order;
    });
    const primary_image_url = sorted[0]?.storage_path
      ? adminClient.storage.from("pet-images").getPublicUrl(sorted[0].storage_path).data.publicUrl
      : null;
    const image_urls = sorted.map(
      (img) => adminClient.storage.from("pet-images").getPublicUrl(img.storage_path).data.publicUrl
    );
    const { pet_images, ...petData } = pet;
    return { ...petData, primary_image_url, image_urls };
  });

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 py-16">
      <SectionHeading as="h1" size="lg">Adopt a Cat</SectionHeading>
      <p className="text-ink-muted text-lg text-center max-w-xl px-4">
        Found a cat you love? Fill out an adoption application and we&apos;ll be in touch!
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button href="/adopt/apply" chevron>
          Start an Application
        </Button>
        <Link
          href="/how-it-works"
          className="font-semibold text-brand hover:underline">
          How does adoption work?
        </Link>
      </div>
      <div className="w-full max-w-7xl px-4 mt-4">
        {petsWithImages.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className="bg-surface border border-line rounded-2xl shadow-sm p-8 text-center max-w-sm">
              <PawPrint className="mx-auto mb-4 h-12 w-12 text-gold" aria-hidden="true" />
              <h2 className="text-xl font-bold text-brand mb-2">No cats available at this time</h2>
              <p className="text-ink-muted text-sm">Check back soon — new rescues are added regularly.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {petsWithImages.map((pet) => (
              <CatCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
