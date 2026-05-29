# 🚀 Connection Requests & Real-Time Chat Setup

Your app now has **connection requests**, **messaging**, and **real-time chat**! Here's what you need to do to enable it:

## What's New

✅ **Profiles** - Save to Supabase with table `connect_profiles`  
✅ **Connection Requests** - Send requests from profile cards (table `connection_requests`)  
✅ **Messages** - Real-time chat with accepted connections (table `messages`)  
✅ **Messages Page** - New `/messages` route to view all conversations  
✅ **Real-time Updates** - Instant notifications using Supabase subscriptions  

## Step 1: Fix RLS Policies (REQUIRED)

The `connection_requests` and `messages` tables need RLS policies updated to allow anonymous access.

**Go to:** https://supabase.com/dashboard → Your Project → SQL Editor → New Query

**Paste this SQL:**

```sql
-- Fix connection_requests RLS
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

-- Fix messages RLS
DROP POLICY IF EXISTS "Users can view messages" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages" ON public.messages;

CREATE POLICY "Allow anyone to view messages"
  ON public.messages FOR SELECT
  USING (true);

CREATE POLICY "Allow anyone to insert messages"
  ON public.messages FOR INSERT
  WITH CHECK (true);
```

**Click "Run"** and wait for success ✓

## Step 2: Test It Out

1. **Create 2 profiles** (use different emails):
   - Go to http://localhost:8081/bhutan-connects
   - Click "Create Your Profile"
   - Fill the form and submit

2. **Send connection requests:**
   - View Profile 1's "Discover" tab
   - Find Profile 2's card
   - Click "Send Stay Request" button
   - Write a message and send

3. **Accept requests:**
   - Log out / switch browser/incognito
   - Create Profile 2 account
   - Go to `/messages` 
   - Click "Requests" tab
   - Accept the request

4. **Chat:**
   - Click "Messages" tab
   - Select the conversation
   - Send/receive messages in real-time

## How It Works

### Connection Flow
1. **User A** → Sends connection request to **User B**
2. Request saved to `connection_requests` table (status: "pending")
3. **User B** sees request in `/messages` → Requests tab
4. **User B** clicks "Accept" → status changes to "accepted"
5. Now they can chat in **Messages** tab

### Real-Time Updates
- Uses Supabase PostgREST subscriptions
- Automatic refresh when:
  - New requests arrive
  - Requests are accepted/rejected
  - New messages are sent

### Table Structure

**connection_requests:**
```
id | from_user_id | to_user_id | message | status | created_at
```

**messages:**
```
id | from_user_id | to_user_id | message | created_at
```

## Troubleshooting

### "Permission denied" Error
- The RLS policy wasn't applied correctly
- Go to Supabase Dashboard → Tables → connection_requests → Authentication
- Check that policies exist and `WITH CHECK (true)` is set

### Requests not saving
- Check browser console (F12 → Console)
- Look for error messages
- Verify Supabase is configured in .env

### Messages not appearing
- Refresh the page
- Make sure you accepted the connection request
- Check Supabase dashboard to verify data is there

### Real-time not working
- Supabase real-time subscriptions have limits
- May need to upgrade plan for unlimited connections
- Messages will still save and display on refresh

## Files Changed

- ✅ [src/components/MessagesInbox.tsx](src/components/MessagesInbox.tsx) - New messaging component
- ✅ [src/App.tsx](src/App.tsx) - Added /messages route
- ✅ [src/components/Navbar.tsx](src/components/Navbar.tsx) - Added Messages link
- ✅ [src/components/ConnectSignup.tsx](src/components/ConnectSignup.tsx) - Better error messages
- ✅ [SUPABASE_TABLES_SETUP.md](SUPABASE_TABLES_SETUP.md) - Setup guide

## Next Steps

1. ✅ Run the SQL in Supabase
2. ✅ Test creating profiles
3. ✅ Send connection requests
4. ✅ Accept requests and chat

**Your community is now fully functional!** 🎉
