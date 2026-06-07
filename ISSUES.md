# One Stop Immigration Station — Running Issues Log

**Last updated:** 2026-06-07

---

## 🔴 OPEN ISSUES

### 1. ~~Admin password reset via forgot-password not working~~ ✅ FIXED
- **Fix:** Created `/api/auth/forgot-password` route that uses `admin.auth.admin.generateLink()` + sends via Resend, bypassing Supabase's unreliable email system

### 2. Lawyer "Set My Password" flow — session isolation
- **Symptom:** After setting password via welcome email link, login fails with "Invalid login credentials"
- **Root cause:** When admin is logged in and clicks the lawyer's recovery link in the same browser, `getSession()` returns the admin's cookie session. `updateUser()` then changes the admin's password instead of the lawyer's.
- **Fix applied (2026-06-07):** Explicitly parse `access_token` + `refresh_token` from the URL hash and call `setSession()` to establish the correct lawyer session before `updateUser()`
- **Status:** Testing with lawyer7 — awaiting confirmation

### 3. Supabase OTP tokens are single-use
- **Symptom:** Clicking the welcome email link a second time (after the first click failed) shows "Email link is invalid or has expired"
- **Root cause:** Supabase recovery tokens are consumed on first click even if the page didn't work correctly
- **Workaround:** Delete the lawyer account and recreate to get a fresh link
- **Fix needed:** Make the first click always succeed (fix #2 above resolves this)

---

## ✅ RESOLVED ISSUES

### R1. "Database error creating new user" when creating lawyer
- **Symptom:** Create Lawyer form returned "Database error creating new user"
- **Root cause:** `handle_new_user` trigger tried to insert `role='lawyer'` but original constraint only allowed `beneficiary/sponsor/contact/admin`
- **Fix:** Stop passing `role` in `user_metadata` during user creation — let trigger default to `beneficiary`, then upsert sets it to `lawyer`
- **Also fixed:** Added `lawyer` to the role check constraint in `001_initial_schema.sql` and ran the ALTER TABLE in Supabase SQL Editor

### R2. "Account created but profile update failed: Could not find the 'address' column"
- **Symptom:** Lawyer creation succeeded but profile update failed
- **Root cause:** `address` column was added manually in a previous session but the Supabase schema cache was stale; also the column didn't exist in production
- **Fix:** Ran `alter table public.profiles add column if not exists address text; NOTIFY pgrst, 'reload schema';` in Supabase SQL Editor

### R3. "New password should be different from old password" on first login
- **Symptom:** Lawyer trying to set password for the first time got a confusing reuse error
- **Root cause:** Supabase account created without a password — reuse prevention triggered on empty→new
- **Fix:** Set a random UUID temp password at account creation time so Supabase has a real value to compare against

### R4. Reset-password page showed "Invalid or expired link" immediately
- **Symptom:** Recovery link had valid `#access_token` in URL but page showed error right away
- **Root cause:** `PASSWORD_RECOVERY` auth event fired before `onAuthStateChange` listener registered
- **Fix:** Added `checking` state with spinner; now waits before showing the error

### R5. Google OAuth redirected to /dashboard instead of /admin
- **Symptom:** Admin logging in via Google landed on client dashboard
- **Root cause:** `auth/callback/route.ts` hardcoded `next = '/dashboard'`
- **Fix:** Callback now reads the user's role from profiles and redirects admin/lawyer to `/admin`

### R6. `design/script.js` null reference errors (4 issues in dev overlay)
- **Symptom:** `Cannot read properties of null (reading 'classList')` on scroll
- **Root cause:** Public site scroll/mobile-menu script referenced `#header`, `#hamburger` etc. which don't exist on admin/dashboard pages
- **Fix:** Added null guards around all DOM element accesses in `script.js`

### R7. Welcome email pointed to /forgot-password (caused second email attempt)
- **Symptom:** Lawyer clicked "Set My Password" → landed on forgot-password page → "Error sending recovery email"
- **Root cause:** API was sending `/forgot-password` URL instead of a direct one-click recovery link
- **Fix:** Use `admin.auth.admin.generateLink({ type: 'recovery' })` to generate a direct link and embed it in the Resend welcome email

---

## 📋 KNOWN LIMITATIONS / DECISIONS PENDING

| # | Item | Notes |
|---|------|-------|
| 1 | Blog comments migration (004_blog_comments.sql) | Must be run manually in Supabase SQL Editor — not yet done |
| 2 | Supabase free tier email rate limit | 30 emails/hour — fine for now, upgrade if needed |
| 3 | Chrome extension errors in dev overlay | `fdprocessedid` hydration mismatch + React #299 — from browser extensions, not our code |
| 4 | Password reuse prevention setting | Supabase UI doesn't expose it clearly on free tier |
