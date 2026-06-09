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

**Production environment variables (both now set in Vercel ✅):**
- `RESEND_API_KEY` = `re_JHfjmV6e_3nAdSADBTXioA4xnFCjZHYXX` ✅
- `SUPABASE_SERVICE_ROLE_KEY` = `sb_secret_IQKgcx_XtmOLv6MDiwp3ZQ_B6nbmYjA` ✅
- Vercel redeployed after adding keys ✅

**Testing:** Use both localhost AND https://onestop-immigrationstation-web.vercel.app
Both share the same Supabase database. Vercel is preferred for testing emails and
admin panel in production conditions.

---

## Step 20 — Vercel Environment Variables & Production Deployment ✅

**What:** Added secret environment variables to Vercel so the live site works identically to localhost.  
**Why:** `.env.local` only works locally. Vercel needs its own copy of secret keys.

### How to add/update environment variables in Vercel
1. Go to vercel.com → click your project **onestop-immigrationstation-web**
2. Click **Settings** tab (top nav, inside the project — not team settings)
3. Click **Environment Variables** in the left sidebar
4. Click **Add Environment Variable**
5. Enter Key + Value + check all 3 environments (Production, Preview, Development)
6. After adding all keys → go to **Deployments** → click **...** on latest → **Redeploy**

### Current Vercel Environment Variables
| Key | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (already there from setup) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase key for browser/RLS (already there) |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret admin key — bypasses RLS for admin panel reads ✅ added |
| `RESEND_API_KEY` | Resend email API — sends all notification emails ✅ added |

⚠️ If you ever rotate these keys (e.g. regenerate Resend API key), update both `.env.local` AND Vercel, then redeploy.

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
| All lawyers see all appointments | Admin client bypasses RLS | Fixed in Step 21 — lawyer_id FK + page filter |
| Password reset link goes to login page | PKCE code landed on wrong route | Fixed in Step 23 — reset page handles ?code= directly |
| Reset link redirected to localhost in production | NEXT_PUBLIC_SITE_URL not set in Vercel | Fixed in Step 23 — redirect URLs added to Supabase dashboard |

---

## Step 21 — Lawyer Appointment Security Fix ✅

**What:** Lawyers were seeing ALL appointments from all lawyers in `/admin/appointments`. Added `lawyer_id` FK to the `appointments` table so each appointment is scoped to the lawyer who owns the slot.  
**Why:** Privacy and security issue — if two lawyers are on the platform, they should not see each other's client bookings.

### Changes Made

**Migration 008** (`supabase/migrations/008_appointment_lawyer_id.sql`) — run in Supabase SQL Editor:
```sql
alter table public.appointments
  add column if not exists lawyer_id uuid references public.profiles(id) on delete set null;

create index if not exists appointments_lawyer_id_idx on public.appointments(lawyer_id);

-- Replace the old "Lawyers see all appointments" policy
drop policy if exists "Lawyers see all appointments" on public.appointments;
create policy "Lawyers see own appointments" on public.appointments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'lawyer'
        and (
          public.appointments.lawyer_id = auth.uid()
          or (public.appointments.lawyer_id is null and public.appointments.lawyer_name = profiles.full_name)
        )
    )
    or
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
```

**Booking page** (`/dashboard/appointments/book/page.tsx`) — now saves `lawyer_id` from the selected consultation slot into the new appointments column.

**Admin appointments page** (`/admin/appointments/page.tsx`) — server-side filter: if role is `lawyer`, query is scoped to `lawyer_id = user.id OR lawyer_name = profile.full_name` (backward compat for old rows). Admins still see all.

**Backward compatibility:** Old appointments without `lawyer_id` are matched by `lawyer_name` so existing bookings are not orphaned.

---

## Step 22 — Resend Setup Email for Lawyers ✅

**What:** Added a "Resend Setup Email" button to each lawyer row in `/admin/users`. Clicking it generates a fresh recovery link and re-sends the welcome email.  
**Why:** Supabase recovery tokens are single-use and expire in 1 hour. If a lawyer's setup link expired or they missed it, the admin previously had no way to resend it without deleting and recreating the account.

### New Files
- `app/admin/users/ResendSetupEmailButton.tsx` — client component, shows Sending… / ✓ Sent! / Failed states
- `app/api/admin/resend-setup-email/route.ts` — admin-only API route that:
  1. Verifies caller is admin
  2. Looks up the lawyer's email from Supabase Auth
  3. Calls `admin.auth.admin.generateLink({ type: 'recovery' })` for a fresh link
  4. Sends branded welcome email via Resend with the new link

The button only appears on rows where `role === 'lawyer'`.

---

## Step 23 — Password Reset Flow Fix ✅

**What:** Fixed the forgot-password / reset-password flow that was landing users on the login page instead of the set-password form.  
**Why:** The `@supabase/ssr` package uses PKCE (Proof Key for Code Exchange) by default. The old reset-password page only looked for `#access_token=` in the URL hash (implicit flow). With PKCE, Supabase sends a `?code=` query parameter instead — which the page ignored, showing "Invalid or expired link."

### Root Cause
`admin.auth.admin.generateLink()` creates a link to Supabase's `/auth/v1/verify` endpoint. After verifying, Supabase redirects to the `redirect_to` URL. With PKCE enabled, the redirect carries a `?code=` param. The old page only parsed the hash fragment → found nothing → showed the error screen.

### Fix Applied

**`/reset-password/page.tsx`** — now handles all three flows in order:
1. `?code=` in query string → calls `supabase.auth.exchangeCodeForSession(code)` (PKCE)
2. `#access_token=` in hash → calls `supabase.auth.setSession(...)` (implicit/legacy)
3. Neither → checks `supabase.auth.getSession()` for an existing session in cookies

**All `generateLink` calls** (forgot-password, create-lawyer, resend-setup-email) — `redirect_to` now points directly to `/reset-password`. The reset page handles whichever token format Supabase sends.

### Supabase Dashboard Configuration Required
Go to **Supabase Dashboard → Authentication → URL Configuration** and set:

| Field | Value |
|-------|-------|
| Site URL | `https://onestop-immigrationstation-web.vercel.app` |
| Redirect URLs | `https://onestop-immigrationstation-web.vercel.app/**` |
| Redirect URLs | `http://localhost:3000/**` |

Without these, Supabase ignores the `redirect_to` in the recovery link and falls back to the Site URL, landing users in the wrong place. ✅ Already configured.

---

## Step 24 — Appointment Confirmation Email with Location/Link ✅

**What:** When a lawyer confirms an appointment and sets a location (e.g. "Zoom") and meeting link, that information is now included in the confirmation email sent to the client.  
**Why:** Clients were seeing the location and meeting link in their portal but the confirmation email only said "confirmed" with no details — they had to log back in to find the Zoom link.

### Changes Made

**`lib/email/resend.ts`** — `sendAppointmentStatusEmail()` now accepts two new optional fields:
- `location?: string | null` — e.g. "Zoom", "Office Visit", "Phone Call"
- `meetingLink?: string | null` — meeting URL

When `status === 'confirmed'` and location is provided, the email body includes a styled block:
```
📍 Zoom
https://zoom.us/j/...
```

**`app/api/admin/update-appointment/route.ts`** — now sends an email to the client whenever status changes to `confirmed` or `cancelled`. Previously no email was sent from this route at all. Fetches the client's profile (name + email) from the appointment row and calls `sendAppointmentStatusEmail` with location and meeting link included.

---

## Step 25 — Create Case Directly from Admin ✅

**What:** Added a "+ New Case" button to `/admin/cases` that lets lawyers create a case without requiring a submitted intake application.  
**Why:** Walk-in and phone clients don't submit online questionnaires. Lawyers needed a way to open cases for these clients directly from the admin panel.

### New Files
- `app/admin/cases/NewCaseForm.tsx` — client component with inline expand/collapse form
- `app/api/admin/create-case/route.ts` — creates case, generates `OSIS-YYYY-NNN` number, adds "Case Opened" timeline event

### Form Fields
| Field | Notes |
|-------|-------|
| Client | Dropdown of all beneficiary/sponsor/contact users |
| Visa Type | 14 options (H-1B, L-1, Green Card, K-1, etc.) |
| Assigned Attorney | Pre-filled with logged-in user's name, editable |
| Description / Notes | Free text, optional |

On submit → creates case row → adds timeline event → navigates to new case detail page.

### SQL Required
```sql
-- Allow all 7 status values on the cases table
alter table public.cases drop constraint if exists cases_status_check;
alter table public.cases add constraint cases_status_check
  check (status in ('open','in_progress','pending_documents','submitted','approved','denied','closed'));
```
✅ Already run in Supabase.

---

## Step 26 — Case Status Update from Admin ✅

**What:** Built a new admin case detail page at `/admin/cases/[id]` with a status updater that emails the client on every change.  
**Why:** Cases were created but stuck at "open" forever — there was no way for a lawyer to update the status or communicate progress to the client through the portal.

### New Files
- `app/admin/cases/[id]/page.tsx` — admin case detail: client info card, description, full timeline
- `app/admin/cases/[id]/CaseStatusUpdater.tsx` — client component: status dropdown + optional note field + Save button
- `app/api/admin/update-case-status/route.ts` — updates status, inserts timeline event, emails client

### Status Progression
```
open → in_progress → pending_documents → submitted → approved / denied → closed
```

### How It Works
1. Lawyer opens `/admin/cases/[id]`
2. Right panel shows current status in a colour-coded dropdown
3. Lawyer changes status + optionally types a note to the client
4. Clicks **"Save & Notify Client"**
5. API: updates `cases.status`, inserts timeline event with attorney name + note, sends `sendCaseStatusEmail` via Resend
6. Client receives email with new status + attorney note; timeline updates in their portal

### Email Sent
Uses existing `sendCaseStatusEmail()` in `lib/email/resend.ts` — already wired, no changes needed there.

---

## Step 27 — USCIS Pre-Fill PDF Forms (pdf-lib) ✅

**What:** Added a server-side PDF generator that creates a "USCIS Pre-Fill Data Sheet" for each supported visa type. A lawyer can click one button on any application detail page and download a professionally formatted PDF with all client data pre-organized by the USCIS form's Part and Item numbers.

**Why:** Before this feature, a lawyer had to manually copy data from the intake questionnaire into the official USCIS form — looking up each field, cross-referencing answers, and typing everything in. This took 1–2 hours per application. With the pre-fill PDF, that time drops to ~15 minutes. The lawyer downloads the data sheet, sets it alongside the blank official USCIS form, and transfers values field-by-field.

### Forms Supported

| Visa Type | USCIS Form | Parts Covered |
|-----------|-----------|---------------|
| H-1B | I-129 + H Classification Supplement | Parts 1–7 (Employer, Classification, Beneficiary, Processing, Employment, Education, Immigration History) |
| Family Petition | I-130 | Parts 1–4 (Petitioner, Relationship, Beneficiary, Additional Info) |
| K-1 Fiancé(e) | I-129F | Parts 1–3 (US Petitioner, Fiancé(e), Relationship History) |
| Green Card (EB) | I-140 | Parts 1–5 (Petition Type, Employer, Beneficiary, Qualifications, Immigration History) |
| L-1 | — | Not yet mapped — button hidden for L-1 applications |

### How It Works (Technical)

1. **`lib/uscis/formMaps.ts`** — Data-driven field mapping file. Each form is defined as an array of Parts, each containing Fields. Every field knows its USCIS item number, label, and either which questionnaire answer field to read (`sourceField`) or a `compute()` function to derive/combine values. Fields marked `attorneyCompletes: true` are rendered with an amber background and "ATTORNEY COMPLETES" label.

2. **`lib/uscis/generatePdf.ts`** — The pdf-lib PDF builder (server-side Node.js). Creates a Letter-size PDF with:
   - Navy/gold firm header on every page with page numbers
   - Cover block with form number, client name, generation date
   - Amber disclaimer banner (attorney working document, do not file)
   - Legend explaining colour coding
   - Each Part as a navy header bar
   - Fields in a two-column layout (short fields) or full width (long text like duties/history)
   - White/blue = pre-filled from client data; Amber = attorney completes

3. **`GET /api/admin/uscis-form/[appId]`** — Server-side Next.js route. Auth-checks that caller is lawyer/admin, fetches the application + client profile from Supabase (admin client), calls `generateUscisFormPdf()`, returns the PDF bytes as `application/pdf` with a `Content-Disposition: attachment` header. The filename is e.g. `i129-prefill-maria-garcia.pdf`.

4. **`DownloadUscisForm.tsx`** — Client component button in the application detail sidebar. On click, fetches the API route, creates a blob URL, triggers a native browser download. Shows "Generating…" spinner and inline error if something fails. Only renders for visa types that have a mapping (hides automatically for L-1).

### Where It Appears

Admin application detail page (`/admin/applications/[id]`) → right sidebar → below "Download Summary PDF":

```
[ Download Summary PDF ]          ← existing jspdf button (all answers)
[ I-129 H-1B Pre-Fill ]           ← new pdf-lib button (USCIS form format)
```

### No Setup Required

This feature requires no database changes, no environment variables, and no external downloads. `pdf-lib` is installed as a Node.js package and generates PDFs entirely in memory on the server. The generated PDF is NOT filed with USCIS — it is an attorney working document.

### Adding L-1 Support (Future)

To add L-1 pre-fill support:
1. Open `lib/uscis/formMaps.ts`
2. Add an `l1` entry to `formsByVisaType` — the I-129 form is the same as H-1B but with the L Classification Supplement instead of H Classification Supplement
3. Map fields from the L-1 questionnaire (`lib/questionnaire/l1.ts`) to I-129 Parts 1–5 + L Supplement
4. The `DownloadUscisForm.tsx` button will automatically appear for L-1 applications once `formsByVisaType['l1']` is defined
