import { createAdminClient } from "@/lib/supabase/admin";
import FeaturedManager, { type CurrentFeatured, type SelectablePet } from "@/components/manage/FeaturedManager";

export default async function FeaturedPage() {
  const adminClient = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: featuredRow } = await adminClient
    .from("featured_adoptions")
    .select("id, start_date, end_date, pets(id, name, breed, pet_images(storage_path, is_primary))")
    .lte("start_date", today)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  let current: CurrentFeatured | null = null;
  if (featuredRow) {
    const pet = featuredRow.pets as any;
    const primaryImg = (pet?.pet_images as any[])?.find((i: any) => i.is_primary);
    let pet_image_url: string | null = null;
    if (primaryImg?.storage_path) {
      const { data } = adminClient.storage.from("pet-images").getPublicUrl(primaryImg.storage_path);
      pet_image_url = data.publicUrl;
    }
    current = {
      id: featuredRow.id,
      start_date: featuredRow.start_date,
      end_date: featuredRow.end_date,
      pet_name: pet?.name ?? "",
      pet_breed: pet?.breed ?? null,
      pet_image_url,
    };
  }

  const { data: availablePets } = await adminClient
    .from("pets")
    .select("id, name, breed, pet_type")
    .in("status", ["available for adoption", "pending adoption"])
    .order("name");

  const pets: SelectablePet[] = (availablePets ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    breed: p.breed,
    pet_type: p.pet_type,
  }));

  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-8">Featured Adoption</h1>
      <FeaturedManager current={current} pets={pets} />
    </div>
  );
}
