# One Stop Immigration Station — Master TODO

**Last updated:** 2026-06-08 (Session 4 — Web Sessions 1 + 2 complete)

---

## ✅ COMPLETED — Everything Built and Deployed

### Infrastructure & DevOps
- [x] GitHub repo: `subhojitr-dev/onestop-immigrationstation`
- [x] Turborepo monorepo (`apps/web`, `apps/mobile` placeholder, `supabase/migrations`)
- [x] Next.js 16 in `apps/web/` with TypeScript
- [x] Supabase project — 16+ tables, RLS policies, Storage buckets
- [x] Deployed to Vercel — auto-deploys on every push to `main`
- [x] Custom email domain — `noreply@onestopimmigrationstation.com` (Resend + GoDaddy DNS)
- [x] Google OAuth — Google Cloud project "OnestopImmigration" wired to Supabase
- [x] `RESEND_API_KEY` + `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` + Vercel env vars ✅

### Database Migrations (all run in Supabase)
- [x] `001_initial_schema.sql` — tables, RLS, storage, auth trigger
- [x] `002_applications.sql` — applications table
- [x] `003_slots.sql` — consultation_slots table
- [x] `004_blog_comments.sql` — blog_comments table with RLS
- [x] `005_lawyer_profile_fields.sql` — gender, date_of_birth, qualification on profiles
- [x] `006_appointment_location.sql` — location, meeting_link on appointments
- [x] `007_appointment_lawyer_name.sql` — lawyer_name on appointments
- [x] Manual: `address` column on profiles
- [x] Manual: `lawyer` added to profiles role check constraint
- [x] Manual: `case_id` column on applications + `case_opened` status constraint
- [x] Manual: RLS policies for lawyers to read all appointments/cases/tickets/docs/applications

### Auth & User Management
- [x] `/login` — email+password + Google OAuth + role-based redirect
- [x] `/signup` — 2-step: role selection → details form
- [x] `/forgot-password` — now routes through Resend (bypasses Supabase email)
- [x] `/reset-password` — fixed session isolation; eye toggle on password fields
- [x] `/auth/callback` — role-aware redirect (admin/lawyer → /admin, others → /dashboard)
- [x] Password show/hide eye toggle on login, signup, reset-password pages
- [x] Sign Out button in public website header (desktop + mobile)
- [x] Google OAuth redirects admin/lawyer to /admin correctly

### Lawyer Account Management
- [x] `/admin/users/new` — Add New Lawyer form (First Name, Last Name, Email, Phone, Address, Gender, DOB, Qualification)
- [x] Creates Supabase auth user + profile with role=lawyer + random temp password
- [x] Generates direct recovery link via admin API → sends via Resend welcome email
- [x] Form hides after successful creation
- [x] `/admin/users` — All users with inline role dropdown + "+ Add New Lawyer" button

### Public Website Pages
- [x] `/` — Homepage
- [x] `/blog` — Dynamic from Supabase blog_posts (hardcoded fallback)
- [x] `/blog/[slug]` — Individual post page + threaded comments
- [x] `/success-stories`, `/videos`, `/press-media`, `/contact`

### Client Dashboard (all protected, live Supabase data)
- [x] `/dashboard` — Home with live stats
- [x] `/dashboard/cases` — Role-aware case list
- [x] `/dashboard/cases/[id]` — Case detail + timeline + docs + LawyerActions panel
- [x] `/dashboard/appointments` — List with location + Join Meeting link when confirmed
- [x] `/dashboard/appointments/book` — Books from real consultation_slots (captures lawyer_name)
- [x] `/dashboard/documents` — Upload/download/delete (Supabase Storage)
- [x] `/dashboard/profile` — Edit name/phone + Gender/DOB/Qualification for lawyer/admin
- [x] `/dashboard/tickets` + `/new` + `/[id]` — Support tickets
- [x] `/dashboard/beneficiaries` + `/add` — Sponsor only
- [x] `/dashboard/contacts` + `/add` — Sponsor only
- [x] `/dashboard/apply` — All 5 visa types
- [x] `/dashboard/apply/[visaType]` — Multi-step questionnaire engine (save & resume)

### Admin Panel
- [x] `/admin` — Overview (stats, recent apps, open tickets)
- [x] `/admin/applications` — All questionnaires; status shows "Case Opened" after case opened
- [x] `/admin/applications/[id]` — Full review + status + notes + "Open Case" (no duplicates) + PDF download
- [x] `/admin/tickets` + `/[id]` — All tickets with threaded replies
- [x] `/admin/blog` + `/new` + `/[id]` — Blog CMS
- [x] `/admin/slots` — Lawyer's own availability (filtered by lawyer_id)
- [x] `/admin/users` — All users + role management + Add New Lawyer
- [x] `/admin/cases` — All cases
- [x] `/admin/appointments` — All appointments with location/meeting link + status updater

### Application → Case Flow
- [x] "Open Case" button creates case (no duplicates — guarded by case_id check)
- [x] Application status updates to "Case Opened" after case is opened
- [x] case_id saved back to application row
- [x] Auto case number: `OSIS-YYYY-NNN`
- [x] Initial timeline event "Case Opened" added automatically

### PDF Summary Download
- [x] Fixed broken emoji in section headers
- [x] Dates formatted (March 15, 1996 not 1996-03-15)
- [x] Salary formatted ($129,999 not 129999)
- [x] Yes/No/degree values human-readable
- [x] Raw lowercase values capitalized

### Blog Comments
- [x] Threaded comments on /blog/[slug] (registered users only)
- [x] Auto-publish, admin/lawyer can remove any comment
- [x] Server-side initial fetch, client-side posting

### Email Notifications (all via Resend)
- [x] Application submitted, status changed
- [x] Ticket reply
- [x] Appointment booked, confirmed/cancelled
- [x] Case timeline updated
- [x] Lawyer welcome email with direct Set Password link
- [x] Password reset email (via /api/auth/forgot-password → Resend)

### Admin API Routes (service role — bypass RLS)
- [x] `POST /api/admin/update-appointment` — status + location + meeting_link
- [x] `POST /api/admin/update-application` — status + notes + emails client
- [x] `POST /api/admin/open-case` — creates case, updates application status + case_id
- [x] `POST /api/admin/update-user-role`
- [x] `POST /api/admin/create-lawyer` — gender/DOB/qualification fields added
- [x] `POST /api/auth/forgot-password` — generates link + sends via Resend

---

## 🔴 HIGH PRIORITY — Next Build Phase

### 1. Fix lawyer appointment visibility (security gap) ✅ DONE (Session 4)
- [x] Migration 008: `lawyer_id` FK added to appointments + updated RLS policy
- [x] Booking page saves `lawyer_id` from consultation slot
- [x] `/admin/appointments` filters by `lawyer_id` (+ `lawyer_name` fallback) for lawyers; admins see all
- **⚠️ Requires running migration 008 in Supabase SQL editor**

### 2. Fix lawyer login flow (session isolation) ✅ DONE (Session 4)
- [x] "Resend Setup Email" button added to `/admin/users` for each lawyer row
- [x] `/api/admin/resend-setup-email` route: generates fresh recovery link + resends welcome email
- **Remaining:** Core session-isolation bug (same browser) still exists — workaround: use /forgot-password logged out

### 3. Pre-Filled USCIS PDF Forms ✅ DONE (Session 4)
- [x] Installed `pdf-lib`
- [x] Field mappings for all 4 forms: I-129 (H-1B), I-130 (Family), I-129F (K-1), I-140 (Green Card)
- [x] Server-side PDF generator — organized by Part & Item number, attorney fields highlighted
- [x] GET /api/admin/uscis-form/[appId] — streams PDF download
- [x] "I-129 Pre-Fill" button added to application detail page sidebar
- ⬜ L-1 → I-129 (L classification) mapping not yet added

### 4. Create Case directly from Admin Cases page ✅ DONE (Session 4)
- [x] "+ New Case" button on `/admin/cases` — inline form expands inline
- [x] Form: client dropdown, visa type, description, assigned attorney
- [x] Auto case number OSIS-YYYY-NNN, initial "Case Opened" timeline event
- [x] SQL: cases_status_check constraint updated ✅ run in Supabase

### 5. Case Status Update from Admin ✅ DONE (Session 4)
- [x] `/admin/cases/[id]` — new admin case detail page with timeline
- [x] Status dropdown: open → in_progress → pending_documents → submitted → approved → denied → closed
- [x] Optional note to client, Save & Notify button emails client via Resend

---

## 🟡 MEDIUM PRIORITY

### 6. News/Videos — CMS-Driven (decisions finalized)
- [ ] Add `post_type` column to blog_posts: `article` | `youtube_video` | `uscis_news`
- [ ] Add `youtube_url` column to blog_posts
- [ ] Blog CMS `/admin/blog/new` — add Post Type selector:
  - Article → publishes to `/blog`
  - YouTube Video → admin pastes URL + summary → publishes to `/videos`
  - USCIS News → auto-imported as draft, admin edits/publishes → `/blog`
- [ ] `/videos` page — render posts where post_type='youtube_video' with embedded player
- [ ] Vercel cron job — daily fetch of USCIS RSS → insert as drafts (post_type='uscis_news', is_published=false)
- [ ] Admin notified of new USCIS drafts awaiting review
- [ ] Archive logic: posts > 90 days → archived (visible but not prominent), > 1 year → deleted
- [ ] Archive section on /blog and /videos (collapsible, links only)
- **Decisions confirmed:**
  - USCIS RSS → Draft → Admin approves only (not lawyer)
  - Videos: on-demand from CMS (USCIS Official, Boundless Immigration, etc.)
  - Blog and Videos stay as separate pages
  - Post type in CMS determines which page it appears on
  - Archive at 90 days, remove at 1 year

### 7. Blog Category/Archive Filtering
- [ ] Wire sidebar category links on /blog to filter posts
- [ ] Pagination (currently loads 20 max)

### 8. Real-Time In-Portal Notifications
- [ ] Bell icon in topbar wired to `notifications` table
- [ ] Mark as read functionality
- [ ] Triggers: case update, appointment confirmed, ticket reply

### 9. Appointment location/meeting link on confirmation email ✅ DONE (Session 4)
- [x] `update-appointment` API now sends confirmation/cancellation email to client on status change
- [x] Email includes location + meeting link block when present

---

## 🟢 LOWER PRIORITY / FUTURE

### 10. Custom Domain
- [ ] Vercel → Domains → add `onestopimmigrationstation.com`
- [ ] GoDaddy DNS: A record → `76.76.21.21`, CNAME www → `cname.vercel-dns.com`
- [ ] Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars
- **When:** After all features tested and signed off

### 11. Vercel Analytics
- [ ] Enable in Vercel dashboard → Analytics tab (free, one-click)

### 12. React Native Mobile App
- [ ] Expo in `apps/mobile/`
- [ ] Supabase Auth (expo-auth-session for Google OAuth)
- [ ] Screens: Login, Signup, Dashboard, Cases, Appointments, Documents, Profile
- [ ] Push notifications (Expo Notifications)
- [ ] EAS Build → iOS App Store + Google Play

### 13. middleware.ts deprecation warning
- [ ] Next.js 16 deprecated `middleware` convention — rename to `proxy`
- [ ] Currently shows warning in dev console but works fine

---

## 🗺️ KEY FILE LOCATIONS

| What | Path |
|------|------|
| Portal CSS | `apps/web/app/globals.css` |
| Public CSS | `apps/web/public/design/` |
| Dashboard layout | `apps/web/app/dashboard/layout.tsx` |
| Admin layout | `apps/web/app/admin/layout.tsx` |
| Sidebar | `apps/web/components/PortalSidebar.tsx` |
| Header (public) | `apps/web/components/Header.tsx` |
| Supabase server | `apps/web/lib/supabase/server.ts` |
| Supabase admin | `apps/web/lib/supabase/admin.ts` |
| Supabase browser | `apps/web/lib/supabase/client.ts` |
| Email functions | `apps/web/lib/email/resend.ts` |
| Email API | `apps/web/app/api/email/route.ts` |
| Forgot password API | `apps/web/app/api/auth/forgot-password/route.ts` |
| Admin API routes | `apps/web/app/api/admin/` |
| Questionnaires | `apps/web/lib/questionnaire/` |
| Questionnaire engine | `apps/web/app/dashboard/apply/[visaType]/page.tsx` |
| PDF download | `apps/web/app/admin/applications/[id]/DownloadPdf.tsx` |
| Lawyer case actions | `apps/web/app/dashboard/cases/[id]/LawyerActions.tsx` |
| Slot manager | `apps/web/app/admin/slots/SlotManager.tsx` |
| Add Lawyer form | `apps/web/app/admin/users/new/page.tsx` |
| Create Lawyer API | `apps/web/app/api/admin/create-lawyer/route.ts` |
| Open Case API | `apps/web/app/api/admin/open-case/route.ts` |
| Blog comments | `apps/web/app/blog/[slug]/BlogComments.tsx` |
| Issues log | `ISSUES.md` |
| Migrations | `supabase/migrations/` |
| Setup guide | `SETUP.md` |
| Task list | `TODO.md` (this file) |
