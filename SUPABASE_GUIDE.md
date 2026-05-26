# Supabase Database Setup Guide - Bhutan Connects

## ✅ Setup Steps

### Step 1: Environment Configuration ✓
Your `.env` file has been created with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://vkbkbgqzjcvzwlgotncs.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_PjTVaH_ij7SmInwPiIDdfw_7K5_Cy_X
```

**Note:** The `.env` file is already added to `.gitignore` and won't be committed to version control.

### Step 2: Create Database Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/vkbkbgqzjcvzwlgotncs
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the SQL from `supabase-setup.sql` in the project root
5. Click **Run** to execute the SQL

This will create:
- `connect_profiles` - User profiles for BhutanConnects
- `connection_requests` - Connection requests between users
- `messages` - Direct messaging between users
- `packages` - Tour packages
- `destinations` - Travel destinations

### Step 3: Verify the Setup

After running the SQL, you should see all tables in your database. You can verify by:
1. Going to **Database** → **Tables** in Supabase
2. You should see: `connect_profiles`, `connection_requests`, `messages`, `packages`, `destinations`

---

## 📚 Using Supabase in Your App

### Importing Utilities
All database operations are available in `src/lib/supabase-utils.ts`:

```typescript
import { 
  connectProfiles, 
  connectionRequests, 
  messages, 
  packages, 
  destinations 
} from "@/lib/supabase-utils";
```

### Example: User Profiles

#### Create a Profile
```typescript
const newProfile = await connectProfiles.create({
  id: "user-123",
  name: "John Doe",
  email: "john@example.com",
  age: 28,
  gender: "Male",
  bio: "Love hiking and culture",
  is_host: true,
  is_looking_for_buddy: false,
});
```

#### Get a Profile
```typescript
const profile = await connectProfiles.getById("user-123");
```

#### Update a Profile
```typescript
await connectProfiles.updateProfile("user-123", {
  bio: "Updated bio",
  interests: ["hiking", "culture", "food"],
});
```

#### Get Public Profiles
```typescript
const hosts = await connectProfiles.getPublicProfiles({
  is_host: true,
});

const buddyFinders = await connectProfiles.getPublicProfiles({
  is_looking_for_buddy: true,
});
```

#### Subscribe to Profile Changes (Real-time)
```typescript
const unsubscribe = connectProfiles.subscribe((payload) => {
  console.log("Profile updated:", payload);
});

// Clean up when component unmounts
return () => unsubscribe();
```

---

### Example: Connection Requests

#### Send a Connection Request
```typescript
await connectionRequests.send(
  "from-user-id",
  "to-user-id",
  "Hi! I'd love to connect!"
);
```

#### Get Received Requests
```typescript
const receivedRequests = await connectionRequests.getReceivedRequests("user-id");
```

#### Accept/Reject Requests
```typescript
await connectionRequests.updateStatus("request-id", "accepted");
// or "rejected" or "blocked"
```

#### Subscribe to Connection Requests
```typescript
const unsubscribe = connectionRequests.subscribe("user-id", (payload) => {
  console.log("New connection request:", payload);
});
```

---

### Example: Messaging

#### Send a Message
```typescript
await messages.send("from-user-id", "to-user-id", "Hello!");
```

#### Get Conversation
```typescript
const conversation = await messages.getConversation("user-1", "user-2");
```

#### Mark Messages as Read
```typescript
await messages.markAsRead(["message-id-1", "message-id-2"]);
```

#### Subscribe to New Messages
```typescript
const unsubscribe = messages.subscribe("user-id", (payload) => {
  console.log("New message received:", payload);
});
```

---

### Example: Packages & Destinations

#### Get All Packages
```typescript
const allPackages = await packages.getAll();
```

#### Get Package by ID
```typescript
const pkg = await packages.getById("package-123");
```

#### Get All Destinations
```typescript
const allDestinations = await destinations.getAll();
```

---

## 🔐 Authentication Integration

To connect with Supabase Authentication:

```typescript
import { supabase, isSupabaseEnabled } from "@/lib/supabase";

// Sign up
const { data, error } = await supabase!.auth.signUp({
  email: "user@example.com",
  password: "password123",
});

// Sign in
const { data, error } = await supabase!.auth.signInWithPassword({
  email: "user@example.com",
  password: "password123",
});

// Get current user
const { data: { user } } = await supabase!.auth.getUser();

// Sign out
await supabase!.auth.signOut();

// Listen to auth changes
supabase!.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  console.log("Session:", session);
});
```

---

## 🚀 Using React Hooks with Supabase

Here's an example hook for managing user profiles:

```typescript
import { useEffect, useState } from "react";
import { connectProfiles } from "@/lib/supabase-utils";

export const useUserProfile = (userId: string) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await connectProfiles.getById(userId);
        setProfile(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Subscribe to real-time updates
    const unsubscribe = connectProfiles.subscribe((payload) => {
      if (payload.new.id === userId) {
        setProfile(payload.new);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  return { profile, loading, error };
};
```

---

## 🛠️ Troubleshooting

### "Supabase not configured" Error
- Make sure your `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart your dev server after adding `.env`

### Database Connection Issues
- Verify your URL is correct (should start with `https://`)
- Check that your Anon Key is correct
- Make sure the tables are created in your database

### Real-time Not Working
- Ensure real-time is enabled for each table in Supabase
- The SQL script already enables this automatically

### Row Level Security (RLS) Issues
- RLS policies are already configured in `supabase-setup.sql`
- Users can only access their own data and public profiles

---

## 📖 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ✨ Features Enabled

✅ **User Profiles** - Store and manage user information  
✅ **Connection Requests** - Request to connect with hosts/buddies  
✅ **Real-time Messaging** - Live chat between users  
✅ **Packages & Destinations** - Tour package management  
✅ **Real-time Sync** - All changes sync instantly across users  
✅ **Row Level Security** - Users can only access their own data  
✅ **Automatic Timestamps** - Audit trail for all records  

---

**Setup Complete! 🎉**

Your Supabase database is now connected and ready to use.
