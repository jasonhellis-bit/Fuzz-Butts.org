-- Run this in the Supabase SQL editor to create the adoption application tables.

create table if not exists adoption_applications (
  id           uuid        primary key default gen_random_uuid(),
  submitted_at timestamptz not null    default now(),
  status       text        not null    default 'pending'
                           check (status in ('pending', 'under_review', 'approved', 'denied', 'withdrawn')),
  application_data jsonb   not null
);

create table if not exists adoption_application_notes (
  id                  uuid        primary key default gen_random_uuid(),
  application_id      uuid        not null references adoption_applications(id) on delete cascade,
  note                text        not null,
  created_at          timestamptz not null default now(),
  created_by_user_id  uuid        references auth.users(id) on delete set null,
  created_by_name     text
);

create index if not exists adoption_application_notes_application_id_idx
  on adoption_application_notes(application_id);

-- Enable RLS on both tables. All access goes through server actions using
-- the service role key, which bypasses RLS, so no client-facing policies needed.
alter table adoption_applications        enable row level security;
alter table adoption_application_notes   enable row level security;
