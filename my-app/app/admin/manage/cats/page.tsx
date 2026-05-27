import { createAdminClient } from "@/lib/supabase/admin";
import AddCatCard from "@/components/manage/AddCatCard";
import ManageCatCard from "@/components/manage/ManageCatCard";
import { Pet } from "@/types/types";
import Link from "next/link";

export default async function ManageCatsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { showAll } = await searchParams;
  const showAllCats = showAll === "1";

  const adminClient = createAdminClient();

  let query = adminClient
    .from("pets")
    .select("*, pet_images(storage_path, is_primary)")
    .order("created_at", { ascending: false });

  if (!showAllCats) {
    query = query.is("disposition_date", null);
  }

  const { data: pets } = await query;

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
      <h1 className="text-2xl sm:text-4xl font-bold mb-4">Pet Management</h1>
      <p className="text-lg text-gray-700 mb-4 max-w-2xl text-center">
        Manage pet profiles, view details, and update information.
      </p>
      <div className="mb-6">
        {showAllCats ? (
          <Link
            href="/admin/manage/cats"
            className="text-sm px-4 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors">
            Showing all cats — show active only
          </Link>
        ) : (
          <Link
            href="/admin/manage/cats?showAll=1"
            className="text-sm px-4 py-2 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors">
            Show all cats
          </Link>
        )}
      </div>
      <div className="grid w-full max-w-7xl gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <AddCatCard />
        {petsWithImages.map((pet) => (
          <ManageCatCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
}
