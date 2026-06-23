import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/constants";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adminClient = createAdminClient();

  const { data: pets } = await adminClient
    .from("pets")
    .select("id, updated_at")
    .in("status", ["available for adoption", "pending adoption"]);

  const petRoutes: MetadataRoute.Sitemap = (pets ?? []).map((pet) => ({
    url: `${SITE_URL}/adopt/${pet.id}`,
    lastModified: pet.updated_at,
    changeFrequency: "weekly",
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/adopt`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/donate`, changeFrequency: "monthly", priority: 0.6 },
  ];

  return [...staticRoutes, ...petRoutes];
}
