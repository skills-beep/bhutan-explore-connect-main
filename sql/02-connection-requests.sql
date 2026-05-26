-- Connection Requests Table
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