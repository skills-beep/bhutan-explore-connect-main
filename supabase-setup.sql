-- ============================================
-- BHUTAN CONNECTS SUPABASE DATABASE SETUP
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- 1. CONNECT PROFILES TABLE
-- ============================================
create table if not exists public.connect_profiles (
  id text primary key,
  name text not null,
  email text not null unique,
  age integer not null,
  gender text,
  bio text not null,
  profile_photo text,
  id_card_scan text,
  face_photo text,
  email_verified boolean default false,
  travel_group_code text,
  emergency_contact_name text,
  emergency_contact_phone text,
  languages jsonb default '[]'::jsonb,
  interests jsonb default '[]'::jsonb,
  verified text default 'unverified',
  is_host boolean default false,
  is_looking_for_buddy boolean default false,
  host_details jsonb,
  buddy_details jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  profile_visibility text default 'public',
  constraint age_valid check (age >= 18)
);

-- Create index for faster queries
create index if not exists idx_connect_profiles_email on connect_profiles(email);
create index if not exists idx_connect_profiles_is_host on connect_profiles(is_host);
create index if not exists idx_connect_profiles_created_at on connect_profiles(created_at desc);

-- Enable real-time
alter publication supabase_realtime add table connect_profiles;

-- ============================================
-- 2. CONNECTION REQUESTS TABLE
-- ============================================
create table if not exists public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id text not null references public.connect_profiles(id) on delete cascade,
  to_user_id text not null references public.connect_profiles(id) on delete cascade,
  message text not null,
  status text default 'pending', -- pending, accepted, rejected, blocked
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint from_to_different check (from_user_id != to_user_id),
  constraint valid_status check (status in ('pending', 'accepted', 'rejected', 'blocked'))
);

-- Create indexes for faster queries
create index if not exists idx_connection_requests_to_user on connection_requests(to_user_id);
create index if not exists idx_connection_requests_from_user on connection_requests(from_user_id);
create index if not exists idx_connection_requests_status on connection_requests(status);

-- Enable real-time
alter publication supabase_realtime add table connection_requests;

-- ============================================
-- 3. MESSAGES TABLE
-- ============================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  from_user_id text not null references public.connect_profiles(id) on delete cascade,
  to_user_id text not null references public.connect_profiles(id) on delete cascade,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now(),
  constraint from_to_different check (from_user_id != to_user_id)
);

-- Create indexes
create index if not exists idx_messages_to_user on messages(to_user_id);
create index if not exists idx_messages_from_user on messages(from_user_id);
create index if not exists idx_messages_created_at on messages(created_at desc);

-- Enable real-time
alter publication supabase_realtime add table messages;

-- ============================================
-- 4. PACKAGES TABLE
-- ============================================
create table if not exists public.packages (
  id text primary key,
  name text not null,
  description text not null,
  duration_days integer not null,
  price_per_person numeric not null,
  destination text,
  highlights jsonb default '[]'::jsonb,
  inclusions jsonb default '[]'::jsonb,
  exclusions jsonb default '[]'::jsonb,
  itinerary jsonb default '[]'::jsonb,
  best_season text,
  group_size_min integer,
  group_size_max integer,
  difficulty_level text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_packages_destination on packages(destination);
create index if not exists idx_packages_created_at on packages(created_at desc);

-- Enable real-time
alter publication supabase_realtime add table packages;

-- ============================================
-- 5. DESTINATIONS TABLE
-- ============================================
create table if not exists public.destinations (
  id text primary key,
  name text not null,
  description text not null,
  image_url text,
  altitude_meters integer,
  best_season text,
  attractions jsonb default '[]'::jsonb,
  activities jsonb default '[]'::jsonb,
  culture_highlights text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes
create index if not exists idx_destinations_name on destinations(name);

-- Enable real-time
alter publication supabase_realtime add table destinations;

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
alter table connect_profiles enable row level security;
alter table connection_requests enable row level security;
alter table messages enable row level security;
alter table packages enable row level security;
alter table destinations enable row level security;

-- Connect Profiles Policies
create policy "Users can view public profiles"
  on connect_profiles for select
  using (profile_visibility = 'public');

create policy "Users can view their own profile"
  on connect_profiles for select
  using (auth.uid()::text = id);

create policy "Users can insert their own profile"
  on connect_profiles for insert
  with check (auth.uid()::text = id);

create policy "Users can update their own profile"
  on connect_profiles for update
  using (auth.uid()::text = id);

-- Connection Requests Policies
create policy "Users can view their connection requests"
  on connection_requests for select
  using (auth.uid()::text = to_user_id or auth.uid()::text = from_user_id);

create policy "Users can create connection requests"
  on connection_requests for insert
  with check (auth.uid()::text = from_user_id);

create policy "Users can update their connection requests"
  on connection_requests for update
  using (auth.uid()::text = to_user_id);

-- Messages Policies
create policy "Users can view their messages"
  on messages for select
  using (auth.uid()::text = to_user_id or auth.uid()::text = from_user_id);

create policy "Users can send messages"
  on messages for insert
  with check (auth.uid()::text = from_user_id);

-- Packages and Destinations are readable by everyone
create policy "Packages are readable by everyone"
  on packages for select
  using (true);

create policy "Destinations are readable by everyone"
  on destinations for select
  using (true);

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your Supabase database is now ready to use.
