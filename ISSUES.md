# One Stop Immigration Station — Running Issues Log

**Last updated:** 2026-06-09 (Web Session 6b — self-registration, company seeding, Sponsor invite)

---

## ✅ RESOLVED THIS SESSION (Web Session 6b)

### R19. Sponsor and Contact had no company_id after self-registration
- **Symptom:** A Sponsor or Contact who signed up independently had no `company_id` — their Team page showed the "No team yet" warning and they couldn't invite anyone without a company being seeded
- **Root cause:** Original model only seeded `company_id` on first *invite*; self-registration didn't set it
- **Fix:** `/signup` now captures Company Name for Contact/Sponsor roles and sets `company_id = user.id` + `company_name` immediately on account creation

### R20. Sponsors could not invite Beneficiaries
- **Symptom:** Sponsor visiting `/dashboard/team/invite` got a 403 "Only contacts and admins can invite members"
- **Root cause:** Invite API guard was `['contact', 'admin']` only
- **Fix:** Guard updated to `['contact', 'sponsor', 'admin']`; Sponsors restricted to inviting `beneficiary` role only

### R21. Invite form showed wrong role options for Sponsor
- **Symptom:** Invite form always showed both Sponsor and Beneficiary options regardless of caller's role
- **Root cause:** Form was a pure client component with no server context
- **Fix:** Split into server page (reads caller role + company from Supabase) + `InviteMemberForm` client component; Sponsor sees fixed "Beneficiary" display; Contact sees full dropdown

---

## ✅ RESOLVED THIS SESSION (Web Session 6)

### R17. Ticket reply did not trigger in-portal bell notification
- **Symptom:** Lawyer replies to ticket — client gets email but bell badge never lights up
- **Root cause:** `AdminTicketReply.tsx` did not pass `clientUserId` or `replyPreview` to `/api/email`, so `sendPushToUser` was never called (payload.clientUserId was undefined)
- **Fix:** Added `clientUserId` prop to `AdminTicketReply`, pass `ticket.user_id` from page, include both fields in the email API body

### R18. L-1 applications had no USCIS Pre-Fill PDF button
- **Symptom:** Opening an L-1 application in `/admin/applications/[id]` — no pre-fill button shown
- **Root cause:** `formsByVisaType` in `formMaps.ts` had no entry for `l1`; `DownloadUscisForm` returned null
- **Fix:** Added full `i129l` FormDefinition (6 parts, ~40 fields mapping to L-1 questionnaire) and registered `l1: i129l` in `formsByVisaType`

---

## ✅ RESOLVED PREVIOUS SESSIONS

### R15. DownloadPdf.tsx TypeScript error blocking Vercel build
- **Symptom:** `Property 'jsPDF' does not exist on type '{ default: typeof jsPDF; ... }'` — production build failed
- **Root cause:** jspdf dynamic import returns `{ default: jsPDF }` but code destructured `{ jsPDF }` directly
- **Fix:** Changed to `const jspdfModule = await import('jspdf'); const JsPDF = jspdfModule.default || jspdfModule.jsPDF`

### R16. All web app code was only on `mobile` branch, not `main`
- **Symptom:** Vercel (deploying from `main`) was building old code — all Sessions 1–5 features missing from production
- **Root cause:** All development work was committed to `mobile` branch; `main` was never updated
- **Fix:** Merged `mobile` into `main` and pushed — all 24 new commits now on main, production deployed

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
| 8 | L-1 USCIS pre-fill PDF | ✅ Fixed Session 6 — i129l mapping added |
| 9 | USCIS RSS cron unprotected without CRON_SECRET | ✅ CRON_SECRET set in Vercel env vars |
| 10 | Ticket reply bell notification | ✅ Fixed Session 6 — clientUserId now passed to /api/email |
| 11 | Contact role not fully implemented | ✅ Fixed Session 6 — Team pages, invite flow, member detail view |
| 12 | company_id / invited_by not on profiles | ✅ Fixed Session 6 — migration 013 run in Supabase |
| 13 | Contact/Sponsor had no company_id after self-signup | ✅ Fixed Session 6b — signup now seeds company_id + company_name |
| 14 | Sponsor could not invite Beneficiaries | ✅ Fixed Session 6b — invite API and form updated |
| 2 | Lawyer set-password in same browser as admin | Partial fix: Resend Setup Email button added. Root cause persists. |
| 3 | middleware.ts deprecation | See Open Issue #3 |
| 4 | Existing appointments show no lawyer name | Only NEW bookings capture lawyer_name — pre-fix appointments show blank |
| 5 | Appointment confirmation email lacks location/link | Fixed in Session 4 — email now sent on confirm/cancel with location + link |
| 6 | Chrome extension errors in dev overlay | React #299 from `oihbmmeelledioenpfcfehdjhdnlfibj` extension — not our code |
| 7 | Supabase free tier email rate limit | 30 emails/hour — fine for now |
