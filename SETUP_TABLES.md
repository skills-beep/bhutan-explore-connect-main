# 🚀 Create Supabase Tables - 2 Minute Setup

## Quick Option: Copy & Paste SQL

The simplest way is to copy the SQL from your project and paste it into Supabase:

### Step 1: Copy This SQL
Open this file in your project: `supabase-setup.sql`

### Step 2: Go to Supabase SQL Editor  
https://supabase.com/dashboard/project/vkbkbgqzjcvzwlgotncs/sql/new

### Step 3: Paste & Run
1. Click in the SQL editor
2. Press `Cmd+A` to select all (if needed)
3. Paste the SQL from `supabase-setup.sql`
4. Click the **"Run"** button (blue button with play icon)
5. Wait for completion ✅

---

## All Tables Created Automatically

Your SQL will create:
- ✓ `connect_profiles` - User profiles
- ✓ `connection_requests` - Connection requests  
- ✓ `messages` - Messaging system
- ✓ `packages` - Tour packages
- ✓ `destinations` - Destinations

---

## Alternative: Use Node.js (If You Have Admin Key)

If you have your Supabase admin key (not the public key), you can:

```bash
SUPABASE_URL=https://vkbkbgqzjcvzwlgotncs.supabase.co \\
SUPABASE_ADMIN_KEY=your_admin_key_here \\
node setup-supabase.js
```

Ask your Supabase project owner for the admin key if needed.

---

## ✅ Verification

After running the SQL:

1. Go to: https://supabase.com/dashboard/project/vkbkbgqzjcvzwlgotncs/editor
2. You should see all 5 tables in the sidebar
3. Done! Your app can now use Supabase 🎉

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Tables already exist | That's fine - they're set up! |
| Syntax error in SQL | Copy from `supabase-setup.sql` exactly |
| "Permission denied" | You need the admin key, not anon key |
| Tables not visible | Refresh the page (F5) |

---

**That's it! Your tables are ready after running the SQL.** 🎊
