# One Stop Immigration Station — Master TODO

**Last updated:** 2026-06-06

---

## ✅ COMPLETED — Everything Built and Deployed

### Infrastructure & DevOps
- [x] GitHub repo: `subhojitr-dev/onestop-immigrationstation`
- [x] Turborepo monorepo (`apps/web`, `apps/mobile` placeholder, `supabase/migrations`)
- [x] Next.js 16 in `apps/web/` with TypeScript
- [x] Supabase project — 16 tables, RLS policies on all tables, Storage buckets
- [x] Deployed to Vercel — auto-deploys on every push to `main`
- [x] Custom email domain — `noreply@onestopimmigrationstation.com` (Resend + GoDaddy DNS verified)
- [x] Google OAuth — Google Cloud project "OnestopImmigration" wired to Supabase
- [x] `RESEND_API_KEY` configured in `.env.local` ✅

### Database Migrations Run in Supabase
- [x] `001_initial_schema.sql` — 15 tables, RLS, storage policies, auth trigger
- [x] `002_applications.sql` — applications table for intake questionnaires
- [x] `003_slots.sql` — consultation_slots table created with RLS ✅ (just completed)

### Design System (v2 Claude Design Premium)
- [x] Navy `#1a2744` + Gold `#b8952a` color scheme throughout
- [x] Fonts: Lora (serif headings) + Libre Franklin (body)
- [x] Gradient sidebar with gold active indicator
- [x] All portal CSS in `apps/web/app/globals.css`
- [x] Public CSS in `apps/web/public/design/`
- [x] `.reveal { opacity: 1 !important; }` fix in additions.css

### Auth
- [x] `/login` — email+password + Google OAuth
- [x] `/signup` — 2-step: role selection → details form
- [x] `/forgot-password` — Supabase resetPasswordForEmail()
- [x] `/reset-password` — token-based password update
- [x] `/auth/callback` — OAuth redirect handler
- [x] `middleware.ts` — route protection

### Public Website Pages
- [x] `/` — Homepage
- [x] `/blog` — **Now dynamic** — pulls from Supabase `blog_posts`, falls back to 3 hardcoded posts
- [x] `/blog/[slug]` — **New** — individual post page with full content + related posts sidebar
- [x] `/success-stories` — Testimonials
- [x] `/videos` — Video cards
- [x] `/press-media` — Press items
- [x] `/contact` — Contact form

### Client Dashboard
- [x] `/dashboard` — Home with live stats
- [x] `/dashboard/cases` — Role-aware case list
- [x] `/dashboard/cases/[id]` — Case detail with timeline + documents
- [x] `/dashboard/appointments` — Upcoming/past list
- [x] `/dashboard/appointments/book` — **Updated** — now uses real slots from consultation_slots table
- [x] `/dashboard/documents` — Upload/list/download/delete (Supabase Storage)
- [x] `/dashboard/profile` — Edit name/phone
- [x] `/dashboard/tickets` — Support ticket list
- [x] `/dashboard/tickets/new` — Create ticket
- [x] `/dashboard/tickets/[id]` — Threaded replies
- [x] `/dashboard/beneficiaries` — Sponsor only
- [x] `/dashboard/beneficiaries/add`
- [x] `/dashboard/contacts` — Sponsor only
- [x] `/dashboard/contacts/add`
- [x] `/dashboard/apply` — All 5 visa types available (no more "Coming Soon")
- [x] `/dashboard/apply/[visaType]` — Multi-step questionnaire engine

### Smart Form Assistant — All 5 Visa Types
- [x] `lib/questionnaire/types.ts` — TypeScript definitions
- [x] `lib/questionnaire/h1b.ts` — H-1B (6 sections, trimmed to beneficiary-friendly fields)
- [x] `lib/questionnaire/l1.ts` — L-1 Intracompany Transfer (5 sections)
- [x] `lib/questionnaire/green_card.ts` — Employment-Based Green Card (5 sections)
- [x] `lib/questionnaire/k1.ts` — K-1 Fiancé Visa (4 sections)
- [x] `lib/questionnaire/family_petition.ts` — Family Petition (4 sections)
- [x] `lib/questionnaire/index.ts` — All 5 registered and available
- [x] Save & resume (Supabase JSONB), conditional fields, USCIS references
- [x] Beneficiary-first design: EIN/NAICS/income figures optional or removed

### Email Notifications (Resend)
- [x] `lib/email/resend.ts` — 6 email functions with branded HTML templates
- [x] `app/api/email/route.ts` — Internal API route for client-side triggers
- [x] Application submitted → client confirmation + lawyer notification
- [x] Application status changed → client email with lawyer note
- [x] Ticket reply → other party notified
- [x] Appointment booked → client confirmation + admin notification
- [x] Appointment confirmed/cancelled → client notified
- [x] Case status updated → client email

### PDF Summary Download
- [x] `app/admin/applications/[id]/DownloadPdf.tsx` — Browser-side jspdf generation
- [x] Navy header, section headings, label:value rows, page numbers
- [x] Available in admin application detail sidebar

### Blog CMS (Admin)
- [x] `/admin/blog` — List all posts, publish/unpublish toggle, delete
- [x] `/admin/blog/new` — Create new post
- [x] `/admin/blog/[id]` — Edit existing post
- [x] `BlogPostForm.tsx` — Shared form (title, slug auto-gen, category, content, image, tags)
- [x] `BlogPostActions.tsx` — Publish/unpublish/delete client actions

### Lawyer Portal Actions
- [x] `LawyerActions.tsx` — Panel on case detail page (lawyer/admin only)
- [x] Add timeline events to any case
- [x] Upload documents directly to a case (Supabase Storage → documents table)

### Appointment Slots (Admin)
- [x] `/admin/slots` — Availability manager
- [x] Add single slot (date + time picker)
- [x] Bulk add Mon–Fri slots for N weeks with selected times
- [x] View/delete upcoming slots
- [x] Booked slots show client name, cannot be deleted

### Admin Panel
- [x] `/admin` — Overview dashboard
- [x] `/admin/applications` — All intake questionnaires
- [x] `/admin/applications/[id]` — Full review + status + lawyer notes + PDF download
- [x] `/admin/blog` — Blog CMS
- [x] `/admin/slots` — Availability manager
- [x] `/admin/cases` — All cases
- [x] `/admin/users` — All users
- [x] `/admin/tickets` — All tickets
- [x] `/admin/appointments` — All appointments with status updater

---

## 🔴 HIGH PRIORITY — Next Up

### 1. Add RESEND_API_KEY to Vercel
- [ ] Go to vercel.com → onestop-immigrationstation-web → Settings → Environment Variables
- [ ] Add `RESEND_API_KEY` = your full `re_JHfjmV6e...` key
- [ ] Redeploy so emails work in production (not just local)
- **Why:** Emails currently work locally but will silently fail in production until this is set

### 2. Pre-Filled USCIS PDF Forms (Phase 2)
- [ ] Install `pdf-lib` — maps questionnaire answers onto official USCIS form fields
- [ ] Download official I-129 PDF, identify field names with pdf-lib inspector
- [ ] Map H-1B questionnaire field IDs to I-129 form field names
- [ ] Generate partially pre-filled I-129 PDF downloadable from admin panel
- [ ] Extend to I-130 (Family), I-129F (K-1), I-140 (Green Card)
- **Why:** Reduces attorney prep time from hours to minutes

---

## 🟡 MEDIUM PRIORITY

### 3. News/Videos — Need Answers First (discuss tomorrow)
- [ ] **Decision needed:** Auto-publish or admin approval?
- [ ] **Decision needed:** YouTube links curated manually or auto-discovered?
- [ ] **Decision needed:** Archive threshold (1 year old?)
- [ ] Once decided: Vercel cron job → fetch USCIS RSS → insert to blog_posts

### 4. Community Blog — Need Answers First (discuss tomorrow)
- [ ] **Decision needed:** Who can post — any registered user, or verified clients only?
- [ ] **Decision needed:** Separate section from firm blog, or mixed?
- [ ] **Decision needed:** Upvotes / "helpful" reactions?
- [ ] Once decided: comments table, threaded UI on /blog/[slug]

### 5. Real-Time Case Status Emails
- [ ] Wire `sendCaseStatusEmail` when lawyer updates case status in admin
- [ ] Currently email is triggered from LawyerActions (timeline events) but not from admin cases page
- **Why:** Clients need to know when their case moves forward

### 6. Blog — Dynamic Archive/Category Filtering
- [ ] Wire sidebar category links on /blog to filter posts
- [ ] Add pagination (currently loads 20 posts max)

---

## 🟢 LOWER PRIORITY / FUTURE

### 7. Custom Domain
- [ ] Vercel → project → Settings → Domains → add `onestopimmigrationstation.com`
- [ ] GoDaddy DNS: A record → `76.76.21.21`, CNAME www → `cname.vercel-dns.com`
- [ ] Verify SSL auto-provisioned
- [ ] Update all email templates to use new domain URL
- **When:** After all features tested and signed off

### 8. Vercel Analytics
- [ ] Enable in Vercel dashboard → Analytics tab (free, one-click)
- [ ] Optional: add Plausible or Google Analytics

### 9. React Native Mobile App
- [ ] Set up Expo in `apps/mobile/` with Turborepo integration
- [ ] Supabase Auth in React Native (expo-auth-session for Google OAuth)
- [ ] Screens: Login, Signup, Dashboard, Cases, Appointments, Documents, Profile
- [ ] Push notifications (Expo Notifications)
- [ ] EAS Build → iOS App Store + Google Play Store

---

## 🗺️ KEY FILE LOCATIONS

| What | Path |
|------|------|
| Portal CSS | `apps/web/app/globals.css` |
| Public CSS | `apps/web/public/design/` |
| Dashboard shell | `apps/web/app/dashboard/layout.tsx` |
| Sidebar nav | `apps/web/components/PortalSidebar.tsx` |
| Email functions | `apps/web/lib/email/resend.ts` |
| Email API route | `apps/web/app/api/email/route.ts` |
| Questionnaire types | `apps/web/lib/questionnaire/types.ts` |
| All questionnaires | `apps/web/lib/questionnaire/` |
| Questionnaire engine | `apps/web/app/dashboard/apply/[visaType]/page.tsx` |
| PDF download | `apps/web/app/admin/applications/[id]/DownloadPdf.tsx` |
| Lawyer actions | `apps/web/app/dashboard/cases/[id]/LawyerActions.tsx` |
| Slot manager | `apps/web/app/admin/slots/SlotManager.tsx` |
| Blog CMS form | `apps/web/app/admin/blog/BlogPostForm.tsx` |
| Admin overview | `apps/web/app/admin/page.tsx` |
| Supabase server | `apps/web/lib/supabase/server.ts` |
| Supabase browser | `apps/web/lib/supabase/client.ts` |
| Route protection | `apps/web/middleware.ts` |
| DB migrations | `supabase/migrations/` |
| Test plan | `TESTING.md` |
