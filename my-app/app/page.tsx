import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import Hero from "@/components/home/Hero";
import CatsRotator, { type RotatorPet } from "@/components/home/CatsRotator";
import { type FeaturedPet } from "@/components/home/FeaturedAdoption";

const getFeaturedPet = unstable_cache(
  async (): Promise<FeaturedPet | null> => {
    const adminClient = createAdminClient();
    const today = new Date().toISOString().split("T")[0];

    const { data: featuredRow } = await adminClient
      .from("featured_adoptions")
      .select("pets(id, name, breed, sex, age, description, pet_images(storage_path, is_primary))")
      .lte("start_date", today)
      .or(`end_date.is.null,end_date.gte.${today}`)
      .order("start_date", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!featuredRow) return null;

    const p = featuredRow.pets as any;
    const primaryImg = (p?.pet_images as any[])?.find((i: any) => i.is_primary);
    let primary_image_url: string | null = null;
    if (primaryImg?.storage_path) {
      const { data } = adminClient.storage.from("pet-images").getPublicUrl(primaryImg.storage_path);
      primary_image_url = data.publicUrl;
    }
    return {
      id: p.id,
      name: p.name,
      breed: p.breed,
      sex: p.sex,
      age: p.age,
      description: p.description,
      primary_image_url,
    };
  },
  ["featured-pet"],
  { tags: ["featured-adoption"], revalidate: 3600 }
);

const getHomeStats = unstable_cache(
  async () => {
    const adminClient = createAdminClient();
    const [rescued, adopted, available] = await Promise.all([
      adminClient.from("pets").select("id", { count: "exact", head: true }),
      adminClient.from("pets").select("id", { count: "exact", head: true }).eq("status", "adopted"),
      adminClient
        .from("pets")
        .select("id", { count: "exact", head: true })
        .in("status", ["available for adoption", "pending adoption"]),
    ]);
    return {
      catsRescued: rescued.count ?? 0,
      successfulAdoptions: adopted.count ?? 0,
      availableNow: available.count ?? 0,
    };
  },
  ["home-stats"],
  { tags: ["home-stats"], revalidate: 3600 }
);

const getAdoptableCats = unstable_cache(
  async (): Promise<RotatorPet[]> => {
    const adminClient = createAdminClient();
    const { data: pets } = await adminClient
      .from("pets")
      .select("id, name, sex, age, breed, created_at, pet_images(storage_path, is_primary, display_order)")
      .in("status", ["available for adoption", "pending adoption"])
      .order("created_at", { ascending: false })
      .limit(16);

    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;

    return (pets ?? []).map((pet: any) => {
      const images = (pet.pet_images as any[]) ?? [];
      const primaryImg = images.find((i) => i.is_primary) ?? images[0];
      const primary_image_url = primaryImg?.storage_path
        ? adminClient.storage.from("pet-images").getPublicUrl(primaryImg.storage_path).data.publicUrl
        : null;
      return {
        id: pet.id,
        name: pet.name,
        sex: pet.sex,
        age: pet.age,
        breed: pet.breed,
        primary_image_url,
        isNew: new Date(pet.created_at).getTime() > twoWeeksAgo,
      };
    });
  },
  ["adoptable-cats"],
  { tags: ["adoptable-cats"], revalidate: 3600 }
);

export default async function Home() {
  const [pet, stats, cats] = await Promise.all([
    getFeaturedPet(),
    getHomeStats(),
    getAdoptableCats(),
  ]);

  return (
    <div className="flex flex-col">
      <Hero pet={pet} stats={stats} />
      <CatsRotator pets={cats} />
    </div>
  );
}
