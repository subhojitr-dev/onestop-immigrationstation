# One Stop Immigration Station — Setup Guide

This document tracks every setup step completed for the project.
Use this to resume work after a break or in a new session.

---

## Project Overview

**Goal:** Replace the existing PHP/Angular/WordPress app with a modern stack:
- Next.js 16 website (public + client portal)
- React Native mobile app (iOS + Android)
- Supabase backend (database, auth, storage, edge functions)

**Live URL:** https://onestop-immigrationstation-web.vercel.app
**GitHub:** https://github.com/subhojitr-dev/onestop-immigrationstation
**Supabase:** https://xrhmnyyrufahqaintmvt.supabase.co
**Vercel:** vercel.com → subhojitr-dev's projects → onestop-immigrationstation-web

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo |
| Frontend | Next.js 16 (Turbopack) |
| Mobile | React Native + Expo (not yet started) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + Google OAuth) |
| Storage | Supabase Storage |
| Hosting | Vercel (free hobby plan) |
| Language | TypeScript |
| Styling | Claude Design CSS (served as static files) |

---

## Step 1 — GitHub Repository

**Status: ✅ Complete**

- Created GitHub repo: `subhojitr-dev/onestop-immigrationstation`
- Initialized Turborepo monorepo structure
- Main branch: `main`
- Local path: `C:\Users\subho\onestop-immigrationstation`

---

## Step 2 — Monorepo Structure

**Status: ✅ Complete**

```
onestop-immigrationstation/
├── apps/
│   └── web/                    ← Next.js app
│       ├── app/                ← App Router pages
│       ├── components/         ← Header, Footer components
│       ├── lib/supabase/       ← Supabase client + server
│       ├── public/design/      ← Claude Design CSS + JS assets
│       └── middleware.ts       ← Auth route protection
├── packages/                   ← Shared code (future)
├── supabase/
│   └── migrations/             ← Database schema SQL
└── package.json                ← Turborepo config
```

---

## Step 3 — Supabase Setup

**Status: ✅ Complete**

**Project:** `xrhmnyyrufahqaintmvt.supabase.co`

**Environment Variables** (set in Vercel + local .env.local):
```
NEXT_PUBLIC_SUPABASE_URL=https://xrhmnyyrufahqaintmvt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_H2HNWNkpsWmcqNZrVYIHLg_ZQufiUXg
```

**Tables created (14):**
- `profiles` — extends auth.users, stores role (sponsor/beneficiary/contact/admin)
- `cases` — immigration cases with status tracking
- `case_timeline` — events/milestones per case
- `appointments` — consultations (2 free per user)
- `dependents` — family members on a case
- `beneficiaries` — individuals sponsored by a sponsor
- `contacts` — HR contacts at sponsor companies
- `documents` — uploaded files per case
- `support_tickets` — client support requests
- `ticket_replies` — replies to support tickets
- `blog_posts` — CMS for blog content
- `newsletter_subscribers` — email list
- `consultation_slots` — available appointment times
- `loyalty_program` — sponsor loyalty tracking

**Row Level Security:** Enabled on all tables
**Storage Buckets:** Created for documents, profile pics, case files

**Supabase client files:**
- `apps/web/lib/supabase/client.ts` — browser client
- `apps/web/lib/supabase/server.ts` — server component client

---

## Step 4 — Design Integration

**Status: ✅ Complete**

**Source files:**
- Original HTML handoff: `C:\Users\subho\immigration-webapp\`
- Revised HTML handoff: `C:\Users\subho\Downloads\revised-design\design_handoff_immigration_site\`

**CSS files** (copied to `apps/web/public/design/`):
- `styles.css` — base styles
- `components.css` — component styles (header, footer, cards, etc.)
- `additions.css` — improvements + reveal animation fix
- `pages.css` — page-specific styles
- `script.js` — navigation, visa grid, language toggle, animations

**Critical fix applied:**
Added to `additions.css`:
```css
.reveal { opacity: 1 !important; transform: none !important; }
```
Without this, all middle-page content is invisible (JS loads too late in Next.js).

**CSS loaded in:** `apps/web/app/layout.tsx` via `<link>` tags
**Script loaded in:** `apps/web/app/layout.tsx` via `<Script strategy="afterInteractive">`

**Also fixed:**
- `script.js`: `liberty.png` → `/liberty.png` (absolute path for all routes)
- Homepage images: added `has-img` class so images show without JS onload handler
- `layout.tsx`: added `import "./globals.css"` so global overrides load

---

## Step 5 — Next.js Pages

**Status: ✅ Complete — all 6 pages live**

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage — hero, about, services, visa categories, blog, testimonials |
| `/blog` | `app/blog/page.tsx` | 5 articles + sidebar with categories/archives |
| `/success-stories` | `app/success-stories/page.tsx` | 6 testimonials + coming soon section |
| `/videos` | `app/videos/page.tsx` | 6 video cards + coming soon banner |
| `/press-media` | `app/press-media/page.tsx` | 6 press items + media contact banner |
| `/contact` | `app/contact/page.tsx` | Contact form with React state + office info |

**Note:** Each page includes its own full header/footer HTML (not shared components)
because each page activates a different nav item. The homepage uses
`<Header>` and `<Footer>` components.

---

## Step 6 — Vercel Deployment

**Status: ✅ Complete**

**Steps taken:**
1. Went to vercel.com → signed in with GitHub
2. Clicked Import Project → selected `onestop-immigrationstation`
3. Set Root Directory: `apps/web`
4. Framework: Next.js (auto-detected)
5. Added Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Clicked Deploy

**Live URL:** https://onestop-immigrationstation-web.vercel.app

**Auto-deploy:** Every push to `main` branch triggers a new Vercel deployment automatically.

---

## Step 7 — Authentication

**Status: ✅ Complete**

### 7a — Auth Pages Built

| Route | File | Description |
|-------|------|-------------|
| `/login` | `app/login/page.tsx` | Email+password + Google OAuth button |
| `/signup` | `app/signup/page.tsx` | 2-step: role selection → details form |
| `/dashboard` | `app/dashboard/page.tsx` | Protected portal with sidebar, cases, appointments |
| `/auth/callback` | `app/auth/callback/route.ts` | OAuth redirect handler |

### 7b — Route Protection
`apps/web/middleware.ts` protects:
- `/dashboard/*` — redirects to `/login` if not authenticated
- `/login` + `/signup` — redirects to `/dashboard` if already logged in

### 7c — User Roles
Based on existing PHP system (4 roles):
| Role | Description |
|------|-------------|
| `sponsor` | Employer/business sponsoring visa |
| `beneficiary` | Individual applying for visa |
| `contact` | HR contact at sponsor company |
| `lawyer` | Attorney managing cases |

Stored in `profiles.role` column. Dashboard sidebar shows/hides features by role.

### 7d — Google OAuth Setup

**Google Cloud:**
- Project: `OnestopImmigration` (ID: `onestopimmigration`)
- OAuth Client ID: `190174754485-tukdav2fj92k91v393ub1g88ordoh2gq.apps.googleusercontent.com`
- Authorized JS Origin: `https://onestop-immigrationstation-web.vercel.app`
- Authorized Redirect URI: `https://xrhmnyyrufahqaintmvt.supabase.co/auth/v1/callback`

**Supabase:**
- Authentication → Sign In/Providers → Google → ENABLED ✅
- Client ID and Secret saved

---

## Step 8 — Dashboard Sub-Pages

**Status: ⬜ Not started**

Pages to build:
- `/dashboard/cases` — list of all cases with filters
- `/dashboard/cases/[id]` — case detail with timeline
- `/dashboard/appointments` — book + view appointments
- `/dashboard/documents` — upload + view documents
- `/dashboard/beneficiaries` — sponsor only: manage beneficiaries
- `/dashboard/profile` — edit profile

---

## Step 9 — React Native Mobile App

**Status: ⬜ Not started**

Plan:
- Expo setup in `apps/mobile/`
- Shared TypeScript types from `packages/`
- Same Supabase backend
- Screens mirror the web dashboard

---

## Step 10 — Custom Domain

**Status: ⬜ Not started**

Domain: `onestopimmigrationstation.com`

Steps when ready:
1. Vercel dashboard → project → Settings → Domains
2. Add `onestopimmigrationstation.com`
3. Update DNS at domain registrar:
   - A record → 76.76.21.21
   - CNAME www → cname.vercel-dns.com

---

## Existing Codebase (for reference)

**PHP Backend:** `C:\Users\subho\xampp\htdocs\mylegalweb\mylegal-web\`
- API endpoints: `/api/v1/*.php`
- Angular/Ionic app pages: `C:\Users\subho\xampp\htdocs\mylegal\src\pages\`
- Database: MySQL (`mylegali_my_legail`)
- **Issues with old system:** MD5 passwords, raw SQL injection vulnerabilities, WordPress mixed in

**Key API endpoints in old system:**
- `user-login.php` — checks sponsor, beneficiary, lawyer, contact tables
- `user-sponsor-registration.php` — sponsor signup
- `user-beneficiary-registration.php` — beneficiary signup
- `all-cases.php`, `case-details.php` — case management
- `add-book-slot.php` — appointment booking
- `add-new-ticket.php` — support tickets

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                     USERS                                │
│      Clients  │  Attorneys  │  Sponsors  │  Admin        │
└────────┬──────┴──────┬──────┴─────┬──────┴──────────────┘
         │             │            │
         ▼             ▼            ▼
┌────────────────┐  ┌─────────────────────────────────────┐
│  React Native  │  │          Next.js Website            │
│  Mobile App    │  │                                     │
│  (Expo)        │  │  PUBLIC          PORTAL             │
│  iOS + Android │  │  /               /dashboard         │
│  NOT STARTED   │  │  /blog           /cases             │
└───────┬────────┘  │  /contact        /documents         │
        │           │  /videos         /appointments      │
        │           └──────────────┬──────────────────────┘
        │                          │
        └──────────┬───────────────┘
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
│  PostgreSQL DB │ Auth (email+Google) │ Storage │ Edge Fn │
└──────────────────────────────────────────────────────────┘
```

---

## Common Commands

```bash
# Start local dev server
cd C:\Users\subho\onestop-immigrationstation\apps\web
npm run dev
# → http://localhost:3000

# Commit and push (triggers Vercel redeploy)
cd C:\Users\subho\onestop-immigrationstation
git add -A
git commit -m "your message"
git push
```

---

## Known Issues / Gotchas

1. **`.reveal` CSS class** — hides content until JS fires. Fixed by adding `opacity: 1 !important` to `additions.css`. Do NOT remove this line.
2. **`liberty.png`** — must use absolute path `/liberty.png` in script.js, not relative `liberty.png`
3. **`globals.css`** — must be imported in `layout.tsx` with `import "./globals.css"` or it won't load
4. **Images** — use `className="ph has-img"` on image containers, not just `ph`, otherwise images stay hidden
5. **Port conflict** — if `npm run dev` fails, run `taskkill /PID <pid> /F` to kill existing server on port 3000
6. **Next.js version** — this is Next.js 16 with Turbopack, some APIs differ from older versions
