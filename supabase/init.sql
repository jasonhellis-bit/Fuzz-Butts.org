-- =============================================================================
-- Database initialization script
-- Generated from migrations in order. Run this against a fresh Supabase project.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 20260524000001_create_users
-- -----------------------------------------------------------------------------

CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

CREATE TABLE public.users (
    id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name  TEXT        NOT NULL,
    last_name   TEXT        NOT NULL,
    title       TEXT,
    status      public.user_status NOT NULL DEFAULT 'pending',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_contact_methods (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    contact_type    TEXT        NOT NULL,
    contact_address TEXT        NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.user_audit_log (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    event_date_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description     TEXT        NOT NULL
);

CREATE INDEX idx_user_contact_methods_user_id ON public.user_contact_methods(user_id);
CREATE INDEX idx_user_audit_log_user_id        ON public.user_audit_log(user_id);
CREATE INDEX idx_user_audit_log_event_dt       ON public.user_audit_log(event_date_time DESC);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO public.users (id, first_name, last_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_create_user_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

ALTER TABLE public.users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_contact_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_audit_log       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: select own"    ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users: update own"    ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "contacts: select own" ON public.user_contact_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contacts: insert own" ON public.user_contact_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contacts: update own" ON public.user_contact_methods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contacts: delete own" ON public.user_contact_methods FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "audit: select own"    ON public.user_audit_log FOR SELECT USING (auth.uid() = user_id);


-- -----------------------------------------------------------------------------
-- 20260524000002_create_pets
-- -----------------------------------------------------------------------------

CREATE TYPE public.pet_type AS ENUM ('cat', 'dog', 'rabbit', 'bird', 'small_animal', 'reptile', 'other');
CREATE TYPE public.pet_sex  AS ENUM ('male', 'female', 'unknown');

CREATE TYPE public.intake_reason AS ENUM (
    'stray',
    'owner_surrender',
    'transfer',
    'born_in_care',
    'other'
);

CREATE TYPE public.disposition_reason AS ENUM (
    'adopted',
    'transferred',
    'returned_to_owner',
    'deceased',
    'euthanized',
    'other'
);

CREATE TABLE public.pets (
    id                  UUID                      PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT                      NOT NULL,
    pet_type            public.pet_type           NOT NULL,
    sex                 public.pet_sex            NOT NULL DEFAULT 'unknown',
    breed               TEXT,
    description         TEXT,
    intake_date         DATE                      NOT NULL,
    intake_reason       public.intake_reason      NOT NULL,
    spayed_neutered     BOOLEAN                   NOT NULL DEFAULT false,
    spay_neuter_date    DATE,
    disposition_date    DATE,
    disposition_reason  public.disposition_reason,
    notes               TEXT,
    created_at          TIMESTAMPTZ               NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ               NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_spay_neuter_date CHECK (
        spay_neuter_date IS NULL OR spayed_neutered = true
    ),
    CONSTRAINT chk_disposition CHECK (
        (disposition_date IS NULL) = (disposition_reason IS NULL)
    )
);

CREATE TABLE public.pet_audit_log (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id      UUID        NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    date_time   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    description TEXT        NOT NULL
);

CREATE INDEX idx_pet_audit_log_pet_id    ON public.pet_audit_log(pet_id);
CREATE INDEX idx_pet_audit_log_date_time ON public.pet_audit_log(date_time DESC);
CREATE INDEX idx_pets_pet_type           ON public.pets(pet_type);
CREATE INDEX idx_pets_disposition_date   ON public.pets(disposition_date);

CREATE TRIGGER trg_pets_updated_at
    BEFORE UPDATE ON public.pets
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.pets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pets: public read"  ON public.pets          FOR SELECT USING (true);
CREATE POLICY "audit: public read" ON public.pet_audit_log FOR SELECT USING (true);

CREATE POLICY "pets: auth insert"  ON public.pets          FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "pets: auth update"  ON public.pets          FOR UPDATE USING     (auth.uid() IS NOT NULL);
CREATE POLICY "pets: auth delete"  ON public.pets          FOR DELETE USING     (auth.uid() IS NOT NULL);
CREATE POLICY "audit: auth insert" ON public.pet_audit_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- -----------------------------------------------------------------------------
-- 20260524000003_create_pet_images
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

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

CREATE TABLE public.pet_images (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id          UUID        NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    storage_path    TEXT        NOT NULL,
    is_primary      BOOLEAN     NOT NULL DEFAULT false,
    display_order   INTEGER     NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pet_images_pet_id ON public.pet_images(pet_id);

CREATE UNIQUE INDEX idx_pet_images_one_primary
    ON public.pet_images(pet_id)
    WHERE is_primary = true;

ALTER TABLE public.pet_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pet_images: public read"  ON public.pet_images FOR SELECT USING (true);
CREATE POLICY "pet_images: auth insert"  ON public.pet_images FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "pet_images: auth update"  ON public.pet_images FOR UPDATE USING     (auth.uid() IS NOT NULL);
CREATE POLICY "pet_images: auth delete"  ON public.pet_images FOR DELETE USING     (auth.uid() IS NOT NULL);


-- -----------------------------------------------------------------------------
-- 20260524000004_create_featured_adoptions
-- -----------------------------------------------------------------------------

CREATE TABLE public.featured_adoptions (
    id          UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id      UUID  NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    start_date  DATE  NOT NULL,
    end_date    DATE,

    CONSTRAINT chk_end_after_start CHECK (end_date IS NULL OR end_date > start_date)
);

CREATE INDEX idx_featured_adoptions_pet_id     ON public.featured_adoptions(pet_id);
CREATE INDEX idx_featured_adoptions_start_date ON public.featured_adoptions(start_date);

ALTER TABLE public.featured_adoptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "featured_adoptions: public read"  ON public.featured_adoptions FOR SELECT USING (true);
CREATE POLICY "featured_adoptions: auth insert"  ON public.featured_adoptions FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "featured_adoptions: auth update"  ON public.featured_adoptions FOR UPDATE USING     (auth.uid() IS NOT NULL);
CREATE POLICY "featured_adoptions: auth delete"  ON public.featured_adoptions FOR DELETE USING     (auth.uid() IS NOT NULL);


-- -----------------------------------------------------------------------------
-- 20260525000001_add_roles_to_users
-- -----------------------------------------------------------------------------

ALTER TABLE public.users
    ADD COLUMN roles TEXT NOT NULL DEFAULT '';


-- -----------------------------------------------------------------------------
-- 20260525000002_add_pet_status
-- -----------------------------------------------------------------------------

CREATE TYPE public.pet_status AS ENUM (
    'quarantined',
    'available for adoption',
    'pending adoption',
    'adopted',
    'deceased',
    'reclaimed by owner'
);

ALTER TABLE public.pets
    ADD COLUMN status public.pet_status NOT NULL DEFAULT 'available for adoption';


-- -----------------------------------------------------------------------------
-- 20260527000001_add_user_id_to_pet_audit_log
-- -----------------------------------------------------------------------------

ALTER TABLE public.pet_audit_log
    ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX idx_pet_audit_log_user_id ON public.pet_audit_log(user_id);

ALTER TABLE public.pets
    ADD COLUMN age TEXT;


-- -----------------------------------------------------------------------------
-- 20260531000001_add_weight_to_pets
-- -----------------------------------------------------------------------------

ALTER TABLE public.pets
    ADD COLUMN weight TEXT;
