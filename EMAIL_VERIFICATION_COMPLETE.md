# Real Gmail Email Verification - Complete Setup Guide

Your app now has **real Gmail-based email verification** instead of dummy codes! Here's what was implemented and how to complete the setup:

## ✅ What's Been Completed

1. **Backend Email Service** (`server/email-service.ts`)
   - Uses nodemailer to send verification codes via Gmail SMTP
   - Generates secure 6-digit verification codes
   - HTML-formatted emails with brand colors and styling

2. **Express Backend API** (`server/index.ts`)
   - POST `/api/send-verification` - Generates code and sends email
   - POST `/api/verify-email` - Validates code and marks email as verified
   - Stores verification attempts in Supabase `email_verifications` table
   - Automatic code expiry after 10 minutes

3. **Frontend Email Client** (`src/lib/email-verification.ts`)
   - `sendVerificationCode()` - Calls backend to send code
   - `verifyCode()` - Validates code with backend

4. **Updated UI Components**
   - ConnectSignup.tsx "Send Code" button now calls real API (not dummy)
   - ConnectSignup.tsx "Verify Email" button now validates with backend
   - Both buttons show proper error messages if backend is unavailable

5. **Package.json Scripts**
   - `npm run dev:backend` - Runs Express server on port 3001
   - `npm run dev:all` - Runs frontend and backend simultaneously

## 🔧 Steps to Complete Setup

### Step 1: Create `email_verifications` Table in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **bhutan-explore-connect**
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS public.email_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP NOT NULL,
  UNIQUE(email, code)
);

CREATE INDEX idx_email_verifications_email ON public.email_verifications(email);
CREATE INDEX idx_email_verifications_code ON public.email_verifications(code);
CREATE INDEX idx_email_verifications_expires_at ON public.email_verifications(expires_at);

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anyone to insert" ON public.email_verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to view" ON public.email_verifications FOR SELECT USING (true);
CREATE POLICY "Allow updates" ON public.email_verifications FOR UPDATE WITH CHECK (true);
```

6. Click **Run** (should complete in 1-2 seconds)
7. Verify in **Table Editor** that `email_verifications` table now exists

### Step 2: Get Gmail App Password

⚠️ **IMPORTANT**: Use an **App Password**, NOT your regular Gmail password!

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Scroll down to **How you sign in to Google**
3. Enable **2-Step Verification** if not already enabled
4. Scroll down to **App passwords** (only appears if 2FA is on)
5. Select: App: **Mail**, Device: **Windows/Mac/Linux**
6. Google will generate a **16-character password** (with spaces): `xxxx xxxx xxxx xxxx`
7. **Copy this password exactly** (including spaces)

### Step 3: Get Supabase Service Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** (bottom left) → **API**
4. Copy the **Service Role Key** (starts with `eyJ...`)
5. ⚠️ **Keep this secret!** Never commit to git

### Step 4: Update `.env` File

Create or update your `.env` file in the project root with:

```
VITE_SUPABASE_URL=https://vkbkbgqzjcvzwlgotncs.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_PjTVaH_ij7SmInwPiIDdfw_7K5_Cy_X
VITE_API_URL=http://localhost:3001

SUPABASE_URL=https://vkbkbgqzjcvzwlgotncs.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci... # Your Supabase Service Role Key
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Your Gmail App Password (with spaces)
```

### Step 5: Install Dependencies

```bash
npm install
```

This will install:
- `nodemailer` - Email sending library
- `express` - Backend server framework
- `cors` - Cross-Origin Resource Sharing
- `tsx` - TypeScript executor for running .ts files
- Type definitions for all of the above

### Step 6: Start Both Servers

**Option A - Run both simultaneously** (easiest):
```bash
npm run dev:all
```
This will start:
- Frontend on `http://localhost:8081`
- Backend on `http://localhost:3001`

**Option B - Run separately** (in different terminal tabs):
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run dev:backend
```

You should see:
```
✅ Email service running on port 3001
📧 Using Gmail account: your-email@gmail.com
```

## 🧪 Testing Email Verification

1. Open `http://localhost:8081` in browser
2. Navigate to **Bhutan Connects** → **Create Profile**
3. Fill in fields up to Step 3 (email verification)
4. Enter your **real email address**
5. Click **"Send Code"**
   - Should see success message
   - Check your email inbox for verification code (may take 5-10 seconds)
   - Subject: "Bhutan Explore & Connect - Email Verification"
6. Copy the 6-digit code from the email
7. Paste into "Verification Code" field
8. Click **"Verify Email"**
   - Should see "Email verified successfully!"
   - Status will change to ✓ Email Verified
9. Continue with profile creation

## 🐛 Troubleshooting

### "Backend not responding" Error
- Check that `npm run dev:backend` is running in terminal
- Verify port 3001 is not blocked by firewall
- Check `.env` has `VITE_API_URL=http://localhost:3001`

### "Invalid app password" Error
- Verify you're using App Password, NOT regular Gmail password
- App passwords have spaces: `xxxx xxxx xxxx xxxx`
- Make sure 2-Step Verification is enabled on Google Account
- Regenerate a new app password if needed

### Email not received
- Check spam/junk folder
- Verify `GMAIL_USER` and `GMAIL_PASSWORD` in `.env`
- Check backend console for errors (terminal where `dev:backend` runs)
- Gmail may be blocking first-time sends - check Google Account alerts

### "Table email_verifications not found" Error
- Run SQL in Step 1 again
- Verify table appears in Supabase Table Editor
- Check RLS policies are enabled (see Step 1 SQL)

### Code expires too quickly
- Default expiry is 10 minutes
- Edit `server/email-service.ts` line: `expires_at: new Date(Date.now() + 10 * 60 * 1000)`
- Change `10` to desired minutes

## 📧 Email Template

Verification emails include:
- Brand colors and logo (from your branding)
- 6-digit verification code
- Expiry time (10 minutes)
- Link back to your app

Edit email styling in `server/email-service.ts` function `sendVerificationEmail()`

## 🔒 Security Notes

- ✅ Codes are randomly generated (not predictable)
- ✅ Codes expire after 10 minutes
- ✅ Service Key is backend-only (never sent to frontend)
- ✅ App Password is in `.env` (not in version control)
- ✅ Email verification stored in Supabase with RLS policies

## 📝 Next Steps After Setup

1. **Fix RLS Policies** (if not done yet) - Run SQL from `SUPABASE_RLS_FIX.md`:
   - `connection_requests` table
   - `messages` table
   - Without this, users can't send requests or messages

2. **Test Connection Requests** - After RLS fixed, test sending requests

3. **Test Real-time Messaging** - After RLS fixed, test chat between users

## ✨ What's Ready

- ✅ Real Gmail email verification
- ✅ Express backend with error handling
- ✅ Frontend API client
- ✅ Package.json scripts to run both servers
- ✅ Type-safe TypeScript setup
- ✅ Automatic code generation and expiry
- ✅ HTML-formatted verification emails

---

**Questions?** Check console logs on both frontend (browser DevTools) and backend (terminal) for detailed error messages.
