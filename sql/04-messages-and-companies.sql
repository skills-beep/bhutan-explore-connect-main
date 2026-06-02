-- ================================================
-- BHUTAN CONNECTS: MESSAGES + COMPANIES + RLS
-- ================================================
-- Run in Supabase SQL Editor (New Query).
-- This file is additive: it does not modify existing tables
-- except adding a company_id column on connect_profiles.

-- ------------------------------------------------
-- 1) MESSAGES TABLE
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id TEXT NOT NULL REFERENCES public.connect_profiles(id) ON DELETE CASCADE,
  to_user_id TEXT NOT NULL REFERENCES public.connect_profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_from_to ON public.messages(from_user_id, to_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- ------------------------------------------------
-- 2) COMPANIES + COMPANY_USERS + OWNERSHIP
-- ------------------------------------------------

CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.company_users (
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES public.connect_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (company_id, user_id)
);

-- Link company-owned profiles to a company
ALTER TABLE public.connect_profiles
  ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_connect_profiles_company_id ON public.connect_profiles(company_id);

-- ------------------------------------------------
-- 3) REAL-TIME (optional but recommended)
-- ------------------------------------------------
-- If you already use Supabase Realtime, ensure these tables are published.
-- Safe to run even if publication name differs; if your project uses a different publication,
-- adjust accordingly.
DO $$
BEGIN
  -- Add tables to realtime publication if it exists.
  -- In Supabase, publication is typically `supabase_realtime`.
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.companies;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.company_users;
  END IF;
END $$;

-- ------------------------------------------------
-- 4) RLS POLICIES
-- ------------------------------------------------
-- Enable RLS where needed
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_profiles ENABLE ROW LEVEL SECURITY;

-- ---- messages: SELECT/INSERT for participants
DROP POLICY IF EXISTS "messages_select_participants" ON public.messages;
CREATE POLICY "messages_select_participants"
  ON public.messages
  FOR SELECT
  USING (
    from_user_id = auth.uid()::text
    OR to_user_id = auth.uid()::text
  );

DROP POLICY IF EXISTS "messages_insert_participants" ON public.messages;
CREATE POLICY "messages_insert_participants"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    from_user_id = auth.uid()::text
  );

-- ---- connect_profiles: public read for public profiles
DROP POLICY IF EXISTS "profiles_public_select" ON public.connect_profiles;
CREATE POLICY "profiles_public_select"
  ON public.connect_profiles
  FOR SELECT
  USING (profile_visibility = 'public' OR profile_visibility IS NULL);

-- ---- connect_profiles: company users can update only their own company-owned profiles
-- Company users update profiles where:
--   connect_profiles.company_id = company_users.company_id
--   and company_users.user_id = auth.uid()
DROP POLICY IF EXISTS "company_users_update_own_company_profiles" ON public.connect_profiles;
CREATE POLICY "company_users_update_own_company_profiles"
  ON public.connect_profiles
  FOR UPDATE
  USING (
    company_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.company_users cu
      WHERE cu.user_id = auth.uid()::text
        AND cu.company_id = connect_profiles.company_id
    )
  )
  WITH CHECK (
    company_id IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.company_users cu
      WHERE cu.user_id = auth.uid()::text
        AND cu.company_id = connect_profiles.company_id
    )
  );

-- ---- companies: company users can read their company (optional)
DROP POLICY IF EXISTS "companies_select_own_company" ON public.companies;
CREATE POLICY "companies_select_own_company"
  ON public.companies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.company_users cu
      WHERE cu.company_id = companies.id
        AND cu.user_id = auth.uid()::text
    )
  );

-- ---- company_users: only company members can see mapping (optional)
DROP POLICY IF EXISTS "company_users_select_own_company" ON public.company_users;
CREATE POLICY "company_users_select_own_company"
  ON public.company_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.company_users cu2
      WHERE cu2.company_id = company_users.company_id
        AND cu2.user_id = auth.uid()::text
    )
  );

-- ------------------------------------------------
-- 5) GUARDRAILS: prevent company_id changes by company users
-- If you want to completely lock company_id, a trigger is best.
-- Here we implement a simple trigger to keep company_id unchanged on UPDATE.
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION prevent_company_id_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only enforce when company_id is being changed
  IF NEW.company_id IS DISTINCT FROM OLD.company_id THEN
    -- Allow setting only when OLD is NULL (e.g., first-time ownership assignment)
    -- Otherwise block.
    IF OLD.company_id IS NOT NULL THEN
      RAISE EXCEPTION 'company_id cannot be changed';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_prevent_company_id_change ON public.connect_profiles;
CREATE TRIGGER tr_prevent_company_id_change
BEFORE UPDATE OF company_id, name, email, age, gender, bio, profile_photo, id_card_scan, face_photo,
  email_verified, travel_group_code, emergency_contact_name, emergency_contact_phone,
  languages, interests, verified, is_host, is_looking_for_buddy, host_details, buddy_details, profile_visibility
ON public.connect_profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_company_id_change();
