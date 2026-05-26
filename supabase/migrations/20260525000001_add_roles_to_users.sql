-- Add comma-delimited roles field to the users profile table.
ALTER TABLE public.users
    ADD COLUMN roles TEXT NOT NULL DEFAULT '';
