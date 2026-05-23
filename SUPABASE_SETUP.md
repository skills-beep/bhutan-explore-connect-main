# Supabase Setup for Bhutan Connects

## 1. Install dependencies

Run:

```bash
npm install
```

If you already have the repo dependencies installed, install Supabase:

```bash
npm install @supabase/supabase-js
```

## 2. Add environment variables

Create a `.env` file in the project root and add:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Do not commit `.env` to source control.

## 3. Create database tables

Use Supabase SQL editor or the `psql` client, then run the following SQL:

### 3.1 Connect Profiles Table

```sql
create table public.connect_profiles (
  id text primary key,
  name text not null,
  email text not null,
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
  languages jsonb default '[]',
  interests jsonb default '[]',
  verified text default 'unverified',
  is_host boolean default false,
  is_looking_for_buddy boolean default false,
  host_details jsonb,
  buddy_details jsonb,
  created_at timestamptz default now(),
  profile_visibility text default 'public'
);

-- Enable real-time for profiles
alter publication supabase_realtime add table connect_profiles;
```

### 3.2 Connection Requests Table

```sql
create table public.connection_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id text not null references public.connect_profiles(id),
  to_user_id text not null references public.connect_profiles(id),
  message text not null,
  status text default 'pending', -- pending, accepted, rejected, blocked
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable real-time for connection requests
alter publication supabase_realtime add table connection_requests;

-- Create index for faster queries
create index idx_connection_requests_to_user on connection_requests(to_user_id);
create index idx_connection_requests_from_user on connection_requests(from_user_id);
```

## 4. Run the app

```bash
npm run dev
```

## 5. Features

### ✅ Real-time Sync
- New profile creations appear instantly for all users
- Connection requests update in real-time
- Changes sync across all browser tabs automatically

### ✅ Data Persistence
- All profiles stored in Supabase PostgreSQL database
- Automatic timestamps for audit trail
- Profile visibility controls (public/private)

### ✅ Verification System
- Email verification tracking
- ID card scan storage (base64)
- Face photo verification
- Multi-tier verification status: unverified → email verified → ID verified

### ✅ Host & Buddy Features
- Host profiles with location and space details
- Travel buddy profiles with destination preferences
- Flexible JSON fields for complex data (languages, interests, activities)
- Emergency contact information

### ✅ Fallback Support
- If Supabase credentials are not configured, the app automatically falls back to localStorage
- Works seamlessly in offline mode
- Data persists locally during development

## 6. How it works

- `src/lib/supabase.ts` creates the Supabase client from environment variables
- `src/components/ConnectSignup.tsx` saves new profiles to Supabase when creating an account
- `src/components/ConnectCommunity.tsx` loads profiles from Supabase and subscribes to real-time changes
- `src/pages/BhutanConnectsPage.tsx` manages the overall Connect page with profile discovery
- Real-time subscriptions ensure all users see the latest profiles without refreshing

## 7. Environment Variables

Make sure your `.env` file is in the project root with these values from your Supabase project settings:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your public anon key (safe to expose in frontend)

