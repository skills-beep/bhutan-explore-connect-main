-- ================================================
-- SUPABASE DATABASE SETUP FOR BHUTAN CONNECTS
-- Run each section separately in SQL Editor
-- ================================================

-- ===============================================
-- SECTION 1: CREATE CONNECT_PROFILES TABLE
-- ===============================================

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
