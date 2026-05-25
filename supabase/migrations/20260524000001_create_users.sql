-- User profiles, contact methods, and audit log tables.
-- Authentication is handled by Supabase Auth (auth.users).
-- This profiles table extends auth.users with application-specific fields.

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

-- Keep updated_at current on every row update
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

-- Auto-create a profile row when a new auth user signs up.
-- first_name/last_name are seeded from auth metadata if provided at signup,
-- otherwise they default to empty strings and can be updated by the user.
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

-- Row-level security
ALTER TABLE public.users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_contact_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_audit_log       ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "users: select own"  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users: update own"  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Users can read and manage their own contact methods
CREATE POLICY "contacts: select own" ON public.user_contact_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contacts: insert own" ON public.user_contact_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contacts: update own" ON public.user_contact_methods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contacts: delete own" ON public.user_contact_methods FOR DELETE USING (auth.uid() = user_id);

-- Users can read their own audit log; only server-side code should insert (no user INSERT policy)
CREATE POLICY "audit: select own" ON public.user_audit_log FOR SELECT USING (auth.uid() = user_id);
