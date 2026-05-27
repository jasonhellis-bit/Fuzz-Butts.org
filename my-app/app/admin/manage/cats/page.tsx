import { createAdminClient } from "@/lib/supabase/admin";
import AddCatCard from "@/components/manage/AddCatCard";
import ManageCatCard from "@/components/manage/ManageCatCard";
import { Pet } from "@/types/types";

export default async function ManageCatsPage() {
  const adminClient = createAdminClient();

  const { data: pets } = await adminClient
    .from("pets")
    .select("*, pet_images(storage_path, is_primary)")
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
    <div className="flex flex-col items-center px-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8">Pet Management</h1>
      <p className="text-lg text-gray-700 mb-6 max-w-2xl text-center">
        Manage pet profiles, view details, and update information.
      </p>
      <div className="grid w-full max-w-7xl gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <AddCatCard />
        {petsWithImages.map((pet) => (
          <ManageCatCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}
