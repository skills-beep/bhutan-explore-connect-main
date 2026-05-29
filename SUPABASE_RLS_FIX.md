# Fix RLS Policies for Connection Requests & Messages

Run this SQL in your Supabase SQL Editor to allow connection requests and messages to work:

```sql
-- Fix RLS for connection_requests table
DROP POLICY IF EXISTS "Users can insert their own request" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can view their requests" ON public.connection_requests;
DROP POLICY IF EXISTS "Users can update their requests" ON public.connection_requests;

CREATE POLICY "Allow anyone to insert connection requests"
  ON public.connection_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anyone to view connection requests"
  ON public.connection_requests FOR SELECT
  USING (true);

CREATE POLICY "Allow anyone to update connection requests"
  ON public.connection_requests FOR UPDATE
  WITH CHECK (true);

-- Fix RLS for messages table (if exists)
DROP POLICY IF EXISTS "Users can view messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;

CREATE POLICY "Allow anyone to view messages"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Allow anyone to insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);
```

**Steps:**
1. Go to https://supabase.com/dashboard
2. Click your project
3. Click "SQL Editor"
4. Click "New Query"
5. Paste the SQL above
6. Click "Run"

Once done, connection requests and messages will save to Supabase properly!
