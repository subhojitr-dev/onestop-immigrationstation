# One Stop Immigration Station — Setup Guide

**Purpose:** This document is a step-by-step record of every setup action taken for the project.  
Use this to resume work after a break, onboard a new developer, or troubleshoot a configuration issue.  
Every step explains *what* was done and *why* — not just the commands.

---

## Project Overview

**Goal:** Replace an aging PHP/Angular/WordPress app with a modern, secure, scalable stack:
- **Next.js 16** website (public marketing pages + client portal dashboard)
- **React Native** mobile app for iOS + Android (not yet started)
- **Supabase** backend (PostgreSQL database, Auth, file Storage, Row Level Security)
- **Vercel** hosting (auto-deploys on every GitHub push)
- **Resend** transactional email (branded emails from verified domain)

**Live URL:** https://onestop-immigrationstation-web.vercel.app  
**GitHub:** https://github.com/subhojitr-dev/onestop-immigrationstation  
**Supabase:** https://xrhmnyyrufahqaintmvt.supabase.co  
**Vercel:** vercel.com → subhojitr-dev's projects → onestop-immigrationstation-web  
**Resend:** resend.com → subhojitr account → API key "onestop-immigration"

---

## Tech Stack

| Layer | Technology | Why Chosen |
|-------|-----------|------------|
| Monorepo | Turborepo | Houses web + mobile in one repo with shared packages |
| Frontend | Next.js 16 (App Router + Turbopack) | React framework with server components, file-based routing |
| Mobile | React Native + Expo | Cross-platform iOS/Android from one codebase |
| Database | Supabase (PostgreSQL) | Managed DB with built-in auth, RLS, storage — no backend server needed |
| Auth | Supabase Auth | Email+password + Google OAuth out of the box |
| Storage | Supabase Storage | S3-compatible file storage with RLS policies |
| Hosting | Vercel | One-click Next.js deployment, auto-deploys from GitHub |
| Email | Resend | Reliable transactional email, custom domain verified |
| Language | TypeScript | Type safety across the entire codebase |
| Styling | Claude Design CSS | Premium immigration-firm design system (navy/gold) |

---

## Step 1 — GitHub Repository ✅

**What:** Created the GitHub repository and pushed the initial Turborepo monorepo structure.  
**Why:** Version control + Vercel listens to this repo and auto-deploys on every push.

- Repo: `subhojitr-dev/onestop-immigrationstation`
- Branch: `main`
- Local path: `C:\Users\subho\onestop-immigrationstation`

---

## Step 2 — Monorepo Structure ✅

**What:** Set up Turborepo with `apps/web` for Next.js and `apps/mobile` placeholder for React Native.  
**Why:** Monorepo means one `git push` deploys both apps, and they can share TypeScript types.

```
onestop-immigrationstation/
├── apps/
│   ├── web/                     ← Next.js 16 app (deployed on Vercel)
│   │   ├── app/                 ← All pages (App Router)
│   │   ├── components/          ← Shared UI components
│   │   ├── lib/
│   │   │   ├── supabase/        ← Supabase client (browser) + server
│   │   │   ├── questionnaire/   ← Visa intake questionnaire definitions
│   │   │   └── email/           ← Resend email functions
│   │   ├── public/design/       ← Claude Design CSS + JS assets
│   │   └── middleware.ts        ← Auth route protection
│   └── mobile/                  ← React Native app (NOT YET STARTED)
├── packages/                    ← Shared types/utilities (future)
├── supabase/
│   └── migrations/              ← Database schema SQL files
└── package.json                 ← Turborepo workspace config
```

---

## Step 3 — Supabase Setup ✅

**What:** Created a Supabase project and ran database migrations to create all tables.  
**Why:** Supabase is the entire backend — it handles database, authentication, file storage, and access control. No custom API server needed.

**Project URL:** `https://xrhmnyyrufahqaintmvt.supabase.co`

### Environment Variables (set in both `.env.local` AND Vercel dashboard)
```
NEXT_PUBLIC_SUPABASE_URL=https://xrhmnyyrufahqaintmvt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_H2HNWNkpsWmcqNZrVYIHLg_ZQufiUXg
RESEND_API_KEY=re_JHfjmV6e...  (your full key — never commit this)
```

### Database Tables (16 total)
All tables have Row Level Security (RLS) enabled — users can only access their own data unless they are a lawyer/admin.

| Table | Purpose |
|-------|---------|
| `profiles` | Extends Supabase auth.users — stores full_name, phone, role (beneficiary/sponsor/contact/lawyer/admin) |
| `cases` | Immigration cases — linked to user, has visa_type, status, assigned_attorney |
| `case_timeline` | Events/milestones per case (e.g. "I-129 filed", "RFE received") |
| `appointments` | Consultation bookings — tracks free vs paid, 2 free per user |
| `consultation_slots` | Available time slots lawyers post — clients book from these |
| `beneficiaries` | Individuals sponsored by a sponsor company |
| `contacts` | HR contacts at sponsor companies |
| `documents` | Files uploaded to cases (stored in Supabase Storage) |
| `tickets` | Support tickets (NOT named support_tickets) |
| `ticket_replies` | Threaded replies on support tickets |
| `blog_posts` | CMS for public blog — title, slug, content, is_published |
| `newsletter_subscribers` | Email list signups |
| `loyalty_program` | Sponsor loyalty tracking |
| `applications` | Visa intake questionnaire responses (JSONB data field) |
| `notifications` | In-app notification system (exists, not yet wired to UI) |

### Migrations Run
```
supabase/migrations/001_initial_schema.sql  ← Tables, RLS, storage policies, auth trigger
supabase/migrations/002_applications.sql   ← applications table
supabase/migrations/003_slots.sql          ← consultation_slots table (CREATE TABLE IF NOT EXISTS)
```
**How to run:** Supabase dashboard → SQL Editor → New query → paste contents → Run

### Additional RLS Policies (run manually in SQL Editor — 2026-06-06)
**What:** The initial RLS policies only allowed users to see their own data. Lawyers and admins need to see ALL users' data in the admin panel.  
**Why:** Without these, `/admin/appointments`, `/admin/applications`, `/admin/cases` etc. all showed empty even though data existed — because Supabase blocked the admin from reading other users' rows.  
**Fix:** Run this SQL in Supabase → SQL Editor:

```sql
-- Appointments: lawyers/admins see all
drop policy if exists "Lawyers see all appointments" on public.appointments;
create policy "Lawyers see all appointments"
  on public.appointments for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin')));

-- Cases: lawyers/admins see all
drop policy if exists "Lawyers see all cases" on public.cases;
create policy "Lawyers see all cases"
  on public.cases for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin')));

-- Tickets: lawyers/admins see all
drop policy if exists "Lawyers see all tickets" on public.tickets;
create policy "Lawyers see all tickets"
  on public.tickets for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin')));

-- Documents: lawyers/admins see all
drop policy if exists "Lawyers see all documents" on public.documents;
create policy "Lawyers see all documents"
  on public.documents for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin')));

-- Profiles: lawyers/admins see all
drop policy if exists "Lawyers see all profiles" on public.profiles;
create policy "Lawyers see all profiles"
  on public.profiles for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin')));

-- Applications: lawyers/admins see all
drop policy if exists "Lawyers see all applications" on public.applications;
create policy "Lawyers see all applications"
  on public.applications for select
  using (exists (select 1 from public.profiles where id = auth.uid() and role in ('lawyer','admin')));
```

⚠️ **IMPORTANT — Do NOT add "Lawyers see all profiles"** — that policy is recursive.
It queries the profiles table to check if you're a lawyer, which triggers the policy again → infinite loop → breaks login for everyone. The original "Users see own profile" policy (`auth.uid() = id`) is sufficient because the admin layout only reads the current user's own profile row.

**The real fix for admin data reads** is the service role client in `lib/supabase/admin.ts` — it bypasses RLS entirely. All `/admin/*` server pages use `createAdminClient()` for data queries and `createClient()` only for auth checks.

### Additional Manual SQL (run after migrations — 2026-06-06)
**What:** Profile table schema fixes needed for lawyer accounts.  
**Why:** Original schema was missing `address` column and `lawyer` was not in the role check constraint.

```sql
-- Add address column to profiles
alter table public.profiles
  add column if not exists address text;

-- Fix role check constraint to include 'lawyer'
alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('beneficiary','sponsor','contact','admin','lawyer'));
```

### Storage Buckets
- `avatars` — PUBLIC bucket (profile pictures)
- `documents` — PRIVATE bucket with RLS policies
  - Files stored as `{userId}/{timestamp}-{filename}` for clients
  - Files stored as `cases/{caseId}/{timestamp}-{filename}` when uploaded by lawyers

### Auth Configuration
- Email/password sign-in: **ENABLED**
- Email confirmation: **ON** (requires verified domain)
- Google OAuth: **ENABLED**
  - Google Cloud Project: `OnestopImmigration`
  - Client ID: `190174754485-tukdav2fj92k91v393ub1g88ordoh2gq.apps.googleusercontent.com`
  - Authorized redirect: `https://xrhmnyyrufahqaintmvt.supabase.co/auth/v1/callback`

---

## Step 4 — Email Setup (Resend) ✅

**What:** Configured Resend as the transactional email provider with a verified custom domain.  
**Why:** Clients and lawyers need email notifications for application submissions, appointment confirmations, ticket replies, and case updates. Resend sends from a verified domain so emails don't go to spam.

### Configuration
- **Provider:** Resend (resend.com)
- **API Key name:** "onestop-immigration" (Full access)
- **Sender:** `noreply@onestopimmigrationstation.com`
- **Admin inbox:** `admin@onestopimmigrationstation.com` (receives lawyer notifications)
- **Supabase SMTP:** smtp.resend.com port 465 (for auth emails like password reset)

### DNS Records Added in GoDaddy
Required for domain verification (already done):
- SPF record
- DKIM record  
- MX record (for Resend relay)

### Email Functions (lib/email/resend.ts)
| Function | Trigger | Recipients |
|----------|---------|-----------|
| `sendApplicationSubmittedEmail` | Client submits questionnaire | Client (confirmation) + Admin (notification) |
| `sendApplicationStatusEmail` | Lawyer changes application status | Client |
| `sendTicketReplyEmail` | Any reply on a support ticket | The other party |
| `sendAppointmentBookedEmail` | Client books appointment | Client (confirmation) + Admin (notification) |
| `sendAppointmentStatusEmail` | Lawyer confirms/cancels appointment | Client |
| `sendCaseStatusEmail` | Lawyer adds timeline event | Client |

### API Route
`app/api/email/route.ts` — POST endpoint that client components use to trigger emails.  
Requires an active Supabase session — unauthenticated requests are rejected.

### ⚠️ Production Setup Required
`RESEND_API_KEY` must be added to **Vercel → Settings → Environment Variables** for emails to work in production. Without it, emails silently skip (app still works).

---

## Step 5 — Design Integration ✅

**What:** Integrated a custom "Claude Design Premium" CSS system into Next.js.  
**Why:** The immigration firm needs a professional, trustworthy appearance (navy/gold color scheme, serif headings).

**Design system:**
- Navy `#1a2744` + Gold `#b8952a` / `#cfa94a`
- Fonts: Lora (serif) + Libre Franklin (sans-serif)
- Files in `apps/web/public/design/`: styles.css, components.css, additions.css, pages.css, script.js
- Portal (dashboard) styles: `apps/web/app/globals.css`

**Critical fix — must never be removed:**
```css
/* In additions.css */
.reveal { opacity: 1 !important; transform: none !important; }
```
Without this, all mid-page content is invisible because Next.js loads JS too late for the reveal animation trigger.

---

## Step 6 — Vercel Deployment ✅

**What:** Connected GitHub repo to Vercel for automatic deployments.  
**Why:** Every `git push` to `main` automatically rebuilds and redeploys the site — no manual deployment steps.

**Configuration:**
- Root Directory: `apps/web` (important — Vercel must build the Next.js app, not the monorepo root)
- Framework: Next.js (auto-detected)
- Build Command: `next build` (default)
- Auto-deploys: On every push to `main`

**Environment Variables set in Vercel:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY` ← ⚠️ **Add this if not already done**

---

## Step 7 — Authentication ✅

**What:** Built login, signup, forgot password, reset password pages wired to Supabase Auth.  
**Why:** The client portal requires secure login. Each user has a role (beneficiary/sponsor/lawyer/admin) that controls what they see.

### Routes
| Route | Purpose |
|-------|---------|
| `/login` | Email+password + Google OAuth button |
| `/signup` | 2-step: role selection → account details |
| `/forgot-password` | Sends reset email via Supabase |
| `/reset-password` | Token-based password update |
| `/auth/callback` | OAuth redirect handler |

### Route Protection (middleware.ts)
Every request to `/dashboard/*` checks for a valid Supabase session. No session → redirect to `/login?redirectTo=[path]`. Also refreshes expired JWT tokens automatically.

### User Roles
| Role | What they see |
|------|--------------|
| `beneficiary` | Own cases, appointments, documents, apply/forms |
| `sponsor` | Same as beneficiary + Beneficiaries + HR Contacts sections |
| `contact` | HR person at sponsor company |
| `lawyer` | Everything including all cases/tickets across all users + admin panel |
| `admin` | Same as lawyer + full admin access |

---

## Step 8 — Client Dashboard ✅

**What:** Built 16 protected dashboard pages with live Supabase data.  
**Why:** This is the core product — the portal where clients manage their immigration cases, book appointments, upload documents, and communicate with attorneys.

### Architecture
- `app/dashboard/layout.tsx` (server component) — fetches user+profile, renders sidebar + topbar
- `components/PortalSidebar.tsx` (client component) — role-aware navigation, sign-out
- Each page just exports its content — no sidebar/topbar needed per page

### Pages
| Route | Purpose |
|-------|---------|
| `/dashboard` | Stats: active cases, upcoming appointments, free consultations remaining |
| `/dashboard/cases` | Case list (filtered by role) |
| `/dashboard/cases/[id]` | Case detail + timeline + docs + lawyer action panel |
| `/dashboard/appointments` | Appointments list |
| `/dashboard/appointments/book` | Book from real available slots |
| `/dashboard/documents` | Upload/download/delete files |
| `/dashboard/profile` | Edit name/phone |
| `/dashboard/tickets` | Support tickets |
| `/dashboard/tickets/new` | Create ticket |
| `/dashboard/tickets/[id]` | Threaded conversation |
| `/dashboard/beneficiaries` | Sponsor only — manage sponsored individuals |
| `/dashboard/beneficiaries/add` | Add beneficiary |
| `/dashboard/contacts` | Sponsor only — HR contacts |
| `/dashboard/contacts/add` | Add HR contact |
| `/dashboard/apply` | Visa type selection (all 5 types) |
| `/dashboard/apply/[visaType]` | Multi-step intake questionnaire |

---

## Step 9 — Smart Form Assistant ✅

**What:** Built 5 visa intake questionnaires that collect client information and save to Supabase.  
**Why:** The intake process is the first critical step in any immigration case. Without a structured questionnaire, lawyers spend hours collecting basic information via email/phone. This automates collection, saves client progress, and gives lawyers a formatted summary.

### Questionnaires Built
| Visa Type | Sections | Key Design Principle |
|-----------|---------|---------------------|
| H-1B | 6 | Employer info optional (EIN/NAICS lawyer-filled), beneficiary fills personal/education/history |
| L-1 | 5 | Foreign + US company names required, role type (L-1A vs L-1B) |
| Green Card | 5 | EB category selector, EB-1/NIW achievements section, priority date field |
| K-1 | 4 | US petitioner section + fiancé(e) section, relationship history |
| Family Petition | 4 | Relationship type selector, I-864 income (petitioner-filled, approximate) |

### Design Rule Applied Consistently
- **Beneficiary fills:** personal info, passport, job description, immigration history, education
- **Employer/Sponsor fills:** EIN, income, employee count (all optional with hints)
- **Lawyer determines:** NAICS codes (removed entirely), SOC codes (optional hint-only)

### Save & Resume
Answers saved to `applications.data` (JSONB) after every section. Client can close browser and resume exactly where they left off.

---

## Step 10 — Admin Panel ✅

**What:** Built a complete admin panel for lawyers/admins to manage all aspects of the firm.  
**Why:** Lawyers need to see submitted applications, update case statuses, manage blog content, and control appointment availability — all in one place.

### Admin Routes (lawyer/admin role only — others redirected)
| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard: 6 stat cards, recent applications, open tickets |
| `/admin/applications` | All intake questionnaires grouped by status |
| `/admin/applications/[id]` | Full application review + status update + PDF download |
| `/admin/blog` | Blog CMS: list, create, edit, publish, delete posts |
| `/admin/blog/new` | Create new blog post |
| `/admin/blog/[id]` | Edit existing post |
| `/admin/slots` | Availability manager: add/bulk-add/delete time slots |
| `/admin/cases` | All cases across all users |
| `/admin/users` | All registered users with role badges |
| `/admin/tickets` | All support tickets |
| `/admin/appointments` | All appointments with inline status updater |

---

## Step 11 — Email Notifications ✅

**What:** Wired Resend email triggers into key user actions.  
**Why:** Without email notifications, clients and lawyers have to constantly check the portal for updates. Automated emails ensure the right person is alerted immediately when something needs attention.

See Step 4 for the full list of email functions and triggers.

---

## Step 12 — PDF Summary Download ✅

**What:** Built a browser-side PDF generator in the admin application detail page.  
**Why:** Lawyers need a printable/shareable formatted summary of a client's questionnaire answers to prepare filings. The PDF uses jspdf (no server needed) and generates instantly in the browser.

**Location:** `app/admin/applications/[id]/DownloadPdf.tsx`  
**Output:** `[visatype]-intake-[clientname].pdf` — navy header, section headings, answered fields, page numbers.

---

## Step 13 — Blog CMS ✅

**What:** Wired the public blog to Supabase and built an admin CMS for creating/editing posts.  
**Why:** The firm needs to publish USCIS updates, immigration news, and legal insights. Previously the blog was 5 hardcoded articles that could never be updated without a developer.

**Public:** `/blog` (lists published posts) + `/blog/[slug]` (full article)  
**Admin:** `/admin/blog` (list/manage) + `/admin/blog/new` + `/admin/blog/[id]`  
**Fallback:** If no posts exist in Supabase, 3 hardcoded posts show so the page is never empty.

---

## Step 14 — Lawyer Portal Actions ✅

**What:** Added an action panel to the case detail page visible only to lawyers/admins.  
**Why:** Lawyers previously had no way to update case timelines or upload attorney-prepared documents from the portal. Clients would see a static case with no updates.

**Actions:**
- **Add Timeline Event** — types event name + optional description → inserts to `case_timeline`
- **Upload Document to Case** — selects file type + file → uploads to Supabase Storage → inserts to `documents` table linked to the case and client

---

## Step 15 — Real Appointment Slots ✅

**What:** Replaced hardcoded time buttons with real available slots from the database.  
**Why:** The previous booking page showed 12 hardcoded time slots regardless of actual attorney availability. Clients could book times when no one was available, creating confusion.

**How it works:**
1. Lawyer goes to `/admin/slots` → adds available dates + times (single or bulk Mon-Fri)
2. Client goes to `/dashboard/appointments/book` → sees only dates that have real slots
3. Client selects date → available times appear → confirms → slot marked `is_booked = true`

**Migration required:** Run `supabase/migrations/003_slots.sql` in Supabase SQL Editor.

---

## Common Commands

```bash
# Start local dev server
cd C:\Users\subho\onestop-immigrationstation\apps\web
npm run dev
# → http://localhost:3000

# Build for production (test before pushing)
npm run build

# Commit and push (triggers Vercel auto-deploy in ~2 minutes)
cd C:\Users\subho\onestop-immigrationstation
git add -A
git commit -m "your message"
git push
```

---

## Known Issues & Gotchas

| Issue | Cause | Fix |
|-------|-------|-----|
| Mid-page content invisible | `.reveal` class hides content until JS fires | `opacity: 1 !important` in additions.css — never remove |
| `liberty.png` not found | Relative path breaks on non-root routes | Use `/liberty.png` (absolute) in script.js |
| `globals.css` not loading | Must be imported in layout.tsx | `import "./globals.css"` in app/layout.tsx |
| Images staying hidden | Wrong CSS class on container | Use `className="ph has-img"` not just `ph` |
| Port 3000 already in use | Previous dev server still running | `taskkill /F /IM node.exe` on Windows |
| `consultation_slots` table missing | Migration 001 definition didn't run | Run migration 003 (CREATE TABLE IF NOT EXISTS) |
| Emails not sending in production | `RESEND_API_KEY` not set in Vercel | Add to Vercel → Settings → Environment Variables |
| Next.js version differences | This is Next.js 16 with Turbopack | Read `node_modules/next/dist/docs/` if APIs differ from memory |

---

## Existing PHP Codebase (Reference Only — Being Replaced)

The old system is kept for reference only — do not modify it.

- **PHP REST API:** `C:\Users\subho\xampp\htdocs\mylegalweb\mylegal-web\`
- **Angular/Ionic app:** `C:\Users\subho\xampp\htdocs\mylegal\src\pages\`
- **Database:** MySQL (`mylegali_my_legail`)
- **Problems:** MD5 passwords (insecure), raw SQL injection risk, WordPress mixed in

---

## Next Steps

See `TODO.md` for the full prioritized task list.  
See `TESTING.md` for the complete test plan.

**Immediate action required:**
1. Add `RESEND_API_KEY` to Vercel environment variables (for production emails)
2. Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables (for admin panel data reads)
3. Test all features using `TESTING.md` as the checklist

---

## Step 16 — Admin Panel Data Visibility Fix ✅

**What:** Admin pages (applications, appointments, tickets etc.) were showing empty even though data existed.  
**Why:** The regular Supabase server client uses the anon key and respects RLS — so a lawyer reading another user's data gets blocked. The fix is a service role client that bypasses RLS for admin reads.

**Solution: Two-client pattern**

```
lib/supabase/server.ts  → anon key, respects RLS → use for auth checks only
lib/supabase/admin.ts   → service role key, bypasses RLS → use for admin data reads
```

All `/admin/*` server pages now do:
```typescript
const supabase = await createClient()          // auth check
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect('/login')

const admin = createAdminClient()              // data reads
const { data } = await admin.from('...').select(...)
```

**env variable required:** `SUPABASE_SERVICE_ROLE_KEY=sb_secret_IQKgcx_XtmOLv6MDiwp3ZQ_B6nbmYjA`  
Set in both `apps/web/.env.local` AND Vercel dashboard.

**Admin API routes** (for client-side mutations that need to bypass RLS):
- `POST /api/admin/update-appointment` — lawyer updates appointment status
- `POST /api/admin/update-application` — lawyer updates application status/notes
- `POST /api/admin/open-case` — converts application into active legal case
- `POST /api/admin/update-user-role` — admin changes any user's role
- `POST /api/admin/create-lawyer` — admin creates lawyer account

---

## Step 17 — Application → Case Flow ✅

**What:** Added "Open Case" button on application detail page that auto-creates a case from the application.  
**Why:** Cases and applications were completely disconnected. Lawyers had no way to convert a reviewed application into an active legal case without direct database access.

**Flow:**
1. Client submits questionnaire → `applications` table, status = `submitted`
2. Lawyer reviews in `/admin/applications/[id]` → adds notes → changes status → **Save Review**
3. Lawyer clicks **"+ Open Case for This Application"**
4. `/api/admin/open-case` creates a row in `cases` table with:
   - Auto-generated case number: `OSIS-YYYY-NNN`
   - visa_type from the application
   - user_id = the client's user ID
   - assigned_attorney = the lawyer's name
   - Initial timeline event: "Case Opened"
5. Case appears in `/admin/cases` and client's `/dashboard/cases`

---

## Step 18 — Lawyer Account Management ✅

**What:** Admin can create lawyer accounts and change any user's role from the UI — no SQL required.  
**Why:** Previously, creating a lawyer required direct Supabase SQL access. The admin needed a UI to manage this.

### Creating a Lawyer Account (/admin/users/new)
1. Go to `/admin/users` → click **+ Add New Lawyer**
2. Fill: First Name, Last Name, Email, Phone, Address
3. Click **Create Lawyer Account**
4. System calls `/api/admin/create-lawyer` which:
   - Creates Supabase auth user (pre-verified, no email confirmation needed)
   - Creates profile row with role = `lawyer`
   - Sends welcome email with "Set My Password" link
5. Lawyer clicks the link → sets password → logs in → goes to `/admin` automatically

### Changing User Roles (/admin/users)
Each user row has an inline role dropdown. Change it → saves instantly via `/api/admin/update-user-role`.  
Only `admin` role users can change roles (lawyers cannot).

---

## Step 19 — Lawyer-Specific Admin Views ✅

**What:** Lawyers see only their own availability slots; role-based redirect on login.  
**Why:** All lawyers sharing one slot pool created confusion. Each lawyer should manage their own calendar.

**Availability (/admin/slots):**
- Filters by `lawyer_id = auth user's id`
- Shows "My Availability" with count of available vs booked slots
- Adding a slot sets `lawyer_id` to the current user
- Client booking page queries slots without lawyer_id filter (sees all available slots)

**Login redirect:**
- `lawyer` or `admin` role → `/admin`
- All other roles → `/dashboard`

---

## Known Issues & Gotchas (Updated)

| Issue | Cause | Fix |
|-------|-------|-----|
| Mid-page content invisible | `.reveal` class hides content | `opacity: 1 !important` in additions.css — never remove |
| `liberty.png` not found | Relative path breaks | Use `/liberty.png` in script.js |
| `globals.css` not loading | Must be imported | `import "./globals.css"` in app/layout.tsx |
| Images staying hidden | Wrong CSS class | Use `className="ph has-img"` |
| Port 3000 in use | Prior server running | `taskkill /F /IM node.exe` on Windows |
| `consultation_slots` missing | Not created in 001 | Run migration 003 |
| Emails not sending in production | Key not in Vercel | Add `RESEND_API_KEY` to Vercel env vars |
| Admin shows empty data | Regular client respects RLS | Use `createAdminClient()` for admin data reads |
| "Lawyers see all profiles" policy | Recursive — breaks login | Never add this policy — use admin client instead |
| Appointment status reverts | RLS blocks lawyer updating client's row | Use `/api/admin/update-appointment` route |
| `profiles_role_check` blocks lawyer | Constraint missing 'lawyer' | Run manual SQL to drop + recreate constraint |
| `address` column missing | Not in original schema | Run: `alter table public.profiles add column if not exists address text` |
| Dev server env changes ignored | Env only loads on start | Restart `npm run dev` after `.env.local` changes |
