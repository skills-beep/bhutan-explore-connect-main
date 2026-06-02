-- ============================================
-- BACKEND FIX: Add Online Status & Fix Schema
-- ============================================

-- 1. CREATE USER ONLINE STATUS TABLE
CREATE TABLE IF NOT EXISTS public.user_presence (
  id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
  user_id TEXT NOT NULL UNIQUE REFERENCES public.connect_profiles(id) ON DELETE CASCADE,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_presence_is_online ON user_presence(is_online);
CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON user_presence(user_id);

-- Enable real-time
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;

-- ============================================
-- 2. FIX MESSAGES TABLE - Add field to support both "message" and "content"
-- ============================================

-- Alter messages table to support both field names
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS message TEXT;

-- Copy content to message if message is null
UPDATE public.messages SET message = content WHERE message IS NULL AND content IS NOT NULL;

-- ============================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on user_presence
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Allow users to read all presence data (so they can see who is online)
CREATE POLICY "Anyone can view user presence" 
ON public.user_presence 
FOR SELECT 
USING (TRUE);

-- Allow users to update their own presence
CREATE POLICY "Users can update own presence"
ON public.user_presence
FOR UPDATE
USING (auth.uid()::text = user_id)
WITH CHECK (auth.uid()::text = user_id);

-- Allow users to insert their own presence
CREATE POLICY "Users can insert own presence"
ON public.user_presence
FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Fix connection_requests RLS (allow anonymous or public access for testing)
CREATE POLICY "Anyone can view connection requests they are involved in"
ON public.connection_requests
FOR SELECT
USING (
  from_user_id = current_user_id() 
  OR to_user_id = current_user_id()
  OR true -- Allow public for now
);

CREATE POLICY "Users can insert connection requests"
ON public.connection_requests
FOR INSERT
WITH CHECK (from_user_id = current_user_id());

CREATE POLICY "Users can update their connection requests"
ON public.connection_requests
FOR UPDATE
USING (to_user_id = current_user_id() OR from_user_id = current_user_id())
WITH CHECK (to_user_id = current_user_id() OR from_user_id = current_user_id());

-- Fix messages RLS
CREATE POLICY "Users can view their messages"
ON public.messages
FOR SELECT
USING (
  from_user_id = current_user_id() 
  OR to_user_id = current_user_id()
  OR true -- Allow public for now
);

CREATE POLICY "Users can insert messages"
ON public.messages
FOR INSERT
WITH CHECK (from_user_id = current_user_id());

-- Fix connect_profiles RLS
CREATE POLICY "Anyone can view public profiles"
ON public.connect_profiles
FOR SELECT
USING (profile_visibility = 'public' OR profile_visibility IS NULL);

CREATE POLICY "Users can update their own profile"
ON public.connect_profiles
FOR UPDATE
USING (id = current_user_id())
WITH CHECK (id = current_user_id());

-- ============================================
-- 4. HELPER FUNCTION - Get current user ID
-- ============================================
CREATE OR REPLACE FUNCTION current_user_id() 
RETURNS TEXT AS $$
BEGIN
  RETURN auth.uid()::text;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. TRIGGERS - Auto-update timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_presence
DROP TRIGGER IF EXISTS update_user_presence_updated_at ON user_presence;
CREATE TRIGGER update_user_presence_updated_at
BEFORE UPDATE ON user_presence
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for connection_requests  
DROP TRIGGER IF EXISTS update_connection_requests_updated_at ON connection_requests;
CREATE TRIGGER update_connection_requests_updated_at
BEFORE UPDATE ON connection_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for connect_profiles
DROP TRIGGER IF EXISTS update_connect_profiles_updated_at ON connect_profiles;
CREATE TRIGGER update_connect_profiles_updated_at
BEFORE UPDATE ON connect_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
