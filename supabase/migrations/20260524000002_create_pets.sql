-- Pets table with intake/disposition tracking and audit log.
-- Pet type, sex, intake reason, and disposition reason are enforced as enums.

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
    id                  UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT              NOT NULL,
    pet_type            public.pet_type   NOT NULL,
    sex                 public.pet_sex    NOT NULL DEFAULT 'unknown',
    breed               TEXT,
    description         TEXT,
    intake_date         DATE              NOT NULL,
    intake_reason       public.intake_reason NOT NULL,
    spayed_neutered     BOOLEAN           NOT NULL DEFAULT false,
    spay_neuter_date    DATE,
    disposition_date    DATE,
    disposition_reason  public.disposition_reason,
    created_at          TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ       NOT NULL DEFAULT NOW(),

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

CREATE INDEX idx_pet_audit_log_pet_id   ON public.pet_audit_log(pet_id);
CREATE INDEX idx_pet_audit_log_date_time ON public.pet_audit_log(date_time DESC);
CREATE INDEX idx_pets_pet_type          ON public.pets(pet_type);
CREATE INDEX idx_pets_disposition_date  ON public.pets(disposition_date);

CREATE TRIGGER trg_pets_updated_at
    BEFORE UPDATE ON public.pets
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Row-level security
ALTER TABLE public.pets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_audit_log ENABLE ROW LEVEL SECURITY;

-- Anyone can read pets (adopt page)
CREATE POLICY "pets: public read"     ON public.pets          FOR SELECT USING (true);
CREATE POLICY "audit: public read"    ON public.pet_audit_log FOR SELECT USING (true);

-- Only authenticated users can write (restrict to admin role when one is introduced)
CREATE POLICY "pets: auth insert"     ON public.pets          FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "pets: auth update"     ON public.pets          FOR UPDATE USING     (auth.uid() IS NOT NULL);
CREATE POLICY "pets: auth delete"     ON public.pets          FOR DELETE USING     (auth.uid() IS NOT NULL);
CREATE POLICY "audit: auth insert"    ON public.pet_audit_log FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
