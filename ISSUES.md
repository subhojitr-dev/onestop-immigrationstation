# One Stop Immigration Station — Running Issues Log

**Last updated:** 2026-06-08 (Session 4 — Web Sessions 1, 2, 3 complete)

---

## 🔴 OPEN ISSUES

### 1. Lawyer set-password flow — session isolation (PARTIAL FIX)
- **Symptom:** After admin creates a lawyer and sends welcome email, lawyer clicks "Set My Password" but password doesn't save correctly if admin is logged in same browser
- **Root cause:** `setSession()` call conflicts with admin's existing cookie session
- **Partial fix (Session 4):** "Resend Setup Email" button added to `/admin/users` — admin can re-generate a fresh link anytime. New route: `/api/admin/resend-setup-email`
- **Workaround:** Lawyer uses `/forgot-password` while admin is logged out — this works reliably
- **Remaining:** Session isolation root cause not fixed; browser conflict still possible

### 3. middleware.ts deprecation warning
- **Symptom:** Dev console shows `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.`
- **Root cause:** Next.js 16 renamed middleware convention
- **Impact:** Warning only — functionality works fine
- **Fix:** Rename `middleware.ts` to `proxy.ts` and update references

---

## ✅ RESOLVED ISSUES

### R1. "Database error creating new user" when creating lawyer
- **Fix:** Stop passing `role` in `user_metadata` — let trigger default to `beneficiary`, then upsert sets `lawyer`. Also added `lawyer` to role check constraint.

### R2. "Account created but profile update failed: address column not found"
- **Fix:** Ran `alter table profiles add column if not exists address text; NOTIFY pgrst, 'reload schema';`

### R3. "New password should be different from old password" on first login
- **Fix:** Set a random UUID temp password at account creation so Supabase has a real value to compare against

### R4. Reset-password showed "Invalid or expired link" immediately
- **Fix:** Added `checking` state with spinner; now parses `access_token` from URL hash and calls `setSession()` before showing form

### R5. Google OAuth redirected to /dashboard instead of /admin
- **Fix:** `auth/callback/route.ts` now reads user role and routes admin/lawyer to `/admin`

### R6. design/script.js null reference errors (4 issues in dev overlay)
- **Fix:** Added null guards around `#header`, `#hamburger`, `#mobilePanel` etc. — elements that don't exist on admin/dashboard pages

### R7. Welcome email pointed to /forgot-password instead of direct link
- **Fix:** Use `admin.auth.admin.generateLink({ type: 'recovery' })` and embed direct link in Resend email

### R8. Forgot-password "Error sending recovery email"
- **Fix:** Created `/api/auth/forgot-password` route — generates link via admin API + sends via Resend, bypassing Supabase's unreliable email system

### R9. Application status stayed "Submitted" after case opened
- **Fix:** `open-case` API now updates application `status = 'case_opened'` and saves `case_id` back to application row. Added `case_opened` to status check constraint and statusColors maps.

### R10. Duplicate cases created for same application
- **Fix:** `open-case` API checks `app.case_id` first — returns early if case already exists

### R11. "Open Case" button still showed after case was opened
- **Fix:** `ApplicationActions` uses `existingCaseId` from `app.case_id` — now correctly shows "View in Cases →" after opening

### R12. Supabase OTP tokens are single-use
- **Symptom:** Clicking welcome email link a second time shows "otp_expired"
- **Behavior:** Expected — Supabase recovery tokens are consumed on first click
- **Workaround:** Use forgot-password to get a fresh link

### R13. PDF broken emoji in section headers
- **Fix:** Removed `section.icon` from jsPDF text (emojis unsupported by jsPDF) — section titles render cleanly

### R14. Add New Lawyer form still visible after successful creation
- **Fix:** Wrapped form and "What happens next" in `{!success && ...}` — hides on success

---

## 📋 KNOWN LIMITATIONS

| # | Item | Notes |
|---|------|-------|
| 1 | All lawyers see all appointments | Fixed in Session 4 — migration 008 run ✅ |
| 8 | L-1 visa has no USCIS pre-fill PDF | L-1 uses same I-129 form as H-1B but needs separate supplement mapping — not yet built |
| 2 | Lawyer set-password in same browser as admin | Partial fix: Resend Setup Email button added. Root cause persists. |
| 3 | middleware.ts deprecation | See Open Issue #3 |
| 4 | Existing appointments show no lawyer name | Only NEW bookings capture lawyer_name — pre-fix appointments show blank |
| 5 | Appointment confirmation email lacks location/link | Fixed in Session 4 — email now sent on confirm/cancel with location + link |
| 6 | Chrome extension errors in dev overlay | React #299 from `oihbmmeelledioenpfcfehdjhdnlfibj` extension — not our code |
| 7 | Supabase free tier email rate limit | 30 emails/hour — fine for now |
