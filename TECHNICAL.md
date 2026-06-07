# One Stop Immigration Station — Technical Reference

**Last updated:** 2026-06-07  
**Audience:** Developers joining the project, or Claude sessions resuming work  

---

## 1. Project Overview

A full-stack immigration law platform with:
- **Public marketing website** — homepage, blog, videos, success stories
- **Client portal** — beneficiaries and sponsors manage cases, documents, appointments
- **Admin/Lawyer portal** — attorneys manage cases, review applications, communicate with clients
- **React Native mobile app** — planned, not yet started

---

## 2. Monorepo Structure (Turborepo)

```
onestop-immigrationstation/          ← repo root
├── apps/
│   ├── web/                         ← Next.js 16 web app (this is the main codebase)
│   └── mobile/                      ← React Native (placeholder only — not started)
├── packages/                        ← shared packages (empty for now)
├── supabase/
│   └── migrations/                  ← SQL files run in Supabase SQL Editor
├── package.json                     ← root workspace config (Turborepo)
├── turbo.json                       ← Turborepo pipeline config
├── TODO.md                          ← master task list
├── ISSUES.md                        ← running bug/issue log
├── SETUP.md                         ← step-by-step setup history
└── TECHNICAL.md                     ← this file
```

**To run locally:**
```bash
cd apps/web
npm run dev        # starts at http://localhost:3000
```

---

## 3. Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.2.7 | React framework — App Router, server components, API routes |
| UI | React | 19.2.4 | Component model |
| Language | TypeScript | ^5 | Type safety across all files |
| Database | Supabase (PostgreSQL) | — | Managed DB, Auth, Storage, RLS |
| Auth | Supabase Auth | — | Email+password + Google OAuth |
| Storage | Supabase Storage | — | File uploads (documents, avatars) |
| Email | Resend | ^6.12.4 | Transactional email via resend.com |
| PDF | jsPDF | ^4.2.1 | Browser-side PDF generation |
| SSR Auth | @supabase/ssr | ^0.10.3 | Cookie-based session management for Next.js App Router |
| Hosting | Vercel | — | Auto-deploys on every push to `main` |
| Styling | Custom CSS | — | Claude Design Premium system (no Tailwind in portal) |
| Linting | ESLint | ^9 | Code quality |

**Note on Tailwind:** Tailwind is installed as a dev dependency but is NOT used in the main codebase. All styling is done with the custom Claude Design CSS system (inline styles in components + CSS files in `public/design/`).

---

## 4. Next.js App Router — Key Concepts

This project uses the **App Router** (not the older Pages Router). Key differences:

### Server Components vs Client Components
- **Server Components** (default) — run on the server, can `await` database calls directly, never sent as JS to browser. Used for data-fetching pages.
- **Client Components** — marked with `'use client'` at top of file. Run in the browser, can use `useState`, `useEffect`, event handlers. Used for interactive UI.

### File Conventions
```
app/
├── layout.tsx          ← wraps all pages at this level and below
├── page.tsx            ← the page rendered at this URL
├── route.ts            ← API endpoint (GET/POST handlers)
└── [param]/            ← dynamic route segment (e.g. [id], [slug])
```

### Data Flow Pattern Used in This Project
```
Server Component (page.tsx)
  → fetches from Supabase directly (no useEffect needed)
  → passes data as props to Client Components
  
Client Component (XyzActions.tsx)
  → receives initial data as props
  → handles user interactions (clicks, form submissions)
  → calls /api/admin/* routes for mutations
```

---

## 5. Supabase Client Setup

Three separate clients — always use the right one:

### `lib/supabase/server.ts`
```typescript
// Used in: Server components and API routes for AUTH CHECKS ONLY
// Uses: ANON key — respects Row Level Security
// When: supabase.auth.getUser(), reading own user's data
import { createServerClient } from '@supabase/ssr'
```

### `lib/supabase/admin.ts`
```typescript
// Used in: Admin pages and API routes for DATA READS across all users
// Uses: SERVICE ROLE key — BYPASSES Row Level Security entirely
// When: /admin/* pages need to read all users' data
// WARNING: Never expose this client to the browser
import { createClient } from '@supabase/supabase-js'
```

### `lib/supabase/client.ts`
```typescript
// Used in: Client components ('use client') for browser-side operations
// Uses: ANON key — respects Row Level Security
// When: user actions (booking, uploading, posting comments)
import { createBrowserClient } from '@supabase/ssr'
```

**Critical rule:** Admin pages MUST use `createAdminClient()` for data reads, and `createClient()` (server.ts) only for auth checks. Never mix them up.

---

## 6. Environment Variables

```bash
# apps/web/.env.local  (also set in Vercel dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xrhmnyyrufahqaintmvt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...    # safe to expose to browser
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...              # NEVER expose to browser
RESEND_API_KEY=re_...                                # NEVER expose to browser
NEXT_PUBLIC_SITE_URL=http://localhost:3000           # change to live URL in Vercel
```

`NEXT_PUBLIC_*` variables are bundled into the browser JS. All others are server-only.

---

## 7. File-by-File Reference

### Root App Files

| File | Type | What it does |
|------|------|-------------|
| `app/layout.tsx` | Server | Root HTML shell — loads fonts (Lora + Libre Franklin), CSS files, and design script. Wraps every page. |
| `app/page.tsx` | Server | Public homepage — hero, services grid, testimonials, CTA sections |
| `middleware.ts` | Special | Route protection — redirects unauthenticated users away from /dashboard and /admin. Runs on every request before the page renders. (Note: deprecated in Next.js 16 — should be renamed to proxy.ts) |

---

### Public Pages

| File | Type | What it does |
|------|------|-------------|
| `app/blog/page.tsx` | Server | Blog listing — fetches published posts from Supabase `blog_posts`. Falls back to 3 hardcoded posts if none exist. |
| `app/blog/[slug]/page.tsx` | Server | Individual blog post — fetches by slug, renders content, shows related sidebar, loads `BlogComments` component |
| `app/blog/[slug]/BlogComments.tsx` | Client | Threaded comment system — post comments, reply to comments, soft-delete. Registered users only. |
| `app/videos/page.tsx` | Server | Videos page — currently static, will be dynamic when video CMS is built |
| `app/success-stories/page.tsx` | Server | Static success stories page |
| `app/press-media/page.tsx` | Server | Static press and media page |
| `app/contact/page.tsx` | Server | Contact page with form |

---

### Auth Pages

| File | Type | What it does |
|------|------|-------------|
| `app/login/page.tsx` | Client | Email+password login + Google OAuth. On success, reads user role from profiles and redirects: admin/lawyer → /admin, others → /dashboard. Password eye toggle included. |
| `app/signup/page.tsx` | Client | 2-step signup: Step 1 = role selection (beneficiary/sponsor), Step 2 = details form. Creates auth user + profile row. Password eye toggle included. |
| `app/forgot-password/page.tsx` | Client | Sends password reset email via `/api/auth/forgot-password` (Resend) — NOT Supabase's email system (unreliable on free tier) |
| `app/reset-password/page.tsx` | Client | Parses `access_token` from URL hash, calls `setSession()`, shows password form. Eye toggle on both fields. Redirects to /login after success. |
| `app/auth/callback/route.ts` | API | OAuth callback handler — exchanges code for session, reads role, redirects admin/lawyer to /admin, others to /dashboard |

---

### Client Dashboard

All dashboard pages are **Server Components** that fetch data directly from Supabase and pass it down to Client Components for interactivity.

| File | Type | What it does |
|------|------|-------------|
| `app/dashboard/layout.tsx` | Server | Dashboard shell — auth check, loads `PortalSidebar`, wraps all /dashboard/* pages |
| `app/dashboard/page.tsx` | Server | Dashboard home — live stats (cases, appointments, tickets, documents counts) |
| `app/dashboard/cases/page.tsx` | Server | Case list — role-aware: lawyers see all, clients see own cases |
| `app/dashboard/cases/[id]/page.tsx` | Server | Case detail — timeline, documents, case info. Includes `LawyerActions` panel for lawyers/admins only |
| `app/dashboard/cases/[id]/LawyerActions.tsx` | Client | Lawyer-only panel: add timeline events, upload documents to case |
| `app/dashboard/appointments/page.tsx` | Server | Appointment list — shows location and "Join Meeting" link when confirmed |
| `app/dashboard/appointments/book/page.tsx` | Client | Booking flow — fetches available slots by date, lets user pick time, books slot, captures lawyer_name |
| `app/dashboard/documents/page.tsx` | Client | Document manager — upload to Supabase Storage, download via signed URL, delete |
| `app/dashboard/profile/page.tsx` | Client | Profile editor — name/phone for all users; Gender/DOB/Qualification for lawyer/admin roles |
| `app/dashboard/tickets/page.tsx` | Server | Support ticket list |
| `app/dashboard/tickets/new/page.tsx` | Client | Create new support ticket |
| `app/dashboard/tickets/[id]/page.tsx` | Server | Ticket thread — shows all replies, includes reply form |
| `app/dashboard/beneficiaries/page.tsx` | Server | Beneficiary list (sponsor role only) |
| `app/dashboard/beneficiaries/add/page.tsx` | Client | Add beneficiary form (sponsor role only) |
| `app/dashboard/contacts/page.tsx` | Server | HR contacts list (sponsor role only) |
| `app/dashboard/contacts/add/page.tsx` | Client | Add HR contact form (sponsor role only) |
| `app/dashboard/apply/page.tsx` | Server | Visa type selection — shows all 5 visa types as cards |
| `app/dashboard/apply/[visaType]/page.tsx` | Client | Multi-step questionnaire engine — loads questionnaire definition from lib/questionnaire/, auto-saves answers to Supabase, supports save-and-resume |

---

### Admin Panel

Admin pages use `createAdminClient()` for all data reads (bypasses RLS). Auth check uses `createClient()` (server.ts).

| File | Type | What it does |
|------|------|-------------|
| `app/admin/layout.tsx` | Server | Admin shell — auth + role check (redirects non-lawyers/admins to /dashboard), loads admin sidebar |
| `app/admin/page.tsx` | Server | Admin overview — stats (total users, applications, cases, open tickets), recent submissions, open tickets |
| `app/admin/applications/page.tsx` | Server | All submitted questionnaires — grouped by status, shows "Action Required" alert for new submissions |
| `app/admin/applications/[id]/page.tsx` | Server | Application detail — full questionnaire answers side by side. Passes data to `ApplicationActions` and `DownloadPdf` |
| `app/admin/applications/[id]/ApplicationActions.tsx` | Client | Review sidebar — status radio buttons (includes case_opened), lawyer notes textarea, Save Review button, Open Case button (guarded against duplicates) |
| `app/admin/applications/[id]/DownloadPdf.tsx` | Client | PDF download button — generates formatted PDF in browser using jsPDF. Formats dates, salary, yes/no values. No emojis (jsPDF doesn't support them). |
| `app/admin/cases/page.tsx` | Server | All cases table — case number, visa type, client, attorney, status, date opened |
| `app/admin/appointments/page.tsx` | Server | All appointments — upcoming and past, with status updater and location/meeting link display |
| `app/admin/appointments/AppointmentStatusUpdater.tsx` | Client | Status dropdown — when changed to "Confirmed", shows location selector + meeting link input. Saves via `/api/admin/update-appointment` |
| `app/admin/tickets/page.tsx` | Server | All support tickets — grouped by status |
| `app/admin/tickets/[id]/page.tsx` | Server | Ticket detail — full thread view |
| `app/admin/tickets/[id]/AdminTicketReply.tsx` | Client | Staff reply form — posts reply and emails the client |
| `app/admin/blog/page.tsx` | Server | Blog CMS list — all posts with publish/unpublish/delete actions |
| `app/admin/blog/new/page.tsx` | Client | Create blog post — title, slug (auto-generated), content, category, tags, featured image, author, publish toggle |
| `app/admin/blog/[id]/page.tsx` | Client | Edit existing blog post |
| `app/admin/blog/BlogPostForm.tsx` | Client | Shared form component used by both new and edit pages |
| `app/admin/blog/BlogPostActions.tsx` | Client | Publish/unpublish/delete actions on blog list |
| `app/admin/slots/page.tsx` | Server | Availability manager — lawyer sees only their own slots |
| `app/admin/slots/SlotManager.tsx` | Client | Add single slot or bulk add Mon-Fri for N weeks. Shows booked slots with client name. |
| `app/admin/users/page.tsx` | Server | All users table — name, email, role badge, phone, join date, inline role changer. "+ Add New Lawyer" button. |
| `app/admin/users/UserRoleChanger.tsx` | Client | Inline role dropdown — calls `/api/admin/update-user-role` |
| `app/admin/users/new/page.tsx` | Client | Add New Lawyer form — First Name, Last Name, Email, Phone, Address, Gender, DOB, Qualification. Hides form after success. |

---

### API Routes (Backend)

All API routes are **server-side only**. They use `createAdminClient()` (service role) to bypass RLS for cross-user mutations.

| File | Method | What it does |
|------|--------|-------------|
| `app/api/admin/create-lawyer/route.ts` | POST | Creates Supabase auth user + profile (role=lawyer, Gender/DOB/Qualification). Sets random temp password. Generates recovery link via admin API. Sends welcome email via Resend. |
| `app/api/admin/open-case/route.ts` | POST | Checks for existing case_id on application (prevents duplicates). Creates case row (auto case number OSIS-YYYY-NNN). Adds "Case Opened" timeline event. Updates application: status=case_opened, case_id=new case id. |
| `app/api/admin/update-application/route.ts` | POST | Updates application status + lawyer notes. Sends email to client with new status. |
| `app/api/admin/update-appointment/route.ts` | POST | Updates appointment status + optional location + meeting_link. |
| `app/api/admin/update-user-role/route.ts` | POST | Admin changes any user's role. |
| `app/api/auth/forgot-password/route.ts` | POST | Generates password recovery link via `admin.auth.admin.generateLink()`. Sends via Resend. Does NOT use Supabase's built-in email (unreliable on free tier). Always returns 200 (doesn't reveal if email exists). |
| `app/api/email/route.ts` | POST | Central email dispatcher — handles 6 trigger types: application_submitted, application_status, ticket_reply, appointment_booked, appointment_confirmed, case_status. All use Resend. |
| `app/auth/callback/route.ts` | GET | OAuth redirect handler — exchanges code for session, reads role from profiles, redirects to /admin or /dashboard. |

---

### Shared Components

| File | Type | What it does |
|------|------|-------------|
| `components/Header.tsx` | Client | Public website header — nav, mega dropdown for Services, language toggle (EN/ES), Login/Sign Up or My Portal/Sign Out based on auth state. Mobile hamburger menu. |
| `components/Footer.tsx` | Server/Client | Public website footer |
| `components/PortalSidebar.tsx` | Client | Dashboard/Admin sidebar — shows role-appropriate nav links, user info, sign out button |
| `components/ServiceRedirect.tsx` | Client | Handles redirect to specific visa type after signup+login |

---

### Library Files

| File | What it does |
|------|-------------|
| `lib/supabase/server.ts` | Creates Supabase client for server components (anon key, respects RLS) |
| `lib/supabase/admin.ts` | Creates Supabase admin client (service role key, bypasses RLS) |
| `lib/supabase/client.ts` | Creates Supabase browser client (anon key, respects RLS) |
| `lib/email/resend.ts` | Email helper functions — one function per email type |
| `lib/questionnaire/index.ts` | Exports all 5 visa questionnaire definitions |
| `lib/questionnaire/types.ts` | TypeScript types: VisaQuestionnaire, Section, Field |
| `lib/questionnaire/h1b.ts` | H-1B questionnaire — 6 sections, 60+ fields |
| `lib/questionnaire/l1.ts` | L-1 questionnaire — 5 sections |
| `lib/questionnaire/green_card.ts` | Green Card questionnaire — 5 sections |
| `lib/questionnaire/k1.ts` | K-1 (Fiancé) questionnaire — 4 sections |
| `lib/questionnaire/family_petition.ts` | Family Petition questionnaire — 4 sections |

---

### CSS / Design Files (`public/design/`)

The design system is a custom CSS library (not Tailwind) called "Claude Design Premium":

| File | What it does |
|------|-------------|
| `styles.css` | Base reset, typography, color variables, layout containers |
| `components.css` | Buttons, cards, nav, header, footer, form elements |
| `additions.css` | Page-specific styles + critical fix: `.reveal { opacity: 1 !important; }` — NEVER REMOVE |
| `pages.css` | Homepage sections, hero, services grid, testimonials |
| `script.js` | Header scroll shadow, mobile menu, Services mega dropdown, language toggle (EN/ES). Has null guards for elements that don't exist on portal pages. |

**Portal styles** (dashboard + admin) are in `app/globals.css` — inline styles are used in JSX for component-level styling.

---

### Database Migrations (`supabase/migrations/`)

All must be run manually in Supabase SQL Editor. Run in order:

| File | What it creates |
|------|----------------|
| `001_initial_schema.sql` | profiles, cases, case_timeline, appointments, beneficiaries, contacts, documents, tickets, ticket_replies, blog_posts, newsletter_subscribers, loyalty_program. RLS policies. Storage buckets. Auth trigger (handle_new_user). |
| `002_applications.sql` | applications table with RLS |
| `003_slots.sql` | consultation_slots table |
| `004_blog_comments.sql` | blog_comments table with RLS (threaded comments) |
| `005_lawyer_profile_fields.sql` | gender, date_of_birth, qualification columns on profiles |
| `006_appointment_location.sql` | location, meeting_link columns on appointments |
| `007_appointment_lawyer_name.sql` | lawyer_name column on appointments |

---

## 8. Authentication Flow

```
User visits /dashboard or /admin
  ↓
middleware.ts intercepts request
  ↓
Checks session cookie (set by Supabase SSR)
  ↓
No session → redirect to /login
Session exists → allow through
  ↓
Page's Server Component calls supabase.auth.getUser()
  ↓
Reads profile.role from profiles table
  ↓
Wrong role (e.g. beneficiary on /admin) → redirect to /dashboard
```

### Google OAuth Flow
```
User clicks "Continue with Google"
  ↓
Supabase redirects to Google
  ↓
Google redirects back to /auth/callback?code=xxx
  ↓
callback route: exchangeCodeForSession(code)
  ↓
Reads role → redirects to /admin or /dashboard
```

### Lawyer Set-Password Flow
```
Admin creates lawyer via /admin/users/new
  ↓
API creates Supabase auth user (temp random password, email_confirm=true)
  ↓
API: admin.auth.admin.generateLink({ type: 'recovery' })
  ↓
Resend email → lawyer receives "Set My Password" button
  ↓
Lawyer clicks → Supabase redirects to /reset-password#access_token=xxx
  ↓
reset-password page: setSession({ access_token, refresh_token }) from URL hash
  ↓
updateUser({ password }) → password saved to lawyer's account
  ↓
Redirect to /login → lawyer logs in → auto-directed to /admin
```

---

## 9. Row Level Security (RLS) Strategy

Every table has RLS enabled. Key policies:

| Table | Who can read | Who can write |
|-------|-------------|---------------|
| profiles | Own row only | Own row only |
| cases | Own cases + lawyers/admins | Lawyers/admins via API |
| applications | Own applications + lawyers/admins | Own + lawyers via API |
| appointments | Own appointments + lawyers/admins | Own (booking) + lawyers via API |
| documents | Own documents + lawyers/admins | Own + lawyers |
| tickets / ticket_replies | Own + lawyers/admins | Own + lawyers |
| blog_posts | Anyone (published only) | Lawyers/admins |
| blog_comments | Anyone | Logged-in users (own) |
| consultation_slots | Anyone (available slots) | Lawyers (own slots) |

**Critical:** NEVER add "Lawyers see all profiles" policy — it creates a recursive loop that breaks login.

---

## 10. Email System

All emails go through **Resend** (resend.com). None go through Supabase's built-in email system (unreliable on free tier).

```
Trigger                     → Handler
─────────────────────────────────────
Application submitted       → POST /api/email { type: 'application_submitted' }
Application status changed  → POST /api/email { type: 'application_status' }
Ticket reply                → POST /api/email { type: 'ticket_reply' }
Appointment booked          → POST /api/email { type: 'appointment_booked' }
Appointment confirmed       → POST /api/email { type: 'appointment_confirmed' }
Case timeline updated       → POST /api/email { type: 'case_status' }
Lawyer welcome email        → POST /api/admin/create-lawyer (direct Resend call)
Password reset email        → POST /api/auth/forgot-password (direct Resend call)
```

Sender: `noreply@onestopimmigrationstation.com` (verified domain in Resend)

---

## 11. Code Flow Examples

### Example 1: Client books an appointment
```
/dashboard/appointments/book (Client Component)
  → useEffect: fetch available slots from consultation_slots
  → User picks date → load time slots for that date
  → User picks slot + adds notes → clicks Confirm
  → supabase.from('appointments').insert({ ... , lawyer_name })
  → supabase.from('consultation_slots').update({ is_booked: true })
  → fetch('/api/email', { type: 'appointment_booked' })
  → setSuccess(true) → shows confirmation screen
```

### Example 2: Lawyer opens a case from application
```
ApplicationActions.tsx (Client Component)
  → handleOpenCase() called on button click
  → fetch('/api/admin/open-case', { appId, visaType, clientUserId })
  
/api/admin/open-case/route.ts (API Route — server only)
  → Auth check: must be lawyer or admin
  → Check app.case_id — if exists, return early (prevent duplicate)
  → Generate case number OSIS-YYYY-NNN
  → admin.from('cases').insert({ ... })
  → admin.from('case_timeline').insert({ event: 'Case Opened' })
  → admin.from('applications').update({ status: 'case_opened', case_id })
  → return { caseId, caseNumber }
  
ApplicationActions.tsx
  → setCaseId(data.caseId) → UI updates to show "View in Cases →"
  → router.refresh() → page re-fetches, status badge updates
```

### Example 3: Admin resets password for user
```
/forgot-password (Client Component)
  → handleSubmit: fetch('/api/auth/forgot-password', { email })

/api/auth/forgot-password/route.ts (API Route)
  → admin.auth.admin.generateLink({ type: 'recovery', email, redirectTo: '/reset-password' })
  → fetch('https://api.resend.com/emails', { html: email with resetLink button })
  → return { ok: true }  ← always 200, never reveals if email exists

/reset-password (Client Component)
  → parse access_token + refresh_token from URL hash
  → supabase.auth.setSession({ access_token, refresh_token })
  → shows password form
  → supabase.auth.updateUser({ password })
  → redirect to /login
```

---

## 12. Design Patterns Used

### Server Component + Client Component split
Pages that need data → Server Component (no JS sent to browser for the data fetch)
Pages that need interactivity → 'use client' Client Component

### Admin API pattern for cross-user mutations
When a lawyer needs to update another user's data (which RLS would block), it goes through `/api/admin/*` which uses the service role key server-side.

### Questionnaire engine
Each visa type has a definition file (`lib/questionnaire/h1b.ts` etc.) that describes sections and fields declaratively. The engine (`dashboard/apply/[visaType]/page.tsx`) renders any questionnaire from its definition, handles save-and-resume via Supabase, and validates completion.

---

## 13. React Native Mobile App — Web vs Mobile Comparison

### What's the same (can be shared)
| Item | Shareability | Notes |
|------|-------------|-------|
| Supabase client logic | ✅ High | Same `@supabase/supabase-js` package, same queries |
| Business logic | ✅ High | Auth flow, data fetching, API calls — all reusable |
| TypeScript types | ✅ High | Questionnaire types, profile types — fully reusable |
| Questionnaire definitions | ✅ High | Same `lib/questionnaire/` files work in React Native |
| Email API calls | ✅ High | Same `fetch('/api/email')` calls work |
| Environment variables | ✅ High | Same Supabase URL + keys |

### What must be completely rewritten
| Item | Effort | Why |
|------|--------|-----|
| All JSX/HTML | 🔴 Full redo | React Native uses `<View>`, `<Text>`, `<TouchableOpacity>` — no HTML tags |
| All CSS styling | 🔴 Full redo | React Native uses StyleSheet API — no CSS files |
| Navigation | 🔴 Full redo | React Navigation replaces Next.js router |
| File uploads | 🔴 Full redo | Expo DocumentPicker/ImagePicker instead of HTML `<input type="file">` |
| PDF viewing | 🔴 Full redo | Expo WebBrowser or react-native-pdf |
| Google OAuth | 🟡 Partial | `expo-auth-session` instead of Supabase's web OAuth |
| Push notifications | 🔴 New feature | Expo Notifications (not in web app at all) |
| Storage/caching | 🔴 New feature | AsyncStorage for offline support |

### Honest assessment
**It is NOT a total redo of logic — but it IS a total redo of UI.**

Think of it this way:
- ~40% of the code (data fetching, business logic, types) can be lifted directly or with minor changes
- ~60% (all UI components, navigation, styling) must be rebuilt from scratch for native

The recommended approach when we start mobile:
1. Move shared logic into `packages/shared/` in the monorepo
2. Build mobile screens that import from `packages/shared/` for their data layer
3. Build all UI components fresh using React Native primitives

### Screens needed for mobile (maps to web pages)
| Mobile Screen | Web Equivalent |
|--------------|---------------|
| Login | /login |
| Signup | /signup |
| Dashboard Home | /dashboard |
| My Cases | /dashboard/cases |
| Case Detail | /dashboard/cases/[id] |
| Appointments | /dashboard/appointments |
| Book Appointment | /dashboard/appointments/book |
| Documents | /dashboard/documents |
| Support Tickets | /dashboard/tickets |
| Profile | /dashboard/profile |
| Apply (questionnaire) | /dashboard/apply/[visaType] |
| Notifications | (new — bell icon) |

Admin portal on mobile is lower priority — lawyers will primarily use the web admin panel on desktop.

---

## 14. How to Start a New Dev Session

1. Read `TODO.md` — what's left to build
2. Read `ISSUES.md` — known bugs and workarounds  
3. Read `SETUP.md` — full setup history and credentials
4. Read memory file at `C:\Users\subho\.claude\projects\C--Users-subho\memory\project_immigration_webapp.md`
5. Start dev server: `cd apps/web && npm run dev`
6. Test on: `http://localhost:3000`
7. Push to GitHub → Vercel auto-deploys to: `https://onestop-immigrationstation-web.vercel.app`

---

## 15. Common Gotchas

| Gotcha | Detail |
|--------|--------|
| NEVER add "Lawyers see all profiles" RLS | Recursive — breaks login for everyone |
| Admin pages need `createAdminClient()` | Not `createClient()` — RLS will block data reads |
| Lawyer mutations use `/api/admin/*` | RLS blocks cross-user writes from client |
| Supabase OTP tokens are single-use | If recovery link is clicked once (even if page broke), it's consumed — need new link |
| Run dev from `apps/web/` | Not repo root — root has no `dev` script |
| Restart dev server after `.env.local` changes | Next.js doesn't hot-reload env vars |
| Chrome extension errors in dev overlay | `oihbmmeelledioenpfcfehdjhdnlfibj` — not our code, ignore |
| `.reveal { opacity: 1 !important }` in additions.css | NEVER REMOVE — breaks public page animations |
| SQL migrations run manually | Supabase doesn't auto-run migration files — paste into SQL Editor |
| `NEXT_PUBLIC_SITE_URL` must match environment | localhost:3000 for dev, live URL in Vercel env vars |
