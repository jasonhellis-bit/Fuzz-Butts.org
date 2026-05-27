import { createAdminClient } from "@/lib/supabase/admin";
import CatCard from "@/components/adopt/CatCard";
import { Pet } from "@/types/types";

export default async function AdoptPage() {
  const adminClient = createAdminClient();

  const { data: pets } = await adminClient
    .from("pets")
    .select("*, pet_images(storage_path, is_primary)")
    .in("status", ["available for adoption", "pending adoption"])
    .order("created_at", { ascending: false });

  const petsWithImages: Pet[] = (pets ?? []).map((pet: any) => {
    const primary = (pet.pet_images as any[])?.find((img) => img.is_primary);
    let primary_image_url: string | null = null;
    if (primary?.storage_path) {
      const { data } = adminClient.storage.from("pet-images").getPublicUrl(primary.storage_path);
      primary_image_url = data.publicUrl;
    }
    const { pet_images, ...petData } = pet;
    return { ...petData, primary_image_url };
  });

  return (
    <div className="min-h-screen flex flex-col items-center gap-8 py-16">
      <h1 className="text-4xl font-bold">Adopt a Cat</h1>
      <div className="w-full max-w-7xl px-4">
        {petsWithImages.length === 0 ? (
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-sm">
              <div className="text-5xl mb-4">🐾</div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No cats available at this time</h2>
              <p className="text-gray-500 text-sm">Check back soon — new rescues are added regularly.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {petsWithImages.map((pet) => (
              <CatCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
