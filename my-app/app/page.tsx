import { createAdminClient } from "@/lib/supabase/admin";
import FeaturedAdoption, { type FeaturedPet } from "@/components/home/FeaturedAdoption";
import MissionStatement from "@/components/home/MissionStatement";

export default async function Home() {
  const adminClient = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: featuredRow } = await adminClient
    .from("featured_adoptions")
    .select("pets(name, breed, sex, description, pet_images(storage_path, is_primary))")
    .lte("start_date", today)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  let pet: FeaturedPet | null = null;
  if (featuredRow) {
    const p = featuredRow.pets as any;
    const primaryImg = (p?.pet_images as any[])?.find((i: any) => i.is_primary);
    let primary_image_url: string | null = null;
    if (primaryImg?.storage_path) {
      const { data } = adminClient.storage.from("pet-images").getPublicUrl(primaryImg.storage_path);
      primary_image_url = data.publicUrl;
    }
    pet = {
      name: p.name,
      breed: p.breed,
      sex: p.sex,
      description: p.description,
      primary_image_url,
    };
  }

  return (
    <div className="bg-white px-6 py-12 sm:px-16">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2 lg:items-stretch">
        <MissionStatement />
        <FeaturedAdoption pet={pet} />
      </div>
    </div>
  );
}
