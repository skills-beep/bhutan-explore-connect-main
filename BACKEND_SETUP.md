# Backend Setup & Configuration Guide

## Overview

Your backend now has complete messaging, connection requests, and online presence tracking functionality.

---

## 1. Database Setup (Supabase)

### Run the Backend Fixes SQL

Go to your Supabase dashboard → SQL Editor and run the file:

**File:** `sql/03-backend-fixes.sql`

This creates:
- ✅ `user_presence` table - Track online/offline status
- ✅ Field compatibility for messages table
- ✅ RLS policies for secure access
- ✅ Auto-update timestamp triggers

**OR run this manually in SQL Editor:**

```sql
-- Copy contents from /sql/03-backend-fixes.sql
-- Paste and execute in Supabase SQL Editor
```

### Verify Tables Created

```sql
-- Check tables exist
\dt user_presence;
\dt connection_requests;
\dt messages;
\dt connect_profiles;

-- Check columns
\d messages;
\d user_presence;
```

---

## 2. Environment Variables Setup

Create or update your `.env` file in the root directory:

```env
# Supabase (Frontend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# API Server (Backend)
VITE_API_URL=http://localhost:3001

# Backend Server Port
PORT=3001

# Backend Supabase (Service Role Key - KEEP SECURE!)
SUPABASE_SERVICE_KEY=your-service-role-key
```

### Get Your Keys from Supabase:
1. Go to Supabase Dashboard → Settings → API
2. Copy `Project URL` → `VITE_SUPABASE_URL`
3. Copy `anon public` key → `VITE_SUPABASE_ANON_KEY`
4. Copy `service_role` key → `SUPABASE_SERVICE_KEY` (⚠️ NEVER commit this)

---

## 3. Start the Backend Server

### Option A: Using Node.js directly

```bash
# Install dependencies
npm install

# Start backend (keep running)
npm run server
```

Output should show:
```
✅ Email service running on port 3001
```

### Option B: Using Nodemon (auto-restart on changes)

```bash
npm install -D nodemon
npx nodemon server/index.ts
```

---

## 4. Start the Frontend Development Server

In a **new terminal**:

```bash
npm run dev
```

The app should be running at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

---

## 5. Test the Backend Endpoints

### Using curl or Postman:

#### A. Update User Presence (Go Online)

```bash
curl -X POST http://localhost:3001/api/presence/update \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "isOnline": true
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "user123",
    "is_online": true,
    "last_seen_at": "2026-06-01T...",
    "updated_at": "2026-06-01T..."
  }
}
```

#### B. Get Online Users

```bash
curl http://localhost:3001/api/presence/online
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": "user123",
      "is_online": true,
      "last_seen_at": "2026-06-01T..."
    }
  ]
}
```

#### C. Get User Presence

```bash
curl http://localhost:3001/api/presence/user123
```

#### D. Send Connection Request

```bash
curl -X POST http://localhost:3001/api/connection-requests \
  -H "Content-Type: application/json" \
  -d '{
    "fromUserId": "user1",
    "toUserId": "user2",
    "message": "Hey, I would like to connect!"
  }'
```

#### E. Send Message

```bash
curl -X POST http://localhost:3001/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "fromUserId": "user1",
    "toUserId": "user2",
    "message": "Hello! How are you?"
  }'
```

#### F. Get Messages Between Two Users

```bash
curl "http://localhost:3001/api/messages/user1/user2"
```

#### G. Update Connection Request Status

```bash
curl -X PATCH "http://localhost:3001/api/connection-requests/request-id" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted"
  }'
```

---

## 6. Backend API Endpoints

### Presence Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/presence/update` | Update user online status |
| `GET` | `/api/presence/online` | Get all online users |
| `GET` | `/api/presence/:userId` | Get specific user presence |

### Connection Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/connection-requests` | Send connection request |
| `GET` | `/api/connection-requests/:userId` | Get requests for user |
| `PATCH` | `/api/connection-requests/:requestId` | Accept/reject request |

### Messages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/messages` | Send message |
| `GET` | `/api/messages/:fromUserId/:toUserId` | Get messages between users |
| `PATCH` | `/api/messages/:messageId/read` | Mark message as read |

### Email Verification

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/send-verification` | Send verification email |
| `POST` | `/api/verify-email` | Verify email code |

---

## 7. Frontend Integration

The MessagesInbox component now:

✅ **Sends presence updates** when component mounts
- Sets user as online
- Sets user as offline when component unmounts

✅ **Shows online status**
- Green dot next to online users
- "Online now" badge in conversation list
- "Online" badge in chat header

✅ **Real-time updates**
- Subscribes to message changes
- Subscribes to request changes
- Subscribes to presence changes

✅ **Uses backend endpoints**
- POST messages via `/api/messages`
- Accept/reject requests via `/api/connection-requests/:id`
- Accept/reject requests via PATCH endpoint
- Fetch online users via `/api/presence/online`

---

## 8. Database Schema

### user_presence Table
```sql
- id (UUID, primary key)
- user_id (TEXT, unique, foreign key)
- is_online (BOOLEAN)
- last_seen_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### connection_requests Table
```sql
- id (UUID, primary key)
- from_user_id (TEXT, foreign key)
- to_user_id (TEXT, foreign key)
- message (TEXT)
- status (TEXT: pending|accepted|rejected|blocked)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

### messages Table
```sql
- id (UUID, primary key)
- from_user_id (TEXT, foreign key)
- to_user_id (TEXT, foreign key)
- message (TEXT) - NEW FIELD
- content (TEXT) - kept for compatibility
- read_at (TIMESTAMPTZ, nullable)
- created_at (TIMESTAMPTZ)
```

### connect_profiles Table
```sql
- id (TEXT, primary key)
- name (TEXT)
- email (TEXT, unique)
- age (INTEGER)
- bio (TEXT)
- profilePhoto (TEXT)
- And many more fields...
```

---

## 9. RLS Policies

Your tables now have Row Level Security (RLS) enabled:

✅ **user_presence**
- Anyone can view presence data (so users see who's online)
- Users can only update their own presence

✅ **connection_requests**
- Users can view requests they're involved in
- Users can send and update requests

✅ **messages**
- Users can view their own messages
- Users can insert messages
- Public access enabled for testing

✅ **connect_profiles**
- Anyone can view public profiles
- Users can update their own profile

---

## 10. Troubleshooting

### Backend not starting?

**Check:**
```bash
# Is Node.js installed?
node --version

# Are dependencies installed?
npm list

# Is port 3001 available?
lsof -i :3001
```

### Messages not sending?

**Check:**
1. Backend is running (`npm run server`)
2. `VITE_API_URL` is set correctly
3. Supabase credentials are valid
4. RLS policies are correct
5. Check browser console for errors

### Online status not updating?

**Check:**
1. `/api/presence/update` endpoint is responding
2. User IDs are consistent
3. Supabase `user_presence` table has data

### Can't connect to Supabase?

**Check:**
1. `VITE_SUPABASE_URL` is correct
2. `VITE_SUPABASE_ANON_KEY` is valid
3. Supabase project is active
4. Network connection is working

---

## 11. Testing Workflow

### 1. Create Two Test Profiles
- Go to `/profile`
- Create Profile 1 (User A)
- Create Profile 2 (User B)

### 2. Send Connection Request
- Profile A → `/bhutan-connects` → Send request to User B

### 3. Accept Request
- Profile B → `/messages` → Accept request from User A

### 4. Test Messaging
- Profile A → `/messages` → Select User B → Send message
- Profile B → `/messages` → See message, send reply

### 5. Test Online Status
- Keep Profile A tab open
- Open Profile B in new tab
- See online status update in real-time

---

## 12. Security Notes

⚠️ **Important:**

1. **Never commit** `.env` file or `SUPABASE_SERVICE_KEY`
2. **Keep service role key private** - it has full database access
3. **Use RLS policies** - they're already set up for security
4. **Validate input** on backend - already done in endpoints
5. **Use HTTPS** in production - not required for development

---

## 13. Production Deployment

When deploying to production:

1. Set environment variables on hosting platform
2. Update `VITE_API_URL` to production URL
3. Enable HTTPS for all requests
4. Set up CORS properly for your domain
5. Use environment-specific database credentials
6. Enable rate limiting on API endpoints
7. Add logging and monitoring

---

## Quick Start Checklist

- [ ] Run `sql/03-backend-fixes.sql` in Supabase
- [ ] Create `.env` with Supabase credentials
- [ ] Run `npm install`
- [ ] Start backend: `npm run server`
- [ ] Start frontend: `npm run dev`
- [ ] Create test profiles in app
- [ ] Send connection requests
- [ ] Test messaging
- [ ] Verify online status shows

---

## Support

If issues persist:
1. Check terminal output for error messages
2. Review Supabase logs in dashboard
3. Check browser DevTools console
4. Verify all environment variables are set
5. Restart both frontend and backend servers

**Status:** ✅ Backend Ready for Testing
