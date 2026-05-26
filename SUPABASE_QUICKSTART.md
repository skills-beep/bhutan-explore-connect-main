# 🚀 Supabase Setup - Quick Start

## Status: ✅ CONFIGURED & READY

Your Supabase project is now **fully configured** and **linked** to your Bhutan Connects app!

---

## 📋 What's Done

✅ **Credentials configured** in `.env` file  
✅ **Database utilities** created in `src/lib/supabase-utils.ts`  
✅ **SQL schema** files ready for import  
✅ **Setup guides** provided  

---

## 🎯 DO THIS NOW: Create Database Tables

### 1 Minute Setup:
1. Go to: **https://supabase.com/dashboard/project/vkbkbgqzjcvzwlgotncs/sql/new**
2. Open file: **`MANUAL_SETUP.md`** in this project
3. Copy & paste each SQL section
4. Click "Run" for each one
5. Done! ✅

---

## ✨ Files Created for You

```
Project Root/
├── .env                          # Your Supabase credentials (KEEP SECURE)
├── MANUAL_SETUP.md              # Step-by-step table creation
├── SUPABASE_CONNECTED.md        # Full integration overview
├── SUPABASE_GUIDE.md            # Comprehensive documentation
├── supabase-setup.sql           # Complete database schema
├── sql/
│   ├── 01-connect-profiles.sql
│   ├── 02-connection-requests.sql
│   └── setup-simple.sql
├── scripts/
│   └── setup-database.js        # (Optional) Node setup script
└── src/lib/
    ├── supabase.ts              # Supabase client
    └── supabase-utils.ts        # All database functions
```

---

## 📖 Documentation Files

| File | What It Contains |
|------|-----------------|
| **MANUAL_SETUP.md** | Copy-paste SQL for each table |
| **SUPABASE_GUIDE.md** | Code examples, authentication, hooks |
| **SUPABASE_CONNECTED.md** | Full integration checklist |
| **supabase-setup.sql** | All tables + RLS + indexes |

---

## 💡 Once Tables Are Created

You can immediately start using Supabase in your components:

```typescript
// Import the utilities
import { connectProfiles, messages, packages } from "@/lib/supabase-utils";

// Create a user profile
const profile = await connectProfiles.create({
  id: "user-123",
  name: "John Doe",
  email: "john@example.com",
  age: 28,
  bio: "I love Bhutan!",
  is_host: true,
});

// Get all profiles
const allHosts = await connectProfiles.getPublicProfiles({ is_host: true });

// Send a message
await messages.send("user1", "user2", "Hello!");

// Subscribe to real-time updates
const unsubscribe = connectProfiles.subscribe((payload) => {
  console.log("Profile changed:", payload);
});
```

---

## 🔑 Your Supabase Project

- **URL:** https://vkbkbgqzjcvzwlgotncs.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/vkbkbgqzjcvzwlgotncs
- **SQL Editor:** https://supabase.com/dashboard/project/vkbkbgqzjcvzwlgotncs/sql/new

---

## 🆘 Need Help?

- **Tables not created?** → Follow `MANUAL_SETUP.md`
- **Want code examples?** → Check `SUPABASE_GUIDE.md`
- **Integration overview?** → See `SUPABASE_CONNECTED.md`
- **Need SQL reference?** → Open `supabase-setup.sql`

---

## ✅ Verification

After creating tables, you should see these in your Supabase dashboard:

```
✓ connect_profiles
✓ connection_requests  
✓ messages
✓ packages
✓ destinations
```

---

**You're all set! 🎉**

Next step → Open `MANUAL_SETUP.md` and create your tables in Supabase.
