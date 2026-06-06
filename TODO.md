# One Stop Immigration Station — Master TODO

Last updated: 2026-06-05

---

## ✅ COMPLETED — Everything Built So Far

### Infrastructure
- [x] GitHub repo created (`subhojitr-dev/onestop-immigrationstation`)
- [x] Turborepo monorepo structure (`apps/web`, `apps/mobile` placeholder)
- [x] Next.js 16 in `apps/web/`
- [x] Supabase project — 15 tables, RLS policies, Storage buckets
- [x] Deployed to Vercel — https://onestop-immigrationstation-web.vercel.app
- [x] Custom email domain — noreply@onestopimmigrationstation.com (Resend SMTP, GoDaddy DNS verified)
- [x] Google OAuth — Google Cloud project "OnestopImmigration" wired to Supabase

### Design System (v2 Claude Design Premium)
- [x] Navy `#1a2744` + Gold `#b8952a` color scheme
- [x] Fonts: Lora (serif headings) + Libre Franklin (body)
- [x] Gradient sidebar (`linear-gradient(184deg,#21314f,#16223c,#0f1a30)`) with gold active indicator
- [x] All portal CSS in `apps/web/app/globals.css`
- [x] Public pages CSS in `apps/web/public/design/` (styles.css, components.css, additions.css, pages.css)
- [x] `.reveal { opacity: 1 !important; }` fix in additions.css for scroll animations

### Auth
- [x] `/login` — email+password + Google OAuth button
- [x] `/signup` — 2-step: role selection → details form (creates profile row)
- [x] `/forgot-password` — calls Supabase resetPasswordForEmail()
- [x] `/reset-password` — accepts token from email, updates password
- [x] `/auth/callback` — OAuth redirect handler
- [x] `middleware.ts` — route protection (redirects unauthenticated users to /login)

### Public Pages
- [x] `/` — Homepage (Claude Design)
- [x] `/blog` — 5 articles + sidebar (hardcoded, not yet wired to Supabase)
- [x] `/success-stories` — 6 testimonials
- [x] `/videos` — 6 video cards
- [x] `/press-media` — 6 press items
- [x] `/contact` — Contact form

### Dashboard (Client Portal)
- [x] Shared layout: `apps/web/app/dashboard/layout.tsx` (server component, fetches user+profile)
- [x] `components/PortalSidebar.tsx` — client component, role-aware nav, sign-out
- [x] `/dashboard` — home with live stats (cases, appointments, free consultations)
- [x] `/dashboard/cases` — list cases by role (beneficiary/sponsor/lawyer)
- [x] `/dashboard/cases/[id]` — case detail with timeline + documents + help card
- [x] `/dashboard/appointments` — upcoming/past list with free consultation counter
- [x] `/dashboard/appointments/book` — booking form (inserts to Supabase)
- [x] `/dashboard/documents` — upload/list/download/delete (Supabase Storage)
- [x] `/dashboard/profile` — edit name/phone, change password
- [x] `/dashboard/tickets` — support ticket list (lawyers see all tickets)
- [x] `/dashboard/tickets/new` — create ticket (subject, description, priority, case)
- [x] `/dashboard/tickets/[id]` — ticket detail with threaded replies
- [x] `/dashboard/beneficiaries` — sponsor only: list beneficiaries with stats
- [x] `/dashboard/beneficiaries/add` — add beneficiary form
- [x] `/dashboard/contacts` — sponsor only: HR contacts list
- [x] `/dashboard/contacts/add` — add HR contact form
- [x] `/dashboard/apply` — visa type selection (H-1B available, others Coming Soon)
- [x] `/dashboard/apply/[visaType]` — H-1B multi-step questionnaire (6 sections, 60+ fields, save & resume)

### Smart Form Assistant — H-1B Questionnaire
- [x] `lib/questionnaire/types.ts` — TypeScript types (FieldType, QuestionField, Section, VisaQuestionnaire)
- [x] `lib/questionnaire/h1b.ts` — Full H-1B data:
  - Section 1: Employer Info (company name, EIN, address, HR contact, cap-exempt check)
  - Section 2: Beneficiary Personal Info (passport, current address, immigration status, I-94)
  - Section 3: Education & Qualifications (degree, field, institution, credential evaluation)
  - Section 4: Job Position Details (title, duties, hours, salary, work location, remote)
  - Section 5: Immigration History (prior US stays, prior H-1B, denials, violations, criminal)
  - Section 6: Documents Checklist (what the client has ready to upload)
- [x] `lib/questionnaire/index.ts` — exports all questionnaires and visa type options
- [x] Save & resume: answers stored in Supabase `applications` table (JSONB `data` column)
- [x] Conditional fields: `showIf` logic hides/shows fields based on prior answers
- [x] USCIS form references shown next to field labels (e.g. "I-129 Part 2, Item 1")
- [x] Supabase migration `002_applications.sql` — applications table with RLS

### Admin Panel (`/admin` — lawyer/admin only)
- [x] `/admin` — overview dashboard (6 stats cards, recent applications, open tickets)
- [x] `/admin/applications` — all intake questionnaires, grouped by status
- [x] `/admin/applications/[id]` — full application review (all answers displayed, lawyer notes, status updater)
- [x] `/admin/cases` — all cases table
- [x] `/admin/users` — all registered users with role badges
- [x] `/admin/tickets` — all support tickets with reply counts
- [x] `/admin/appointments` — all appointments with inline status updater (confirm/cancel/complete)

---

## 🔴 HIGH PRIORITY — Next Build Phase

### 1. Additional Visa Questionnaires (Phase 2)
- [ ] L-1 questionnaire (`lib/questionnaire/l1.ts`) — Intracompany transferee
- [ ] Green Card questionnaire (`lib/questionnaire/green_card.ts`) — I-140 + I-485 + I-864
- [ ] K-1 questionnaire (`lib/questionnaire/k1.ts`) — Fiancé(e) visa
- [ ] Family Petition questionnaire (`lib/questionnaire/family_petition.ts`) — I-130 + I-485 + I-864
- [ ] Update `lib/questionnaire/index.ts` to export all four
- [ ] Update `/dashboard/apply` to un-mark those visa types as "Coming Soon"

### 2. Summary PDF Generation
- [ ] Install `@react-pdf/renderer` or use `jspdf`
- [ ] Create PDF template that formats all H-1B answers into a lawyer-readable summary
- [ ] Add "Download Summary" button on `/admin/applications/[id]`
- [ ] Extend to other visa types once questionnaires are built

### 3. Pre-filled USCIS Forms (Phase 2 — after PDF summary)
- [ ] Install `pdf-lib`
- [ ] Map H-1B questionnaire answer IDs to I-129 form field names
- [ ] Download official I-129 PDF, identify field names with pdf-lib
- [ ] Generate partially pre-filled I-129 PDF from application data
- [ ] Lawyer downloads the pre-filled PDF and completes the rest

### 4. Email Notifications
- [ ] Set up Resend API client (`@resend/node` or REST)
- [ ] Trigger on application submitted → email lawyer + client
- [ ] Trigger on case status change → email client
- [ ] Trigger on appointment confirmation → email client
- [ ] Trigger on ticket reply → email the other party
- [ ] Use `noreply@onestopimmigrationstation.com` as sender

### 5. Lawyer Portal Views
- [ ] `/dashboard/cases/[id]` — let lawyers add timeline events inline
- [ ] `/dashboard/cases/[id]` — let lawyers upload documents to the case
- [ ] `/admin/cases/[id]` — assign case to specific lawyer from users list

---

## 🟡 MEDIUM PRIORITY

### 6. Connect Blog to Supabase
- [ ] Wire `/blog` to `blog_posts` table (dynamic listing)
- [ ] Add `/blog/[slug]` dynamic page
- [ ] Admin: create/edit/delete posts from `/admin/blog`

### 7. Auto-Updating News / Videos
- [ ] USCIS RSS feed → `blog_posts` table (scheduled Vercel cron job)
- [ ] YouTube RSS for videos section

### 8. Real Appointment Slots
- [ ] Populate `consultation_slots` table with lawyer availability
- [ ] Wire `/dashboard/appointments/book` to select from available slots instead of free-text date/time

### 9. Community Blog with Threaded Comments
- [ ] Comments table in Supabase (post_id, user_id, parent_id for threading, body)
- [ ] Public comment UI on `/blog/[slug]`

---

## 🟢 LOWER PRIORITY / FUTURE

### 10. Custom Domain on Vercel
- [ ] Vercel → project → Settings → Domains → add `onestopimmigrationstation.com`
- [ ] GoDaddy DNS: A record → `76.76.21.21`, CNAME www → `cname.vercel-dns.com`
- [ ] Verify SSL auto-provisioned

### 11. Analytics
- [ ] Enable Vercel Analytics (free, 1-click in Vercel dashboard)
- [ ] Add Google Analytics or Plausible

### 12. React Native Mobile App
- [ ] Set up Expo in `apps/mobile/` with Turborepo integration
- [ ] Supabase Auth in React Native (expo-auth-session for Google OAuth)
- [ ] Screens: Login, Signup, Dashboard, Cases, Appointments, Documents, Profile
- [ ] EAS Build → iOS App Store + Google Play Store

---

## 🧪 TESTING CHECKLIST (do this now before building Phase 2)

- [ ] Run `npm run dev` from `apps/web/` — confirm local server starts
- [ ] Sign up as new user → confirm profile row created in Supabase
- [ ] Go to `/dashboard/apply` → click H-1B → start questionnaire
- [ ] Fill Section 1, click "Save & Continue" → confirm row appears in `applications` table
- [ ] Complete all 6 sections → submit → confirm status changes to "submitted"
- [ ] Log in as lawyer/admin → go to `/admin/applications` → see submitted application
- [ ] Open the application → update status to "under_review" → confirm it updates in DB
- [ ] Test save & resume: mid-way through questionnaire, close browser, reopen → answers preserved

---

## 🗺️ KEY FILE LOCATIONS

| What | Path |
|------|------|
| Portal CSS (dashboard) | `apps/web/app/globals.css` |
| Public page CSS | `apps/web/public/design/` |
| Dashboard shell | `apps/web/app/dashboard/layout.tsx` |
| Sidebar nav | `apps/web/components/PortalSidebar.tsx` |
| Questionnaire types | `apps/web/lib/questionnaire/types.ts` |
| H-1B questionnaire | `apps/web/lib/questionnaire/h1b.ts` |
| Questionnaire index | `apps/web/lib/questionnaire/index.ts` |
| Questionnaire UI | `apps/web/app/dashboard/apply/[visaType]/page.tsx` |
| Admin overview | `apps/web/app/admin/page.tsx` |
| Supabase server client | `apps/web/lib/supabase/server.ts` |
| Supabase browser client | `apps/web/lib/supabase/client.ts` |
| Route protection | `apps/web/middleware.ts` |
| DB migrations | `supabase/migrations/` |
