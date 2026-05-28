# 🚀 Setup Supabase Tables (Quick Guide)

**✅ Good news!** Both `connect_profile` and `connect_profiles` tables already exist in your Supabase database.

The code is now configured to use the `connect_profile` table. Try creating a profile now:

## Test Your App

1. Go back to your app at `http://localhost:5173`
2. Go to "Bhutan Connects" section
3. Create a new profile 
4. You should see: **"✅ Profile created successfully and saved online in Supabase!"**

If the profile saves successfully, you're done! The table exists and everything is working.

## If It Still Doesn't Work

If you see an error, check these things:

### Check the Exact Error

1. Open your browser console (F12 → Console tab)
2. Try creating a profile again
3. Look for error messages - they will tell you what's wrong

### Common Issues

**Error: "relation does not exist"**
- The table name might be different than expected
- Check your Supabase dashboard: Tables section to see the exact table name
- Update the code if needed

**Error: "permission denied"**
- The Row Level Security (RLS) policies may be blocking inserts
- Try temporarily disabling RLS on the table:
  1. Go to Supabase Dashboard → Tables
  2. Click on `connect_profile` table
  3. Click "Authentication" tab
  4. Toggle off "Enable RLS" temporarily
  5. Try saving a profile
  6. If it works, you need to adjust the RLS policies

**Profile shows success but doesn't appear in Supabase**
- Check if it's actually saving to the table
- Go to Supabase Dashboard → Tables → `connect_profile`
- You should see new rows appear when you create profiles

## Still Having Issues?

1. Share the exact error message from the browser console
2. Verify the `.env` file has:
   ```
   VITE_SUPABASE_URL=https://vkbkbgqzjcvzwlgotncs.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_PjTVaH_ij7SmInwPiIDdfw_7K5_Cy_X
   ```
3. Restart your dev server if you made any changes

## ✅ Once It Works

- ✅ New profiles save to Supabase
- ✅ Other users can see your profiles
- ✅ Data persists online
- ✅ Real-time sync enabled

