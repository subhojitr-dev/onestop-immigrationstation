# One Stop Immigration Station — Master TODO

**Last updated:** 2026-06-07 (Session 3)

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

### 1. Fix lawyer appointment visibility (security gap)
- [ ] Lawyers should only see THEIR OWN appointments in `/admin/appointments`
- [ ] Admin sees ALL appointments
- [ ] Filter by `lawyer_name` matching logged-in lawyer's name (or better: add `lawyer_id` to appointments)
- **Why:** Currently all lawyers see all other lawyers' appointments — privacy/security issue

### 2. Fix lawyer login flow (session isolation)
- [ ] Recovery link set-password flow still has issues when admin is logged in same browser
- [ ] Consider: add "Resend Setup Email" button to /admin/users for existing lawyers
- [ ] Consider: store `lawyer_id` on appointments for more robust filtering
- **Workaround:** Lawyer uses forgot-password while logged out as admin

### 3. Pre-Filled USCIS PDF Forms (Phase 2)
- [ ] Install `pdf-lib`
- [ ] Map H-1B questionnaire answers to I-129 field names
- [ ] Generate pre-filled I-129 downloadable from admin panel
- [ ] Extend to I-130, I-129F, I-140
- **Why:** Reduces attorney prep time from hours to minutes

### 4. Create Case directly from Admin Cases page
- [ ] "+ New Case" button on `/admin/cases`
- [ ] Form: client dropdown, visa type, description
- [ ] No application required
- **Why:** Lawyer may need to create cases for walk-in/phone clients

### 5. Case Status Update from Admin
- [ ] Lawyer can change case status from case detail page
- [ ] Email client when status changes
- **Why:** Cases are created but status stuck at "open"

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

### 9. Appointment location/meeting link on confirmation email
- [ ] When lawyer confirms + adds location/link, include in the confirmation email to client
- **Currently:** Client sees location in portal but email doesn't include it

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
