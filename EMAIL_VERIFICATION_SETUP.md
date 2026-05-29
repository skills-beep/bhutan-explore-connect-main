# Email Verification Setup

## Step 1: Create Email Verification Table in Supabase

Go to **Supabase Dashboard → SQL Editor** and run this SQL:

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

-- Enable RLS
ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Allow inserts and selects
CREATE POLICY "Allow anyone to insert"
  ON public.email_verifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow anyone to view"
  ON public.email_verifications FOR SELECT
  USING (true);

CREATE POLICY "Allow updates"
  ON public.email_verifications FOR UPDATE
  WITH CHECK (true);
```

## Step 2: Get Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Factor Authentication**
3. Go to **App Passwords**
4. Select "Mail" and "Windows Computer" (or your device)
5. Copy the 16-character password

## Step 3: Configure Environment Variables

Add to your `.env` file:

```
# Gmail Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Your app password (16 chars)

# Supabase Service Key (for backend)
SUPABASE_SERVICE_KEY=your-service-key
```

Get your service key from Supabase:
1. Go to Dashboard → Settings → API
2. Copy "Service Role Key" (NOT anon key)

## Step 4: Install Dependencies

```bash
npm install nodemailer cors express-cors
npm install --save-dev @types/nodemailer @types/express
```

## Step 5: Run Backend Server

```bash
npm run dev:backend
```

This starts the email service on `http://localhost:3001`

## Step 6: Update Frontend

The frontend will automatically call:
- `POST /api/send-verification` - Send verification code
- `POST /api/verify-email` - Verify the code

## How It Works

1. User enters email during signup
2. Click "Send Verification Code"
3. Backend generates 6-digit code
4. Code sent to email via Gmail
5. User enters code in app
6. Backend verifies and marks email as verified
7. Profile can be created

## Email Features

- ✅ Professional HTML email template
- ✅ 10-minute code expiration
- ✅ One-time use codes
- ✅ Real-time verification
- ✅ Error handling

## Troubleshooting

### "GMAIL_PASSWORD not configured"
- Make sure you're using app password, not regular password
- Add GMAIL_USER and GMAIL_PASSWORD to .env
- Restart the backend server

### "Failed to send email"
- Check Gmail account security settings
- Verify 2FA is enabled
- Check app password is correct
- Check internet connection

### "Invalid or expired code"
- Code expires after 10 minutes
- Request a new code
- Verify you're entering the correct code

## Files Added

- `server/email-service.ts` - Email sending logic
- `server/index.ts` - Express backend API
- `server/supabase-config.ts` - Supabase connection
