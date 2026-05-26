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
