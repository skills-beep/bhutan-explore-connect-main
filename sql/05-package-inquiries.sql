-- Run this migration in Supabase SQL Editor after the existing setup scripts.

create table if not exists public.package_inquiries (
  id uuid primary key default gen_random_uuid(),
  package_id text not null,
  package_title text not null,
  company text not null,
  package_price numeric not null,
  name text not null,
  email text not null,
  phone text,
  travel_dates text,
  traveler_count integer not null default 1 check (traveler_count > 0),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_package_inquiries_email on public.package_inquiries(email);
create index if not exists idx_package_inquiries_package_id on public.package_inquiries(package_id);
create index if not exists idx_package_inquiries_created_at on public.package_inquiries(created_at desc);

alter table public.package_inquiries enable row level security;

drop policy if exists "Public visitors can submit package inquiries" on public.package_inquiries;
create policy "Public visitors can submit package inquiries"
  on public.package_inquiries for insert
  with check (true);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'package_inquiries'
  ) then
    alter publication supabase_realtime add table public.package_inquiries;
  end if;
end;
$$;

-- The signup form is public and does not create a Supabase Auth session.
drop policy if exists "Users can insert their own profile" on public.connect_profiles;
drop policy if exists "Public visitors can register a profile" on public.connect_profiles;
create policy "Public visitors can register a profile"
  on public.connect_profiles for insert
  with check (true);