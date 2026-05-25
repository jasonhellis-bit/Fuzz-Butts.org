-- Create the pet-images storage bucket (public — URLs are readable without auth)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage object policies
CREATE POLICY "pet-images bucket: public read"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'pet-images');

CREATE POLICY "pet-images bucket: auth insert"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'pet-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "pet-images bucket: auth update"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'pet-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "pet-images bucket: auth delete"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'pet-images' AND auth.uid() IS NOT NULL);

-- Pet images table supporting multiple images per pet.
-- storage_path is the object path within the Supabase Storage 'pet-images' bucket.
-- A partial unique index ensures each pet has at most one primary image.

CREATE TABLE public.pet_images (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id          UUID        NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    storage_path    TEXT        NOT NULL,
    is_primary      BOOLEAN     NOT NULL DEFAULT false,
    display_order   INTEGER     NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pet_images_pet_id ON public.pet_images(pet_id);

-- Only one primary image allowed per pet
CREATE UNIQUE INDEX idx_pet_images_one_primary
    ON public.pet_images(pet_id)
    WHERE is_primary = true;

-- Row-level security
ALTER TABLE public.pet_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pet_images: public read"  ON public.pet_images FOR SELECT USING (true);
CREATE POLICY "pet_images: auth insert"  ON public.pet_images FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "pet_images: auth update"  ON public.pet_images FOR UPDATE USING     (auth.uid() IS NOT NULL);
CREATE POLICY "pet_images: auth delete"  ON public.pet_images FOR DELETE USING     (auth.uid() IS NOT NULL);
