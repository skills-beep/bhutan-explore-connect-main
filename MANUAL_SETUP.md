# Manual Supabase Database Setup Guide

## Your Credentials

✅ **Supabase Project URL:** `https://vkbkbgqzjcvzwlgotncs.supabase.co`  
✅ **Environment File:** `.env` (already created with credentials)

---

## Step-by-Step: Create Tables in Supabase

### Step 1: Open SQL Editor
1. Go to: https://supabase.com/dashboard/project/vkbkbgqzjcvzwlgotncs/sql/new
2. You should see a blank SQL editor

### Step 2: Copy-Paste Each SQL Command

Copy and paste **ONE section at a time** into the SQL editor, then click **Run**.

---

## TABLE 1: Connect Profiles (COPY & PASTE THIS)

```sql
CREATE TABLE IF NOT EXISTS public.connect_profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER NOT NULL CHECK (age >= 18),
  gender TEXT,
  bio TEXT NOT NULL,
  profile_photo TEXT,
  id_card_scan TEXT,
  face_photo TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  travel_group_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  languages JSONB DEFAULT '[]'::JSONB,
  interests JSONB DEFAULT '[]'::JSONB,
  verified TEXT DEFAULT 'unverified',
  is_host BOOLEAN DEFAULT FALSE,
  is_looking_for_buddy BOOLEAN DEFAULT FALSE,
  host_details JSONB,
  buddy_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  profile_visibility TEXT DEFAULT 'public'
);

CREATE INDEX IF NOT EXISTS idx_connect_profiles_email ON public.connect_profiles(email);
CREATE INDEX IF NOT EXISTS idx_connect_profiles_is_host ON public.connect_profiles(is_host);
CREATE INDEX IF NOT EXISTS idx_connect_profiles_created_at ON public.connect_profiles(created_at DESC);
```

**✓ Click Run after pasting**

---

## TABLE 2: Connection Requests (COPY & PASTE THIS)

```sql
CREATE TABLE IF NOT EXISTS public.connection_requests (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  from_user_id TEXT NOT NULL REFERENCES public.connect_profiles(id) ON DELETE CASCADE,
  to_user_id TEXT NOT NULL REFERENCES public.connect_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT from_to_different CHECK (from_user_id != to_user_id),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked'))
);

CREATE INDEX IF NOT EXISTS idx_connection_requests_to_user ON public.connection_requests(to_user_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_from_user ON public.connection_requests(from_user_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_status ON public.connection_requests(status);
```

**✓ Click Run after pasting**

---

## TABLE 3: Messages (COPY & PASTE THIS)

```sql
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  from_user_id TEXT NOT NULL REFERENCES public.connect_profiles(id) ON DELETE CASCADE,
  to_user_id TEXT NOT NULL REFERENCES public.connect_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT from_to_different CHECK (from_user_id != to_user_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_to_user ON public.messages(to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_from_user ON public.messages(from_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
```

**✓ Click Run after pasting**

---

## TABLE 4: Packages (COPY & PASTE THIS)

```sql
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  price_per_person NUMERIC NOT NULL,
  destination TEXT,
  highlights JSONB DEFAULT '[]'::JSONB,
  inclusions JSONB DEFAULT '[]'::JSONB,
  exclusions JSONB DEFAULT '[]'::JSONB,
  itinerary JSONB DEFAULT '[]'::JSONB,
  best_season TEXT,
  group_size_min INTEGER,
  group_size_max INTEGER,
  difficulty_level TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_packages_destination ON public.packages(destination);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON public.packages(created_at DESC);
```

**✓ Click Run after pasting**

---

## TABLE 5: Destinations (COPY & PASTE THIS)

```sql
CREATE TABLE IF NOT EXISTS public.destinations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  altitude_meters INTEGER,
  best_season TEXT,
  attractions JSONB DEFAULT '[]'::JSONB,
  activities JSONB DEFAULT '[]'::JSONB,
  culture_highlights TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_destinations_name ON public.destinations(name);
```

**✓ Click Run after pasting**

---

## OPTIONAL: Enable Real-time (COPY & PASTE THIS)

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE connect_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE connection_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE packages;
ALTER PUBLICATION supabase_realtime ADD TABLE destinations;
```

**✓ Click Run after pasting**

---

## ✅ Verification Steps

After running all SQL commands:

1. Go to **Database** → **Tables** in Supabase dashboard
2. You should see these 5 tables:
   - ✓ `connect_profiles`
   - ✓ `connection_requests`
   - ✓ `messages`
   - ✓ `packages`
   - ✓ `destinations`

3. Your app is now ready! The utilities in `src/lib/supabase-utils.ts` will work with these tables.

---

## Troubleshooting

### "ERROR: 42701: column "..." of relation "..." already exists"
- This means the table/column already exists - it's safe to ignore or use the "if not exists" versions

### "ERROR: 42P01: relation "..." does not exist"
- A table is referenced but doesn't exist - make sure you create tables in order (profiles → requests → messages)

### "Table not showing in Database tab"
- Refresh the page or wait a few seconds

---

## 🎉 Success!

Your Supabase database is now fully configured and linked to your Bhutan Connects app!

You can now:
- Create user profiles
- Handle connection requests
- Send messages between users
- Manage packages and destinations
- All with real-time synchronization!
