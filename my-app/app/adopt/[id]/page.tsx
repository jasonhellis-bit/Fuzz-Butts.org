import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { Pet } from "@/types/types";

interface PetImageRow {
  storage_path: string;
  is_primary: boolean;
  display_order: number;
}

async function getPet(id: string): Promise<Pet | null> {
  const adminClient = createAdminClient();
  const { data: pet } = await adminClient
    .from("pets")
    .select("*, pet_images(storage_path, is_primary, display_order)")
    .eq("id", id)
    .maybeSingle();

  if (!pet) return null;

  const images = (pet.pet_images as PetImageRow[]) ?? [];
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
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pet = await getPet(id);
  if (!pet) return { title: "Cat Not Found" };

  const title = `${pet.name}${pet.breed ? ` — ${pet.breed}` : ""}`;
  const description = pet.description
    ? pet.description.slice(0, 160)
    : `Meet ${pet.name}, available for adoption at Fuzz Butts Cat Rescue.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: pet.primary_image_url ? [{ url: pet.primary_image_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: pet.primary_image_url ? [pet.primary_image_url] : undefined,
    },
  };
}

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pet = await getPet(id);
  if (!pet) notFound();

  return (
    <div className="min-h-screen flex flex-col items-center gap-6 py-16 px-4">
      <Link
        href="/adopt"
        className="w-full max-w-3xl self-start text-sm text-blue-600 hover:underline">
        ← Back to all cats
      </Link>
      <div className="w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-md">
        {pet.primary_image_url ? (
          <img
            src={pet.primary_image_url}
            alt={pet.name}
            className="h-96 w-full object-cover"
          />
        ) : (
          <div className="flex h-96 w-full items-center justify-center bg-gray-100 text-6xl text-gray-300">
            🐾
          </div>
        )}
        <div className="p-6">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h1 className="text-3xl font-bold">{pet.name}</h1>
            {pet.status === "pending adoption" && (
              <span className="whitespace-nowrap rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                Pending Adoption
              </span>
            )}
          </div>
          {pet.breed && <p className="mb-1 text-gray-600">{pet.breed}</p>}
          <p className="mb-4 text-sm capitalize text-gray-500">
            {pet.sex}
            {pet.age ? ` · ${pet.age}` : ""}
            {pet.weight ? ` · ${pet.weight}` : ""}
          </p>
          {pet.description && <p className="mb-6 text-gray-700">{pet.description}</p>}
          <Link
            href="/adopt/apply"
            className="inline-block rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700">
            Start an Application
          </Link>
        </div>
      </div>
    </div>
  );
}
