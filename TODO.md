# TODO - Bhutan Connects DB + Company Editing + Real-time

- [ ] Read current connect/message/profile flows in frontend (already partially done)
- [ ] Add SQL for:
  - [ ] `public.messages` table (for DB-backed chat)
  - [ ] `public.companies`, `public.company_users`, and `connect_profiles.company_id`
  - [ ] RLS policies for companies to update only their own profiles
  - [ ] Ensure real-time publication includes new tables
- [ ] Update frontend to use DB directly:
  - [ ] Replace `src/components/Messages.tsx` (currently mock) with DB-backed UI
  - [ ] Update `src/components/MessagesInbox.tsx` to remove `/api/*` dependency and use Supabase directly
- [ ] Update profile saving:
  - [ ] Replace mock `src/components/UserProfileManager.tsx` to insert/update `connect_profiles`
  - [ ] Ensure `BhutanConnectsPage` and `ConnectCommunity` subscribe to UPDATE events
- [ ] Update company “connect section” behavior:
  - [ ] Add company-owned profile editing UI (or make existing `/profile` page editable by company users)
  - [ ] Ensure real-time updates reflect for link/users
- [ ] Testing:
  - [ ] Validate Supabase inserts/updates with auth.uid() and RLS
  - [ ] Validate real-time updates on profile/request/message changes
