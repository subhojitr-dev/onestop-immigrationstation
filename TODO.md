# One Stop Immigration Station — Master TODO

**Last updated:** 2026-06-06 (evening)

---

## ✅ COMPLETED — Everything Built and Deployed to Vercel

### Infrastructure & DevOps
- [x] GitHub repo: `subhojitr-dev/onestop-immigrationstation`
- [x] Turborepo monorepo (`apps/web`, `apps/mobile` placeholder, `supabase/migrations`)
- [x] Next.js 16 in `apps/web/` with TypeScript
- [x] Supabase project — 16 tables, RLS policies, Storage buckets
- [x] Deployed to Vercel — auto-deploys on every push to `main`
- [x] Custom email domain — `noreply@onestopimmigrationstation.com` (Resend + GoDaddy DNS)
- [x] Google OAuth — Google Cloud project "OnestopImmigration" wired to Supabase
- [x] `RESEND_API_KEY` in `.env.local` + **Vercel environment variables** ✅
- [x] `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` + **Vercel environment variables** ✅
- [x] Vercel redeployed with both new keys active ✅

### Database Migrations Run in Supabase
- [x] `001_initial_schema.sql` — tables, RLS, storage, auth trigger
- [x] `002_applications.sql` — applications table
- [x] `003_slots.sql` — consultation_slots table
- [x] Manual SQL: `address` column added to profiles
- [x] Manual SQL: `lawyer` added to profiles role check constraint
- [x] Manual SQL: RLS policies for lawyers to read all appointments/cases/tickets/docs/applications

### Design System (v2 Claude Design Premium)
- [x] Navy `#1a2744` + Gold `#b8952a` color scheme
- [x] Fonts: Lora + Libre Franklin
- [x] Gradient sidebar with gold active indicator
- [x] Portal CSS in `apps/web/app/globals.css`
- [x] Public CSS in `apps/web/public/design/`
- [x] `.reveal { opacity: 1 !important; }` fix in additions.css

### Auth
- [x] `/login` — email+password + Google OAuth + role-based redirect (lawyer/admin → /admin)
- [x] `/signup` — 2-step: role selection → details form
- [x] `/forgot-password` + `/reset-password`
- [x] `/auth/callback` — OAuth redirect handler
- [x] `middleware.ts` — route protection

### Public Website Pages
- [x] `/` — Homepage
- [x] `/blog` — Dynamic from Supabase blog_posts (hardcoded fallback)
- [x] `/blog/[slug]` — Individual post page with related sidebar + CTA
- [x] `/success-stories`, `/videos`, `/press-media`, `/contact`

### Client Dashboard (all protected, live Supabase data)
- [x] `/dashboard` — Home with live stats
- [x] `/dashboard/cases` — Role-aware case list
- [x] `/dashboard/cases/[id]` — Case detail + timeline + docs + LawyerActions panel
- [x] `/dashboard/appointments` — Upcoming/past list with free consultation counter
- [x] `/dashboard/appointments/book` — Books from real consultation_slots
- [x] `/dashboard/documents` — Upload/download/delete (Supabase Storage)
- [x] `/dashboard/profile` — Edit name/phone
- [x] `/dashboard/tickets` — Support ticket list
- [x] `/dashboard/tickets/new` — Create ticket
- [x] `/dashboard/tickets/[id]` — Threaded replies
- [x] `/dashboard/beneficiaries` + `/add` — Sponsor only
- [x] `/dashboard/contacts` + `/add` — Sponsor only
- [x] `/dashboard/apply` — All 5 visa types available
- [x] `/dashboard/apply/[visaType]` — Multi-step questionnaire engine (save & resume)

### Smart Form Assistant — All 5 Visa Types
- [x] H-1B (6 sections), L-1 (5 sections), Green Card (5 sections), K-1 (4 sections), Family Petition (4 sections)
- [x] Beneficiary-first: EIN/NAICS removed, employer fields optional
- [x] Save & resume, conditional fields, USCIS form references

### Email Notifications (Resend — working in both local and production)
- [x] Application submitted → client confirmation + lawyer/admin notification
- [x] Application status changed → client email with lawyer note
- [x] Ticket reply → other party notified
- [x] Appointment booked → client confirmation + admin notification
- [x] Appointment confirmed/cancelled → client notified
- [x] Case timeline event added → client email

### PDF Summary Download
- [x] Browser-side jspdf generation in admin application detail page
- [x] Navy header, all sections, answered fields only, page numbers, auto-download

### Blog CMS
- [x] `/admin/blog` — List with publish/unpublish/delete
- [x] `/admin/blog/new` + `/admin/blog/[id]` — Create + edit
- [x] Slug auto-generation, category, tags, featured image, author, publish toggle

### Lawyer Portal Actions (on case detail page)
- [x] Add timeline events to any case
- [x] Upload documents to a case (Supabase Storage → documents table)

### Appointment Slots
- [x] `/admin/slots` — Lawyer's own availability (filtered by lawyer_id)
- [x] Add single slot + bulk add Mon–Fri for N weeks
- [x] Booked slots show client name, unbooked slots deletable

### Admin Panel (all data via service role client — bypasses RLS)
- [x] `/admin` — Overview (stats, recent apps, open tickets)
- [x] `/admin/applications` — All questionnaires with "Review →" button
- [x] `/admin/applications/[id]` — Review + status + notes + **"Open Case" button** + PDF download
- [x] `/admin/tickets` — All tickets
- [x] `/admin/tickets/[id]` — **New** — threaded view + staff reply form + client email
- [x] `/admin/blog` — Blog CMS
- [x] `/admin/slots` — Lawyer's own availability
- [x] `/admin/users` — All users + inline role dropdown + **"+ Add New Lawyer" button**
- [x] `/admin/users/new` — **New** — Add New Lawyer form (creates auth + profile + welcome email)
- [x] `/admin/cases` — All cases
- [x] `/admin/appointments` — All appointments with status updater (via admin API)

### Application → Case Flow
- [x] "Open Case" button on application detail creates case automatically
- [x] Auto case number: `OSIS-YYYY-NNN`
- [x] Initial timeline event "Case Opened" added automatically
- [x] Case linked to client, assigned attorney name recorded

### Admin API Routes (service role — bypass RLS)
- [x] `POST /api/admin/update-appointment` — lawyer changes appointment status
- [x] `POST /api/admin/update-application` — lawyer changes application status + emails client
- [x] `POST /api/admin/open-case` — converts application into active case
- [x] `POST /api/admin/update-user-role` — admin changes any user's role
- [x] `POST /api/admin/create-lawyer` — creates lawyer account + sends welcome email

### Supabase Clients
- [x] `lib/supabase/server.ts` — anon key, respects RLS (auth checks only)
- [x] `lib/supabase/admin.ts` — service role key, bypasses RLS (admin data reads)
- [x] `lib/supabase/client.ts` — browser client

---

## 🔴 HIGH PRIORITY — Next Build Phase

### 1. Pre-Filled USCIS PDF Forms (Phase 2)
- [ ] Install `pdf-lib`
- [ ] Download official I-129 PDF, identify form field names
- [ ] Map H-1B questionnaire answers to I-129 field names
- [ ] Generate pre-filled I-129 downloadable from admin panel
- [ ] Extend to I-130 (Family), I-129F (K-1), I-140 (Green Card)
- **Why:** Reduces attorney prep time from hours to minutes

### 2. Create Case button from Admin Cases page
- [ ] Add "+ New Case" button on `/admin/cases`
- [ ] Form: client (dropdown from users), visa type, description
- [ ] Lawyer can create a case without going through an application
- **Why:** Lawyer may need to create cases for existing clients not using the portal

### 3. Case Status Update from Admin
- [ ] Lawyer can change case status from `/admin/cases` or case detail
- [ ] Email client when case status changes
- **Why:** Currently cases are created but status can't be updated from UI

---

## 🟡 MEDIUM PRIORITY — Pending Decisions

### 4. News/Videos Auto-Update (discuss first)
- [ ] **Decision needed:** Auto-publish USCIS RSS or admin approval first?
- [ ] **Decision needed:** Videos — curated YouTube links or auto-discovered?
- [ ] **Decision needed:** Archive threshold (how old before archiving?)
- [ ] Once decided: Vercel cron job → fetch USCIS RSS → insert to blog_posts

### 5. Community Blog with Comments (discuss first)
- [ ] **Decision needed:** Who can post — any registered user or verified clients only?
- [ ] **Decision needed:** Separate from firm blog or mixed together?
- [ ] **Decision needed:** Upvotes / "helpful" reactions?
- [ ] Once decided: comments table, threaded UI on /blog/[slug]

### 6. Blog Category/Archive Filtering
- [ ] Wire sidebar category links on /blog to filter posts
- [ ] Pagination (currently loads 20 max)

### 7. Real-Time Notifications (in-portal)
- [ ] Wire `notifications` table to a bell icon in topbar
- [ ] Mark as read functionality
- [ ] Triggers: case update, appointment confirmed, ticket reply

---

## 🟢 LOWER PRIORITY / FUTURE

### 8. Custom Domain
- [ ] Vercel → Domains → add `onestopimmigrationstation.com`
- [ ] GoDaddy DNS: A record → `76.76.21.21`, CNAME www → `cname.vercel-dns.com`
- [ ] Update all email template URLs to use new domain
- [ ] Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars
- **When:** After all features tested and signed off

### 9. Vercel Analytics
- [ ] Enable in Vercel dashboard → Analytics (free, one-click)

### 10. React Native Mobile App
- [ ] Expo in `apps/mobile/`
- [ ] Supabase Auth (expo-auth-session for Google OAuth)
- [ ] Screens: Login, Signup, Dashboard, Cases, Appointments, Documents, Profile
- [ ] Push notifications (Expo Notifications)
- [ ] EAS Build → iOS App Store + Google Play

---

## 🗺️ KEY FILE LOCATIONS

| What | Path |
|------|------|
| Portal CSS | `apps/web/app/globals.css` |
| Public CSS | `apps/web/public/design/` |
| Dashboard layout | `apps/web/app/dashboard/layout.tsx` |
| Admin layout | `apps/web/app/admin/layout.tsx` |
| Sidebar | `apps/web/components/PortalSidebar.tsx` |
| Supabase server | `apps/web/lib/supabase/server.ts` |
| Supabase admin | `apps/web/lib/supabase/admin.ts` |
| Supabase browser | `apps/web/lib/supabase/client.ts` |
| Email functions | `apps/web/lib/email/resend.ts` |
| Email API | `apps/web/app/api/email/route.ts` |
| Admin API routes | `apps/web/app/api/admin/` |
| Questionnaires | `apps/web/lib/questionnaire/` |
| Questionnaire engine | `apps/web/app/dashboard/apply/[visaType]/page.tsx` |
| PDF download | `apps/web/app/admin/applications/[id]/DownloadPdf.tsx` |
| Lawyer case actions | `apps/web/app/dashboard/cases/[id]/LawyerActions.tsx` |
| Slot manager | `apps/web/app/admin/slots/SlotManager.tsx` |
| Add Lawyer form | `apps/web/app/admin/users/new/page.tsx` |
| Create Lawyer API | `apps/web/app/api/admin/create-lawyer/route.ts` |
| Open Case API | `apps/web/app/api/admin/open-case/route.ts` |
| Migrations | `supabase/migrations/` |
| Test plan | `TESTING.md` |
| Setup guide | `SETUP.md` |
| Task list | `TODO.md` (this file) |
